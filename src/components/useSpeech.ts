"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useProgress } from "./ProgressProvider";
import { cancelAll, setMuted, speak, speechSupported, type SpeakRole } from "@/lib/tts/speak";

const noSubscribe = () => () => undefined;

export function useSpeech() {
  const { progress, setAutoRead, setSpeechMuted } = useProgress();
  const [speaking, setSpeaking] = useState(false);
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const supported = useSyncExternalStore(noSubscribe, speechSupported, () => false);
  const stopRef = useRef<(() => void) | null>(null);
  const muted = progress.speechMuted === true;

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      cancelAll();
    };
  }, []);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    cancelAll();
    setSpeaking(false);
  }, []);

  const speakLine = useCallback((text: string, lang?: string, role: SpeakRole = "narrator") => {
    if (!speechSupported() || !text.trim()) {
      setSpeaking(false);
      return { stop: () => undefined, ended: Promise.resolve() };
    }
    stopRef.current?.();
    setSpeaking(true);
    const handle = speak({ text, lang, role });
    stopRef.current = handle.stop;
    void handle.ended.then(() => {
      stopRef.current = null;
      setSpeaking(false);
    });
    return handle;
  }, []);

  return {
    ready: hydrated,
    supported,
    speaking,
    speak: (text: string, lang?: string) => {
      speakLine(text, lang, lang && !lang.toLowerCase().startsWith("en") ? "target" : "narrator");
    },
    speakLine,
    stop,
    cancelAll,
    autoRead: progress.autoRead === true,
    setAutoRead,
    muted,
    setMuted: setSpeechMuted,
  };
}
