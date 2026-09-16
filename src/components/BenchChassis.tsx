"use client";

import Link from "next/link";
import { BENCH_SLOTS } from "@/content/bench-cards";
import { getBenchCard } from "@/content/bench-cards";
import { emptyBench, ownedCount, slottedCount } from "@/lib/binder";
import { cn } from "@/lib/cn";
import { useProgress } from "./ProgressProvider";

export function BenchChassis({
  compact,
  continueHref,
}: {
  compact?: boolean;
  continueHref?: string;
}) {
  const { bench, startDeskShift, closeDeskShift } = useProgress();
  const state = bench ?? emptyBench();
  const shift = state.activeShift && !state.activeShift.endedAt ? state.activeShift : undefined;
  const cards = ownedCount(state);
  const slotted = slottedCount(state);
  const packReady = Boolean(state.pendingPack);

  return (
    <div className="rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Bench</p>
          <p className="mt-1 text-lg font-semibold">Chassis</p>
          <p className="mt-1 text-xs text-muted">
            {cards} cards · {slotted} slotted
            {packReady ? " · Night Pack ready" : shift ? " · desk open" : " · desk closed"}
          </p>
        </div>
        <ChassisSvg slotted={state.slotted} />
      </div>
      {!compact ? (
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {BENCH_SLOTS.map((slot) => {
            const id = state.slotted[slot.id];
            const card = id ? getBenchCard(id) : undefined;
            return (
              <div
                key={slot.id}
                title={card ? card.title : slot.label}
                className={cn(
                  "rounded-lg border px-1 py-1.5 text-center text-[9px] uppercase tracking-wide",
                  card ? "border-accent/50 bg-accent-dim text-accent" : "border-border text-muted",
                )}
              >
                {slot.label}
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/binder"
          className="flex-1 rounded-2xl bg-accent px-4 py-3 text-center text-sm font-semibold text-background"
        >
          Binder
        </Link>
        {shift ? (
          <button
            type="button"
            onClick={() => closeDeskShift(true)}
            className="rounded-2xl border border-border px-4 py-3 text-sm font-semibold hover:bg-surface-2"
          >
            Close desk
          </button>
        ) : (
          <div className="flex flex-1 gap-2">
            {([8, 15, 25] as const).map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => startDeskShift(minutes)}
                className="flex-1 rounded-2xl border border-border px-3 py-3 text-sm font-semibold hover:bg-surface-2"
              >
                {minutes === 15 ? "Start 15 min" : `${minutes} min`}
              </button>
            ))}
          </div>
        )}
      </div>
      {!compact ? (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <Link href={continueHref ?? "/learn"} className="text-muted hover:text-foreground">
            Continue
          </Link>
          <Link href="/brain/today" className="text-muted hover:text-foreground">
            Scroll brain
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ChassisSvg({ slotted }: { slotted: Record<string, string | undefined> }) {
  const on = (slot: string) => Boolean(slotted[slot]);
  return (
    <svg width="92" height="72" viewBox="0 0 92 72" aria-hidden className="shrink-0 text-accent">
      <rect x="8" y="10" width="76" height="52" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="18" y="18" width="22" height="10" rx="2" fill={on("psu") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="46" y="18" width="14" height="10" rx="2" fill={on("cpu") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="64" y="18" width="10" height="10" rx="1" fill={on("ram-a") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="76" y="18" width="4" height="10" rx="1" fill={on("ram-b") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="18" y="34" width="28" height="8" rx="1" fill={on("storage-m2") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="50" y="34" width="24" height="8" rx="1" fill={on("storage-sata") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="18" y="48" width="16" height="8" rx="1" fill={on("wifi") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="38" y="48" width="20" height="8" rx="1" fill={on("display") ? "currentColor" : "none"} stroke="currentColor" />
      <rect x="62" y="48" width="12" height="8" rx="1" fill={on("tool-wall") ? "currentColor" : "none"} stroke="currentColor" />
    </svg>
  );
}
