import type { DomainId, ExamId, ScenarioTheme, SubjectId } from "@/content/types";
import type { LingoLangId } from "@/content/lingo/types";
import { isLingoLangId } from "@/content/lingo/types";
import { isSubjectId } from "@/content/subjects";
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

export interface BrainDayRecord {
  ids: string[];
  answered: string[];
  minutesTarget: number;
  minutesDone: number;
  completed: boolean;
  at: number;
}

export interface BrainFeedState {
  ymd: string;
  cursor: number;
  startedAt: number;
  activeMs: number;
  lastSkipAt?: number;
}

export interface BrainState {
  answeredIds: string[];
  days: Record<string, BrainDayRecord>;
  bestDay?: { ymd: string; minutes: number };
  crosswordSolved: string[];
  feed?: BrainFeedState;
}

export interface BrainAnswerInput {
  id: string;
  ymd: string;
  playlistIds: string[];
  minutes: number;
  minutesTarget: number;
  correct: boolean;
  penalty?: number;
  crossword?: boolean;
}

export interface LingoLangProgress {
  completedNodes: string[];
  lastNodeId?: string;
  cursor?: Record<string, number>;
}

export interface LingoState {
  lastLang?: LingoLangId;
  byLang: Partial<Record<LingoLangId, LingoLangProgress>>;
  correctSteps: string[];
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
  brain?: BrainState;
  lingo?: LingoState;
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

export const emptyBrain = (): BrainState => ({
  answeredIds: [],
  days: {},
  crosswordSolved: [],
});

export const emptyLingoLang = (): LingoLangProgress => ({
  completedNodes: [],
});

export const emptyLingo = (): LingoState => ({
  byLang: {},
  correctSteps: [],
});

function parseLingo(raw: LingoState | undefined): LingoState | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const byLang: LingoState["byLang"] = {};
  const source = raw.byLang ?? {};
  for (const key of Object.keys(source)) {
    if (!isLingoLangId(key)) continue;
    const row = source[key];
    byLang[key] = {
      completedNodes: Array.isArray(row?.completedNodes) ? row.completedNodes.filter((id) => typeof id === "string") : [],
      lastNodeId: typeof row?.lastNodeId === "string" ? row.lastNodeId : undefined,
      cursor: row?.cursor && typeof row.cursor === "object" ? row.cursor : {},
    };
  }
  return {
    lastLang: typeof raw.lastLang === "string" && isLingoLangId(raw.lastLang) ? raw.lastLang : undefined,
    byLang,
    correctSteps: Array.isArray(raw.correctSteps) ? raw.correctSteps.filter((id) => typeof id === "string") : [],
  };
}

function parseFeed(raw: BrainFeedState | undefined): BrainFeedState | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  if (typeof raw.ymd !== "string" || typeof raw.cursor !== "number") return undefined;
  return {
    ymd: raw.ymd,
    cursor: Math.max(0, Math.floor(raw.cursor)),
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : Date.now(),
    activeMs: typeof raw.activeMs === "number" ? Math.max(0, raw.activeMs) : 0,
    lastSkipAt: typeof raw.lastSkipAt === "number" ? raw.lastSkipAt : undefined,
  };
}

