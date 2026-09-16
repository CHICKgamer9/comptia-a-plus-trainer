import type { LingoLangId } from "@/content/lingo/types";

function stripMarks(value: string) {
  return value.normalize("NFD").replace(/\p{M}+/gu, "");
}

/** Fold a typed answer: case, punctuation, and reasonable accent / letter variants. */
export function foldLingo(value: string, lang: LingoLangId): string {
  let next = stripMarks(value).toLowerCase().trim();
  next = next.replace(/['’`´]/g, "");
  next = next.replace(/[^\p{L}\p{N}\s]/gu, " ");
  next = next.replace(/\s+/g, " ").trim();

  if (lang === "fr") {
    next = next.replace(/\bca\b/g, "ca");
  }

  if (lang === "is") {
    next = next
      .replace(/þ/g, "th")
      .replace(/ð/g, "d")
      .replace(/æ/g, "ae")
      .replace(/ö/g, "o")
      .replace(/\bth/g, "th");
  }

  return next;
}

export function answersMatch(input: string, answers: string[], lang: LingoLangId): boolean {
  const folded = foldLingo(input, lang);
  if (!folded) return false;
  return answers.some((answer) => foldLingo(answer, lang) === folded);
}
