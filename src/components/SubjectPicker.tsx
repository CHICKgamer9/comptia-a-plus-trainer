"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SUBJECT_GROUPS, SUBJECTS, getDomainsBySubject, getSubject } from "@/content/registry";
import { getProjectsBySubject, projectsHubHref } from "@/content/projects";
import { starterHref } from "@/content/starters";
import type { SubjectId } from "@/content/types";
import { useProgress } from "./ProgressProvider";

export function SubjectPicker({
  doneBySubject,
  preferStarter = false,
}: {
  doneBySubject?: Partial<Record<SubjectId, number>>;
  preferStarter?: boolean;
}) {
  const { setLastSubject, progress } = useProgress();
  const router = useRouter();

  function openHub(id: SubjectId) {
    setLastSubject(id);
    const done = (progress.completedLessons ?? []).some((lessonId) =>
      getDomainsBySubject(id).some((domain) => domain.lessonId === lessonId),
    );
    router.push(preferStarter && !done ? starterHref(id) : `/learn/${id}`);
  }

  return (
    <div className="grid gap-8">
      {SUBJECT_GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="text-sm font-semibold tracking-tight">{group.title}</h2>
          <p className="mt-1 mb-3 text-sm text-muted">{group.blurb}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.ids.map((id) => {
              const subject = getSubject(id);
              if (!subject) return null;
              const count = getDomainsBySubject(id).length;
              const done = doneBySubject?.[id];
              const projectCount = getProjectsBySubject(id).length;
              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-3xl border border-border bg-surface hover:border-accent/40"
                >
                  <button
                    type="button"
                    onClick={() => openHub(id)}
                    className="block w-full p-5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-lg font-mono text-sm font-bold"
                        style={{ color: subject.accent, background: subject.accentDim }}
                      >
                        {subject.mark}
                      </span>
                      <p className="font-mono text-xs text-muted">
                        {done != null ? `${done}/` : ""}
                        {count}
                      </p>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">
                      {subject.kicker}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{subject.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{subject.blurb}</p>
                    <p className="mt-3 text-xs text-accent">
                      {preferStarter && !done ? "4-minute start" : `${count} paths`}
                    </p>
                  </button>
                  <Link
                    href={projectsHubHref(id)}
                    onClick={() => setLastSubject(id)}
                    className="block border-t border-border px-5 py-3 text-xs text-muted hover:bg-surface-2 hover:text-foreground"
                  >
                    Try a project · {projectCount} in this hub
                  </Link>
                  {id === "tech" ? (
                    <Link
                      href="/lab"
                      onClick={() => setLastSubject("tech")}
                      className="block border-t border-border px-5 py-3 text-xs text-muted hover:bg-surface-2 hover:text-foreground"
                    >
                      Tech Lab · helpdesk tickets
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className="text-center text-[11px] text-muted">
        {SUBJECTS.length} subjects · {SUBJECTS.reduce((sum, subject) => sum + getDomainsBySubject(subject.id).length, 0)}{" "}
        paths
      </p>
    </div>
  );
}
