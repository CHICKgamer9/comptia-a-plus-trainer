import { domains } from "./domains";
import { lessons, getLesson, getLessonByDomain } from "./lessons";
import { quizzes, getQuiz, getQuizByDomain } from "./quizzes";
import { cheatsheets } from "./cheatsheets";
import type { Domain, DomainId, ExamId, ScenarioTheme } from "./types";

export {
  domains,
  lessons,
  quizzes,
  cheatsheets,
  getLesson,
  getLessonByDomain,
  getQuiz,
  getQuizByDomain,
};

export function getDomain(id: string) {
  return domains.find((domain) => domain.id === id);
}

export function getDomainsByExam(exam: ExamId) {
  return domains.filter((domain) => domain.exam === exam);
}

export function getCheatsheet(id: string) {
  return cheatsheets.find((sheet) => sheet.id === id);
}

export function examLabel(exam: ExamId) {
  return exam === "220-1101" ? "Core 1" : "Core 2";
}

export function domainTitle(domain: Domain) {
  return `${examLabel(domain.exam)} · ${domain.number}. ${domain.title}`;
}

export function labThemeForDomain(domainId: DomainId): ScenarioTheme {
  const map: Record<DomainId, ScenarioTheme> = {
    "mobile-devices": "mobile",
    networking: "network",
    hardware: "hardware",
    "virtualization-cloud": "os",
    "hw-net-troubleshooting": "hardware",
    "operating-systems": "os",
    security: "security",
    "software-troubleshooting": "os",
    "operational-procedures": "security",
  };
  return map[domainId];
}

export const CONTENT_COUNTS = {
  domains: domains.length,
  lessons: lessons.length,
  quizzes: quizzes.length,
  questions: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0),
  cheatsheets: cheatsheets.length,
} as const;
