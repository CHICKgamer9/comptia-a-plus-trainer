import type { SpeakLine } from "@/content/types";

export const BANNED_CHROME = [
  "CONCEPT",
  "WHY",
  "FIELD TIP",
  "FIELD TIP",
  "4 MIN",
  "4-MINUTE",
  "4 MINUTE",
  "CORE 1",
  "CORE 2",
];

export const BANNED_CHROME_RE =
  /\b(CONCEPT|WHY|FIELD\s*TIP|4\s*MIN(?:UTE)?S?|CORE\s*[12]|options?|buttons?)\b/i;

export const META_BODY_RE =
  /\b(XP|streak|Binder|4-minute|4 minute|see it once|pocket picture|finish it so)\b/i;

export const PRAISE_RE = /\b(nice job|well done|great job|you got it|awesome|good job)\b/i;

export const STAGE_DIR_RE = /^\s*\[.+\]\s*$/;

export type SpeakRole = "narrator" | "target";

export function isSilent(speak: SpeakLine | undefined): boolean {
  if (speak == null) return true;
  if (typeof speak === "object") return Boolean(speak.silent);
  return speak.trim().length === 0;
}

export function speakTextOf(speak: SpeakLine | undefined): string {
  if (isSilent(speak) || typeof speak !== "string") return "";
  return speak.replace(/\s+/g, " ").trim();
}

export function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [cleaned];
  return parts.map((part) => part.trim()).filter(Boolean);
}

export function countWords(sentence: string): number {
  return sentence
    .replace(/[.,!?;:"“”]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Spoken form: so-dimm, M two, U S B C. Commas not slashes. Periods not em-dashes. */
export function pronounceForSpeech(text: string): string {
  return text
    .replace(/\u2014|\u2013/g, ". ")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/\bSO-?DIMMs?\b/gi, "so dimm")
    .replace(/\bSODIMMs?\b/gi, "so dimm")
    .replace(/\bM\.2\b/gi, "M two")
    .replace(/\bUSB-C\b/gi, "U S B C")
    .replace(/\bUSB C\b/gi, "U S B C")
    .replace(/\bFRUs?\b/g, "F R U")
    .replace(/\bCPUs?\b/g, "C P U")
    .replace(/\bGPUs?\b/g, "G P U")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashString(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function narratorLang(requested?: string): string {
  const raw = (requested ?? "en").toLowerCase();
  if (raw.startsWith("en")) {
    if (raw.startsWith("en-au")) return "en-AU";
    if (raw.startsWith("en-gb")) return "en-GB";
    if (raw.startsWith("en-us")) return "en-US";
    return raw.length > 2 ? requested! : "en-US";
  }
  return "en-US";
}

export type VoiceLike = {
  lang: string;
  name: string;
  localService?: boolean;
};

const NEURAL_NAME = /neural|premium|enhanced|natural|online|google|microsoft|samantha|karen|daniel|moira/i;

function localeRank(lang: string): number {
  const lower = lang.toLowerCase();
  if (lower.startsWith("en-au")) return 0;
  if (lower.startsWith("en-gb")) return 1;
  if (lower.startsWith("en-us")) return 2;
  if (lower.startsWith("en")) return 3;
  return 4;
}

/**
 * Never return voices[0] of the raw list. Prefer neural/premium,
 * then en-AU → en-GB → en-US for English narrator.
 */
export function pickWebVoice(
  voices: VoiceLike[],
  lang: string,
  role: SpeakRole,
): VoiceLike | null {
  if (!voices.length) return null;
  const prefix = (role === "narrator" ? narratorLang(lang) : lang).toLowerCase().slice(0, 2);
  const matched = voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
  const pool = matched.length ? matched : role === "narrator" ? voices.filter((v) => v.lang.toLowerCase().startsWith("en")) : [];
  if (!pool.length) return null;

  const scored = [...pool].sort((a, b) => {
    const aNeural = NEURAL_NAME.test(a.name) ? 0 : 1;
    const bNeural = NEURAL_NAME.test(b.name) ? 0 : 1;
    if (aNeural !== bNeural) return aNeural - bNeural;
    if (role === "narrator") {
      const loc = localeRank(a.lang) - localeRank(b.lang);
      if (loc !== 0) return loc;
    }
    return a.name.localeCompare(b.name);
  });

  const pick = scored[0] ?? null;
  if (pick && voices.length > 1 && pick === voices[0] && !NEURAL_NAME.test(pick.name) && !pick.lang.toLowerCase().startsWith(prefix)) {
    return scored.find((voice) => voice !== voices[0]) ?? null;
  }
  return pick;
}

export function speakContainsChrome(text: string): boolean {
  return BANNED_CHROME_RE.test(text);
}
