"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { getBrainManifest } from "@/content/brain/load";
import { DAILY_TARGET_MINUTES } from "@/content/brain/types";
import { wordSliceMinutes } from "@/lib/brain-daily";
import { Badge, Card, PageHeader } from "../ui";
import { useProgress } from "../ProgressProvider";
import { sydneyDate } from "@/lib/sydney-date";
import { dayRecord } from "@/lib/brain-daily";
import { cn } from "@/lib/cn";

export function BrainHub() {
  const { progress } = useProgress();
  const manifest = getBrainManifest();
  const ymd = sydneyDate();
  const day = dayRecord(ymd, progress.brain);
  const remaining = Math.max(0, day.minutesTarget - day.minutesDone);
  const words = wordSliceMinutes(manifest);
  const daysDone = Object.values(progress.brain?.days ?? {}).filter((row) => row.completed).length;

  return (
    <div
      style={
        {
          "--accent": "#c084fc",
          "--accent-dim": "#3b0764",
        } as CSSProperties
      }
    >
      <PageHeader
        kicker="Brain Gym"
        title="Daily challenge desk"
        description="A two-hour Sydney playlist of short puzzles — minis you can type, not posters. Not a school subject and not an IQ test."
      />
      <Card className="mb-6 border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Today · {ymd}</p>
        <p className="mt-2 text-2xl font-semibold">
          {day.completed ? "Desk cleared" : `${remaining} minutes remaining`}
        </p>
        <p className="mt-1 text-sm text-muted">
          Target {DAILY_TARGET_MINUTES} min. Word slice every day: {words.crossword} min crosswords +{" "}
          {words.words} min other word puzzles.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/brain/today"
            className="flex-1 rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background"
          >
            Open today’s playlist
          </Link>
          <Link
            href="/brain/browse"
            className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
          >
            Browse packs
          </Link>
        </div>
      </Card>
      <div className="mb-6 grid grid-cols-3 gap-2">
        <Stat label="Unique items" value={String(manifest.total)} hint="Factory floor ≥8000" />
        <Stat label="Crosswords" value={String(manifest.crosswordCount)} hint="Playable grids" />
        <Stat label="Days done" value={String(daysDone)} hint="120 min cleared" />
      </div>
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">Categories</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {manifest.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/brain/browse?cat=${cat.id}`}
            className={cn(
              "rounded-2xl border border-border bg-surface p-4 hover:border-accent/40",
              (cat.id === "crossword" || cat.id === "words") && "border-accent/25",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{cat.title}</p>
              <Badge tone="muted">{cat.count}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
            <p className="mt-2 text-[11px] text-muted">~{cat.avgMinutes} min each</p>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/brain/history" className="text-accent hover:underline">
          History of days
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{hint}</p>
    </div>
  );
}
