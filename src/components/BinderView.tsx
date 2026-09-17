"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CARD_TYPE_TABS,
  cardsByType,
  fusionRecipes,
  getBenchCard,
} from "@/content/bench-cards";
import { SUBJECTS } from "@/content/subjects";
import type { CardType, SubjectId } from "@/content/types";
import {
  canFuse,
  dueLabel,
  huntCards,
  rottingDomain,
  weeklySpecialCard,
  type OwnedCard,
} from "@/lib/binder";
import { cn } from "@/lib/cn";
import { GhostSleeve, TicketCard } from "./card/TicketCard";
import { PageHeader } from "./ui";
import { useProgress } from "./ProgressProvider";

const PAGE = 9;

export function BinderView() {
  const {
    bench,
    progress,
    fuseCards,
    setLoadout,
    reviewCard,
    setFieldNote,
    markSeen,
    claimWeeklySpecial,
  } = useProgress();
  const [tab, setTab] = useState<CardType | "all">("all");
  const [subject, setSubject] = useState<SubjectId | "all">("all");
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dockId, setDockId] = useState<string | null>(null);
  const search = useSearchParams();
  const [flipped, setFlipped] = useState<string | null>(() => search.get("card"));
  const [dragId, setDragId] = useState<string | null>(null);
  const [armedBay, setArmedBay] = useState<number | null>(null);
  const owned = bench.owned;
  const seen = new Set(bench.seenCardIds ?? []);

  const rotting = rottingDomain(progress.completedLessons, progress.lastSubject);
  const hunt = huntCards(rotting.id);
  const special = weeklySpecialCard(bench, progress.completedLessons, progress.lastSubject);

  const huntKey = hunt.map((card) => card.id).join("|");
  useEffect(() => {
    if (!huntKey) return;
    markSeen(huntKey.split("|"));
  }, [huntKey, markSeen]);

  const catalog = useMemo(() => {
    return cardsByType(tab)
      .filter((card) => (subject === "all" ? true : card.subject === subject))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [tab, subject]);

  const pages = Math.max(1, Math.ceil(catalog.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const sheet = catalog.slice(safePage * PAGE, safePage * PAGE + PAGE);
  while (sheet.length < PAGE) sheet.push(undefined as never);

  const filterLabel =
    tab === "all" && subject === "all"
      ? "All"
      : [
          tab === "all" ? null : CARD_TYPE_TABS.find((option) => option.id === tab)?.label,
          subject === "all" ? null : SUBJECTS.find((row) => row.id === subject)?.title,
        ]
          .filter(Boolean)
          .join(" · ");

  const huntOnSheet = hunt.filter((card) => !owned.some((row) => row.cardId === card.id));

  const loadout = bench.loadout;

  function slotCard(cardId: string, bay?: number) {
    const next = [...loadout] as typeof loadout;
    const already = next.indexOf(cardId);
    if (already >= 0) next[already] = undefined;
    const slot = bay ?? next.findIndex((id) => !id);
    next[slot >= 0 ? slot : 0] = cardId;
    setLoadout(next);
    setArmedBay(null);
    setDockId(null);
  }

  return (
    <div className="binder-page mx-auto max-w-3xl">
      <PageHeader
        kicker="Binder"
        title="Nine pockets. One sheet."
        description="Cards live here — flip to review, drag to the lab mat. Extra prints dust the unique. No shop, no packs."
        compactOnPhone
      />

      <section className="binder-cover">
        <div className="binder-plate">
          <p className="binder-plate-kicker">TICKETBENCH</p>
          <p className="binder-plate-stat">
            {owned.length} unique · {loadout.filter(Boolean).length} slotted
          </p>
        </div>
        {owned.length ? (
          <Link href={`/learn/${rotting.subject}/${rotting.id}?hunt=1`} className="binder-hunt-link">
            Weak-spot hunt · {rotting.title}
          </Link>
        ) : null}
        {special ? (
          <button type="button" className="binder-weekly" onClick={() => claimWeeklySpecial()}>
            Weekly bench special · {special.card.title}
            <span>One extra print from {special.domain.title}. Still not a loot roll.</span>
          </button>
        ) : null}
      </section>

      <div className="binder-book">
        <button
          type="button"
          className="mb-3 flex min-h-11 w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 text-sm md:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <span>Filters</span>
          <span className="text-muted">{filterLabel}</span>
        </button>
        <nav className="binder-spine hidden md:flex" aria-label="Binder dividers">
          {CARD_TYPE_TABS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setTab(option.id);
                setPage(0);
              }}
              className={cn("binder-tab", tab === option.id && "is-on")}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <div className="binder-body">
          <div className="mb-3 hidden flex-wrap gap-2 md:flex">
            {[{ id: "all" as const, title: "All hubs" }, ...SUBJECTS].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSubject(option.id);
                  setPage(0);
                }}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  subject === option.id
                    ? "border-accent/40 bg-accent-dim text-accent"
                    : "border-border text-muted hover:text-foreground",
                )}
              >
                {option.title}
              </button>
            ))}
          </div>

          <div className="binder-sheet" data-hub={subject}>
            {Array.from({ length: PAGE }, (_, index) => {
              const huntGhost = index < 3 ? huntOnSheet[index] : undefined;
              const card = sheet[index];
              if (huntGhost && (!card || !owned.some((row) => row.cardId === huntGhost.id))) {
                const ownedHunt = owned.find((row) => row.cardId === huntGhost.id);
                if (ownedHunt) {
                  return (
                    <Pocket
                      key={`hunt-${huntGhost.id}`}
                      card={huntGhost}
                      owned={ownedHunt}
                      flipped={false}
                      onFlip={() => {
                        if (armedBay !== null) {
                          const next = [...loadout] as typeof loadout;
                          next[armedBay] = huntGhost.id;
                          setLoadout(next);
                          setArmedBay(null);
                          return;
                        }
                        setFlipped(huntGhost.id);
                      }}
                      onNote={setFieldNote}
                      onReview={reviewCard}
                      dragId={dragId}
                      setDragId={setDragId}
                      onLongPress={() => setDockId(huntGhost.id)}
                    />
                  );
                }
                return (
                  <div key={`ghost-hunt-${huntGhost.id}`} className="binder-pocket">
                    <GhostSleeve card={huntGhost} seen hunt />
                  </div>
                );
              }
              if (!card) {
                return (
                  <div key={`empty-${index}`} className="binder-pocket">
                    <GhostSleeve />
                  </div>
                );
              }
              const row = owned.find((item) => item.cardId === card.id);
              if (!row) {
                return (
                  <div key={card.id} className="binder-pocket">
                    <GhostSleeve card={card} seen={seen.has(card.id)} />
                  </div>
                );
              }
              return (
                <Pocket
                  key={card.id}
                  card={card}
                  owned={row}
                  flipped={false}
                  onFlip={() => {
                    if (armedBay !== null) {
                      const next = [...loadout] as typeof loadout;
                      next[armedBay] = card.id;
                      setLoadout(next);
                      setArmedBay(null);
                      return;
                    }
                    setFlipped((id) => (id === card.id ? null : card.id));
                  }}
                  onNote={setFieldNote}
                  onReview={reviewCard}
                  dragId={dragId}
                  setDragId={setDragId}
                  onLongPress={() => setDockId(card.id)}
                />
              );
            })}
          </div>

          <div className="binder-pager">
            <button type="button" disabled={safePage <= 0} onClick={() => setPage((n) => n - 1)}>
              Prev sheet
            </button>
            <p>
              Sheet {safePage + 1} / {pages}
            </p>
            <button type="button" disabled={safePage >= pages - 1} onClick={() => setPage((n) => n + 1)}>
              Next sheet
            </button>
          </div>
        </div>
      </div>

      <section className="binder-loadout">
        <h2>Lab loadout</h2>
        <p>Drag a printed card onto a bay, or tap a bay then a card. Flip to review — equip only happens here.</p>
        <div className="loadout-mat">
          {loadout.map((id, index) => {
            const card = id ? getBenchCard(id) : undefined;
            const row = id ? owned.find((item) => item.cardId === id) : undefined;
            return (
              <div
                key={`bay-${index}`}
                className={cn("loadout-bay", !card && "is-empty", armedBay === index && "is-armed")}
                onClick={() => {
                  if (card) return;
                  setArmedBay((current) => (current === index ? null : index));
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const nextId = event.dataTransfer.getData("text/card") || dragId;
                  if (!nextId) return;
                  const next = [...loadout] as typeof loadout;
                  const already = next.indexOf(nextId);
                  if (already >= 0) next[already] = undefined;
                  next[index] = nextId;
                  setLoadout(next);
                  setDragId(null);
                  setArmedBay(null);
                }}
              >
                {card && row ? (
                  <div>
                    <TicketCard card={card} owned={row} size="bay" interactive={false} showBack={false} />
                    <button
                      type="button"
                      className="mt-2 text-[11px] text-muted hover:text-foreground"
                      onClick={() => {
                        const next = [...loadout] as typeof loadout;
                        next[index] = undefined;
                        setLoadout(next);
                      }}
                    >
                      Clear bay
                    </button>
                  </div>
                ) : (
                  <p>Bay {index + 1}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="binder-fusion">
        <h2>Fusion tray</h2>
        <p>Ghost crafts stay visible. Glue prints only when the named recipe is ready.</p>
        <ul>
          {fusionRecipes.map((recipe) => {
            const ready = canFuse(bench, recipe.id);
            const output = getBenchCard(recipe.outputId);
            const haveOut = owned.some((row) => row.cardId === recipe.outputId);
            return (
              <li key={recipe.id} className="fusion-craft">
                <div className="fusion-ghosts">
                  {recipe.inputIds.map((id) => {
                    const input = getBenchCard(id);
                    const have = owned.find((row) => row.cardId === id);
                    return input ? (
                      <div key={id} className={cn("fusion-mini", have && have.copies >= 2 && "is-ready")}>
                        {have ? (
                          <TicketCard card={input} owned={have} size="pocket" interactive={false} showBack={false} />
                        ) : (
                          <GhostSleeve card={input} seen />
                        )}
                      </div>
                    ) : null;
                  })}
                  <span className="fusion-arrow">→</span>
                  <div className="fusion-mini">
                    {output && haveOut ? (
                      <TicketCard
                        card={output}
                        owned={owned.find((row) => row.cardId === output.id)}
                        size="pocket"
                        interactive={false}
                        showBack={false}
                      />
                    ) : output ? (
                      <GhostSleeve card={output} seen />
                    ) : null}
                  </div>
                </div>
                <p className="font-semibold">{recipe.title}</p>
                <p className="text-sm text-muted">{recipe.blurb}</p>
                <button type="button" disabled={!ready} onClick={() => fuseCards(recipe.id)}>
                  {ready ? "Print the glue ticket" : "Need dust on every input"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {flipped ? (
        <InspectCard
          cardId={flipped}
          owned={owned.find((row) => row.cardId === flipped)}
          onClose={() => setFlipped(null)}
          onNote={setFieldNote}
          onReview={reviewCard}
          onEquip={() => {
            slotCard(flipped);
            setFlipped(null);
          }}
        />
      ) : null}

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-label="Binder filters">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-surface p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Filters</p>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-lg"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">Type</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {CARD_TYPE_TABS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTab(option.id);
                    setPage(0);
                  }}
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm",
                    tab === option.id
                      ? "border-accent/40 bg-accent-dim text-accent"
                      : "border-border text-muted",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">Hub</p>
            <div className="mb-4 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {[{ id: "all" as const, title: "All hubs" }, ...SUBJECTS].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSubject(option.id);
                    setPage(0);
                  }}
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm",
                    subject === option.id
                      ? "border-accent/40 bg-accent-dim text-accent"
                      : "border-border text-muted",
                  )}
                >
                  {option.title}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-accent text-sm font-semibold text-background"
              onClick={() => setFiltersOpen(false)}
            >
              Show {filterLabel}
            </button>
          </div>
        </div>
      ) : null}

      {dockId ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/30 bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Lab dock</p>
            <button type="button" className="min-h-11 px-2 text-sm text-muted" onClick={() => setDockId(null)}>
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {loadout.map((id, index) => (
              <button
                key={`dock-${index}`}
                type="button"
                onClick={() => slotCard(dockId, index)}
                className="min-h-12 rounded-2xl border border-border bg-surface px-2 text-xs"
              >
                {id ? getBenchCard(id)?.title ?? `Bay ${index + 1}` : `Bay ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InspectCard({
  cardId,
  owned,
  onClose,
  onNote,
  onReview,
  onEquip,
}: {
  cardId: string;
  owned?: OwnedCard;
  onClose: () => void;
  onNote: (cardId: string, note: string) => void;
  onReview: (cardId: string, grade: "again" | "hard" | "easy") => void;
  onEquip?: () => void;
}) {
  const card = getBenchCard(cardId);
  const [face, setFace] = useState(false);
  if (!card || !owned) return null;
  return (
    <div className="binder-inspect" role="dialog" aria-label={card.title}>
      <button type="button" className="binder-inspect-scrim" onClick={onClose} aria-label="Close card" />
      <TicketCard
        card={card}
        owned={owned}
        flipped={face}
        onFlip={() => setFace((value) => !value)}
        size="hero"
        onFieldNote={(note) => onNote(card.id, note)}
        reviewSlot={
          <div className="ticket-review">
            {(["again", "hard", "easy"] as const).map((grade) => (
              <button key={grade} type="button" onClick={() => onReview(card.id, grade)}>
                {grade}
              </button>
            ))}
            <span>{dueLabel(owned.dueAt)}</span>
          </div>
        }
      />
      {onEquip ? (
        <button
          type="button"
          className="relative z-10 mt-4 flex min-h-12 w-full max-w-xs items-center justify-center rounded-2xl bg-accent text-sm font-semibold text-background md:hidden"
          onClick={onEquip}
        >
          Equip
        </button>
      ) : null}
    </div>
  );
}

function Pocket({
  card,
  owned,
  onFlip,
  dragId,
  setDragId,
  onLongPress,
}: {
  card: NonNullable<ReturnType<typeof getBenchCard>>;
  owned: OwnedCard;
  flipped?: boolean;
  onFlip: () => void;
  onNote?: (cardId: string, note: string) => void;
  onReview?: (cardId: string, grade: "again" | "hard" | "easy") => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  onLongPress?: () => void;
}) {
  return (
    <div
      className="binder-pocket"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/card", card.id);
        setDragId(card.id);
      }}
      onDragEnd={() => setDragId(null)}
      onPointerDown={() => {
        if (!onLongPress) return;
        const timer = window.setTimeout(() => onLongPress(), 450);
        const clear = () => window.clearTimeout(timer);
        window.addEventListener("pointerup", clear, { once: true });
        window.addEventListener("pointercancel", clear, { once: true });
      }}
    >
      <TicketCard
        card={card}
        owned={owned}
        onFlip={onFlip}
        size="pocket"
        showBack={false}
        dragging={dragId === card.id}
      />
    </div>
  );
}
