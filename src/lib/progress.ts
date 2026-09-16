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
}

export interface ProgressState {
  completedLessons: string[];
  quizScores: Record<string, QuizResult>;
  scenarioScores: Record<string, ScenarioResult>;
  lastLessonId?: string;
  lastQuizId?: string;
  lastScenarioId?: string;
}

const listeners = new Set<() => void>();

export const emptyProgress = (): ProgressState => ({
  completedLessons: [],
  quizScores: {},
  scenarioScores: {},
});

export function parseProgress(raw: string): ProgressState {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      quizScores: parsed.quizScores ?? {},
      scenarioScores: parsed.scenarioScores ?? {},
      lastLessonId: parsed.lastLessonId,
      lastQuizId: parsed.lastQuizId,
      lastScenarioId: parsed.lastScenarioId,
    };
  } catch {
    return emptyProgress();
  }
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
