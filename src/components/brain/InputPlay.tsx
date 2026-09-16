"use client";

import { useState } from "react";
import type { BrainItem } from "@/content/brain/types";
import { cn } from "@/lib/cn";
import { PlayerButton } from "../PlayerFrame";

function norm(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function InputPlay({
  item,
  onResolved,
}: {
  item: BrainItem;
  onResolved: (correct: boolean, spoken?: string) => void;
}) {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const expected = String(item.answer ?? "");
  const ok = done && norm(value) === norm(expected);

  function submit() {
    if (done || !value.trim()) return;
    const correct = norm(value) === norm(expected);
    setDone(true);
    onResolved(correct, `${correct ? "Yes." : "Not quite."} ${item.why ?? ""}`);
  }

  return (
    <div className="space-y-4">
      <p className="whitespace-pre-wrap text-lg font-medium leading-8">{item.prompt}</p>
      <input
        value={value}
        disabled={done}
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
        }}
        className="min-h-12 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 font-mono text-base uppercase tracking-wide outline-none focus:border-accent"
        placeholder="Type the answer"
      />
      {item.kind === "crypto" && item.cipher ? (
        <p className="font-mono text-sm tracking-wide text-muted">{item.cipher}</p>
      ) : null}
      {done ? (
        <p className={cn("text-sm leading-6", ok ? "text-ok" : "text-danger")}>
          {ok ? "Yes." : `It was ${expected}.`} {item.why}
        </p>
      ) : (
        <PlayerButton onClick={submit} disabled={!value.trim()}>
          Check
        </PlayerButton>
      )}
    </div>
  );
}
