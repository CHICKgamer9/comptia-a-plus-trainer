"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  emptyProgress,
  getProgressSnapshot,
  getServerProgressSnapshot,
  parseProgress,
  saveProgress,
  subscribeProgress,
  type ProgressState,
} from "@/lib/progress";
import { domains, quizzes, scenarios } from "@/content";

interface ProgressContextValue {
  ready: boolean;
  progress: ProgressState;
  markLessonComplete: (lessonId: string) => void;
  recordQuiz: (quizId: string, score: number, total: number) => void;
  recordScenario: (scenarioId: string, score: number, total: number) => void;
  resetProgress: () => void;
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
    scenariosTotal: number;
    percent: number;
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
  const ready = true;

  const markLessonComplete = useCallback((lessonId: string) => {
    const prev = loadCurrent();
    saveProgress({
      ...prev,
      lastLessonId: lessonId,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId],
    });
  }, []);

  const recordQuiz = useCallback((quizId: string, score: number, total: number) => {
    const prev = loadCurrent();
    const existing = prev.quizScores[quizId];
    const keepExisting = existing && existing.score >= score;
    saveProgress({
      ...prev,
      lastQuizId: quizId,
      quizScores: {
        ...prev.quizScores,
        [quizId]: keepExisting ? existing : { score, total, at: Date.now() },
      },
    });
  }, []);

  const recordScenario = useCallback(
    (scenarioId: string, score: number, total: number) => {
      const prev = loadCurrent();
      const existing = prev.scenarioScores[scenarioId];
      const keepExisting = existing && existing.score >= score;
      saveProgress({
        ...prev,
        lastScenarioId: scenarioId,
        scenarioScores: {
          ...prev.scenarioScores,
          [scenarioId]: keepExisting
            ? existing
            : { score, total, at: Date.now() },
        },
      });
    },
    [],
  );

  const resetProgress = useCallback(() => {
    saveProgress(emptyProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const lessonsTotal = domains.length;
    const lessonsDone = progress.completedLessons.filter((id) =>
      domains.some((domain) => domain.lessonId === id),
    ).length;
    const quizzesDone = Object.keys(progress.quizScores).filter((id) =>
      quizzes.some((quiz) => quiz.id === id),
    ).length;
    const scenariosDone = Object.keys(progress.scenarioScores).filter((id) =>
      scenarios.some((scenario) => scenario.id === id),
    ).length;
    const totalUnits = lessonsTotal + quizzes.length + scenarios.length;
    const doneUnits = lessonsDone + quizzesDone + scenariosDone;
    return {
      ready,
      progress,
      markLessonComplete,
      recordQuiz,
      recordScenario,
      resetProgress,
      lessonDone: (lessonId) => progress.completedLessons.includes(lessonId),
      quizBest: (quizId) => progress.quizScores[quizId],
      scenarioBest: (scenarioId) => progress.scenarioScores[scenarioId],
      stats: {
        lessonsDone,
        lessonsTotal,
        quizzesDone,
        quizzesTotal: quizzes.length,
        scenariosDone,
        scenariosTotal: scenarios.length,
        percent: totalUnits === 0 ? 0 : Math.round((doneUnits / totalUnits) * 100),
      },
    };
  }, [
    ready,
    progress,
    markLessonComplete,
    recordQuiz,
    recordScenario,
    resetProgress,
  ]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

function loadCurrent(): ProgressState {
  return parseProgress(getProgressSnapshot());
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
}
