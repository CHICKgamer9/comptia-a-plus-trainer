/** Civil dates in Australia/Sydney, independent of the browser's local zone. */

export const STREAK_TZ = "Australia/Sydney";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function sydneyDate(at: number = Date.now()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STREAK_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(at));
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function previousSydneyDate(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day) - 24 * 60 * 60 * 1000;
  const date = new Date(utc);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function updateStreak(
  lastSydneyDate: string | undefined,
  count: number,
  at: number = Date.now(),
): { count: number; lastSydneyDate: string } {
  const today = sydneyDate(at);
  if (lastSydneyDate === today) {
    return { count: Math.max(count, 1), lastSydneyDate: today };
  }
  if (lastSydneyDate && lastSydneyDate === previousSydneyDate(today)) {
    return { count: count + 1, lastSydneyDate: today };
  }
  return { count: 1, lastSydneyDate: today };
}
