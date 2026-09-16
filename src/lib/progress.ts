import type { DomainId, ExamId, ScenarioTheme, SubjectId } from "@/content/types";
import { unlockedBadgeIds } from "./badges";
import { updateStreak } from "./sydney-date";
import { levelForXp, ticketXp, XP } from "./xp";
import { enqueueToasts, type ToastEvent } from "./toasts";

export const PROGRESS_KEY = "ticketbench-progress-v1";

export interface QuizResult {
  score: number;
  total: number;
  at: number;
}

export interface ScenarioResult {
  score: number;
  total: number;
  at: number;
  exam?: ExamId;
  theme?: ScenarioTheme;
  domainIds?: DomainId[];
}

export interface GameState {
  xp: number;
  lastLevel: number;
  streakCount: number;
  lastSydneyDate: string;
  badges: string[];
  seenBadges: string[];
  correctQuestions: string[];
}

export interface ProgressState {
  completedLessons: string[];
  quizScores: Record<string, QuizResult>;
  scenarioScores: Record<string, ScenarioResult>;
  lastLessonId?: string;
  lastQuizId?: string;
  lastScenarioId?: string;
  quizHistory?: Record<string, QuizResult[]>;
  lessonCursor?: Record<string, number>;
  autoRead?: boolean;
  lastSubject?: SubjectId;
  game?: GameState;
}

const listeners = new Set<() => void>();

export const emptyGame = (): GameState => ({
  xp: 0,
  lastLevel: 0,
  streakCount: 0,
  lastSydneyDate: "",
  badges: [],
  seenBadges: [],
  correctQuestions: [],
});

export const emptyProgress = (): ProgressState => ({
  completedLessons: [],
  quizScores: {},
  scenarioScores: {},
  quizHistory: {},
  lessonCursor: {},
  autoRead: false,
  game: emptyGame(),
});

function defaultGame(): GameState {
  return emptyGame();
}

export function parseProgress(raw: string): ProgressState {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    const base: ProgressState = {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      quizScores: parsed.quizScores ?? {},
      scenarioScores: parsed.scenarioScores ?? {},
      lastLessonId: parsed.lastLessonId,
      lastQuizId: parsed.lastQuizId,
      lastScenarioId: parsed.lastScenarioId,
      quizHistory: parsed.quizHistory ?? {},
      lessonCursor: parsed.lessonCursor ?? {},
      autoRead: parsed.autoRead === true,
      lastSubject:
        parsed.lastSubject === "tech" ||
        parsed.lastSubject === "maths" ||
        parsed.lastSubject === "science" ||
        parsed.lastSubject === "history"
          ? parsed.lastSubject
          : undefined,
      game: parsed.game ? { ...emptyGame(), ...parsed.game } : undefined,
    };
    if (!base.game) {
      return backfillGame(base);
    }
    return base;
  } catch {
    return emptyProgress();
  }
}