export const emptyProgress = (): ProgressState => ({
  completedLessons: [],
  quizScores: {},
  scenarioScores: {},
  quizHistory: {},
  lessonCursor: {},
  autoRead: false,
  game: emptyGame(),
  brain: emptyBrain(),
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
        typeof parsed.lastSubject === "string" && isSubjectId(parsed.lastSubject)
          ? parsed.lastSubject
          : undefined,
      game: parsed.game ? { ...emptyGame(), ...parsed.game } : undefined,
      brain: parsed.brain
        ? {
            ...emptyBrain(),
            ...parsed.brain,
            answeredIds: Array.isArray(parsed.brain.answeredIds) ? parsed.brain.answeredIds : [],
            days: parsed.brain.days ?? {},
            crosswordSolved: Array.isArray(parsed.brain.crosswordSolved)
              ? parsed.brain.crosswordSolved
              : [],
            feed: parseFeed(parsed.brain.feed),
          }
        : undefined,
      lingo: parseLingo(parsed.lingo),
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
  game.xp = Math.max(0, game.xp + xpGain);
  const next: ProgressState = { ...prev, game };
  return finalizeGame(prev, next);
}

function finalizeGame(prev: ProgressState, next: ProgressState): ProgressState {
  const game = { ...(next.game ?? defaultGame()) };
  const brain = next.brain;
  const badges = unlockedBadgeIds({
    completedLessons: next.completedLessons,
    quizScores: next.quizScores,
    scenarioScores: next.scenarioScores,
    streakCount: game.streakCount,
    xp: game.xp,
    brainAnswered: brain?.answeredIds.length ?? 0,
    brainDays: Object.values(brain?.days ?? {}).filter((day) => day.completed).length,
    brainCrosswords: brain?.crosswordSolved.length ?? 0,
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

export function recordBrainAnswerIn(prev: ProgressState, input: BrainAnswerInput): ProgressState {
  const brain: BrainState = { ...(prev.brain ?? emptyBrain()), days: { ...(prev.brain?.days ?? {}) } };
  const already = brain.answeredIds.includes(input.id);
  if (!already) brain.answeredIds = [...brain.answeredIds, input.id];
  if (input.crossword && input.correct && !brain.crosswordSolved.includes(input.id)) {
    brain.crosswordSolved = [...brain.crosswordSolved, input.id];
  }

  const existing = brain.days[input.ymd];
  const ids = existing?.ids?.length ? existing.ids : input.playlistIds;
  const answered = existing?.answered ?? [];
  const onPlaylist = ids.includes(input.id);
  const nextAnswered = onPlaylist && !answered.includes(input.id) ? [...answered, input.id] : answered;
  let minutesDone = existing?.minutesDone ?? 0;
  if (onPlaylist && !answered.includes(input.id)) minutesDone += input.minutes;
  const minutesTarget = existing?.minutesTarget ?? input.minutesTarget;
  const wasComplete = existing?.completed ?? false;
  const completed = wasComplete || minutesDone >= minutesTarget;
  brain.days[input.ymd] = {
    ids,
    answered: nextAnswered,
    minutesTarget,
    minutesDone,
    completed,
    at: existing?.at ?? Date.now(),
  };
  if (!brain.bestDay || minutesDone > brain.bestDay.minutes) {
    brain.bestDay = { ymd: input.ymd, minutes: minutesDone };
  }

  let xpGain = input.correct ? XP.brainCorrect : XP.brainWrong;
  if (input.crossword && input.correct) xpGain += XP.brainCrossword;
  xpGain += input.penalty ?? 0;
  if (completed && !wasComplete) xpGain += XP.brainDayComplete;

  return withActivity({ ...prev, brain }, xpGain);
}

export function saveBrainFeedIn(prev: ProgressState, feed: BrainFeedState): ProgressState {
  const brain: BrainState = { ...(prev.brain ?? emptyBrain()), feed };
  return { ...prev, brain };
}

export function recordBrainSkipIn(
  prev: ProgressState,
  feed: BrainFeedState,
): ProgressState {
  const brain: BrainState = { ...(prev.brain ?? emptyBrain()), feed };
  return withActivity({ ...prev, brain }, XP.brainSkip);
}

function lingoOf(prev: ProgressState): LingoState {
  const current = prev.lingo ?? emptyLingo();
  return {
    lastLang: current.lastLang,
    byLang: { ...current.byLang },
    correctSteps: [...(current.correctSteps ?? [])],
  };
}

function langRow(lingo: LingoState, lang: LingoLangId): LingoLangProgress {
  const row = lingo.byLang[lang];
  return {
    completedNodes: [...(row?.completedNodes ?? [])],
    lastNodeId: row?.lastNodeId,
    cursor: { ...(row?.cursor ?? {}) },
  };
}

export function saveLingoCursorIn(
  prev: ProgressState,
  lang: LingoLangId,
  nodeId: string,
  index: number,
): ProgressState {
  const lingo = lingoOf(prev);
  const row = langRow(lingo, lang);
  row.lastNodeId = nodeId;
  const cursor = row.cursor ?? {};
  cursor[nodeId] = Math.max(0, Math.floor(index));
  row.cursor = cursor;
  lingo.byLang[lang] = row;
  lingo.lastLang = lang;
  return { ...prev, lingo };
}

export function recordLingoStepIn(
  prev: ProgressState,
  input: { lang: LingoLangId; nodeId: string; stepId: string; correct: boolean; speak?: boolean },
): ProgressState {
  const lingo = lingoOf(prev);
  const row = langRow(lingo, input.lang);
  row.lastNodeId = input.nodeId;
  lingo.byLang[input.lang] = row;
  lingo.lastLang = input.lang;
  const first = input.correct && !lingo.correctSteps.includes(input.stepId);
  if (first) lingo.correctSteps = [...lingo.correctSteps, input.stepId];
  let xpGain = input.correct
    ? first
      ? input.speak
        ? XP.lingoSpeak
        : XP.lingoCorrectFirst
      : XP.lingoCorrectRepeat
    : XP.lingoWrong;
  if (input.speak && first) xpGain = XP.lingoSpeak;
  return withActivity({ ...prev, lingo }, xpGain);
}

export function completeLingoNodeIn(
  prev: ProgressState,
  lang: LingoLangId,
  nodeId: string,
): ProgressState {
  const lingo = lingoOf(prev);
  const row = langRow(lingo, lang);
  const already = row.completedNodes.includes(nodeId);
  row.lastNodeId = nodeId;
  if (!already) row.completedNodes = [...row.completedNodes, nodeId];
  lingo.byLang[lang] = row;
  lingo.lastLang = lang;
  const next = { ...prev, lingo };
  return already ? next : withActivity(next, XP.lingoLesson);
}

export function mutateProgress(mutator: (prev: ProgressState) => ProgressState) {
  const next = mutator(loadProgress());
  saveProgress(next);
  return next;
}
