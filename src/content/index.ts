import { techDomains } from "./domains";
import { schoolDomains } from "./domains-school";
import { lessons, getLesson, getLessonByDomain } from "./lessons";
import { quizzes, getQuiz, getQuizByDomain } from "./quizzes";
import { cheatsheets } from "./cheatsheets";
import { SUBJECTS, getSubject, isSubjectId } from "./subjects";
import { challenges, getChallenge, getChallengesBySubject } from "./challenges";
import type { Domain, DomainId, ExamId, ScenarioTheme, SubjectId } from "./types";

export const domains: Domain[] = [...techDomains, ...schoolDomains];

export {
  techDomains,
  schoolDomains,
  lessons,
  quizzes,
  cheatsheets,
  challenges,
  SUBJECTS,
  getLesson,
  getLessonByDomain,
  getQuiz,
  getQuizByDomain,
  getChallenge,
  getChallengesBySubject,
  getSubject,
  isSubjectId,
};

export function getDomain(id: string) {
  return domains.find((domain) => domain.id === id);
}

export function getDomainsByExam(exam: ExamId) {
  return domains.filter((domain) => domain.exam === exam);
}

export function getDomainsBySubject(subject: SubjectId) {
  return domains.filter((domain) => domain.subject === subject);
}

export function getCheatsheet(id: string) {
  return cheatsheets.find((sheet) => sheet.id === id);
}

export function examLabel(exam: ExamId) {
  return exam === "220-1101" ? "Core 1" : "Core 2";
}

export function domainTitle(domain: Domain) {
  if (domain.exam) return `${examLabel(domain.exam)} · ${domain.number}. ${domain.title}`;
  const subject = getSubject(domain.subject);
  return `${subject?.title ?? domain.subject} · ${domain.number}. ${domain.title}`;
}

export function pathHref(domain: Pick<Domain, "subject" | "id">) {
  return `/learn/${domain.subject}/${domain.id}`;
}

export function quizHref(quizId: string) {
  return `/practice/${quizId}`;
}

export function challengeHref(id: string) {
  return `/play/${id}`;
}

export function labThemeForDomain(domainId: DomainId): ScenarioTheme | undefined {
  const map: Record<string, ScenarioTheme> = {
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
  challenges: challenges.length,
} as const;
