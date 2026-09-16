import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { domains, getDomain, getLessonByDomain } from "@/content";
import { LessonView } from "@/components/LessonView";

export function generateStaticParams() {
  return domains.map((domain) => ({ domainId: domain.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainId: string }>;
}): Promise<Metadata> {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  return { title: domain ? domain.title : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  const lesson = getLessonByDomain(domainId);
  if (!domain || !lesson) notFound();

  return (
    <div>
      <Link href="/learn" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
        ← All domains
      </Link>
      <p className="text-xs uppercase tracking-wider text-muted">
        {domain.exam} · Domain {domain.number} · {domain.weight}
      </p>
      <h1 className="mt-2 mb-6 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
      <LessonView domain={domain} lesson={lesson} />
    </div>
  );
}
