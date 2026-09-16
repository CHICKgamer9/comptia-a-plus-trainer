import { cancelAll, speak, speechSupported as ttsSupported } from "@/lib/tts/speak";
import { pickWebVoice, type VoiceLike } from "@/lib/tts/script";

export function speechSupported() {
  return ttsSupported();
}

export function cancelSpeech() {
  cancelAll();
}

export function pickVoice(lang = "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  return pickWebVoice(window.speechSynthesis.getVoices() as VoiceLike[], lang, lang.toLowerCase().startsWith("en") ? "narrator" : "target");
}

export function pickEnglishVoice() {
  return pickVoice("en");
}

export function speakText(
  text: string,
  handlers: { onStart?: () => void; onEnd?: () => void } = {},
  lang = "en-US",
): () => void {
  const role = lang.toLowerCase().startsWith("en") ? "narrator" : "target";
  handlers.onStart?.();
  const handle = speak({ text, lang, role });
  void handle.ended.then(() => handlers.onEnd?.());
  return handle.stop;
}

export function joinSpeech(parts: Array<string | undefined | null>) {
  return parts
    .map((part) => (part ?? "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(". ");
}

export function numberChoices(choices: string[]) {
  return choices
    .map((choice, index) => `${String.fromCharCode(65 + index)}. ${choice}`)
    .join(". ");
}
