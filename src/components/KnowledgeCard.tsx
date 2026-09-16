"use client";

import type { BenchCard } from "@/content/types";
import type { CardLevel } from "@/lib/binder";
import { TicketCard } from "./card/TicketCard";
import { CardArt } from "./card/CardArt";

/** Tiny silhouette kept for compact chrome that is not a full ticket. */
export function CardGlyph({ card, className }: { card: BenchCard; className?: string }) {
  return (
    <div className={className}>
      <CardArt card={card} />
    </div>
  );
}

export function KnowledgeCard({
  card,
  level = 1,
  copies = 1,
  flipped,
  onFlip,
  compact,
}: {
  card: BenchCard;
  level?: CardLevel;
  copies?: number;
  flipped?: boolean;
  onFlip?: () => void;
  compact?: boolean;
  ugly?: boolean;
}) {
  return (
    <TicketCard
      card={card}
      owned={{
        cardId: card.id,
        copies,
        level,
        firstEarnedAt: 0,
        source: "path",
        prints: copies,
      }}
      flipped={flipped}
      onFlip={onFlip}
      size={compact ? "pocket" : "sheet"}
    />
  );
}