function backfillGame(state: ProgressState): ProgressState {
  let xp = state.completedLessons.length * XP.lesson;
  Object.values(state.quizScores).forEach((row) => {
    xp += row.score * XP.quizCorrectRepeat + XP.quizComplete;
    if (row.total && row.score / row.total >= 1) xp += XP.quizPerfect;
    else if (row.total && row.score / row.total >= 0.8) xp += XP.quizHigh;
  });
  Object.values(state.scenarioScores).forEach((row) => {
    xp += ticketXp(row.score, row.total);
  });
  const game: GameState = {
    ...emptyGame(),
    xp,
    lastLevel: levelForXp(xp).index,
    badges: [],
    seenBadges: [],
  };
  const withGame = { ...state, game };
  const badges = unlockedBadgeIds({
    completedLessons: withGame.completedLessons,
    quizScores: withGame.quizScores,
    scenarioScores: withGame.scenarioScores,
    streakCount: 0,
    xp,
  });
  game.badges = badges;
  game.seenBadges = badges;
  return { ...withGame, game };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  return parseProgress(window.localStorage.getItem(PROGRESS_KEY) ?? "");
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressSnapshot() {
  return window.localStorage.getItem(PROGRESS_KEY) ?? "";
}

export function getServerProgressSnapshot() {
  return "";
}

function withActivity(prev: ProgressState, xpGain: number): ProgressState {
  const game = { ...(prev.game ?? defaultGame()) };
  const streak = updateStreak(game.lastSydneyDate || undefined, game.streakCount);
  game.streakCount = streak.count;
  game.lastSydneyDate = streak.lastSydneyDate;
  game.xp += Math.max(0, xpGain);
  const next: ProgressState = { ...prev, game };
  return finalizeGame(prev, next);
}

function finalizeGame(prev: ProgressState, next: ProgressState): ProgressState {
  const game = { ...(next.game ?? defaultGame()) };
  const badges = unlockedBadgeIds({
    completedLessons: next.completedLessons,
    quizScores: next.quizScores,
    scenarioScores: next.scenarioScores,
    streakCount: game.streakCount,
    xp: game.xp,
  });
  const newBadges = badges.filter((id) => !game.badges.includes(id));
  game.badges = badges;
  const level = levelForXp(game.xp);
  const leveled = level.index > game.lastLevel;
  const toasts: ToastEvent[] = [];
  if (leveled) {
    toasts.push({
      id: `level-${level.index}-${Date.now()}`,
      kind: "level",
      title: `Level up · ${level.title}`,
      body: level.nextTitle
        ? `Next: ${level.nextTitle} at ${level.nextAt} XP.`
        : "Top of the board on this device.",
    });
  }
  game.lastLevel = Math.max(game.lastLevel, level.index);
  newBadges.forEach((id) => {
    if (game.seenBadges.includes(id)) return;
    game.seenBadges = [...game.seenBadges, id];
    toasts.push({
      id: `badge-${id}-${Date.now()}`,
      kind: "badge",
      title: "Badge unlocked",
      body: id,
    });
  });
  next.game = game;
  if (toasts.length) enqueueToasts(toasts);
  void prev;
  return next;
}

export function saveLessonCursorIn(
  prev: ProgressState,
  lessonId: string,
  index: number,
): ProgressState {
  return {
    ...prev,
    lastLessonId: lessonId,
    lessonCursor: { ...prev.lessonCursor, [lessonId]: index },
  };
}

export function markLessonCompleteIn(prev: ProgressState, lessonId: string): ProgressState {
  const already = prev.completedLessons.includes(lessonId);
  const next: ProgressState = {
    ...prev,
    lastLessonId: lessonId,
    completedLessons: already
      ? prev.completedLessons
      : [...prev.completedLessons, lessonId],
  };
  return already ? next : withActivity(next, XP.lesson);
}

export function recordQuizAnswerIn(
  prev: ProgressState,
  questionId: string,
  correct: boolean,
): ProgressState {
  const game = { ...(prev.game ?? defaultGame()) };
  const firstCorrect = correct && !game.correctQuestions.includes(questionId);
  if (firstCorrect) {
    game.correctQuestions = [...game.correctQuestions, questionId];
  }
  const xpGain = correct
    ? firstCorrect
      ? XP.quizCorrectFirst
      : XP.quizCorrectRepeat
    : XP.quizWrong;
  return withActivity({ ...prev, game }, xpGain);
}

export function recordQuizIn(
  prev: ProgressState,
  quizId: string,
  score: number,
  total: number,
): ProgressState {
  const existing = prev.quizScores[quizId];
  const keepExisting = existing && existing.score >= score;
  const result: QuizResult = { score, total, at: Date.now() };
  const history = [...(prev.quizHistory?.[quizId] ?? []), result].slice(-5);
  const ratio = total ? score / total : 0;
  let xpGain = XP.quizComplete;
  if (ratio >= 1) xpGain += XP.quizPerfect;
  else if (ratio >= 0.8) xpGain += XP.quizHigh;
  const next: ProgressState = {
    ...prev,
    lastQuizId: quizId,
    quizScores: {
      ...prev.quizScores,
      [quizId]: keepExisting ? existing : result,
    },
    quizHistory: { ...prev.quizHistory, [quizId]: history },
  };
  return withActivity(next, xpGain);
}

export function recordScenarioIn(
  prev: ProgressState,
  scenarioId: string,
  result: ScenarioResult,
): ProgressState {
  const existing = prev.scenarioScores[scenarioId];
  const keepExisting = existing && existing.score >= result.score;
  const next: ProgressState = {
    ...prev,
    lastScenarioId: scenarioId,
    scenarioScores: {
      ...prev.scenarioScores,
      [scenarioId]: keepExisting ? existing : result,
    },
  };
  return withActivity(next, ticketXp(result.score, result.total));
}

export function setAutoReadIn(prev: ProgressState, autoRead: boolean): ProgressState {
  return { ...prev, autoRead };
}

export function setLastSubjectIn(prev: ProgressState, lastSubject: SubjectId): ProgressState {
  return { ...prev, lastSubject };
}

export function mutateProgress(mutator: (prev: ProgressState) => ProgressState) {
  const next = mutator(loadProgress());
  saveProgress(next);
  return next;
}
