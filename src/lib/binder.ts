import {
  benchCards,
  CREST_BY_DOMAIN,
  fusionRecipes,
  getBenchCard,
  rarityWeight,
  subtitleFor,
} from "@/content/bench-cards";
import type {
  BenchCard,
  BenchSlot,
  CardEarnSource,
  CardRarity,
  CardType,
  SubjectId,
} from "@/content/types";
import { domains, getDomain } from "@/content/registry";
import { isCore1, isCore2 } from "@/lib/exam";
import type { BrainCat } from "@/content/brain/types";
import { enqueueToasts, type ToastEvent } from "./toasts";

export type CardLevel = 1 | 2 | 3;

export type ReviewGrade = "again" | "hard" | "easy";

export interface OwnedCard {
  cardId: string;
  copies: number;
  level: CardLevel;
  firstEarnedAt: number;
  lastUsedAt?: number;
  source: CardEarnSource;
  gotchaFrom?: string;
  dueAt?: number;
  ease?: number;
  reps?: number;
}

export interface DeskShift {
  lengthMin: 8 | 15 | 25;
  startedAt: number;
  endedAt?: number;
  xpAtStart: number;
  xpEarned: number;
  cardsEarned: string[];
  packOpened?: boolean;
  early?: boolean;
  tags: string[];
}

export interface NightPack {
  cardIds: string[];
  at: number;
  weakTag: string;
}

export interface BenchState {
  owned: OwnedCard[];
  slotted: Partial<Record<BenchSlot, string>>;
  loadout: [string?, string?, string?];
  gotchaConcepts: string[];
  crests: string[];
  activeShift?: DeskShift;
  shifts: DeskShift[];
  pendingPack?: NightPack;
}

export const emptyBench = (): BenchState => ({
  owned: [],
  slotted: {},
  loadout: [undefined, undefined, undefined],
  gotchaConcepts: [],
  crests: [],
  shifts: [],
});

export function parseBench(raw: unknown): BenchState {
  if (!raw || typeof raw !== "object") return emptyBench();
  const parsed = raw as Partial<BenchState>;
  const owned = Array.isArray(parsed.owned)
    ? parsed.owned.filter((row): row is OwnedCard => Boolean(row && row.cardId))
    : [];
  const loadout = Array.isArray(parsed.loadout)
    ? ([parsed.loadout[0], parsed.loadout[1], parsed.loadout[2]] as BenchState["loadout"])
    : emptyBench().loadout;
  return {
    owned,
    slotted:
      parsed.slotted && typeof parsed.slotted === "object" ? parsed.slotted : {},
    loadout,
    gotchaConcepts: Array.isArray(parsed.gotchaConcepts) ? parsed.gotchaConcepts : [],
    crests: Array.isArray(parsed.crests) ? parsed.crests : [],
    activeShift: parsed.activeShift,
    shifts: Array.isArray(parsed.shifts) ? parsed.shifts : [],
    pendingPack: parsed.pendingPack,
  };
}

export interface DropResult {
  bench: BenchState;
  awarded: { card: BenchCard; isNew: boolean; leveled: boolean; source: CardEarnSource }[];
}

function ownedIndex(bench: BenchState, cardId: string) {
  return bench.owned.findIndex((row) => row.cardId === cardId);
}

/** 1st copy owns the card. 2nd is dust (copies=2). 3rd upgrades level and resets copies to 1. Never junk. */
export function addCopy(
  bench: BenchState,
  cardId: string,
  source: CardEarnSource,
  gotchaFrom?: string,
): { bench: BenchState; isNew: boolean; leveled: boolean } {
  const card = getBenchCard(cardId);
  if (!card) return { bench, isNew: false, leveled: false };
  const next: BenchState = {
    ...bench,
    owned: bench.owned.map((row) => ({ ...row })),
  };
  const index = ownedIndex(next, cardId);
  const now = Date.now();
  if (index < 0) {
    next.owned = [
      ...next.owned,
      {
        cardId,
        copies: 1,
        level: 1,
        firstEarnedAt: now,
        source,
        gotchaFrom,
        dueAt: now,
        ease: 2.5,
        reps: 0,
      },
    ];
    noteShiftCard(next, cardId);
    return { bench: next, isNew: true, leveled: false };
  }
  const row = next.owned[index];
  if (row.copies === 1) {
    row.copies = 2;
    row.source = source;
    noteShiftCard(next, cardId);
    return { bench: next, isNew: false, leveled: false };
  }
  row.copies = 1;
  const prevLevel = row.level;
  row.level = Math.min(3, (row.level + 1) as CardLevel) as CardLevel;
  row.source = source;
  noteShiftCard(next, cardId);
  return { bench: next, isNew: false, leveled: row.level > prevLevel };
}

