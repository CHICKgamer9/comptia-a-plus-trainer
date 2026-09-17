"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Domain, LearnBeatType, Lesson, PathBeat, PathCheck } from "@/content/types";
import { lessonToPath } from "@/lib/lesson-path";
import { challengeHref, labThemeForDomain, quizHref } from "@/content/registry";
import { getChallengesBySubject } from "@/content/challenges";
import { projectHref, suggestedProjectForPath } from "@/content/projects";
import { speakTextOf } from "@/lib/tts/script";
import { cancelAll } from "@/lib/tts/speak";
import { useProgress } from "./ProgressProvider";
import { CheckPlay } from "./CheckPlay";
import { PathDiagram } from "./PathDiagram";
import { TeachFigure } from "./TeachFigure";
import { PlayerButton, PlayerFrame } from "./PlayerFrame";
import { Badge, ExamBadge } from "./ui";

function resumeIndex(cursor: number | undefined, total: number) {
  const stored = cursor ?? 0;
  if (total <= 0) return 0;
  if (stored < 0) return total - 1;
  return Math.min(stored, total - 1);
}

function beatType(beat: PathBeat): LearnBeatType | PathBeat["kind"] {
  return beat.type ?? beat.kind;
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
  const search = useSearchParams();
  const huntRequested = search.get("hunt") === "1";
  const replayCheck = search.get("check");
  const done = lessonDone(lesson.id);
  const hunt = huntRequested && done;
  const beats = useMemo(() => {
    const all = lessonToPath(lesson, checks, domain.subject, domain.cluster);
    if (!hunt) return all;
    const checksOnly = all.filter((item) => item.check).slice(0, 3);
    return checksOnly.length ? checksOnly : all.slice(0, 3);
  }, [lesson, checks, domain.subject, domain.cluster, hunt]);
  const [index, setIndex] = useState(() => {
    if (replayCheck) {
      const found = beats.findIndex((item) => item.check?.id === replayCheck);
      if (found >= 0) return found;
    }
    if (hunt) return 0;
    return resumeIndex(progress.lessonCursor?.[lesson.id], beats.length);
  });
  const [checkOk, setCheckOk] = useState(false);
  const [followUp, setFollowUp] = useState<string | undefined>();
  const [endedFor, setEndedFor] = useState<string | null>(null);
  const beat = beats[index];
  const last = index >= beats.length - 1;
  const autoRead = progress.autoRead === true;
  const muted = progress.speechMuted === true;
  const script = speakTextOf(beat?.speak);
  const speechEnded = !autoRead || muted || !script || endedFor === beat?.id;

  function continuePath() {
    if (beat?.check && !checkOk) return;
    if (autoRead && !speechEnded && !muted) return;
    if (last) {
      if (!hunt) markLessonComplete(lesson.id);
      return;
    }
    cancelAll();
    const next = index + 1;
    setIndex(next);
    setCheckOk(false);
    setFollowUp(undefined);
    if (!hunt) saveLessonCursor(lesson.id, next);
  }

  function skipBeat() {
    if (!beat?.check || checkOk) return;
    if (beatType(beat) !== "decide" && beatType(beat) !== "try") return;
    setCheckOk(true);
    setFollowUp("Skipped. No card.");
    recordQuizAnswer(`path-${beat.check.id}`, false, {
      domainId: domain.id,
      subject: domain.subject,
      conceptId: beat.check.id,
      skipped: true,
      cardId: beat.cardId,
    });
  }

  if (!beat) return null;

  const type = beatType(beat);
  const waitingOnCheck = Boolean(beat.check) && !checkOk;
  const waitingOnSpeech = autoRead && !muted && !speechEnded;
  const continueDisabled = waitingOnCheck || waitingOnSpeech;

  return (
    <div>
      <div className="mx-auto mb-6 hidden max-w-xl items-center justify-between gap-3 md:flex">
        <Link href={`/learn/${domain.subject}`} className="text-sm text-muted hover:text-foreground">
          ← Path
        </Link>
        <div className="flex items-center gap-2">
          {domain.exam ? <ExamBadge exam={domain.exam} /> : <Badge tone="accent">{domain.subject}</Badge>}
          {done ? <Badge tone="ok">Done</Badge> : <Badge tone="muted">{lesson.minutes} min</Badge>}
        </div>
      </div>

      <PlayerFrame
        backHref={`/learn/${domain.subject}`}
        kicker={`${hunt ? "Hunt · " : ""}${domain.number}. ${domain.title}`}
        title={lesson.title}
        index={index}
        total={beats.length}
        narration={{
          id: beat.id,
          prompt: beat.speak ?? { silent: true },
          followUp,
          onEnded: () => setEndedFor(beat.id),
        }}
        footer={
          last && done && !hunt ? (
            <EndLinks domain={domain} restart={() => { setIndex(0); setCheckOk(false); setFollowUp(undefined); }} />
          ) : last && hunt && (!beat.check || checkOk) ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/binder"
                className="rounded-2xl bg-accent px-4 py-3.5 text-center text-sm font-semibold text-background"
              >
                Back to Binder
              </Link>
              <Link
                href="/brain/today"
                className="rounded-2xl border border-border px-4 py-3.5 text-center text-sm font-semibold hover:bg-surface-2"
              >
                Brain Gym
              </Link>
            </div>
          ) : (
            <div className="grid gap-2">
              <PlayerButton onClick={continuePath} disabled={continueDisabled}>
                {waitingOnCheck
                  ? "Answer to continue"
                  : waitingOnSpeech
                    ? "Listening…"
                    : last
                      ? hunt
                        ? "Finish hunt"
                        : "Finish path · +80 XP"
                      : "Continue"}
              </PlayerButton>
              {type === "decide" && beat.check && !checkOk ? (
                <button
                  type="button"
                  onClick={skipBeat}
                  className="flex min-h-11 w-full items-center justify-center text-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
                >
                  Skip this beat — no card
                </button>
              ) : null}
            </div>
          )
        }
      >
        <BeatView
          beat={beat}
          onCheck={(correct, checkId, spoken) => {
            if (checkOk) return;
            setCheckOk(true);
            const feedback = correct
              ? beat.speakFeedbackCorrect ?? spoken
              : beat.speakFeedbackWrong ?? spoken;
            setFollowUp(feedback);
            recordQuizAnswer(`path-${checkId}`, correct, {
              domainId: domain.id,
              subject: domain.subject,
              conceptId: checkId,
              cardId: type === "decide" ? beat.cardId : undefined,
              awardCard: type === "decide",
              objective: beat.objective,
              tags: [domain.id, domain.subject, domain.cluster].filter(
                (tag): tag is string => Boolean(tag),
              ),
            });
          }}
        />
      </PlayerFrame>
    </div>
  );
}

