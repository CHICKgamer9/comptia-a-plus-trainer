"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { domains, pathHref, quizzes } from "@/content";
import { useProgress } from "./ProgressProvider";
import { nextDomainPreferring } from "./CoursePath";

export function useContinueHref() {
  const { progress } = useProgress();
  const upcoming = nextDomainPreferring(progress.completedLessons, progress.lastSubject);
  if (upcoming) return pathHref(upcoming);

  const nextQuiz = quizzes.find((quiz) => !progress.quizScores[quiz.id]);
  if (nextQuiz) return `/practice/${nextQuiz.id}`;

  if (progress.lastLessonId) {
    const domain = domains.find((item) => item.lessonId === progress.lastLessonId);
    if (domain) return pathHref(domain);
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
  return (
    <button type="button" className={className} onClick={() => router.push("/lab")}>
      {children}
    </button>
  );
}
