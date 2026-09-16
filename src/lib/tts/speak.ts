import {
  hashString,
  narratorLang,
  pickWebVoice,
  pronounceForSpeech,
  speakTextOf,
  splitSentences,
  type SpeakRole,
  type VoiceLike,
} from "./script";
import type { SpeakLine } from "@/content/types";

export type { SpeakRole } from "./script";

export type SpeakHandle = {
  stop: () => void;
  ended: Promise<void>;
};

const RATE = 0.95;
const SENTENCE_GAP_MS = 280;
const GLOSS_GAP_MS = 420;

type SpeakOpts = {
  text: string;
  lang?: string;
  role?: SpeakRole;
};

let muted = false;
let currentStop: (() => void) | null = null;
let narratorVoiceName: string | null = null;
let neuralAvailable: boolean | null = null;
const audioCache = new Map<string, string>();

export function setMuted(next: boolean) {
  muted = next;
  if (next) cancelAll();
}

export function isMuted() {
  return muted;
}

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
}

function allVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return window.speechSynthesis.getVoices();
}

function resolvedLang(role: SpeakRole, lang?: string) {
  if (role === "narrator") return narratorLang(lang);
  return lang || "en-US";
}

export function cancelAll() {
  currentStop?.();
  currentStop = null;
  if (speechSupported()) {
    window.speechSynthesis.cancel();
  }
}

function idleHandle(): SpeakHandle {
  return { stop: () => undefined, ended: Promise.resolve() };
}

function bindCurrent(stop: () => void): () => void {
  currentStop = stop;
  return () => {
    if (currentStop === stop) currentStop = null;
    stop();
  };
}

async function playNeural(text: string, lang: string, role: SpeakRole, signal: AbortSignal): Promise<boolean> {
  if (neuralAvailable === false) return false;
  const key = hashString(`${role}:${lang}:${text}`);
  let url = audioCache.get(key);
  if (!url) {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang, role }),
      signal,
    });
    if (res.status === 501) {
      neuralAvailable = false;
      return false;
    }
    if (!res.ok) return false;
    neuralAvailable = true;
    const blob = await res.blob();
    if (!blob.size) return false;
    url = URL.createObjectURL(blob);
    audioCache.set(key, url);
  }
  const audio = new Audio(url);
  audio.preload = "auto";
  await new Promise<void>((resolve, reject) => {
    const onEnd = () => resolve();
    const onError = () => reject(new Error("audio"));
    const onAbort = () => {
      audio.pause();
      audio.src = "";
      resolve();
    };
    audio.addEventListener("ended", onEnd, { once: true });
    audio.addEventListener("error", onError, { once: true });
    signal.addEventListener("abort", onAbort, { once: true });
    void audio.play().catch(onError);
  });
  return true;
}

function speakWebSpeech(text: string, lang: string, role: SpeakRole, signal: AbortSignal): Promise<void> {
  if (!speechSupported()) return Promise.resolve();
  const sentences = splitSentences(pronounceForSpeech(text));
  if (!sentences.length) return Promise.resolve();

  return new Promise((resolve) => {
    let index = 0;
    let gapTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(gapTimer);
      window.speechSynthesis.cancel();
      resolve();
    };

    signal.addEventListener("abort", finish, { once: true });

    const speakNext = () => {
      if (signal.aborted || finished) return finish();
      const sentence = sentences[index];
      if (!sentence) return finish();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = RATE;
      utterance.pitch = 1;
      const voice = pickWebVoice(allVoices() as VoiceLike[], lang, role) as SpeechSynthesisVoice | null;
      if (role === "narrator") {
        const cached = narratorVoiceName
          ? allVoices().find((item) => item.name === narratorVoiceName)
          : null;
        const chosen = cached ?? voice;
        if (chosen) {
          utterance.voice = chosen;
          utterance.lang = chosen.lang;
          narratorVoiceName = chosen.name;
        } else {
          utterance.lang = lang;
        }
      } else if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang;
      }
      utterance.onend = () => {
        index += 1;
        if (index >= sentences.length) return finish();
        gapTimer = window.setTimeout(speakNext, SENTENCE_GAP_MS);
      };
      utterance.onerror = () => finish();
      window.speechSynthesis.speak(utterance);
    };

    const start = () => speakNext();
    if (!allVoices().length) {
      const onVoices = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
        start();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoices);
      gapTimer = window.setTimeout(start, 60);
    } else {
      gapTimer = window.setTimeout(start, 40);
    }
  });
}

export function speak(opts: SpeakOpts): SpeakHandle {
  const role = opts.role ?? "narrator";
  const lang = resolvedLang(role, opts.lang);
  const text = (opts.text ?? "").replace(/\s+/g, " ").trim();
  cancelAll();
  if (muted || !text) return idleHandle();

  const controller = new AbortController();
  const ended = (async () => {
    try {
      const neural = await playNeural(text, lang, role, controller.signal).catch(() => false);
      if (neural || controller.signal.aborted) return;
      await speakWebSpeech(text, lang, role, controller.signal);
    } catch {
      if (!controller.signal.aborted) {
        await speakWebSpeech(text, lang, role, controller.signal);
      }
    }
  })();

  const stop = bindCurrent(() => controller.abort());
  void ended.finally(() => {
    if (currentStop === stop) currentStop = null;
  });
  return { stop, ended };
}

export function speakTarget(text: string, lang: string): SpeakHandle {
  return speak({ text, lang, role: "target" });
}

export function speakGloss(text: string): SpeakHandle {
  return speak({ text, lang: "en", role: "narrator" });
}

/** Native target, then English gloss as a second utterance after a gap. Never one voice for both. */
export function speakIntroduce(target: string, gloss: string, targetLang: string): SpeakHandle {
  cancelAll();
  if (muted) return idleHandle();
  const controller = new AbortController();
  const ended = (async () => {
    const first = speak({ text: target, lang: targetLang, role: "target" });
    currentStop = () => {
      controller.abort();
      first.stop();
    };
    await first.ended;
    if (controller.signal.aborted || !gloss.trim()) return;
    await new Promise((resolve) => setTimeout(resolve, GLOSS_GAP_MS));
    if (controller.signal.aborted) return;
    const second = speak({ text: gloss, lang: "en", role: "narrator" });
    currentStop = () => {
      controller.abort();
      second.stop();
    };
    await second.ended;
  })();
  const stop = bindCurrent(() => controller.abort());
  return { stop, ended };
}

export function speakLine(line: SpeakLine | undefined, lang = "en", role: SpeakRole = "narrator"): SpeakHandle {
  const text = speakTextOf(line);
  if (!text) return idleHandle();
  return speak({ text, lang, role });
}

export { SENTENCE_GAP_MS, GLOSS_GAP_MS, RATE };
