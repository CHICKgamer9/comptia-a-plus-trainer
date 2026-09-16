"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useProgress } from "./ProgressProvider";
import { cancelSpeech, speakText, speechSupported } from "@/lib/speech";

const noSubscribe = () => () => undefined;

export function useSpeech() {
  const { progress, setAutoRead } = useProgress();
  const [speaking, setSpeaking] = useState(false);
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const supported = useSyncExternalStore(noSubscribe, speechSupported, () => false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      cancelSpeech();
    };
  }, []);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    cancelSpeech();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, lang?: string) => {
      if (!speechSupported()) return;
      stopRef.current?.();
      setSpeaking(true);
      stopRef.current = speakText(
        text,
        {
          onStart: () => setSpeaking(true),
          onEnd: () => {
            stopRef.current = null;
            setSpeaking(false);
          },
        },
        lang,
      );
    },
    [],
  );

  return {
    ready: hydrated,
    supported,
    speaking,
    speak,
    stop,
    autoRead: progress.autoRead === true,
    setAutoRead,
  };
}
