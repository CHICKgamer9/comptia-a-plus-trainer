import { cheatsheets, getCheatsheet } from "./cheatsheets";
import { challenges, getChallenge, getChallengesBySubject } from "./challenges";
import { lessons, getLesson, getLessonByDomain } from "./lessons";
import { quizzes, getQuiz, getQuizByDomain } from "./quizzes";
import {
  CONTENT_COUNTS as registryCounts,
  domains,
  generatedDomains,
  schoolDomains,
  SUBJECTS,
  SUBJECT_GROUPS,
  techDomains,
  challengeHref,
  domainCluster,
  domainTitle,
  examLabel,
  getClustersForSubject,
  getDomain,
  getDomainsByExam,
  getDomainsBySubject,
  getSubject,
  getSubjectGroup,
  isSubjectId,
  labThemeForDomain,
  pathCountsBySubject,
  pathHref,
  quizHref,
} from "./registry";

export {
  techDomains,
  schoolDomains,
  generatedDomains,
  domains,
  lessons,
  quizzes,
  cheatsheets,
  challenges,
  SUBJECTS,
  SUBJECT_GROUPS,
  getLesson,
  getLessonByDomain,
  getQuiz,
  getQuizByDomain,
  getChallenge,
  getChallengesBySubject,
  getSubject,
  getSubjectGroup,
  isSubjectId,
  getDomain,
  getDomainsByExam,
  getDomainsBySubject,
  getClustersForSubject,
  pathCountsBySubject,
  domainCluster,
  examLabel,
  domainTitle,
  pathHref,
  quizHref,
  challengeHref,
  labThemeForDomain,
};

export { getCheatsheet };

export const CONTENT_COUNTS = {
  ...registryCounts,
  lessons: lessons.length,
  quizzes: quizzes.length,
  questions: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0),
  cheatsheets: cheatsheets.length,
  challenges: challenges.length,
} as const;
