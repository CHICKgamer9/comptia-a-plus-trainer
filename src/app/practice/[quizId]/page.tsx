import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, getQuiz, quizzes } from "@/content";
import { QuizRunner } from "@/components/QuizRunner";

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
      <p className="mx-auto mb-6 max-w-xl">
        <Link href="/practice" className="text-sm text-muted hover:text-foreground">
          ← Practice
        </Link>
        {domain ? (
          <>
            <span className="text-muted"> · </span>
            <Link href={`/learn/${domain.id}`} className="text-sm text-accent hover:underline">
              {domain.title} path
            </Link>
          </>
        ) : null}
      </p>
      <QuizRunner quiz={quiz} />
    </div>
  );
}
