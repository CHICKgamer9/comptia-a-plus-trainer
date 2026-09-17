import Link from "next/link";
import { cn } from "@/lib/cn";
import { SpeakBar, type Narration } from "./SpeakBar";

export function PlayerFrame({
  kicker,
  title,
  index,
  total,
  children,
  footer,
  narration,
  backHref,
  backLabel = "← Path",
  timer,
}: {
  kicker?: string;
  title?: string;
  index: number;
  total: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  narration?: Narration;
  backHref?: string;
  backLabel?: string;
  timer?: string;
}) {
  const percent = total ? Math.round(((index + 1) / total) * 100) : 0;
  const count = `${Math.min(index + 1, total)}/${total}`;
  return (
    <div className={cn("mx-auto w-full max-w-xl", footer ? "player-bottom-pad" : undefined)}>
      <div
        className={cn(
          "mb-4",
          backHref &&
            "sticky top-0 z-30 -mx-4 border-b border-border/80 bg-background/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:static md:z-auto md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pt-0 md:backdrop-blur-none",
        )}
      >
        <div className="flex items-center gap-2 md:block">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex min-h-11 shrink-0 items-center text-sm text-muted active:text-foreground md:hidden"
            >
              {backLabel}
            </Link>
          ) : null}
          <div className="mb-2 hidden items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-muted md:flex">
            <span className="truncate">{kicker}</span>
            <span className="font-mono text-foreground/70">
              {timer ? `${timer} · ${count}` : count}
            </span>
          </div>
          <p className="min-w-0 flex-1 font-mono text-xs text-foreground/80 md:hidden">
            {timer ? <span className="mr-2 text-accent">{timer}</span> : null}
            {count}
          </p>
          {narration ? (
            <div className="shrink-0 normal-case tracking-normal md:mb-3">
              <SpeakBar narration={narration} />
            </div>
          ) : null}
        </div>
        <Pips index={index} total={total} />
        {title ? (
          <p className="mt-3 hidden text-xs text-muted md:block">{percent}% of this path</p>
        ) : null}
      </div>
      <div
        key={index}
        className="beat-in rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(45,212,191,0.45)] sm:p-8"
      >
        {children}
      </div>
      {footer ? <div className="sticky-action">{footer}</div> : null}
    </div>
  );
}

export function Pips({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex gap-1 pb-2 md:pb-0" aria-hidden>
      {Array.from({ length: total }).map((_, step) => (
        <span
          key={step}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            step < index ? "bg-ok" : step === index ? "bg-accent" : "bg-surface-2",
          )}
        />
      ))}
    </div>
  );
}

export function PlayerButton({
  children,
  onClick,
  disabled,
  tone = "accent",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "accent" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-12 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition [touch-action:manipulation] disabled:cursor-not-allowed disabled:opacity-40",
        tone === "accent"
          ? "bg-accent text-background active:brightness-110 hover:brightness-110"
          : "border border-border text-foreground active:bg-surface-2 hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
