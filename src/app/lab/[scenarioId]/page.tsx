import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScenario, scenarios } from "@/content";
import { ScenarioRunner } from "@/components/ScenarioRunner";

export function generateStaticParams() {
  return scenarios.map((scenario) => ({ scenarioId: scenario.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  return { title: scenario ? scenario.title : "Ticket" };
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();

  return (
    <div>
      <Link href="/lab" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
        ← Ticket queue
      </Link>
      <ScenarioRunner scenario={scenario} />
    </div>
  );
}
