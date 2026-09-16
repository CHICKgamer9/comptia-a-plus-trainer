import { generatedQuizzes } from "../factory/generated-quizzes";
import type { Quiz } from "../types";
import { core1Quizzes } from "./core1";
import { core2Quizzes } from "./core2";
import { mathsQuizzes } from "./maths";
import { scienceQuizzes } from "./science";
import { historyQuizzes } from "./history";

export const quizzes: Quiz[] = [
  ...core1Quizzes,
  ...core2Quizzes,
  ...mathsQuizzes,
  ...scienceQuizzes,
  ...historyQuizzes,
  ...generatedQuizzes,
];

export function getQuiz(id: string) {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuizByDomain(domainId: string) {
  return quizzes.find((quiz) => quiz.domainId === domainId);
}
