import type { Quiz } from "../types";
import { core1Quizzes } from "./core1";
import { core2Quizzes } from "./core2";

export const quizzes: Quiz[] = [...core1Quizzes, ...core2Quizzes];

export function getQuiz(id: string) {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuizByDomain(domainId: string) {
  return quizzes.find((quiz) => quiz.domainId === domainId);
}
