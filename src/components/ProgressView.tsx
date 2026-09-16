"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SUBJECTS, getDomainsBySubject } from "@/content/registry";
import { examForTrack } from "@/lib/exam";
import { examReadiness } from "@/lib/readiness";
import { PageHeader, ProgressBar } from "./ui";
import { ReadinessCard, RubricNote } from "./ReadinessPanel";
import { useProgress } from "./ProgressProvider";
import { cn } from "@/lib/cn";

export function ProgressView() {
  const {
    progress,
    stats,
    setExamTrack,
    exportProgress,
    importProgress,
    resetProgress,
  } = useProgress();
  const track = progress.examTrack === "v14" ? "v14" : "v15";
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const core1 = examReadiness(progress, examForTrack(1, track));
  const core2 = examReadiness(progress, examForTrack(2, track));

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        kicker="Progress"
        title="Every hub, one ledger"
        description="Per-subject completion, export/import, and sheets. A+ Ready is Tech only."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted">XP</p>
          <p className="mt-1 font-semibold">{stats.xp}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted">Streak</p>
          <p className="mt-1 font-semibold">{stats.streak}d</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted">Level</p>
          <p className="mt-1 font-semibold">{stats.levelTitle}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-3">
        {SUBJECTS.map((subject) => {
          const list = getDomainsBySubject(subject.id);
          const done = list.filter((domain) =>
            progress.completedLessons.includes(domain.lessonId),
          ).length;
          const percent = list.length ? Math.round((done / list.length) * 100) : 0;
          return (
            <Link
              key={subject.id}
              href={`/learn/${subject.id}`}
              className="rounded-2xl border border-border bg-surface p-4 hover:border-accent/40"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{subject.title}</span>
                <span className="font-mono text-xs text-muted">
                  {done}/{list.length}
                </span>
              </div>
              <ProgressBar value={percent} />
            </Link>
          );
        })}
      </div>

      <Link href="/reference" className="mb-8 block rounded-3xl border border-border bg-surface p-5 hover:border-accent/40">
        <p className="text-[11px] uppercase tracking-wider text-muted">Sheets</p>
        <p className="mt-1 font-semibold">Quick reference</p>
        <p className="mt-1 text-sm text-muted">Ports, RAID, and pocket tables. Binder lives under Learn.</p>
      </Link>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">A+ Ready · Tech hub</h2>
          <div className="flex rounded-full border border-border p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setExamTrack("v15")}
              className={cn(
                "rounded-full px-3 py-1",
                track === "v15" ? "bg-accent-dim text-accent" : "text-muted",
              )}
            >
              220-1201 / 1202
            </button>
            <button
              type="button"
              onClick={() => setExamTrack("v14")}
              className={cn(
                "rounded-full px-3 py-1",
                track === "v14" ? "bg-accent-dim text-accent" : "text-muted",
              )}
            >
              Archive 1101 / 1102
            </button>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted">Off Home on purpose. This meter is Tech only.</p>
        <RubricNote className="mb-4" />
        <div className="grid gap-4">
          <ReadinessCard report={core1} />
          <ReadinessCard report={core2} />
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-border bg-surface p-5">
        <p className="text-sm font-semibold">Export / import</p>
        <p className="mt-1 text-sm text-muted">
          Save a JSON copy, or restore one. There is no account sync in this build.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([exportProgress()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "ticketbench-progress.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-surface-2"
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              const text = await file.text();
              setImportError(importProgress(text));
            }}
          />
        </div>
        {importError ? <p className="mt-3 text-sm text-danger">{importError}</p> : null}
      </section>

      <button
        type="button"
        onClick={() => {
          if (window.confirm("Reset all progress, tickets, and the Binder?")) resetProgress();
        }}
        className="text-xs text-muted underline-offset-2 hover:underline"
      >
        Reset
      </button>
    </div>
  );
}
