"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Quiz } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { Badge } from "./ui";
import { cn } from "@/lib/cn";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { recordQuiz, recordQuizAnswer, quizBest } = useProgress();
  const [examMode, setExamMode] = useState(false);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<{ pick: number; ok: boolean }[]>([]);
  const best = quizBest(quiz.id);
  const question = quiz.questions[index];
  const locked = picked !== null;
  const correct = picked === question?.correctIndex;
  const letters = useMemo(() => ["A", "B", "C", "D", "E"], []);

  function choose(choiceIndex: number) {
    if (locked || !question) return;
    setPicked(choiceIndex);
    const ok = choiceIndex === question.correctIndex;
    recordQuizAnswer(question.id, ok);
    if (ok) setScore((value) => value + 1);
    setLog((value) => [...value, { pick: choiceIndex, ok }]);
  }

  function next() {
    if (!question) return;
    if (index >= quiz.questions.length - 1) {
      recordQuiz(quiz.id, score, quiz.questions.length);
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
    setLog([]);
    setStarted(false);
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-lg leading-8 text-foreground/90">
          One problem at a time. In practice you see why immediately. Exam drill hides the key until the end.
        </p>
        {best ? (
          <p className="mt-2 text-sm text-muted">
            Best on this device: {best.score}/{best.total}
          </p>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setExamMode(false);
              setStarted(true);
            }}
            className="rounded-3xl border border-accent/40 bg-accent-dim p-5 text-left hover:border-accent"
          >
            <p className="text-xs uppercase tracking-wider text-accent">Practice</p>
            <p className="mt-2 font-semibold">Feedback after each try</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setExamMode(true);
              setStarted(true);
            }}
            className="rounded-3xl border border-border bg-surface p-5 text-left hover:border-accent/40"
          >
            <p className="text-xs uppercase tracking-wider text-muted">Exam drill</p>
            <p className="mt-2 font-semibold">Score at the end</p>
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    return (
      <PlayerFrame kicker={quiz.title} index={quiz.questions.length - 1} total={quiz.questions.length}>
        <Badge tone={percent >= 80 ? "ok" : percent >= 60 ? "warn" : "danger"}>
          {percent >= 80 ? "Strong set" : percent >= 60 ? "Keep going" : "Replay the path"}
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold">
          {score}/{quiz.questions.length}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Best recorded: {best ? `${best.score}/${best.total}` : `${score}/${quiz.questions.length}`}.
        </p>
        {examMode ? (
          <ul className="mt-5 space-y-3">
            {quiz.questions.map((item, itemIndex) => (
              <li key={item.id} className="rounded-2xl border border-border px-4 py-3 text-sm leading-6">
                <p className="font-medium">{item.prompt}</p>
                <p className={cn("mt-1", log[itemIndex]?.ok ? "text-ok" : "text-danger")}>
                  {log[itemIndex]?.ok ? "Correct" : "Miss"} · {item.explanation}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <PlayerButton onClick={restart}>Try again</PlayerButton>
          <Link
            href={`/learn/${quiz.domainId}`}
            className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
          >
            Back to the path
          </Link>
        </div>
      </PlayerFrame>
    );
  }

  if (!question) {
    return <p className="text-muted">This set has no problems yet.</p>;
  }

  const showWhy = locked && !examMode;

  return (
    <PlayerFrame
      kicker={quiz.title}
      index={index}
      total={quiz.questions.length}
      footer={
        locked ? (
          <PlayerButton onClick={next}>
            {index === quiz.questions.length - 1 ? "See score" : "Continue"}
          </PlayerButton>
        ) : (
          <p className="text-center text-xs text-muted">Pick one to lock it in.</p>
        )
      }
    >
      <p className="text-lg font-medium leading-8 sm:text-xl">{question.prompt}</p>
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
                "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition",
                !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                locked && examMode && isPick && "border-accent/50 bg-accent-dim",
                locked && !examMode && isAnswer && "border-ok/50 bg-ok/10",
                locked && !examMode && isPick && !isAnswer && "border-danger/50 bg-danger/10",
                locked && !examMode && !isPick && !isAnswer && "border-border opacity-60",
              )}
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-xs">
                {letters[choiceIndex]}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>
      {showWhy ? (
        <div className="mt-5 rounded-2xl border border-border bg-surface-2/40 px-4 py-3">
          <p className={cn("text-sm font-medium", correct ? "text-ok" : "text-danger")}>
            {correct ? "Nice." : "Not quite."}
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/85">{question.explanation}</p>
        </div>
      ) : null}
    </PlayerFrame>
  );
}
