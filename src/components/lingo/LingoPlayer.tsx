"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { loadLingoPack } from "@/content/lingo/load";
import { lingoItemType, type LingoLangId, type LingoPack } from "@/content/lingo/types";
import { continueNode, langProgress } from "@/lib/lingo";
import { speakTextOf } from "@/lib/tts/script";
import { cancelAll } from "@/lib/tts/speak";
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
  const [gestured, setGestured] = useState(false);
  const [followUp, setFollowUp] = useState<string | undefined>();
  const [endedFor, setEndedFor] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadLingoPack(lang).then((found) => {
      if (alive) setPack(found);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  useEffect(() => {
    const mark = () => setGestured(true);
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

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

  const intro = step ? lingoItemType(step) === "introduce" : false;
  const script = speakTextOf(step?.speak);
  const speechEnded =
    !progress.autoRead || progress.speechMuted || !script || intro || endedFor === step?.id;

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
  const type = lingoItemType(current);
  const isIntro = type === "introduce";
  const autoRead = progress.autoRead === true && !progress.speechMuted;
  const continueDisabled = (!waiting && !isIntro) || (autoRead && !speechEnded && !isIntro);

  function resolve(correct: boolean, speak?: boolean, feedback?: string) {
    if (recorded.current === current.id) return;
    recorded.current = current.id;
    recordLingoStep({ lang, nodeId, stepId: current.id, correct, speak });
    setWaiting(true);
    if (feedback) setFollowUp(feedback);
    if (last && !lessonDone) {
      setLessonDone(true);
      completeLingoNode(lang, nodeId);
    }
  }

  function advance() {
    if (continueDisabled && !isIntro) return;
    if (isIntro && !waiting) resolve(true);
    if (last) return;
    cancelAll();
    const next = index + 1;
    setLocalIndex(next);
    saveLingoCursor(lang, nodeId, next);
    recorded.current = null;
    setWaiting(false);
    setFollowUp(undefined);
  }

  const narrationPrompt = current.speakTarget
    ? { silent: true as const }
    : (current.speak ?? { silent: true as const });

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
      <PlayerFrame
        kicker={node.title}
        index={index}
        total={node.steps.length}
        narration={{
          id: current.id,
          prompt: narrationPrompt,
          followUp,
          lang: pack.speechLang,
          role: current.speakTarget ? "target" : "narrator",
          onEnded: () => setEndedFor(current.id),
        }}
      >
        <LingoPlay
          key={current.id}
          step={current}
          lang={lang}
          speechLang={pack.speechLang}
          onResolved={resolve}
          onIntroReady={() => {
            if (!waiting) resolve(true);
          }}
          autoplayTarget={gestured && (isIntro || type === "listen-pick")}
        />
      </PlayerFrame>
      <div className="mx-auto mt-5 max-w-xl space-y-2">
        {(waiting || isIntro) && !lessonDone ? (
          <PlayerButton onClick={advance} disabled={continueDisabled && !isIntro}>
            {autoRead && !speechEnded && !isIntro ? "Listening…" : last ? "Finish lesson" : "Continue"}
          </PlayerButton>
        ) : null}
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
