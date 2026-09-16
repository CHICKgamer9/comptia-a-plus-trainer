import { domains } from "@/content/registry";
import { projects } from "@/content/projects";
import type { ExamId, SubjectId } from "@/content/types";
import { isCore1, isCore2 } from "@/lib/exam";

function examCoreMatches(domainExam: ExamId | undefined, exam: ExamId) {
  if (!domainExam) return false;
  if (isCore1(exam)) return isCore1(domainExam);
  if (isCore2(exam)) return isCore2(domainExam);
  return domainExam === exam;
}

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
    blurb: "Studied three calendar days in a row.",
  },
  {
    id: "streak-10",
    title: "Ten-day streak",
    blurb: "Ten consecutive days with study.",
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
  {
    id: "first-brain",
    title: "Brain gym open",
    blurb: "Finished your first Brain Gym challenge.",
  },
  {
    id: "brain-day",
    title: "Two-hour desk",
    blurb: "Completed a 120-minute daily playlist.",
  },
  {
    id: "brain-week",
    title: "Week of gym",
    blurb: "Seven completed Brain Gym days on this device.",
  },
  {
    id: "crossword-five",
    title: "Five minis",
    blurb: "Solved five interactive mini crosswords.",
  },
  {
    id: "words-fifty",
    title: "Word worker",
    blurb: "Attempted fifty word or crossword challenges.",
  },
  {
    id: "first-project",
    title: "Hands on",
    blurb: "Finished your first hands-on project.",
  },
  {
    id: "three-projects",
    title: "Three builds",
    blurb: "Marked three projects complete on this device.",
  },
  {
    id: "five-projects",
    title: "Workshop",
    blurb: "Finished five projects across the shelf.",
  },
  {
    id: "four-hub-projects",
    title: "Four benches",
    blurb: "Completed a project in four different subject hubs.",
  },
];

export interface BadgeInput {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number }>;
  scenarioScores: Record<string, { score: number; total: number }>;
  streakCount: number;
  xp: number;
  brainAnswered?: number;
  brainDays?: number;
  brainCrosswords?: number;
  completedProjects?: string[];
}

export function unlockedBadgeIds(input: BadgeInput): string[] {
  const ids: string[] = [];
  const tech = domains.filter((domain) => domain.subject === "tech");
  const core1 = tech.filter((domain) => isCore1(domain.exam));
  const core2 = tech.filter((domain) => isCore2(domain.exam));
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
      .filter((domain) => (examCoreMatches(domain.exam, exam)))
      .every((domain) => input.completedLessons.includes(domain.lessonId));
  const quizPct = (quizId: string) => {
    const row = input.quizScores[quizId];
    return row && row.total > 0 ? row.score / row.total : 0;
  };
  const allQuizzesAt = (exam: ExamId, min: number) =>
    tech
      .filter((domain) => examCoreMatches(domain.exam, exam))
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
  if (lessonDone("220-1201") || lessonDone("220-1101")) ids.push("core1-lessons");
  if (lessonDone("220-1202") || lessonDone("220-1102")) ids.push("core2-lessons");
  if (core1.every((d) => input.completedLessons.includes(d.lessonId)) &&
    core2.every((d) => input.completedLessons.includes(d.lessonId))) {
    ids.push("all-lessons");
  }
  if (domains.some((domain) => quizPct(domain.quizId) >= 0.8)) ids.push("quiz-80");
  if (allQuizzesAt("220-1201", 0.8) || allQuizzesAt("220-1101", 0.8)) ids.push("quiz-80-core1");
  if (allQuizzesAt("220-1202", 0.8) || allQuizzesAt("220-1102", 0.8)) ids.push("quiz-80-core2");
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
  if ((input.brainAnswered ?? 0) >= 1) ids.push("first-brain");
  if ((input.brainDays ?? 0) >= 1) ids.push("brain-day");
  if ((input.brainDays ?? 0) >= 7) ids.push("brain-week");
  if ((input.brainCrosswords ?? 0) >= 5) ids.push("crossword-five");
  if ((input.brainAnswered ?? 0) >= 50) ids.push("words-fifty");
  const doneProjects = input.completedProjects ?? [];
  if (doneProjects.length >= 1) ids.push("first-project");
  if (doneProjects.length >= 3) ids.push("three-projects");
  if (doneProjects.length >= 5) ids.push("five-projects");
  const hubs = new Set(
    doneProjects
      .map((id) => projects.find((project) => project.id === id)?.subject)
      .filter((subject): subject is SubjectId => Boolean(subject)),
  );
  if (hubs.size >= 4) ids.push("four-hub-projects");
  return ids;
}

export function getBadge(id: string) {
  return BADGES.find((badge) => badge.id === id);
}
