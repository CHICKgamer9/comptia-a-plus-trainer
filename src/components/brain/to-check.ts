import type { BrainItem } from "@/content/brain/types";
import type { PathCheck } from "@/content/types";

export function brainToCheck(item: BrainItem): PathCheck | null {
  if (item.kind === "truefalse") {
    return {
      id: item.id,
      type: "truefalse",
      prompt: item.prompt,
      answer: Boolean(item.answer),
      why: item.why,
    };
  }
  if (!item.choices?.length) return null;
  return {
    id: item.id,
    type: "choice",
    prompt: item.prompt,
    why: item.why,
    choices: item.choices.map((label, index) => ({
      id: `${item.id}-${index}`,
      label,
      correct: index === item.correct,
      why: item.why ?? "",
    })),
  };
}
