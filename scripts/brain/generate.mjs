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

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "../../src/content/brain/packs");
mkdirSync(outDir, { recursive: true });

const MIN = 8000;
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
  { cat: "crossword", minutes: 12 },
  { cat: "words", minutes: 18 },
  { cat: "maths", minutes: 16 },
  { cat: "sequence", minutes: 10 },
  { cat: "analogy", minutes: 8 },
  { cat: "syllogism", minutes: 8 },
  { cat: "estimate", minutes: 6 },
  { cat: "chance", minutes: 8 },
  { cat: "code", minutes: 8 },
  { cat: "spatial", minutes: 6 },
  { cat: "memory", minutes: 6 },
  { cat: "reading", minutes: 6 },
  { cat: "lateral", minutes: 4 },
  { cat: "logic", minutes: 4 },
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
  wordMinutes: 18,
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
