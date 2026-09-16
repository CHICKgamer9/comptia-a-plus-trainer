import { techDomains } from "./domains";
import { schoolDomains } from "./domains-school";
import { generatedDomains } from "./factory/generated-domains";
import { SUBJECTS, SUBJECT_GROUPS, getSubject, getSubjectGroup, isSubjectId } from "./subjects";
import type { Domain, DomainId, ExamId, ScenarioTheme, SubjectId } from "./types";

const EXISTING_CLUSTER: Record<string, string> = {
  "mobile-devices": "Core 1",
  networking: "Core 1",
  hardware: "Core 1",
  "virtualization-cloud": "Core 1",
  "hw-net-troubleshooting": "Core 1",
  "operating-systems": "Core 2",
  security: "Core 2",
  "software-troubleshooting": "Core 2",
  "operational-procedures": "Core 2",
  "number-sense": "Number",
  fractions: "Fractions",
  percentages: "Percentages",
  "algebra-foundations": "Algebra extras",
  "geometry-measure": "Geometry extras",
  "atoms-matter": "Matter extras",
  "forces-motion": "Motion",
  "energy-systems": "Energy extras",
  "cells-life": "Life",
  "ecosystems-au": "Living extras",
  "historical-thinking": "Skills extras",
  "ancient-worlds": "World stories",
  "country-contact": "Australia extras",
  "making-australia": "Australia extras",
  "twentieth-century": "World stories",
};

export function domainCluster(domain: Domain): string {
  if (domain.cluster) return domain.cluster;
  if (domain.exam === "220-1101") return "Core 1";
  if (domain.exam === "220-1102") return "Core 2";
  return EXISTING_CLUSTER[domain.id] ?? "Paths";
}

function withCluster(domain: Domain): Domain {
  return domain.cluster ? domain : { ...domain, cluster: domainCluster(domain) };
}

export const domains: Domain[] = [...techDomains, ...schoolDomains, ...generatedDomains].map(
  withCluster,
);

export {
  techDomains,
  schoolDomains,
  generatedDomains,
  SUBJECTS,
  SUBJECT_GROUPS,
  getSubject,
  getSubjectGroup,
  isSubjectId,
};

export function getDomain(id: string) {
  return domains.find((domain) => domain.id === id);
}

export function getDomainsByExam(exam: ExamId) {
  return domains.filter((domain) => domain.exam === exam);
}

export function getDomainsBySubject(subject: SubjectId) {
  return domains.filter((domain) => domain.subject === subject);
}

export function getClustersForSubject(subject: SubjectId): string[] {
  const seen: string[] = [];
  for (const domain of getDomainsBySubject(subject)) {
    const cluster = domainCluster(domain);
    if (!seen.includes(cluster)) seen.push(cluster);
  }
  return seen;
}

export function pathCountsBySubject(): Record<SubjectId, number> {
  const counts = {} as Record<SubjectId, number>;
  for (const subject of SUBJECTS) {
    counts[subject.id] = getDomainsBySubject(subject.id).length;
  }
  return counts;
}

export function examLabel(exam: ExamId) {
  return exam === "220-1101" ? "Core 1" : "Core 2";
}

export function domainTitle(domain: Domain) {
  if (domain.exam) return `${examLabel(domain.exam)} · ${domain.number}. ${domain.title}`;
  const subject = getSubject(domain.subject);
  return `${subject?.title ?? domain.subject} · ${domain.number}. ${domain.title}`;
}

export function pathHref(domain: Pick<Domain, "subject" | "id">) {
  return `/learn/${domain.subject}/${domain.id}`;
}

export function quizHref(quizId: string) {
  return `/practice/${quizId}`;
}

export function challengeHref(id: string) {
  return `/play/${id}`;
}

export function labThemeForDomain(domainId: DomainId): ScenarioTheme | undefined {
  const map: Record<string, ScenarioTheme> = {
    "mobile-devices": "mobile",
    networking: "network",
    hardware: "hardware",
    "virtualization-cloud": "os",
    "hw-net-troubleshooting": "hardware",
    "operating-systems": "os",
    security: "security",
    "software-troubleshooting": "os",
    "operational-procedures": "security",
  };
  return map[domainId];
}

const counts = pathCountsBySubject();
const under = SUBJECTS.filter((subject) => counts[subject.id] < 60);

if (under.length) {
  throw new Error(
    `Every subject needs at least 60 paths. Under minimum: ${under
      .map((subject) => `${subject.id}=${counts[subject.id]}`)
      .join(", ")}`,
  );
}

export const CONTENT_COUNTS = {
  domains: domains.length,
  bySubject: counts,
  minPaths: 60,
  underMin: under.map((subject) => subject.id),
} as const;
