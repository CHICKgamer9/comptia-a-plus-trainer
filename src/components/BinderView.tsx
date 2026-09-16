"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BENCH_SLOTS,
  CARD_TYPE_TABS,
  fusionRecipes,
  getBenchCard,
} from "@/content/bench-cards";
import { SUBJECTS } from "@/content/subjects";
import type { CardType, SubjectId } from "@/content/types";
import { canFuse, huntCards, rottingDomain } from "@/lib/binder";
import { cn } from "@/lib/cn";
import { KnowledgeCard } from "./KnowledgeCard";
import { PageHeader } from "./ui";
import { useProgress } from "./ProgressProvider";

export function BinderView() {
  const {
    bench,
    progress,
    slotBenchCard,
    fuseCards,
    setLoadout,
  } = useProgress();
  const [tab, setTab] = useState<CardType | "all">("all");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectId | "all">("all");
  const [flipped, setFlipped] = useState<string | null>(null);
  const owned = bench.owned;

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return owned
      .map((row) => ({ row, card: getBenchCard(row.cardId) }))
      .filter((item): item is { row: typeof owned[0]; card: NonNullable<ReturnType<typeof getBenchCard>> } =>
        Boolean(item.card),
      )
      .filter((item) => (tab === "all" ? true : item.card.type === tab))
      .filter((item) => (subject === "all" ? true : item.card.subject === subject))
      .filter((item) => {
        if (!needle) return true;
        const hay = `${item.card.title} ${item.card.subtitle} ${item.card.body} ${item.card.tags.join(" ")}`.toLowerCase();
        return hay.includes(needle);
      });
  }, [owned, tab, subject, query]);

  const rotting = rottingDomain(progress.completedLessons, progress.lastSubject);
  const hunt = huntCards(rotting.id);
  const loadout = bench.loadout;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Binder"
        title="Cards are knowledge"
        description="Parts, symptoms, tools, procedures. Extra copies become dust, then a clearer back face. No shop, no loot language."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p>
          {owned.length} unique · {Object.values(bench.slotted).filter(Boolean).length} slotted
        </p>
        <Link href={`/learn/tech/${rotting.id}`} className="text-accent hover:underline">
          Weak-spot hunt · {rotting.title}
        </Link>
      </div>

      {hunt.length ? (
        <div className="mb-6 rounded-2xl border border-border bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted">Rotting domain</p>
          <p className="mt-1 text-sm">
            Three cards from {rotting.title}. Open a path or{" "}
            <Link href="/brain/today" className="text-accent hover:underline">
              Brain Gym
            </Link>
            .
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            {hunt.map((card) => (
              <li key={card.id}>{card.title}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <label className="mb-3 block">
        <span className="sr-only">Search cards</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, tags…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm outline-none ring-accent/30 focus:ring-2"
        />
      </label>

      <div className="mb-3 flex flex-wrap gap-2">
        {CARD_TYPE_TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTab(option.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              tab === option.id
                ? "border-accent/40 bg-accent-dim text-accent"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[{ id: "all" as const, title: "All hubs" }, ...SUBJECTS].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSubject(option.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              subject === option.id
                ? "border-accent/40 bg-accent-dim text-accent"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {option.title}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-3xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
          Empty chassis. Answer a Mobile Devices bite, close a lab ticket, or finish a Brain item.
          Cards drop on correct work — never on a skip.
        </p>
      ) : (
        <ul className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map(({ row, card }) => (
            <li key={row.cardId}>
              <KnowledgeCard
                card={card}
                level={row.level}
                copies={row.copies}
                flipped={flipped === row.cardId}
                onFlip={() => setFlipped((id) => (id === row.cardId ? null : row.cardId))}
                ugly={card.type === "gotcha"}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {card.slot ? (
                  <button
                    type="button"
                    onClick={() =>
                      slotBenchCard(
                        card.slot!,
                        bench.slotted[card.slot!] === card.id ? undefined : card.id,
                      )
                    }
                    className="rounded-xl border border-border px-3 py-1.5 text-xs hover:border-accent/40"
                  >
                    {bench.slotted[card.slot] === card.id ? "Unequip" : `Equip ${card.slot}`}
                  </button>
                ) : null}
                <LoadoutButton
                  cardId={card.id}
                  loadout={loadout}
                  onChange={setLoadout}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Fusion tray</h2>
        <p className="mb-3 text-sm text-muted">
          Fusion spends the extra copy (dust) on each input. Your unique never goes below one.
        </p>
        <ul className="grid gap-3">
          {fusionRecipes.map((recipe) => {
            const ready = canFuse(bench, recipe.id);
            const output = getBenchCard(recipe.outputId);
            return (
              <li key={recipe.id} className="rounded-2xl border border-border bg-surface p-4">
                <p className="font-semibold">{recipe.title}</p>
                <p className="mt-1 text-sm text-muted">{recipe.blurb}</p>
                <p className="mt-2 text-xs text-muted">
                  {recipe.inputIds.map((id) => getBenchCard(id)?.title ?? id).join(" + ")}
                  {output ? ` → ${output.title}` : ""}
                </p>
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => fuseCards(recipe.id)}
                  className="mt-3 rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-background disabled:opacity-40"
                >
                  {ready ? "Fuse extra copies" : "Need extra copies on every input"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Lab loadout (3)
        </h2>
        <p className="mb-3 text-sm text-muted">
          Equip three owned cards. Lab tickets bias toward them and a full rack adds XP on close.
        </p>
        <div className="flex flex-wrap gap-2">
          {loadout.map((id, index) => {
            const card = id ? getBenchCard(id) : undefined;
            return (
              <span
                key={`${id ?? "empty"}-${index}`}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {card ? card.title : `Slot ${index + 1} empty`}
              </span>
            );
          })}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted">
        Chassis slots: {BENCH_SLOTS.map((slot) => slot.label).join(" · ")}
      </p>
    </div>
  );
}

function LoadoutButton({
  cardId,
  loadout,
  onChange,
}: {
  cardId: string;
  loadout: [string?, string?, string?];
  onChange: (next: [string?, string?, string?]) => void;
}) {
  const index = loadout.indexOf(cardId);
  if (index >= 0) {
    return (
      <button
        type="button"
        onClick={() => {
          const next = [...loadout] as [string?, string?, string?];
          next[index] = undefined;
          onChange(next);
        }}
        className="rounded-xl border border-accent/40 px-3 py-1.5 text-xs text-accent"
      >
        Remove from loadout
      </button>
    );
  }
  const empty = loadout.findIndex((id) => !id);
  if (empty < 0) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const next = [...loadout] as [string?, string?, string?];
        next[empty] = cardId;
        onChange(next);
      }}
      className="rounded-xl border border-border px-3 py-1.5 text-xs hover:border-accent/40"
    >
      Lab loadout
    </button>
  );
}
