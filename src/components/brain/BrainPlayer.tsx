"use client";

import { useState } from "react";
import Link from "next/link";
import type { BrainItem } from "@/content/brain/types";
import { CheckPlay } from "../CheckPlay";
import { CrosswordPlay } from "./CrosswordPlay";
import { InputPlay } from "./InputPlay";
import { MemoryPlay } from "./MemoryPlay";
import { WordRevealPlay } from "./WordRevealPlay";
import { brainToCheck } from "./to-check";
import { SpeakBar } from "../SpeakBar";
import { Badge } from "../ui";
import { ProgressBar } from "../ui";

export function BrainPlayer({
  item,
  kicker,
  minutesLeft,
  minutesTarget,
  onResolved,
  nextHref,
  nextLabel,
}: {
  item: BrainItem;
  kicker?: string;
  minutesLeft?: number;
  minutesTarget?: number;
  onResolved: (correct: boolean, spoken?: string, penalty?: number, skipped?: boolean) => void;
  nextHref?: string;
  nextLabel?: string;
}) {
  const [followUp, setFollowUp] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  function resolved(correct: boolean, spoken?: string, penalty?: number, skipped?: boolean) {
    setFollowUp(spoken);
    setDone(true);
    onResolved(correct, spoken, penalty, skipped);
  }

  const remainingPct =
    minutesTarget && minutesTarget > 0
      ? Math.round((Math.max(0, minutesLeft ?? 0) / minutesTarget) * 100)
      : undefined;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{kicker ?? item.cat}</p>
        <div className="flex items-center gap-2">
          <Badge tone="accent">{item.cat}</Badge>
          <Badge tone="muted">{item.minutes} min</Badge>
        </div>
      </div>
      {remainingPct !== undefined ? (
        <div className="mb-4">
          <ProgressBar
            value={100 - remainingPct}
            label={`${Math.max(0, minutesLeft ?? 0)} min left of ${minutesTarget}`}
          />
        </div>
      ) : null}
      <div className="mb-3">
        <SpeakBar
          narration={{
            id: item.id,
            prompt: `${item.title}. ${item.prompt}`,
            followUp,
          }}
        />
      </div>
      <div className="beat-in rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(192,132,252,0.35)] sm:p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">{item.title}</p>
        <BrainKindPlay item={item} onResolved={resolved} />
      </div>
      {done && nextHref ? (
        <div className="mt-5">
          <Link
            href={nextHref}
            className="block w-full rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background hover:brightness-110"
          >
            {nextLabel ?? "Next"}
          </Link>
        </div>
      ) : !done ? (
        <button
          type="button"
          onClick={() => resolved(false, "Skipped. −XP, no card.", 0, true)}
          className="mt-4 w-full text-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Skip (−XP) — no card
        </button>
      ) : null}
    </div>
  );
}

export function BrainKindPlay({
  item,
  onResolved,
}: {
  item: BrainItem;
  onResolved: (correct: boolean, spoken?: string, penalty?: number) => void;
}) {
  if (item.kind === "crossword") {
    return <CrosswordPlay item={item} onResolved={onResolved} />;
  }
  if (item.kind === "reveal") {
    return <WordRevealPlay item={item} onResolved={onResolved} />;
  }
  if (item.kind === "memory") {
    return <MemoryPlay item={item} onResolved={(correct, spoken) => onResolved(correct, spoken, 0)} />;
  }
  if (item.kind === "input" || item.kind === "crypto") {
    return <InputPlay item={item} onResolved={(correct, spoken) => onResolved(correct, spoken, 0)} />;
  }
  const check = brainToCheck(item);
  if (!check) {
    return <p className="text-sm text-muted">This challenge is missing playable fields.</p>;
  }
  return <CheckPlay check={check} onResolved={(correct, spoken) => onResolved(correct, spoken, 0)} />;
}
