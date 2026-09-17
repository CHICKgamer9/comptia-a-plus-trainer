import { afterEach, describe, expect, it } from "vitest";
import { handleGetAccount } from "./api";
import { setClerkIdentityForTests } from "./session";
import {
  createAccountMemoryStore,
  setAccountStoreForTests,
  StoreUnavailableError,
  type AccountStore,
} from "./store";

afterEach(() => {
  setAccountStoreForTests(undefined);
  setClerkIdentityForTests();
});

describe("GET /api/account", () => {
  it("returns 401 unauthenticated when there is no Clerk session", async () => {
    setAccountStoreForTests(createAccountMemoryStore());
    setClerkIdentityForTests(null);
    const res = await handleGetAccount();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized", code: "unauthenticated" });
  });

  it("gets or creates an Account row for a signed-in Clerk user", async () => {
    const store = createAccountMemoryStore();
    setAccountStoreForTests(store);
    setClerkIdentityForTests({ clerkUserId: "user_new", email: "new@example.com" });

    const first = await handleGetAccount();
    expect(first.status).toBe(200);
    const created = (await first.json()) as {
      account: { id: string; email: string };
      profiles: unknown[];
    };
    expect(created.account.email).toBe("new@example.com");
    expect(created.profiles).toEqual([]);

    const second = await handleGetAccount();
    expect(second.status).toBe(200);
    const again = (await second.json()) as { account: { id: string } };
    expect(again.account.id).toBe(created.account.id);
  });

  it("returns 503 database_unavailable when the store is missing", async () => {
    setClerkIdentityForTests({ clerkUserId: "user_1", email: "a@b.com" });
    setAccountStoreForTests({
      async getOrCreateAccount() {
        throw new StoreUnavailableError();
      },
    } as unknown as AccountStore);

    const res = await handleGetAccount();
    expect(res.status).toBe(503);
    const body = (await res.json()) as { code?: string };
    expect(body.code).toBe("database_unavailable");
    expect(res.status).not.toBe(401);
  });
});
