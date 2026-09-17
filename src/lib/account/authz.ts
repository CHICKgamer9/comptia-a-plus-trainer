import type { ProfilePublic } from "./types";

export class ProfileAccessError extends Error {
  status: number;

  constructor(message = "Not found", status = 404) {
    super(message);
    this.name = "ProfileAccessError";
    this.status = status;
  }
}

/** A profile is only readable/writable by its owning account. Never leak other accounts. */
export function ownedProfile<T extends { accountId: string }>(
  profile: T | null | undefined,
  accountId: string,
): T | null {
  if (!profile || profile.accountId !== accountId) return null;
  return profile;
}

export function assertOwnedProfile<T extends { accountId: string }>(
  profile: T | null | undefined,
  accountId: string,
): T {
  const owned = ownedProfile(profile, accountId);
  if (!owned) throw new ProfileAccessError();
  return owned;
}

export function publicProfile(row: ProfilePublic): ProfilePublic {
  return {
    id: row.id,
    accountId: row.accountId,
    displayName: row.displayName,
    avatar: row.avatar,
    createdAt: row.createdAt,
    lastActiveAt: row.lastActiveAt,
  };
}
