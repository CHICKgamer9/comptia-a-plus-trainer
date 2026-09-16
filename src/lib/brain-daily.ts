import { getBrainManifest } from "@/content/brain/load";
import type { BrainCat, BrainManifest } from "@/content/brain/types";
import { DAILY_TARGET_MINUTES } from "@/content/brain/types";
import { itemId, makeRng } from "./brain-rng";

interface DaySlice {
  ids: string[];
  answered: string[];
  minutesTarget: number;
  minutesDone: number;
  completed: boolean;
}

interface BrainSlice {
  answeredIds: string[];
  days: Record<string, DaySlice>;
}

export function buildDailyIds(
  ymd: string,
  manifest: BrainManifest = getBrainManifest(),
  answered: Set<string> = new Set(),
): string[] {
  const used = new Set<string>();
  const ids: string[] = [];
  for (const slot of manifest.recipe) {
    const meta = manifest.categories.find((row) => row.id === slot.cat);
    if (!meta?.count) continue;
    const avg = meta.avgMinutes || 2;
    const rng = makeRng(`${ymd}:${slot.cat}`);
    const indices = rng.shuffle(Array.from({ length: meta.count }, (_, index) => index));
    const unused = indices.filter((index) => !answered.has(itemId(slot.cat, index)));
    const pool = unused.length ? [...unused, ...indices.filter((index) => answered.has(itemId(slot.cat, index)))] : indices;
    let mins = 0;
    for (const index of pool) {
      const id = itemId(slot.cat, index);
      if (used.has(id)) continue;
      used.add(id);
      ids.push(id);
      mins += avg;
      if (mins >= slot.minutes) break;
    }
  }
  return ids;
}

export function playlistForDay(
  ymd: string,
  brain: BrainSlice | undefined,
  manifest: BrainManifest = getBrainManifest(),
): { ids: string[]; frozen: boolean } {
  const frozen = brain?.days[ymd];
  if (frozen?.ids?.length) return { ids: frozen.ids, frozen: true };
  return {
    ids: buildDailyIds(ymd, manifest, new Set(brain?.answeredIds ?? [])),
    frozen: false,
  };
}

export function dayRecord(
  ymd: string,
  brain: BrainSlice | undefined,
  manifest: BrainManifest = getBrainManifest(),
): DaySlice {
  const existing = brain?.days[ymd];
  if (existing) return existing;
  const { ids } = playlistForDay(ymd, brain, manifest);
  return {
    ids,
    answered: [],
    minutesTarget: DAILY_TARGET_MINUTES,
    minutesDone: 0,
    completed: false,
  };
}

export function nextUnanswered(ids: string[], answered: Set<string>) {
  return ids.find((id) => !answered.has(id));
}

export function wordSliceMinutes(manifest: BrainManifest = getBrainManifest()) {
  const crossword = manifest.recipe.find((row) => row.cat === "crossword")?.minutes ?? 0;
  const words = manifest.recipe.find((row) => row.cat === "words")?.minutes ?? 0;
  return { crossword, words, total: crossword + words };
}

export function catOfId(id: string): BrainCat | null {
  const match = /^b-([a-z]+)-/.exec(id);
  return (match?.[1] as BrainCat) ?? null;
}
