"use client";

import { examReadiness, overallReadiness } from "@/lib/readiness";
import { useProgress } from "@/components/ProgressProvider";
import { PageHeader } from "@/components/ui";
import { ReadinessCard, RubricNote } from "@/components/ReadinessPanel";

export function ReadyView() {
  const { progress } = useProgress();
  const overall = overallReadiness(progress);
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");

  return (
    <div>
      <PageHeader
        kicker="Readiness"
        title="Are you ready to sit?"
        description="Honest gates, not vibes. Core 1 and Core 2 are scored separately. Exam-ready only when lessons, quizzes, lab volume, and coverage all clear the bar."
      />
      <RubricNote className="mb-6 max-w-3xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <ReadinessCard report={overall} />
        <ReadinessCard report={core1} />
        <ReadinessCard report={core2} />
      </div>
    </div>
  );
}
