"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { Badge, Card, ProgressBar } from "./ui";
import { cn } from "@/lib/cn";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { recordQuiz, quizBest } = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const best = quizBest(quiz.id);

  const question = quiz.questions[index];
  const locked = picked !== null;
  const correct = picked === question?.correctIndex;

  const letters = useMemo(() => ["A", "B", "C", "D", "E"], []);

  function choose(choiceIndex: number) {
    if (locked || !question) return;
    setPicked(choiceIndex);
    if (choiceIndex === question.correctIndex) {
      setScore((value) => value + 1);
    }
  }

  function next() {
    if (!question) return;
    const last = index >= quiz.questions.length - 1;
    if (last) {
      const finalScore = score + (picked === question.correctIndex ? 0 : 0);
      recordQuiz(quiz.id, finalScore, quiz.questions.length);
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    return (
      <Card className="space-y-4">
        <Badge tone={percent >= 80 ? "ok" : percent >= 60 ? "warn" : "danger"}>
          {percent >= 80 ? "Exam-ready range" : percent >= 60 ? "Keep drilling" : "Review the lesson"}
        </Badge>
        <h2 className="text-2xl font-semibold">
          {score} / {quiz.questions.length} ({percent}%)
        </h2>
        <p className="text-sm text-muted">
          Best recorded on this device:{" "}
          {best ? `${best.score}/${best.total}` : `${score}/${quiz.questions.length}`}.
          Explanations stay with each item — retake whenever you want.
        </p>
        <ProgressBar value={percent} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restart}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
          >
            Retake quiz
          </button>
          <Link
            href={`/learn/${quiz.domainId}`}
            className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
          >
            Review the lesson
          </Link>
          <Link
            href="/lab"
            className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
          >
            Practice a ticket
          </Link>
        </div>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <p className="text-muted">This quiz has no questions yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <ProgressBar
        value={((index + (locked ? 1 : 0)) / quiz.questions.length) * 100}
        label={`Question ${index + 1} of ${quiz.questions.length}`}
      />
      <Card>
        <p className="text-lg font-medium leading-8">{question.prompt}</p>
        <div className="mt-5 space-y-2">
          {question.choices.map((choice, choiceIndex) => {
            const isPick = picked === choiceIndex;
            const isAnswer = choiceIndex === question.correctIndex;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => choose(choiceIndex)}
                disabled={locked}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm leading-6 transition-colors",
                  !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                  locked && isAnswer && "border-ok/50 bg-ok/10",
                  locked && isPick && !isAnswer && "border-danger/50 bg-danger/10",
                  locked && !isPick && !isAnswer && "border-border opacity-70",
                )}
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-surface-2 font-mono text-xs">
                  {letters[choiceIndex]}
                </span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>
        {locked ? (
          <div className="mt-5 space-y-3">
            <p className={cn("text-sm font-medium", correct ? "text-ok" : "text-danger")}>
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="text-sm leading-6 text-foreground/85">{question.explanation}</p>
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
            >
              {index === quiz.questions.length - 1 ? "See score" : "Next question"}
            </button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
