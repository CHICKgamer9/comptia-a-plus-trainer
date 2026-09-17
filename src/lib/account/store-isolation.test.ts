import { describe, expect, it } from "vitest";
import { emptyBench } from "@/lib/binder";
import { emptyProgress } from "@/lib/progress";
import { createAccountMemoryStore } from "./store";

describe("profile store isolation", () => {
  it("two profiles on one account keep separate binders", async () => {
    const store = createAccountMemoryStore();
    const account = await store.getOrCreateAccount({
      clerkUserId: "user_house",
      email: "house@example.com",
    });
    await store.updateAccount(account.id, { plan: "house", seatLimit: 6 });
    const alex = await store.createProfile(account.id, { displayName: "Alex" });
    const riley = await store.createProfile(account.id, { displayName: "Riley" });

    await store.saveProgress(account.id, alex.id, {
      ...emptyProgress(),
      bench: {
        ...emptyBench(),
        owned: [{ cardId: "c-usbc-pd", copies: 1, level: 1, firstEarnedAt: 1, source: "path" }],
      },
    });
    await store.saveProgress(account.id, riley.id, {
      ...emptyProgress(),
      bench: {
        ...emptyBench(),
        owned: [{ cardId: "c-li-ion", copies: 1, level: 1, firstEarnedAt: 2, source: "path" }],
      },
    });

    const alexProgress = await store.getProgress(account.id, alex.id);
    const rileyProgress = await store.getProgress(account.id, riley.id);
    expect(alexProgress?.bench?.owned.map((row) => row.cardId)).toEqual(["c-usbc-pd"]);
    expect(rileyProgress?.bench?.owned.map((row) => row.cardId)).toEqual(["c-li-ion"]);
  });

  it("deleting a profile does not delete the account", async () => {
    const store = createAccountMemoryStore();
    const account = await store.getOrCreateAccount({
      clerkUserId: "user_house",
      email: "house@example.com",
    });
    const profile = await store.createProfile(account.id, { displayName: "Alex" });
    expect(await store.deleteProfile(account.id, profile.id)).toBe(true);
    expect(await store.getAccount(account.id)).toBeTruthy();
    expect(await store.listProfiles(account.id)).toEqual([]);
  });
});
