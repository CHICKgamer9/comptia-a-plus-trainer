import { domains } from "@/content/registry";
import {
  EXAM_OBJECTIVES,
  QUIZ_PASS_RATIO,
  READY_WINDOW_MS,
  objectivesForExam,
  weightsForTrack,
} from "@/content/objectives";
import type { ExamId } from "@/content/types";
import { quizzes } from "@/content/quizzes";
import { examCore, trackForExam } from "@/lib/exam";
import type { ProgressState } from "./progress";

export type ReadyStatus = "Not ready" | "Getting there" | "Almost" | "Exam-ready";

export interface Gap {
  text: string;
  href: string;
}

export interface ExamReadiness {
  exam: ExamId | "both";
  label: string;
  percent: number;
  status: ReadyStatus;
  gatesPassed: boolean;
  parts: {
    [key: string]: { percent: number; detail: string };
  };
  gaps: Gap[];
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function statusFor(percent: number): ReadyStatus {
  if (percent >= 85) return "Exam-ready";
  if (percent >= 65) return "Almost";
  if (percent >= 40) return "Getting there";
  return "Not ready";
}

function inWindow(at: number | undefined, now: number) {
  return typeof at === "number" && now - at <= READY_WINDOW_MS;
}

function quizPassedRecently(progress: ProgressState, quizId: string, now: number) {
  const history = progress.quizHistory?.[quizId] ?? [];
  const best = progress.quizScores[quizId];
  const rows = history.length ? history : best ? [best] : [];
  return rows.some(
    (row) =>
      inWindow(row.at, now) && row.total > 0 && row.score / row.total >= QUIZ_PASS_RATIO,
  );
}

function objectivePassed(
  progress: ProgressState,
  objectiveId: string,
  quizId: string | undefined,
  now: number,
) {
  if (inWindow(progress.objectivePassedAt?.[objectiveId], now)) return true;
  if (quizId && quizPassedRecently(progress, quizId, now)) return true;
  return false;
}

export function examReadiness(progress: ProgressState, exam: ExamId): ExamReadiness {
  const now = Date.now();
  const track = trackForExam(exam);
  const weights = weightsForTrack(track).filter((row) => row.exam === exam);
  const objectives = objectivesForExam(exam);
  const parts: ExamReadiness["parts"] = {};
  const gaps: Gap[] = [];
  let weighted = 0;

  for (const weight of weights) {
    const domain = domains.find((item) => item.id === weight.domainId && item.subject === "tech");
    const domainObjectives = objectives.filter((item) => item.domainId === weight.domainId);
    const passedCount = domainObjectives.filter((item) =>
      objectivePassed(progress, item.id, domain?.quizId, now),
    ).length;
    const ratio = domainObjectives.length ? passedCount / domainObjectives.length : 0;
    const percent = clamp(ratio * 100);
    weighted += ratio * weight.percent;
    parts[weight.title] = {
      percent,
      detail: `${passedCount}/${domainObjectives.length} objectives · last 14 days · ${weight.percent}% of exam`,
    };
    if (ratio < 1 && domain) {
      gaps.push({
        text: `${weight.title}: ${passedCount}/${domainObjectives.length} objectives with a passed quiz in 14 days`,
        href: `/practice/${domain.quizId}`,
      });
    }
  }

  const percent = clamp(weighted);
  const allCovered = objectives.every((item) => {
    const domain = domains.find((row) => row.id === item.domainId && row.subject === "tech");
    return objectivePassed(progress, item.id, domain?.quizId, now);
  });

  return {
    exam,
    label: `${examCore(exam) === 1 ? "Core 1" : "Core 2"} (${exam})`,
    percent,
    status: statusFor(percent),
    gatesPassed: allCovered && percent >= 85,
    parts,
    gaps: gaps.slice(0, 5),
  };
}

export function overallReadiness(progress: ProgressState, track = trackForExam("220-1201")): ExamReadiness {
  const core1Id = track === "v14" ? "220-1101" : "220-1201";
  const core2Id = track === "v14" ? "220-1102" : "220-1202";
  const core1 = examReadiness(progress, core1Id as ExamId);
  const core2 = examReadiness(progress, core2Id as ExamId);
  const percent = clamp((core1.percent + core2.percent) / 2);
  return {
    exam: "both",
    label: "Both cores",
    percent,
    status: statusFor(percent),
    gatesPassed: core1.gatesPassed && core2.gatesPassed,
    parts: {
      "Core 1": { percent: core1.percent, detail: core1.label },
      "Core 2": { percent: core2.percent, detail: core2.label },
    },
    gaps: [...core1.gaps, ...core2.gaps].slice(0, 5),
  };
}

export function markObjectivesFromQuiz(
  prev: Record<string, number> | undefined,
  quizId: string,
  exam: ExamId,
  at: number,
): Record<string, number> {
  const quiz = quizzes.find((item) => item.id === quizId);
  const next = { ...(prev ?? {}) };
  const codes = new Set(
    (quiz?.questions ?? []).map((question) => question.objective).filter((code): code is string => Boolean(code)),
  );
  const domain = domains.find((item) => item.quizId === quizId);
  const matching = EXAM_OBJECTIVES.filter((item) => {
    if (domain && item.domainId !== domain.id) return false;
    if (codes.size === 0) return Boolean(domain);
    return codes.has(item.code);
  });
  matching.forEach((item) => {
    next[item.id] = at;
  });
  return next;
}

export function markObjectivesFromDomains(
  prev: Record<string, number> | undefined,
  domainIds: string[],
  exam: ExamId | undefined,
  at: number,
): Record<string, number> {
  const next = { ...(prev ?? {}) };
  EXAM_OBJECTIVES.filter(
    (item) => domainIds.includes(item.domainId) && (!exam || item.exam === exam),
  ).forEach((item) => {
    next[item.id] = at;
  });
  return next;
}

export const READINESS_RUBRIC = [
  "A+ Ready is Tech-hub only. It is the share of exam objectives with a passed quiz in the last 14 days, weighted by official domain percentages — not XP.",
  "A quiz counts as passed at 80% or better. Lab tickets that you close well mark the related domain objectives too.",
  "Default track is 220-1201 / 220-1202. Archive toggle keeps 220-1101 / 220-1102 with V14 weights.",
];
