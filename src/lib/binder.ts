import {
  benchCards,
  cardPrintCode,
  collectibleForDomain,
  CREST_BY_DOMAIN,
  fusionRecipes,
  getBenchCard,
  isCrestCard,
  isFusionOnly,
} from "@/content/bench-cards";
import type {
  BenchCard,
  BenchSlot,
  CardEarnSource,
  CardType,
  SubjectId,
} from "@/content/types";
import { domains, getDomain } from "@/content/registry";
import { isCore1, isCore2 } from "@/lib/exam";
import type { BrainCat } from "@/content/brain/types";

export type CardLevel = 1 | 2 | 3;

export type ReviewGrade = "again" | "hard" | "easy";

export type WearKind = "scuff" | "coffee" | "date";

export interface WearMark {
  kind: WearKind;
  at: number;
}

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
  serial?: string;
  prints?: number;
  wear?: WearMark[];
  fieldNote?: string;
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

/** Legacy night-pack shape. Kept so old saves parse; no longer awarded as gacha. */
export interface NightPack {
  cardIds: string[];
  at: number;
  weakTag: string;
}

export interface PendingPrint {
  cardId: string;
  isNew: boolean;
  leveled: boolean;
  dust: boolean;
  source: CardEarnSource;
  serial?: string;
  printIndex: number;
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
  pendingPrints?: PendingPrint[];
  seenCardIds?: string[];
  lastWeeklySpecialWeek?: string;
}

export const emptyBench = (): BenchState => ({
  owned: [],
  slotted: {},
  loadout: [undefined, undefined, undefined],
  gotchaConcepts: [],
  crests: [],
  shifts: [],
  pendingPrints: [],
  seenCardIds: [],
});

function hydrateOwned(row: OwnedCard): OwnedCard {
  const card = getBenchCard(row.cardId);
  const first = row.firstEarnedAt || Date.now();
  const prints = row.prints ?? row.copies ?? 1;
  return {
    ...row,
    copies: row.copies || 1,
    level: row.level || 1,
    firstEarnedAt: first,
    prints,
    serial: row.serial ?? (card ? makeSerial(card, first, 1) : undefined),
    wear: Array.isArray(row.wear) ? row.wear : [],
    fieldNote: typeof row.fieldNote === "string" ? row.fieldNote : undefined,
  };
}

export function parseBench(raw: unknown): BenchState {
  if (!raw || typeof raw !== "object") return emptyBench();
  const parsed = raw as Partial<BenchState>;
  const owned = Array.isArray(parsed.owned)
    ? parsed.owned
        .filter((row): row is OwnedCard => Boolean(row && row.cardId))
        .map(hydrateOwned)
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
    pendingPack: undefined,
    pendingPrints: Array.isArray(parsed.pendingPrints) ? parsed.pendingPrints : [],
    seenCardIds: Array.isArray(parsed.seenCardIds) ? parsed.seenCardIds : [],
    lastWeeklySpecialWeek:
      typeof parsed.lastWeeklySpecialWeek === "string" ? parsed.lastWeeklySpecialWeek : undefined,
  };
}

export interface DropResult {
  bench: BenchState;
  awarded: {
    card: BenchCard;
    isNew: boolean;
    leveled: boolean;
    source: CardEarnSource;
    dust: boolean;
    serial?: string;
    printIndex: number;
  }[];
}

function ownedIndex(bench: BenchState, cardId: string) {
  return bench.owned.findIndex((row) => row.cardId === cardId);
}

export function formatStampDate(at: number) {
  const d = new Date(at);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function makeSerial(card: BenchCard, at: number, printIndex: number) {
  const code = cardPrintCode(card);
  return `TB-${code}-${formatStampDate(at)}-#${String(printIndex).padStart(4, "0")}`;
}

/** 1st copy owns the card. Later prints are dust on that unique. Never junk. */
export function addCopy(
  bench: BenchState,
  cardId: string,
  source: CardEarnSource,
  gotchaFrom?: string,
): { bench: BenchState; isNew: boolean; leveled: boolean; serial?: string; printIndex: number } {
  const card = getBenchCard(cardId);
  if (!card) return { bench, isNew: false, leveled: false, printIndex: 0 };
  const next: BenchState = {
    ...bench,
    owned: bench.owned.map((row) => ({ ...row })),
    seenCardIds: Array.from(new Set([...(bench.seenCardIds ?? []), cardId])),
  };
  const index = ownedIndex(next, cardId);
  const now = Date.now();
  if (index < 0) {
    const serial = makeSerial(card, now, 1);
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
        serial,
        prints: 1,
        wear: [],
      },
    ];
    noteShiftCard(next, cardId);
    return { bench: next, isNew: true, leveled: false, serial, printIndex: 1 };
  }
  const row = next.owned[index];
  row.prints = (row.prints ?? row.copies) + 1;
  row.source = source;
  if (row.copies === 1) {
    row.copies = 2;
    noteShiftCard(next, cardId);
    return {
      bench: next,
      isNew: false,
      leveled: false,
      serial: makeSerial(card, now, row.prints),
      printIndex: row.prints,
    };
  }
  row.copies = 1;
  const prevLevel = row.level;
  row.level = Math.min(3, (row.level + 1) as CardLevel) as CardLevel;
  noteShiftCard(next, cardId);
  return {
    bench: next,
    isNew: false,
    leveled: row.level > prevLevel,
    serial: makeSerial(card, now, row.prints),
    printIndex: row.prints,
  };
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
    if (isCrestCard(card) || isFusionOnly(card)) return false;
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

