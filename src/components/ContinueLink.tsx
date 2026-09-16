"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { domains, quizzes, scenarios } from "@/content";
import { useProgress } from "./ProgressProvider";

export function useContinueHref() {
  const { progress } = useProgress();

  const nextLesson = domains.find(
    (domain) => !progress.completedLessons.includes(domain.lessonId),
  );
  if (nextLesson) return `/learn/${nextLesson.id}`;

  const nextQuiz = quizzes.find((quiz) => !progress.quizScores[quiz.id]);
  if (nextQuiz) return `/practice/${nextQuiz.id}`;

  const nextScenario = scenarios.find(
    (scenario) => !progress.scenarioScores[scenario.id],
  );
  if (nextScenario) return `/lab/${nextScenario.id}`;

  if (progress.lastLessonId) {
    const domain = domains.find((item) => item.lessonId === progress.lastLessonId);
    if (domain) return `/learn/${domain.id}`;
  }
  return "/learn";
}

export function ContinueLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const href = useContinueHref();
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function RandomTicketLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { progress } = useProgress();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const unfinished = scenarios.filter(
          (scenario) => !progress.scenarioScores[scenario.id],
        );
        const pool = unfinished.length ? unfinished : scenarios;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        router.push(pick ? `/lab/${pick.id}` : "/lab");
      }}
    >
      {children}
    </button>
  );
}
