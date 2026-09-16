"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BrainItem, BrainSlot } from "@/content/brain/types";
import { cn } from "@/lib/cn";
import { PlayerButton } from "../PlayerFrame";

type Dir = "across" | "down";

const REVEAL_LETTER_XP = 5;
const REVEAL_WORD_XP = 12;

function cellKey(r: number, c: number) {
  return `${r}:${c}`;
}

function isBlock(ch: string) {
  return ch === ".";
}

function cellsFor(slot: BrainSlot, dir: Dir) {
  return Array.from({ length: slot.len }, (_, i) => ({
    r: dir === "down" ? slot.r + i : slot.r,
    c: dir === "across" ? slot.c + i : slot.c,
  }));
}

export function CrosswordPlay({
  item,
  onResolved,
}: {
  item: BrainItem;
  onResolved: (correct: boolean, spoken?: string, penalty?: number) => void;
}) {
  const size = item.size ?? 4;
  const solution = (item.grid ?? "").toUpperCase();
  const across = useMemo(() => item.across ?? [], [item]);
  const down = useMemo(() => item.down ?? [], [item]);
  const [fill, setFill] = useState<string[]>(() =>
    Array.from({ length: size * size }, (_, i) => (isBlock(solution[i] ?? ".") ? "." : "")),
  );
  const [dir, setDir] = useState<Dir>("across");
  const [active, setActive] = useState(() => firstWhite(solution, size));
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [penalty, setPenalty] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const penaltyRef = useRef(0);
  const resolvedRef = useRef(false);

  const numbers = useMemo(() => {
    const map = new Map<string, number>();
    for (const slot of [...across, ...down]) {
      const key = cellKey(slot.r, slot.c);
      if (!map.has(key) || (map.get(key) ?? 99) > slot.n) map.set(key, slot.n);
    }
    return map;
  }, [across, down]);

  const activeSlot = useMemo(() => {
    const list = dir === "across" ? across : down;
    return (
      list.find((slot) =>
        cellsFor(slot, dir).some((cell) => cell.r === active.r && cell.c === active.c),
      ) ?? list[0]
    );
  }, [across, down, dir, active]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [active, dir]);

  function at(r: number, c: number) {
    return r * size + c;
  }

  function focusCell(r: number, c: number, nextDir?: Dir) {
    if (r < 0 || c < 0 || r >= size || c >= size) return;
    if (isBlock(solution[at(r, c)] ?? ".")) return;
    if (nextDir) setDir(nextDir);
    setActive({ r, c });
    setChecked(null);
    inputRef.current?.focus();
  }

  function tapCell(r: number, c: number) {
    if (isBlock(solution[at(r, c)] ?? ".")) return;
    if (active.r === r && active.c === c) {
      setDir((prev) => (prev === "across" ? "down" : "across"));
    } else {
      const acrossHit = across.some((slot) =>
        cellsFor(slot, "across").some((cell) => cell.r === r && cell.c === c),
      );
      const downHit = down.some((slot) =>
        cellsFor(slot, "down").some((cell) => cell.r === r && cell.c === c),
      );
      if (acrossHit && !downHit) setDir("across");
      else if (downHit && !acrossHit) setDir("down");
      setActive({ r, c });
    }
    setChecked(null);
    inputRef.current?.focus();
  }

  function advance(fromR: number, fromC: number, step: 1 | -1) {
    const dr = dir === "down" ? step : 0;
    const dc = dir === "across" ? step : 0;
    let r = fromR + dr;
    let c = fromC + dc;
    while (r >= 0 && c >= 0 && r < size && c < size) {
      if (!isBlock(solution[at(r, c)] ?? ".")) {
        focusCell(r, c);
        return;
      }
      r += dr;
      c += dc;
    }
  }

  function typeLetter(letter: string) {
    if (done) return;
    const i = at(active.r, active.c);
    if (isBlock(solution[i] ?? ".")) return;
    setFill((prev) => {
      const next = [...prev];
      next[i] = letter;
      const complete = next.every((ch, idx) => {
        const sol = solution[idx] ?? ".";
        return isBlock(sol) || ch === sol;
      });
      if (complete) {
        queueMicrotask(() => finishOk());
      }
      return next;
    });
    setChecked(null);
    advance(active.r, active.c, 1);
  }

  function backspace() {
    if (done) return;
    const i = at(active.r, active.c);
    if (fill[i]) {
      setFill((prev) => {
        const next = [...prev];
        next[i] = "";
        return next;
      });
      setChecked(null);
      return;
    }
    advance(active.r, active.c, -1);
  }

  function finishOk() {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setDone(true);
    onResolved(true, item.why ?? "Grid filled.", penaltyRef.current);
  }

  function checkGrid() {
    if (done || resolvedRef.current) return;
    const marks = fill.map((ch, i) => {
      const sol = solution[i] ?? ".";
      if (isBlock(sol)) return true;
      return ch === sol;
    });
    setChecked(marks);
    const complete = marks.every(Boolean) && fill.every((ch, i) => isBlock(solution[i] ?? ".") || ch);
    if (complete) finishOk();
  }

  function revealLetter() {
    if (done) return;
    const i = at(active.r, active.c);
    if (isBlock(solution[i] ?? ".")) return;
    setFill((prev) => {
      const next = [...prev];
      next[i] = solution[i] ?? "";
      return next;
    });
    setPenalty((n) => {
      const next = n + REVEAL_LETTER_XP;
      penaltyRef.current = next;
      return next;
    });
    setChecked(null);
    advance(active.r, active.c, 1);
  }

  function revealWord() {
    if (done || !activeSlot) return;
    const cells = cellsFor(activeSlot, dir);
    setFill((prev) => {
      const next = [...prev];
      for (const cell of cells) {
        const i = at(cell.r, cell.c);
        next[i] = solution[i] ?? "";
      }
      return next;
    });
    setPenalty((n) => {
      const next = n + REVEAL_WORD_XP;
      penaltyRef.current = next;
      return next;
    });
    setChecked(null);
  }

  const selectedKeys = new Set(
    activeSlot ? cellsFor(activeSlot, dir).map((cell) => cellKey(cell.r, cell.c)) : [],
  );

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{item.prompt}</p>
      <input
        ref={inputRef}
        aria-label="Crossword letter"
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
        className="sr-only"
        value=""
        onChange={(event) => {
          const ch = event.target.value.slice(-1).toUpperCase();
          if (/[A-Z]/.test(ch)) typeLetter(ch);
        }}
        onKeyDown={(event) => {
          if (event.key === "Backspace") {
            event.preventDefault();
            backspace();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setDir("across");
            advance(active.r, active.c, 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setDir("across");
            advance(active.r, active.c, -1);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setDir("down");
            advance(active.r, active.c, 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setDir("down");
            advance(active.r, active.c, -1);
          } else if (event.key === "Tab") {
            event.preventDefault();
            cycleClue(dir, across, down, activeSlot, setDir, setActive);
          }
        }}
      />
      <div className="mx-auto w-full max-w-sm">
        <div
          className="grid gap-[3px] rounded-2xl bg-border p-[3px]"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const r = Math.floor(i / size);
            const c = i % size;
            const sol = solution[i] ?? ".";
            const blocked = isBlock(sol);
            const num = numbers.get(cellKey(r, c));
            const isActive = active.r === r && active.c === c;
            const inWord = selectedKeys.has(cellKey(r, c));
            const wrong = checked ? checked[i] === false && Boolean(fill[i]) : false;
            const right = checked ? checked[i] === true && Boolean(fill[i]) && !blocked : false;
            return (
              <button
                key={i}
                type="button"
                disabled={blocked || done}
                onClick={() => tapCell(r, c)}
                className={cn(
                  "relative aspect-square min-h-10 rounded-[6px] text-lg font-semibold uppercase sm:min-h-12 sm:text-xl",
                  blocked && "bg-background/90",
                  !blocked && "bg-surface-2 text-foreground",
                  inWord && !blocked && "bg-accent-dim",
                  isActive && !blocked && "ring-2 ring-accent",
                  wrong && "bg-danger/20 text-danger",
                  right && "bg-ok/15 text-ok",
                )}
              >
                {num ? (
                  <span className="absolute left-1 top-0.5 font-mono text-[10px] text-muted">{num}</span>
                ) : null}
                {blocked ? null : fill[i]}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted">
        Tap a square, then type. Tap again to flip across/down. Arrows move. Check is free; reveal
        costs XP.
        {penalty ? ` Reveals so far: −${penalty} XP.` : ""}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <ClueList
          label="Across"
          slots={across}
          dir="across"
          active={activeSlot}
          activeDir={dir}
          onPick={(slot) => {
            setDir("across");
            setActive({ r: slot.r, c: slot.c });
            inputRef.current?.focus();
          }}
        />
        <ClueList
          label="Down"
          slots={down}
          dir="down"
          active={activeSlot}
          activeDir={dir}
          onPick={(slot) => {
            setDir("down");
            setActive({ r: slot.r, c: slot.c });
            inputRef.current?.focus();
          }}
        />
      </div>
      {done ? (
        <p className="text-sm leading-6 text-ok">{item.why}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PlayerButton onClick={checkGrid}>Check</PlayerButton>
          <PlayerButton tone="ghost" onClick={revealLetter}>
            Reveal letter
          </PlayerButton>
          <PlayerButton tone="ghost" onClick={revealWord}>
            Reveal word
          </PlayerButton>
          <button
            type="button"
            className="rounded-2xl border border-border px-4 py-3.5 text-sm font-semibold hover:bg-surface-2"
            onClick={() => inputRef.current?.focus()}
          >
            Keyboard
          </button>
        </div>
      )}
    </div>
  );
}

function firstWhite(solution: string, size: number) {
  for (let i = 0; i < size * size; i += 1) {
    if (solution[i] && solution[i] !== ".") {
      return { r: Math.floor(i / size), c: i % size };
    }
  }
  return { r: 0, c: 0 };
}

function cycleClue(
  dir: Dir,
  across: BrainSlot[],
  down: BrainSlot[],
  activeSlot: BrainSlot | undefined,
  setDir: (dir: Dir) => void,
  setActive: (cell: { r: number; c: number }) => void,
) {
  const list = dir === "across" ? across : down;
  const idx = Math.max(0, list.findIndex((slot) => slot === activeSlot));
  const next = list[(idx + 1) % list.length] ?? (dir === "across" ? down[0] : across[0]);
  if (!next) return;
  if (!list.length || idx === list.length - 1) {
    const flip: Dir = dir === "across" ? "down" : "across";
    const first = flip === "across" ? across[0] : down[0];
    if (first) {
      setDir(flip);
      setActive({ r: first.r, c: first.c });
      return;
    }
  }
  setActive({ r: next.r, c: next.c });
}

function ClueList({
  label,
  slots,
  dir,
  active,
  activeDir,
  onPick,
}: {
  label: string;
  slots: BrainSlot[];
  dir: Dir;
  active?: BrainSlot;
  activeDir: Dir;
  onPick: (slot: BrainSlot) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <ul className="space-y-1">
        {slots.map((slot) => {
          const selected = activeDir === dir && active?.n === slot.n && active.r === slot.r && active.c === slot.c;
          return (
            <li key={`${dir}-${slot.n}-${slot.r}-${slot.c}`}>
              <button
                type="button"
                onClick={() => onPick(slot)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-left text-sm leading-6",
                  selected ? "bg-accent-dim text-foreground" : "hover:bg-surface-2",
                )}
              >
                <span className="mr-2 font-mono text-xs text-muted">{slot.n}</span>
                {slot.clue}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
