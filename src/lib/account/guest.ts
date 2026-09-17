import { emptyProgress, parseProgress, type ProgressState } from "@/lib/progress";

export function guestWorthSaving(state: ProgressState): boolean {
  const cards = state.bench?.owned?.length ?? 0;
  const streak = state.game?.streakCount ?? 0;
  return cards >= 1 || streak >= 2;
}

export function cloneProgress(state: ProgressState): ProgressState {
  return parseProgress(JSON.stringify(state));
}

export function guestProgressForSave(guest: ProgressState): ProgressState {
  const cloned = cloneProgress(guest);
  if (!cloned.completedLessons && !cloned.game && !cloned.bench) {
    return emptyProgress();
  }
  return cloned;
}
