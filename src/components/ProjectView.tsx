"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content/types";
import { getDomain, getSubject, pathHref } from "@/content/registry";
import { projectsHubHref } from "@/content/projects";
import { useProgress } from "./ProgressProvider";
import { Badge, Card, DifficultyBadge, ProgressBar } from "./ui";
import { cn } from "@/lib/cn";

export function ProjectView({ project }: { project: Project }) {
  const { projectDone, projectChecked, toggleProjectCheck, markProjectComplete, setLastSubject } =
    useProgress();
  const meta = getSubject(project.subject);
  const checked = projectChecked(project.id);
  const done = projectDone(project.id);
  const total = project.checklist.length;
  const checkedCount = project.checklist.filter((item) => checked.includes(item.id)).length;
  const allChecked = total > 0 && checkedCount === total;
  const percent = total ? Math.round((checkedCount / total) * 100) : 0;
  const related = (project.pathIds ?? [])
    .map((id) => getDomain(id))
    .filter((domain): domain is NonNullable<typeof domain> => Boolean(domain));

  return (
    <div
      className="mx-auto max-w-3xl"
      style={
        meta
          ? ({
              "--accent": meta.accent,
              "--accent-dim": meta.accentDim,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href={projectsHubHref(project.subject)} className="text-sm text-muted hover:text-foreground">
          ← Projects
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge tone="accent">{meta?.title ?? project.subject}</Badge>
          <DifficultyBadge level={project.difficulty} />
          {done ? <Badge tone="ok">Done</Badge> : <Badge tone="muted">{project.minutes} min</Badge>}
        </div>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        {meta?.kicker ?? "Project"}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">{project.title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted">{project.blurb}</p>
      <p className="mt-2 font-mono text-xs text-muted">+{project.xp} XP on complete · stays on this device</p>

      <div className="mt-6">
        <ProgressBar value={percent} label="Done-when checklist" />
      </div>

      <Card className="mt-6 border-accent/25">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Goal</p>
        <p className="mt-2 text-sm leading-6">{project.goal}</p>
      </Card>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Materials / tools</h2>
        <ul className="mt-3 grid gap-2">
          {project.materials.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-6"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Steps</h2>
        <ol className="mt-3 grid gap-3">
          {project.steps.map((step, index) => (
            <li key={step.id} className="rounded-3xl border border-border bg-surface p-5">
              <p className="font-mono text-xs text-accent">
                {index + 1} / {project.steps.length}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Done when</h2>
        <ul className="mt-3 grid gap-2">
          {project.checklist.map((item) => {
            const on = checked.includes(item.id);
            return (
              <li key={item.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6",
                    on ? "border-ok/40 bg-ok/10" : "border-border bg-surface hover:border-accent/40",
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[var(--accent)]"
                    checked={on}
                    onChange={() => toggleProjectCheck(project.id, item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {related.length ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Related paths</h2>
          <ul className="mt-3 grid gap-2">
            {related.map((domain) => (
              <li key={domain.id}>
                <Link
                  href={pathHref(domain)}
                  className="block rounded-2xl border border-border bg-surface px-4 py-3 text-sm hover:border-accent/40"
                >
                  <span className="font-semibold">{domain.title}</span>
                  <span className="mt-1 block text-xs text-muted">{domain.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.id === "tech-helpdesk-reply" ? (
        <p className="mt-6 rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted">
          This is the shared Projects desk, not a generated Lab ticket. After you mark it complete,{" "}
          <Link href="/lab" className="text-accent hover:underline">
            open Lab
          </Link>{" "}
          if you want a Core 1 / Core 2 queue item.
        </p>
      ) : null}

      <div className="mt-8">
        {done ? (
          <p className="rounded-2xl border border-ok/30 bg-ok/10 px-4 py-3.5 text-center text-sm font-semibold text-ok">
            Project complete · XP already on this device
          </p>
        ) : (
          <button
            type="button"
            disabled={!allChecked}
            onClick={() => {
              setLastSubject(project.subject);
              markProjectComplete(project.id, project.xp);
            }}
            className="w-full rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allChecked ? `Mark complete · +${project.xp} XP` : "Tick every done-when item to finish"}
          </button>
        )}
      </div>
    </div>
  );
}
