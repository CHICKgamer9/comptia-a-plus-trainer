import type { Difficulty, ExamId, ScenarioKind, ScenarioPhase, ScenarioTheme } from "@/content/types";

export function examShort(exam: ExamId) {
  return exam === "220-1101" ? "Core 1" : "Core 2";
}

export function examCode(exam: ExamId) {
  return exam;
}

export function difficultyLabel(level: Difficulty) {
  return level === "easy" ? "Easy" : level === "medium" ? "Medium" : "Hard";
}

export function themeLabel(theme: ScenarioTheme) {
  const map: Record<ScenarioTheme, string> = {
    hardware: "Hardware",
    network: "Network",
    os: "Operating system",
    security: "Security",
    printer: "Printer",
    mobile: "Mobile",
  };
  return map[theme];
}

export function phaseLabel(phase: ScenarioPhase, kind: ScenarioKind = "ticket") {
  if (kind === "challenge") {
    const map: Record<ScenarioPhase, string> = {
      gather: "Look closely",
      tools: "Try a model",
      cause: "Decide",
      fix: "Check it",
    };
    return map[phase];
  }
  const map: Record<ScenarioPhase, string> = {
    gather: "Gather info",
    tools: "Tools & tests",
    cause: "Root cause",
    fix: "Apply the fix",
  };
  return map[phase];
}

export function phaseIndex(phase: ScenarioPhase) {
  return (["gather", "tools", "cause", "fix"] as ScenarioPhase[]).indexOf(phase);
}
