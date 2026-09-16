"use client";

import { LessonPlayer } from "./LessonPlayer";
import type { Domain, Lesson, PathCheck } from "@/content/types";

export function LessonView({
  domain,
  lesson,
  checks = [],
}: {
  domain: Domain;
  lesson: Lesson;
  checks?: PathCheck[];
}) {
  return <LessonPlayer domain={domain} lesson={lesson} checks={checks} />;
}
