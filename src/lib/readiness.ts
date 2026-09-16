import { domains } from "@/content/registry";
import type { DomainId, ExamId, ScenarioTheme } from "@/content/types";
import type { ProgressState, ScenarioResult } from "./progress";
import { LEGACY_TICKET_META } from "./legacy-tickets";

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
    lessons: { percent: number; detail: string };
    quizzes: { percent: number; detail: string };
    lab: { percent: number; detail: string };
    coverage: { percent: number; detail: string };
  };
  gaps: Gap[];
}

const WEIGHTS = { lessons: 0.3, quizzes: 0.35, lab: 0.25, coverage: 0.1 };

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function statusFor(percent: number, gatesPassed: boolean): ReadyStatus {
  if (gatesPassed && percent >= 85) return "Exam-ready";
  if (percent >= 65) return "Almost";
  if (percent >= 40) return "Getting there";
  return "Not ready";
}

function recencyAccuracy(
  history: { score: number; total: number }[] | undefined,
  best: { score: number; total: number } | undefined,
): number | null {
  const attempts = history && history.length ? history : best ? [best] : [];
  if (!attempts.length) return null;
  const last = attempts[attempts.length - 1];
  const prev = attempts[attempts.length - 2];
  const lastPct = last.total ? last.score / last.total : 0;
  if (!prev) return lastPct;
  const prevPct = prev.total ? prev.score / prev.total : 0;
  return lastPct * 0.7 + prevPct * 0.3;
}

function ticketMeta(
  id: string,
  row: ScenarioResult,
): { exam: ExamId; theme?: ScenarioTheme; domainIds: DomainId[] } | null {
  if (row.exam) {
    return {
      exam: row.exam,
      theme: row.theme,
      domainIds: row.domainIds ?? [],
    };
  }
  const legacy = LEGACY_TICKET_META[id];
  if (legacy) return legacy;
  return null;
}

function labForExam(progress: ProgressState, exam: ExamId) {
  const rows = Object.entries(progress.scenarioScores)
    .map(([id, row]) => ({ id, row, meta: ticketMeta(id, row) }))
    .filter((item) => item.meta?.exam === exam);
  const minTickets = exam === "220-1101" ? 4 : 3;
  const avg =
    rows.length === 0
      ? 0
      : rows.reduce(
          (sum, item) =>
            sum + (item.row.total ? item.row.score / item.row.total : 0),
          0,
        ) / rows.length;
  const clean = rows.filter(
    (item) => item.row.total > 0 && item.row.score === item.row.total,
  ).length;
  const countScore = Math.min(1, rows.length / minTickets);
  const avgScore = avg;
  const cleanScore = Math.min(1, clean / 1);
  const percent = clamp((countScore * 0.45 + avgScore * 0.4 + cleanScore * 0.15) * 100);
  return {
    percent,
    count: rows.length,
    minTickets,
    avg,
    clean,
    rows,
  };
}

