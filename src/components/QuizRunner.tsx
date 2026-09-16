"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Quiz } from "@/content/types";
import type { DomainWeight } from "@/content/objectives";
import { useProgress } from "./ProgressProvider";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { Badge } from "./ui";
import { cn } from "@/lib/cn";
import { getDomain, pathHref } from "@/content/registry";
import { joinSpeech } from "@/lib/speech";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildDeck(quiz: Quiz, kind: "full" | "drill" | "timed") {
  if (kind === "drill") return shuffle(quiz.questions).slice(0, Math.min(10, quiz.questions.length));
  if (kind === "timed") return shuffle(quiz.questions).slice(0, Math.min(40, quiz.questions.length));
  return quiz.questions;
}

export function QuizRunner({
  quiz,
  preset,
  afterDone,
  domainWeights,
}: {
  quiz: Quiz;
  preset?: "drill" | "timed";
  afterDone?: ReactNode;
  domainWeights?: DomainWeight[];
}) {
  const { recordQuiz, recordQuizAnswer, quizBest } = useProgress();
  const recorded = useRef(false);
  const scoreRef = useRef(0);
  const [examMode, setExamMode] = useState(preset === "timed" || preset === "drill");
  const [started, setStarted] = useState(Boolean(preset));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<{ pick: number; ok: boolean }[]>([]);
  const [deck, setDeck] = useState(() => buildDeck(quiz, preset ?? "full"));
  const [remain, setRemain] = useState(preset === "timed" ? 20 * 60 : 0);
  scoreRef.current = score;
  const best = quizBest(quiz.id);
  const question = deck[index];
  const locked = picked !== null;
  const correct = picked === question?.correctIndex;
  const letters = useMemo(() => ["A", "B", "C", "D", "E"], []);
  const domain = getDomain(quiz.domainId);
  const showObjective = Boolean(domain?.exam && question?.objective);

  function finish(finalScore: number) {
    if (!recorded.current) {
      recorded.current = true;
      recordQuiz(quiz.id, finalScore, deck.length);
    }
    setDone(true);
  }

  useEffect(() => {
    if (preset !== "timed" || !started || done) return;
    const id = window.setInterval(() => {
      setRemain((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [preset, started, done]);

  useEffect(() => {
    if (preset === "timed" && started && !done && remain === 0) {
      finish(scoreRef.current);
    }
  }, [preset, started, done, remain]);

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
    if (index >= deck.length - 1) {
      finish(score);
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  function restart() {
    recorded.current = false;
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setLog([]);
    setDeck(buildDeck(quiz, preset ?? "full"));
    setRemain(preset === "timed" ? 20 * 60 : 0);
    setStarted(Boolean(preset));
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-lg leading-8 text-foreground/90">
          One problem at a time. In practice you see why immediately. Exam drill hides the key until the end.
        </p>
        {best && !preset ? (
          <p className="mt-2 text-sm text-muted">
            Best: {best.score}/{best.total}
          </p>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setDeck(buildDeck(quiz, "full"));
              setExamMode(false);
              setStarted(true);
            }}
            className="rounded-3xl border border-accent/40 bg-accent-dim p-5 text-left hover:border-accent"
          >
            <p className="text-xs uppercase tracking-wider text-accent">Practice</p>
            <p className="mt-2 font-semibold">Feedback after each try</p>
          </button>
          {domain?.exam ? (
            <button
              type="button"
              onClick={() => {
                setDeck(buildDeck(quiz, "drill"));
                setExamMode(true);
                setStarted(true);
              }}
              className="rounded-3xl border border-border bg-surface p-5 text-left hover:border-accent/40"
            >
              <p className="text-xs uppercase tracking-wider text-muted">Quick drill</p>
              <p className="mt-2 font-semibold">10 questions · score at the end</p>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDeck(buildDeck(quiz, "full"));
                setExamMode(true);
                setStarted(true);
              }}
              className="rounded-3xl border border-border bg-surface p-5 text-left hover:border-accent/40"
            >
              <p className="text-xs uppercase tracking-wider text-muted">Exam drill</p>
              <p className="mt-2 font-semibold">Score at the end</p>
            </button>
          )}
        </div>
        {domain?.exam ? (
          <p className="mt-4 text-center text-xs text-muted">
            Full domain bank is {quiz.questions.length} items. Timed Core mocks live on Practice.
          </p>
        ) : null}
      </div>
    );
  }

  if (done) {
    const percent = Math.round((score / Math.max(1, deck.length)) * 100);
    return (
      <PlayerFrame kicker={quiz.title} index={Math.max(0, deck.length - 1)} total={deck.length} narration={{
        id: `${quiz.id}-done`,
        prompt: joinSpeech([
          `${score} out of ${deck.length}.`,
          percent >= 80 ? "Strong set." : percent >= 60 ? "Keep going." : "Replay the path.",
        ]),
      }}>
        <Badge tone={percent >= 80 ? "ok" : percent >= 60 ? "warn" : "danger"}>
          {percent >= 80 ? "Strong set" : percent >= 60 ? "Keep going" : "Replay the path"}
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold">
          {score}/{deck.length}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Best recorded: {best ? `${best.score}/${best.total}` : `${score}/${deck.length}`}.
        </p>
        {preset === "timed" && domainWeights?.length ? (
          <ul className="mt-5 space-y-2 text-sm">
            {domainWeights.map((weight) => {
              const rows = deck
                .map((item, itemIndex) => ({ item, ok: log[itemIndex]?.ok }))
                .filter(({ item }) => item.objective?.split(".")[0] === String(weight.number));
              const hit = rows.filter((row) => row.ok).length;
              const total = rows.length;
              return (
                <li key={weight.domainId} className="flex justify-between gap-3 rounded-xl border border-border px-3 py-2">
                  <span>
                    {weight.title}
                    <span className="ml-2 text-xs text-muted">{weight.percent}% of exam</span>
                  </span>
                  <span className="font-mono text-xs">
                    {total ? `${hit}/${total}` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
        {afterDone}
        {examMode ? (
          <ul className="mt-5 space-y-3">
            {deck.map((item, itemIndex) => (
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
            href={domain ? pathHref(domain) : "/learn"}
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
      kicker={remain ? `${quiz.title} · ${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}` : quiz.title}
      index={index}
      total={deck.length}
      narration={{
        id: question.id,
        prompt: question.prompt,
        choices: question.choices,
        followUp: showWhy
          ? joinSpeech([correct ? "Nice." : "Not quite.", question.explanation])
          : undefined,
      }}
      footer={
        locked ? (
          <PlayerButton onClick={next}>
            {index === deck.length - 1 ? "See score" : "Continue"}
          </PlayerButton>
        ) : (
          <p className="text-center text-xs text-muted">Pick one to lock it in.</p>
        )
      }
    >
      <p className="text-lg font-medium leading-8 sm:text-xl">{question.prompt}</p>
      {showObjective ? (
        <p className="mt-2 font-mono text-[11px] text-muted">{question.objective}</p>
      ) : null}
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
