export type BrainCat =
  | "maths"
  | "sequence"
  | "analogy"
  | "syllogism"
  | "estimate"
  | "chance"
  | "code"
  | "spatial"
  | "memory"
  | "reading"
  | "lateral"
  | "logic"
  | "words"
  | "crossword";

export type BrainKind =
  | "choice"
  | "truefalse"
  | "order"
  | "match"
  | "input"
  | "crossword"
  | "reveal"
  | "memory"
  | "crypto"
  | "ladder";

export type BrainDiff = "easy" | "medium" | "hard";

export interface BrainSlot {
  n: number;
  clue: string;
  r: number;
  c: number;
  len: number;
}

export interface BrainItem {
  id: string;
  cat: BrainCat;
  kind: BrainKind;
  diff: BrainDiff;
  minutes: number;
  title: string;
  prompt: string;
  why?: string;
  choices?: string[];
  correct?: number;
  answer?: boolean | string;
  items?: string[];
  order?: number[];
  pairs?: [string, string][];
  extra?: string[];
  size?: number;
  grid?: string;
  across?: BrainSlot[];
  down?: BrainSlot[];
  flash?: string[];
  cipher?: string;
  start?: string;
  goal?: string;
}

export interface BrainCategoryMeta {
  id: BrainCat;
  title: string;
  blurb: string;
  count: number;
  avgMinutes: number;
}

export interface BrainManifest {
  generatedAt: string;
  total: number;
  minFloor: number;
  targetMinutes: number;
  categories: BrainCategoryMeta[];
  recipe: { cat: BrainCat; minutes: number }[];
  wordMinutes: number;
  crosswordCount: number;
  uniqueDaysAt60: number;
  avgMinutes?: number;
}

export const BRAIN_ACCENT = "#c084fc";
export const BRAIN_ACCENT_DIM = "#3b0764";

export const DAILY_TARGET_MINUTES = 120;
