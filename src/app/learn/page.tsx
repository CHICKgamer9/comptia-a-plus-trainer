import type { Metadata } from "next";
import Link from "next/link";
import { SubjectPicker } from "@/components/SubjectPicker";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Learn
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">Pick a subject</h1>
      <p className="mx-auto mt-3 mb-6 max-w-lg text-center text-sm leading-6 text-muted">
        One concept, then a try, then a short why. Each hub has at least 60 paths — browse by topic
        inside a subject. Tech keeps Core 1 and Core 2 exam-gated; extra Tech paths have no exam tag.
      </p>
      <Link
        href="/brain/feed"
        className="mb-8 block rounded-3xl border border-accent/30 bg-surface p-5 text-center active:border-accent/50"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Replace the scroll</p>
        <p className="mt-1 text-lg font-semibold">Open phone feed · Brain Gym</p>
        <p className="mt-1 text-sm text-muted">
          Full-viewport challenge cards. Use this instead of doom scrolling. Daily 2-hour desk still
          lives at the Brain hub.
        </p>
      </Link>
      <SubjectPicker />
    </div>
  );
}
