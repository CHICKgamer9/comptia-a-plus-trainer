import { generateText, Output } from "ai";
import type { Scenario } from "@/content/types";
import { fallbackTicket } from "./ticket-fallback";
import {
  generatedTicketSchema,
  normalizeTicket,
  type GenerateRequest,
} from "./ticket-schema";
import { aiConfigured, DEFAULT_AI_MODEL } from "./ai-config";

const MODEL = process.env.AI_MODEL ?? DEFAULT_AI_MODEL;

export { aiConfigured };

const THEME_HINT: Record<string, string> = {
  hardware: "PSU, RAM seating, RAID, display, overheating, storage, cables",
  network: "APIPA, DNS, VLAN, Wi-Fi RF, PoE AP, VPN split tunnel, ports",
  os: "Windows 11 TPM/SKU, WinRE, drivers, profiles, domain join, mapped drives",
  security: "phishing, scareware, ransomware isolate-first, NTFS vs share, BitLocker",
  printer: "queue offline, stale IP, PCL vs PS, panel test page, spooler",
  mobile: "USB-C debris, swollen battery, antennas after lid swap, MDM lock",
};

function resolveFilters(input: GenerateRequest) {
  const exams = ["220-1201", "220-1202"] as const;
  const themes = ["hardware", "network", "os", "security", "printer", "mobile"] as const;
  const diffs = ["easy", "medium", "hard"] as const;
  const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
  return {
    exam: !input.exam || input.exam === "surprise" ? pick(exams) : input.exam,
    theme: !input.theme || input.theme === "surprise" ? pick(themes) : input.theme,
    difficulty:
      !input.difficulty || input.difficulty === "surprise" ? pick(diffs) : input.difficulty,
  };
}

function promptFor(
  filters: ReturnType<typeof resolveFilters>,
  seed: string,
  loadoutHint?: string,
) {
  const hardHint =
    filters.difficulty === "hard"
      ? "Include a plausible red herring (recent change that is unrelated). The correct path still follows CompTIA's identify → theory → test → plan → verify → document loop."
      : "Keep the root cause singular and fair. Distractors should be tempting but clearly worse methodology.";
  const loadoutLine = loadoutHint
    ? `The tech equipped these knowledge cards as a loadout: ${loadoutHint}. Bias the ticket toward those parts, symptoms, or tools when it still stays a fair original ticket.`
    : "";
  return `Create one original CompTIA A+ style helpdesk ticket for study practice.

Exam: ${filters.exam} (${filters.exam.endsWith("1201") || filters.exam.endsWith("1101") ? "Core 1" : "Core 2"})
Theme: ${filters.theme} (${THEME_HINT[filters.theme]})
Difficulty: ${filters.difficulty}
Variety seed (do not mention in the ticket): ${seed}
${loadoutLine}

Rules:
- Write like a real ticket, not an exam dump of official objectives.
- Accurate A+ knowledge (ports, RAID, APIPA, WinRE, WPA2-AES, BitLocker vs EFS, etc.).
- Exactly 4 steps in order: gather, tools, cause, fix.
- Each step has 3 or 4 choices and EXACTLY one correct: true.
- Wrong choices need specific feedback explaining why that move is worse.
- After gather and tools, include findings that a tech would actually collect.
- domainIds must be valid A+ domain slugs that match the story.
- ticketId like TCK-38421.
- Do not claim to be official CompTIA material.
- Do not reuse famous canned scenarios word-for-word (no "the printer was unplugged by a janitor" cliché unless the seed forces printers — still change the facts).
${hardHint}`;
}

async function callModel(
  filters: ReturnType<typeof resolveFilters>,
  seed: string,
  loadoutHint?: string,
) {
  const result = await generateText({
    model: MODEL,
    output: Output.object({
      schema: generatedTicketSchema,
      name: "APlusTicket",
      description: "A four-step CompTIA A+ helpdesk troubleshooting ticket",
    }),
    prompt: promptFor(filters, seed, loadoutHint),
  });
  if (!result.output) {
    throw new Error("Model returned no object");
  }
  const ticket = normalizeTicket(result.output, "ai");
  if (!ticket) {
    throw new Error("Ticket failed validation");
  }
  ticket.exam = filters.exam;
  ticket.theme = filters.theme;
  ticket.difficulty = filters.difficulty;
  return ticket;
}

export async function generateTicket(input: GenerateRequest): Promise<{
  ticket: Scenario;
  source: "ai" | "fallback";
  warning?: string;
}> {
  const filters = resolveFilters(input);
  const seed = `${filters.theme}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  if (input.forceStub || !aiConfigured()) {
    return {
      ticket: fallbackTicket(),
      source: "fallback",
      warning: input.forceStub
        ? "Practice stub loaded on purpose."
        : "AI is not configured on this deployment. Loaded the offline practice stub. Set AI_GATEWAY_API_KEY (or OPENAI_API_KEY) to generate fresh tickets.",
    };
  }

  try {
    return { ticket: await callModel(filters, seed, input.loadoutHint), source: "ai" };
  } catch {
    try {
      return { ticket: await callModel(filters, `${seed}-retry`, input.loadoutHint), source: "ai" };
    } catch {
      return {
        ticket: fallbackTicket(),
        source: "fallback",
        warning:
          "Generation failed after a retry. Loaded the offline practice stub so you can still drill.",
      };
    }
  }
}
