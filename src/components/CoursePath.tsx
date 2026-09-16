"use client";

import Link from "next/link";
import { domains, getSubject, pathHref } from "@/content/registry";
import type { Domain, ExamId, SubjectId } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { cn } from "@/lib/cn";
import { examShort } from "@/lib/labels";

export function nextDomain(completedLessons: string[], subject?: SubjectId): Domain | undefined {
  const pool = subject ? domains.filter((domain) => domain.subject === subject) : domains;
  return pool.find((domain) => !completedLessons.includes(domain.lessonId));
}

export function nextDomainPreferring(completedLessons: string[], lastSubject?: SubjectId) {
  return nextDomain(completedLessons, lastSubject) ?? nextDomain(completedLessons);
}

export function CoursePath({
  subject,
  exam,
}: {
  subject?: SubjectId;
  exam?: ExamId;
}) {
  const { progress, quizBest } = useProgress();
  const list = domains.filter((domain) => {
    if (subject && domain.subject !== subject) return false;
    if (exam && domain.exam !== exam) return false;
    return true;
  });
  const upcoming = nextDomain(progress.completedLessons, subject ?? list[0]?.subject);

  return (
    <ol className="relative mx-auto grid max-w-xl grid-cols-1 gap-3">
      {list.map((domain, index) => {
        const done = progress.completedLessons.includes(domain.lessonId);
        const quiz = quizBest(domain.quizId);
        const current = upcoming?.id === domain.id;
        const kicker = domain.exam
          ? `${examShort(domain.exam)}${domain.weight ? ` · ${domain.weight}` : ""}`
          : (getSubject(domain.subject)?.kicker ?? domain.subject);
        return (
          <li key={domain.id}>
            <Link
              href={pathHref(domain)}
              className={cn(
                "flex items-center gap-4 rounded-3xl border px-4 py-3 transition",
                current && "border-accent/50 bg-accent-dim/40 shadow-[0_0_0_4px_rgba(45,212,191,0.08)]",
                done && !current && "border-ok/25 bg-ok/5",
                !done && !current && "border-border bg-surface hover:border-accent/30",
              )}
            >
              <span
                className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                  done && "border-ok/40 bg-ok/15 text-ok",
                  current && "border-accent bg-accent text-background",
                  !done && !current && "border-border text-muted",
                )}
              >
                {done ? "✓" : domain.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] uppercase tracking-wider text-muted">
                  {kicker}
                </span>
                <span className="block truncate font-semibold">{domain.title}</span>
                <span className="block text-xs text-muted">
                  {done ? "Path complete" : current ? "Up next" : "Open"}
                  {quiz ? ` · quiz ${quiz.score}/${quiz.total}` : ""}
                </span>
              </span>
              <span className="text-xs text-accent">{current ? "Continue" : done ? "Replay" : "Start"}</span>
            </Link>
            {index < list.length - 1 ? (
              <div className="mx-10 h-3 w-px bg-border" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
