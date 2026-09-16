import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SUBJECTS,
  challengeHref,
  getDomainsBySubject,
  getSubject,
  isSubjectId,
} from "@/content/registry";
import { getChallengesBySubject } from "@/content/challenges";
import { PathCatalog } from "@/components/PathCatalog";

export function generateStaticParams() {
  return SUBJECTS.map((subject) => ({ subject: subject.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const meta = getSubject(subject);
  return { title: meta ? meta.title : "Learn" };
}

export default async function SubjectLearnPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  if (!isSubjectId(subject)) notFound();
  const meta = getSubject(subject);
  if (!meta) notFound();
  const challenges = getChallengesBySubject(subject);
  const count = getDomainsBySubject(subject).length;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        {meta.kicker}
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">{meta.title}</h1>
      <p className="mx-auto mt-3 mb-2 max-w-md text-center text-sm leading-6 text-muted">
        {meta.blurb}
      </p>
      <p className="mb-8 text-center font-mono text-xs text-muted">{count} paths</p>
      <PathCatalog subject={subject} />
      {challenges.length ? (
        <div className="mt-10">
          <h2 className="mb-3 text-center text-xs uppercase tracking-wider text-muted">Challenge</h2>
          <ul className="grid gap-3">
            {challenges.map((item) => (
              <li key={item.id}>
                <Link
                  href={challengeHref(item.id)}
                  className="block rounded-3xl border border-border bg-surface px-4 py-4 hover:border-accent/40"
                >
                  <p className="text-[11px] uppercase tracking-wider text-accent">{item.ticketId}</p>
                  <p className="mt-1 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-8 text-center">
        <Link href="/learn" className="text-sm text-muted hover:text-foreground">
          ← All subjects
        </Link>
      </p>
    </div>
  );
}
