import type { LearnBeat, Lesson, PathCheck, SubjectId } from "@/content/types";

export interface StarterSeed {
  id: SubjectId;
  title: string;
  hook: string;
  tryPrompt: string;
  choices: [string, string, string];
  why: string;
  takeaway: string;
}

function sixWords(text: string, fallback: string) {
  const words = text.replace(/[“”"]/g, "").split(/\s+/).filter(Boolean);
  if (words.length >= 4 && words.length <= 8) return text.replace(/\.$/, "");
  return fallback;
}

export function starterBeatsFromSeed(seed: StarterSeed): LearnBeat[] {
  const lockLine = seed.takeaway.replace(/\s+/g, " ").trim();
  const check: PathCheck = {
    id: `${seed.id}-start-check`,
    type: "choice",
    prompt: seed.tryPrompt,
    choices: seed.choices.map((label, index) => ({
      id: String.fromCharCode(97 + index),
      label,
      correct: index === 0,
      why: seed.why,
    })),
  };
  return [
    {
      id: `${seed.id}-start-hook`,
      type: "hook",
      title: seed.title.replace(/A 4-minute /i, "").replace(/ bite$/i, "") || seed.title,
      iCan: sixWords(seed.hook.split(".")[0] ?? "", "meet the first concrete claim"),
      speak: seed.hook.split(/(?<=[.!?])\s+/)[0] ?? seed.hook,
      body: [seed.hook],
      objective: seed.hook,
    },
    {
      id: `${seed.id}-start-see`,
      type: "see",
      title: "See the claim",
      iCan: "read the labelled claim once",
      speak: seed.takeaway.split(/(?<=[.!?])\s+/)[0] ?? seed.takeaway,
      body: [seed.takeaway],
      figure: {
        kind: "diagram",
        diagram: "claim-test",
        alt: `Labelled claim for ${seed.title}`,
        caption: seed.takeaway,
        labels: ["claim", "test"],
      },
      termsIntroduced: [seed.takeaway.split(" ")[0] ?? "claim"],
    },
    {
      id: `${seed.id}-start-try`,
      type: "try",
      title: "Try the move",
      iCan: "try the first decision",
      speak: seed.tryPrompt,
      body: [seed.tryPrompt, `Hold this against the miss: ${seed.choices[1]}`],
    },
    {
      id: `${seed.id}-start-name`,
      type: "name",
      title: "Name it",
      iCan: "name the working idea",
      speak: seed.takeaway,
      body: [seed.takeaway],
      termsIntroduced: seed.takeaway
        .split(/[.,]/)
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2),
    },
    {
      id: `${seed.id}-start-contrast`,
      type: "contrast",
      title: "Hold it against the miss",
      iCan: "contrast the miss with the hit",
      speak: seed.why.split(/(?<=[.!?])\s+/)[0] ?? seed.why,
      body: [seed.why, `Not this: ${seed.choices[1]}`],
    },
    {
      id: `${seed.id}-start-decide`,
      type: "decide",
      title: "Decide",
      iCan: "pick the working answer",
      speak: seed.tryPrompt,
      lockLine,
      cardHook: lockLine,
      check,
      speakFeedbackCorrect: seed.why.split(/(?<=[.!?])\s+/)[0] ?? seed.why,
      speakFeedbackWrong: seed.why.split(/(?<=[.!?])\s+/)[0] ?? seed.why,
    },
    {
      id: `${seed.id}-start-lock`,
      type: "lock",
      title: "Keep this line",
      iCan: "repeat the lock line",
      speak: lockLine,
      lockLine,
      body: [lockLine],
    },
  ];
}

export function starterLessonFromSeed(seed: StarterSeed): Lesson {
  const beats = starterBeatsFromSeed(seed);
  const title = seed.title.replace(/A 4-minute /i, "").replace(/ bite$/i, "");
  return {
    id: `${seed.id}-start-essentials`,
    domainId: `${seed.id}-start`,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    minutes: 6,
    intro: seed.hook,
    objective: seed.takeaway,
    lockLine: seed.takeaway,
    beats,
    sections: [
      {
        heading: seed.takeaway.slice(0, 42),
        paragraphs: [seed.hook, seed.takeaway],
      },
    ],
    keyTakeaways: [seed.takeaway],
  };
}
