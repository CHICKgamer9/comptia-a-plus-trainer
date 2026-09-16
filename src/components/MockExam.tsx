"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ExamId, Quiz, QuizQuestion } from "@/content/types";
import { techExpandedQuizzes } from "@/content/quizzes/tech-bank";
import { techDomains } from "@/content/domains";
import { weightsForTrack } from "@/content/objectives";
import { examCore, trackForExam } from "@/lib/exam";
import { pathHref } from "@/content/registry";
import { QuizRunner } from "./QuizRunner";
import { useProgress } from "./ProgressProvider";
import { nextDomain } from "./CoursePath";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function buildMockQuiz(exam: ExamId): Quiz {
  const core = examCore(exam);
  const domainIds = techDomains
    .filter((domain) => domain.exam && examCore(domain.exam) === core)
    .map((domain) => domain.id);
  const questions: QuizQuestion[] = [];
  for (const quiz of techExpandedQuizzes) {
    if (!domainIds.includes(quiz.domainId)) continue;
    questions.push(...quiz.questions);
  }
  return {
    id: `mock-${exam}`,
    domainId: domainIds[0] ?? "hardware",
    title: `Timed mock · ${exam}`,
    questions: shuffle(questions).slice(0, 40),
  };
}

export function MockExam({ exam }: { exam: ExamId }) {
  const quiz = useMemo(() => buildMockQuiz(exam), [exam]);
  const { progress } = useProgress();
  const track = progress.examTrack === "v14" ? "v14" : trackForExam(exam);
  const weights = weightsForTrack(track).filter((row) => examCore(row.exam) === examCore(exam));
  const upcoming = [];
  let completed = [...progress.completedLessons];
  for (let i = 0; i < 5; i += 1) {
    const next = techDomains.find(
      (domain) => domain.exam && !completed.includes(domain.lessonId),
    ) ?? nextDomain(completed, "tech");
    if (!next) break;
    upcoming.push(next);
    completed = [...completed, next.lessonId];
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        No instant explain. 20 minutes · 40 items. Official domain weights:{" "}
        {weights.map((row) => `${row.title} ${row.percent}%`).join(" · ")}.
      </p>
      <QuizRunner
        quiz={quiz}
        preset="timed"
        domainWeights={weights}
        afterDone={
          <div className="mt-5 rounded-3xl border border-border bg-surface p-5">
            <p className="text-[11px] uppercase tracking-wider text-muted">Next five Tech paths</p>
            <ul className="mt-3 space-y-2 text-sm">
              {upcoming.map((domain) => (
                <li key={domain.id}>
                  <Link href={pathHref(domain)} className="text-accent hover:underline">
                    {domain.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
}
