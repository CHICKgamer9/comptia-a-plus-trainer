export const PLANS = ["free", "bench", "house"] as const;
export type Plan = (typeof PLANS)[number];

export const MAX_PROFILES = 6;

export const PROFILE_AVATARS = ["🛠️", "🦊", "📚", "🎧", "🧪", "🎮", "🌿", "⚡"] as const;

export interface AccountRecord {
  id: string;
  clerkUserId: string;
  email: string;
  plan: Plan;
  seatLimit: number;
  stripeCustomerId: string | null;
  createdAt: string;
}

export interface ProfilePublic {
  id: string;
  accountId: string;
  displayName: string;
  avatar: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface ClerkIdentity {
  clerkUserId: string;
  email: string;
}

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && (PLANS as readonly string[]).includes(value);
}
