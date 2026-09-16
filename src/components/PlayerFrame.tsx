import { cn } from "@/lib/cn";

export function PlayerFrame({
  kicker,
  title,
  index,
  total,
  children,
  footer,
}: {
  kicker?: string;
  title?: string;
  index: number;
  total: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const percent = total ? Math.round(((index + 1) / total) * 100) : 0;
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted">
          <span>{kicker}</span>
          <span className="font-mono text-foreground/70">
            {Math.min(index + 1, total)}/{total}
          </span>
        </div>
        <div className="flex gap-1">
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
        {title ? (
          <p className="mt-3 text-xs text-muted">
            {percent}% of this path
          </p>
        ) : null}
      </div>
      <div key={index} className="beat-in rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(45,212,191,0.45)] sm:p-8">
        {children}
      </div>
      {footer ? <div className="mt-5">{footer}</div> : null}
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
        "w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        tone === "accent"
          ? "bg-accent text-background hover:brightness-110"
          : "border border-border text-foreground hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
