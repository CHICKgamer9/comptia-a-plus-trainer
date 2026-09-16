import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, getQuiz, quizzes } from "@/content";
import { QuizRunner } from "@/components/QuizRunner";
import { ExamBadge } from "@/components/ui";

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ quizId: quiz.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ quizId: string }>;
}): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = getQuiz(quizId);
  return { title: quiz ? quiz.title : "Quiz" };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = getQuiz(quizId);
  if (!quiz) notFound();
  const domain = getDomain(quiz.domainId);

  return (
    <div>
      <Link href="/practice" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
        ← All quizzes
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {domain ? <ExamBadge exam={domain.exam} /> : null}
      </div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{quiz.title}</h1>
      <QuizRunner quiz={quiz} />
      {domain ? (
        <p className="mt-6 text-sm text-muted">
          Need a refresher?{" "}
          <Link href={`/learn/${domain.id}`} className="text-accent hover:underline">
            Open the {domain.title} lesson
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
