"use client";

import { useState } from "react";
import type { PathCheck } from "@/content/types";
import { cn } from "@/lib/cn";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function CheckPlay({
  check,
  onResolved,
}: {
  check: PathCheck;
  onResolved: (correct: boolean) => void;
}) {
  if (check.type === "truefalse") {
    return <TrueFalse check={check} onResolved={onResolved} />;
  }
  if (check.type === "order") {
    return <OrderCheck check={check} onResolved={onResolved} />;
  }
  if (check.type === "match") {
    return <MatchCheck check={check} onResolved={onResolved} />;
  }
  return <ChoiceCheck check={check} onResolved={onResolved} />;
}

function ChoiceCheck({
  check,
  onResolved,
}: {
  check: PathCheck;
  onResolved: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const choices = check.choices ?? [];
  const locked = picked !== null;
  const selected = choices.find((choice) => choice.id === picked);

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium leading-8">{check.prompt}</p>
      <div className="space-y-2">
        {choices.map((choice) => {
          const isPick = picked === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={locked}
              onClick={() => {
                setPicked(choice.id);
                onResolved(choice.correct);
              }}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition",
                !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                locked && choice.correct && "border-ok/50 bg-ok/10",
                locked && isPick && !choice.correct && "border-danger/50 bg-danger/10",
                locked && !isPick && !choice.correct && "border-border opacity-60",
              )}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
      {selected ? (
        <p className={cn("text-sm leading-6", selected.correct ? "text-ok" : "text-danger")}>
          {selected.correct ? "Nice." : "Not quite."} {selected.why}
        </p>
      ) : null}
    </div>
  );
}

function TrueFalse({
  check,
  onResolved,
}: {
  check: PathCheck;
  onResolved: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const locked = picked !== null;
  const correct = picked === check.answer;

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{check.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((value) => {
          const isPick = picked === value;
          const isAnswer = check.answer === value;
          return (
            <button
              key={String(value)}
              type="button"
              disabled={locked}
              onClick={() => {
                setPicked(value);
                onResolved(value === check.answer);
              }}
              className={cn(
                "rounded-2xl border px-4 py-8 text-lg font-semibold transition",
                !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                locked && isAnswer && "border-ok/50 bg-ok/10 text-ok",
                locked && isPick && !isAnswer && "border-danger/50 bg-danger/10 text-danger",
                locked && !isPick && !isAnswer && "opacity-50",
              )}
            >
              {value ? "True" : "False"}
            </button>
          );
        })}
      </div>
      {locked ? (
        <p className={cn("text-sm leading-6", correct ? "text-ok" : "text-danger")}>
          {correct ? "Yes." : "Flip it."} {check.why}
        </p>
      ) : null}
    </div>
  );
}

function OrderCheck({
  check,
  onResolved,
}: {
  check: PathCheck;
  onResolved: (correct: boolean) => void;
}) {
  const [pool] = useState(() => shuffle(check.items ?? []));
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const remaining = pool.filter((item) => !picked.includes(item.id));
  const correct =
    done &&
    JSON.stringify(picked) === JSON.stringify(check.correctOrder ?? []);

  function tap(id: string) {
    if (done) return;
    const next = [...picked, id];
    setPicked(next);
    if (next.length === pool.length) {
      const ok = JSON.stringify(next) === JSON.stringify(check.correctOrder ?? []);
      setDone(true);
      onResolved(ok);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{check.prompt}</p>
      <ol className="min-h-16 space-y-2">
        {picked.map((id, index) => {
          const item = pool.find((entry) => entry.id === id);
          const rightSlot = check.correctOrder?.[index] === id;
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
          {correct ? "That’s the loop." : "Almost — remember the real order."} {check.why}
        </p>
      ) : (
        <p className="text-xs text-muted">Tap in order. You can think once, then commit.</p>
      )}
    </div>
  );
}

function MatchCheck({
  check,
  onResolved,
}: {
  check: PathCheck;
  onResolved: (correct: boolean) => void;
}) {
  const pairs = check.pairs ?? [];
  const [lefts] = useState(() => shuffle(pairs.map((pair) => pair.left)));
  const [rights] = useState(() =>
    shuffle([...pairs.map((pair) => pair.right), ...(check.extraRights ?? [])]),
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [miss, setMiss] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const complete = Object.keys(matched).length === pairs.length;

  function pairRight(right: string) {
    if (done || !selectedLeft) return;
    const expected = pairs.find((pair) => pair.left === selectedLeft)?.right;
    if (expected === right) {
      const next = { ...matched, [selectedLeft]: right };
      setMatched(next);
      setSelectedLeft(null);
      setMiss(null);
      if (Object.keys(next).length === pairs.length) {
        setDone(true);
        onResolved(true);
      }
    } else {
      setMiss(right);
      setSelectedLeft(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{check.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          {lefts.map((left) => (
            <button
              key={left}
              type="button"
              disabled={done || Boolean(matched[left])}
              onClick={() => setSelectedLeft(left)}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left text-sm leading-6",
                matched[left] && "border-ok/40 bg-ok/10",
                selectedLeft === left && "border-accent bg-accent-dim",
                !matched[left] && selectedLeft !== left && "border-border hover:border-accent/40",
              )}
            >
              {left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((right) => {
            const used = Object.values(matched).includes(right);
            return (
              <button
                key={right}
                type="button"
                disabled={done || used || !selectedLeft}
                onClick={() => pairRight(right)}
                className={cn(
                  "w-full rounded-2xl border px-3 py-3 text-left text-sm leading-6",
                  used && "border-ok/40 bg-ok/10",
                  miss === right && "border-danger/40 bg-danger/10",
                  !used && "border-border hover:border-accent/40",
                  !selectedLeft && !used && "opacity-70",
                )}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {complete ? (
        <p className="text-sm leading-6 text-ok">Linked. {check.why}</p>
      ) : (
        <p className="text-xs text-muted">Tap a left card, then the matching right card.</p>
      )}
    </div>
  );
}
