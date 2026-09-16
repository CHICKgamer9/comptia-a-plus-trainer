import type { LingoLangId, LingoNode, LingoPack } from "./types";
import { isLingoLangId } from "./types";
import { LINGO_COURSES } from "./courses";
import { normalizeLingoPack } from "./normalize";
import { frU01L01 } from "./gold/fr-u01-l01";
import { idU01L01 } from "./gold/id-u01-l01";
import { isU01L01 } from "./gold/is-u01-l01";
import manifest from "./packs/manifest.json";

const loaders: Record<LingoLangId, () => Promise<{ default: LingoPack }>> = {
  fr: () => import("./packs/fr.json") as Promise<{ default: LingoPack }>,
  id: () => import("./packs/id.json") as Promise<{ default: LingoPack }>,
  is: () => import("./packs/is.json") as Promise<{ default: LingoPack }>,
};

const GOLD: Record<string, LingoNode> = {
  [frU01L01.id]: frU01L01,
  [idU01L01.id]: idU01L01,
  [isU01L01.id]: isU01L01,
};

const cache = new Map<LingoLangId, LingoPack>();

export function getLingoManifest() {
  return manifest;
}

function overlayGold(pack: LingoPack): LingoPack {
  return {
    ...pack,
    nodes: pack.nodes.map((node) => GOLD[node.id] ?? node),
  };
}

export async function loadLingoPack(lang: LingoLangId): Promise<LingoPack> {
  const hit = cache.get(lang);
  if (hit) return hit;
  const mod = await loaders[lang]();
  const pack = normalizeLingoPack(overlayGold(mod.default));
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
