const RATE = 0.97;

function allVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function pickVoice(lang = "en"): SpeechSynthesisVoice | null {
  const voices = allVoices();
  if (!voices.length) return null;
  const prefix = lang.toLowerCase().slice(0, 2);
  const matched = voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
  const pool = matched.length ? matched : [];
  if (prefix === "en") {
    const english = matched.length ? matched : voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    const enPool = english.length ? english : voices;
    return (
      enPool.find((voice) => voice.localService && /en-US|en-GB|en-AU/i.test(voice.lang)) ??
      enPool.find((voice) => /en-US/i.test(voice.lang)) ??
      enPool.find((voice) => voice.localService) ??
      enPool[0] ??
      null
    );
  }
  return (
    pool.find((voice) => voice.localService) ??
    pool[0] ??
    null
  );
}

export function pickEnglishVoice(): SpeechSynthesisVoice | null {
  return pickVoice("en");
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
  lang = "en-US",
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
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || lang;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onEnd?.();

  const start = () => {
    window.speechSynthesis.speak(utterance);
  };

  // Chrome often has an empty voice list until this event; also cancel()+speak() can no-op.
  const kick = window.setTimeout(start, 40);
  const onVoices = () => {
    const next = pickVoice(lang);
    if (next) {
      utterance.voice = next;
      utterance.lang = next.lang;
    } else {
      utterance.lang = lang;
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
