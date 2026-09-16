import { existsSync, unlinkSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expandSeed, assertSeeds } from "./lib/expand.mjs";
import { TECH_SEEDS } from "./topics/tech.mjs";
import { MATHS_SEEDS } from "./topics/maths.mjs";
import { SCIENCE_SEEDS } from "./topics/science.mjs";
import { HISTORY_SEEDS } from "./topics/history.mjs";
import { ENGLISH_SEEDS } from "./topics/english.mjs";
import { GEOGRAPHY_SEEDS } from "./topics/geography.mjs";
import { CODING_SEEDS } from "./topics/coding.mjs";
import { BUSINESS_SEEDS } from "./topics/business.mjs";
import { HEALTH_SEEDS } from "./topics/health.mjs";
import { MUSIC_SEEDS } from "./topics/music.mjs";
import { ART_SEEDS } from "./topics/art.mjs";
import { CIVICS_SEEDS } from "./topics/civics.mjs";
import { LANGUAGES_SEEDS } from "./topics/languages.mjs";
import { LOGIC_SEEDS } from "./topics/logic.mjs";
import { DIGITAL_SEEDS } from "./topics/digital.mjs";
import { VOLUME_SEEDS } from "./topics/extra/index.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const MIN_PATHS = 60;
const VOLUME_FLOOR = 1400;
const SUBJECTS = [
  "tech",
  "maths",
  "science",
  "history",
  "english",
  "geography",
  "coding",
  "business",
  "health",
  "music",
  "art",
  "civics",
  "languages",
  "logic",
  "digital",
];

const RESERVED = new Set([
  "mobile-devices",
  "networking",
  "hardware",
  "virtualization-cloud",
  "hw-net-troubleshooting",
  "operating-systems",
  "security",
  "software-troubleshooting",
  "operational-procedures",
  "number-sense",
  "fractions",
  "percentages",
  "algebra-foundations",
  "geometry-measure",
  "atoms-matter",
  "forces-motion",
  "energy-systems",
  "cells-life",
  "ecosystems-au",
  "historical-thinking",
  "ancient-worlds",
  "country-contact",
  "making-australia",
  "twentieth-century",
]);

const EXISTING_COUNTS = {
  tech: 9,
  maths: 5,
  science: 5,
  history: 5,
};

const ALL = [
  ...TECH_SEEDS,
  ...MATHS_SEEDS,
  ...SCIENCE_SEEDS,
  ...HISTORY_SEEDS,
  ...ENGLISH_SEEDS,
  ...GEOGRAPHY_SEEDS,
  ...CODING_SEEDS,
  ...BUSINESS_SEEDS,
  ...HEALTH_SEEDS,
  ...MUSIC_SEEDS,
  ...ART_SEEDS,
  ...CIVICS_SEEDS,
  ...LANGUAGES_SEEDS,
  ...LOGIC_SEEDS,
  ...DIGITAL_SEEDS,
  ...VOLUME_SEEDS,
];

assertSeeds(ALL, RESERVED);

const nextNumber = {};
const domains = [];
const lessons = [];
const quizzes = [];
const checks = {};

for (const seed of ALL) {
  const start = EXISTING_COUNTS[seed.subject] ?? 0;
  nextNumber[seed.subject] = (nextNumber[seed.subject] ?? start) + 1;
  const compiled = expandSeed(seed, nextNumber[seed.subject]);
  domains.push(compiled.domain);
  lessons.push(compiled.lesson);
  quizzes.push(compiled.quiz);
  checks[seed.id] = compiled.checks;
}

const seedCounts = {};
for (const domain of domains) {
  seedCounts[domain.subject] = (seedCounts[domain.subject] ?? 0) + 1;
}

const totals = {};
const under = [];
for (const subject of SUBJECTS) {
  const total = (EXISTING_COUNTS[subject] ?? 0) + (seedCounts[subject] ?? 0);
  totals[subject] = total;
  if (total < MIN_PATHS) under.push(`${subject}=${total}`);
}
if (under.length) {
  throw new Error(`Subjects under ${MIN_PATHS} paths: ${under.join(", ")}`);
}
if (VOLUME_SEEDS.length < VOLUME_FLOOR) {
  throw new Error(`Volume seeds ${VOLUME_SEEDS.length} under floor ${VOLUME_FLOOR}`);
}

const generatedAt = new Date().toISOString();
const outDir = join(root, "../src/content/factory");
mkdirSync(outDir, { recursive: true });

function writeJson(name, data) {
  const outPath = join(outDir, name);
  writeFileSync(outPath, JSON.stringify(data));
  console.log("Wrote", name, `${(JSON.stringify(data).length / 1024).toFixed(0)} KB`);
}

writeJson("catalog-domains.json", { generatedAt, seedCounts, totals, minPaths: MIN_PATHS, domains });
writeJson("catalog-lessons.json", { lessons });
writeJson("catalog-quizzes.json", { quizzes });
writeJson("catalog-checks.json", { checks });

const stale = join(outDir, "catalog.json");
if (existsSync(stale)) {
  unlinkSync(stale);
  console.log("Removed stale catalog.json");
}

console.log("Factory seeds:", domains.length);
console.log("Volume extras:", VOLUME_SEEDS.length);
console.log("Path totals (existing + generated):");
for (const subject of SUBJECTS) {
  console.log(`  ${subject.padEnd(12)} ${String(totals[subject]).padStart(3)}`);
}
const grand = Object.values(totals).reduce((sum, n) => sum + n, 0);
console.log("Grand total paths:", grand);
