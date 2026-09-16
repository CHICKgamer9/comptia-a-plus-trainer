"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBenchCard } from "@/content/bench-cards";
import { KnowledgeCard } from "./KnowledgeCard";
import { useProgress } from "./ProgressProvider";

export function NightPackHost() {
  const router = useRouter();
  const { bench, openNightPack } = useProgress();
  const pack = bench.pendingPack;
  const packKey = pack?.cardIds.join("|") ?? "";
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    setRevealed([]);
  }, [packKey]);

  if (!pack) return null;

  const allUp = revealed.length >= pack.cardIds.length;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-accent/30 bg-surface p-5 shadow-xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Night Pack</p>
        <p className="mt-1 text-xl font-semibold">Desk is closing</p>
        <p className="mt-1 text-sm text-muted">
          {pack.cardIds.length} facedown card{pack.cardIds.length === 1 ? "" : "s"}. Tap to flip. Then
          go home — no “one more?” nag.
        </p>
        <ul className="mt-4 grid gap-3">
          {pack.cardIds.map((id, index) => {
            const card = getBenchCard(id);
            const up = revealed.includes(index);
            return (
              <li key={`${id}-${index}`}>
                {up && card ? (
                  <KnowledgeCard card={card} flipped />
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed((list) => (list.includes(index) ? list : [...list, index]))}
                    className="flex h-24 w-full items-center justify-center rounded-2xl border border-accent/40 bg-accent-dim text-sm font-semibold text-accent"
                  >
                    Tap to flip
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          disabled={!allUp}
          onClick={() => {
            openNightPack();
            setRevealed([]);
            router.push("/");
          }}
          className="mt-5 w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-background disabled:opacity-40"
        >
          Close the desk
        </button>
      </div>
    </div>
  );
}
