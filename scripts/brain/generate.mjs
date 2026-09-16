import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { itemId } from "./rng.mjs";
import { buildWordSquares, buildLatticeMinis, buildLadders } from "./crossword.mjs";
import { buildWordPuzzles } from "./words.mjs";
import {
  buildAnalogies,
  buildChance,
  buildCode,
  buildEstimates,
  buildLateral,
  buildLogic,
  buildMaths,
  buildMemory,
  buildReading,
  buildSequences,
  buildSpatial,
  buildSyllogisms,
} from "./families.mjs";
import {
  buildBeats,
  buildEmoji,
  buildEthics,
  buildFacts,
  buildLies,
  buildMicro,
  buildOdd,
  buildPatterns,
  buildRiddles,
  buildSpell,
  buildTrivia,
} from "./scroll.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "../../src/content/brain/packs");
mkdirSync(outDir, { recursive: true });

const MIN = 20000;
const TARGETS = {
  maths: 2400,
  sequence: 1400,
  analogy: 1100,
  syllogism: 900,
  estimate: 800,
  chance: 800,
  code: 900,
  spatial: 800,
  memory: 600,
  reading: 800,
  lateral: 600,
  logic: 700,
  words: 3200,
  crossword: 1000,
  riddle: 800,
  trivia: 1400,
  emoji: 700,
  odd: 900,
  lie: 650,
  micro: 700,
  spell: 900,
  fact: 900,
  pattern: 800,
  ethic: 550,
  beat: 550,
};

function fingerprint(item) {
  if (item.kind === "crossword") return `cw|${item.grid}`;
  return `${item.kind}|${item.prompt}|${item.answer ?? ""}|${(item.choices ?? []).join("~")}`;
}

function stamp(cat, items) {
  const seen = new Set();
  const out = [];
  for (const raw of items) {
    const key = fingerprint(raw);
    if (seen.has(key)) continue;
    seen.add(key);
    const id = itemId(cat, out.length);
    out.push({ ...raw, id, cat });
  }
  return out;
}

console.log("Generating Brain Gym packs…");

const ladders = buildLadders(900, "ladders-v1");
const wordCore = buildWordPuzzles(2800, "words-v1");
const words = stamp("words", [...wordCore, ...ladders]);

const squares = buildWordSquares(600, "square-v1");
const lattice = buildLatticeMinis(800, "lattice-v1");
const crossword = stamp("crossword", [...squares, ...lattice]);

const packs = {
  maths: stamp("maths", buildMaths(TARGETS.maths, "maths-v1")),
  sequence: stamp("sequence", buildSequences(TARGETS.sequence, "seq-v1")),
  analogy: stamp("analogy", buildAnalogies(TARGETS.analogy, "ana-v1")),
  syllogism: stamp("syllogism", buildSyllogisms(TARGETS.syllogism, "syl-v1")),
  estimate: stamp("estimate", buildEstimates(TARGETS.estimate, "est-v1")),
  chance: stamp("chance", buildChance(TARGETS.chance, "chance-v1")),
  code: stamp("code", buildCode(TARGETS.code, "code-v1")),
  spatial: stamp("spatial", buildSpatial(TARGETS.spatial, "spa-v1")),
  memory: stamp("memory", buildMemory(TARGETS.memory, "mem-v1")),
  reading: stamp("reading", buildReading(TARGETS.reading, "read-v1")),
  lateral: stamp("lateral", buildLateral(TARGETS.lateral, "lat-v1")),
  logic: stamp("logic", buildLogic(TARGETS.logic, "log-v1")),
  riddle: stamp("riddle", buildRiddles(TARGETS.riddle, "riddle-v1")),
  trivia: stamp("trivia", buildTrivia(TARGETS.trivia, "trivia-v1")),
  emoji: stamp("emoji", buildEmoji(TARGETS.emoji, "emoji-v1")),
  odd: stamp("odd", buildOdd(TARGETS.odd, "odd-v1")),
  lie: stamp("lie", buildLies(TARGETS.lie, "lie-v1")),
  micro: stamp("micro", buildMicro(TARGETS.micro, "micro-v1")),
  spell: stamp("spell", buildSpell(TARGETS.spell, "spell-v1")),
  fact: stamp("fact", buildFacts(TARGETS.fact, "fact-v1")),
  pattern: stamp("pattern", buildPatterns(TARGETS.pattern, "pattern-v1")),
  ethic: stamp("ethic", buildEthics(TARGETS.ethic, "ethic-v1")),
  beat: stamp("beat", buildBeats(TARGETS.beat, "beat-v1")),
  words,
  crossword,
};

