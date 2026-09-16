import type { Domain, ExamCore, ExamId, ExamTrack } from "@/content/types";

export const CURRENT_TRACK: ExamTrack = "v15";
export const ARCHIVE_TRACK: ExamTrack = "v14";

const CURRENT: Record<ExamCore, ExamId> = { 1: "220-1201", 2: "220-1202" };
const ARCHIVE: Record<ExamCore, ExamId> = { 1: "220-1101", 2: "220-1102" };

export function isExamId(value: string): value is ExamId {
  return value === "220-1101" || value === "220-1102" || value === "220-1201" || value === "220-1202";
}

export function examCore(exam: ExamId): ExamCore {
  return exam === "220-1101" || exam === "220-1201" ? 1 : 2;
}

export function isCore1(exam?: ExamId) {
  return exam === "220-1101" || exam === "220-1201";
}

export function isCore2(exam?: ExamId) {
  return exam === "220-1102" || exam === "220-1202";
}

export function examForTrack(core: ExamCore, track: ExamTrack = CURRENT_TRACK): ExamId {
  return (track === "v14" ? ARCHIVE : CURRENT)[core];
}

export function trackForExam(exam: ExamId): ExamTrack {
  return exam === "220-1101" || exam === "220-1102" ? "v14" : "v15";
}

export function domainExamForTrack(domain: Domain, track: ExamTrack): ExamId | undefined {
  if (!domain.exam) return undefined;
  return examForTrack(examCore(domain.exam), track);
}

export function coreLabel(exam: ExamId) {
  return examCore(exam) === 1 ? "Core 1" : "Core 2";
}
