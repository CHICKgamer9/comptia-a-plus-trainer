import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fr } from "./fr.mjs";
import { id } from "./id.mjs";
import { is } from "./is.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "../../src/content/lingo/packs");

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle(rng, list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function whyFor(item) {
  if (item.why) return item.why;
  const extra = item.note ? ` ${item.note}` : "";
  return `"${item.n}" means "${item.e}".${extra}`;
}

function alts(item, field) {
  const extra = field === "e" ? item.altsE : item.altsN;
  const primary = field === "e" ? item.e : item.n;
  return [primary, ...(extra ?? [])];
}

function take(list, start, count) {
  const out = [];
  if (!list.length) return out;
  for (let i = 0; i < count; i += 1) {
    out.push(list[(start + i) % list.length]);
  }
  return out;
}

function distractors(rng, correct, pool, n = 3) {
  const folded = String(correct).toLowerCase();
  const unique = [];
  for (const item of shuffle(rng, pool)) {
    if (String(item).toLowerCase() === folded) continue;
    if (unique.some((row) => String(row).toLowerCase() === String(item).toLowerCase())) continue;
    unique.push(item);
    if (unique.length >= n) break;
  }
  return unique;
}

function choices(rng, correct, pool) {
  const dist = distractors(rng, correct, pool, 3);
  while (dist.length < 3) dist.push(`${correct} ?`);
  return shuffle(rng, [correct, ...dist]).map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
    correct: label === correct,
  }));
}

