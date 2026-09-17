import { emptyProgress, parseProgress, type ProgressState } from "@/lib/progress";
import { guestProgressForSave } from "./guest";
import { planLabel } from "./plans";
import { getClerkIdentity } from "./session";
import {
  getAccountStore,
  sanitizeAvatar,
  sanitizeDisplayName,
  SeatLimitError,
  StoreUnavailableError,
} from "./store";
import type { AccountRecord, ProfilePublic } from "./types";

export const ACTIVE_PROFILE_COOKIE = "tb-active-profile";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function storeError(error: unknown) {
  if (error instanceof StoreUnavailableError) {
    return json(
      {
        error:
          "Profiles need DATABASE_URL (Neon). Guest Start Here still works on this device.",
      },
      503,
    );
  }
  if (error instanceof SeatLimitError) {
    return json({ error: "This account is at its seat limit." }, 403);
  }
  if (error instanceof Error && error.message === "Display name required") {
    return json({ error: error.message }, 400);
  }
  if (error instanceof Error && error.message === "Profile not found") {
    return json({ error: "Not found" }, 404);
  }
  throw error;
}

export async function requireAccount(): Promise<
  { ok: true; account: AccountRecord } | { ok: false; response: Response }
> {
  const identity = await getClerkIdentity();
  if (!identity) return { ok: false, response: json({ error: "Unauthorized" }, 401) };
  try {
    const store = await getAccountStore();
    const account = await store.getOrCreateAccount(identity);
    return { ok: true, account };
  } catch (error) {
    return { ok: false, response: storeError(error) };
  }
}

export async function handleGetAccount() {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  try {
    const store = await getAccountStore();
    const profiles = await store.listProfiles(authz.account.id);
    return json({
      account: {
        id: authz.account.id,
        email: authz.account.email,
        plan: authz.account.plan,
        planLabel: planLabel(authz.account.plan),
        seatLimit: authz.account.seatLimit,
        stripeCustomerId: authz.account.stripeCustomerId,
        createdAt: authz.account.createdAt,
      },
      profiles,
    });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleListProfiles() {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  try {
    const store = await getAccountStore();
    const profiles = await store.listProfiles(authz.account.id);
    return json({ profiles });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleCreateProfile(request: Request) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  const body = await readJson(request);
  const displayName = sanitizeDisplayName(body.displayName);
  if (!displayName) return json({ error: "Display name required" }, 400);
  try {
    const store = await getAccountStore();
    const profile = await store.createProfile(authz.account.id, {
      displayName,
      avatar: sanitizeAvatar(body.avatar),
      progress: asProgress(body.progress),
    });
    return json({ profile }, 201);
  } catch (error) {
    return storeError(error);
  }
}

export async function handleGetProfile(profileId: string) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  try {
    const store = await getAccountStore();
    const profile = await store.getProfile(authz.account.id, profileId);
    if (!profile) return json({ error: "Not found" }, 404);
    return json({ profile });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleUpdateProfile(profileId: string, request: Request) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  const body = await readJson(request);
  try {
    const store = await getAccountStore();
    const profile = await store.updateProfile(authz.account.id, profileId, {
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      avatar: typeof body.avatar === "string" ? body.avatar : undefined,
    });
    if (!profile) return json({ error: "Not found" }, 404);
    return json({ profile });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleDeleteProfile(profileId: string) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  try {
    const store = await getAccountStore();
    const deleted = await store.deleteProfile(authz.account.id, profileId);
    if (!deleted) return json({ error: "Not found" }, 404);
    return json({ ok: true });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleGetProfileProgress(profileId: string) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  try {
    const store = await getAccountStore();
    const progress = await store.getProgress(authz.account.id, profileId);
    if (!progress) return json({ error: "Not found" }, 404);
    return json({ progress });
  } catch (error) {
    return storeError(error);
  }
}

export async function handlePutProfileProgress(profileId: string, request: Request) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  const body = await readJson(request);
  const progress = asProgress(body.progress);
  if (!progress) return json({ error: "Progress required" }, 400);
  try {
    const store = await getAccountStore();
    const saved = await store.saveProgress(authz.account.id, profileId, progress);
    if (!saved) return json({ error: "Not found" }, 404);
    return json({ progress: saved });
  } catch (error) {
    return storeError(error);
  }
}

export async function handleMigrateGuest(request: Request) {
  const authz = await requireAccount();
  if (!authz.ok) return authz.response;
  const body = await readJson(request);
  const progress = asProgress(body.progress) ?? emptyProgress();
  try {
    const store = await getAccountStore();
    const profile = await store.migrateGuest(authz.account.id, {
      progress: guestProgressForSave(progress),
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      avatar: typeof body.avatar === "string" ? body.avatar : undefined,
      targetProfileId: typeof body.targetProfileId === "string" ? body.targetProfileId : undefined,
    });
    return json({ profile }, 201);
  } catch (error) {
    return storeError(error);
  }
}

export function profilesPayload(profiles: ProfilePublic[]) {
  return profiles.map((profile) => ({
    id: profile.id,
    accountId: profile.accountId,
    displayName: profile.displayName,
    avatar: profile.avatar,
    createdAt: profile.createdAt,
    lastActiveAt: profile.lastActiveAt,
  }));
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function asProgress(raw: unknown): ProgressState | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return parseProgress(JSON.stringify(raw));
}
