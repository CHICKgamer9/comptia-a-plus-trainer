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
  recordBrainSkipIn,
  recordLingoStepIn,
  completeLingoNodeIn,
  saveLingoCursorIn,
  recordQuizAnswerIn,
  recordQuizIn,
  recordScenarioIn,
  saveBrainFeedIn,
  saveLessonCursorIn,
  saveProgress,
  setAutoReadIn,
  setLastSubjectIn,
  subscribeProgress,
  toggleProjectCheckIn,
  markProjectCompleteIn,
  startDeskShiftIn,
  closeDeskShiftIn,
  openNightPackIn,
  slotBenchCardIn,
  setLoadoutIn,
  fuseCardsIn,
  type BrainAnswerInput,
  type BrainFeedState,
  type PathAnswerContext,
  type ProgressState,
  type ScenarioResult,
} from "@/lib/progress";
import { emptyBench, type BenchState } from "@/lib/binder";
import { domains } from "@/content/registry";
import { projects } from "@/content/projects";
import type { BenchSlot, SubjectId } from "@/content/types";
import type { LingoLangId } from "@/content/lingo/types";
import { levelForXp } from "@/lib/xp";
import { overallReadiness } from "@/lib/readiness";
import { clearTickets } from "@/lib/ticket-store";

interface ProgressContextValue {
  ready: boolean;
  progress: ProgressState;
  bench: BenchState;
  markLessonComplete: (lessonId: string) => void;
  saveLessonCursor: (lessonId: string, index: number) => void;
  recordQuizAnswer: (questionId: string, correct: boolean, ctx?: PathAnswerContext) => void;
  recordQuiz: (quizId: string, score: number, total: number) => void;
  recordScenario: (scenarioId: string, result: ScenarioResult) => void;
  recordBrainAnswer: (input: BrainAnswerInput) => void;
  saveBrainFeed: (feed: BrainFeedState) => void;
  recordBrainSkip: (feed: BrainFeedState) => void;
  recordLingoStep: (input: {
    lang: LingoLangId;
    nodeId: string;
    stepId: string;
    correct: boolean;
    speak?: boolean;
  }) => void;
  completeLingoNode: (lang: LingoLangId, nodeId: string) => void;
  saveLingoCursor: (lang: LingoLangId, nodeId: string, index: number) => void;
  toggleProjectCheck: (projectId: string, checkId: string) => void;
  markProjectComplete: (projectId: string, xp?: number) => void;
  startDeskShift: (lengthMin: 8 | 15 | 25) => void;
  closeDeskShift: (early?: boolean) => void;
  openNightPack: () => void;
  slotBenchCard: (slot: BenchSlot, cardId: string | undefined) => void;
  setLoadout: (loadout: BenchState["loadout"]) => void;
  fuseCards: (recipeId: string) => void;
  resetProgress: () => void;
  setAutoRead: (autoRead: boolean) => void;
  setLastSubject: (subject: SubjectId) => void;
  lessonDone: (lessonId: string) => boolean;
  projectDone: (projectId: string) => boolean;
  projectChecked: (projectId: string) => string[];
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
    projectsDone: number;
    projectsTotal: number;
    percent: number;
    xp: number;
    levelTitle: string;
    levelPercent: number;
    nextTitle?: string;
    nextAt?: number;
    streak: number;
    cardsOwned: number;
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

