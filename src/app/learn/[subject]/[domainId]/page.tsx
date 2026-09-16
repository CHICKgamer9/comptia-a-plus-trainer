import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { domains, getDomain, getLessonByDomain, isSubjectId } from "@/content";
import { LessonView } from "@/components/LessonView";

export function generateStaticParams() {
  return domains.map((domain) => ({ subject: domain.subject, domainId: domain.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; domainId: string }>;
}): Promise<Metadata> {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  return { title: domain ? domain.title : "Lesson" };
}

export default async function SubjectLessonPage({
  params,
}: {
  params: Promise<{ subject: string; domainId: string }>;
}) {
  const { subject, domainId } = await params;
  if (!isSubjectId(subject)) notFound();
  const domain = getDomain(domainId);
  const lesson = getLessonByDomain(domainId);
  if (!domain || !lesson || domain.subject !== subject) notFound();

  return <LessonView domain={domain} lesson={lesson} />;
}
