"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  dismissAllToasts,
  dismissToast,
  getServerToastSnapshot,
  getToastSnapshot,
  subscribeToasts,
} from "@/lib/toasts";
import { getBenchCard } from "@/content/bench-cards";
import { CardGlyph } from "./KnowledgeCard";
import { cn } from "@/lib/cn";

export function CelebrationHost() {
  const pathname = usePathname();
  const toasts = useSyncExternalStore(
    subscribeToasts,
    getToastSnapshot,
    getServerToastSnapshot,
  );
  const cardToast = toasts.find((row) => row.kind === "card");
  const current = toasts.find((row) => row.kind !== "card") ?? null;
  const feed = pathname.startsWith("/brain/feed");

  const skip = useCallback(() => {
    if (current) dismissToast(current.id);
  }, [current]);

  useEffect(() => {
    if (!cardToast) return;
    const timer = window.setTimeout(() => dismissToast(cardToast.id), 2800);
    return () => window.clearTimeout(timer);
  }, [cardToast]);

  return (
    <>
      {cardToast ? (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4">
          <Link
            href="/binder"
            className="card-flip-in pointer-events-auto w-full max-w-sm rounded-2xl border border-accent/30 bg-surface/95 p-3 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-3">
              {cardToast.cardId && getBenchCard(cardToast.cardId) ? (
                <CardGlyph
                  card={getBenchCard(cardToast.cardId)!}
                  className="h-12 w-9 text-accent"
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Card
                </p>
                <p className="truncate font-semibold">{cardToast.title}</p>
                <p className="truncate text-xs text-muted">{cardToast.body}</p>
              </div>
            </div>
          </Link>
        </div>
      ) : null}
      {current ? (
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4",
            feed ? (cardToast ? "top-36" : "top-16") : "bottom-20 md:bottom-8",
          )}
        >
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
                className="min-h-11 rounded-xl bg-accent px-3 py-1.5 text-xs font-medium text-background"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => dismissAllToasts()}
                className="min-h-11 rounded-xl px-3 py-1.5 text-xs text-muted active:text-foreground"
              >
                Hide for now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
