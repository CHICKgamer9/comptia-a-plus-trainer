"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { pathHref } from "@/content/registry";
import { useProgress } from "./ProgressProvider";
import { nextDomainPreferring } from "./CoursePath";

export function useContinueHref() {
  const { progress } = useProgress();
  const upcoming = nextDomainPreferring(progress.completedLessons, progress.lastSubject);
  if (upcoming) return pathHref(upcoming);
  if (progress.lastSubject) return `/learn/${progress.lastSubject}`;
  return "/learn";
}

export function ContinueLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const href = useContinueHref();
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function RandomTicketLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button type="button" className={className} onClick={() => router.push("/lab")}>
      {children}
    </button>
  );
}
