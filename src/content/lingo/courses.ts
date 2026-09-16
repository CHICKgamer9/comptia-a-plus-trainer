import type { LingoCourseMeta, LingoLangId } from "./types";
import { LINGO_LANGS } from "./types";

export const LINGO_COURSES: Record<LingoLangId, LingoCourseMeta> = {
  fr: {
    id: "fr",
    title: "French",
    nativeName: "Français",
    mark: "FR",
    blurb: "Greetings to survival phrases. Tap, match, type, and say it — one prompt at a time.",
    speechLang: "fr-FR",
    accent: "#60a5fa",
    accentDim: "#1e3a8a",
  },
  id: {
    id: "id",
    title: "Indonesian",
    nativeName: "Bahasa Indonesia",
    mark: "ID",
    blurb: "Latin script, friendly word order, and phrases you can use in a warung or an airport queue.",
    speechLang: "id-ID",
    accent: "#34d399",
    accentDim: "#064e3b",
  },
  is: {
    id: "is",
    title: "Icelandic",
    nativeName: "Íslenska",
    mark: "IS",
    blurb: "Real þ, ð, æ, and ö. Beginner path with phonetic hints when the voice in your browser is shy.",
    speechLang: "is-IS",
    accent: "#67e8f9",
    accentDim: "#164e63",
  },
};

export const LINGO_COURSE_LIST = LINGO_LANGS.map((id) => LINGO_COURSES[id]);

export const LINGO_ACCENT = "#f59e0b";
export const LINGO_ACCENT_DIM = "#78350f";
