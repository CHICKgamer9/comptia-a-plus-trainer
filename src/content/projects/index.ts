import { SUBJECTS } from "../subjects";
import type { DomainId, Project, SubjectId } from "../types";
import { makeLifeProjects } from "./make-life";
import { stemProjects } from "./stem";
import { worldProjects } from "./world";

export const projects: Project[] = [...stemProjects, ...worldProjects, ...makeLifeProjects];

const byId = new Map(projects.map((project) => [project.id, project]));

export function getProject(id: string) {
  return byId.get(id);
}

export function getProjectsBySubject(subject: SubjectId) {
  return projects.filter((project) => project.subject === subject);
}

export function projectHref(project: Pick<Project, "id"> | string) {
  const id = typeof project === "string" ? project : project.id;
  return `/projects/${id}`;
}

export function projectsHubHref(subject?: SubjectId) {
  return subject ? `/projects?hub=${subject}` : "/projects";
}

export function suggestedProjectForPath(
  pathId: DomainId,
  completedIds: string[] = [],
  subject?: SubjectId,
) {
  const linked = projects.filter((project) => project.pathIds?.includes(pathId));
  const fromLinked =
    linked.find((project) => !completedIds.includes(project.id)) ?? linked[0];
  if (fromLinked) return fromLinked;
  if (!subject) return undefined;
  const hub = getProjectsBySubject(subject);
  return hub.find((project) => !completedIds.includes(project.id)) ?? hub[0];
}

function assertProjectCatalog() {
  const seen = new Set<string>();
  for (const project of projects) {
    if (seen.has(project.id)) {
      throw new Error(`Duplicate project id: ${project.id}`);
    }
    seen.add(project.id);
    if (project.steps.length < 3) {
      throw new Error(`${project.id} needs at least 3 steps`);
    }
    if (project.checklist.length < 3) {
      throw new Error(`${project.id} needs at least 3 done-when checks`);
    }
  }
  const short = SUBJECTS.filter((subject) => getProjectsBySubject(subject.id).length < 3);
  if (short.length) {
    throw new Error(
      `Every hub needs at least 3 projects. Short: ${short
        .map((subject) => `${subject.id}=${getProjectsBySubject(subject.id).length}`)
        .join(", ")}`,
    );
  }
}

assertProjectCatalog();

export const PROJECT_COUNTS = {
  total: projects.length,
  bySubject: Object.fromEntries(
    SUBJECTS.map((subject) => [subject.id, getProjectsBySubject(subject.id).length]),
  ) as Record<SubjectId, number>,
  minPerHub: 3,
} as const;
