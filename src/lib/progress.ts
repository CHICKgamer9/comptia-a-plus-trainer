import type { BenchSlot, DomainId, ExamId, ExamTrack, ScenarioTheme, SubjectId } from "@/content/types";
import type { LingoLangId } from "@/content/lingo/types";
import { isLingoLangId } from "@/content/lingo/types";
import type { BrainCat } from "@/content/brain/types";
import { isSubjectId } from "@/content/subjects";
import { unlockedBadgeIds } from "./badges";
import { updateStreak } from "./sydney-date";
import { levelForXp, ticketXp, XP } from "./xp";
import { markObjectivesFromDomains, markObjectivesFromQuiz } from "./readiness";
import { QUIZ_PASS_RATIO } from "@/content/objectives";
import {
  applyAwards,
  closeShift as closeShiftBench,
  dropFromBrain,
  dropFromLab,
  dropFromPath,
  emptyBench,
  fuse as fuseBench,
  loadoutBonus,
  maybeAwardCrest,
  openNightPack as openNightPackBench,
  parseBench,
  reviewCard as reviewCardBench,
  setLoadout as setLoadoutBench,
  slotCard as slotCardBench,
  startShift as startShiftBench,
  type BenchState,
  type ReviewGrade,
} from "./binder";
import { techDomains } from "@/content/domains";
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
  skipped?: boolean;
  penalty?: number;
  crossword?: boolean;
  cat?: BrainCat;
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
  lastProjectId?: string;
  quizHistory?: Record<string, QuizResult[]>;
  lessonCursor?: Record<string, number>;
  autoRead?: boolean;
  speechMuted?: boolean;
  lastSubject?: SubjectId;
  examTrack?: ExamTrack;
  objectivePassedAt?: Record<string, number>;
  game?: GameState;
  brain?: BrainState;
  lingo?: LingoState;
  projectChecks?: Record<string, string[]>;
  completedProjects?: string[];
  bench?: BenchState;
}

export interface PathAnswerContext {
  domainId?: string;
  subject?: SubjectId;
  conceptId?: string;
  skipped?: boolean;
  cardId?: string;
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
  speechMuted: false,
  game: emptyGame(),
  brain: emptyBrain(),
  projectChecks: {},
  completedProjects: [],
  bench: emptyBench(),
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
      lastProjectId: parsed.lastProjectId,
      quizHistory: parsed.quizHistory ?? {},
      lessonCursor: parsed.lessonCursor ?? {},
      autoRead: parsed.autoRead === true,
      speechMuted: parsed.speechMuted === true,
      lastSubject:
        typeof parsed.lastSubject === "string" && isSubjectId(parsed.lastSubject)
          ? parsed.lastSubject
          : undefined,
      examTrack: parsed.examTrack === "v14" ? "v14" : parsed.examTrack === "v15" ? "v15" : undefined,
      objectivePassedAt:
        parsed.objectivePassedAt && typeof parsed.objectivePassedAt === "object"
          ? Object.fromEntries(
              Object.entries(parsed.objectivePassedAt).filter(
                (entry): entry is [string, number] => typeof entry[1] === "number",
              ),
            )
          : {},
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
      projectChecks:
        parsed.projectChecks && typeof parsed.projectChecks === "object"
          ? Object.fromEntries(
              Object.entries(parsed.projectChecks).filter(
                (entry): entry is [string, string[]] => Array.isArray(entry[1]),
              ),
            )
          : {},
      completedProjects: Array.isArray(parsed.completedProjects) ? parsed.completedProjects : [],
      bench: parseBench(parsed.bench),
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
    completedProjects: next.completedProjects ?? [],
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
  const withXp = already ? next : withActivity(next, XP.lesson);
  if (already || !lessonId.endsWith("-start-essentials")) return withCrests(withXp);
  const subjectId = lessonId.replace(/-start-essentials$/, "");
  if (!isSubjectId(subjectId)) return withCrests(withXp);
  const bench = withXp.bench ?? emptyBench();
  if (bench.owned.length) return withCrests(withXp);
  const drop = dropFromPath(bench, {
    correct: true,
    domainId: `${subjectId}-start`,
    subject: subjectId,
    conceptId: `${subjectId}-start-complete`,
  });
  return withCrests({ ...withXp, bench: applyAwards(bench, drop) });
}

