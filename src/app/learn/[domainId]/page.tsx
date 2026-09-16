import type { Metadata } from "next";
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

  return <LessonView domain={domain} lesson={lesson} />;
}
