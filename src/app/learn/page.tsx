import type { Metadata } from "next";
import { CoursePath } from "@/components/CoursePath";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Learn
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">Pick a path</h1>
      <p className="mx-auto mt-3 mb-8 max-w-md text-center text-sm leading-6 text-muted">
        One concept, then a try, then a short why. You cannot skim a domain essay — the path only
        advances when you continue.
      </p>
      <h2 className="mb-3 text-center text-xs uppercase tracking-wider text-muted">Core 1</h2>
      <CoursePath exam="220-1101" />
      <h2 className="mt-10 mb-3 text-center text-xs uppercase tracking-wider text-muted">Core 2</h2>
      <CoursePath exam="220-1102" />
    </div>
  );
}
