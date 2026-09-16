"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/content/types";
import { useProgress } from "./ProgressProvider";
import { Badge, Card, DifficultyBadge, ExamBadge, ProgressBar, ThemeBadge } from "./ui";
import { phaseLabel } from "@/lib/labels";
import { cn } from "@/lib/cn";
import { getRandomScenarioId } from "@/content";

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const { recordScenario, scenarioBest } = useProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const best = scenarioBest(scenario.id);

  const step = scenario.steps[stepIndex];
  const locked = picked !== null;
  const choice = step?.choices.find((item) => item.id === picked);

  function choose(id: string) {
    if (locked || !step) return;
    const selected = step.choices.find((item) => item.id === id);
    if (!selected) return;
    setPicked(id);
    if (selected.correct) setScore((value) => value + 1);
    if (step.findings) {
      setNotes((value) =>
        value.includes(step.findings as string) ? value : [...value, step.findings as string],
      );
    }
  }

  function next() {
    if (!step) return;
    if (stepIndex >= scenario.steps.length - 1) {
      recordScenario(scenario.id, score, scenario.steps.length);
      setDone(true);
      return;
    }
    setStepIndex((value) => value + 1);
    setPicked(null);
  }

  function restart() {
    setStepIndex(0);
    setPicked(null);
    setScore(0);
    setNotes([]);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((score / scenario.steps.length) * 100);
    return (
      <div className="space-y-5">
        <TicketHeader scenario={scenario} />
        <Card className="space-y-4">
          <Badge tone={percent === 100 ? "ok" : percent >= 75 ? "accent" : "warn"}>
            Ticket {percent === 100 ? "closed clean" : "closed with coaching"}
          </Badge>
          <h2 className="text-2xl font-semibold">
            {score} / {scenario.steps.length} steps correct ({percent}%)
          </h2>
          <p className="text-sm leading-6 text-muted">
            Best on this device:{" "}
            {best ? `${best.score}/${best.total}` : `${score}/${scenario.steps.length}`}.
            Wrong turns still teach — read the debrief and try again.
          </p>
          <ProgressBar value={percent} />
          <div className="rounded-xl border border-border bg-surface-2/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Debrief
            </p>
            <p className="mt-2 text-sm leading-7">{scenario.debrief}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restart}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
            >
              Run this ticket again
            </button>
            <button
              type="button"
              onClick={() => {
                const nextId = getRandomScenarioId(scenario.id);
                router.push(nextId ? `/lab/${nextId}` : "/lab");
              }}
              className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
            >
              Another random ticket
            </button>
            <Link
              href="/lab"
              className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
            >
              Back to the queue
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!step) {
    return (
      <Card>
        <p className="text-muted">This scenario is missing steps.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <TicketHeader scenario={scenario} />

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {scenario.steps.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              index === stepIndex
                ? "border-accent/40 bg-accent-dim text-accent"
                : index < stepIndex
                  ? "border-ok/30 bg-ok/10 text-ok"
                  : "border-border text-muted",
            )}
          >
            <span className="font-mono">{index + 1}</span> {phaseLabel(item.phase)}
          </li>
        ))}
      </ol>

      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-warn">
          {phaseLabel(step.phase)}
        </p>
        <h2 className="mt-1 text-xl font-semibold">{step.title}</h2>
        <p className="mt-2 text-[15px] leading-7">{step.prompt}</p>
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
                  "w-full rounded-xl border px-3 py-3 text-left text-sm leading-6",
                  !locked && "border-border hover:border-accent/50 hover:bg-surface-2",
                  locked && item.correct && "border-ok/50 bg-ok/10",
                  locked && isPick && !item.correct && "border-danger/50 bg-danger/10",
                  locked && !isPick && !item.correct && "border-border opacity-70",
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
              {choice.correct ? "Good call" : "Not the best move"}
            </p>
            <p className="text-sm leading-6 text-foreground/85">{choice.feedback}</p>
            {step.findings ? (
              <div className="rounded-xl border border-border bg-background/60 p-3 text-sm leading-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  New findings
                </p>
                <p className="mt-1">{step.findings}</p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
            >
              {stepIndex === scenario.steps.length - 1 ? "Close the ticket" : "Continue"}
            </button>
          </div>
        ) : null}
      </Card>

      {notes.length ? (
        <Card className="bg-surface-2/40">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Technician notes
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function TicketHeader({ scenario }: { scenario: Scenario }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="ticket-grid bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-warn">{scenario.ticketId}</span>
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
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{scenario.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {scenario.requester} · {scenario.location} · ~{scenario.minutes} min
        </p>
      </div>
      <div className="border-t border-border bg-surface-2/50 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Ticket
        </p>
        <p className="mt-2 text-[15px] leading-7">{scenario.ticket}</p>
      </div>
    </div>
  );
}
