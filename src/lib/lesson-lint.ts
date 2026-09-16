import type { LearnBeat, Lesson, SpeakLine } from "@/content/types";
import type { LingoNode } from "@/content/lingo/types";
import { lingoItemType } from "@/content/lingo/types";
import { lessonToPath } from "@/lib/lesson-path";
import {
  countWords,
  isSilent,
  META_BODY_RE,
  PRAISE_RE,
  speakContainsChrome,
  speakTextOf,
  splitSentences,
  STAGE_DIR_RE,
} from "@/lib/tts/script";

export type LintIssue = { path: string; message: string };

const ORDER: Array<LearnBeat["type"]> = ["hook", "see", "try", "name", "contrast", "decide", "lock"];
const BANNED_COPY = META_BODY_RE;

function speakIssues(path: string, speak: SpeakLine | undefined, label = "speak"): LintIssue[] {
  const issues: LintIssue[] = [];
  if (speak == null) {
    issues.push({ path, message: `missing ${label}` });
    return issues;
  }
  if (isSilent(speak)) return issues;
  const text = speakTextOf(speak);
  if (!text) {
    issues.push({ path, message: `missing ${label}` });
    return issues;
  }
  if (speakContainsChrome(text)) issues.push({ path, message: `${label} reads chrome: ${text}` });
  if (PRAISE_RE.test(text)) issues.push({ path, message: `${label} contains praise` });
  if (STAGE_DIR_RE.test(text)) issues.push({ path, message: `${label} is a stage direction` });
  if (text.includes("/") && !/\bhttps?:/.test(text)) issues.push({ path, message: `${label} uses a slash; use a comma` });
  if (/[—–]/.test(text)) issues.push({ path, message: `${label} uses a dash; use a period` });
  const sentences = splitSentences(text);
  if (sentences.length > 2) issues.push({ path, message: `${label} has more than two sentences` });
  for (const sentence of sentences) {
    if (countWords(sentence) > 18) {
      issues.push({ path, message: `${label} sentence exceeds 18 words: ${sentence}` });
    }
  }
  return issues;
}

function iCanIssues(path: string, iCan: string | undefined): LintIssue[] {
  if (!iCan?.trim()) return [{ path, message: "missing iCan" }];
  const words = iCan.trim().split(/\s+/).length;
  if (words < 3 || words > 8) return [{ path, message: `iCan should be a short six-word completion (${words} words)` }];
  return [];
}

function clusterize(beats: LearnBeat[]) {
  const clusters: LearnBeat[][] = [];
  let current: LearnBeat[] = [];
  for (const beat of beats) {
    current.push(beat);
    if (beat.type === "lock") {
      clusters.push(current);
      current = [];
    }
  }
  if (current.length) clusters.push(current);
  return clusters;
}

