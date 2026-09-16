"use client";

import { examReadiness } from "@/lib/readiness";
import { examForTrack } from "@/lib/exam";
import { useProgress } from "@/components/ProgressProvider";
import { PageHeader } from "@/components/ui";
import { ReadinessCard, RubricNote } from "@/components/ReadinessPanel";
import { SpeakBar } from "@/components/SpeakBar";
import { joinSpeech } from "@/lib/speech";
import Link from "next/link";

export function ReadyView() {
  const { progress } = useProgress();
  const track = progress.examTrack === "v14" ? "v14" : "v15";
  const core1 = examReadiness(progress, examForTrack(1, track));
  const core2 = examReadiness(progress, examForTrack(2, track));

  return (
    <div>
      <PageHeader
        kicker="A+ Ready · Tech"
        title="Objectives in the last 14 days"
        description="% of exam objectives with a passed quiz in the last 14 days, weighted by official domain percentages — not XP. Default track 220-1201 / 220-1202."
      />
      <p className="mb-4 text-sm text-muted">
        This meter is Tech-hub only.{" "}
        <Link href="/progress" className="text-accent hover:underline">
          Open Progress
        </Link>{" "}
        for every hub.
      </p>
      <div className="mb-4">
        <SpeakBar
          narration={{
            id: "ready-headline",
            prompt: joinSpeech([
              "A plus ready.",
              core1.label,
              `${core1.percent} percent.`,
              core1.status,
            ]),
          }}
        />
      </div>
      <RubricNote className="mb-6 max-w-3xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <ReadinessCard report={core1} />
        <ReadinessCard report={core2} />
      </div>
    </div>
  );
}
