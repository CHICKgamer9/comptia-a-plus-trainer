"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Domain, ExamId, Quiz, Scenario } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { Badge, Card, DifficultyBadge, ExamBadge, ThemeBadge } from "./ui";
import { examShort } from "@/lib/labels";
import { cn } from "@/lib/cn";

type Filter = "all" | ExamId;

function FilterRow({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
}) {
  const options: { id: Filter; label: string }[] = [
    { id: "all", label: "Both exams" },
    { id: "220-1101", label: "Core 1" },
    { id: "220-1102", label: "Core 2" },
  ];
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            value === option.id
              ? "border-accent/40 bg-accent-dim text-accent"
              : "border-border text-muted hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function DomainCatalog({ domains }: { domains: Domain[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { progress } = useProgress();
  const list = useMemo(
    () => domains.filter((domain) => filter === "all" || domain.exam === filter),
    [domains, filter],
  );

  return (
    <>
      <FilterRow value={filter} onChange={setFilter} />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((domain) => {
          const done = progress.completedLessons.includes(domain.lessonId);
          return (
            <Link
              key={domain.id}
              href={`/learn/${domain.id}`}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <ExamBadge exam={domain.exam} />
                <Badge tone="muted">Domain {domain.number}</Badge>
                <Badge tone="muted">{domain.weight}</Badge>
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
        return domain && (filter === "all" || domain.exam === filter);
      }),
    [quizzes, domainById, filter],
  );

  return (
    <>
      <FilterRow value={filter} onChange={setFilter} />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((quiz) => {
          const domain = domainById[quiz.domainId];
          const best = quizBest(quiz.id);
          return (
            <Link
              key={quiz.id}
              href={`/practice/${quiz.id}`}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                {domain ? <ExamBadge exam={domain.exam} /> : null}
                {best ? (
                  <Badge tone={best.score / best.total >= 0.8 ? "ok" : "warn"}>
                    Best {best.score}/{best.total}
                  </Badge>
                ) : (
                  <Badge tone="muted">Not taken</Badge>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{quiz.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {quiz.questions.length} questions · explanations after each answer
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function ScenarioCatalog({ scenarios }: { scenarios: Scenario[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { scenarioBest } = useProgress();
  const list = useMemo(
    () => scenarios.filter((scenario) => filter === "all" || scenario.exam === filter),
    [scenarios, filter],
  );

  if (!list.length) {
    return (
      <Card>
        <p className="text-muted">No tickets in this filter.</p>
      </Card>
    );
  }

  return (
    <>
      <FilterRow value={filter} onChange={setFilter} />
      <div className="grid gap-3">
        {list.map((scenario) => {
          const best = scenarioBest(scenario.id);
          return (
            <Link
              key={scenario.id}
              href={`/lab/${scenario.id}`}
              className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-warn">{scenario.ticketId}</span>
                <ExamBadge exam={scenario.exam} />
                <ThemeBadge theme={scenario.theme} />
                <DifficultyBadge level={scenario.difficulty} />
                {best ? (
                  <Badge tone={best.score === best.total ? "ok" : "warn"}>
                    Best {best.score}/{best.total}
                  </Badge>
                ) : (
                  <Badge tone="muted">New</Badge>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{scenario.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{scenario.summary}</p>
              <p className="mt-3 text-xs text-muted">
                {scenario.requester} · {scenario.steps.length} steps · ~{scenario.minutes} min ·{" "}
                {examShort(scenario.exam)}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
