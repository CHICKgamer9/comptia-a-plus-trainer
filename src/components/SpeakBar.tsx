"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from "./useSpeech";
import { cancelAll } from "@/lib/tts/speak";
import { speakTextOf } from "@/lib/tts/script";
import type { SpeakLine } from "@/content/types";
import { cn } from "@/lib/cn";

export interface Narration {
  id: string;
  /** Authored speak script only. Never title, chrome, or option lists. */
  prompt: string | SpeakLine;
  followUp?: string;
  /** Ignored. Auto-read never speaks option lists. */
  choices?: string[];
  lang?: string;
  role?: "narrator" | "target";
  onEnded?: () => void;
}

export function SpeakBar({
  narration,
  compact = false,
}: {
  narration: Narration;
  compact?: boolean;
}) {
  const { ready, supported, speaking, speakLine, stop, autoRead, setAutoRead, muted, setMuted } = useSpeech();
  const lastPrompt = useRef<string>("");
  const lastFollow = useRef<string>("");

  const prompt = typeof narration.prompt === "string" ? narration.prompt : speakTextOf(narration.prompt);

  useEffect(() => {
    lastPrompt.current = "";
    lastFollow.current = "";
    cancelAll();
  }, [narration.id]);

  useEffect(() => {
    if (!autoRead || muted || !supported || !prompt) {
      if (!prompt) narration.onEnded?.();
      return;
    }
    if (lastPrompt.current === narration.id) return;
    lastPrompt.current = narration.id;
    const handle = speakLine(prompt, narration.lang, narration.role ?? "narrator");
    void handle.ended.then(() => narration.onEnded?.());
  }, [autoRead, muted, narration, prompt, speakLine, supported]);

  useEffect(() => {
    if (!autoRead || muted || !supported || !narration.followUp) return;
    const key = `${narration.id}:${narration.followUp}`;
    if (lastFollow.current === key) return;
    lastFollow.current = key;
    speakLine(narration.followUp, narration.lang, "narrator");
  }, [autoRead, muted, narration.followUp, narration.id, narration.lang, speakLine, supported]);

  if (ready && !supported) {
    return <p className="text-[11px] text-muted">Voice needs a browser with speech synthesis.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5" data-speak-bar>
      <IconButton
        label={speaking ? "Stop" : "Listen"}
        onClick={() => (speaking ? stop() : speakLine(prompt || narration.followUp || "", narration.lang, narration.role ?? "narrator"))}
        active={speaking}
      >
        {speaking ? <StopIcon /> : <SpeakIcon />}
      </IconButton>
      <IconButton
        label={autoRead ? "Calm" : "Off"}
        onClick={() => {
          const next = !autoRead;
          setAutoRead(next);
          if (!next) stop();
        }}
        active={autoRead}
      >
        <AutoIcon />
        {compact ? null : <span className="hidden sm:inline">{autoRead ? "Calm" : "Off"}</span>}
      </IconButton>
      <IconButton
        label={muted ? "Unmute" : "Mute"}
        onClick={() => {
          const next = !muted;
          setMuted(next);
          if (next) stop();
        }}
        active={muted}
      >
        <MuteIcon />
        {compact ? null : <span className="hidden sm:inline">{muted ? "Muted" : "Mute"}</span>}
      </IconButton>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active ? true : undefined}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
        active
          ? "border-accent/50 bg-accent-dim text-accent"
          : "border-border text-muted active:border-accent/40 active:text-foreground hover:border-accent/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SpeakIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10v4h3l4 3V7L7 10H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 7h14M7 12h10M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10v4h3l4 3V7L7 10H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 8l6 8M22 8l-6 8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
