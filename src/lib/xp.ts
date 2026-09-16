export const LEVELS = [
  { min: 0, title: "Helpdesk Rookie" },
  { min: 120, title: "Bench Tech" },
  { min: 320, title: "Field Tech" },
  { min: 600, title: "Desktop Specialist" },
  { min: 980, title: "Escalation Tech" },
  { min: 1500, title: "A+ Contender" },
  { min: 2200, title: "Core-Ready Tech" },
  { min: 3200, title: "Dual-Core Contender" },
] as const;

export const XP = {
  lesson: 80,
  quizCorrectFirst: 12,
  quizCorrectRepeat: 6,
  quizWrong: 2,
  quizComplete: 15,
  quizHigh: 25,
  quizPerfect: 40,
  ticketBase: 100,
  ticketClean: 50,
  ticketSolid: 20,
} as const;

export function levelForXp(xp: number) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].min) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const floor = current.min;
  const ceil = next?.min ?? floor + 1;
  const span = Math.max(1, ceil - floor);
  const into = Math.min(span, Math.max(0, xp - floor));
  return {
    index,
    title: current.title,
    xp,
    floor,
    nextAt: next?.min,
    nextTitle: next?.title,
    percent: next ? Math.round((into / span) * 100) : 100,
  };
}

export function ticketXp(score: number, total: number) {
  if (total <= 0) return 0;
  const ratio = score / total;
  let amount = Math.round(XP.ticketBase * ratio);
  if (ratio >= 1) amount += XP.ticketClean;
  else if (ratio >= 0.75) amount += XP.ticketSolid;
  return amount;
}
