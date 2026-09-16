import type { LingoLangId, LingoNode, LingoPack } from "@/content/lingo/types";
import type { LingoLangProgress, LingoState } from "./progress";

export function emptyLingoLang(): LingoLangProgress {
  return { completedNodes: [] };
}

export function langProgress(lingo: LingoState | undefined, lang: LingoLangId): LingoLangProgress {
  return lingo?.byLang?.[lang] ?? emptyLingoLang();
}

export function nodeUnlocked(pack: LingoPack, completed: string[], nodeId: string): boolean {
  const index = pack.nodes.findIndex((node) => node.id === nodeId);
  if (index <= 0) return true;
  const prev = pack.nodes[index - 1];
  return Boolean(prev && completed.includes(prev.id));
}

export function continueNode(pack: LingoPack, completed: string[], lastNodeId?: string): LingoNode {
  const nextOpen = pack.nodes.find((node) => !completed.includes(node.id));
  if (nextOpen) return nextOpen;
  const last = lastNodeId ? pack.nodes.find((node) => node.id === lastNodeId) : undefined;
  return last ?? pack.nodes[0];
}

export function lingoHref(lang: LingoLangId, nodeId?: string) {
  return nodeId ? `/lingo/${lang}/${nodeId}` : `/lingo/${lang}`;
}
