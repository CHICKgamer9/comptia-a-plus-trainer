"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Domain, Quiz, SubjectId } from "@/content/types";
import { SUBJECTS, pathHref } from "@/content";
import { useProgress } from "./ProgressProvider";
import { Badge, ExamBadge } from "./ui";
import { cn } from "@/lib/cn";

type Filter = "all" | SubjectId;

export function QuizCatalog({ quizzes, domains }: { quizzes: Quiz[]; domains: Domain[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { quizBest } = useProgress();
  const domainById = useMemo(
    () => Object.fromEntries(domains.map((domain) => [domain.id, domain])),
    [domains],
  );
  const list = useMemo(
    () =>
      quizzes.filter((quiz) => {
        const domain = domainById[quiz.domainId];
        return domain && (filter === "all" || domain.subject === filter);
      }),
    [quizzes, domainById, filter],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ id: "all" as const, label: "All" }, ...SUBJECTS.map((subject) => ({ id: subject.id, label: subject.title }))].map(
          (option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                filter === option.id
                  ? "border-accent/40 bg-accent-dim text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ),
        )}
      </div>
      <div className="grid gap-3">
        {list.map((quiz) => {
          const domain = domainById[quiz.domainId];
          const best = quizBest(quiz.id);
          return (
            <Link
              key={quiz.id}
              href={`/practice/${quiz.id}`}
              className="flex items-center gap-4 rounded-3xl border border-border bg-surface px-4 py-3 hover:border-accent/40"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border text-sm font-semibold">
                {domain?.number ?? "?"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{quiz.title}</span>
                <span className="block text-xs text-muted">
                  {domain?.subject ?? "path"} · {quiz.questions.length} problems
                </span>
              </span>
              {best ? (
                <Badge tone={best.score / best.total >= 0.8 ? "ok" : "warn"}>
                  {best.score}/{best.total}
                </Badge>
              ) : (
                <Badge tone="muted">Start</Badge>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function DomainCatalog({ domains }: { domains: Domain[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { progress } = useProgress();
  const list = useMemo(
    () => domains.filter((domain) => filter === "all" || domain.subject === filter),
    [domains, filter],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ id: "all" as const, label: "All" }, ...SUBJECTS.map((subject) => ({ id: subject.id, label: subject.title }))].map(
          (option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                filter === option.id
                  ? "border-accent/40 bg-accent-dim text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ),
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((domain) => {
          const done = progress.completedLessons.includes(domain.lessonId);
          return (
            <Link
              key={domain.id}
              href={pathHref(domain)}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                {domain.exam ? <ExamBadge exam={domain.exam} /> : <Badge tone="accent">{domain.subject}</Badge>}
                <Badge tone="muted">Path {domain.number}</Badge>
                {domain.weight ? <Badge tone="muted">{domain.weight}</Badge> : null}
                {done ? <Badge tone="ok">Read</Badge> : null}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{domain.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{domain.summary}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
