"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BRAIN_CATS, catTitle, getBrainManifest, isBrainCat, loadBrainPack } from "@/content/brain/load";
import type { BrainCat, BrainItem } from "@/content/brain/types";
import { Badge } from "../ui";
import { cn } from "@/lib/cn";
import { useProgress } from "../ProgressProvider";

const PAGE = 24;

export function BrainBrowse() {
  const params = useSearchParams();
  const requested = params.get("cat") ?? "crossword";
  const cat: BrainCat = isBrainCat(requested) ? requested : "crossword";
  const manifest = getBrainManifest();
  const { progress } = useProgress();
  const answered = useMemo(() => new Set(progress.brain?.answeredIds ?? []), [progress.brain]);
  const meta = manifest.categories.find((row) => row.id === cat);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/brain" className="text-sm text-muted hover:text-foreground">
          ← Hub
        </Link>
        <Link href="/brain/today" className="text-sm text-muted hover:text-foreground">
          Today
        </Link>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Browse Brain Gym</h1>
      <p className="mt-2 mb-4 max-w-lg text-sm leading-6 text-muted">
        Packs load one category at a time. Crosswords are real typed grids with across/down clues —
        not synonym quizzes wearing a crossword hat.
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {BRAIN_CATS.map((id) => (
          <Link
            key={id}
            href={`/brain/browse?cat=${id}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              id === cat ? "border-accent bg-accent-dim text-accent" : "border-border text-muted hover:text-foreground",
            )}
          >
            {catTitle(id)} · {manifest.categories.find((row) => row.id === id)?.count ?? 0}
          </Link>
        ))}
      </div>
      <p className="mb-3 text-sm text-muted">{meta?.blurb}</p>
      <BrowseList key={cat} cat={cat} answered={answered} />
    </div>
  );
}

function BrowseList({ cat, answered }: { cat: BrainCat; answered: Set<string> }) {
  const [items, setItems] = useState<BrainItem[] | null>(null);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    let alive = true;
    loadBrainPack(cat).then((pack) => {
      if (alive) setItems(pack);
    });
    return () => {
      alive = false;
    };
  }, [cat]);

  if (!items) {
    return <p className="text-sm text-muted">Loading {catTitle(cat)}…</p>;
  }

  return (
    <>
      <ul className="space-y-2">
        {items.slice(0, shown).map((item) => {
          const done = answered.has(item.id);
          return (
            <li key={item.id}>
              <Link
                href={`/brain/play/${item.id}`}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 hover:border-accent/40"
              >
                <span>
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="mt-1 line-clamp-2 text-xs text-muted">{item.prompt}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <Badge tone={done ? "ok" : "muted"}>{done ? "Tried" : `${item.minutes} min`}</Badge>
                  <Badge>{item.kind}</Badge>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {shown < items.length ? (
        <button
          type="button"
          className="mt-4 w-full rounded-2xl border border-border px-4 py-3 text-sm hover:bg-surface-2"
          onClick={() => setShown((n) => n + PAGE)}
        >
          Show more ({items.length - shown} left)
        </button>
      ) : null}
    </>
  );
}
