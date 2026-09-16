const RATE = 0.97;

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (!voices.length) return null;
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  return (
    pool.find((voice) => voice.localService && /en-US|en-GB|en-AU/i.test(voice.lang)) ??
    pool.find((voice) => /en-US/i.test(voice.lang)) ??
    pool.find((voice) => voice.localService) ??
    pool[0] ??
    null
  );
}

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
}

export function cancelSpeech() {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakText(
  text: string,
  handlers: { onStart?: () => void; onEnd?: () => void } = {},
): () => void {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!speechSupported() || !cleaned) {
    handlers.onEnd?.();
    return () => undefined;
  }

  cancelSpeech();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.rate = RATE;
  utterance.pitch = 1;
  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-US";
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onEnd?.();

  const start = () => {
    window.speechSynthesis.speak(utterance);
  };

  // Chrome often has an empty voice list until this event; also cancel()+speak() can no-op.
  const kick = window.setTimeout(start, 40);
  const onVoices = () => {
    const next = pickEnglishVoice();
    if (next) {
      utterance.voice = next;
      utterance.lang = next.lang;
    }
  };
  window.speechSynthesis.addEventListener("voiceschanged", onVoices);

  return () => {
    window.clearTimeout(kick);
    window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  };
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
