import type { SubjectId } from "./types";

export interface SubjectMeta {
  id: SubjectId;
  title: string;
  mark: string;
  kicker: string;
  blurb: string;
  today: string;
  accent: string;
  accentDim: string;
}

export const SUBJECTS: SubjectMeta[] = [
  {
    id: "tech",
    title: "Tech",
    mark: "A+",
    kicker: "CompTIA A+",
    blurb: "Core 1 and Core 2 paths, quizzes, and a helpdesk lab. Replace the part that actually failed.",
    today: "Continue an A+ path or generate a ticket.",
    accent: "#2dd4bf",
    accentDim: "#134e4a",
  },
  {
    id: "maths",
    title: "Maths",
    mark: "∑",
    kicker: "Number sense",
    blurb: "Fractions, percentages, algebra, and geometry you can actually use — try it, then see why.",
    today: "A short path that makes the next trick obvious.",
    accent: "#a78bfa",
    accentDim: "#3b0764",
  },
  {
    id: "science",
    title: "Science",
    mark: "⚛",
    kicker: "How the world works",
    blurb: "Atoms, forces, energy, cells, and ecosystems. Models first, then a check that bites.",
    today: "Poke a model until it clicks.",
    accent: "#4ade80",
    accentDim: "#14532d",
  },
  {
    id: "history",
    title: "History",
    mark: "H",
    kicker: "Cause and choice",
    blurb: "World stories with Australian hooks. Evidence, decisions, and what changed — not a date dump.",
    today: "Step into a moment and choose.",
    accent: "#fbbf24",
    accentDim: "#78350f",
  },
];

export const SUBJECT_IDS = SUBJECTS.map((subject) => subject.id);

export function isSubjectId(value: string): value is SubjectId {
  return (SUBJECT_IDS as string[]).includes(value);
}

export function getSubject(id: string) {
  return SUBJECTS.find((subject) => subject.id === id);
}
