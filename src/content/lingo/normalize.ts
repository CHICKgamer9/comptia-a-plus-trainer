import type { LingoItemType, LingoNode, LingoPack, LingoStep } from "./types";
import { lingoItemType } from "./types";

function lemmaOf(step: LingoStep): string | undefined {
  return step.lemma ?? step.native ?? step.answers?.[0];
}

function withSpeak(step: LingoStep): LingoStep {
  const type = lingoItemType(step);
  const speakTarget = step.speakTarget ?? step.speech ?? step.native;
  const speakGloss = step.speakGloss ?? (type === "introduce" ? step.meaning : undefined);
  const speak = step.speak ?? (speakTarget ? { silent: true as const } : step.prompt);
  return { ...step, type, speakTarget, speakGloss, speak };
}

function asIntroduce(step: LingoStep): LingoStep {
  return withSpeak({
    ...step,
    kind: "introduce",
    type: "introduce",
    new: true,
    lemma: lemmaOf(step),
    choices: undefined,
  });
}

function asListenPick(step: LingoStep): LingoStep {
  return withSpeak({
    ...step,
    kind: "listen-pick",
    type: "listen-pick",
    new: false,
  });
}

/**
 * First item for a new lemma is never a quiz.
 * Match only after lemmas have been introduced, and only among taught.
 */
export function normalizeLingoNode(node: LingoNode): LingoNode {
  const taught = new Set<string>();
  const steps: LingoStep[] = [];

  for (const raw of node.steps) {
    const type = lingoItemType(raw);
    const lemma = lemmaOf(raw);
    const isNew = raw.new === true || (Boolean(lemma) && !taught.has(lemma!) && type !== "match" && type !== "speak");

    if (isNew && lemma && type !== "introduce") {
      steps.push(asIntroduce({ ...raw, id: `${raw.id}-intro` }));
      taught.add(lemma);
      if (raw.choices?.length || raw.pairs?.length || raw.answers?.length) {
        steps.push(asListenPick({ ...raw, new: false }));
      }
      continue;
    }

    if (type === "introduce" && lemma) {
      taught.add(lemma);
      steps.push(withSpeak({ ...raw, type: "introduce", kind: "introduce", new: true, lemma }));
      continue;
    }

    if (type === "match" && raw.pairs?.length) {
      const taughtPairs = raw.pairs.filter((pair) => taught.has(pair.left) || taught.has(pair.right));
      const pairs = taughtPairs.length >= 2 ? taughtPairs : raw.pairs.slice(0, Math.min(4, raw.pairs.length));
      for (const pair of pairs) taught.add(pair.left);
      steps.push(withSpeak({ ...raw, type: "match", pairs }));
      continue;
    }

    if (lemma) taught.add(lemma);
    steps.push(withSpeak({ ...raw, type, new: false }));
  }

  if (!steps.length) return { ...node, steps };
  if (lingoItemType(steps[0]) !== "introduce") {
    const first = steps[0];
    steps[0] = asIntroduce(first);
    if (first.choices?.length) {
      steps.splice(1, 0, asListenPick({ ...first, id: `${first.id}-pick`, new: false }));
    }
  }

  return { ...node, steps };
}

export function normalizeLingoPack(pack: LingoPack): LingoPack {
  return { ...pack, nodes: pack.nodes.map(normalizeLingoNode) };
}

export function isQuizType(type: LingoItemType) {
  return type !== "introduce";
}
