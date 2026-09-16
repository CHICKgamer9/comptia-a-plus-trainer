import { getBrainManifest } from "@/content/brain/load";
import type { BrainCat, BrainManifest } from "@/content/brain/types";
import { catOfId } from "./brain-daily";
import { itemId, makeRng } from "./brain-rng";

/** Mix new families with the original desk so a session never feels like one pack. */
export const FEED_MIX: { cat: BrainCat; weight: number }[] = [
  { cat: "trivia", weight: 10 },
  { cat: "riddle", weight: 8 },
  { cat: "emoji", weight: 7 },
  { cat: "odd", weight: 7 },
  { cat: "fact", weight: 7 },
  { cat: "spell", weight: 6 },
  { cat: "lie", weight: 6 },
  { cat: "micro", weight: 5 },
  { cat: "pattern", weight: 5 },
  { cat: "ethic", weight: 5 },
  { cat: "beat", weight: 5 },
  { cat: "maths", weight: 6 },
  { cat: "sequence", weight: 4 },
  { cat: "analogy", weight: 4 },
  { cat: "words", weight: 4 },
  { cat: "estimate", weight: 3 },
  { cat: "chance", weight: 3 },
  { cat: "code", weight: 3 },
  { cat: "reading", weight: 3 },
  { cat: "lateral", weight: 3 },
  { cat: "syllogism", weight: 2 },
  { cat: "spatial", weight: 2 },
  { cat: "memory", weight: 2 },
  { cat: "logic", weight: 1 },
  { cat: "crossword", weight: 1 },
];

export const FEED_SKIP_XP = 2;
export const FEED_SKIP_COOLDOWN_MS = 1400;
export const FEED_ADVANCE_MS = 700;

function flattenMix(mix: { cat: BrainCat; weight: number }[]) {
  const bag: BrainCat[] = [];
  for (const row of mix) {
    for (let i = 0; i < row.weight; i += 1) bag.push(row.cat);
  }
  return bag;
}

function dayBag(ymd: string, manifest: BrainManifest): BrainCat[] {
  const live = flattenMix(FEED_MIX).filter((cat) => {
    const meta = manifest.categories.find((row) => row.id === cat);
    return (meta?.count ?? 0) > 0;
  });
  return makeRng(`${ymd}:feed-bag`).shuffle(live);
}

export function feedItemId(
  ymd: string,
  index: number,
  manifest: BrainManifest = getBrainManifest(),
): string {
  const bag = dayBag(ymd, manifest);
  const cat = bag[index % bag.length] ?? "trivia";
  const count = manifest.categories.find((row) => row.id === cat)?.count ?? 1;
  const slot = makeRng(`${ymd}:feed:${index}:${cat}`).int(0, Math.max(0, count - 1));
  return itemId(cat, slot);
}

export function feedPreviewCats(ymd: string, take = 6, manifest: BrainManifest = getBrainManifest()) {
  const seen = new Set<BrainCat>();
  const out: BrainCat[] = [];
  for (let i = 0; i < take * 4 && out.length < take; i += 1) {
    const cat = catOfId(feedItemId(ymd, i, manifest));
    if (!cat || seen.has(cat)) continue;
    seen.add(cat);
    out.push(cat);
  }
  return out;
}

export function formatSessionClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
