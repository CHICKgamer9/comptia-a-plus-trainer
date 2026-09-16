export const LINGO_LANGS = ["fr", "id", "is"] as const;
export type LingoLangId = (typeof LINGO_LANGS)[number];

export type LingoStepKind = "vocab" | "listen" | "order" | "match" | "type" | "speak";

export interface LingoChoice {
  id: string;
  label: string;
  correct: boolean;
}

export interface LingoPair {
  left: string;
  right: string;
}

export interface LingoOrderItem {
  id: string;
  label: string;
}

export interface LingoStep {
  id: string;
  kind: LingoStepKind;
  prompt: string;
  native?: string;
  phonetic?: string;
  meaning?: string;
  speech?: string;
  choices?: LingoChoice[];
  items?: LingoOrderItem[];
  correctOrder?: string[];
  pairs?: LingoPair[];
  answers?: string[];
  why: string;
}

export interface LingoNode {
  id: string;
  lang: LingoLangId;
  unit: number;
  unitTitle: string;
  skill: string;
  title: string;
  index: number;
  steps: LingoStep[];
}

export interface LingoUnit {
  index: number;
  title: string;
  skill: string;
  nodeIds: string[];
}

export interface LingoCourseMeta {
  id: LingoLangId;
  title: string;
  nativeName: string;
  mark: string;
  blurb: string;
  speechLang: string;
  accent: string;
  accentDim: string;
}

export interface LingoPack extends LingoCourseMeta {
  units: LingoUnit[];
  nodes: LingoNode[];
}

export function isLingoLangId(value: string): value is LingoLangId {
  return (LINGO_LANGS as readonly string[]).includes(value);
}
