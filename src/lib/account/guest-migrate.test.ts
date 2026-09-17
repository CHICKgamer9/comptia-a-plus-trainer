import { describe, expect, it } from "vitest";
import { emptyBench } from "@/lib/binder";
import { emptyProgress } from "@/lib/progress";
import { guestProgressForSave, guestWorthSaving } from "./guest";
import { createAccountMemoryStore } from "./store";

function withCards(...cardIds: string[]) {
  return {
    ...emptyProgress(),
    game: {
      xp: 12,
      lastLevel: 0,
      streakCount: 2,
      lastSydneyDate: "2026-09-16",
      badges: [],
      seenBadges: [],
      correctQuestions: [],
    },
    bench: {
      ...emptyBench(),
      owned: cardIds.map((cardId, index) => ({
        cardId,
        copies: 1,
        level: 1 as const,
        firstEarnedAt: index + 1,
        source: "path" as const,
      })),
    },
  };
}

describe("guest migrate", () => {
  it("keeps guest binder cards when saving the bench", async () => {
    const guest = withCards("c-usbc-pd", "c-li-ion");
    expect(guestWorthSaving(guest)).toBe(true);

    const store = createAccountMemoryStore();
    const account = await store.getOrCreateAccount({
      clerkUserId: "user_parent",
      email: "house@example.com",
    });
    const profile = await store.migrateGuest(account.id, {
      progress: guestProgressForSave(guest),
      displayName: "Alex",
    });
    const saved = await store.getProgress(account.id, profile.id);
    expect(saved?.bench?.owned.map((row) => row.cardId)).toEqual(["c-usbc-pd", "c-li-ion"]);
    expect(saved?.game?.streakCount).toBe(2);
  });

  it("does not treat an empty guest bench as worth saving", () => {
    expect(guestWorthSaving(emptyProgress())).toBe(false);
  });
});
