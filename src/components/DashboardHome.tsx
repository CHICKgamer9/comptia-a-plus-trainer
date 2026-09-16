"use client";

import Link from "next/link";
import { CONTENT_COUNTS, domains, quizzes } from "@/content";
import { useProgress } from "./ProgressProvider";
import { ContinueLink, RandomTicketLink } from "./ContinueLink";
import { Card, Disclaimer, PageHeader, ProgressBar } from "./ui";
import { examShort } from "@/lib/labels";
import { examReadiness, overallReadiness } from "@/lib/readiness";
import { ReadinessCard } from "./ReadinessPanel";
import { getBadge } from "@/lib/badges";
import { labThemeForDomain } from "@/content";

export function DashboardHome() {
  const { ready, stats, progress, resetProgress } = useProgress();
  const fresh = ready && stats.lessonsDone === 0 && stats.quizzesDone === 0 && stats.scenariosDone === 0;
  const overall = overallReadiness(progress);
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");
  const recentBadges = [...(progress.game?.badges ?? [])].slice(-3).reverse();

  return (
    <div>
      <PageHeader
        kicker="TicketBench"
        title="Study the domains. Close the tickets."
        description="Original lessons and exam-style quizzes for CompTIA A+ Core 1 (220-1101) and Core 2 (220-1102), plus an AI helpdesk lab. Progress, XP, and readiness stay on this device."
        actions={
          <>
            <ContinueLink className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background">
              {fresh ? "Start with Core 1" : "Continue studying"}
            </ContinueLink>
            <RandomTicketLink className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2">
              New ticket
            </RandomTicketLink>
          </>
        }
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">{stats.levelTitle}</p>
          <p className="mt-2 font-mono text-3xl">{stats.xp} XP</p>
          <div className="mt-4">
            <ProgressBar
              value={stats.levelPercent}
              label={
                stats.nextTitle
                  ? `To ${stats.nextTitle} (${stats.nextAt} XP)`
                  : "Max level on this track"
              }
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            Streak: {stats.streak} day{stats.streak === 1 ? "" : "s"} (Sydney calendar)
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Coverage</p>
          <p className="mt-2 text-sm leading-6">
            {stats.lessonsDone}/{stats.lessonsTotal} lessons · {stats.quizzesDone}/
            {stats.quizzesTotal} quizzes · {stats.scenariosDone} tickets closed
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            <li>{CONTENT_COUNTS.lessons} domain lessons</li>
            <li>{CONTENT_COUNTS.questions} quiz questions</li>
            <li>AI-generated lab tickets (plus one offline stub)</li>
          </ul>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Recent badges</p>
          {recentBadges.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {recentBadges.map((id) => {
                const badge = getBadge(id);
                return (
                  <li key={id}>
                    <span className="font-medium">{badge?.title ?? id}</span>
                    <span className="block text-xs text-muted">{badge?.blurb}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Finish a lesson, quiz, or ticket to start unlocking badges.
            </p>
          )}
        </Card>
      </div>

      <div className="mb-2 flex items-end justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Ready for the exam?
        </h2>
        <Link href="/ready" className="text-sm text-accent hover:underline">
          Full rubric
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ReadinessCard report={overall} compact />
        <ReadinessCard report={core1} compact />
        <ReadinessCard report={core2} compact />
      </div>

      {fresh ? (
        <Card className="mt-4">
          <p className="font-medium">Nothing saved yet — that is expected.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Progress lives in localStorage on this device. No account required. The meter will
            not say Exam-ready until lessons, quizzes, and lab practice all clear a strict bar.
          </p>
        </Card>
      ) : null}

      <h2 className="mt-10 mb-3 text-sm font-medium uppercase tracking-wider text-muted">
        Domains
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {domains.map((domain) => {
          const lessonDone = progress.completedLessons.includes(domain.lessonId);
          const quiz = quizzes.find((item) => item.id === domain.quizId);
          const quizScore = progress.quizScores[domain.quizId];
          return (
            <Link
              key={domain.id}
              href={`/learn/${domain.id}`}
              className="rounded-2xl border border-border bg-surface p-4 hover:border-accent/40"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  {examShort(domain.exam)} · Domain {domain.number} · {domain.weight}
                </p>
                {lessonDone ? (
                  <span className="text-[11px] text-ok">Lesson done</span>
                ) : (
                  <span className="text-[11px] text-muted">Not read</span>
                )}
              </div>
              <p className="mt-2 font-medium">{domain.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{domain.summary}</p>
              <p className="mt-3 text-xs text-muted">
                Quiz{" "}
                {quizScore
                  ? `${quizScore.score}/${quizScore.total}`
                  : quiz
                    ? `${quiz.questions.length} items`
                    : "—"}
                {" · "}
                <span className="text-accent">
                  Lab: {labThemeForDomain(domain.id)}
                </span>
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Disclaimer compact />
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all local progress and tickets on this device?")) {
              resetProgress();
            }
          }}
          className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}
