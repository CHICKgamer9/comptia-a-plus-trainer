"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { getBrainManifest, catTitle } from "@/content/brain/load";
import { DAILY_TARGET_MINUTES } from "@/content/brain/types";
import { catOfId, dayRecord, nextUnanswered, wordSliceMinutes } from "@/lib/brain-daily";
import { sydneyDate } from "@/lib/sydney-date";
import { Badge, ProgressBar } from "../ui";
import { cn } from "@/lib/cn";

export function BrainToday() {
  const { progress } = useProgress();
  const manifest = getBrainManifest();
  const ymd = sydneyDate();
  const day = useMemo(() => dayRecord(ymd, progress.brain), [ymd, progress.brain]);
  const answered = useMemo(() => new Set(day.answered), [day.answered]);
  const remaining = Math.max(0, day.minutesTarget - day.minutesDone);
  const next = nextUnanswered(day.ids, answered);
  const words = wordSliceMinutes(manifest);
  const doneCount = day.answered.length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/brain" className="text-sm text-muted hover:text-foreground">
          ← Hub
        </Link>
        <Link href="/brain/history" className="text-sm text-muted hover:text-foreground">
          History
        </Link>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Daily challenge · {ymd}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Two-hour desk</h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
        {DAILY_TARGET_MINUTES} minutes mixed from every pack. Word puzzles are a standing slice (
        {words.crossword} min of mini crosswords + {words.words} min anagrams, ladders, cryptos,
        reveals). IDs freeze the first time you answer today.
      </p>
      <div className="my-5">
        <ProgressBar
          value={Math.round((day.minutesDone / day.minutesTarget) * 100)}
          label={day.completed ? "Complete" : `${remaining} min remaining`}
        />
      </div>
      {next ? (
        <div className="mb-6 space-y-2">
          <Link
            href="/brain/feed"
            className="flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background active:brightness-110"
          >
            Open phone feed
          </Link>
          <Link
            href={`/brain/play/${next}`}
            className="block min-h-12 rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold leading-[1.75rem] active:bg-surface-2"
          >
            Continue playlist
          </Link>
        </div>
      ) : (
        <p className="mb-6 rounded-2xl border border-ok/30 bg-ok/10 px-4 py-3 text-sm text-ok">
          Playlist cleared for {ymd}. Browse if you want extras — they still earn XP.
        </p>
      )}
      <p className="mb-3 text-xs text-muted">
        {doneCount}/{day.ids.length} items · ~{Math.round(day.ids.length * (manifest.avgMinutes ?? 2))} min if
        you take every card
      </p>
      <ol className="space-y-2">
        {day.ids.map((id, index) => {
          const cat = catOfId(id);
          const done = answered.has(id);
          return (
            <li key={id}>
              <Link
                href={`/brain/play/${id}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm",
                  done ? "border-ok/30 bg-ok/5 text-muted" : "border-border bg-surface active:border-accent/40",
                )}
              >
                <span>
                  <span className="mr-2 font-mono text-xs text-muted">{index + 1}</span>
                  {cat ? catTitle(cat) : id}
                </span>
                <Badge tone={cat === "crossword" || cat === "words" ? "accent" : done ? "ok" : "muted"}>
                  {done ? "Done" : cat ?? "play"}
                </Badge>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
