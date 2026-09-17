"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import type { LingoLangId, LingoStep } from "@/content/lingo/types";
import { lingoItemType } from "@/content/lingo/types";
import { answersMatch } from "@/lib/lingo-normalize";
import { cn } from "@/lib/cn";
import { speakIntroduce, speakTarget } from "@/lib/tts/speak";
import { useSpeech } from "../useSpeech";
import { PlayerButton } from "../PlayerFrame";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function LingoListen({
  text,
  lang,
  label = "Listen",
}: {
  text?: string;
  lang: string;
  label?: string;
}) {
  const { ready, supported, speaking, stop } = useSpeech();
  if (!text) return null;
  if (ready && !supported) {
    return <p className="text-[11px] text-muted">Voice not in this browser — read it instead.</p>;
  }
  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speakTarget(text, lang))}
      className={cn(
        "inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border px-4 text-base font-medium [touch-action:manipulation]",
        speaking
          ? "border-accent/50 bg-accent-dim text-accent"
          : "border-border text-muted active:border-accent/40 active:text-foreground",
      )}
    >
      {speaking ? "Stop" : label}
    </button>
  );
}

export function LingoPlay({
  step,
  lang,
  speechLang,
  onResolved,
  onIntroReady,
  autoplayTarget,
}: {
  step: LingoStep;
  lang: LingoLangId;
  speechLang: string;
  onResolved: (correct: boolean, speak?: boolean, feedback?: string) => void;
  onIntroReady?: () => void;
  autoplayTarget?: boolean;
}) {
  const type = lingoItemType(step);
  if (type === "introduce") {
    return <IntroducePlay step={step} speechLang={speechLang} onReady={onIntroReady} autoplay={autoplayTarget} />;
  }
  if (step.kind === "order") return <OrderPlay step={step} onResolved={onResolved} />;
  if (type === "match") return <MatchPlay step={step} onResolved={onResolved} />;
  if (type === "produce" || step.kind === "type") return <TypePlay step={step} lang={lang} onResolved={onResolved} />;
  if (type === "speak") return <SpeakPlay step={step} speechLang={speechLang} onResolved={onResolved} />;
  return <ChoicePlay step={step} speechLang={speechLang} onResolved={onResolved} />;
}

function IntroducePlay({
  step,
  speechLang,
  onReady,
  autoplay,
}: {
  step: LingoStep;
  speechLang: string;
  onReady?: () => void;
  autoplay?: boolean;
}) {
  useEffect(() => {
    onReady?.();
  }, [onReady, step.id]);

  useEffect(() => {
    if (!autoplay || !step.speakTarget) return;
    const handle = step.speakGloss
      ? speakIntroduce(step.speakTarget, step.speakGloss, speechLang)
      : speakTarget(step.speakTarget, speechLang);
    return () => handle.stop();
  }, [autoplay, step.speakGloss, step.speakTarget, speechLang, step.id]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{step.prompt}</p>
      {step.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- lingo situation art
        <img src={step.image} alt={step.native ?? "Word picture"} className="mx-auto max-h-40 w-full object-contain" />
      ) : null}
      <p className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">{step.native}</p>
      {step.phonetic ? <p className="text-center text-sm text-muted">{step.phonetic}</p> : null}
      {step.meaning ? <p className="text-center text-lg text-foreground/85">{step.meaning}</p> : null}
      <div className="flex justify-center">
        <LingoListen text={step.speakTarget ?? step.native} lang={speechLang} />
      </div>
    </div>
  );
}

function NativeBlock({
  step,
  speechLang,
  huge,
}: {
  step: LingoStep;
  speechLang: string;
  huge?: boolean;
}) {
  if (!step.native) return null;
  return (
    <div className="space-y-2">
      <p className={cn("font-semibold tracking-tight text-balance", huge ? "text-3xl leading-tight sm:text-4xl" : "text-2xl leading-tight")}>
        {step.native}
      </p>
      {step.phonetic ? <p className="text-sm text-muted">{step.phonetic}</p> : null}
      <LingoListen text={step.speakTarget ?? step.speech ?? step.native} lang={speechLang} />
    </div>
  );
}

