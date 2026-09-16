"use client";

import Link from "next/link";
import { SUBJECTS, getDomainsBySubject, pathHref } from "@/content/registry";
import { SubjectPicker } from "./SubjectPicker";
import { useProgress } from "./ProgressProvider";
import { nextDomainPreferring } from "./CoursePath";
import { examReadiness, overallReadiness } from "@/lib/readiness";
import { Disclaimer, ProgressBar } from "./ui";
import { cn } from "@/lib/cn";

export function DashboardHome() {
  const { ready, stats, progress, resetProgress } = useProgress();
  const upcoming = nextDomainPreferring(progress.completedLessons, progress.lastSubject);
  const overall = overallReadiness(progress);
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");
  const greeting = stats.streak > 1 ? `Day ${stats.streak}` : stats.xp ? "Welcome back" : "Pick a subject";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{greeting}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {upcoming ? upcoming.title : "Pick a subject"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Interactive bites across Tech (A+), STEM, world, make, and life hubs. Try a beat, then read
          why. Not a textbook dump — and not CompTIA, a school, or Brilliant.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatPill label="Streak" value={`${stats.streak}d`} hint="Sydney calendar" />
        <StatPill label="Level" value={stats.levelTitle} hint={`${stats.xp} XP`} />
        <StatPill label="A+ ready" value={`${overall.percent}%`} hint={overall.status} />
      </div>

      <div className="mb-4 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Today</p>
        <p className="mt-2 text-xl font-semibold">
          {upcoming ? `Continue ${upcoming.title}` : "Replay a path or open a challenge"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {upcoming
            ? upcoming.exam
              ? `${upcoming.exam === "220-1101" ? "Core 1" : "Core 2"} · Domain ${upcoming.number}${upcoming.weight ? ` · ${upcoming.weight}` : ""}`
              : `${upcoming.subject} · Path ${upcoming.number}`
            : "Every authored path on this device is marked done. Keep the streak with a quiz or a challenge."}
        </p>
        <div className="mt-4">
          <ProgressBar value={stats.levelPercent} label={`To ${stats.nextTitle ?? "max"}`} />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={upcoming ? pathHref(upcoming) : "/learn"}
            className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background active:brightness-110"
          >
            {upcoming ? "Continue" : "Browse subjects"}
          </Link>
          <Link
            href="/brain/feed"
            className="flex min-h-12 items-center justify-center rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold active:bg-surface-2"
          >
            Scroll brain instead
          </Link>
        </div>
      </div>

      <h2 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-muted">
        Subjects
      </h2>
      <div className="mb-8">
        <SubjectPicker
          doneBySubject={Object.fromEntries(
            SUBJECTS.map((subject) => {
              const list = getDomainsBySubject(subject.id);
              const done = list.filter((domain) =>
                progress.completedLessons.includes(domain.lessonId),
              ).length;
              return [subject.id, done];
            }),
          )}
        />
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/brain/feed"
          className="rounded-3xl border border-accent/30 bg-surface p-4 active:border-accent/50"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Replace the scroll</p>
          <p className="mt-1 text-sm font-medium">Open phone feed · Brain Gym</p>
          <p className="mt-1 text-xs text-muted">
            Vertical challenge cards instead of TikTok-style empty scrolling. Tiny skip cost. Sydney day.
          </p>
        </Link>
        <Link
          href="/lab"
          className="rounded-3xl border border-border bg-surface p-4 active:border-accent/40"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">A+ lab</p>
          <p className="mt-1 text-sm font-medium">Helpdesk tickets for Core 1 / Core 2</p>
          <p className="mt-1 text-xs text-muted">Separate from Brain Gym. Still on this device.</p>
        </Link>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <ReadinessGlance href="/ready" label="Core 1" percent={core1.percent} status={core1.status} />
        <ReadinessGlance href="/ready" label="Core 2" percent={core2.percent} status={core2.status} />
      </div>

      {ready && stats.lessonsDone === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Progress stays on this device. A+ exam-ready is gated — a high XP number is not a pass.
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
        {stats.lessonsDone} paths finished · {stats.quizzesDone} quizzes · {stats.scenariosDone}{" "}
        tickets/challenges
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
