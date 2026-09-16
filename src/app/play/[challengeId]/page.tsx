import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { challenges, getChallenge } from "@/content/challenges";
import { ScenarioRunner } from "@/components/ScenarioRunner";

export function generateStaticParams() {
  return challenges.map((item) => ({ challengeId: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}): Promise<Metadata> {
  const { challengeId } = await params;
  const challenge = getChallenge(challengeId);
  return { title: challenge ? challenge.title : "Challenge" };
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  const challenge = getChallenge(challengeId);
  if (!challenge) notFound();
  return <ScenarioRunner scenario={challenge} />;
}
