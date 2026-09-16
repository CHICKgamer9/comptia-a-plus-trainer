"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { domains, quizzes } from "@/content";
import { useProgress } from "./ProgressProvider";
import { nextDomain } from "./CoursePath";

export function useContinueHref() {
  const { progress } = useProgress();
  const upcoming = nextDomain(progress.completedLessons);
  if (upcoming) return `/learn/${upcoming.id}`;

  const nextQuiz = quizzes.find((quiz) => !progress.quizScores[quiz.id]);
  if (nextQuiz) return `/practice/${nextQuiz.id}`;

  if (progress.lastLessonId) {
    const domain = domains.find((item) => item.lessonId === progress.lastLessonId);
    if (domain) return `/learn/${domain.id}`;
  }
  return "/lab";
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
  return (
    <button type="button" className={className} onClick={() => router.push("/lab")}>
      {children}
    </button>
  );
}
