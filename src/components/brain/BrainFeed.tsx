"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { BrainKindPlay } from "./BrainPlayer";
import { SpeakBar } from "../SpeakBar";
import { catTitle, getBrainManifest, loadBrainItem } from "@/content/brain/load";
import type { BrainItem } from "@/content/brain/types";
import { DAILY_TARGET_MINUTES } from "@/content/brain/types";
import { dayRecord } from "@/lib/brain-daily";
import {
  FEED_ADVANCE_MS,
  FEED_SKIP_COOLDOWN_MS,
  FEED_SKIP_XP,
  feedItemId,
  formatSessionClock,
} from "@/lib/brain-feed";
import { sydneyDate } from "@/lib/sydney-date";
import { XP } from "@/lib/xp";
import { cn } from "@/lib/cn";
import type { BrainFeedState } from "@/lib/progress";

export function BrainFeed() {
  const { progress, stats, recordBrainAnswer, saveBrainFeed, recordBrainSkip } = useProgress();
  const manifest = getBrainManifest();
  const ymd = sydneyDate();
  const day = dayRecord(ymd, progress.brain);
  const stored = progress.brain?.feed?.ymd === ymd ? progress.brain.feed : undefined;
  const cursor = stored?.cursor ?? 0;

  const [clockMs, setClockMs] = useState(0);
  const [cache, setCache] = useState<{ id: string; item: BrainItem | null } | null>(null);
  const [resolvedFor, setResolvedFor] = useState<{ id: string; status: "ok" | "miss" } | null>(null);
  const [xpToast, setXpToast] = useState<string | null>(null);
  const [skipLockedUntil, setSkipLockedUntil] = useState(0);
  const [now, setNow] = useState(0);

  const startedAtRef = useRef(0);
  const clockRef = useRef(0);
  const lastPersistedClock = useRef(0);
  const recordedRef = useRef(new Set<string>());
  const startY = useRef<number | null>(null);
  const resolvedRef = useRef<"ok" | "miss" | null>(null);
  const advanceTimer = useRef<number>(0);
  const cursorRef = useRef(cursor);

  const id = feedItemId(ymd, cursor, manifest);
  const item = cache?.id === id ? cache.item : undefined;
  const resolved = resolvedFor?.id === id ? resolvedFor.status : null;

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    resolvedRef.current = resolved;
  }, [resolved]);

  useEffect(() => {
    clockRef.current = clockMs;
  }, [clockMs]);

  const persist = useCallback(
    (next: Partial<BrainFeedState> & { cursor: number }) => {
      if (!startedAtRef.current) startedAtRef.current = Date.now();
      const delta = clockRef.current - lastPersistedClock.current;
      lastPersistedClock.current = clockRef.current;
      const payload: BrainFeedState = {
        ymd,
        cursor: next.cursor,
        startedAt: stored?.startedAt || startedAtRef.current,
        activeMs: Math.max(0, (stored?.activeMs ?? 0) + delta),
        lastSkipAt: next.lastSkipAt ?? stored?.lastSkipAt,
      };
      saveBrainFeed(payload);
    },
    [saveBrainFeed, stored?.activeMs, stored?.lastSkipAt, stored?.startedAt, ymd],
  );

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      setClockMs((ms) => {
        clockRef.current = ms + 1000;
        return ms + 1000;
      });
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      persist({ cursor: cursorRef.current });
    }, 5000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(advanceTimer.current);
    };
  }, [persist]);

  useEffect(() => {
    if (!xpToast) return;
    const timer = window.setTimeout(() => setXpToast(null), 1300);
    return () => window.clearTimeout(timer);
  }, [xpToast]);

  useEffect(() => {
    let alive = true;
    loadBrainItem(id).then((found) => {
      if (alive) setCache({ id, item: found });
    });
    void loadBrainItem(feedItemId(ymd, cursor + 1, manifest));
    void loadBrainItem(feedItemId(ymd, cursor + 2, manifest));
    return () => {
      alive = false;
    };
  }, [id, cursor, ymd, manifest]);

  function go(nextCursor: number) {
    window.clearTimeout(advanceTimer.current);
    persist({ cursor: nextCursor });
  }

  function onResolved(correct: boolean, spoken?: string, penalty?: number) {
    if (!item) return;
    const already =
      recordedRef.current.has(id) || (progress.brain?.answeredIds.includes(item.id) ?? false);
    if (already && resolvedRef.current) return;
    if (!already) {
      recordedRef.current.add(id);
      recordBrainAnswer({
        id: item.id,
        ymd,
        playlistIds: day.ids,
        minutes: item.minutes,
        minutesTarget: DAILY_TARGET_MINUTES,
        correct,
        penalty: penalty ? -penalty : 0,
        crossword: item.kind === "crossword",
      });
      const gain =
        (correct ? XP.brainCorrect : XP.brainWrong) +
        (item.kind === "crossword" && correct ? XP.brainCrossword : 0) -
        (penalty ?? 0);
      setXpToast(`${gain >= 0 ? "+" : ""}${gain} XP`);
    }
    setResolvedFor({ id, status: correct ? "ok" : "miss" });
    resolvedRef.current = correct ? "ok" : "miss";
    void spoken;
    if (correct) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => go(cursor + 1), FEED_ADVANCE_MS);
    }
  }

  function skip() {
    window.clearTimeout(advanceTimer.current);
    if (resolvedRef.current) {
      go(cursor + 1);
      return;
    }
    const stamp = Date.now();
    if (stamp < skipLockedUntil) return;
    setNow(stamp);
    setSkipLockedUntil(stamp + FEED_SKIP_COOLDOWN_MS);
    setXpToast(`−${FEED_SKIP_XP} XP · skip`);
    if (!startedAtRef.current) startedAtRef.current = stamp;
    const delta = clockRef.current - lastPersistedClock.current;
    lastPersistedClock.current = clockRef.current;
    recordBrainSkip({
      ymd,
      cursor: cursor + 1,
      startedAt: stored?.startedAt || startedAtRef.current,
      activeMs: Math.max(0, (stored?.activeMs ?? 0) + delta),
      lastSkipAt: stamp,
    });
  }

  function onTouchStart(event: TouchEvent) {
    startY.current = event.touches[0]?.clientY ?? null;
  }

  function onTouchEnd(event: TouchEvent) {
    if (startY.current == null) return;
    const y = event.changedTouches[0]?.clientY ?? startY.current;
    const dy = y - startY.current;
    startY.current = null;
    if (dy < -72) skip();
  }

  const skipCooling = skipLockedUntil > 0 && now > 0 && now < skipLockedUntil;
  const remainingDesk = Math.max(0, day.minutesTarget - day.minutesDone);

  return (
    <div
      className="feed-shell mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background"
      style={{
        paddingTop: "max(10px, env(safe-area-inset-top))",
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="flex shrink-0 items-center gap-2 pb-2">
        <Link
          href="/brain"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-sm active:bg-surface-2"
          aria-label="Close feed"
        >
          ×
        </Link>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 text-center">
          <StatChip label="Streak" value={`${stats.streak}d`} />
          <StatChip label="Desk" value={`${remainingDesk}m`} />
          <StatChip label="Scroll" value={formatSessionClock(clockMs)} />
        </div>
      </header>

      <div className="relative mb-2 flex shrink-0 items-center justify-between gap-2">
        <span className="inline-flex min-h-11 items-center rounded-full border border-accent/40 bg-accent-dim px-3 text-xs font-semibold uppercase tracking-wider text-accent">
          {item ? catTitle(item.cat) : "Feed"}
        </span>
        {item ? (
          <SpeakBar
            compact
            narration={{
              id: item.id,
              prompt: `${item.title}. ${item.prompt}`,
              followUp: resolved ? item.why : undefined,
            }}
          />
        ) : null}
        {xpToast ? (
          <span className="absolute right-0 top-12 z-10 rounded-full bg-ok/15 px-3 py-1 text-xs font-semibold text-ok">
            {xpToast}
          </span>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          key={id}
          className="feed-card flex h-full min-h-0 flex-col overflow-y-auto rounded-3xl border border-border bg-surface p-4"
        >
          {item === undefined ? (
            <p className="m-auto text-sm text-muted">Loading a challenge…</p>
          ) : !item ? (
            <p className="m-auto text-sm text-muted">That card is missing. Skip to the next.</p>
          ) : (
            <>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">{item.title}</p>
              <BrainKindPlay item={item} onResolved={onResolved} />
            </>
          )}
        </div>
      </div>

      <div className="mt-2 grid shrink-0 grid-cols-2 gap-2">
        <button
          type="button"
          onClick={skip}
          disabled={skipCooling && !resolved}
          className={cn(
            "min-h-12 rounded-2xl border border-border px-4 text-sm font-semibold active:bg-surface-2 disabled:opacity-40",
          )}
        >
          {resolved ? "Next" : skipCooling ? "Wait…" : `Skip (−${FEED_SKIP_XP} XP)`}
        </button>
        <button
          type="button"
          onClick={() => (resolved ? go(cursor + 1) : skip())}
          className="min-h-12 rounded-2xl bg-accent px-4 text-sm font-semibold text-background active:brightness-110"
        >
          {resolved === "ok" ? "Next" : resolved === "miss" ? "Keep going" : "Swipe up"}
        </button>
      </div>
      <p className="mt-1 text-center text-[11px] text-muted">
        Replace the scroll · {ymd} · card {cursor + 1}
      </p>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-1 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted">{label}</p>
      <p className="truncate font-mono text-xs font-semibold">{value}</p>
    </div>
  );
}
