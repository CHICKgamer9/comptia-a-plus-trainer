"use client";

import { useState } from "react";
import type { BrainItem } from "@/content/brain/types";
import { cn } from "@/lib/cn";
import { PlayerButton } from "../PlayerFrame";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_MISS = 6;
const REVEAL_PENALTY = 10;

export function WordRevealPlay({
  item,
  onResolved,
}: {
  item: BrainItem;
  onResolved: (correct: boolean, spoken?: string, penalty?: number) => void;
}) {
  const word = String(item.answer ?? "").toUpperCase().replace(/[^A-Z]/g, "");
  const [guessed, setGuessed] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const [penalty, setPenalty] = useState(0);

  const misses = guessed.filter((ch) => !word.includes(ch)).length;
  const shown = word
    .split("")
    .map((ch) => (guessed.includes(ch) || done ? ch : "_"))
    .join(" ");

  function guess(ch: string) {
    if (done || guessed.includes(ch)) return;
    const next = [...guessed, ch];
    setGuessed(next);
    const nextMiss = next.filter((letter) => !word.includes(letter)).length;
    const complete = word.split("").every((letter) => next.includes(letter));
    if (complete) {
      setDone(true);
      setWon(true);
      onResolved(true, item.why ?? `The word is ${word}.`, penalty);
    } else if (nextMiss >= MAX_MISS) {
      setDone(true);
      setWon(false);
      onResolved(false, item.why ?? `The word is ${word}.`, penalty);
    }
  }

  function reveal() {
    if (done) return;
    setPenalty(REVEAL_PENALTY);
    setDone(true);
    setWon(false);
    onResolved(false, item.why ?? `The word is ${word}.`, REVEAL_PENALTY);
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{item.prompt}</p>
      <p className="font-mono text-2xl tracking-[0.35em]">{shown}</p>
      <p className="text-xs text-muted">
        Misses {misses}/{MAX_MISS}. Word reveal, not a gallows.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALPHA.map((ch) => {
          const used = guessed.includes(ch);
          const hit = used && word.includes(ch);
          const miss = used && !word.includes(ch);
          return (
            <button
              key={ch}
              type="button"
              disabled={done || used}
              onClick={() => guess(ch)}
              className={cn(
                "h-9 w-9 rounded-lg border text-sm font-semibold",
                !used && "border-border hover:border-accent/50",
                hit && "border-ok/50 bg-ok/15 text-ok",
                miss && "border-danger/40 bg-danger/10 text-danger",
              )}
            >
              {ch}
            </button>
          );
        })}
      </div>
      {done ? (
        <p className={cn("text-sm leading-6", won ? "text-ok" : "text-danger")}>
          {won ? "Revealed." : "Out of misses."} {item.why}
        </p>
      ) : (
        <PlayerButton tone="ghost" onClick={reveal}>
          Reveal word (−{REVEAL_PENALTY} XP)
        </PlayerButton>
      )}
    </div>
  );
}