export function examReadiness(
  progress: ProgressState,
  exam: ExamId,
): ExamReadiness {
  const examDomains = domains.filter((domain) => domain.exam === exam);
  const lessonsDone = examDomains.filter((domain) =>
    progress.completedLessons.includes(domain.lessonId),
  ).length;
  const lessonPct = clamp((lessonsDone / examDomains.length) * 100);

  const quizAccuracies = examDomains.map((domain) => {
    const acc = recencyAccuracy(
      progress.quizHistory?.[domain.quizId],
      progress.quizScores[domain.quizId],
    );
    return { domain, acc };
  });
  const taken = quizAccuracies.filter((row) => row.acc !== null);
  const meanAcc =
    taken.length === 0
      ? 0
      : taken.reduce((sum, row) => sum + (row.acc as number), 0) / taken.length;
  const quizCoverage = taken.length / examDomains.length;
  const quizPct = clamp(meanAcc * 100 * (0.7 + 0.3 * quizCoverage));

  const lab = labForExam(progress, exam);

  const cold = examDomains.filter((domain) => {
    const lesson = progress.completedLessons.includes(domain.lessonId);
    const quiz = Boolean(progress.quizScores[domain.quizId]);
    const ticket = lab.rows.some((row) =>
      row.meta?.domainIds.includes(domain.id),
    );
    return !lesson && !quiz && !ticket;
  });
  const coveragePct = clamp(
    ((examDomains.length - cold.length) / examDomains.length) * 100,
  );

  const weighted =
    lessonPct * WEIGHTS.lessons +
    quizPct * WEIGHTS.quizzes +
    lab.percent * WEIGHTS.lab +
    coveragePct * WEIGHTS.coverage;

  const allLessons = lessonsDone === examDomains.length;
  const allQuizzes = taken.length === examDomains.length;
  const quizBar = meanAcc >= 0.8 && allQuizzes;
  const labBar =
    lab.count >= lab.minTickets && lab.avg >= 0.75 && lab.clean >= 1;
  const noCold = cold.length === 0;
  const gatesPassed = allLessons && quizBar && labBar && noCold;
  const percent = gatesPassed ? clamp(weighted) : clamp(Math.min(84, weighted));

  const gaps: Gap[] = [];
  examDomains.forEach((domain) => {
    if (!progress.completedLessons.includes(domain.lessonId)) {
      gaps.push({
        text: `${domain.title} lesson not finished`,
        href: `/learn/tech/${domain.id}`,
      });
    }
  });
  quizAccuracies.forEach((row) => {
    if (row.acc === null) {
      gaps.push({
        text: `${row.domain.title} quiz not taken`,
        href: `/practice/${row.domain.quizId}`,
      });
    } else if (row.acc < 0.8) {
      gaps.push({
        text: `${row.domain.title} quiz under 80% (${Math.round(row.acc * 100)}%)`,
        href: `/practice/${row.domain.quizId}`,
      });
    }
  });
  if (lab.count === 0) {
    gaps.push({
      text: `0 ${exam === "220-1101" ? "Core 1" : "Core 2"} tickets closed`,
      href: `/lab?exam=${exam}`,
    });
  } else if (lab.count < lab.minTickets) {
    gaps.push({
      text: `Only ${lab.count}/${lab.minTickets} ${exam === "220-1101" ? "Core 1" : "Core 2"} tickets closed`,
      href: `/lab?exam=${exam}`,
    });
  } else if (lab.avg < 0.75) {
    gaps.push({
      text: `Lab average ${Math.round(lab.avg * 100)}% — need 75%+`,
      href: `/lab?exam=${exam}`,
    });
  } else if (lab.clean < 1) {
    gaps.push({
      text: "No clean (100%) ticket close yet",
      href: `/lab?exam=${exam}`,
    });
  }
  cold.forEach((domain) => {
    gaps.push({
      text: `${domain.title} is still cold — no lesson, quiz, or ticket`,
      href: `/learn/tech/${domain.id}`,
    });
  });

  return {
    exam,
    label: exam === "220-1101" ? "Core 1 (220-1101)" : "Core 2 (220-1102)",
    percent,
    status: statusFor(percent, gatesPassed),
    gatesPassed,
    parts: {
      lessons: {
        percent: lessonPct,
        detail: `${lessonsDone}/${examDomains.length} lessons`,
      },
      quizzes: {
        percent: quizPct,
        detail:
          taken.length === 0
            ? "No quizzes yet"
            : `${Math.round(meanAcc * 100)}% recency-weighted · ${taken.length}/${examDomains.length} taken`,
      },
      lab: {
        percent: lab.percent,
        detail: `${lab.count} tickets · avg ${Math.round(lab.avg * 100)}% · ${lab.clean} clean`,
      },
      coverage: {
        percent: coveragePct,
        detail:
          cold.length === 0
            ? "Every domain has some practice"
            : `${cold.length} domain${cold.length === 1 ? "" : "s"} untouched`,
      },
    },
    gaps: gaps.slice(0, 3),
  };
}

export function overallReadiness(progress: ProgressState): ExamReadiness {
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");
  const percent = clamp((core1.percent + core2.percent) / 2);
  const gatesPassed = core1.gatesPassed && core2.gatesPassed;
  const gaps = [...core1.gaps, ...core2.gaps].slice(0, 3);
  return {
    exam: "both",
    label: "Both cores",
    percent: gatesPassed ? percent : clamp(Math.min(84, percent)),
    status: statusFor(percent, gatesPassed),
    gatesPassed,
    parts: {
      lessons: {
        percent: clamp((core1.parts.lessons.percent + core2.parts.lessons.percent) / 2),
        detail: "Average of Core 1 and Core 2 lesson completion",
      },
      quizzes: {
        percent: clamp((core1.parts.quizzes.percent + core2.parts.quizzes.percent) / 2),
        detail: "Average of Core 1 and Core 2 quiz readiness",
      },
      lab: {
        percent: clamp((core1.parts.lab.percent + core2.parts.lab.percent) / 2),
        detail: "Average of Core 1 and Core 2 lab practice",
      },
      coverage: {
        percent: clamp(
          (core1.parts.coverage.percent + core2.parts.coverage.percent) / 2,
        ),
        detail: "Both exams need every domain touched",
      },
    },
    gaps,
  };
}

export const READINESS_RUBRIC = [
  "Lessons 30% · Quizzes 35% (recent attempt weighted 70%) · Lab 25% · Domain coverage 10%.",
  "Exam-ready is gated: every domain lesson done, every domain quiz ≥ 80% (recency-weighted), enough tickets (Core 1: 4, Core 2: 3) at ≥ 75% average with at least one clean close, and no untouched domain.",
  "If those gates fail, the meter will not say Exam-ready — even if the weighted % looks high.",
];