function typeLabel(type: LearnBeatType | PathBeat["kind"]) {
  if (type === "see") return "See";
  if (type === "try") return "Try";
  if (type === "name") return "Name";
  if (type === "contrast") return "Contrast";
  if (type === "decide") return "Decide";
  if (type === "lock" || type === "recap") return "Lock";
  if (type === "tip") return "Watch";
  return "Hook";
}

function BeatView({
  beat,
  onCheck,
}: {
  beat: PathBeat;
  onCheck: (correct: boolean, checkId: string, spoken?: string) => void;
}) {
  const type = beatType(beat);
  if (beat.check) {
    return (
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{typeLabel(type)}</p>
        {beat.iCan ? <p className="text-sm text-muted">I can {beat.iCan}.</p> : null}
        <CheckPlay
          key={beat.check.id}
          check={beat.check}
          onResolved={(correct, spoken) => onCheck(correct, beat.check!.id, spoken)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {beat.figure ? (
        <TeachFigure figure={beat.figure} />
      ) : beat.diagram ? (
        <div className="text-accent">
          <PathDiagram id={beat.diagram} />
        </div>
      ) : null}
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {typeLabel(type)}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-balance">{beat.title}</h2>
      {beat.iCan ? <p className="text-sm text-muted">I can {beat.iCan}.</p> : null}
      {type === "lock" && beat.lockLine ? (
        <p className="rounded-2xl border border-accent/30 bg-accent-dim/40 px-4 py-3 text-base font-medium leading-7">
          {beat.lockLine}
        </p>
      ) : null}
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
  const { progress } = useProgress();
  const suggested = suggestedProjectForPath(
    domain.id,
    progress.completedProjects ?? [],
    domain.subject,
  );
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
    <div className="grid gap-2">
      {suggested ? (
        <Link
          href={projectHref(suggested)}
          className="rounded-2xl border border-accent/30 bg-accent-dim/40 px-4 py-3.5 text-center hover:border-accent/50"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Suggested project</p>
          <p className="mt-1 text-sm font-semibold">{suggested.title}</p>
          <p className="mt-0.5 text-xs text-muted">{suggested.blurb}</p>
        </Link>
      ) : null}
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
    </div>
  );
}
