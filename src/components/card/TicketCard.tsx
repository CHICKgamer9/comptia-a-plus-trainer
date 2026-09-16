"use client";

import { useCallback, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import type { BenchCard } from "@/content/types";
import {
  cardExamTells,
  cardHook,
  cardPrintCode,
  cardSeenIn,
  cardSetNumber,
  cardSetSize,
  displayRarity,
  subtitleFor,
} from "@/content/bench-cards";
import { cn } from "@/lib/cn";
import { formatStampDate, type OwnedCard, type WearMark } from "@/lib/binder";
import { CardArt } from "./CardArt";

const HUB: Record<string, string> = {
  tech: "TECH",
  maths: "MATHS",
  science: "SCIENCE",
  history: "HISTORY",
  english: "ENGLISH",
  geography: "GEO",
  coding: "CODE",
  business: "BIZ",
  health: "HEALTH",
  music: "MUSIC",
  art: "ART",
  civics: "CIVICS",
  languages: "LANG",
  logic: "LOGIC",
  digital: "DIGITAL",
};

const FRAME: Record<string, string> = {
  common: "ticket-frame-common",
  uncommon: "ticket-frame-uncommon",
  rare: "ticket-frame-rare",
  crest: "ticket-frame-crest",
  glue: "ticket-frame-glue",
};

const SLEEVE: Record<string, string> = {
  tech: "ticket-sleeve-tech",
  science: "ticket-sleeve-science",
  maths: "ticket-sleeve-maths",
  logic: "ticket-sleeve-logic",
  digital: "ticket-sleeve-digital",
};

export function TicketCard({
  card,
  owned,
  flipped,
  onFlip,
  size = "sheet",
  draw,
  interactive = true,
  showBack = true,
  onFieldNote,
  reviewSlot,
  dragging,
}: {
  card: BenchCard;
  owned?: OwnedCard;
  flipped?: boolean;
  onFlip?: () => void;
  size?: "pocket" | "sheet" | "hero" | "bay";
  draw?: boolean;
  interactive?: boolean;
  showBack?: boolean;
  onFieldNote?: (note: string) => void;
  reviewSlot?: ReactNode;
  dragging?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 50, my: 40 });
  const rarity = displayRarity(card.rarity);
  const shine = rarity === "crest" || rarity === "glue" || (owned?.level ?? 1) >= 3;

  const move = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const el = wrap.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    setTilt({
      x: (0.5 - py) * 14,
      y: (px - 0.5) * 16,
      mx: px * 100,
      my: py * 100,
    });
  }, []);

  const reset = useCallback(() => setTilt({ x: 0, y: 0, mx: 50, my: 40 }), []);

  const set = cardSetNumber(card);
  const total = cardSetSize();
  const printDate = owned ? formatStampDate(owned.firstEarnedAt) : "—";
  const copies = owned?.prints ?? owned?.copies ?? 0;
  const tells = cardExamTells(card);
  const seen = cardSeenIn(card);
  const serial = owned?.serial ?? `TB-${cardPrintCode(card)}-UNPRINTED`;

  return (
    <div
      ref={wrap}
      className={cn(
        "ticket-card-wrap relative",
        size === "pocket" && "w-full",
        size === "sheet" && "w-full max-w-[220px]",
        size === "bay" && "w-[132px]",
        size === "hero" && "w-[min(72vw,280px)]",
        dragging && "opacity-40",
      )}
      onPointerMove={interactive ? move : undefined}
      onPointerLeave={interactive ? reset : undefined}
      style={
        {
          "--tilt-x": `${tilt.x}deg`,
          "--tilt-y": `${tilt.y}deg`,
          "--shine-x": `${tilt.mx}%`,
          "--shine-y": `${tilt.my}%`,
        } as CSSProperties
      }
    >
      <div className={cn("ticket-card-scene", flipped && "is-flipped")}>
        <Face
          className={cn("ticket-face ticket-front", FRAME[rarity], SLEEVE[card.subject], shine && "ticket-shine")}
          onClick={onFlip}
        >
          <p className="ticket-rail">
            {rarity.toUpperCase()} · {card.type.toUpperCase()} · {HUB[card.subject] ?? card.subject.toUpperCase()}
          </p>
          <div className="ticket-art">
            <CardArt card={card} draw={draw} />
          </div>
          <h3 className="ticket-title">{card.title}</h3>
          <p className="ticket-hook">{cardHook(card)}</p>
          <p className="ticket-foot">
            T-{String(set).padStart(3, "0")} / {total}
            <span> · {printDate}</span>
            <span> · ×{Math.max(1, copies || 1)}</span>
          </p>
          <WearLayer wear={owned?.wear} />
        </Face>
        {showBack ? (
          <div className={cn("ticket-face ticket-back", FRAME[rarity])}>
            <p className="ticket-rail">{serial}</p>
            <p className="ticket-why">{owned ? subtitleFor(card, owned.level) : card.body}</p>
            <p className="ticket-body">{card.body}</p>
            <ul className="ticket-tells">
              {tells.map((tell) => (
                <li key={tell}>{tell}</li>
              ))}
            </ul>
            <p className="ticket-seen">
              Seen in
              {seen.lesson ? ` · ${seen.lesson}` : ""}
              {seen.ticket ? ` · ${seen.ticket}` : ""}
              {seen.fusion ? ` · ${seen.fusion}` : ""}
            </p>
            {owned && onFieldNote ? (
              <label className="ticket-note">
                <span>Field note</span>
                <input
                  defaultValue={owned.fieldNote ?? ""}
                  maxLength={80}
                  placeholder="One line from the bench…"
                  onBlur={(event) => onFieldNote(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                />
              </label>
            ) : owned?.fieldNote ? (
              <p className="ticket-note-print">{owned.fieldNote}</p>
            ) : null}
            {reviewSlot}
            {onFlip ? (
              <button type="button" className="ticket-flip-back" onClick={onFlip}>
                Flip
              </button>
            ) : null}
            <WearLayer wear={owned?.wear} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Face({
  className,
  onClick,
  children,
}: {
  className: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (!onClick) {
    return <div className={className}>{children}</div>;
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function WearLayer({ wear }: { wear?: WearMark[] }) {
  if (!wear?.length) return null;
  return (
    <div className="ticket-wear" aria-hidden>
      {wear.map((mark, index) => (
        <span
          key={`${mark.kind}-${mark.at}-${index}`}
          className={cn("ticket-wear-mark", `wear-${mark.kind}`)}
          style={{
            left: `${12 + ((index * 17) % 62)}%`,
            top: `${18 + ((index * 23) % 58)}%`,
          }}
        />
      ))}
    </div>
  );
}

export function GhostSleeve({
  card,
  seen,
  hunt,
}: {
  card?: BenchCard;
  seen?: boolean;
  hunt?: boolean;
}) {
  return (
    <div className={cn("ticket-ghost", hunt && "is-hunt", seen && "is-seen")}>
      <div className="ticket-ghost-sil" />
      {seen && card ? <p className="ticket-ghost-name">{card.title}</p> : <p className="ticket-ghost-name muted">Empty sleeve</p>}
    </div>
  );
}
