"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useProgress } from "./ProgressProvider";

function subscribeClock(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function clockNow() {
  return Date.now();
}

function clockServer() {
  return 0;
}

export function DeskShiftChip() {
  const { bench, closeDeskShift } = useProgress();
  const shift = bench.activeShift && !bench.activeShift.endedAt ? bench.activeShift : undefined;
  const now = useSyncExternalStore(subscribeClock, clockNow, clockServer);

  useEffect(() => {
    if (!shift) return;
    const wait = Math.max(0, shift.lengthMin * 60 * 1000 - (Date.now() - shift.startedAt));
    const timer = window.setTimeout(() => closeDeskShift(false), wait);
    return () => window.clearTimeout(timer);
  }, [shift, closeDeskShift]);

  if (!shift) {
    return (
      <Link
        href="/binder"
        className="hidden items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:text-foreground sm:flex"
      >
        Binder {bench.owned.length ? `· ${bench.owned.length}` : ""}
      </Link>
    );
  }

  const remainingMs = Math.max(0, shift.lengthMin * 60 * 1000 - ((now || shift.startedAt) - shift.startedAt));
  const remainingSec = Math.floor(remainingMs / 1000);
  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={() => closeDeskShift(remainingMs > 0)}
      className="hidden items-center gap-2 rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] text-accent sm:flex"
      title={remainingMs <= 0 ? "Time’s up — close the desk" : "Desk shift — click to close early"}
    >
      Desk {mm}:{ss}
    </button>
  );
}
