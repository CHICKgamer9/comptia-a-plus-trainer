import { generatedLessons } from "../factory/generated-lessons";
import { starterLessons } from "../starters";
import type { Lesson } from "../types";
import { core1Lessons } from "./core1";
import { core2Lessons } from "./core2";
import { mathsLessons } from "./maths";
import { scienceLessons } from "./science";
import { historyLessons } from "./history";

export const lessons: Lesson[] = [
  ...starterLessons,
  ...core1Lessons,
  ...core2Lessons,
  ...mathsLessons,
  ...scienceLessons,
  ...historyLessons,
  ...generatedLessons,
];

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonByDomain(domainId: string) {
  return lessons.find((lesson) => lesson.domainId === domainId);
}
