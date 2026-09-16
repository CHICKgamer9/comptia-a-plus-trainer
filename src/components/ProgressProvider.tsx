"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  emptyProgress,
  getProgressSnapshot,
  getServerProgressSnapshot,
  markLessonCompleteIn,
  mutateProgress,
  parseProgress,
  recordBrainAnswerIn,
  recordQuizAnswerIn,
  recordQuizIn,
  recordScenarioIn,
  saveLessonCursorIn,
  saveProgress,
  setAutoReadIn,
  setLastSubjectIn,
  subscribeProgress,
  type BrainAnswerInput,
  type ProgressState,
  type ScenarioResult,
} from "@/lib/progress";
import { domains } from "@/content/registry";
import type { SubjectId } from "@/content/types";
import { levelForXp } from "@/lib/xp";
import { overallReadiness } from "@/lib/readiness";
import { clearTickets } from "@/lib/ticket-store";

interface ProgressContextValue {
  ready: boolean;
  progress: ProgressState;
  markLessonComplete: (lessonId: string) => void;
  saveLessonCursor: (lessonId: string, index: number) => void;
  recordQuizAnswer: (questionId: string, correct: boolean) => void;
  recordQuiz: (quizId: string, score: number, total: number) => void;
  recordScenario: (scenarioId: string, result: ScenarioResult) => void;
  recordBrainAnswer: (input: BrainAnswerInput) => void;
  resetProgress: () => void;
  setAutoRead: (autoRead: boolean) => void;
  setLastSubject: (subject: SubjectId) => void;
  lessonDone: (lessonId: string) => boolean;
  quizBest: (quizId: string) => { score: number; total: number } | undefined;
  scenarioBest: (
    scenarioId: string,
  ) => { score: number; total: number } | undefined;
  stats: {
    lessonsDone: number;
    lessonsTotal: number;
    quizzesDone: number;
    quizzesTotal: number;
    scenariosDone: number;
    percent: number;
    xp: number;
    levelTitle: string;
    levelPercent: number;
    nextTitle?: string;
    nextAt?: number;
    streak: number;
  };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const progress = useMemo(() => parseProgress(raw), [raw]);

  const markLessonComplete = useCallback((lessonId: string) => {
    const domain = domains.find((item) => item.lessonId === lessonId);
    mutateProgress((prev) => {
      const next = markLessonCompleteIn(prev, lessonId);
      return domain ? setLastSubjectIn(next, domain.subject) : next;
    });
  }, []);

  const saveLessonCursor = useCallback((lessonId: string, index: number) => {
    mutateProgress((prev) => saveLessonCursorIn(prev, lessonId, index));
  }, []);

  const recordQuizAnswer = useCallback((questionId: string, correct: boolean) => {
    mutateProgress((prev) => recordQuizAnswerIn(prev, questionId, correct));
  }, []);

  const recordQuiz = useCallback((quizId: string, score: number, total: number) => {
    const domain = domains.find((item) => item.quizId === quizId);
    mutateProgress((prev) => {
      const next = recordQuizIn(prev, quizId, score, total);
      return domain ? setLastSubjectIn(next, domain.subject) : next;
    });
  }, []);

  const recordScenario = useCallback(
    (scenarioId: string, result: ScenarioResult) => {
      mutateProgress((prev) => recordScenarioIn(prev, scenarioId, result));
    },
    [],
  );

  const recordBrainAnswer = useCallback((input: BrainAnswerInput) => {
    mutateProgress((prev) => recordBrainAnswerIn(prev, input));
  }, []);

  const resetProgress = useCallback(() => {
    saveProgress(emptyProgress());
    clearTickets();
  }, []);

  const setAutoRead = useCallback((autoRead: boolean) => {
    mutateProgress((prev) => setAutoReadIn(prev, autoRead));
  }, []);

  const setLastSubject = useCallback((subject: SubjectId) => {
    mutateProgress((prev) => setLastSubjectIn(prev, subject));
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const lessonsTotal = domains.length;
    const lessonsDone = progress.completedLessons.filter((id) =>
      domains.some((domain) => domain.lessonId === id),
    ).length;
    const quizzesDone = Object.keys(progress.quizScores).filter((id) =>
      domains.some((domain) => domain.quizId === id),
    ).length;
    const scenariosDone = Object.keys(progress.scenarioScores).length;
    const xp = progress.game?.xp ?? 0;
    const level = levelForXp(xp);
    const both = overallReadiness(progress);
    return {
      ready: true,
      progress,
      markLessonComplete,
      saveLessonCursor,
      recordQuizAnswer,
      recordQuiz,
      recordScenario,
      recordBrainAnswer,
      resetProgress,
      setAutoRead,
      setLastSubject,
      lessonDone: (lessonId) => progress.completedLessons.includes(lessonId),
      quizBest: (quizId) => progress.quizScores[quizId],
      scenarioBest: (scenarioId) => progress.scenarioScores[scenarioId],
      stats: {
        lessonsDone,
        lessonsTotal,
        quizzesDone,
        quizzesTotal: domains.length,
        scenariosDone,
        percent: both.percent,
        xp,
        levelTitle: level.title,
        levelPercent: level.percent,
        nextTitle: level.nextTitle,
        nextAt: level.nextAt,
        streak: progress.game?.streakCount ?? 0,
      },
    };
  }, [
    progress,
    markLessonComplete,
    saveLessonCursor,
    recordQuizAnswer,
    recordQuiz,
    recordScenario,
    recordBrainAnswer,
    resetProgress,
    setAutoRead,
    setLastSubject,
  ]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
}
