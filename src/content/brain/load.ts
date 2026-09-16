import type { BrainCat, BrainItem, BrainManifest } from "./types";
import manifest from "./packs/manifest.json";

export const BRAIN_CATS: BrainCat[] = [
  "crossword",
  "words",
  "maths",
  "sequence",
  "analogy",
  "syllogism",
  "estimate",
  "chance",
  "code",
  "spatial",
  "memory",
  "reading",
  "lateral",
  "logic",
];

const loaders: Record<BrainCat, () => Promise<{ default: unknown }>> = {
  maths: () => import("./packs/maths.json"),
  sequence: () => import("./packs/sequence.json"),
  analogy: () => import("./packs/analogy.json"),
  syllogism: () => import("./packs/syllogism.json"),
  estimate: () => import("./packs/estimate.json"),
  chance: () => import("./packs/chance.json"),
  code: () => import("./packs/code.json"),
  spatial: () => import("./packs/spatial.json"),
  memory: () => import("./packs/memory.json"),
  reading: () => import("./packs/reading.json"),
  lateral: () => import("./packs/lateral.json"),
  logic: () => import("./packs/logic.json"),
  words: () => import("./packs/words.json"),
  crossword: () => import("./packs/crossword.json"),
};

const cache = new Map<BrainCat, BrainItem[]>();

export function getBrainManifest(): BrainManifest {
  return manifest as unknown as BrainManifest;
}

export function isBrainCat(value: string): value is BrainCat {
  return value in loaders;
}

export async function loadBrainPack(cat: BrainCat): Promise<BrainItem[]> {
  const hit = cache.get(cat);
  if (hit) return hit;
  const mod = await loaders[cat]();
  const items = mod.default as BrainItem[];
  cache.set(cat, items);
  return items;
}

export async function loadBrainItem(id: string): Promise<BrainItem | null> {
  const match = /^b-([a-z]+)-(\d+)$/.exec(id);
  if (!match || !isBrainCat(match[1])) return null;
  const pack = await loadBrainPack(match[1]);
  const index = Number(match[2]);
  if (pack[index]?.id === id) return pack[index];
  return pack.find((item) => item.id === id) ?? null;
}

export function catTitle(cat: BrainCat, manifest: BrainManifest = getBrainManifest()) {
  return manifest.categories.find((row) => row.id === cat)?.title ?? cat;
}
