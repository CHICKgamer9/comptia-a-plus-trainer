"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { PROFILE_AVATARS } from "@/lib/account/types";
import { guestWorthSaving } from "@/lib/account/guest";
import { readGuestProgress } from "@/lib/progress";
import { useAccount } from "@/components/AccountProvider";

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, signedIn, account, profiles, createProfile, saveGuestBench, switchProfile, refresh } =
    useAccount();
  const [name, setName] = useState("Learner 1");
  const [avatar, setAvatar] = useState<string>(PROFILE_AVATARS[0]);
  const [importGuest, setImportGuest] = useState(guestWorthSaving(readGuestProgress()));
  const [busy, setBusy] = useState(false);
  const guest = readGuestProgress();
  const guestCards = guest.bench?.owned.length ?? 0;

  if (!ready) return <p className="text-sm text-muted">Loading…</p>;
  if (!account) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader
          kicker="Onboarding"
          title={signedIn ? "Setting up your account…" : "Sign in first"}
        />
        {signedIn ? (
          <button type="button" onClick={() => void refresh()} className="text-sm text-accent">
            Retry
          </button>
        ) : (
          <Link href="/sign-in" className="text-sm text-accent">
            Sign in
          </Link>
        )}
      </div>
    );
  }

  const first = profiles[0];

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        kicker="Onboarding"
        title="Who is learning?"
        description="Create profile 1 on this account. Progress never lives on the email itself."
      />

      {first ? (
        <div className="mb-6 rounded-3xl border border-border bg-surface p-5">
          <p className="text-sm">
            You already have <span className="font-semibold">{first.displayName}</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                await switchProfile(first.id);
                router.push("/");
              }}
              className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background"
            >
              Continue as {first.displayName}
            </button>
            {account.seatLimit > profiles.length ? (
              <Link
                href="/account/profiles"
                className="rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold"
              >
                Add profile 2
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <form
          className="rounded-3xl border border-border bg-surface p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            const created = importGuest
              ? await saveGuestBench({ displayName: name, avatar })
              : await createProfile({ displayName: name, avatar });
            setBusy(false);
            if (!created) return;
            await switchProfile(created.id);
            router.push("/");
          }}
        >
          <label className="block text-xs text-muted">Display name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={32}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <p className="mt-4 text-xs text-muted">Avatar</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROFILE_AVATARS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setAvatar(item)}
                className={`grid h-9 w-9 place-items-center rounded-xl border ${
                  avatar === item ? "border-accent bg-accent-dim" : "border-border"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {guestWorthSaving(guest) ? (
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={importGuest}
                onChange={(event) => setImportGuest(event.target.checked)}
              />
              <span>
                Save this guest bench
                {guestCards ? ` (${guestCards} card${guestCards === 1 ? "" : "s"})` : ""}. Leave
                unchecked to start empty — guest data stays on this device.
              </span>
            </label>
          ) : (
            <p className="mt-4 text-xs text-muted">
              Guest Start Here is empty, so this profile starts clean.
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background"
          >
            Create profile 1
          </button>
        </form>
      )}

      {account.seatLimit > 1 && !first ? (
        <p className="mt-4 text-xs text-muted">
          This plan has {account.seatLimit} seats. After profile 1 you can add another from Manage
          profiles.
        </p>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="underline-offset-2 hover:underline">
          Skip — keep using guest Start Here
        </Link>
      </p>
    </div>
  );
}
