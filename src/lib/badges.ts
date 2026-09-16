import { domains } from "@/content/registry";
import type { ExamId, SubjectId } from "@/content/types";

export interface BadgeDef {
  id: string;
  title: string;
  blurb: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-lesson",
    title: "First read",
    blurb: "Marked a domain lesson complete.",
  },
  {
    id: "first-quiz",
    title: "First quiz",
    blurb: "Finished a domain quiz.",
  },
  {
    id: "first-ticket",
    title: "Queue is open",
    blurb: "Closed your first helpdesk ticket.",
  },
  {
    id: "ticket-clean",
    title: "Closed clean",
    blurb: "Every step correct on a ticket.",
  },
  {
    id: "three-clean",
    title: "Three clean closes",
    blurb: "Three tickets closed with a perfect score.",
  },
  {
    id: "five-tickets",
    title: "Busy queue",
    blurb: "Closed five tickets.",
  },
  {
    id: "core1-lessons",
    title: "Core 1 reader",
    blurb: "Finished every Core 1 lesson.",
  },
  {
    id: "core2-lessons",
    title: "Core 2 reader",
    blurb: "Finished every Core 2 lesson.",
  },
  {
    id: "all-lessons",
    title: "Both cores read",
    blurb: "Every domain lesson marked complete.",
  },
  {
    id: "quiz-80",
    title: "Domain 80%",
    blurb: "Scored 80% or better on a domain quiz.",
  },
  {
    id: "quiz-80-core1",
    title: "Core 1 quiz bar",
    blurb: "80%+ on every Core 1 quiz.",
  },
  {
    id: "quiz-80-core2",
    title: "Core 2 quiz bar",
    blurb: "80%+ on every Core 2 quiz.",
  },
  {
    id: "streak-3",
    title: "Three-day streak",
    blurb: "Studied three calendar days in a row (Sydney time).",
  },
  {
    id: "streak-10",
    title: "Ten-day streak",
    blurb: "Ten consecutive Sydney days with study.",
  },
  {
    id: "field-tech",
    title: "Pathfinder",
    blurb: "Reached the Pathfinder level.",
  },
  {
    id: "contender",
    title: "Contender",
    blurb: "Reached the Contender level.",
  },
  {
    id: "maths-paths",
    title: "Maths paths",
    blurb: "Finished every Maths lesson path.",
  },
  {
    id: "science-paths",
    title: "Science paths",
    blurb: "Finished every Science lesson path.",
  },
  {
    id: "history-paths",
    title: "History paths",
    blurb: "Finished every History lesson path.",
  },
  {
    id: "four-subjects",
    title: "Four desks",
    blurb: "Touched Tech, Maths, Science, and History.",
  },
];

export interface BadgeInput {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number }>;
  scenarioScores: Record<string, { score: number; total: number }>;
  streakCount: number;
  xp: number;
}

export function unlockedBadgeIds(input: BadgeInput): string[] {
  const ids: string[] = [];
  const tech = domains.filter((domain) => domain.subject === "tech");
  const core1 = tech.filter((domain) => domain.exam === "220-1101");
  const core2 = tech.filter((domain) => domain.exam === "220-1102");
  const subjectDone = (subject: SubjectId) =>
    domains
      .filter((domain) => domain.subject === subject)
      .every((domain) => input.completedLessons.includes(domain.lessonId));
  const subjectTouched = (subject: SubjectId) =>
    domains.some(
      (domain) =>
        domain.subject === subject && input.completedLessons.includes(domain.lessonId),
    );
  const lessonDone = (exam: ExamId) =>
    tech
      .filter((domain) => domain.exam === exam)
      .every((domain) => input.completedLessons.includes(domain.lessonId));
  const quizPct = (quizId: string) => {
    const row = input.quizScores[quizId];
    return row && row.total > 0 ? row.score / row.total : 0;
  };
  const allQuizzesAt = (exam: ExamId, min: number) =>
    tech
      .filter((domain) => domain.exam === exam)
      .every((domain) => quizPct(domain.quizId) >= min);

  if (input.completedLessons.length >= 1) ids.push("first-lesson");
  if (Object.keys(input.quizScores).length >= 1) ids.push("first-quiz");
  const tickets = Object.values(input.scenarioScores);
  if (tickets.length >= 1) ids.push("first-ticket");
  if (tickets.some((row) => row.total > 0 && row.score === row.total)) {
    ids.push("ticket-clean");
  }
  const cleanCount = tickets.filter(
    (row) => row.total > 0 && row.score === row.total,
  ).length;
  if (cleanCount >= 3) ids.push("three-clean");
  if (tickets.length >= 5) ids.push("five-tickets");
  if (lessonDone("220-1101")) ids.push("core1-lessons");
  if (lessonDone("220-1102")) ids.push("core2-lessons");
  if (core1.every((d) => input.completedLessons.includes(d.lessonId)) &&
    core2.every((d) => input.completedLessons.includes(d.lessonId))) {
    ids.push("all-lessons");
  }
  if (domains.some((domain) => quizPct(domain.quizId) >= 0.8)) ids.push("quiz-80");
  if (allQuizzesAt("220-1101", 0.8)) ids.push("quiz-80-core1");
  if (allQuizzesAt("220-1102", 0.8)) ids.push("quiz-80-core2");
  if (input.streakCount >= 3) ids.push("streak-3");
  if (input.streakCount >= 10) ids.push("streak-10");
  if (input.xp >= 320) ids.push("field-tech");
  if (input.xp >= 1500) ids.push("contender");
  if (subjectDone("maths")) ids.push("maths-paths");
  if (subjectDone("science")) ids.push("science-paths");
  if (subjectDone("history")) ids.push("history-paths");
  if (
    subjectTouched("tech") &&
    subjectTouched("maths") &&
    subjectTouched("science") &&
    subjectTouched("history")
  ) {
    ids.push("four-subjects");
  }
  return ids;
}

export function getBadge(id: string) {
  return BADGES.find((badge) => badge.id === id);
}
