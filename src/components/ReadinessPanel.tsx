"use client";

import Link from "next/link";
import type { ExamReadiness } from "@/lib/readiness";
import { READINESS_RUBRIC } from "@/lib/readiness";
import { Badge, Card, ProgressBar } from "./ui";
import { cn } from "@/lib/cn";

function toneFor(status: ExamReadiness["status"]) {
  if (status === "Exam-ready") return "ok" as const;
  if (status === "Almost") return "accent" as const;
  if (status === "Getting there") return "warn" as const;
  return "danger" as const;
}

export function ReadinessCard({
  report,
  compact = false,
}: {
  report: ExamReadiness;
  compact?: boolean;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">{report.label}</p>
          <p className="mt-1 font-mono text-3xl">{report.percent}%</p>
        </div>
        <Badge tone={toneFor(report.status)}>{report.status}</Badge>
      </div>
      <div className="mt-3">
        <ProgressBar value={report.percent} />
      </div>
      {!compact ? (
        <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
          {Object.entries(report.parts).map(([key, part]) => (
            <div key={key} className="rounded-lg border border-border px-3 py-2">
              <dt className="capitalize text-muted">{key}</dt>
              <dd className="mt-0.5 font-medium">
                {part.percent}% · {part.detail}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {report.gaps.length ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Top gaps
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {report.gaps.map((gap) => (
              <li key={gap.text}>
                <Link href={gap.href} className="text-accent hover:underline">
                  {gap.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-ok">
          Gates passed for this exam. Retake weak quizzes the week you sit.
        </p>
      )}
      {report.gaps[0] ? (
        <Link
          href={report.gaps[0].href}
          className="mt-4 inline-flex rounded-xl bg-accent px-3 py-2 text-sm font-medium text-background"
        >
          Study this next
        </Link>
      ) : null}
    </Card>
  );
}

export function RubricNote({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1.5 text-xs leading-5 text-muted", className)}>
      {READINESS_RUBRIC.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
