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

export interface SubjectGroup {
  id: string;
  title: string;
  blurb: string;
  ids: SubjectId[];
}

export const SUBJECTS: SubjectMeta[] = [
  {
    id: "tech",
    title: "Tech",
    mark: "A+",
    kicker: "CompTIA A+",
    blurb: "Core 1 and Core 2 stay exam-gated. Extra hardware, OS, and shop-craft paths sit beside them — no exam tag.",
    today: "Continue an A+ path or generate a ticket.",
    accent: "#2dd4bf",
    accentDim: "#134e4a",
  },
  {
    id: "maths",
    title: "Maths",
    mark: "∑",
    kicker: "Number sense",
    blurb: "Fractions, algebra, data, and rates you can actually use — try it, then see why.",
    today: "A short path that makes the next trick obvious.",
    accent: "#a78bfa",
    accentDim: "#3b0764",
  },
  {
    id: "science",
    title: "Science",
    mark: "⚛",
    kicker: "How the world works",
    blurb: "Atoms, forces, Earth, bodies, and ecosystems. Models first, then a check that bites.",
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
  {
    id: "english",
    title: "English",
    mark: "Aa",
    kicker: "Literacy",
    blurb: "Sentences, reading moves, and writing that does a job. Grammar as a tool, not a trap.",
    today: "Fix one sentence so the next paragraph behaves.",
    accent: "#fb7185",
    accentDim: "#4c0519",
  },
  {
    id: "geography",
    title: "Geography",
    mark: "◎",
    kicker: "Place and planet",
    blurb: "Maps, climate, cities, and Country. Scale and evidence before the poster slogan.",
    today: "Read a map or a place until the pattern shows.",
    accent: "#38bdf8",
    accentDim: "#0c4a6e",
  },
  {
    id: "coding",
    title: "Coding",
    mark: "</>",
    kicker: "Basics",
    blurb: "Programs as recipes: variables, loops, bugs, and the web. Think before you paste.",
    today: "Make a tiny program do one honest job.",
    accent: "#22d3ee",
    accentDim: "#164e63",
  },
  {
    id: "business",
    title: "Business",
    mark: "$",
    kicker: "Money sense",
    blurb: "Prices, tax, work, and small enterprise. Follow the cash, not the slogan.",
    today: "A money path that refuses magic thinking.",
    accent: "#34d399",
    accentDim: "#064e3b",
  },
  {
    id: "health",
    title: "Health",
    mark: "+",
    kicker: "Body and PE",
    blurb: "Movement, food, sleep, and first aid. Habits with a reason — not a guilt poster.",
    today: "One body system or one safer habit.",
    accent: "#f472b6",
    accentDim: "#831843",
  },
  {
    id: "music",
    title: "Music",
    mark: "♪",
    kicker: "Sound and time",
    blurb: "Beat, pitch, texture, and listening. Hear the parts, then name them.",
    today: "Clap it, then explain it.",
    accent: "#c084fc",
    accentDim: "#3b0764",
  },
  {
    id: "art",
    title: "Art",
    mark: "◇",
    kicker: "Art & design",
    blurb: "Seeing, making, colour, and layout. Design is a decision, not a filter.",
    today: "Look hard, then change one thing on purpose.",
    accent: "#f97316",
    accentDim: "#7c2d12",
  },
  {
    id: "civics",
    title: "Civics",
    mark: "§",
    kicker: "Government",
    blurb: "Rules, parliaments, rights, and how a vote actually moves. Power with receipts.",
    today: "Who decides, and who checks them?",
    accent: "#60a5fa",
    accentDim: "#1e3a8a",
  },
  {
    id: "languages",
    title: "Languages",
    mark: "文",
    kicker: "Intro",
    blurb: "How languages work: sounds, scripts, meaning, and polite contact. Speak French, Indonesian, or Icelandic in the Languages hub — this catalog stays a doorway, not fluency.",
    today: "Open a speak course, or one pattern you can reuse in any language.",
    accent: "#f59e0b",
    accentDim: "#78350f",
  },
  {
    id: "logic",
    title: "Logic",
    mark: "∴",
    kicker: "Critical thinking",
    blurb: "Arguments, fallacies, evidence, and careful probability. Catch the slide.",
    today: "Name the claim, then test it.",
    accent: "#a3e635",
    accentDim: "#365314",
  },
  {
    id: "digital",
    title: "Digital",
    mark: "@",
    kicker: "Citizenship",
    blurb: "Privacy, scams, feeds, and sharing. The internet is a place with consequences.",
    today: "A safer move you can actually keep.",
    accent: "#2dd4bf",
    accentDim: "#115e59",
  },
];

export const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: "core",
    title: "Core tech",
    blurb: "A+ exam paths plus extra shop craft. Readiness still uses only the original domains.",
    ids: ["tech"],
  },
  {
    id: "stem",
    title: "STEM",
    blurb: "Number, nature, code, and careful thinking.",
    ids: ["maths", "science", "coding", "logic"],
  },
  {
    id: "world",
    title: "World",
    blurb: "People, places, power, and languages.",
    ids: ["history", "geography", "civics", "languages"],
  },
  {
    id: "make",
    title: "Make & meaning",
    blurb: "Words, images, and sound.",
    ids: ["english", "art", "music"],
  },
  {
    id: "life",
    title: "Life",
    blurb: "Money, bodies, and being online without getting played.",
    ids: ["business", "health", "digital"],
  },
];

export const SUBJECT_IDS = SUBJECTS.map((subject) => subject.id);

export function isSubjectId(value: string): value is SubjectId {
  return (SUBJECT_IDS as string[]).includes(value);
}

export function getSubject(id: string) {
  return SUBJECTS.find((subject) => subject.id === id);
}

export function getSubjectGroup(id: SubjectId) {
  return SUBJECT_GROUPS.find((group) => group.ids.includes(id));
}
