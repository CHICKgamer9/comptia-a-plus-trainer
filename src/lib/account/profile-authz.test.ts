import { afterEach, describe, expect, it } from "vitest";
import { emptyBench } from "@/lib/binder";
import { emptyProgress, parseProgress } from "@/lib/progress";
import { handleGetProfile, handleGetProfileProgress, handleListProfiles } from "./api";
import { setClerkIdentityForTests } from "./session";
import { createAccountMemoryStore, setAccountStoreForTests } from "./store";

afterEach(() => {
  setAccountStoreForTests(undefined);
  setClerkIdentityForTests();
});

describe("profile API authz", () => {
  it("cannot read another account's profile", async () => {
    const store = createAccountMemoryStore();
    setAccountStoreForTests(store);

    const alice = await store.getOrCreateAccount({
      clerkUserId: "user_alice",
      email: "alice@example.com",
    });
    const bob = await store.getOrCreateAccount({
      clerkUserId: "user_bob",
      email: "bob@example.com",
    });
    const sister = await store.createProfile(alice.id, { displayName: "Sister" });
    const progress = parseProgress(
      JSON.stringify({
        ...emptyProgress(),
        bench: {
          ...emptyBench(),
          owned: [
            {
              cardId: "c-usbc-pd",
              copies: 1,
              level: 1,
              firstEarnedAt: 1,
              source: "path",
            },
          ],
        },
      }),
    );
    await store.saveProgress(alice.id, sister.id, progress);

    setClerkIdentityForTests({ clerkUserId: "user_bob", email: "bob@example.com" });

    const profileRes = await handleGetProfile(sister.id);
    expect(profileRes.status).toBe(404);
    expect(await profileRes.json()).toEqual({ error: "Not found" });

    const progressRes = await handleGetProfileProgress(sister.id);
    expect(progressRes.status).toBe(404);
    const body = await progressRes.json();
    expect(body.progress).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("c-usbc-pd");
    expect(JSON.stringify(body)).not.toContain(sister.id);

    const listRes = await handleListProfiles();
    expect(listRes.status).toBe(200);
    const list = (await listRes.json()) as { profiles: { id: string; accountId: string; progress?: unknown }[] };
    expect(list.profiles.every((row) => row.accountId === bob.id)).toBe(true);
    expect(list.profiles.some((row) => row.id === sister.id)).toBe(false);
    expect(list.profiles.every((row) => row.progress === undefined)).toBe(true);
  });

  it("returns 401 when there is no account session", async () => {
    setAccountStoreForTests(createAccountMemoryStore());
    setClerkIdentityForTests(null);
    const res = await handleGetProfileProgress("prof_missing");
    expect(res.status).toBe(401);
  });
});