  const recordQuizAnswer = useCallback((questionId: string, correct: boolean, ctx?: PathAnswerContext) => {
    mutateProgress((prev) => recordQuizAnswerIn(prev, questionId, correct, ctx));
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

  const saveBrainFeed = useCallback((feed: BrainFeedState) => {
    mutateProgress((prev) => saveBrainFeedIn(prev, feed));
  }, []);

  const recordBrainSkip = useCallback((feed: BrainFeedState) => {
    mutateProgress((prev) => recordBrainSkipIn(prev, feed));
  }, []);

  const recordLingoStep = useCallback(
    (input: {
      lang: LingoLangId;
      nodeId: string;
      stepId: string;
      correct: boolean;
      speak?: boolean;
    }) => {
      mutateProgress((prev) => recordLingoStepIn(prev, input));
    },
    [],
  );

  const completeLingoNode = useCallback((lang: LingoLangId, nodeId: string) => {
    mutateProgress((prev) => completeLingoNodeIn(prev, lang, nodeId));
  }, []);

  const saveLingoCursor = useCallback((lang: LingoLangId, nodeId: string, index: number) => {
    mutateProgress((prev) => saveLingoCursorIn(prev, lang, nodeId, index));
  }, []);

  const toggleProjectCheck = useCallback((projectId: string, checkId: string) => {
    const project = projects.find((item) => item.id === projectId);
    mutateProgress((prev) => {
      const next = toggleProjectCheckIn(prev, projectId, checkId);
      return project ? setLastSubjectIn(next, project.subject) : next;
    });
  }, []);

  const markProjectComplete = useCallback((projectId: string, xp?: number) => {
    const project = projects.find((item) => item.id === projectId);
    mutateProgress((prev) => {
      const next = markProjectCompleteIn(prev, projectId, xp ?? project?.xp);
      return project ? setLastSubjectIn(next, project.subject) : next;
    });
  }, []);

  const startDeskShift = useCallback((lengthMin: 8 | 15 | 25) => {
    mutateProgress((prev) => startDeskShiftIn(prev, lengthMin));
  }, []);

  const closeDeskShift = useCallback((early = false) => {
    mutateProgress((prev) => closeDeskShiftIn(prev, early));
  }, []);

  const openNightPack = useCallback(() => {
    mutateProgress((prev) => openNightPackIn(prev));
  }, []);

  const slotBenchCard = useCallback((slot: BenchSlot, cardId: string | undefined) => {
    mutateProgress((prev) => slotBenchCardIn(prev, slot, cardId));
  }, []);

  const setLoadout = useCallback((loadout: BenchState["loadout"]) => {
    mutateProgress((prev) => setLoadoutIn(prev, loadout));
  }, []);

  const fuseCards = useCallback((recipeId: string) => {
    mutateProgress((prev) => fuseCardsIn(prev, recipeId));
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
    const completedProjects = progress.completedProjects ?? [];
    const projectsDone = completedProjects.filter((id) =>
      projects.some((project) => project.id === id),
    ).length;
    const xp = progress.game?.xp ?? 0;
    const level = levelForXp(xp);
    const both = overallReadiness(progress);
    const bench = progress.bench ?? emptyBench();
    return {
      ready: true,
      progress,
      bench,
      markLessonComplete,
      saveLessonCursor,
      recordQuizAnswer,
      recordQuiz,
      recordScenario,
      recordBrainAnswer,
      saveBrainFeed,
      recordBrainSkip,
      recordLingoStep,
      completeLingoNode,
      saveLingoCursor,
      toggleProjectCheck,
      markProjectComplete,
      startDeskShift,
      closeDeskShift,
      openNightPack,
      slotBenchCard,
      setLoadout,
      fuseCards,
      resetProgress,
      setAutoRead,
      setLastSubject,
      lessonDone: (lessonId) => progress.completedLessons.includes(lessonId),
      projectDone: (projectId) => (progress.completedProjects ?? []).includes(projectId),
      projectChecked: (projectId) => progress.projectChecks?.[projectId] ?? [],
      quizBest: (quizId) => progress.quizScores[quizId],
      scenarioBest: (scenarioId) => progress.scenarioScores[scenarioId],
      stats: {
        lessonsDone,
        lessonsTotal,
        quizzesDone,
        quizzesTotal: domains.length,
        scenariosDone,
        projectsDone,
        projectsTotal: projects.length,
        percent: both.percent,
        xp,
        levelTitle: level.title,
        levelPercent: level.percent,
        nextTitle: level.nextTitle,
        nextAt: level.nextAt,
        streak: progress.game?.streakCount ?? 0,
        cardsOwned: bench.owned.length,
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
    saveBrainFeed,
    recordBrainSkip,
    recordLingoStep,
    completeLingoNode,
    saveLingoCursor,
    toggleProjectCheck,
    markProjectComplete,
    startDeskShift,
    closeDeskShift,
    openNightPack,
    slotBenchCard,
    setLoadout,
    fuseCards,
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
