"use client";

import Link from "next/link";
import { CONTENT_COUNTS, domains, quizzes, scenarios } from "@/content";
import { useProgress } from "./ProgressProvider";
import { ContinueLink, RandomTicketLink } from "./ContinueLink";
import { Card, Disclaimer, PageHeader, ProgressBar } from "./ui";
import { examShort } from "@/lib/labels";

export function DashboardHome() {
  const { ready, stats, progress, resetProgress } = useProgress();
  const fresh = ready && stats.percent === 0;
  const complete = ready && stats.percent === 100;

  return (
    <div>
      <PageHeader
        kicker="TicketBench"
        title="Study the domains. Close the tickets."
        description="Original lessons and exam-style quizzes for CompTIA A+ Core 1 (220-1101) and Core 2 (220-1102), plus a helpdesk lab that scores how you gather facts, pick tools, name the cause, and apply the fix."
        actions={
          <>
            <ContinueLink className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background">
              {fresh ? "Start with Core 1" : "Continue studying"}
            </ContinueLink>
            <RandomTicketLink className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2">
              Random ticket
            </RandomTicketLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Overall</p>
          <p className="mt-2 font-mono text-3xl">{ready ? `${stats.percent}%` : "—"}</p>
          <div className="mt-4">
            <ProgressBar value={ready ? stats.percent : 0} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {ready
              ? `${stats.lessonsDone}/${stats.lessonsTotal} lessons · ${stats.quizzesDone}/${stats.quizzesTotal} quizzes · ${stats.scenariosDone}/${stats.scenariosTotal} tickets`
              : "Loading saved progress…"}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">In the library</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{CONTENT_COUNTS.lessons} domain lessons</li>
            <li>{CONTENT_COUNTS.questions} quiz questions</li>
            <li>{CONTENT_COUNTS.scenarios} multi-step tickets</li>
            <li>{CONTENT_COUNTS.cheatsheets} quick-reference sheets</li>
          </ul>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">How this works</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm leading-6 text-foreground/85">
            <li>Read a domain in plain language.</li>
            <li>Take the mapped quiz — explanations after every pick.</li>
            <li>Run a ticket: gather → tools → cause → fix.</li>
          </ol>
        </Card>
      </div>

      {complete ? (
        <Card className="mt-4 border-ok/30 bg-ok/5">
          <p className="font-medium text-ok">You have touched every lesson, quiz, and ticket.</p>
          <p className="mt-2 text-sm text-muted">
            Retake weak quizzes and hard tickets. Progress is stored only in this browser.
          </p>
        </Card>
      ) : null}

      {fresh ? (
        <Card className="mt-4">
          <p className="font-medium">Nothing saved yet — that is expected.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Progress lives in localStorage on this device. No account required. Start with
            Mobile Devices or jump a ticket if you learn faster by doing.
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
          const relatedTickets = scenarios.filter((scenario) =>
            scenario.domainIds.includes(domain.id),
          ).length;
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
                {relatedTickets ? ` · ${relatedTickets} related tickets` : ""}
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
            if (window.confirm("Reset all local progress on this device?")) {
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