function pickDeterministic(cards: BenchCard[], seed: string) {
  if (!cards.length) return undefined;
  return cards[hash(seed) % cards.length];
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
  awarded.push({
    card,
    isNew: result.isNew,
    leveled: result.leveled,
    source,
    dust: !result.isNew,
    serial: result.serial,
    printIndex: result.printIndex,
  });
  return result.bench;
}

/** Every finished bite prints exactly one ticket. Same concept → same card. */
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
  const seed = `${input.domainId ?? "path"}:${input.conceptId}`;
  const tags = tagsForDomain(input.domainId, input.subject);
  if (!input.correct) {
    const gotchas = matchingCards(tags, ["gotcha"]);
    const pick =
      pickDeterministic(gotchas, seed) ??
      pickDeterministic(
        benchCards.filter((card) => card.type === "gotcha" && !isFusionOnly(card)),
        seed,
      );
    if (pick) next = award(next, pick.id, "gotcha", awarded, input.conceptId);
    return { bench: next, awarded };
  }
  const pool = matchingCards(tags, ["component", "symptom", "tool", "procedure"]);
  const fallback = benchCards.filter(
    (card) => !isCrestCard(card) && !isFusionOnly(card) && card.type !== "gotcha",
  );
  const pick = pickDeterministic(pool.length ? pool : fallback, seed);
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
  const seed = `brain:${input.cat ?? "logic"}`;
  const pool = matchingCards(tagsForBrain(input.cat), ["component", "procedure", "tool"]);
  const pick = pickDeterministic(
    pool.length ? pool : benchCards.filter((card) => !isCrestCard(card) && !isFusionOnly(card)),
    seed,
  );
  if (pick) next = award(next, pick.id, "brain", awarded);
  return { bench: next, awarded };
}

export function dropFromLab(
  bench: BenchState,
  input: { score: number; total: number; domainIds?: string[]; theme?: string; ticketId?: string },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  const tags = [
    ...(input.domainIds ?? []).flatMap((id) => tagsForDomain(id, "tech")),
    input.theme ?? "hardware",
    "core1",
  ];
  const pool = matchingCards(tags, ["symptom", "procedure", "tool", "component"]);
  const seed = `lab:${input.ticketId ?? input.theme ?? "ticket"}:${input.domainIds?.join(",") ?? ""}`;
  const pick = pickDeterministic(
    pool.length ? pool : benchCards.filter((card) => !isCrestCard(card) && !isFusionOnly(card)),
    seed,
  );
  if (pick) next = award(next, pick.id, "lab", awarded);
  return { bench: next, awarded };
}

export function isDomainSheetFull(bench: BenchState, domainId: string) {
  const sheet = collectibleForDomain(domainId);
  if (!sheet.length) return false;
  return sheet.every((card) => bench.owned.some((row) => row.cardId === card.id));
}

export function maybeAwardCrest(
  bench: BenchState,
  _input?: { completedLessons: string[]; quizScores: Record<string, { score: number; total: number }> },
): DropResult {
  const awarded: DropResult["awarded"] = [];
  let next = { ...bench, owned: [...bench.owned] };
  void _input;
  for (const [domainId, cardId] of Object.entries(CREST_BY_DOMAIN)) {
    if (next.crests.includes(domainId)) continue;
    if (!isDomainSheetFull(next, domainId)) continue;
    next = award(next, cardId, "path", awarded);
    next.crests = [...next.crests, domainId];
  }
  return { bench: next, awarded };
}

export function applyAwards(bench: BenchState, drop: DropResult) {
  if (!drop.awarded.length) return drop.bench;
  const pending = [...(drop.bench.pendingPrints ?? [])];
  for (const row of drop.awarded) {
    pending.push({
      cardId: row.card.id,
      isNew: row.isNew,
      leveled: row.leveled,
      dust: row.dust,
      source: row.source,
      serial: row.serial,
      printIndex: row.printIndex,
    });
  }
  return { ...drop.bench, pendingPrints: pending };
}

