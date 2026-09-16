"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  dismissAllToasts,
  dismissToast,
  getServerToastSnapshot,
  getToastSnapshot,
  subscribeToasts,
} from "@/lib/toasts";

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
        className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-accent/20 bg-surface/95 p-4 shadow-xl backdrop-blur"
        role="status"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          {current.kind === "level" ? "Level" : "Badge"}
        </p>
        <p className="mt-1 font-semibold">{current.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{current.body}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={skip}
            className="rounded-xl bg-accent px-3 py-1.5 text-xs font-medium text-background"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => dismissAllToasts()}
            className="rounded-xl px-3 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Hide for now
          </button>
        </div>
      </div>
    </div>
  );
}
