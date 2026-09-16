import type { Lesson } from "../types";
import { core1Lessons } from "./core1";
import { core2Lessons } from "./core2";

export const lessons: Lesson[] = [...core1Lessons, ...core2Lessons];

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonByDomain(domainId: string) {
  return lessons.find((lesson) => lesson.domainId === domainId);
}