function tokensOf(phrase) {
  if (phrase.tokens?.length) return phrase.tokens;
  return String(phrase.n)
    .replace(/[?!.,]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function poolEnglish(bank) {
  return bank.map((item) => item.e);
}

function poolNative(bank) {
  return bank.map((item) => item.n);
}

function vocabTap(rng, item, bank, direction, stepId) {
  const toEn = direction === "nen";
  const prompt = toEn
    ? `Tap the meaning of “${item.n}”.`
    : `Tap the ${item.langLabel} for “${item.e}”.`;
  const correct = toEn ? item.e : item.n;
  const pool = toEn ? poolEnglish(bank) : poolNative(bank);
  return {
    id: stepId,
    kind: "vocab",
    prompt,
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    choices: choices(rng, correct, pool),
    why: whyFor(item),
  };
}

function listenStep(rng, item, bank, stepId) {
  return {
    id: stepId,
    kind: "listen",
    prompt: "Read or listen, then tap the meaning.",
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    choices: choices(rng, item.e, poolEnglish(bank)),
    why: whyFor(item),
  };
}

function orderStep(item, stepId) {
  const tokens = tokensOf(item);
  return {
    id: stepId,
    kind: "order",
    prompt: `Build the ${item.langLabel}: “${item.e}”`,
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    items: tokens.map((label, index) => ({ id: `t${index}`, label })),
    correctOrder: tokens.map((_, index) => `t${index}`),
    why: whyFor(item),
  };
}

function matchStep(items, stepId, prompt) {
  return {
    id: stepId,
    kind: "match",
    prompt,
    pairs: items.map((item) => ({ left: item.n, right: item.e })),
    why: "Match each word to a meaning you can reuse.",
  };
}

function typeStep(item, direction, stepId) {
  const toNative = direction === "enn";
  return {
    id: stepId,
    kind: "type",
    prompt: toNative
      ? `Type the ${item.langLabel} for “${item.e}”. Accents optional.`
      : `Type the English for “${item.n}”.`,
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    answers: toNative ? alts(item, "n") : alts(item, "e"),
    why: whyFor(item),
  };
}

function speakStep(item, stepId) {
  return {
    id: stepId,
    kind: "speak",
    prompt: "Say it out loud. Honor system — mark when you have.",
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    why: `Aim for ${item.p ? `“${item.p}”` : "the shape of the words"}. Meaning: ${item.e}.`,
  };
}

function blankStep(rng, item, bank, stepId) {
  const tokens = tokensOf(item);
  const hole = Math.min(tokens.length - 1, Math.max(0, Math.floor(tokens.length / 2)));
  const missing = tokens[hole];
  const shown = tokens.map((tok, index) => (index === hole ? "___" : tok)).join(" ");
  return {
    id: stepId,
    kind: "vocab",
    prompt: `Fill the blank: ${shown}`,
    native: item.n,
    phonetic: item.p,
    meaning: item.e,
    speech: item.n,
    choices: choices(rng, missing, tokensOfMany(bank)),
    why: whyFor(item),
  };
}

function tokensOfMany(bank) {
  const out = [];
  for (const item of bank) {
    for (const tok of tokensOf(item)) {
      if (!out.includes(tok)) out.push(tok);
    }
    if (item.n && !out.includes(item.n)) out.push(item.n);
  }
  return out;
}

function tag(items, langLabel) {
  return items.map((item) => ({ ...item, langLabel }));
}

function buildLessons(course, unit, unitIndex, allVocab, allPhrases) {
  const langLabel = course.title;
  const vocab = tag(unit.vocab, langLabel);
  const phrases = tag(unit.phrases, langLabel);
  const mixBank = tag([...unit.vocab, ...unit.phrases], langLabel);
  const extraVocab = tag(allVocab, langLabel);
  const extraPhrases = tag(allPhrases, langLabel);
  const seed = hashSeed(`${course.id}:${unitIndex}`);

  if (vocab.length < 12) {
    throw new Error(`${course.id} unit ${unitIndex} (${unit.title}) needs ≥12 vocab, has ${vocab.length}`);
  }
  if (phrases.length < 8) {
    throw new Error(`${course.id} unit ${unitIndex} (${unit.title}) needs ≥8 phrases, has ${phrases.length}`);
  }

  const v1 = vocab.slice(0, 6);
  const v2 = vocab.slice(6, 12);
  const pListen = phrases.slice(0, 6);
  const pOrder = phrases.slice(0, 5);
  const pBlank = phrases[5];
  const pSpeak = phrases.slice(0, 3);

  const lessons = [
    {
      title: "New words",
      build(rng) {
        const steps = v1.map((item, index) =>
          vocabTap(rng, item, [...vocab, ...extraVocab], "nen", `s${index + 1}`),
        );
        steps.push(matchStep(v1.slice(0, 4), "s7", "Match the new words."));
        return steps;
      },
    },
    {
      title: "Tap the form",
      build(rng) {
        const steps = v2.map((item, index) =>
          vocabTap(rng, item, [...vocab, ...extraVocab], "enn", `s${index + 1}`),
        );
        steps.push(matchStep(v2.slice(0, 4), "s7", "Match English to the real spelling."));
        return steps;
      },
    },
    {
      title: "Hear the line",
      build(rng) {
        return pListen.map((item, index) =>
          listenStep(rng, item, [...phrases, ...extraPhrases], `s${index + 1}`),
        );
      },
    },
    {
      title: "Build the sentence",
      build(rng) {
        const steps = pOrder.map((item, index) => orderStep(item, `s${index + 1}`));
        steps.push(blankStep(rng, pBlank, mixBank, "s6"));
        return steps;
      },
    },
    {
      title: "Type it",
      build(rng) {
        void rng;
        const a = take(vocab, 0, 4).map((item, index) => typeStep(item, "enn", `s${index + 1}`));
        const b = take(phrases, 0, 2).map((item, index) => typeStep(item, "nen", `s${index + 5}`));
        return [...a, ...b];
      },
    },
    {
      title: "Say it",
      build(rng) {
        const speaks = pSpeak.map((item, index) => speakStep(item, `s${index + 1}`));
        const review = take(vocab, 3, 2).map((item, index) =>
          vocabTap(rng, item, extraVocab.length ? extraVocab : vocab, "nen", `s${index + 4}`),
        );
        const match = matchStep(take(mixBank, 2, 4), "s6", "Quick pair check.");
        return [...speaks, ...review, match];
      },
    },
  ];

  return lessons.map((lesson, lessonIndex) => {
    const rng = mulberry32(seed + (lessonIndex + 1) * 997);
    return {
      title: lesson.title,
      steps: lesson.build(rng).map((step, stepIndex) => ({
        ...step,
        id: `${course.id}-u${String(unitIndex).padStart(2, "0")}-l${String(lessonIndex + 1).padStart(2, "0")}-${step.id || `s${stepIndex + 1}`}`,
      })),
    };
  });
}

function buildPack(course) {
  const allVocab = course.units.flatMap((unit) => unit.vocab);
  const allPhrases = course.units.flatMap((unit) => unit.phrases);
  const nodes = [];
  const units = [];

  course.units.forEach((unit, index) => {
    const unitIndex = index + 1;
    const lessons = buildLessons(course, unit, unitIndex, allVocab, allPhrases);
    const nodeIds = [];
    lessons.forEach((lesson) => {
      const nodeId = `${course.id}-u${String(unitIndex).padStart(2, "0")}-l${String(nodeIds.length + 1).padStart(2, "0")}`;
      nodes.push({
        id: nodeId,
        lang: course.id,
        unit: unitIndex,
        unitTitle: unit.title,
        skill: unit.skill,
        title: lesson.title,
        index: nodes.length,
        steps: lesson.steps,
      });
      nodeIds.push(nodeId);
    });
    units.push({
      index: unitIndex,
      title: unit.title,
      skill: unit.skill,
      nodeIds,
    });
  });

  if (nodes.length < 60) {
    throw new Error(`${course.id} has ${nodes.length} nodes, need ≥60`);
  }

  return {
    id: course.id,
    title: course.title,
    nativeName: course.nativeName,
    mark: course.mark,
    blurb: course.blurb,
    speechLang: course.speechLang,
    accent: course.accent,
    accentDim: course.accentDim,
    units,
    nodes,
  };
}

const courses = [fr, id, is];
mkdirSync(outDir, { recursive: true });

const summary = [];
for (const course of courses) {
  const pack = buildPack(course);
  writeFileSync(join(outDir, `${course.id}.json`), `${JSON.stringify(pack)}\n`);
  summary.push({
    id: pack.id,
    nodes: pack.nodes.length,
    steps: pack.nodes.reduce((sum, node) => sum + node.steps.length, 0),
    units: pack.units.length,
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  courses: summary,
  totalNodes: summary.reduce((sum, row) => sum + row.nodes, 0),
};
writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
