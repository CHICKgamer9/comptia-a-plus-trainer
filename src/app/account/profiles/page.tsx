"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { PROFILE_AVATARS } from "@/lib/account/types";
import { useAccount } from "@/components/AccountProvider";

export default function ProfilesPage() {
  const {
    ready,
    signedIn,
    account,
    refresh,
    profiles,
    activeProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    switchProfile,
  } = useAccount();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string>(PROFILE_AVATARS[0]);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <p className="text-sm text-muted">Loading profiles…</p>;
  if (!account) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader
          kicker="Profiles"
          title={signedIn ? "Setting up your account…" : "Sign in first"}
        />
        {signedIn ? (
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-sm text-accent underline-offset-2 hover:underline"
          >
            Retry
          </button>
        ) : (
          <Link href="/sign-in" className="text-sm text-accent underline-offset-2 hover:underline">
            Sign in
          </Link>
        )}
      </div>
    );
  }

  const canAdd = profiles.length < account.seatLimit;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        kicker="Profiles"
        title="Who is on this bench"
        description={`${profiles.length} of ${account.seatLimit} seats. Switching does not sign you out.`}
      />

      <ul className="mb-8 grid gap-3">
        {profiles.map((profile) => (
          <li key={profile.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  <span className="mr-2" aria-hidden>
                    {profile.avatar}
                  </span>
                  {profile.displayName}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {profile.id === activeProfile?.id ? "Learning now" : "Tap switch to learn here"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void switchProfile(profile.id)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-surface-2"
              >
                Switch
              </button>
            </div>
            <form
              className="mt-3 flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const nextName = String(data.get("name") ?? "");
                const nextAvatar = String(data.get("avatar") ?? profile.avatar);
                void renameProfile(profile.id, nextName, nextAvatar);
              }}
            >
              <input
                name="name"
                defaultValue={profile.displayName}
                maxLength={32}
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <select
                name="avatar"
                defaultValue={profile.avatar}
                className="rounded-xl border border-border bg-background px-2 py-2 text-sm"
              >
                {PROFILE_AVATARS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button type="submit" className="rounded-xl border border-border px-3 py-2 text-xs">
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete ${profile.displayName}? Their progress, Binder, and streak go with them. The account stays.`,
                    )
                  ) {
                    void deleteProfile(profile.id);
                  }
                }}
                className="rounded-xl px-3 py-2 text-xs text-danger"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>

      <section className="rounded-3xl border border-border bg-surface p-5">
        <p className="text-sm font-semibold">Add a learner</p>
        <p className="mt-1 text-xs text-muted">
          {canAdd
            ? "A new profile starts empty unless you save a guest bench onto it."
            : "This plan is at its seat limit. House can raise seat_limit (max 6)."}
        </p>
        <form
          className="mt-4 grid gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            const created = await createProfile({ displayName: name, avatar });
            if (!created) {
              setError(canAdd ? "Could not add that profile." : "Seat limit reached.");
              return;
            }
            setName("");
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Display name"
            maxLength={32}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-1.5">
            {PROFILE_AVATARS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setAvatar(item)}
                className={`grid h-9 w-9 place-items-center rounded-xl border text-base ${
                  avatar === item ? "border-accent bg-accent-dim" : "border-border"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={!canAdd}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-40"
          >
            Add profile
          </button>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
