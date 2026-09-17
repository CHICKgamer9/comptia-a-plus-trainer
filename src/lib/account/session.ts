import type { ClerkIdentity } from "./types";

let identityOverride: ClerkIdentity | null | undefined;

export function setClerkIdentityForTests(identity?: ClerkIdentity | null) {
  identityOverride = identity;
}

export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  if (identityOverride !== undefined) return identityOverride;
  if (!process.env.CLERK_SECRET_KEY) return null;
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "";
  return { clerkUserId: userId, email };
}

export function clerkConfigured() {
  return Boolean(
    process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  );
}