function noteShiftCard(bench: BenchState, cardId: string) {
  const shift = bench.activeShift;
  if (!shift || shift.endedAt) return;
  const card = getBenchCard(cardId);
  const tags = new Set(shift.tags);
  for (const tag of card?.tags ?? []) tags.add(tag);
  if (card?.subject) tags.add(card.subject);
  bench.activeShift = {
    ...shift,
    cardsEarned: shift.cardsEarned.includes(cardId)
      ? shift.cardsEarned
      : [...shift.cardsEarned, cardId],
    tags: [...tags],
  };
}

function roll(chance: number) {
  return Math.random() < chance;
}

function pickWeighted(cards: BenchCard[], rarities: CardRarity[]) {
  const pool = cards.filter((card) => rarities.includes(card.rarity));
  if (!pool.length) return cards[Math.floor(Math.random() * cards.length)];
  const weighted: BenchCard[] = [];
  for (const card of pool) {
    const w = Math.max(1, rarityWeight(card.rarity));
    for (let i = 0; i < w; i += 1) weighted.push(card);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}

export function tagsForDomain(domainId?: string, subject?: SubjectId): string[] {
  const tags = new Set<string>();
  if (subject) tags.add(subject);
  const domain = domainId ? getDomain(domainId) : undefined;
  if (domain) {
    tags.add(domain.id);
    tags.add(domain.subject);
    if (domain.cluster) tags.add(domain.cluster.toLowerCase());
    if (isCore1(domain.exam)) tags.add("core1");
    if (isCore2(domain.exam)) tags.add("core2");
  }
  if (domainId === "mobile-devices") {
    ["mobile", "battery", "usb", "wifi", "antenna"].forEach((tag) => tags.add(tag));
  }
  if (domainId === "networking") ["network", "dhcp", "wifi"].forEach((tag) => tags.add(tag));
  if (domainId === "hardware") ["hardware", "ram", "storage", "psu"].forEach((tag) => tags.add(tag));
  return [...tags];
}

export function tagsForBrain(cat?: BrainCat): string[] {
  if (!cat) return ["logic"];
  if (cat === "maths" || cat === "estimate" || cat === "chance") return ["maths", "glue"];
  if (cat === "code") return ["coding", "logic"];
  if (cat === "reading" || cat === "words" || cat === "crossword") return ["english", "logic"];
  if (cat === "spatial" || cat === "memory") return ["logic"];
  return ["logic", cat];
}

function matchingCards(tags: string[], types?: CardType[]) {
  const lower = tags.map((tag) => tag.toLowerCase());
  const subjects = new Set([
    "tech",
    "maths",
    "science",
    "history",
    "english",
    "geography",
    "coding",
    "business",
    "health",
    "music",
    "art",
    "civics",
    "languages",
    "logic",
    "digital",
  ]);
  const specific = lower.filter((tag) => !subjects.has(tag));
  const candidates = benchCards.filter((card) => {
    if (card.type === "crest") return false;
    if (types && !types.includes(card.type)) return false;
    return true;
  });
  const tagged = candidates.filter((card) =>
    card.tags.some((tag) => specific.includes(tag.toLowerCase())),
  );
  if (tagged.length) return tagged;
  return candidates.filter((card) =>
    card.tags.some((tag) => lower.includes(tag.toLowerCase()) || lower.includes(card.subject)),
  );
}

function award(
  bench: BenchState,
  cardId: string,
  source: CardEarnSource,
  awarded: DropResult["awarded"],
  gotchaFrom?: string,
) {
  const card = getBenchCard(cardId);
  if (!card) return bench;
  const result = addCopy(bench, cardId, source, gotchaFrom);
  awarded.push({ card, isNew: result.isNew, leveled: result.leveled, source });
  return result.bench;
}

export function dropFromPath(
  bench: BenchState,
  input: {
    correct: boolean;
    skipped?: boolean;
    domainId?: string;
    subject?: SubjectId;
    conceptId: string;
    /** When set, award this card on a correct answer and skip the random pool. */
    cardId?: string;
  },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  if (input.skipped) return { bench: next, awarded };
  if (input.cardId) {
    if (input.correct) next = award(next, input.cardId, "path", awarded);
    return { bench: next, awarded };
  }
  const starterDrop = Boolean(input.domainId?.endsWith("-start"));
  if (!input.correct) {
    if (!next.gotchaConcepts.includes(input.conceptId)) {
      const gotchas = matchingCards(tagsForDomain(input.domainId, input.subject), ["gotcha"]);
      const pick = gotchas[Math.abs(hash(input.conceptId)) % Math.max(1, gotchas.length)] ?? getBenchCard("k-usbc-charge-only");
      if (pick) {
        next = award(next, pick.id, "gotcha", awarded, input.conceptId);
        next.gotchaConcepts = [...next.gotchaConcepts, input.conceptId];
      }
    }
    return { bench: next, awarded };
  }
  if (!starterDrop && !roll(0.6)) return { bench: next, awarded };
  const pool = matchingCards(tagsForDomain(input.domainId, input.subject), [
    "component",
    "symptom",
    "tool",
    "procedure",
    "glue",
  ]);
  const pick = pickWeighted(pool.length ? pool : benchCards.filter((c) => c.type !== "crest" && c.type !== "gotcha"), [
    "common",
    "uncommon",
  ]);
  if (pick) next = award(next, pick.id, "path", awarded);
  return { bench: next, awarded };
}

export function dropFromBrain(
  bench: BenchState,
  input: { correct: boolean; skipped?: boolean; cat?: BrainCat },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  if (input.skipped || !input.correct) return { bench: next, awarded };
  if (!roll(0.4)) return { bench: next, awarded };
  const pool = matchingCards(tagsForBrain(input.cat), ["glue", "component", "procedure", "tool"]);
  const pick = pickWeighted(pool.length ? pool : benchCards.filter((c) => c.type === "glue" || c.type === "component"), [
    "common",
    "uncommon",
  ]);
  if (pick) next = award(next, pick.id, "brain", awarded);
  return { bench: next, awarded };
}

export function dropFromLab(
  bench: BenchState,
  input: { score: number; total: number; domainIds?: string[]; theme?: string },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  const tags = [
    ...(input.domainIds ?? []).flatMap((id) => tagsForDomain(id, "tech")),
    input.theme ?? "hardware",
    "core1",
  ];
  const guaranteed = matchingCards(tags, ["symptom", "procedure"]);
  const first = pickWeighted(guaranteed.length ? guaranteed : benchCards.filter((c) => c.type === "symptom" || c.type === "procedure"), [
    "common",
    "uncommon",
    "rare",
  ]);
  if (first) next = award(next, first.id, "lab", awarded);
  if (roll(0.3)) {
    const tools = matchingCards(tags, ["tool"]);
    const tool = pickWeighted(tools.length ? tools : benchCards.filter((c) => c.type === "tool"), [
      "common",
      "uncommon",
      "rare",
    ]);
    if (tool) next = award(next, tool.id, "lab", awarded);
  }
  return { bench: next, awarded };
}

export function maybeAwardCrest(
  bench: BenchState,
  input: { completedLessons: string[]; quizScores: Record<string, { score: number; total: number }> },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  for (const [domainId, cardId] of Object.entries(CREST_BY_DOMAIN)) {
    if (next.crests.includes(domainId)) continue;
    const domain = getDomain(domainId);
    if (!domain) continue;
    const lessonDone = input.completedLessons.includes(domain.lessonId);
    const quiz = input.quizScores[domain.quizId];
    const quizBar = quiz && quiz.total > 0 && quiz.score / quiz.total >= 0.8;
    if (lessonDone && quizBar) {
      next = award(next, cardId, "path", awarded);
      next.crests = [...next.crests, domainId];
    }
  }
  return { bench: next, awarded };
}

export function toastForAwards(awarded: DropResult["awarded"]): ToastEvent[] {
  return awarded.map((row, index) => ({
    id: `card-${row.card.id}-${Date.now()}-${index}`,
    kind: "card" as const,
    title: row.isNew ? row.card.title : row.leveled ? `${row.card.title} · level ${row.leveled ? "up" : ""}` : `${row.card.title} · extra copy`,
    body: row.source === "gotcha"
      ? `Gotcha. ${subtitleFor(row.card, 1)} Tap it in the Binder to replay the bite.`
      : subtitleFor(row.card, 1),
    cardId: row.card.id,
    rarity: row.card.rarity,
    cardType: row.card.type,
  }));
}

export function applyAwards(bench: BenchState, drop: DropResult, silent = false) {
  if (!silent && drop.awarded.length) enqueueToasts(toastForAwards(drop.awarded));
  return drop.bench;
}

export function startShift(bench: BenchState, lengthMin: 8 | 15 | 25, xp: number): BenchState {
  if (bench.activeShift && !bench.activeShift.endedAt) return bench;
  return {
    ...bench,
    pendingPack: undefined,
    activeShift: {
      lengthMin,
      startedAt: Date.now(),
      xpAtStart: xp,
      xpEarned: 0,
      cardsEarned: [],
      tags: [],
      packOpened: false,
    },
  };
}

function weakTag(bench: BenchState, completedLessons: string[]): string {
  const counts = new Map<string, number>();
  for (const domain of domains.filter((item) => item.exam)) {
    const done = completedLessons.includes(domain.lessonId) ? 1 : 0;
    counts.set(domain.id, done);
  }
  let worst = "mobile-devices";
  let worstScore = Infinity;
  for (const [id, score] of counts) {
    if (score < worstScore) {
      worst = id;
      worstScore = score;
    }
  }
  void bench;
  return worst;
}

export function closeShift(
  bench: BenchState,
  input: { xp: number; completedLessons: string[]; early?: boolean },
): BenchState {
  const shift = bench.activeShift;
  if (!shift || shift.endedAt) return bench;
  const early = Boolean(input.early);
  const elapsed = Date.now() - shift.startedAt;
  const planned = shift.lengthMin * 60 * 1000;
  const isEarly = early || elapsed < planned * 0.9;
  const xpEarned = Math.max(0, input.xp - shift.xpAtStart);
  const closed: DeskShift = {
    ...shift,
    endedAt: Date.now(),
    xpEarned,
    early: isEarly,
  };
  const weak = weakTag(bench, input.completedLessons);
  let packSize = 3;
  if (isEarly) {
    if (closed.cardsEarned.length < 1) {
      return {
        ...bench,
        activeShift: undefined,
        shifts: [closed, ...bench.shifts].slice(0, 12),
        pendingPack: undefined,
      };
    }
    packSize = 2;
  }
  const packIds = buildNightPack(bench, closed, weak, packSize);
  return {
    ...bench,
    activeShift: undefined,
    shifts: [closed, ...bench.shifts].slice(0, 12),
    pendingPack: { cardIds: packIds, at: Date.now(), weakTag: weak },
  };
}

function buildNightPack(bench: BenchState, shift: DeskShift, weak: string, size: number): string[] {
  const ids: string[] = [];
  const weakCards = matchingCards(tagsForDomain(weak, "tech"), ["component", "symptom", "procedure", "glue"]);
  if (shift.cardsEarned.length === 0) {
    const weakUncommon = (weakCards.length ? weakCards : benchCards).filter(
      (card) => card.rarity === "uncommon" && card.type !== "crest" && card.type !== "gotcha",
    );
    const weakPick =
      weakUncommon[Math.floor(Math.random() * Math.max(1, weakUncommon.length))] ??
      pickWeighted(weakCards.length ? weakCards : benchCards, ["uncommon"]);
    if (weakPick) ids.push(weakPick.id);
    const commons = benchCards.filter(
      (card) => card.rarity === "common" && card.type !== "crest" && card.type !== "gotcha",
    );
    while (ids.length < size) {
      const pick = commons[Math.floor(Math.random() * commons.length)];
      if (!pick) break;
      if (!ids.includes(pick.id)) ids.push(pick.id);
    }
    return ids.slice(0, size);
  }
  const weakPick = pickWeighted(weakCards.length ? weakCards : benchCards.filter((c) => c.rarity === "uncommon"), [
    "uncommon",
    "rare",
    "common",
  ]);
  if (weakPick) ids.push(weakPick.id);
  const sessionTags = new Set([...shift.tags, ...tagsForDomain(weak, "tech")]);
  const sessionPool = benchCards.filter(
    (card) =>
      shift.cardsEarned.includes(card.id) || card.tags.some((tag) => sessionTags.has(tag)),
  );
  while (ids.length < size) {
    const pick = pickWeighted(sessionPool.length ? sessionPool : benchCards.filter((c) => c.type !== "crest"), [
      "common",
      "uncommon",
      "rare",
    ]);
    if (!pick) break;
    if (!ids.includes(pick.id)) ids.push(pick.id);
    else if (ids.length < size) ids.push(pick.id);
    else break;
  }
  return ids.slice(0, size);
}

export function openNightPack(bench: BenchState): DropResult {
  const pack = bench.pendingPack;
  const awarded: DropResult["awarded"] = [];
  if (!pack) return { bench, awarded };
  let next: BenchState = { ...bench, owned: [...bench.owned], pendingPack: undefined };
  for (const id of pack.cardIds) {
    next = award(next, id, "pack", awarded);
  }
  const last = next.shifts[0];
  if (last) {
    next.shifts = [{ ...last, packOpened: true }, ...next.shifts.slice(1)];
  }
  return { bench: next, awarded };
}

export function slotCard(bench: BenchState, slot: BenchSlot, cardId: string | undefined): BenchState {
  const slotted = { ...bench.slotted };
  if (!cardId) {
    delete slotted[slot];
    return { ...bench, slotted };
  }
  const card = getBenchCard(cardId);
  const owned = bench.owned.find((row) => row.cardId === cardId);
  if (!card || !owned || card.slot !== slot) return bench;
  slotted[slot] = cardId;
  return {
    ...bench,
    slotted,
    owned: bench.owned.map((row) =>
      row.cardId === cardId ? { ...row, lastUsedAt: Date.now() } : row,
    ),
  };
}

export function setLoadout(bench: BenchState, loadout: BenchState["loadout"]): BenchState {
  const cleaned = loadout.map((id) => (id && bench.owned.some((row) => row.cardId === id) ? id : undefined)) as BenchState["loadout"];
  return { ...bench, loadout: cleaned };
}

/** Consume extra copies only. Never drop a unique below 1. */
export function fuse(bench: BenchState, recipeId: string): DropResult {
  const awarded: DropResult["awarded"] = [];
  const recipe = fusionRecipes.find((row) => row.id === recipeId);
  if (!recipe) return { bench, awarded };
  const next: BenchState = { ...bench, owned: bench.owned.map((row) => ({ ...row })) };
  for (const inputId of recipe.inputIds) {
    const row = next.owned.find((item) => item.cardId === inputId);
    if (!row || row.copies < 2) return { bench, awarded };
  }
  for (const inputId of recipe.inputIds) {
    const row = next.owned.find((item) => item.cardId === inputId);
    if (row) row.copies = 1;
  }
  const result = addCopy(next, recipe.outputId, "fuse");
  const card = getBenchCard(recipe.outputId);
  if (card) {
    awarded.push({ card, isNew: result.isNew, leveled: result.leveled, source: "fuse" });
  }
  return { bench: result.bench, awarded };
}

export function canFuse(bench: BenchState, recipeId: string) {
  const recipe = fusionRecipes.find((row) => row.id === recipeId);
  if (!recipe) return false;
  return recipe.inputIds.every((id) => {
    const row = bench.owned.find((item) => item.cardId === id);
    return Boolean(row && row.copies >= 2);
  });
}

export function rottingDomain(completedLessons: string[], lastSubject?: SubjectId) {
  const pool = lastSubject
    ? domains.filter((domain) => domain.subject === lastSubject)
    : domains.filter((domain) => !domain.exam);
  const cold = pool.find((domain) => !completedLessons.includes(domain.lessonId));
  return cold ?? pool[0] ?? domains[0];
}

export function huntCards(domainId: string) {
  return matchingCards(tagsForDomain(domainId), ["component", "symptom", "gotcha"]).slice(0, 3);
}

export function loadoutBonus(bench: BenchState) {
  return bench.loadout.filter(Boolean).length === 3 ? 20 : 0;
}

export function loadoutHint(bench: BenchState) {
  const titles = bench.loadout
    .map((id) => (id ? getBenchCard(id)?.title : undefined))
    .filter((title): title is string => Boolean(title));
  return titles.join(", ");
}

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ownedCount(bench: BenchState) {
  return bench.owned.length;
}

export function slottedCount(bench: BenchState) {
  return Object.values(bench.slotted).filter(Boolean).length;
}

const REVIEW_DELAY: Record<ReviewGrade, number> = {
  again: 10 * 60 * 1000,
  hard: 24 * 60 * 60 * 1000,
  easy: 3 * 24 * 60 * 60 * 1000,
};

export function reviewCard(bench: BenchState, cardId: string, grade: ReviewGrade): BenchState {
  const now = Date.now();
  return {
    ...bench,
    owned: bench.owned.map((row) => {
      if (row.cardId !== cardId) return row;
      const ease = Math.max(1.3, (row.ease ?? 2.5) + (grade === "easy" ? 0.15 : grade === "hard" ? -0.15 : -0.3));
      const reps = (row.reps ?? 0) + 1;
      const delay =
        grade === "easy" && reps > 1
          ? Math.round(REVIEW_DELAY.easy * ease)
          : REVIEW_DELAY[grade];
      return {
        ...row,
        ease,
        reps,
        lastUsedAt: now,
        dueAt: now + delay,
      };
    }),
  };
}

export function dueLabel(dueAt: number | undefined, at = Date.now()) {
  if (!dueAt) return "New";
  if (dueAt <= at) return "Due now";
  const days = Math.ceil((dueAt - at) / (24 * 60 * 60 * 1000));
  if (days <= 1) return "Due tomorrow";
  return `Due in ${days}d`;
}
