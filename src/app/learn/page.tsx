import type { Metadata } from "next";
import Link from "next/link";
import { SUBJECTS, getDomainsBySubject } from "@/content";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Learn
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">Pick a subject</h1>
      <p className="mx-auto mt-3 mb-8 max-w-md text-center text-sm leading-6 text-muted">
        One concept, then a try, then a short why. Tech keeps Core 1 and Core 2. Maths, Science, and
        History use the same player — not four essay dumps.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {SUBJECTS.map((subject) => {
          const count = getDomainsBySubject(subject.id).length;
          return (
            <Link
              key={subject.id}
              href={`/learn/${subject.id}`}
              className="rounded-3xl border border-border bg-surface p-5 hover:border-accent/40"
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-lg font-mono text-sm font-bold"
                style={{ color: subject.accent, background: subject.accentDim }}
              >
                {subject.mark}
              </span>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{subject.kicker}</p>
              <h2 className="mt-1 text-lg font-semibold">{subject.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{subject.blurb}</p>
              <p className="mt-3 text-xs text-accent">{count} paths</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
