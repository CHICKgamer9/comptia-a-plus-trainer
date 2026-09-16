"use client";

import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { Badge, EmptyState } from "../ui";

export function BrainHistory() {
  const { progress } = useProgress();
  const days = Object.entries(progress.brain?.days ?? {}).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const best = progress.brain?.bestDay;

  return (
    <div>
      <div className="mb-6">
        <Link href="/brain" className="text-sm text-muted hover:text-foreground">
          ← Hub
        </Link>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Brain Gym history</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        Completed days use the Australia/Sydney calendar. Personal best
        {best ? `: ${best.minutes} min on ${best.ymd}.` : " appears after you log a session."}
      </p>
      {!days.length ? (
        <EmptyState title="No days yet" body="Open today’s playlist and answer one item to freeze the desk.">
          <Link href="/brain/today" className="text-sm text-accent">
            Today
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-2">
          {days.map(([ymd, row]) => (
            <li
              key={ymd}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <span>
                <span className="block text-sm font-medium">{ymd}</span>
                <span className="text-xs text-muted">
                  {row.answered.length}/{row.ids.length} items · {row.minutesDone}/{row.minutesTarget} min
                </span>
              </span>
              <Badge tone={row.completed ? "ok" : "muted"}>{row.completed ? "Complete" : "Open"}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
