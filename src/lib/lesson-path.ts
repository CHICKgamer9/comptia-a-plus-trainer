import type { DiagramId, Lesson, PathBeat, PathCheck, SubjectId } from "@/content/types";

const DIAGRAM: Record<string, DiagramId> = {
  "mobile-devices": "laptop",
  networking: "layers",
  hardware: "connectors",
  "virtualization-cloud": "cloud",
  "hw-net-troubleshooting": "loop",
  "operating-systems": "window",
  security: "lock",
  "software-troubleshooting": "boot",
  "operational-procedures": "clipboard",
  "number-sense": "balance",
  fractions: "balance",
  percentages: "prism",
  "algebra-foundations": "balance",
  "geometry-measure": "prism",
  "atoms-matter": "atom",
  "forces-motion": "loop",
  "energy-systems": "prism",
  "cells-life": "leaf",
  "ecosystems-au": "leaf",
  "historical-thinking": "scroll",
  "ancient-worlds": "scroll",
  "country-contact": "leaf",
  "making-australia": "scroll",
  "twentieth-century": "scroll",
};

function firstSentences(text: string, count = 1): { hook: string; rest: string } {
  const parts = text.match(/[^.!?]+[.!?]+(?:["”])?/g);
  if (!parts || parts.length <= count) {
    return { hook: text.trim(), rest: "" };
  }
  return {
    hook: parts.slice(0, count).join(" ").replace(/\s+/g, " ").trim(),
    rest: parts.slice(count).join(" ").replace(/\s+/g, " ").trim(),
  };
}

function numberedBullets(bullets?: string[]) {
  if (!bullets?.length) return false;
  return bullets.every((item) => /^\d+\.\s/.test(item));
}

function tableToCheck(lessonId: string, heading: string, table: Lesson["sections"][0]["table"]): PathCheck | null {
  if (!table || table.rows.length < 3) return null;
  const header = table.headers[0]?.toLowerCase() ?? "";
  if (header.includes("port")) return null;
  if (table.headers.length >= 2) {
    const pairs = table.rows.slice(0, 4).map((row) => ({
      left: row[0],
      right: row[1],
    }));
    if (pairs.some((pair) => pair.left.length > 42 || pair.right.length > 72)) {
      return null;
    }
    return {
      id: `${lessonId}-table-${heading.slice(0, 18).replace(/\W+/g, "-")}`,
      type: "match",
      prompt: `Match each ${table.headers[0].toLowerCase()} to the right idea.`,
      pairs,
      why: `These pairings are worth keeping in your pocket. Scan them once, then keep moving.`,
    };
  }
  return null;
}

const FALLBACK_DIAGRAMS: DiagramId[] = [
  "prism",
  "atom",
  "leaf",
  "scroll",
  "balance",
  "loop",
];

function diagramFor(domainId: string): DiagramId {
  if (DIAGRAM[domainId]) return DIAGRAM[domainId];
  let h = 0;
  for (let i = 0; i < domainId.length; i += 1) h = (h * 31 + domainId.charCodeAt(i)) | 0;
  return FALLBACK_DIAGRAMS[Math.abs(h) % FALLBACK_DIAGRAMS.length];
}

export function lessonToPath(
  lesson: Lesson,
  checks: PathCheck[] = [],
  subject?: SubjectId,
): PathBeat[] {
  const beats: PathBeat[] = [];
  const intro = firstSentences(lesson.intro, 2);
  const diagram = diagramFor(lesson.domainId);
  const usedAuthored = new Set<string>();

  beats.push({
    id: `${lesson.id}-open`,
    kind: "hook",
    title: lesson.title,
    body: [intro.hook],
    diagram,
  });

  if (intro.rest) {
    beats.push({
      id: `${lesson.id}-open-more`,
      kind: "explain",
      title: "What this path is for",
      body: [intro.rest],
    });
  }

  lesson.sections.forEach((section, sectionIndex) => {
    const [first, ...more] = section.paragraphs;
    const split = firstSentences(first ?? "", 1);
    beats.push({
      id: `${lesson.id}-s${sectionIndex}-hook`,
      kind: "hook",
      title: section.heading,
      body: [split.hook || first],
      diagram: sectionIndex === 0 ? undefined : undefined,
    });

    const authored = checks.filter(
      (check) => check.afterHeading === section.heading && !usedAuthored.has(check.id),
    );
    authored.forEach((check) => {
      usedAuthored.add(check.id);
      beats.push({
        id: `${lesson.id}-check-${check.id}`,
        kind: "check",
        title: "Try this",
        check,
      });
    });

    const asOrder = numberedBullets(section.bullets);
    if (asOrder && section.bullets && !authored.some((check) => check.type === "order")) {
      const items = section.bullets.map((bullet, index) => ({
        id: `b${index}`,
        label: bullet.replace(/^\d+\.\s*/, ""),
      }));
      beats.push({
        id: `${lesson.id}-s${sectionIndex}-order`,
        kind: "check",
        title: "Try this",
        check: {
          id: `${lesson.id}-order-${sectionIndex}`,
          type: "order",
          prompt: "Put these in a careful order.",
          items,
          correctOrder: items.map((item) => item.id),
          why: "Order is the skill. Skipping a step is how the whole thing unravels.",
        },
      });
    }

    const tableCheck = tableToCheck(lesson.id, section.heading, section.table);
    const alreadyMatched = authored.some((check) => check.type === "match");
    if (tableCheck && !alreadyMatched && !asOrder) {
      beats.push({
        id: `${lesson.id}-s${sectionIndex}-table`,
        kind: "check",
        title: "Try this",
        check: tableCheck,
      });
    }

    const explainBody = [split.rest, ...more].filter(Boolean);
    const leftoverBullets = asOrder ? undefined : section.bullets;
    if (explainBody.length || leftoverBullets?.length || section.table) {
      beats.push({
        id: `${lesson.id}-s${sectionIndex}-explain`,
        kind: "explain",
        title: section.heading,
        body: explainBody.length ? explainBody : undefined,
        bullets: leftoverBullets,
        table: section.table,
      });
    }

    if (section.callout) {
      const examish = section.callout.type === "exam";
      beats.push({
        id: `${lesson.id}-s${sectionIndex}-tip`,
        kind: "tip",
        title: examish
          ? subject === "tech"
            ? "Exam cue"
            : "Test cue"
          : section.callout.type === "watch"
            ? "Watch out"
            : "Field tip",
        callout: section.callout,
        body: [section.callout.text],
      });
    }
  });

  checks
    .filter((check) => !usedAuthored.has(check.id) && !check.afterHeading)
    .forEach((check) => {
      beats.push({
        id: `${lesson.id}-check-${check.id}`,
        kind: "check",
        title: "Try this",
        check,
      });
    });

  beats.push({
    id: `${lesson.id}-recap`,
    kind: "recap",
    title: "You can close this path",
    bullets: lesson.keyTakeaways,
    body: [
      subject === "tech"
        ? "Keep these in your pocket. The quiz and a live ticket will ask them again, not as an essay."
        : "Keep these in your pocket. The quiz — and a challenge, if there is one — will ask them again.",
    ],
  });

  return beats;
}

export function pathLength(lesson: Lesson, checks: PathCheck[] = [], subject?: SubjectId) {
  return lessonToPath(lesson, checks, subject).length;
}
