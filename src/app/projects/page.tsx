import type { Metadata } from "next";
import { isSubjectId } from "@/content/registry";
import { PROJECT_COUNTS } from "@/content/projects";
import { ProjectsCatalog } from "@/components/ProjectsCatalog";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ hub?: string }>;
}) {
  const { hub } = await searchParams;
  const initialHub = hub && isSubjectId(hub) ? hub : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Projects
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">Hands-on, one hub at a time</h1>
      <p className="mx-auto mt-3 mb-8 max-w-lg text-center text-sm leading-6 text-muted">
        Real tasks beside Learn, Quizzes, Lab, and Brain — Tech through Digital. Tick the done-when
        list, keep progress on this device, pick up XP. {PROJECT_COUNTS.total} projects, at least{" "}
        {PROJECT_COUNTS.minPerHub} in every subject. Not a syllabus and not CompTIA.
      </p>
      <ProjectsCatalog key={initialHub ?? "all"} initialHub={initialHub} />
    </div>
  );
}