export function lintLearnLesson(lesson: Lesson, path = lesson.domainId): LintIssue[] {
  const issues: LintIssue[] = [];
  const beats = lesson.beats;
  if (!beats?.length) {
    issues.push({ path, message: "missing authored beats" });
    const compiled = lessonToPath(lesson);
    for (const beat of compiled) {
      issues.push(...speakIssues(`${path}/${beat.id}`, beat.speak));
    }
    if (BANNED_COPY.test([lesson.intro, ...lesson.sections.flatMap((s) => s.paragraphs)].join(" "))) {
      issues.push({ path, message: "meta body regex matched" });
    }
    return issues;
  }

  if (!lesson.objective?.trim() && !beats.some((beat) => beat.objective)) {
    issues.push({ path, message: "missing objective" });
  }

  const bodyText = [
    lesson.intro,
    ...beats.flatMap((beat) => beat.body ?? []),
    ...lesson.sections.flatMap((section) => section.paragraphs),
  ].join(" ");
  if (BANNED_COPY.test(bodyText)) issues.push({ path, message: "meta body regex matched" });

  const taught = new Set<string>();
  let seenDecide = false;

  for (const [index, beat] of beats.entries()) {
    const beatPath = `${path}/${beat.id}`;
    issues.push(...speakIssues(beatPath, beat.speak));
    issues.push(...iCanIssues(beatPath, beat.iCan));
    if (!beat.objective?.trim() && !lesson.objective) issues.push({ path: beatPath, message: "missing objective" });

    const screen = (beat.body ?? []).join(" ");
    if (screen && speakTextOf(beat.speak) && speakTextOf(beat.speak) === screen) {
      issues.push({ path: beatPath, message: "speak equals body; write a spoken line" });
    }

    if (beat.type === "see") {
      const labels = beat.figure?.labels ?? [];
      if (!labels.length) issues.push({ path: beatPath, message: "empty diagram labels" });
    }

    if (beat.cardId && beat.type !== "decide") {
      issues.push({ path: beatPath, message: "cardId is only legal on decide" });
    }

    for (const term of beat.termsIntroduced ?? []) taught.add(term.toLowerCase());

    if (beat.type === "decide") {
      seenDecide = true;
      const prompt = beat.check?.prompt ?? "";
      const tokens = prompt.toLowerCase().split(/[^a-z0-9+-]+/).filter((token) => token.length > 3);
      const missing = tokens.filter((token) =>
        ["swollen", "soldered", "conduction", "isolate", "pack", "palm"].includes(token),
      ).filter((token) => ![...taught].some((term) => term.includes(token)));
      if (missing.length) {
        issues.push({ path: beatPath, message: `decide terms not introduced: ${missing.join(", ")}` });
      }
      const lock = beats.slice(index + 1).find((item) => item.type === "lock");
      if (!lock) issues.push({ path: beatPath, message: "lock missing after decide" });
      const hook = beat.cardHook ?? beat.lockLine;
      if (hook && lock?.lockLine && hook !== lock.lockLine) {
        issues.push({ path: beatPath, message: "card hook ≠ lockLine" });
      }
    }

    if (beat.type === "lock" && !beat.lockLine) {
      issues.push({ path: beatPath, message: "lock missing lockLine" });
    }
  }

  if (seenDecide && !beats.some((beat) => beat.type === "lock")) {
    issues.push({ path, message: "lock missing after decide" });
  }

  for (const cluster of clusterize(beats)) {
    const types = cluster.map((beat) => beat.type);
    let cursor = -1;
    for (const type of types) {
      const next = ORDER.indexOf(type);
      if (next < cursor) issues.push({ path, message: `cluster order broke at ${type}` });
      cursor = Math.max(cursor, next);
    }
    if (cluster.length < 4 || cluster.length > 12) {
      issues.push({ path, message: `cluster has ${cluster.length} beats; need 6–12 (or a short lock cluster ≥4)` });
    }
  }

  return issues;
}

export function lintLingoNode(node: LingoNode, path = node.id): LintIssue[] {
  const issues: LintIssue[] = [];
  const taught = new Set<string>();
  if (!node.steps.length) {
    issues.push({ path, message: "empty lingo node" });
    return issues;
  }
  const first = lingoItemType(node.steps[0]);
  if (first !== "introduce") issues.push({ path, message: "first≠introduce" });

  for (const step of node.steps) {
    const stepPath = `${path}/${step.id}`;
    const type = lingoItemType(step);
    if (step.new && type !== "introduce") issues.push({ path: stepPath, message: "new≠introduce" });
    if (type === "introduce" && !step.speakTarget && !step.native) {
      issues.push({ path: stepPath, message: "introduce missing speakTarget" });
    }
    if (type === "introduce" && !step.speakTarget) {
      issues.push({ path: stepPath, message: "introduce missing speakTarget" });
    }
    if (step.speak) issues.push(...speakIssues(stepPath, step.speak));
    if (type === "introduce") {
      const lemma = step.lemma ?? step.native;
      if (lemma) taught.add(lemma);
    } else if (step.lemma || step.native) {
      taught.add((step.lemma ?? step.native)!);
    }
    if (type === "match") {
      const untaught = (step.pairs ?? []).filter((pair) => !taught.has(pair.left) && !taught.has(pair.right));
      if (untaught.length) {
        issues.push({ path: stepPath, message: `untaught match: ${untaught.map((p) => p.left).join(", ")}` });
      }
    }
  }
  return issues;
}

export function lintGoldSuite(input: {
  techStart: Lesson;
  mobileDevices: Lesson;
  frU01L01: LingoNode;
  badTechStart: Lesson;
}): { issues: LintIssue[]; goldOk: boolean; badFailed: boolean } {
  const gold = [
    ...lintLearnLesson(input.techStart, "learn/tech/tech-start"),
    ...lintLearnLesson(input.mobileDevices, "learn/tech/mobile-devices"),
    ...lintLingoNode(input.frU01L01, "lingo/fr/fr-u01-l01"),
  ];
  const bad = lintLearnLesson(input.badTechStart, "fixture/bad-tech-start");
  return { issues: gold, goldOk: gold.length === 0, badFailed: bad.length > 0 };
}

export function autoReadWouldSpeakChrome(prompt: string) {
  return speakContainsChrome(prompt) || /options?|CONCEPT|FIELD TIP/i.test(prompt);
}
