import { cn } from "@/lib/cn";
import type { Difficulty, ExamId, ScenarioTheme } from "@/content/types";
import { difficultyLabel, examShort, themeLabel } from "@/lib/labels";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "warn" | "ok" | "danger" | "muted";
  className?: string;
}) {
  const tones = {
    default: "border-border bg-surface-2 text-foreground/80",
    accent: "border-accent/30 bg-accent-dim text-accent",
    warn: "border-warn/30 bg-warn/10 text-warn",
    ok: "border-ok/30 bg-ok/10 text-ok",
    danger: "border-danger/30 bg-danger/10 text-danger",
    muted: "border-border bg-transparent text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ExamBadge({ exam }: { exam: ExamId }) {
  return (
    <Badge tone={exam === "220-1201" || exam === "220-1101" ? "accent" : "warn"}>
      {examShort(exam)} · {exam}
    </Badge>
  );
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <Badge tone={level === "hard" ? "danger" : level === "medium" ? "warn" : "ok"}>
      {difficultyLabel(level)}
    </Badge>
  );
}

export function ThemeBadge({ theme }: { theme: ScenarioTheme }) {
  return <Badge>{themeLabel(theme)}</Badge>;
}

export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="font-mono text-foreground/80">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {kicker}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </Card>
  );
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={cn("text-muted", compact ? "text-[11px] leading-5" : "text-xs leading-5")}>
      TicketBench is an independent study tool for Tech (CompTIA A+), a shelf of school
      subjects, hands-on projects, language courses, and a Brain Gym daily challenge. It is not
      affiliated with, endorsed by, or sponsored by CompTIA, Brilliant, Duolingo, or any official
      curriculum. CompTIA A+® is a registered trademark of CompTIA. Exam objectives change — verify
      current requirements on CompTIA’s site before you sit. Brain Gym is not an IQ test. Language
      paths are beginner practice. Projects are practice tasks, not a syllabus.
    </p>
  );
}
