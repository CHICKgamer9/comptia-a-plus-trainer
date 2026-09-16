"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { Badge, DifficultyBadge, ExamBadge, ThemeBadge } from "./ui";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { phaseLabel } from "@/lib/labels";
import { cn } from "@/lib/cn";

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const { recordScenario, scenarioBest } = useProgress();
  const [briefed, setBriefed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const best = scenarioBest(scenario.id);
  const totalBeats = scenario.steps.length + 1;
  const step = scenario.steps[stepIndex];
  const locked = picked !== null;
  const choice = step?.choices.find((item) => item.id === picked);

  function choose(id: string) {
    if (locked || !step) return;
    const selected = step.choices.find((item) => item.id === id);
    if (!selected) return;
    setPicked(id);
    if (selected.correct) setScore((value) => value + 1);
  }

  function next() {
    if (!step) return;
    if (stepIndex >= scenario.steps.length - 1) {
      recordScenario(scenario.id, {
        score,
        total: scenario.steps.length,
        at: Date.now(),
        exam: scenario.exam,
        theme: scenario.theme,
        domainIds: scenario.domainIds,
      });
      setDone(true);
      return;
    }
    setStepIndex((value) => value + 1);
    setPicked(null);
  }

  function restart() {
    setBriefed(false);
    setStepIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((score / scenario.steps.length) * 100);
    return (
      <PlayerFrame kicker={scenario.ticketId} index={totalBeats - 1} total={totalBeats}>
        <Badge tone={percent === 100 ? "ok" : percent >= 75 ? "accent" : "warn"}>
          {percent === 100 ? "Clean close" : "Closed with coaching"}
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold">
          {score}/{scenario.steps.length}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Best on this device: {best ? `${best.score}/${best.total}` : `${score}/${scenario.steps.length}`}.
        </p>
        <div className="mt-5 rounded-2xl border border-border bg-surface-2/50 px-4 py-3 text-sm leading-7">
          {scenario.debrief}
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <PlayerButton onClick={restart}>Run it again</PlayerButton>
          <button
            type="button"
            onClick={() => router.push("/lab")}
            className="rounded-2xl border border-border px-4 py-3.5 text-sm font-semibold hover:bg-surface-2"
          >
            New ticket
          </button>
        </div>
      </PlayerFrame>
    );
  }

  if (!briefed) {
    return (
      <PlayerFrame
        kicker={scenario.ticketId}
        index={0}
        total={totalBeats}
        footer={<PlayerButton onClick={() => setBriefed(true)}>Start investigating</PlayerButton>}
      >
        <div className="flex flex-wrap gap-2">
          <Badge
            tone={
              scenario.priority === "Critical" || scenario.priority === "High"
                ? "danger"
                : scenario.priority === "Medium"
                  ? "warn"
                  : "muted"
            }
          >
            {scenario.priority}
          </Badge>
          <ExamBadge exam={scenario.exam} />
          <ThemeBadge theme={scenario.theme} />
          <DifficultyBadge level={scenario.difficulty} />
          <Badge tone={scenario.source === "fallback" ? "warn" : "accent"}>
            {scenario.source === "fallback" ? "Practice stub" : "AI study aid"}
          </Badge>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{scenario.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {scenario.requester} · {scenario.location} · ~{scenario.minutes} min
        </p>
        <p className="mt-5 text-[16px] leading-8">{scenario.ticket}</p>
        <p className="mt-4 text-xs text-muted">
          One beat at a time: gather → tools → cause → fix. Study aid, not official CompTIA.
        </p>
      </PlayerFrame>
    );
  }

  if (!step) {
    return <p className="text-muted">This ticket is missing steps.</p>;
  }

  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-xl justify-center gap-2">
        {scenario.steps.map((item, index) => (
          <span
            key={item.id}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] uppercase tracking-wider",
              index === stepIndex
                ? "bg-accent text-background"
                : index < stepIndex
                  ? "bg-ok/15 text-ok"
                  : "bg-surface-2 text-muted",
            )}
          >
            {phaseLabel(item.phase)}
          </span>
        ))}
      </div>
      <PlayerFrame
        kicker={phaseLabel(step.phase)}
        index={stepIndex + 1}
        total={totalBeats}
        footer={
          locked ? (
            <PlayerButton onClick={next}>
              {stepIndex === scenario.steps.length - 1 ? "Close the ticket" : "Continue"}
            </PlayerButton>
          ) : (
            <p className="text-center text-xs text-muted">Commit to one move.</p>
          )
        }
      >
        <h2 className="text-xl font-semibold">{step.title}</h2>
        <p className="mt-2 text-[16px] leading-8">{step.prompt}</p>
        <div className="mt-5 space-y-2">
          {step.choices.map((item) => {
            const isPick = picked === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={locked}
                onClick={() => choose(item.id)}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition",
                  !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                  locked && item.correct && "border-ok/50 bg-ok/10",
                  locked && isPick && !item.correct && "border-danger/50 bg-danger/10",
                  locked && !isPick && !item.correct && "border-border opacity-60",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {locked && choice ? (
          <div className="mt-5 space-y-3">
            <p className={cn("text-sm font-medium", choice.correct ? "text-ok" : "text-danger")}>
              {choice.correct ? "Good call." : "Not the best move."}
            </p>
            <p className="text-sm leading-6 text-foreground/85">{choice.feedback}</p>
            {step.findings ? (
              <div className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm leading-6">
                <p className="text-[11px] uppercase tracking-wider text-muted">You learned</p>
                <p className="mt-1">{step.findings}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </PlayerFrame>
      <p className="mx-auto mt-4 max-w-xl text-center">
        <Link href="/lab" className="text-sm text-muted hover:text-foreground">
          ← Queue
        </Link>
      </p>
    </div>
  );
}
