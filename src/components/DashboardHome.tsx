"use client";

import Link from "next/link";
import { SUBJECTS, getDomainsBySubject, pathHref } from "@/content/registry";
import { SubjectPicker } from "./SubjectPicker";
import { useProgress } from "./ProgressProvider";
import { nextDomain } from "./CoursePath";
import { Disclaimer } from "./ui";
import { getSubject } from "@/content/subjects";

export function DashboardHome() {
  const { ready, stats, progress, resetProgress } = useProgress();
  const last = progress.lastSubject;
  const upcoming = last ? nextDomain(progress.completedLessons, last) : undefined;
  const lastMeta = last ? getSubject(last) : undefined;
  const firstRun = !last && stats.lessonsDone === 0;
  const greeting = firstRun
    ? "Pick a subject"
    : stats.streak > 1
      ? `Day ${stats.streak}`
      : stats.xp
        ? "Welcome back"
        : "Pick a subject";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{greeting}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {firstRun
            ? "Pick a subject"
            : upcoming
              ? upcoming.title
              : lastMeta
                ? lastMeta.title
                : "Pick a subject"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          {firstRun
            ? "Study bites across Tech, STEM, world, make, and life. Pick a hub — a four-minute first lesson is waiting. Not CompTIA, Brilliant, or Duolingo."
            : "Interactive bites across every hub. Try a lesson, then a short why. Not a textbook dump — and not CompTIA, a school, or Brilliant."}
        </p>
      </div>

      {firstRun ? (
        <>
          <ul className="mb-4 flex flex-wrap justify-center gap-2">
            {["Lesson", "Quiz", "Project", "Helpdesk ticket", "Flashcards"].map((label) => (
              <li
                key={label}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted"
              >
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/brain/feed"
            className="mb-8 block rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Brain Gym</p>
            <p className="mt-2 text-xl font-semibold">Scroll Brain Gym</p>
            <p className="mt-1 text-sm text-muted">
              Open the phone feed — short challenges instead of empty scrolling. No hub pick
              required.
            </p>
            <span className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background">
              Open phone feed
            </span>
          </Link>
        </>
      ) : (
        <div className="mb-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Today</p>
          <p className="mt-2 text-xl font-semibold">
            {upcoming?.cluster === "Start here"
              ? `Start ${lastMeta?.title ?? "this hub"} · 4 min`
              : upcoming
                ? `Continue ${upcoming.title}`
                : `Keep going in ${lastMeta?.title ?? "your hub"}`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {upcoming?.cluster === "Start here"
              ? "One short lesson so XP, streak, and Binder can move."
              : upcoming
                ? `${lastMeta?.title ?? upcoming.subject} · ${upcoming.exam ? `Domain ${upcoming.number}` : `Path ${upcoming.number}`}`
                : "Open a quiz, a project, or another subject."}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href={upcoming ? pathHref(upcoming) : last ? `/learn/${last}` : "/learn"}
              className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background active:brightness-110"
            >
              {upcoming?.cluster === "Start here"
                ? "Start today’s lesson"
                : upcoming
                  ? "Continue"
                  : "Open hub"}
            </Link>
            <Link
              href="/brain/feed"
              className="flex min-h-12 items-center justify-center rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold active:bg-surface-2"
            >
              Scroll Brain Gym
            </Link>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-muted">
        Subjects
      </h2>
      <div className="mb-8">
        <SubjectPicker
          preferStarter={firstRun || stats.lessonsDone === 0}
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

      {!firstRun ? (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <Link href="/lingo" className="rounded-3xl border border-accent/30 bg-surface p-4 active:border-accent/50">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Speak</p>
            <p className="mt-1 text-sm font-medium">Languages · French, Indonesian, Icelandic</p>
          </Link>
          <Link href="/brain/feed" className="rounded-3xl border border-accent/30 bg-surface p-4 active:border-accent/50">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Brain Gym</p>
            <p className="mt-1 text-sm font-medium">Phone feed of short challenges</p>
          </Link>
          <Link href="/projects" className="rounded-3xl border border-accent/30 bg-surface p-4 hover:border-accent/50">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Projects</p>
            <p className="mt-1 text-sm font-medium">Hands-on builds in every hub</p>
          </Link>
          {last === "tech" ? (
            <Link href="/lab" className="rounded-3xl border border-border bg-surface p-4 active:border-accent/40">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Tech Lab</p>
              <p className="mt-1 text-sm font-medium">Helpdesk tickets</p>
            </Link>
          ) : (
            <Link href="/progress" className="rounded-3xl border border-border bg-surface p-4 active:border-accent/40">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Progress</p>
              <p className="mt-1 text-sm font-medium">Per-hub totals, export, Binder</p>
            </Link>
          )}
        </div>
      ) : (
        <p className="mb-8 text-center text-sm text-muted">
          After you pick a hub, one button starts a 4-minute lesson. XP, streak, and Binder move when you finish it.
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <Disclaimer compact />
        {ready ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all progress, tickets, and the Binder?")) {
                resetProgress();
              }
            }}
            className="shrink-0 text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        {stats.lessonsDone} paths · {stats.quizzesDone} quizzes · {stats.projectsDone} projects ·{" "}
        {stats.scenariosDone} tickets · {stats.cardsOwned} cards
      </p>
    </div>
  );
}
