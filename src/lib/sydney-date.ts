/** Civil dates in the user's local timezone. Field names stay lastSydneyDate for saved progress. */

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function localDate(at: number = Date.now()): string {
  const date = new Date(at);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** @deprecated Use localDate. Kept so Brain Gym imports keep working. */
export const sydneyDate = localDate;

export function previousLocalDate(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** @deprecated Use previousLocalDate. */
export const previousSydneyDate = previousLocalDate;

export function updateStreak(
  lastSydneyDate: string | undefined,
  count: number,
  at: number = Date.now(),
): { count: number; lastSydneyDate: string } {
  const today = localDate(at);
  if (lastSydneyDate === today) {
    return { count: Math.max(count, 1), lastSydneyDate: today };
  }
  if (lastSydneyDate && lastSydneyDate === previousLocalDate(today)) {
    return { count: count + 1, lastSydneyDate: today };
  }
  return { count: 1, lastSydneyDate: today };
}
