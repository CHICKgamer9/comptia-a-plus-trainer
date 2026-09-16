import { generatedQuizzes } from "../factory/generated-quizzes";
import { starterQuizzes } from "../starters";
import type { Quiz } from "../types";
import { mathsQuizzes } from "./maths";
import { scienceQuizzes } from "./science";
import { historyQuizzes } from "./history";
import { techExpandedQuizzes } from "./tech-bank";

export const quizzes: Quiz[] = [
  ...starterQuizzes,
  ...techExpandedQuizzes,
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
