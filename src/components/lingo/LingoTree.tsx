"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadLingoPack } from "@/content/lingo/load";
import { LINGO_COURSES } from "@/content/lingo/courses";
import type { LingoLangId, LingoPack } from "@/content/lingo/types";
import { continueNode, langProgress, nodeUnlocked } from "@/lib/lingo";
import { useProgress } from "../ProgressProvider";
import { EmptyState, PageHeader, ProgressBar } from "../ui";
import { cn } from "@/lib/cn";

export function LingoTree({ lang }: { lang: LingoLangId }) {
  const { progress } = useProgress();
  const [pack, setPack] = useState<LingoPack | null | undefined>(undefined);
  const meta = LINGO_COURSES[lang];

  useEffect(() => {
    let alive = true;
    loadLingoPack(lang).then((found) => {
      if (alive) setPack(found);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  if (pack === undefined) {
    return <p className="text-sm text-muted">Loading tree…</p>;
  }
  if (!pack) {
    return (
      <EmptyState title="Missing course" body="That language pack is not installed.">
        <Link href="/lingo" className="text-sm text-accent">
          All languages
        </Link>
      </EmptyState>
    );
  }

  const row = langProgress(progress.lingo, lang);
  const done = row.completedNodes.length;
  const cont = continueNode(pack, row.completedNodes, row.lastNodeId);
  const percent = Math.round((done / pack.nodes.length) * 100);

  return (
    <div
      className="mx-auto max-w-xl"
      style={{ "--accent": meta.accent, "--accent-dim": meta.accentDim } as CSSProperties}
    >
      <PageHeader
        kicker={meta.nativeName}
        title={meta.title}
        description={`${pack.units.length} units · ${pack.nodes.length} bite-sized lessons. Unlock the next node as you go. No hearts — XP and streak only.`}
      />
      <div className="mb-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-dim/80 to-surface p-5">
        <ProgressBar value={percent} label={`${done}/${pack.nodes.length} lessons`} />
        <Link
          href={`/lingo/${lang}/${cont.id}`}
          className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background active:brightness-110"
        >
          Continue · {cont.unitTitle} · {cont.title}
        </Link>
      </div>
      <ol className="space-y-8">
        {pack.units.map((unit) => (
          <li key={unit.index}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Unit {unit.index}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{unit.title}</h2>
            <p className="mb-4 text-sm text-muted">{unit.skill}</p>
            <ol className="space-y-2">
              {unit.nodeIds.map((id, index) => {
                const node = pack.nodes.find((item) => item.id === id);
                if (!node) return null;
                const complete = row.completedNodes.includes(id);
                const open = nodeUnlocked(pack, row.completedNodes, id);
                const current = cont.id === id;
                return (
                  <li key={id} className={cn("flex justify-center", index % 2 === 1 && "sm:translate-x-6")}>
                    {open ? (
                      <Link
                        href={`/lingo/${lang}/${id}`}
                        className={cn(
                          "flex min-h-16 w-full max-w-sm items-center gap-3 rounded-3xl border px-4 py-3 active:brightness-110",
                          complete && "border-ok/40 bg-ok/10",
                          current && !complete && "border-accent bg-accent-dim",
                          !complete && !current && "border-border bg-surface",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-12 w-12 shrink-0 place-items-center rounded-full font-mono text-sm font-bold",
                            complete ? "bg-ok/20 text-ok" : "bg-accent-dim text-accent",
                          )}
                        >
                          {complete ? "✓" : node.index + 1}
                        </span>
                        <span className="min-w-0 text-left">
                          <span className="block text-sm font-semibold">{node.title}</span>
                          <span className="block text-xs text-muted">
                            {node.steps.length} prompts · {complete ? "Replay" : current ? "Continue" : "Open"}
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <div className="flex min-h-16 w-full max-w-sm items-center gap-3 rounded-3xl border border-border/70 bg-surface/60 px-4 py-3 opacity-60">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-sm text-muted">
                          🔒
                        </span>
                        <span className="min-w-0 text-left">
                          <span className="block text-sm font-semibold">{node.title}</span>
                          <span className="block text-xs text-muted">Finish the lesson above to unlock</span>
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-center">
        <Link href="/lingo" className="text-sm text-muted hover:text-foreground">
          ← All languages
        </Link>
      </p>
    </div>
  );
}
