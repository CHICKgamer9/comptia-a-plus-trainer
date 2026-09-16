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
  const search = useSearchParams();
  const [flipped, setFlipped] = useState<string | null>(() => search.get("card"));
  const [dragId, setDragId] = useState<string | null>(null);
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

  const huntOnSheet = hunt.filter((card) => !owned.some((row) => row.cardId === card.id));

  const loadout = bench.loadout;

  return (
    <div className="binder-page mx-auto max-w-3xl">
      <PageHeader
        kicker="Binder"
        title="Nine pockets. One sheet."
        description="Cards live here — flip to review, drag to the lab mat. Extra prints dust the unique. No shop, no packs."
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
        <nav className="binder-spine" aria-label="Binder dividers">
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
          <div className="mb-3 flex flex-wrap gap-2">
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
                      flipped={flipped === huntGhost.id}
                      onFlip={() => setFlipped((id) => (id === huntGhost.id ? null : huntGhost.id))}
                      onNote={setFieldNote}
                      onReview={reviewCard}
                      dragId={dragId}
                      setDragId={setDragId}
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
                  flipped={flipped === card.id}
                  onFlip={() => setFlipped((id) => (id === card.id ? null : card.id))}
                  onNote={setFieldNote}
                  onReview={reviewCard}
                  dragId={dragId}
                  setDragId={setDragId}
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
        <p>Drag a printed card onto a bay. Flip the card to review — equip only happens here.</p>
        <div className="loadout-mat">
          {loadout.map((id, index) => {
            const card = id ? getBenchCard(id) : undefined;
            const row = id ? owned.find((item) => item.cardId === id) : undefined;
            return (
              <div
                key={`bay-${index}`}
                className={cn("loadout-bay", !card && "is-empty")}
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
    </div>
  );
}

function Pocket({
  card,
  owned,
  flipped,
  onFlip,
  onNote,
  onReview,
  dragId,
  setDragId,
}: {
  card: NonNullable<ReturnType<typeof getBenchCard>>;
  owned: OwnedCard;
  flipped: boolean;
  onFlip: () => void;
  onNote: (cardId: string, note: string) => void;
  onReview: (cardId: string, grade: "again" | "hard" | "easy") => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
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
    >
      <TicketCard
        card={card}
        owned={owned}
        flipped={flipped}
        onFlip={onFlip}
        size="pocket"
        dragging={dragId === card.id}
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
    </div>
  );
}
