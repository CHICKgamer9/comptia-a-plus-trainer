"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { loadLingoPack } from "@/content/lingo/load";
import type { LingoLangId, LingoPack } from "@/content/lingo/types";
import { continueNode, langProgress } from "@/lib/lingo";
import { EmptyState } from "../ui";
import { PlayerButton, PlayerFrame } from "../PlayerFrame";
import { LingoPlay } from "./LingoPlay";

export function LingoPlayer({ lang, nodeId }: { lang: LingoLangId; nodeId: string }) {
  const { progress, recordLingoStep, completeLingoNode, saveLingoCursor } = useProgress();
  const [pack, setPack] = useState<LingoPack | null | undefined>(undefined);
  const recorded = useRef<string | null>(null);
  const [localIndex, setLocalIndex] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);

  useEffect(() => {
    let alive = true;
    loadLingoPack(lang).then((found) => {
      if (alive) setPack(found);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  const node = pack?.nodes.find((item) => item.id === nodeId);
  const row = langProgress(progress.lingo, lang);
  const storedIndex = row.cursor?.[nodeId] ?? 0;
  const index = Math.min(localIndex ?? storedIndex, Math.max(0, (node?.steps.length ?? 1) - 1));
  const step = node?.steps[index];
  const nextNode = useMemo(() => {
    if (!pack) return undefined;
    const done = row.completedNodes.includes(nodeId)
      ? [...row.completedNodes]
      : [...row.completedNodes, nodeId];
    const cont = continueNode(pack, done, nodeId);
    return cont.id === nodeId ? undefined : cont;
  }, [pack, row.completedNodes, nodeId]);

  if (pack === undefined) {
    return <p className="text-sm text-muted">Loading lesson…</p>;
  }
  if (!pack || !node || !step) {
    return (
      <EmptyState title="Missing lesson" body="That language node is not in the packs.">
        <Link href={`/lingo/${lang}`} className="text-sm text-accent">
          Back to the skill tree
        </Link>
      </EmptyState>
    );
  }

  const last = index >= node.steps.length - 1;
  const current = step;

  function resolve(correct: boolean, speak?: boolean) {
    if (recorded.current === current.id) return;
    recorded.current = current.id;
    recordLingoStep({ lang, nodeId, stepId: current.id, correct, speak });
    setWaiting(true);
    if (last && !lessonDone) {
      setLessonDone(true);
      completeLingoNode(lang, nodeId);
    }
  }

  function advance() {
    if (!waiting || last) return;
    const next = index + 1;
    setLocalIndex(next);
    saveLingoCursor(lang, nodeId, next);
    recorded.current = null;
    setWaiting(false);
  }

  return (
    <div>
      <div className="mx-auto mb-5 flex max-w-xl items-center justify-between gap-3">
        <Link href={`/lingo/${lang}`} className="text-sm text-muted hover:text-foreground">
          ← {pack.nativeName}
        </Link>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          {node.unitTitle} · {node.skill}
        </p>
      </div>
      <PlayerFrame kicker={node.title} index={index} total={node.steps.length}>
        <LingoPlay
          key={current.id}
          step={current}
          lang={lang}
          speechLang={pack.speechLang}
          onResolved={resolve}
        />
      </PlayerFrame>
      <div className="mx-auto mt-5 max-w-xl space-y-2">
        {waiting && !last ? <PlayerButton onClick={advance}>Continue</PlayerButton> : null}
        {lessonDone ? (
          <>
            <p className="text-center text-sm text-ok">Lesson done. XP is on this device.</p>
            {nextNode ? (
              <Link
                href={`/lingo/${lang}/${nextNode.id}`}
                className="flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background"
              >
                Next · {nextNode.title}
              </Link>
            ) : (
              <Link
                href={`/lingo/${lang}`}
                className="flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-background"
              >
                Back to the tree
              </Link>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
