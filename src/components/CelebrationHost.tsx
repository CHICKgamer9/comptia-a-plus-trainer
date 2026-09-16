"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  dismissAllToasts,
  dismissToast,
  getServerToastSnapshot,
  getToastSnapshot,
  subscribeToasts,
} from "@/lib/toasts";
import { cn } from "@/lib/cn";

export function CelebrationHost() {
  const toasts = useSyncExternalStore(
    subscribeToasts,
    getToastSnapshot,
    getServerToastSnapshot,
  );
  const current = toasts[0];

  const skip = useCallback(() => {
    if (current) dismissToast(current.id);
  }, [current]);

  if (!current) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-8">
      <div
        className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/30 bg-surface p-4 shadow-xl"
        role="status"
      >
        <ConfettiLite />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          {current.kind === "level" ? "Level" : "Badge"}
        </p>
        <p className="mt-1 font-semibold">{current.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{current.body}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={skip}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-background"
          >
            Nice
          </button>
          <button
            type="button"
            onClick={() => dismissAllToasts()}
            className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Skip celebrations
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfettiLite() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 12 }).map((_, index) => (
        <i
          key={index}
          className={cn("confetti-bit", index % 2 ? "bg-accent" : "bg-warn")}
          style={{
            left: `${8 + index * 7}%`,
            animationDelay: `${index * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
