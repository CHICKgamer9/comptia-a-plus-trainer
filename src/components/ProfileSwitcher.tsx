"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { cn } from "@/lib/cn";
import { clerkBrowserConfigured } from "./AuthProvider";
import { useAccount } from "./AccountProvider";

export function ProfileSwitcher() {
  const { account, profiles, activeProfile, switchProfile } = useAccount();
  const [open, setOpen] = useState(false);
  const clerkOn = clerkBrowserConfigured();
  const router = useRouter();

  if (!account) {
    if (clerkOn) {
      return (
        <div className="flex items-center gap-1.5">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:text-foreground"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] text-accent hover:brightness-110"
              >
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      );
    }
    return (
      <Link
        href="/sign-in"
        className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  const label = activeProfile?.displayName ?? account?.email ?? "Account";
  const avatar = activeProfile?.avatar ?? "🛠️";

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex max-w-[10rem] items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-1 text-[11px] hover:text-foreground"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span aria-hidden className="text-sm leading-none">
            {avatar}
          </span>
          <span className="truncate font-medium">{label}</span>
        </button>
        {open ? (
          <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg">
            <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted">Learners</p>
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  void switchProfile(profile.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm",
                  profile.id === activeProfile?.id
                    ? "bg-accent-dim text-accent"
                    : "hover:bg-surface-2",
                )}
              >
                <span aria-hidden>{profile.avatar}</span>
                <span className="truncate">{profile.displayName}</span>
              </button>
            ))}
            <Link
              href="/account/profiles"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl px-2 py-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
            >
              Manage profiles
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-2 py-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
            >
              Account
            </Link>
            {clerkOn ? <SignOutRow onDone={() => setOpen(false)} goHome={() => router.push("/")} /> : null}
          </div>
        ) : null}
      </div>
      {clerkOn ? <UserButton /> : null}
    </div>
  );
}

function SignOutRow({ onDone, goHome }: { onDone: () => void; goHome: () => void }) {
  return (
    <button
      type="button"
      onClick={async () => {
        onDone();
        const clerk = (
          window as unknown as { Clerk?: { signOut: (opts?: { redirectUrl: string }) => Promise<void> } }
        ).Clerk;
        if (clerk) {
          await clerk.signOut({ redirectUrl: "/" });
          return;
        }
        goHome();
      }}
      className="block w-full rounded-xl px-2 py-2 text-left text-sm text-muted hover:bg-surface-2 hover:text-foreground"
    >
      Sign out
    </button>
  );
}
