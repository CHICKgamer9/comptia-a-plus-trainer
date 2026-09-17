"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Domain, SubjectId } from "@/content/types";
import { SUBJECTS, domainCluster, pathHref } from "@/content/registry";
import { useProgress } from "./ProgressProvider";
import { Badge, ExamBadge } from "./ui";
import { cn } from "@/lib/cn";

type Filter = "all" | SubjectId;

const PAGE = 48;

export type QuizListItem = {
  id: string;
  title: string;
  domainId: string;
  questionCount: number;
};

export function QuizCatalog({ quizzes, domains }: { quizzes: QuizListItem[]; domains: Domain[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const { quizBest } = useProgress();
  const domainById = useMemo(
    () => Object.fromEntries(domains.map((domain) => [domain.id, domain])),
    [domains],
  );
  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      const domain = domainById[quiz.domainId];
      if (!domain) return false;
      if (filter !== "all" && domain.subject !== filter) return false;
      if (!needle) return true;
      const hay = `${quiz.title} ${domain.title} ${domainCluster(domain)} ${domain.subject}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [quizzes, domainById, filter, query]);

  const shown = list.slice(0, PAGE);

  return (
    <>
      <label className="sticky top-[calc(var(--header-height)+env(safe-area-inset-top))] z-20 mb-4 block -mx-4 bg-background/90 px-4 py-2 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <span className="sr-only">Search quizzes</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search quizzes…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-base outline-none ring-accent/30 focus:ring-2 md:text-sm"
        />
      </label>
      <div className="mb-4 flex flex-wrap gap-2">
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
      <p className="mb-4 text-xs text-muted">
        {list.length} quiz{list.length === 1 ? "" : "zes"}
        {list.length > PAGE ? ` · showing first ${PAGE} — search or pick a subject` : ""}
      </p>
      <div className="grid gap-3">
        {shown.map((quiz) => {
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
                  {domain?.subject ?? "path"}
                  {domain ? ` · ${domainCluster(domain)}` : ""} · {quiz.questionCount} problems
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
  const [query, setQuery] = useState("");
  const { progress } = useProgress();
  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return domains.filter((domain) => {
      if (filter !== "all" && domain.subject !== filter) return false;
      if (!needle) return true;
      return `${domain.title} ${domain.summary} ${domainCluster(domain)}`.toLowerCase().includes(needle);
    });
  }, [domains, filter, query]);
  const shown = list.slice(0, PAGE);

  return (
    <>
      <label className="sticky top-[calc(var(--header-height)+env(safe-area-inset-top))] z-20 mb-4 block -mx-4 bg-background/90 px-4 py-2 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <span className="sr-only">Search paths</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search paths…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-base outline-none ring-accent/30 focus:ring-2 md:text-sm"
        />
      </label>
      <div className="mb-4 flex flex-wrap gap-2">
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
      <p className="mb-4 text-xs text-muted">
        {list.length} path{list.length === 1 ? "" : "s"}
        {list.length > PAGE ? ` · showing first ${PAGE}` : ""}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {shown.map((domain) => {
          const done = progress.completedLessons.includes(domain.lessonId);
          return (
            <Link
              key={domain.id}
              href={pathHref(domain)}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                {domain.exam ? <ExamBadge exam={domain.exam} /> : <Badge tone="accent">{domain.subject}</Badge>}
                <Badge tone="muted">{domainCluster(domain)}</Badge>
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
