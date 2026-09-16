import type { LingoLangId, LingoNode, LingoPack } from "./types";
import { isLingoLangId } from "./types";
import { LINGO_COURSES } from "./courses";
import manifest from "./packs/manifest.json";

const loaders: Record<LingoLangId, () => Promise<{ default: LingoPack }>> = {
  fr: () => import("./packs/fr.json") as Promise<{ default: LingoPack }>,
  id: () => import("./packs/id.json") as Promise<{ default: LingoPack }>,
  is: () => import("./packs/is.json") as Promise<{ default: LingoPack }>,
};

const cache = new Map<LingoLangId, LingoPack>();

export function getLingoManifest() {
  return manifest;
}

export async function loadLingoPack(lang: LingoLangId): Promise<LingoPack> {
  const hit = cache.get(lang);
  if (hit) return hit;
  const mod = await loaders[lang]();
  const pack = mod.default;
  cache.set(lang, pack);
  return pack;
}

export async function loadLingoNode(lang: string, nodeId: string): Promise<LingoNode | null> {
  if (!isLingoLangId(lang)) return null;
  const pack = await loadLingoPack(lang);
  return pack.nodes.find((node) => node.id === nodeId) ?? null;
}

export function lingoMeta(lang: LingoLangId) {
  return LINGO_COURSES[lang];
}
