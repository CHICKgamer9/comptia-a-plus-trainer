"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Domain, SubjectId } from "@/content/types";
import { domainCluster, getDomainsBySubject, pathHref } from "@/content/registry";
import { useProgress } from "./ProgressProvider";
import { Badge, ExamBadge } from "./ui";
import { cn } from "@/lib/cn";

type StatusFilter = "all" | "todo" | "done";

export function PathCatalog({ subject }: { subject: SubjectId }) {
  const { progress, quizBest } = useProgress();
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const all = useMemo(() => getDomainsBySubject(subject), [subject]);

  const clusters = useMemo(() => {
    const names: string[] = [];
    for (const domain of all) {
      const name = domainCluster(domain);
      if (!names.includes(name)) names.push(name);
    }
    return names;
  }, [all]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all.filter((domain) => {
      const name = domainCluster(domain);
      if (cluster !== "all" && name !== cluster) return false;
      const done = progress.completedLessons.includes(domain.lessonId);
      if (status === "todo" && done) return false;
      if (status === "done" && !done) return false;
      if (!needle) return true;
      const hay = `${domain.title} ${domain.summary} ${name}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [all, cluster, status, query, progress.completedLessons]);

  const grouped = useMemo(() => {
    const map = new Map<string, Domain[]>();
    for (const domain of filtered) {
      const name = domainCluster(domain);
      const list = map.get(name) ?? [];
      list.push(domain);
      map.set(name, list);
    }
    return clusters
      .filter((name) => map.has(name))
      .map((name) => ({ name, items: map.get(name) ?? [] }));
  }, [filtered, clusters]);

  const doneCount = all.filter((domain) => progress.completedLessons.includes(domain.lessonId)).length;
  const starter = all.find((domain) => domain.cluster === "Start here");

  return (
    <div className="mx-auto max-w-2xl">
      {starter && !progress.completedLessons.includes(starter.lessonId) ? (
        <Link
          href={pathHref(starter)}
          className="mb-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background"
        >
          Start today’s lesson · 4 min
        </Link>
      ) : null}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <label className="block min-w-[12rem] flex-1">
          <span className="sr-only">Search paths</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, topics…"
            className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm outline-none ring-accent/30 focus:ring-2"
          />
        </label>
        <p className="text-xs text-muted">
          {doneCount}/{all.length} done
          {filtered.length !== all.length ? ` · ${filtered.length} shown` : ""}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[{ id: "all", label: "All topics" }, ...clusters.map((name) => ({ id: name, label: name }))].map(
          (option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCluster(option.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                cluster === option.id
                  ? "border-accent/40 bg-accent-dim text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ),
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["todo", "To do"],
            ["done", "Done"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStatus(id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              status === id
                ? "border-accent/40 bg-accent-dim text-accent"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-3xl border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
          No paths match that filter. Clear search or pick another topic.
        </p>
      ) : (
        <div className="grid gap-8">
          {grouped.map((group) => (
            <section key={group.name}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {group.name}
                <span className="ml-2 font-mono font-normal text-muted/80">{group.items.length}</span>
              </h2>
              <ul className="grid gap-2">
                {group.items.map((domain) => {
                  const done = progress.completedLessons.includes(domain.lessonId);
                  const quiz = quizBest(domain.quizId);
                  return (
                    <li key={domain.id}>
                      <Link
                        href={pathHref(domain)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border px-3 py-3 transition",
                          done
                            ? "border-ok/25 bg-ok/5 hover:border-ok/40"
                            : "border-border bg-surface hover:border-accent/40",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                            done ? "border-ok/40 bg-ok/15 text-ok" : "border-border text-muted",
                          )}
                        >
                          {done ? "✓" : domain.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-1.5">
                            {domain.exam ? <ExamBadge exam={domain.exam} /> : null}
                            {domain.weight ? <Badge tone="muted">{domain.weight}</Badge> : null}
                          </span>
                          <span className="mt-0.5 block truncate font-semibold">{domain.title}</span>
                          <span className="block truncate text-xs text-muted">{domain.summary}</span>
                        </span>
                        <span className="shrink-0 text-xs text-accent">
                          {done ? "Replay" : "Start"}
                          {quiz ? ` · ${quiz.score}/${quiz.total}` : ""}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
