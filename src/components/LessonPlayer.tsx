"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Domain, Lesson, PathBeat, PathCheck } from "@/content/types";
import { lessonToPath } from "@/lib/lesson-path";
import { challengeHref, labThemeForDomain, quizHref } from "@/content/registry";
import { getChallengesBySubject } from "@/content/challenges";
import { useProgress } from "./ProgressProvider";
import { CheckPlay } from "./CheckPlay";
import { PathDiagram } from "./PathDiagram";
import { joinSpeech } from "@/lib/speech";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { Badge, ExamBadge } from "./ui";
import { cn } from "@/lib/cn";

function resumeIndex(cursor: number | undefined, total: number) {
  const stored = cursor ?? 0;
  if (total <= 0) return 0;
  if (stored < 0) return total - 1;
  return Math.min(stored, total - 1);
}

export function LessonPlayer({
  domain,
  lesson,
  checks = [],
}: {
  domain: Domain;
  lesson: Lesson;
  checks?: PathCheck[];
}) {
  const { progress, markLessonComplete, saveLessonCursor, recordQuizAnswer, lessonDone } =
    useProgress();
  const beats = useMemo(
    () => lessonToPath(lesson, checks, domain.subject),
    [lesson, checks, domain.subject],
  );
  const [index, setIndex] = useState(() =>
    resumeIndex(progress.lessonCursor?.[lesson.id], beats.length),
  );
  const [checkOk, setCheckOk] = useState(false);
  const [followUp, setFollowUp] = useState<string | undefined>();
  const beat = beats[index];
  const last = index >= beats.length - 1;
  const done = lessonDone(lesson.id);

  function continuePath() {
    if (beat?.kind === "check" && !checkOk) return;
    if (last) {
      markLessonComplete(lesson.id);
      return;
    }
    const next = index + 1;
    setIndex(next);
    setCheckOk(false);
    setFollowUp(undefined);
    saveLessonCursor(lesson.id, next);
  }

  if (!beat) return null;

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-xl items-center justify-between gap-3">
        <Link href={`/learn/${domain.subject}`} className="text-sm text-muted hover:text-foreground">
          ← Path
        </Link>
        <div className="flex items-center gap-2">
          {domain.exam ? <ExamBadge exam={domain.exam} /> : <Badge tone="accent">{domain.subject}</Badge>}
          {done ? <Badge tone="ok">Done</Badge> : <Badge tone="muted">{lesson.minutes} min</Badge>}
        </div>
      </div>

      <PlayerFrame
        kicker={`${domain.number}. ${domain.title}`}
        title={lesson.title}
        index={index}
        total={beats.length}
        narration={{
          id: beat.id,
          prompt: beatSpeech(beat),
          choices: beatChoices(beat),
          followUp,
        }}
        footer={
          last && done ? (
            <EndLinks domain={domain} restart={() => { setIndex(0); setCheckOk(false); setFollowUp(undefined); }} />
          ) : (
            <PlayerButton onClick={continuePath} disabled={beat.kind === "check" && !checkOk}>
              {beat.kind === "check" && !checkOk
                ? "Answer to continue"
                : last
                  ? "Finish path · +80 XP"
                  : "Continue"}
            </PlayerButton>
          )
        }
      >
        <BeatView
          beat={beat}
          onCheck={(correct, checkId, spoken) => {
            setCheckOk(true);
            setFollowUp(spoken);
            recordQuizAnswer(`path-${checkId}`, correct);
          }}
        />
      </PlayerFrame>
    </div>
  );
}

function beatSpeech(beat: PathBeat) {
  if (beat.kind === "check" && beat.check) {
    return beat.check.prompt;
  }
  const table = beat.table
    ? beat.table.rows.slice(0, 4).map((row) => row.join(", ")).join(". ")
    : "";
  return joinSpeech([beat.title, ...(beat.body ?? []), ...(beat.bullets ?? []), table]);
}

function beatChoices(beat: PathBeat) {
  const check = beat.check;
  if (!check) return undefined;
  if (check.choices?.length) return check.choices.map((choice) => choice.label);
  if (check.type === "truefalse") return ["True", "False"];
  if (check.items?.length) return check.items.map((item) => item.label);
  if (check.pairs?.length) return check.pairs.map((pair) => `${pair.left}. ${pair.right}`);
  return undefined;
}

function BeatView({
  beat,
  onCheck,
}: {
  beat: PathBeat;
  onCheck: (correct: boolean, checkId: string, spoken?: string) => void;
}) {
  if (beat.kind === "check" && beat.check) {
    return (
      <CheckPlay
        key={beat.check.id}
        check={beat.check}
        onResolved={(correct, spoken) => onCheck(correct, beat.check!.id, spoken)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {beat.diagram ? (
        <div className="text-accent">
          <PathDiagram id={beat.diagram} />
        </div>
      ) : null}
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          beat.kind === "tip" ? "text-warn" : "text-accent",
        )}
      >
        {beat.kind === "tip" ? beat.title : beat.kind === "recap" ? "Recap" : beat.kind === "explain" ? "Why it matters" : "Concept"}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-balance">{beat.title}</h2>
      {beat.body?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-[16px] leading-8 text-foreground/90">
          {paragraph}
        </p>
      ))}
      {beat.bullets?.length ? (
        <ul className="space-y-2">
          {beat.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-2xl border border-border bg-surface-2/50 px-4 py-3 text-sm leading-6"
            >
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {beat.table ? (
        <div className="space-y-2">
          {beat.table.rows.slice(0, 6).map((row) => (
            <div
              key={row.join("|")}
              className="rounded-2xl border border-border px-4 py-3 text-sm leading-6"
            >
              <p className="font-mono text-xs text-accent">{row[0]}</p>
              <p className="mt-1 text-foreground/85">{row.slice(1).join(" · ")}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EndLinks({
  domain,
  restart,
}: {
  domain: Domain;
  restart: () => void;
}) {
  const challenge = getChallengesBySubject(domain.subject)[0];
  const theme = labThemeForDomain(domain.id);
  const third =
    domain.subject === "tech" && domain.exam ? (
      <Link
        href={`/lab?exam=${domain.exam}${theme ? `&theme=${theme}` : ""}`}
        className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
      >
        Generate a ticket
      </Link>
    ) : challenge ? (
      <Link
        href={challengeHref(challenge.id)}
        className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
      >
        Try a challenge
      </Link>
    ) : (
      <Link
        href={`/learn/${domain.subject}`}
        className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
      >
        More paths
      </Link>
    );

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <PlayerButton tone="ghost" onClick={restart}>
        Replay path
      </PlayerButton>
      <Link
        href={quizHref(domain.quizId)}
        className="rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background"
      >
        Practice problems
      </Link>
      {third}
    </div>
  );
}
