"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { guestWorthSaving } from "@/lib/account/guest";
import { saveBenchCta } from "@/lib/account/save-bench-cta";
import { isGuestProgressScope } from "@/lib/progress";
import { useAccount } from "./AccountProvider";
import { useProgress } from "./ProgressProvider";

export function SaveBenchPrompt() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const {
    authReady,
    clerkSignedIn,
    saveGuestBench,
    profiles,
    account,
    refresh,
  } = useAccount();
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;
  if (!authReady) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) return null;
  if (pathname.startsWith("/account")) return null;
  if (!isGuestProgressScope()) return null;
  if (!guestWorthSaving(progress)) return null;

  const seatsLeft = account ? Math.max(0, account.seatLimit - profiles.length) : 1;
  const cta = saveBenchCta({
    authReady,
    clerkSignedIn,
    accountReady: Boolean(account),
    seatsLeft,
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+0.75rem)] z-40 flex justify-center px-4 md:bottom-6">
      <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-accent/40 bg-surface/95 p-4 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold">Save this bench</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          {progress.bench?.owned.length
            ? "You printed a card. Keep the Binder on an account so another learner cannot overwrite it."
            : "Day 2 streak. Save this learner before someone else uses this browser."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cta.kind === "migrate" ? (
            <button
              type="button"
              disabled={busy || (cta.seatsLeft === 0 && !profiles[0])}
              onClick={async () => {
                setBusy(true);
                const profile = await saveGuestBench({
                  displayName: profiles.length ? `Learner ${profiles.length + 1}` : "Learner 1",
                  targetProfileId: cta.seatsLeft === 0 ? profiles[0]?.id : undefined,
                });
                setBusy(false);
                if (profile) setHidden(true);
              }}
              className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
            >
              {cta.seatsLeft === 0 ? "Copy onto first profile" : "Save to a profile"}
            </button>
          ) : null}
          {cta.kind === "sign-in" ? (
            <Link
              href="/sign-in"
              className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-background"
            >
              Sign in to save
            </Link>
          ) : null}
          {cta.kind === "setup" || cta.kind === "pending" ? (
            <>
              <span className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-background">
                Setting up your account…
              </span>
              {cta.kind === "setup" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    await refresh();
                    setBusy(false);
                  }}
                  className="rounded-xl border border-border px-3 py-2 text-xs text-muted hover:text-foreground disabled:opacity-50"
                >
                  Retry
                </button>
              ) : null}
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="rounded-xl border border-border px-3 py-2 text-xs text-muted hover:text-foreground"
          >
            Keep as guest
          </button>
        </div>
      </div>
    </div>
  );
}
