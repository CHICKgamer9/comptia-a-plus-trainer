import { eq, and, asc } from "drizzle-orm";
import { emptyProgress, parseProgress, type ProgressState } from "@/lib/progress";
import { accounts, profiles } from "@/lib/db/schema";
import { getDb } from "@/lib/db";
import { ownedProfile, publicProfile } from "./authz";
import { guestProgressForSave } from "./guest";
import { MAX_PROFILES } from "./types";
import {
  sanitizeAvatar,
  sanitizeDisplayName,
  SeatLimitError,
  toAccountRecord,
  type AccountStore,
} from "./store";
import { clampSeats, seatLimitForPlan } from "./plans";

let ensured = false;

async function ensureSchema() {
  if (ensured) return;
  const { sql } = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id text PRIMARY KEY,
      clerk_user_id text NOT NULL UNIQUE,
      email text NOT NULL,
      plan text NOT NULL DEFAULT 'free',
      seat_limit integer NOT NULL DEFAULT 1,
      stripe_customer_id text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id text PRIMARY KEY,
      account_id text NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      display_name text NOT NULL,
      avatar text NOT NULL DEFAULT '🛠️',
      created_at timestamptz NOT NULL DEFAULT now(),
      last_active_at timestamptz NOT NULL DEFAULT now(),
      progress jsonb NOT NULL DEFAULT '{}'::jsonb
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS profiles_account_id_idx ON profiles (account_id)`;
  ensured = true;
}

function newId() {
  return crypto.randomUUID();
}

export function getPgAccountStore(): AccountStore {
  return {
    async getOrCreateAccount(identity) {
      await ensureSchema();
      const { db } = getDb();
      const existing = await db
        .select()
        .from(accounts)
        .where(eq(accounts.clerkUserId, identity.clerkUserId))
        .limit(1);
      if (existing[0]) {
        const current = toAccountRecord(existing[0]);
        if (identity.email && current.email !== identity.email) {
          await db
            .update(accounts)
            .set({ email: identity.email })
            .where(eq(accounts.id, current.id));
          return { ...current, email: identity.email };
        }
        return current;
      }
      const row = {
        id: newId(),
        clerkUserId: identity.clerkUserId,
        email: identity.email || "unknown@ticketbench.local",
        plan: "free" as const,
        seatLimit: seatLimitForPlan("free"),
        stripeCustomerId: null,
      };
      const inserted = await db.insert(accounts).values(row).returning();
      return toAccountRecord(inserted[0]);
    },

    async getAccount(accountId) {
      await ensureSchema();
      const { db } = getDb();
      const rows = await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1);
      return rows[0] ? toAccountRecord(rows[0]) : null;
    },

    async updateAccount(accountId, input) {
      await ensureSchema();
      const current = await this.getAccount(accountId);
      if (!current) return null;
      const plan = input.plan ?? current.plan;
      const seatLimit = clampSeats(
        input.seatLimit ?? (input.plan ? seatLimitForPlan(input.plan) : current.seatLimit),
      );
      const { db } = getDb();
      const updated = await db
        .update(accounts)
        .set({
          plan,
          seatLimit,
          stripeCustomerId:
            input.stripeCustomerId !== undefined ? input.stripeCustomerId : current.stripeCustomerId,
        })
        .where(eq(accounts.id, accountId))
        .returning();
      return updated[0] ? toAccountRecord(updated[0]) : null;
    },

    async listProfiles(accountId) {
      await ensureSchema();
      const { db } = getDb();
      const rows = await db
        .select({
          id: profiles.id,
          accountId: profiles.accountId,
          displayName: profiles.displayName,
          avatar: profiles.avatar,
          createdAt: profiles.createdAt,
          lastActiveAt: profiles.lastActiveAt,
        })
        .from(profiles)
        .where(eq(profiles.accountId, accountId))
        .orderBy(asc(profiles.createdAt));
      return rows.map(publicProfile);
    },

    async getProfile(accountId, profileId) {
      await ensureSchema();
      const { db } = getDb();
      const rows = await db
        .select({
          id: profiles.id,
          accountId: profiles.accountId,
          displayName: profiles.displayName,
          avatar: profiles.avatar,
          createdAt: profiles.createdAt,
          lastActiveAt: profiles.lastActiveAt,
        })
        .from(profiles)
        .where(and(eq(profiles.id, profileId), eq(profiles.accountId, accountId)))
        .limit(1);
      const owned = ownedProfile(rows[0], accountId);
      return owned ? publicProfile(owned) : null;
    },

    async createProfile(accountId, input) {
      await ensureSchema();
      const { db } = getDb();
      const accountRows = await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1);
      const account = accountRows[0] ? toAccountRecord(accountRows[0]) : null;
      if (!account) throw new Error("Account not found");
      const existing = await this.listProfiles(accountId);
      if (existing.length >= Math.min(account.seatLimit, MAX_PROFILES)) {
        throw new SeatLimitError();
      }
      const name = sanitizeDisplayName(input.displayName);
      if (!name) throw new Error("Display name required");
      const inserted = await db
        .insert(profiles)
        .values({
          id: newId(),
          accountId,
          displayName: name,
          avatar: sanitizeAvatar(input.avatar),
          progress: input.progress ? guestProgressForSave(input.progress) : emptyProgress(),
        })
        .returning({
          id: profiles.id,
          accountId: profiles.accountId,
          displayName: profiles.displayName,
          avatar: profiles.avatar,
          createdAt: profiles.createdAt,
          lastActiveAt: profiles.lastActiveAt,
        });
      return publicProfile(inserted[0]);
    },

    async updateProfile(accountId, profileId, input) {
      await ensureSchema();
      const current = await this.getProfile(accountId, profileId);
      if (!current) return null;
      const patch: { displayName?: string; avatar?: string } = {};
      if (input.displayName !== undefined) {
        const name = sanitizeDisplayName(input.displayName);
        if (!name) throw new Error("Display name required");
        patch.displayName = name;
      }
      if (input.avatar !== undefined) patch.avatar = sanitizeAvatar(input.avatar);
      const { db } = getDb();
      const updated = await db
        .update(profiles)
        .set(patch)
        .where(and(eq(profiles.id, profileId), eq(profiles.accountId, accountId)))
        .returning({
          id: profiles.id,
          accountId: profiles.accountId,
          displayName: profiles.displayName,
          avatar: profiles.avatar,
          createdAt: profiles.createdAt,
          lastActiveAt: profiles.lastActiveAt,
        });
      return updated[0] ? publicProfile(updated[0]) : null;
    },

    async deleteProfile(accountId, profileId) {
      await ensureSchema();
      const { db } = getDb();
      const deleted = await db
        .delete(profiles)
        .where(and(eq(profiles.id, profileId), eq(profiles.accountId, accountId)))
        .returning({ id: profiles.id });
      return deleted.length > 0;
    },

    async getProgress(accountId, profileId) {
      await ensureSchema();
      const { db } = getDb();
      const rows = await db
        .select({ accountId: profiles.accountId, progress: profiles.progress })
        .from(profiles)
        .where(and(eq(profiles.id, profileId), eq(profiles.accountId, accountId)))
        .limit(1);
      const owned = ownedProfile(rows[0], accountId);
      if (!owned) return null;
      return parseProgress(JSON.stringify(owned.progress ?? {}));
    },

    async saveProgress(accountId, profileId, progress) {
      await ensureSchema();
      const current = await this.getProfile(accountId, profileId);
      if (!current) return null;
      const next = parseProgress(JSON.stringify(progress));
      const { db } = getDb();
      await db
        .update(profiles)
        .set({ progress: next, lastActiveAt: new Date().toISOString() })
        .where(and(eq(profiles.id, profileId), eq(profiles.accountId, accountId)));
      return next;
    },

    async migrateGuest(accountId, input) {
      const progress = guestProgressForSave(input.progress);
      if (input.targetProfileId) {
        const saved = await this.saveProgress(accountId, input.targetProfileId, progress);
        const profile = await this.getProfile(accountId, input.targetProfileId);
        if (!saved || !profile) throw new Error("Profile not found");
        if (input.displayName || input.avatar) {
          return (
            (await this.updateProfile(accountId, input.targetProfileId, {
              displayName: input.displayName,
              avatar: input.avatar,
            })) ?? profile
          );
        }
        return profile;
      }
      return this.createProfile(accountId, {
        displayName: input.displayName ?? "Learner",
        avatar: input.avatar,
        progress,
      });
    },
  };
}

export type { ProgressState };
