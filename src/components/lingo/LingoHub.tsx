"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LINGO_ACCENT, LINGO_ACCENT_DIM, LINGO_COURSE_LIST } from "@/content/lingo/courses";
import { loadLingoPack } from "@/content/lingo/load";
import type { LingoLangId, LingoPack } from "@/content/lingo/types";
import { continueNode, langProgress, lingoHref } from "@/lib/lingo";
import { useProgress } from "../ProgressProvider";
import { PageHeader, ProgressBar } from "../ui";

export function LingoHub() {
  const { progress } = useProgress();
  const [packs, setPacks] = useState<Partial<Record<LingoLangId, LingoPack>>>({});

  useEffect(() => {
    let alive = true;
    Promise.all(LINGO_COURSE_LIST.map((course) => loadLingoPack(course.id))).then((loaded) => {
      if (!alive) return;
      const next: Partial<Record<LingoLangId, LingoPack>> = {};
      loaded.forEach((pack) => {
        next[pack.id] = pack;
      });
      setPacks(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className="mx-auto max-w-xl"
      style={{ "--accent": LINGO_ACCENT, "--accent-dim": LINGO_ACCENT_DIM } as CSSProperties}
    >
      <PageHeader
        kicker="Languages"
        title="Speak a bit, every session"
        description="French, Indonesian, and Icelandic as real skill trees — not linguistics theory. One prompt, big taps, instant check. XP and streak stay on this device. The how-language-works paths still live under Learn → Languages."
      />
      <div className="grid gap-3">
        {LINGO_COURSE_LIST.map((course) => {
          const pack = packs[course.id];
          const row = langProgress(progress.lingo, course.id);
          const done = row.completedNodes.length;
          const total = pack?.nodes.length ?? 60;
          const cont = pack ? continueNode(pack, row.completedNodes, row.lastNodeId) : undefined;
          const percent = total ? Math.round((done / total) * 100) : 0;
          return (
            <article
              key={course.id}
              className="rounded-3xl border border-border bg-surface p-5"
              style={{ "--accent": course.accent, "--accent-dim": course.accentDim } as CSSProperties}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl font-mono text-sm font-bold"
                  style={{ color: course.accent, background: course.accentDim }}
                >
                  {course.mark}
                </span>
                <p className="font-mono text-xs text-muted">
                  {done}/{total}
                </p>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{course.nativeName}</p>
              <h2 className="mt-1 text-2xl font-semibold">{course.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{course.blurb}</p>
              <div className="mt-4">
                <ProgressBar value={percent} label={done ? "Course" : "Not started"} />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={cont ? lingoHref(course.id, cont.id) : `/lingo/${course.id}`}
                  className="flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background active:brightness-110"
                >
                  {done ? `Continue · ${cont?.title ?? "Tree"}` : "Start course"}
                </Link>
                <Link
                  href={`/lingo/${course.id}`}
                  className="flex min-h-12 items-center justify-center rounded-2xl border border-border px-4 py-3.5 text-sm font-semibold active:bg-surface-2"
                >
                  Open skill tree
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Want how languages work as a system?{" "}
        <Link href="/learn/languages" className="text-accent">
          Linguistics paths
        </Link>
      </p>
    </div>
  );
}
