"use client";

import Link from "next/link";
import { useProgress } from "./ProgressProvider";

export function StatusChip() {
  const { stats } = useProgress();
  return (
    <Link
      href="/progress"
      className="hidden items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:text-foreground sm:flex"
    >
      <span className="font-medium text-accent">{stats.levelTitle}</span>
      <span className="text-border">·</span>
      <span>{stats.xp} XP</span>
      <span className="text-border">·</span>
      <span>
        {stats.streak} day{stats.streak === 1 ? "" : "s"}
      </span>
    </Link>
  );
}
