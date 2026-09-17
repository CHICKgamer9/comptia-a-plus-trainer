import type { Metadata } from "next";
import Link from "next/link";
import { SubjectPicker } from "@/components/SubjectPicker";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Learn
      </p>
      <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight md:text-3xl">Pick a subject</h1>
      <p className="mx-auto mt-3 mb-4 hidden max-w-lg text-center text-sm leading-6 text-muted md:mb-6 md:block">
        One concept, then a try, then a short why. Tech keeps Core 1 and Core 2 exam-gated; extra Tech
        paths have no exam tag.
      </p>
      <Link
        href="/brain/feed"
        className="mb-6 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-surface px-4 py-3 active:bg-surface-2"
      >
        <span>
          <span className="block text-[11px] uppercase tracking-[0.16em] text-accent">Brain Gym</span>
          <span className="text-sm font-semibold">Open phone feed</span>
        </span>
        <span className="text-sm text-accent">Go</span>
      </Link>
      <SubjectPicker />
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <Link
          href="/projects"
          className="rounded-3xl border border-border bg-surface p-5 text-center active:border-accent/50"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Hands-on</p>
          <p className="mt-1 text-lg font-semibold">Projects · every subject hub</p>
        </Link>
        <Link
          href="/lingo"
          className="rounded-3xl border border-accent/30 bg-surface p-5 text-center active:border-accent/50"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Speak</p>
          <p className="mt-1 text-lg font-semibold">Languages · FR / ID / IS</p>
        </Link>
      </div>
    </div>
  );
}