export function acknowledgePrint(bench: BenchState): BenchState {
  const pending = bench.pendingPrints ?? [];
  if (!pending.length) return bench;
  return { ...bench, pendingPrints: pending.slice(1) };
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

export function weekKey(at = Date.now()) {
  const d = new Date(at);
  const utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const day = new Date(utc).getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(utc + mondayOffset * 86400000);
  return `${monday.getUTCFullYear()}.${String(monday.getUTCMonth() + 1).padStart(2, "0")}.${String(monday.getUTCDate()).padStart(2, "0")}`;
}

/** Desk close no longer rolls a Night Pack. Shift history still stamps. */
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
    packOpened: true,
  };
  return {
    ...bench,
    activeShift: undefined,
    shifts: [closed, ...bench.shifts].slice(0, 12),
    pendingPack: undefined,
  };
}

export function weeklySpecialCard(
  bench: BenchState,
  completedLessons: string[],
  lastSubject?: SubjectId,
  at = Date.now(),
) {
  const week = weekKey(at);
  if (bench.lastWeeklySpecialWeek === week) return undefined;
  const rotting = rottingDomain(completedLessons, lastSubject);
  const pool = matchingCards(tagsForDomain(rotting.id, rotting.subject), [
    "component",
    "symptom",
    "procedure",
    "gotcha",
  ]);
  const pick = pickDeterministic(pool.length ? pool : matchingCards(["tech"], ["component"]), `${rotting.id}:${week}`);
  if (!pick) return undefined;
  return { card: pick, domain: rotting, week };
}

export function claimWeeklySpecial(
  bench: BenchState,
  completedLessons: string[],
  lastSubject?: SubjectId,
): DropResult {
  const special = weeklySpecialCard(bench, completedLessons, lastSubject);
  const awarded: DropResult["awarded"] = [];
  if (!special) return { bench, awarded };
  let next = award({ ...bench, owned: [...bench.owned] }, special.card.id, "weekly", awarded);
  next = { ...next, lastWeeklySpecialWeek: special.week };
  return { bench: next, awarded };
}

/** Legacy no-op: old night packs are not opened as loot. */
export function openNightPack(bench: BenchState): DropResult {
  return { bench: { ...bench, pendingPack: undefined }, awarded: [] };
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

/** Glue prints only from a named fusion recipe. Spends extra copies; unique stays. */
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
    awarded.push({
      card,
      isNew: result.isNew,
      leveled: result.leveled,
      source: "fuse",
      dust: !result.isNew,
      serial: result.serial,
      printIndex: result.printIndex,
    });
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

const WEAR_CYCLE: WearKind[] = ["scuff", "coffee", "date"];

export function addWear(bench: BenchState, cardId: string): BenchState {
  return {
    ...bench,
    owned: bench.owned.map((row) => {
      if (row.cardId !== cardId) return row;
      const wear = [...(row.wear ?? [])];
      const kind = WEAR_CYCLE[wear.length % WEAR_CYCLE.length];
      wear.push({ kind, at: Date.now() });
      return { ...row, wear: wear.slice(-8), lastUsedAt: Date.now() };
    }),
  };
}

export function addWearMany(bench: BenchState, cardIds: string[]): BenchState {
  return cardIds.reduce((state, id) => addWear(state, id), bench);
}

export function setFieldNote(bench: BenchState, cardId: string, note: string): BenchState {
  const trimmed = note.slice(0, 80);
  return {
    ...bench,
    owned: bench.owned.map((row) => (row.cardId === cardId ? { ...row, fieldNote: trimmed } : row)),
  };
}

export function markSeen(bench: BenchState, cardIds: string[]): BenchState {
  const seen = new Set(bench.seenCardIds ?? []);
  let changed = false;
  for (const id of cardIds) {
    if (!seen.has(id)) {
      seen.add(id);
      changed = true;
    }
  }
  if (!changed) return bench;
  return { ...bench, seenCardIds: [...seen] };
}

export function reviewCard(bench: BenchState, cardId: string, grade: ReviewGrade): BenchState {
  const now = Date.now();
  const reviewed: BenchState = {
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
  return addWear(reviewed, cardId);
}

export function dueLabel(dueAt: number | undefined, at = Date.now()) {
  if (!dueAt) return "New";
  if (dueAt <= at) return "Due now";
  const days = Math.ceil((dueAt - at) / (24 * 60 * 60 * 1000));
  if (days <= 1) return "Due tomorrow";
  return `Due in ${days}d`;
}

export function toastForAwards() {
  return [];
}