function ChoicePlay({
  step,
  speechLang,
  onResolved,
}: {
  step: LingoStep;
  speechLang: string;
  onResolved: (correct: boolean, speak?: boolean, feedback?: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const choices = step.choices ?? [];
  const locked = picked !== null;
  const selected = choices.find((choice) => choice.id === picked);
  const type = lingoItemType(step);

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      {type === "listen-pick" || step.kind === "listen" ? (
        <NativeBlock step={step} speechLang={speechLang} huge />
      ) : step.native && type !== "contrast" && !(step.choices ?? []).some((choice) => choice.label === step.native) ? (
        <div className="flex flex-wrap items-center gap-2">
          <LingoListen text={step.speakTarget ?? step.speech ?? step.native} lang={speechLang} />
        </div>
      ) : null}
      <div className="space-y-2">
        {choices.map((choice) => {
          const isPick = picked === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={locked}
              onClick={() => {
                setPicked(choice.id);
                onResolved(
                  choice.correct,
                  false,
                  choice.correct ? step.speakFeedbackCorrect ?? step.why : step.speakFeedbackWrong ?? step.why,
                );
              }}
              className={cn(
                "w-full rounded-2xl border px-4 py-4 text-left text-base leading-6 transition min-h-14",
                !locked && "border-border active:border-accent/50 active:bg-surface-2",
                locked && choice.correct && "border-ok/50 bg-ok/10",
                locked && isPick && !choice.correct && "border-danger/50 bg-danger/10",
                locked && !isPick && !choice.correct && "border-border opacity-60",
              )}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
      {selected ? (
        <p className={cn("text-sm leading-6", selected.correct ? "text-ok" : "text-danger")}>
          {selected.correct ? step.speakFeedbackCorrect ?? step.why : step.speakFeedbackWrong ?? step.why}
        </p>
      ) : null}
    </div>
  );
}

function OrderPlay({
  step,
  onResolved,
}: {
  step: LingoStep;
  onResolved: (correct: boolean) => void;
}) {
  const [pool] = useState(() => shuffle(step.items ?? []));
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const remaining = pool.filter((item) => !picked.includes(item.id));
  const correct = done && JSON.stringify(picked) === JSON.stringify(step.correctOrder ?? []);

  function tap(id: string) {
    if (done) return;
    const next = [...picked, id];
    setPicked(next);
    if (next.length === pool.length) {
      const ok = JSON.stringify(next) === JSON.stringify(step.correctOrder ?? []);
      setDone(true);
      onResolved(ok);
    }
  }

  function undo() {
    if (done || !picked.length) return;
    setPicked(picked.slice(0, -1));
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      <div className="min-h-16 rounded-2xl border border-accent/20 bg-accent-dim/30 p-3">
        {picked.length ? (
          <div className="flex flex-wrap gap-2">
            {picked.map((id, index) => {
              const item = pool.find((entry) => entry.id === id);
              const rightSlot = step.correctOrder?.[index] === id;
              return (
                <span
                  key={id}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm",
                    done && rightSlot && "border-ok/40 bg-ok/10",
                    done && !rightSlot && "border-danger/40 bg-danger/10",
                    !done && "border-accent/30 bg-surface",
                  )}
                >
                  {item?.label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">Tap words in order.</p>
        )}
      </div>
      {remaining.length ? (
        <div className="flex flex-wrap gap-2">
          {remaining.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => tap(item.id)}
              className="min-h-12 rounded-full border border-border bg-surface-2 px-4 py-2 text-base active:border-accent/50"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
      {!done && picked.length ? (
        <button type="button" onClick={undo} className="text-sm text-muted underline-offset-2 hover:underline">
          Undo last
        </button>
      ) : null}
      {done ? (
        <p className={cn("text-sm leading-6", correct ? "text-ok" : "text-danger")}>
          {correct ? "That’s the line." : `Target: ${step.native}.`} {step.why}
        </p>
      ) : null}
    </div>
  );
}

function MatchPlay({
  step,
  onResolved,
}: {
  step: LingoStep;
  onResolved: (correct: boolean) => void;
}) {
  const pairs = step.pairs ?? [];
  const [lefts] = useState(() => shuffle(pairs.map((pair) => pair.left)));
  const [rights] = useState(() => shuffle(pairs.map((pair) => pair.right)));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [miss, setMiss] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const complete = Object.keys(matched).length === pairs.length;

  function pairRight(right: string) {
    if (done || !selectedLeft) return;
    const expected = pairs.find((pair) => pair.left === selectedLeft)?.right;
    if (expected === right) {
      const next = { ...matched, [selectedLeft]: right };
      setMatched(next);
      setSelectedLeft(null);
      setMiss(null);
      if (Object.keys(next).length === pairs.length) {
        setDone(true);
        onResolved(true);
      }
    } else {
      setMiss(right);
      setSelectedLeft(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
        <div className="space-y-2">
          {lefts.map((left) => (
            <button
              key={left}
              type="button"
              disabled={done || Boolean(matched[left])}
              onClick={() => setSelectedLeft(left)}
              className={cn(
                "min-h-14 w-full rounded-2xl border px-3 py-3 text-left text-sm leading-6",
                matched[left] && "border-ok/40 bg-ok/10",
                selectedLeft === left && "border-accent bg-accent-dim",
                !matched[left] && selectedLeft !== left && "border-border active:border-accent/40",
              )}
            >
              {left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((right) => {
            const used = Object.values(matched).includes(right);
            return (
              <button
                key={right}
                type="button"
                disabled={done || used || !selectedLeft}
                onClick={() => pairRight(right)}
                className={cn(
                  "min-h-14 w-full rounded-2xl border px-3 py-3 text-left text-sm leading-6",
                  used && "border-ok/40 bg-ok/10",
                  miss === right && "border-danger/40 bg-danger/10",
                  !used && "border-border active:border-accent/40",
                  !selectedLeft && !used && "opacity-70",
                )}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {complete ? (
        <p className="text-sm leading-6 text-ok">Linked. {step.why}</p>
      ) : (
        <p className="text-xs text-muted">Tap a left card, then the matching right card.</p>
      )}
    </div>
  );
}

function TypePlay({
  step,
  lang,
  onResolved,
}: {
  step: LingoStep;
  lang: LingoLangId;
  onResolved: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const answers = useMemo(() => step.answers ?? [], [step.answers]);
  const ok = done && answersMatch(value, answers, lang);

  function submit() {
    if (done || !value.trim()) return;
    const correct = answersMatch(value, answers, lang);
    setDone(true);
    onResolved(correct);
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      {step.native && step.answers?.[0] !== step.native ? (
        <p className="text-2xl font-semibold">{step.native}</p>
      ) : null}
      <input
        value={value}
        disabled={done}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
        }}
        className="min-h-14 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-lg outline-none focus:border-accent"
        placeholder="Type here"
      />
      {done ? (
        <p className={cn("text-sm leading-6", ok ? "text-ok" : "text-danger")}>
          {ok ? "Yes." : `Aim for “${answers[0]}”.`} {step.why}
        </p>
      ) : (
        <PlayerButton onClick={submit} disabled={!value.trim()}>
          Check
        </PlayerButton>
      )}
    </div>
  );
}

function hasMic() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

function SpeakPlay({
  step,
  speechLang,
  onResolved,
}: {
  step: LingoStep;
  speechLang: string;
  onResolved: (correct: boolean, speak?: boolean, feedback?: string) => void;
}) {
  const [done, setDone] = useState(false);
  if (!hasMic()) {
    return <ProduceFallback step={step} onResolved={onResolved} speechLang={speechLang} />;
  }

  return (
    <div className="space-y-5">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      <NativeBlock step={step} speechLang={speechLang} huge />
      {step.meaning ? <p className="text-base text-muted">{step.meaning}</p> : null}
      {done ? (
        <p className="text-sm leading-6 text-ok">{step.speakFeedbackCorrect ?? step.why}</p>
      ) : (
        <PlayerButton
          onClick={() => {
            setDone(true);
            onResolved(true, true, step.speakFeedbackCorrect ?? step.why);
          }}
        >
          I said it
        </PlayerButton>
      )}
    </div>
  );
}

function ProduceFallback({
  step,
  speechLang,
  onResolved,
}: {
  step: LingoStep;
  speechLang: string;
  onResolved: (correct: boolean, speak?: boolean, feedback?: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-8">{step.prompt}</p>
      <NativeBlock step={step} speechLang={speechLang} huge />
      <PlayerButton onClick={() => onResolved(true, false, step.speakFeedbackCorrect ?? step.why)}>
        Continue
      </PlayerButton>
    </div>
  );
}
