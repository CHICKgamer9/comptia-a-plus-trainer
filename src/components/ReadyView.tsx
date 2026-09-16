"use client";

import { examReadiness, overallReadiness } from "@/lib/readiness";
import { useProgress } from "@/components/ProgressProvider";
import { PageHeader } from "@/components/ui";
import { ReadinessCard, RubricNote } from "@/components/ReadinessPanel";
import { SpeakBar } from "@/components/SpeakBar";
import { joinSpeech } from "@/lib/speech";

export function ReadyView() {
  const { progress } = useProgress();
  const overall = overallReadiness(progress);
  const core1 = examReadiness(progress, "220-1101");
  const core2 = examReadiness(progress, "220-1102");

  return (
    <div>
      <PageHeader
        kicker="Readiness"
        title="Honest gates, not vibes"
        description="Core 1 and Core 2 are separate. Exam-ready only when the path, quizzes, lab volume, and coverage all clear the bar."
      />
      <div className="mb-4">
        <SpeakBar
          narration={{
            id: "ready-headline",
            prompt: joinSpeech([
              "Exam readiness.",
              overall.label,
              `${overall.percent} percent.`,
              overall.status,
              overall.gaps[0]?.text,
            ]),
          }}
        />
      </div>
      <RubricNote className="mb-6 max-w-3xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <ReadinessCard report={overall} />
        <ReadinessCard report={core1} />
        <ReadinessCard report={core2} />
      </div>
    </div>
  );
}
