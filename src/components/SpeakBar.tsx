"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from "./useSpeech";
import { cancelSpeech, joinSpeech, numberChoices } from "@/lib/speech";
import { cn } from "@/lib/cn";

export interface Narration {
  id: string;
  prompt: string;
  choices?: string[];
  followUp?: string;
}

export function SpeakBar({ narration, compact = false }: { narration: Narration; compact?: boolean }) {
  const { ready, supported, speaking, speak, stop, autoRead, setAutoRead } = useSpeech();
  const lastPrompt = useRef<string>("");
  const lastFollow = useRef<string>("");

  useEffect(() => {
    lastPrompt.current = "";
    lastFollow.current = "";
    cancelSpeech();
  }, [narration.id]);

  useEffect(() => {
    if (!autoRead || !supported || !narration.prompt) return;
    if (lastPrompt.current === narration.id) return;
    lastPrompt.current = narration.id;
    speak(narration.prompt);
  }, [autoRead, narration.id, narration.prompt, speak, supported]);

  useEffect(() => {
    if (!autoRead || !supported || !narration.followUp) return;
    const key = `${narration.id}:${narration.followUp}`;
    if (lastFollow.current === key) return;
    lastFollow.current = key;
    speak(narration.followUp);
  }, [autoRead, narration.followUp, narration.id, speak, supported]);

  if (ready && !supported) {
    return (
      <p className="text-[11px] text-muted">Voice needs a browser with speech synthesis.</p>
    );
  }

  const screen = joinSpeech([narration.prompt, narration.followUp]);
  const choiceScript = narration.choices?.length ? numberChoices(narration.choices) : "";

  return (
    <div className="flex flex-wrap items-center gap-1.5" data-speak-bar>
      <IconButton
        label={speaking ? "Stop" : "Listen"}
        onClick={() => (speaking ? stop() : speak(screen || narration.prompt))}
        active={speaking}
      >
        {speaking ? <StopIcon /> : <SpeakIcon />}
      </IconButton>
      <IconButton
        label={autoRead ? "Auto-read on" : "Auto-read off"}
        onClick={() => {
          const next = !autoRead;
          setAutoRead(next);
          if (!next) stop();
        }}
        active={autoRead}
      >
        <AutoIcon />
        {compact ? null : <span className="hidden sm:inline">Auto-read</span>}
      </IconButton>
      {choiceScript ? (
        <IconButton label="Read choices" onClick={() => speak(choiceScript)}>
          <ListIcon />
          {compact ? null : <span className="hidden sm:inline">Choices</span>}
        </IconButton>
      ) : null}
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

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 7h12M8 12h12M8 17h12" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="4" cy="7" r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4" cy="17" r="1.2" fill="currentColor" />
    </svg>
  );
}
