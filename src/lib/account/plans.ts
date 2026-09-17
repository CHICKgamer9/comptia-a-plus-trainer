import { MAX_PROFILES, type Plan } from "./types";

const DEFAULTS: Record<Plan, number> = {
  free: 1,
  bench: 3,
  house: 6,
};

export function seatLimitForPlan(plan: Plan): number {
  if (plan === "house") {
    const raw = Number(process.env.HOUSE_SEAT_LIMIT ?? DEFAULTS.house);
    const seeded = Number.isFinite(raw) ? Math.floor(raw) : DEFAULTS.house;
    return clampSeats(seeded);
  }
  return DEFAULTS[plan];
}

export function clampSeats(n: number) {
  return Math.max(1, Math.min(MAX_PROFILES, n));
}

export function planLabel(plan: Plan) {
  if (plan === "house") return "House";
  if (plan === "bench") return "Bench";
  return "Free";
}
