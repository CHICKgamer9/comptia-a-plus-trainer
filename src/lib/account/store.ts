import { emptyProgress, parseProgress, type ProgressState } from "@/lib/progress";
import { ownedProfile, publicProfile } from "./authz";
import { guestProgressForSave } from "./guest";
import { clampSeats, seatLimitForPlan } from "./plans";
import {
  isPlan,
  MAX_PROFILES,
  PROFILE_AVATARS,
  type AccountRecord,
  type ClerkIdentity,
  type Plan,
  type ProfilePublic,
} from "./types";

export class StoreUnavailableError extends Error {
  constructor(message = "Database is not configured") {
    super(message);
    this.name = "StoreUnavailableError";
  }
}

export class SeatLimitError extends Error {
  constructor(message = "Seat limit reached") {
    super(message);
    this.name = "SeatLimitError";
  }
}

export interface AccountStore {
  getOrCreateAccount(identity: ClerkIdentity): Promise<AccountRecord>;
  getAccount(accountId: string): Promise<AccountRecord | null>;
  updateAccount(
    accountId: string,
    input: { plan?: Plan; seatLimit?: number; stripeCustomerId?: string | null },
  ): Promise<AccountRecord | null>;
  listProfiles(accountId: string): Promise<ProfilePublic[]>;
  getProfile(accountId: string, profileId: string): Promise<ProfilePublic | null>;
  createProfile(
    accountId: string,
    input: { displayName: string; avatar?: string; progress?: ProgressState },
  ): Promise<ProfilePublic>;
  updateProfile(
    accountId: string,
    profileId: string,
    input: { displayName?: string; avatar?: string },
  ): Promise<ProfilePublic | null>;
  deleteProfile(accountId: string, profileId: string): Promise<boolean>;
  getProgress(accountId: string, profileId: string): Promise<ProgressState | null>;
  saveProgress(
    accountId: string,
    profileId: string,
    progress: ProgressState,
  ): Promise<ProgressState | null>;
  migrateGuest(
    accountId: string,
    input: {
      progress: ProgressState;
      displayName?: string;
      avatar?: string;
      targetProfileId?: string;
    },
  ): Promise<ProfilePublic>;
}

export interface ProfileRow extends ProfilePublic {
  progress: ProgressState;
}

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

export function sanitizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name || name.length > 32) return null;
  return name;
}

export function sanitizeAvatar(raw: unknown): string {
  if (typeof raw !== "string") return PROFILE_AVATARS[0];
  const value = raw.trim();
  if (PROFILE_AVATARS.includes(value as (typeof PROFILE_AVATARS)[number])) return value;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if ([...value].length === 1 || [...value].length === 2) return value;
  return PROFILE_AVATARS[0];
}

export function toAccountRecord(row: {
  id: string;
  clerkUserId: string;
  email: string;
  plan: string;
  seatLimit: number;
  stripeCustomerId: string | null;
  createdAt: string;
}): AccountRecord {
  const plan: Plan = isPlan(row.plan) ? row.plan : "free";
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    plan,
    seatLimit: clampSeats(row.seatLimit || seatLimitForPlan(plan)),
    stripeCustomerId: row.stripeCustomerId,
    createdAt: row.createdAt,
  };
}

function createMemoryStore(): AccountStore {
  const accounts = new Map<string, AccountRecord>();
  const byClerk = new Map<string, string>();
  const profiles = new Map<string, ProfileRow>();

  function ownedRow(accountId: string, profileId: string) {
    return ownedProfile(profiles.get(profileId), accountId);
  }

  return {
    async getOrCreateAccount(identity) {
      const existingId = byClerk.get(identity.clerkUserId);
      if (existingId) {
        const current = accounts.get(existingId);
        if (current) {
          if (identity.email && current.email !== identity.email) {
            current.email = identity.email;
          }
          return current;
        }
      }
      const account = toAccountRecord({
        id: newId(),
        clerkUserId: identity.clerkUserId,
        email: identity.email || "unknown@ticketbench.local",
        plan: "free",
        seatLimit: seatLimitForPlan("free"),
        stripeCustomerId: null,
        createdAt: nowIso(),
      });
      accounts.set(account.id, account);
      byClerk.set(account.clerkUserId, account.id);
      return account;
    },

    async getAccount(accountId) {
      return accounts.get(accountId) ?? null;
    },

    async updateAccount(accountId, input) {
      const current = accounts.get(accountId);
      if (!current) return null;
      if (input.plan) {
        current.plan = input.plan;
        current.seatLimit = input.seatLimit ?? seatLimitForPlan(input.plan);
      }
      if (input.seatLimit !== undefined) current.seatLimit = clampSeats(input.seatLimit);
      if (input.stripeCustomerId !== undefined) current.stripeCustomerId = input.stripeCustomerId;
      return current;
    },

    async listProfiles(accountId) {
      return [...profiles.values()]
        .filter((row) => row.accountId === accountId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map(publicProfile);
    },

    async getProfile(accountId, profileId) {
      const row = ownedRow(accountId, profileId);
      return row ? publicProfile(row) : null;
    },

    async createProfile(accountId, input) {
      const account = accounts.get(accountId);
      if (!account) throw new Error("Account not found");
      const existing = await this.listProfiles(accountId);
      if (existing.length >= Math.min(account.seatLimit, MAX_PROFILES)) {
        throw new SeatLimitError();
      }
      const name = sanitizeDisplayName(input.displayName);
      if (!name) throw new Error("Display name required");
      const row: ProfileRow = {
        id: newId(),
        accountId,
        displayName: name,
        avatar: sanitizeAvatar(input.avatar),
        createdAt: nowIso(),
        lastActiveAt: nowIso(),
        progress: input.progress ? guestProgressForSave(input.progress) : emptyProgress(),
      };
      profiles.set(row.id, row);
      return publicProfile(row);
    },

    async updateProfile(accountId, profileId, input) {
      const row = ownedRow(accountId, profileId);
      if (!row) return null;
      if (input.displayName !== undefined) {
        const name = sanitizeDisplayName(input.displayName);
        if (!name) throw new Error("Display name required");
        row.displayName = name;
      }
      if (input.avatar !== undefined) row.avatar = sanitizeAvatar(input.avatar);
      return publicProfile(row);
    },

    async deleteProfile(accountId, profileId) {
      const row = ownedRow(accountId, profileId);
      if (!row) return false;
      profiles.delete(profileId);
      return true;
    },

    async getProgress(accountId, profileId) {
      const row = ownedRow(accountId, profileId);
      if (!row) return null;
      return parseProgress(JSON.stringify(row.progress));
    },

    async saveProgress(accountId, profileId, progress) {
      const row = ownedRow(accountId, profileId);
      if (!row) return null;
      row.progress = parseProgress(JSON.stringify(progress));
      row.lastActiveAt = nowIso();
      return parseProgress(JSON.stringify(row.progress));
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

let memory: AccountStore | undefined;
let override: AccountStore | undefined;

export function createAccountMemoryStore(): AccountStore {
  return createMemoryStore();
}

export function setAccountStoreForTests(store?: AccountStore) {
  override = store;
}

export function getMemoryAccountStore(): AccountStore {
  if (!memory) memory = createMemoryStore();
  return memory;
}

export async function getAccountStore(): Promise<AccountStore> {
  if (override) return override;
  if (process.env.DATABASE_URL) {
    const { getPgAccountStore } = await import("./pg-store");
    return getPgAccountStore();
  }
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return getMemoryAccountStore();
  }
  throw new StoreUnavailableError();
}
