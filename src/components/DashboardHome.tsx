"use client";

import Link from "next/link";
import { domains } from "@/content";
import { useProgress } from "./ProgressProvider";
import { CoursePath, nextDomain } from "./CoursePath";
import { examReadiness, overallReadiness } from "@/lib/readiness";
import { Disclaimer, ProgressBar } from "./ui";
import { cn } from "@/lib/cn";

export function DashboardHome() {
  const { ready, stats, progress, resetProgress } = useProgress();
  const upcoming = nextDomain(progress.completedLessons);
  const overall = overallReadiness(progress);
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");
  const greeting = stats.streak > 1 ? `Day ${stats.streak}` : stats.xp ? "Welcome back" : "Start a path";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{greeting}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {upcoming ? upcoming.title : "You cleared the lesson path"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Short interactive A+ paths — try a beat, then read why. Not a textbook dump, and not official CompTIA.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatPill label="Streak" value={`${stats.streak}d`} hint="Sydney calendar" />
        <StatPill label="Level" value={stats.levelTitle} hint={`${stats.xp} XP`} />
        <StatPill label="Ready" value={`${overall.percent}%`} hint={overall.status} />
      </div>

      <div className="mb-4 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Today</p>
        <p className="mt-2 text-xl font-semibold">
          {upcoming ? `Continue ${upcoming.title}` : "Practice a ticket"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {upcoming
            ? `${upcoming.exam === "220-1101" ? "Core 1" : "Core 2"} · Domain ${upcoming.number} · ${upcoming.weight}`
            : "Lessons are done on this device. Keep the streak with a fresh lab ticket."}
        </p>
        <div className="mt-4">
          <ProgressBar value={stats.levelPercent} label={`To ${stats.nextTitle ?? "max"}`} />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={upcoming ? `/learn/${upcoming.id}` : "/lab"}
            className="flex-1 rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background"
          >
            {upcoming ? "Continue" : "Generate a ticket"}
          </Link>
          <Link
            href="/lab"
            className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
          >
            Lab
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <ReadinessGlance href="/ready" label="Core 1" percent={core1.percent} status={core1.status} />
        <ReadinessGlance href="/ready" label="Core 2" percent={core2.percent} status={core2.status} />
      </div>

      <h2 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-muted">
        Core 1 path
      </h2>
      <CoursePath exam="220-1101" />
      <h2 className="mt-10 mb-3 text-center text-sm font-medium uppercase tracking-wider text-muted">
        Core 2 path
      </h2>
      <CoursePath exam="220-1102" />

      {ready && stats.lessonsDone === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Progress stays on this device. Exam-ready is gated — a high XP number is not a pass.
        </p>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-3">
        <Disclaimer compact />
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all local progress and tickets on this device?")) {
              resetProgress();
            }
          }}
          className="shrink-0 text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Reset
        </button>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        {domains.length} paths · {stats.lessonsDone} finished · {stats.quizzesDone} quizzes ·{" "}
        {stats.scenariosDone} tickets
      </p>
    </div>
  );
}

function StatPill({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 truncate font-semibold">{value}</p>
      <p className="mt-0.5 truncate text-[11px] text-muted">{hint}</p>
    </div>
  );
}

function ReadinessGlance({
  href,
  label,
  percent,
  status,
}: {
  href: string;
  label: string;
  percent: number;
  status: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-border bg-surface p-4 hover:border-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <p className="font-mono text-sm">{percent}%</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn("h-full rounded-full bg-accent")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">{status}</p>
    </Link>
  );
}
