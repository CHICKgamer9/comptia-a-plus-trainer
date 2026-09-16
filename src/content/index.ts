import { domains } from "./domains";
import { lessons, getLesson, getLessonByDomain } from "./lessons";
import { quizzes, getQuiz, getQuizByDomain } from "./quizzes";
import { scenarios, getScenario, getRandomScenarioId } from "./scenarios";
import { cheatsheets } from "./cheatsheets";
import type { Domain, DomainId, ExamId } from "./types";

export {
  domains,
  lessons,
  quizzes,
  scenarios,
  cheatsheets,
  getLesson,
  getLessonByDomain,
  getQuiz,
  getQuizByDomain,
  getScenario,
  getRandomScenarioId,
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

export function scenariosForDomain(domainId: DomainId) {
  return scenarios.filter((scenario) => scenario.domainIds.includes(domainId));
}

export function examLabel(exam: ExamId) {
  return exam === "220-1101" ? "Core 1" : "Core 2";
}

export function domainTitle(domain: Domain) {
  return `${examLabel(domain.exam)} · ${domain.number}. ${domain.title}`;
}

export const CONTENT_COUNTS = {
  domains: domains.length,
  lessons: lessons.length,
  quizzes: quizzes.length,
  questions: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0),
  scenarios: scenarios.length,
  cheatsheets: cheatsheets.length,
} as const;
