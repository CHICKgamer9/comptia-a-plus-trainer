"use client";

import { useEffect, useState } from "react";
import type { BrainItem } from "@/content/brain/types";
import { CheckPlay } from "../CheckPlay";
import { brainToCheck } from "./to-check";
import { cn } from "@/lib/cn";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function MemoryPlay({
  item,
  onResolved,
}: {
  item: BrainItem;
  onResolved: (correct: boolean, spoken?: string) => void;
}) {
  const [phase, setPhase] = useState<"flash" | "ask">("flash");

  useEffect(() => {
    const ms = Math.min(7000, 1800 + (item.flash?.length ?? 5) * 420);
    const timer = window.setTimeout(() => setPhase("ask"), ms);
    return () => window.clearTimeout(timer);
  }, [item.flash, item.id]);

  if (phase === "flash") {
    return (
      <div className="space-y-4">
        <p className="text-lg font-medium leading-8">Remember this flash.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {(item.flash ?? []).map((token, index) => (
            <span
              key={`${token}-${index}`}
              className="rounded-2xl border border-accent/40 bg-accent-dim px-3 py-2 font-mono text-lg"
            >
              {token}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-muted">Look, then it hides.</p>
      </div>
    );
  }

  if (item.items?.length && !item.choices?.length) {
    return (
      <OrderFlash
        prompt={item.prompt}
        tokens={item.items}
        why={item.why}
        onResolved={onResolved}
      />
    );
  }

  const check = brainToCheck(item);
  if (!check) {
    return <p className="text-sm text-muted">This memory item is missing a question.</p>;
  }
  return <CheckPlay check={check} onResolved={onResolved} />;
}

function OrderFlash({
  prompt,
  tokens,
  why,
  onResolved,
}: {
  prompt: string;
  tokens: string[];
  why?: string;
  onResolved: (correct: boolean, spoken?: string) => void;
}) {
  const [pool] = useState(() => shuffle(tokens.map((label, index) => ({ id: `t${index}`, label }))));
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const remaining = pool.filter((item) => !picked.includes(item.id));
  const correctOrder = tokens.map((_, index) => `t${index}`);
  const correct = done && JSON.stringify(picked) === JSON.stringify(correctOrder);

  function tap(id: string) {
    if (done) return;
    const next = [...picked, id];
    setPicked(next);
    if (next.length === pool.length) {
      const ok = JSON.stringify(next) === JSON.stringify(correctOrder);
      setDone(true);
      onResolved(ok, `${ok ? "That's the span." : "Order slipped."} ${why ?? ""}`);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{prompt}</p>
      <ol className="min-h-16 space-y-2">
        {picked.map((id, index) => {
          const item = pool.find((entry) => entry.id === id);
          const rightSlot = correctOrder[index] === id;
          return (
            <li
              key={id}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm leading-6",
                done && rightSlot && "border-ok/40 bg-ok/10",
                done && !rightSlot && "border-danger/40 bg-danger/10",
                !done && "border-accent/30 bg-accent-dim/40",
              )}
            >
              <span className="mr-2 font-mono text-xs text-muted">{index + 1}</span>
              {item?.label}
            </li>
          );
        })}
      </ol>
      {remaining.length ? (
        <div className="flex flex-wrap gap-2">
          {remaining.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => tap(item.id)}
              className="rounded-full border border-border bg-surface-2 px-3 py-2 text-sm hover:border-accent/50"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
      {done ? (
        <p className={cn("text-sm leading-6", correct ? "text-ok" : "text-danger")}>
          {correct ? "That’s the span." : "Almost — the flash order was different."} {why}
        </p>
      ) : (
        <p className="text-xs text-muted">Tap in the order they appeared.</p>
      )}
    </div>
  );
}