export function recordQuizAnswerIn(
  prev: ProgressState,
  questionId: string,
  correct: boolean,
  ctx?: PathAnswerContext,
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
  let next = withActivity({ ...prev, game }, xpGain);
  const isPath = questionId.startsWith("path-") || Boolean(ctx?.domainId);
  if (isPath && !ctx?.skipped) {
    const drop = dropFromPath(next.bench ?? emptyBench(), {
      correct,
      skipped: ctx?.skipped,
      domainId: ctx?.domainId,
      subject: ctx?.subject,
      conceptId: ctx?.conceptId ?? questionId,
      cardId: ctx?.cardId,
    });
    next = { ...next, bench: applyAwards(next.bench ?? emptyBench(), drop) };
  }
  return next;
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
  const at = result.at;
  const domain = techDomains.find((item) => item.quizId === quizId);
  const exam = domain?.exam;
  const next: ProgressState = {
    ...prev,
    lastQuizId: quizId,
    quizScores: {
      ...prev.quizScores,
      [quizId]: keepExisting ? existing : result,
    },
    quizHistory: { ...prev.quizHistory, [quizId]: history },
    objectivePassedAt:
      ratio >= QUIZ_PASS_RATIO && exam
        ? markObjectivesFromQuiz(prev.objectivePassedAt, quizId, exam, at)
        : prev.objectivePassedAt,
  };
  return withCrests(withActivity(next, xpGain));
}

export function recordScenarioIn(
  prev: ProgressState,
  scenarioId: string,
  result: ScenarioResult,
): ProgressState {
  const existing = prev.scenarioScores[scenarioId];
  const keepExisting = existing && existing.score >= result.score;
  const bench = prev.bench ?? emptyBench();
  const bonus = loadoutBonus(bench);
  const next: ProgressState = {
    ...prev,
    lastScenarioId: scenarioId,
    scenarioScores: {
      ...prev.scenarioScores,
      [scenarioId]: keepExisting ? existing : result,
    },
  };
  const drop = dropFromLab(bench, {
    score: result.score,
    total: result.total,
    domainIds: result.domainIds,
    theme: result.theme,
  });
  const passed = result.total > 0 && result.score / result.total >= 0.75;
  const withCards: ProgressState = {
    ...next,
    bench: applyAwards(bench, drop),
    lastSubject: "tech",
    objectivePassedAt:
      passed && (result.domainIds?.length || result.exam)
        ? markObjectivesFromDomains(
            next.objectivePassedAt,
            result.domainIds ?? [],
            result.exam,
            result.at,
          )
        : next.objectivePassedAt,
  };
  return withCrests(withActivity(withCards, ticketXp(result.score, result.total) + bonus));
}

export function setAutoReadIn(prev: ProgressState, autoRead: boolean): ProgressState {
  return { ...prev, autoRead };
}

export function setSpeechMutedIn(prev: ProgressState, speechMuted: boolean): ProgressState {
  return { ...prev, speechMuted };
}

export function setLastSubjectIn(prev: ProgressState, lastSubject: SubjectId): ProgressState {
  return { ...prev, lastSubject };
}

export function setExamTrackIn(prev: ProgressState, examTrack: ExamTrack): ProgressState {
  return { ...prev, examTrack };
}

export function reviewCardIn(prev: ProgressState, cardId: string, grade: ReviewGrade): ProgressState {
  return { ...prev, bench: reviewCardBench(prev.bench ?? emptyBench(), cardId, grade) };
}

