"use client";

import { useState } from "react";
import Link from "next/link";
import { PBQ_TASKS } from "@/content/pbqs";
import { CheckPlay } from "./CheckPlay";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { useProgress } from "./ProgressProvider";

export function PbqRunner() {
  const { recordQuizAnswer, recordQuiz, setLastSubject } = useProgress();
  const [index, setIndex] = useState(0);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const task = PBQ_TASKS[index];

  if (done) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent">PBQ</p>
        <h1 className="mt-2 text-3xl font-semibold">{score}/{PBQ_TASKS.length}</h1>
        <p className="mt-2 text-sm text-muted">Study-aid performance tasks. Not official CompTIA items.</p>
        <Link href="/practice" className="mt-6 inline-flex rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-background">
          Back to Practice
        </Link>
      </div>
    );
  }

  if (!task) return null;

  return (
    <PlayerFrame
      kicker={`PBQ · ${task.objective}`}
      title={task.title}
      index={index}
      total={PBQ_TASKS.length}
      narration={{ id: task.id, prompt: task.check.prompt }}
      footer={
        ok ? (
          <PlayerButton
            onClick={() => {
              if (index >= PBQ_TASKS.length - 1) {
                recordQuiz("tech-pbq", score, PBQ_TASKS.length);
                setLastSubject("tech");
                setDone(true);
                return;
              }
              setIndex((value) => value + 1);
              setOk(false);
            }}
          >
            {index >= PBQ_TASKS.length - 1 ? "See score" : "Next task"}
          </PlayerButton>
        ) : (
          <p className="text-center text-xs text-muted">Finish this task to continue.</p>
        )
      }
    >
      <CheckPlay
        check={task.check}
        onResolved={(correct) => {
          if (ok) return;
          setOk(true);
          recordQuizAnswer(`pbq-${task.id}`, correct, { domainId: "hardware", subject: "tech", conceptId: task.id });
          if (correct) setScore((value) => value + 1);
        }}
      />
    </PlayerFrame>
  );
}
