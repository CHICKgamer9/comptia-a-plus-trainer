import { describe, expect, it } from "vitest";
import { saveBenchCta } from "./save-bench-cta";

describe("saveBenchCta", () => {
  it("shows Sign in to save only for guests with no Clerk session", () => {
    expect(
      saveBenchCta({
        authReady: true,
        clerkSignedIn: false,
        accountReady: false,
        seatsLeft: 1,
      }),
    ).toEqual({ kind: "sign-in" });
  });

  it("prefers migrate when Clerk is signed in and the account is ready", () => {
    expect(
      saveBenchCta({
        authReady: true,
        clerkSignedIn: true,
        accountReady: true,
        seatsLeft: 2,
      }),
    ).toEqual({ kind: "migrate", seatsLeft: 2 });
  });

  it("prefers migrate even if Clerk flags are stale once a TicketBench account exists", () => {
    expect(
      saveBenchCta({
        authReady: true,
        clerkSignedIn: false,
        accountReady: true,
        seatsLeft: 0,
      }),
    ).toEqual({ kind: "migrate", seatsLeft: 0 });
  });

  it("never offers sign-in while Clerk is signed in but /api/account is not ready", () => {
    expect(
      saveBenchCta({
        authReady: true,
        clerkSignedIn: true,
        accountReady: false,
        seatsLeft: 1,
      }),
    ).toEqual({ kind: "setup" });
  });

  it("does not flash Sign in to save while Clerk auth is still loading", () => {
    expect(
      saveBenchCta({
        authReady: false,
        clerkSignedIn: false,
        accountReady: false,
        seatsLeft: 1,
      }),
    ).toEqual({ kind: "pending" });
  });
});