export function importProgressJson(raw: string): { ok: true; state: ProgressState } | { ok: false; error: string } {
  try {
    const parsed = parseProgress(raw);
    if (!parsed.completedLessons && !parsed.game && !parsed.quizScores) {
      return { ok: false, error: "That file does not look like TicketBench progress." };
    }
    return { ok: true, state: parsed };
  } catch {
    return { ok: false, error: "Could not read that JSON." };
  }
}

export function exportProgressJson(state: ProgressState) {
  return JSON.stringify(state, null, 2);
}

export function toggleProjectCheckIn(
  prev: ProgressState,
  projectId: string,
  checkId: string,
): ProgressState {
  const current = prev.projectChecks?.[projectId] ?? [];
  const checked = current.includes(checkId)
    ? current.filter((id) => id !== checkId)
    : [...current, checkId];
  return {
    ...prev,
    lastProjectId: projectId,
    projectChecks: { ...prev.projectChecks, [projectId]: checked },
  };
}

export function markProjectCompleteIn(
  prev: ProgressState,
  projectId: string,
  xpGain: number = XP.projectDefault,
): ProgressState {
  const already = (prev.completedProjects ?? []).includes(projectId);
  if (already) {
    return { ...prev, lastProjectId: projectId };
  }
  const next: ProgressState = {
    ...prev,
    lastProjectId: projectId,
    completedProjects: [...(prev.completedProjects ?? []), projectId],
  };
  return withActivity(next, Math.max(0, xpGain));
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

  let xpGain = input.skipped
    ? XP.brainSkip
    : input.correct
      ? XP.brainCorrect
      : XP.brainWrong;
  if (input.crossword && input.correct && !input.skipped) xpGain += XP.brainCrossword;
  xpGain += input.penalty ?? 0;
  if (completed && !wasComplete) xpGain += XP.brainDayComplete;

  const withXp = withActivity({ ...prev, brain }, xpGain);
  const drop = dropFromBrain(withXp.bench ?? emptyBench(), {
    correct: input.correct,
    skipped: input.skipped,
    cat: input.cat,
  });
  return { ...withXp, bench: applyAwards(withXp.bench ?? emptyBench(), drop) };
}

function withCrests(state: ProgressState): ProgressState {
  const drop = maybeAwardCrest(state.bench ?? emptyBench(), {
    completedLessons: state.completedLessons,
    quizScores: state.quizScores,
  });
  if (!drop.awarded.length) return state;
  return { ...state, bench: applyAwards(state.bench ?? emptyBench(), drop) };
}

export function startDeskShiftIn(prev: ProgressState, lengthMin: 8 | 15 | 25): ProgressState {
  return {
    ...prev,
    bench: startShiftBench(prev.bench ?? emptyBench(), lengthMin, prev.game?.xp ?? 0),
  };
}

export function closeDeskShiftIn(prev: ProgressState, early = false): ProgressState {
  return {
    ...prev,
    bench: closeShiftBench(prev.bench ?? emptyBench(), {
      xp: prev.game?.xp ?? 0,
      completedLessons: prev.completedLessons,
      early,
    }),
  };
}

export function openNightPackIn(prev: ProgressState): ProgressState {
  const drop = openNightPackBench(prev.bench ?? emptyBench());
  return { ...prev, bench: applyAwards(drop.bench, drop, true) };
}

export function slotBenchCardIn(prev: ProgressState, slot: BenchSlot, cardId: string | undefined): ProgressState {
  return { ...prev, bench: slotCardBench(prev.bench ?? emptyBench(), slot, cardId) };
}

export function setLoadoutIn(prev: ProgressState, loadout: BenchState["loadout"]): ProgressState {
  return { ...prev, bench: setLoadoutBench(prev.bench ?? emptyBench(), loadout) };
}

export function fuseCardsIn(prev: ProgressState, recipeId: string): ProgressState {
  const drop = fuseBench(prev.bench ?? emptyBench(), recipeId);
  return { ...prev, bench: applyAwards(prev.bench ?? emptyBench(), drop) };
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