const categories = [
  ["maths", "Mental maths", "Arithmetic, rates, GST, algebra moves"],
  ["sequence", "Patterns", "What comes next — and why"],
  ["analogy", "Analogies", "A is to B as C is to ?"],
  ["syllogism", "Syllogisms", "All / some / none — don't slide"],
  ["estimate", "Estimation", "Close without a calculator ritual"],
  ["chance", "Chance", "Probability that isn't a poster"],
  ["code", "Code trace", "Tiny programs, honest outputs"],
  ["spatial", "Spatial", "Turns, nets, painted cubes"],
  ["memory", "Memory span", "Flash, then prove it"],
  ["reading", "Reading traps", "The extra sentence is bait"],
  ["lateral", "What's wrong", "Name the cheat in the claim"],
  ["logic", "Logic grids", "Tiny deduction tables"],
  ["words", "Word puzzles", "Anagrams, ladders, cryptos, reveal"],
  ["crossword", "Crosswords", "Playable mini grids, across and down"],
  ["riddle", "Riddles", "Lateral one-liners, not arithmetic"],
  ["trivia", "Trivia sparks", "Science, history, geo, tech — short MCQ"],
  ["emoji", "Emoji equations", "Rebus-lite and digit sums"],
  ["odd", "Odd one out", "Words, numbers, concepts"],
  ["lie", "Two truths, one lie", "Pick the lie"],
  ["micro", "Micro reading", "Two to four sentences, then a trap"],
  ["spell", "Spelling", "Aussie-friendly spelling and word choice"],
  ["fact", "Quick facts", "True/false with a one-line why"],
  ["pattern", "Pattern find", "Letters, symbols, tiny grids"],
  ["ethic", "What would you do?", "Micro ethics and digital citizenship"],
  ["beat", "Beats", "Count, rest, note values — tap, not audio"],
];

const meta = categories.map(([id, title, blurb]) => {
  const items = packs[id];
  const avg =
    items.reduce((sum, item) => sum + (item.minutes || 1), 0) / Math.max(1, items.length);
  return { id, title, blurb, count: items.length, avgMinutes: Math.round(avg * 10) / 10 };
});

const total = meta.reduce((sum, row) => sum + row.count, 0);
if (total < MIN) {
  throw new Error(`Brain gym under floor: ${total} < ${MIN}`);
}

const recipe = [
  { cat: "crossword", minutes: 10 },
  { cat: "words", minutes: 12 },
  { cat: "maths", minutes: 12 },
  { cat: "sequence", minutes: 8 },
  { cat: "analogy", minutes: 6 },
  { cat: "syllogism", minutes: 6 },
  { cat: "estimate", minutes: 5 },
  { cat: "chance", minutes: 6 },
  { cat: "code", minutes: 6 },
  { cat: "spatial", minutes: 5 },
  { cat: "memory", minutes: 4 },
  { cat: "reading", minutes: 5 },
  { cat: "lateral", minutes: 3 },
  { cat: "logic", minutes: 3 },
  { cat: "riddle", minutes: 4 },
  { cat: "trivia", minutes: 5 },
  { cat: "emoji", minutes: 3 },
  { cat: "odd", minutes: 3 },
  { cat: "spell", minutes: 3 },
  { cat: "fact", minutes: 3 },
  { cat: "lie", minutes: 2 },
  { cat: "micro", minutes: 2 },
  { cat: "pattern", minutes: 2 },
  { cat: "ethic", minutes: 1 },
  { cat: "beat", minutes: 1 },
];

const avgAll = total
  ? meta.reduce((sum, row) => sum + row.avgMinutes * row.count, 0) / total
  : 2;
const uniqueDaysAt60 = Math.floor(total / 60);

const manifest = {
  generatedAt: new Date().toISOString(),
  total,
  minFloor: MIN,
  targetMinutes: 120,
  categories: meta,
  recipe,
  wordMinutes: 12,
  crosswordCount: packs.crossword.length,
  uniqueDaysAt60,
  avgMinutes: Math.round(avgAll * 100) / 100,
};

function writeJson(name, data) {
  const path = join(outDir, name);
  writeFileSync(path, JSON.stringify(data));
  const kb = (JSON.stringify(data).length / 1024).toFixed(0);
  console.log(`  ${name.padEnd(22)} ${String(Array.isArray(data) ? data.length : "").padStart(5)}  ${kb} KB`);
}

writeJson("manifest.json", manifest);
for (const [id, items] of Object.entries(packs)) {
  writeJson(`${id}.json`, items);
}

console.log("Total unique challenges:", total);
console.log("Crosswords:", packs.crossword.length);
console.log("Word puzzles:", packs.words.length);
console.log("Unique days if 60 items/day:", uniqueDaysAt60);
if (packs.crossword.length < 200) {
  console.warn("Crossword count is thin — check filler.");
}
