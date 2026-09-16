"use client";

import type { BenchCard } from "@/content/types";
import { subtitleFor } from "@/content/bench-cards";
import { cn } from "@/lib/cn";
import type { CardLevel } from "@/lib/binder";

const RARITY: Record<string, string> = {
  common: "text-muted border-border",
  uncommon: "text-ok border-ok/40",
  rare: "text-accent border-accent/40",
  legendary: "text-warn border-warn/40",
};

export function CardGlyph({ card, className }: { card: BenchCard; className?: string }) {
  const label = card.type.slice(0, 3).toUpperCase();
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden>
      <rect x="4" y="4" width="56" height="72" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 22h40M12 28h28" stroke="currentColor" strokeWidth="1.4" />
      <text x="32" y="52" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="ui-monospace, monospace">
        {label}
      </text>
    </svg>
  );
}

export function KnowledgeCard({
  card,
  level = 1,
  copies = 1,
  flipped,
  onFlip,
  compact,
  ugly,
}: {
  card: BenchCard;
  level?: CardLevel;
  copies?: number;
  flipped?: boolean;
  onFlip?: () => void;
  compact?: boolean;
  ugly?: boolean;
}) {
  const gotcha = card.type === "gotcha" || ugly;
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn(
        "w-full rounded-2xl border bg-surface text-left transition",
        gotcha ? "border-danger/50 bg-danger/5" : RARITY[card.rarity] ?? "border-border",
        compact ? "p-3" : "p-4",
      )}
    >
      <div className="flex gap-3">
        <CardGlyph
          card={card}
          className={cn("h-14 w-11 shrink-0 text-accent", gotcha && "text-danger")}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            {card.rarity} · {card.type}
            {copies > 1 ? ` · extra copy` : ""}
            {level > 1 ? ` · lv ${level}` : ""}
          </p>
          <p className={cn("mt-0.5 font-semibold", compact ? "text-sm" : "text-base")}>{card.title}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{subtitleFor(card, level)}</p>
        </div>
      </div>
      {flipped ? (
        <p className="mt-3 text-sm leading-6 text-foreground/90">{card.body}</p>
      ) : (
        <p className="mt-2 text-[11px] text-muted">Tap for the back face</p>
      )}
    </button>
  );
}
