import type { Metadata } from "next";
import Link from "next/link";
import { domains } from "@/content/registry";
import { quizzes } from "@/content/quizzes";
import { QuizCatalog } from "@/components/CatalogFilters";

export const metadata: Metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Practice
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">One problem at a time</h1>
      <p className="mx-auto mt-3 mb-6 max-w-md text-center text-sm leading-6 text-muted">
        Practice explains immediately. Tech quick drill is 10 questions. Objective codes show on A+ cards.
      </p>
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <Link
          href="/practice/mock/core1"
          className="rounded-3xl border border-accent/40 bg-surface p-5 hover:border-accent"
        >
          <p className="text-[11px] uppercase tracking-wider text-accent">Timed mock</p>
          <p className="mt-1 font-semibold">Core 1 · 220-1201</p>
          <p className="mt-1 text-sm text-muted">20 min · no instant explain · study aid</p>
        </Link>
        <Link
          href="/practice/mock/core2"
          className="rounded-3xl border border-border bg-surface p-5 hover:border-accent/40"
        >
          <p className="text-[11px] uppercase tracking-wider text-muted">Timed mock</p>
          <p className="mt-1 font-semibold">Core 2 · 220-1202</p>
          <p className="mt-1 text-sm text-muted">Same rules · official domain weights at the end</p>
        </Link>
        <Link
          href="/practice/pbq"
          className="rounded-3xl border border-border bg-surface p-5 hover:border-accent/40 sm:col-span-2"
        >
          <p className="text-[11px] uppercase tracking-wider text-muted">PBQ</p>
          <p className="mt-1 font-semibold">Ports, troubleshooting order, parts, SODIMM/FRU</p>
        </Link>
      </div>
      <QuizCatalog
        quizzes={quizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          domainId: quiz.domainId,
          questionCount: quiz.questions.length,
        }))}
        domains={domains}
      />
    </div>
  );
}
