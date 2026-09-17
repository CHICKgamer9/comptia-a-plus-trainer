"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { clerkBrowserConfigured } from "./AuthProvider";
import { useAccount } from "./AccountProvider";
import { AccountMenu } from "./ProfileSwitcher";

export function PhoneOverflow({ labHref = "/lab" }: { labHref?: string }) {
  const { signedIn, activeProfile } = useAccount();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const clerkOn = clerkBrowserConfigured();
  const avatar = activeProfile?.avatar ?? "⋯";

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative md:hidden">
      <button
        type="button"
        aria-label="Account and more"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-sm active:bg-surface-2"
      >
        {signedIn ? <span aria-hidden>{avatar}</span> : <OverflowGlyph />}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg"
        >
          {signedIn ? (
            <AccountMenu onDone={() => setOpen(false)} />
          ) : clerkOn ? (
            <Show when="signed-out">
              <div className="grid gap-1">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    role="menuitem"
                    className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm active:bg-surface-2"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    role="menuitem"
                    className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm text-accent active:bg-surface-2"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
          ) : (
            <Link
              href="/sign-in"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-sm active:bg-surface-2"
            >
              Sign in
            </Link>
          )}
          <Link
            href={labHref}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center rounded-xl px-3 text-sm text-muted active:bg-surface-2 active:text-foreground"
          >
            Tech Lab
          </Link>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center rounded-xl px-3 text-sm text-muted active:bg-surface-2 active:text-foreground"
          >
            Settings
          </Link>
          {signedIn && clerkOn ? (
            <div className="mt-1 flex items-center justify-between rounded-xl px-3 py-2">
              <span className="text-xs text-muted">Clerk</span>
              <UserButton />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function OverflowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="6" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
    </svg>
  );
}
