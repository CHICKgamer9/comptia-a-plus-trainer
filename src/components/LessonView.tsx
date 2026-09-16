"use client";

import { LessonPlayer } from "./LessonPlayer";
import type { Domain, Lesson } from "@/content/types";

export function LessonView({
  domain,
  lesson,
}: {
  domain: Domain;
  lesson: Lesson;
}) {
  return <LessonPlayer domain={domain} lesson={lesson} />;
}
