import { z } from "zod";
import type { Scenario } from "@/content/types";

export const examEnum = z.enum(["220-1101", "220-1102", "220-1201", "220-1202"]);
export const themeEnum = z.enum([
  "hardware",
  "network",
  "os",
  "security",
  "printer",
  "mobile",
]);
export const difficultyEnum = z.enum(["easy", "medium", "hard"]);
export const domainEnum = z.enum([
  "mobile-devices",
  "networking",
  "hardware",
  "virtualization-cloud",
  "hw-net-troubleshooting",
  "operating-systems",
  "security",
  "software-troubleshooting",
  "operational-procedures",
]);
export const phaseEnum = z.enum(["gather", "tools", "cause", "fix"]);

const choiceSchema = z.object({
  id: z.string().min(1).max(8),
  label: z.string().min(12).max(280),
  correct: z.boolean(),
  feedback: z.string().min(20).max(500),
});

const stepSchema = z.object({
  id: z.string().min(1).max(40),
  phase: phaseEnum,
  title: z.string().min(4).max(80),
  prompt: z.string().min(20).max(500),
  findings: z.string().min(12).max(400).optional(),
  choices: z.array(choiceSchema).min(3).max(4),
});

export const generatedTicketSchema = z.object({
  title: z.string().min(8).max(90),
  ticketId: z.string().min(4).max(16),
  requester: z.string().min(4).max(80),
  location: z.string().min(4).max(80),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  exam: examEnum,
  theme: themeEnum,
  domainIds: z.array(domainEnum).min(1).max(3),
  difficulty: difficultyEnum,
  minutes: z.number().int().min(5).max(15),
  summary: z.string().min(12).max(160),
  ticket: z.string().min(40).max(900),
  steps: z.array(stepSchema).length(4),
  debrief: z.string().min(40).max(700),
});

export type GeneratedTicket = z.infer<typeof generatedTicketSchema>;

export const generateRequestSchema = z.object({
  exam: z.union([examEnum, z.literal("surprise")]).optional(),
  theme: z.union([themeEnum, z.literal("surprise")]).optional(),
  difficulty: z.union([difficultyEnum, z.literal("surprise")]).optional(),
          forceStub: z.boolean().optional(),
  loadoutHint: z.string().max(200).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

function newId() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeTicket(
  raw: GeneratedTicket,
  source: Scenario["source"] = "ai",
): Scenario | null {
  const phases = ["gather", "tools", "cause", "fix"] as const;
  if (raw.steps.length !== 4) return null;
  const steps = raw.steps.map((step, index) => ({
    ...step,
    phase: phases[index],
    id: step.id || `step-${index + 1}`,
    choices: step.choices.map((choice, choiceIndex) => ({
      ...choice,
      id: choice.id || String.fromCharCode(97 + choiceIndex),
    })),
  }));
  const ok = steps.every(
    (step) => step.choices.filter((choice) => choice.correct).length === 1,
  );
  if (!ok) return null;
  const ticketId = raw.ticketId.toUpperCase().startsWith("TCK")
    ? raw.ticketId.toUpperCase()
    : `TCK-${Math.floor(10000 + Math.random() * 89999)}`;
  return {
    id: newId(),
    title: raw.title,
    ticketId,
    requester: raw.requester,
    location: raw.location,
    priority: raw.priority,
    exam: raw.exam,
    theme: raw.theme,
    domainIds: raw.domainIds,
    difficulty: raw.difficulty,
    minutes: raw.minutes,
    summary: raw.summary,
    ticket: raw.ticket,
    steps,
    debrief: raw.debrief,
    source,
    subject: "tech",
    kind: "ticket",
  };
}
