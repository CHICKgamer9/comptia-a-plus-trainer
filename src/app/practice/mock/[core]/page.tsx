import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MockExam } from "@/components/MockExam";
import type { ExamId } from "@/content/types";

export const metadata: Metadata = {
  title: "Timed mock",
};

export function generateStaticParams() {
  return [{ core: "core1" }, { core: "core2" }];
}

export default async function MockPage({
  params,
}: {
  params: Promise<{ core: string }>;
}) {
  const { core } = await params;
  const exam: ExamId | undefined =
    core === "core1" || core === "1201" || core === "220-1201"
      ? "220-1201"
      : core === "core2" || core === "1202" || core === "220-1202"
        ? "220-1202"
        : undefined;
  if (!exam) notFound();
  return (
    <div>
      <p className="mx-auto mb-6 max-w-xl text-sm text-muted">
        Timed Core mock. Study aid — not an official CompTIA exam.
      </p>
      <MockExam exam={exam} />
    </div>
  );
}
