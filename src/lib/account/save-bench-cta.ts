export type SaveBenchCta =
  | { kind: "pending" }
  | { kind: "sign-in" }
  | { kind: "setup" }
  | { kind: "migrate"; seatsLeft: number };

/**
 * Clerk session is the source of truth for "are they signed into auth".
 * A missing TicketBench account row (401/503/404 from /api/account) must
 * never produce a sign-in link while Clerk is signed in.
 */
export function saveBenchCta(input: {
  authReady: boolean;
  clerkSignedIn: boolean;
  accountReady: boolean;
  seatsLeft: number;
}): SaveBenchCta {
  if (input.accountReady) {
    return { kind: "migrate", seatsLeft: input.seatsLeft };
  }
  if (!input.authReady) {
    return { kind: "pending" };
  }
  if (input.clerkSignedIn) {
    return { kind: "setup" };
  }
  return { kind: "sign-in" };
}
