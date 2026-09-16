"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubjectId } from "@/content/types";
import { SUBJECTS, getSubject, isSubjectId } from "@/content/registry";
import { getProjectsBySubject, projectHref, projects } from "@/content/projects";
import { useProgress } from "./ProgressProvider";
import { Badge, DifficultyBadge } from "./ui";
import { cn } from "@/lib/cn";

type Filter = "all" | SubjectId;

export function ProjectsCatalog({ initialHub }: { initialHub?: string }) {
  const start: Filter =
    initialHub && isSubjectId(initialHub) ? initialHub : "all";
  const [filter, setFilterState] = useState<Filter>(start);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { projectDone, projectChecked, stats } = useProgress();

  function setFilter(id: Filter) {
    setFilterState(id);
    router.replace(id === "all" ? "/projects" : `/projects?hub=${id}`, { scroll: false });
  }

  const list = useMemo(() => {
    const pool = filter === "all" ? projects : getProjectsBySubject(filter);
    const needle = query.trim().toLowerCase();
    if (!needle) return pool;
    return pool.filter((project) => {
      const hay = `${project.title} ${project.blurb} ${project.goal} ${project.subject}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [filter, query]);

  return (
    <>
      <label className="mb-4 block">
        <span className="sr-only">Search projects</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm outline-none ring-accent/30 focus:ring-2"
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
        {list.length} project{list.length === 1 ? "" : "s"}
        {filter !== "all" ? ` · ${getSubject(filter)?.title}` : ""}
        {" · "}
        {stats.projectsDone}/{stats.projectsTotal} done on this device
      </p>
      <div className="grid gap-3">
        {list.map((project) => {
          const done = projectDone(project.id);
          const checked = projectChecked(project.id).length;
          const total = project.checklist.length;
          const meta = getSubject(project.subject);
          return (
            <Link
              key={project.id}
              href={projectHref(project)}
              className={cn(
                "rounded-3xl border bg-surface px-4 py-4 hover:border-accent/40",
                done ? "border-ok/25 bg-ok/5" : "border-border",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">{meta?.title ?? project.subject}</Badge>
                <DifficultyBadge level={project.difficulty} />
                <Badge tone="muted">{project.minutes} min</Badge>
                <Badge tone="muted">+{project.xp} XP</Badge>
                {done ? <Badge tone="ok">Done</Badge> : checked ? <Badge tone="warn">{checked}/{total}</Badge> : null}
              </div>
              <p className="mt-3 text-lg font-semibold">{project.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{project.blurb}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
