import type { LearnBeat, Lesson } from "@/content/types";

export const SCIENCE_START_LOCK =
  "Your skin reads heat flow, not a hidden extra temperature.";

const heatFigure = {
  kind: "diagram" as const,
  diagram: "heat-flow" as const,
  alt: "A metal spoon in hot tea dumps heat into a hand faster than a mug handle.",
  caption: "Same tea temperature. The spoon conducts. The handle does not.",
  labels: ["hot tea", "metal spoon", "heat flow", "mug handle"],
};

export const scienceStartBeats: LearnBeat[] = [
  {
    id: "science-start-hook",
    type: "hook",
    title: "The spoon bites first",
    iCan: "feel why the spoon bites",
    objective: "Meet heat flow through a spoon.",
    speak: "A metal spoon in hot tea burns your fingers. The mug handle does not.",
    body: ["Same cup. Same tea. Two paths into your skin."],
  },
  {
    id: "science-start-see",
    type: "see",
    title: "Two paths, one pot",
    iCan: "read heat flow on the drawing",
    objective: "See conduction versus a slow handle.",
    speak: "Heat races up the metal spoon. The handle leaks heat slowly.",
    body: ["Read the labels. The tea is one temperature. The paths are not equal."],
    figure: heatFigure,
    termsIntroduced: ["heat flow", "metal spoon", "mug handle"],
  },
  {
    id: "science-start-try",
    type: "try",
    title: "Which path hits your hand",
    iCan: "pick the fast heat path",
    objective: "Choose the conducting path.",
    speak: "Tap the path that dumps heat into your fingers first.",
    check: {
      id: "science-start-try",
      type: "choice",
      prompt: "Which path dumps heat into your hand first?",
      choices: [
        {
          id: "a",
          label: "The metal spoon, because metal conducts heat quickly",
          correct: true,
          why: "Metal is a fast path. Your skin reads that flow.",
        },
        {
          id: "b",
          label: "The mug handle, because it touches more tea",
          correct: false,
          why: "The handle is a slow path. It does not dump heat first.",
        },
        {
          id: "c",
          label: "Neither. The spoon is a higher temperature than the tea",
          correct: false,
          why: "The spoon sits in the same tea. It is not a hotter substance.",
        },
      ],
    },
    speakFeedbackCorrect: "The spoon is the fast path. That is conduction.",
    speakFeedbackWrong: "The spoon conducts. The handle does not win the race.",
  },
  {
    id: "science-start-name",
    type: "name",
    title: "Name the mechanism",
    iCan: "name the heat flow conduction",
    objective: "Name conduction.",
    speak: "That race has a name. Conduction is heat moving through a material.",
    body: ["Conduction is heat flowing through stuff that is touching. Metal does it quickly."],
    termsIntroduced: ["conduction"],
  },
  {
    id: "science-start-contrast",
    type: "contrast",
    title: "Temperature is not the burn",
    iCan: "split temperature from heat flow",
    objective: "Contrast temperature with heat flow.",
    speak: "The tea and the spoon share a temperature. Your skin reads the flow.",
    body: [
      "A thermometer in the tea and on the submerged spoon reads the same bath.",
      "Your fingers report how fast heat arrives, not a secret extra temperature.",
    ],
  },
  {
    id: "science-start-decide",
    type: "decide",
    title: "Why the spoon feels hotter",
    iCan: "explain the hotter spoon",
    objective: "Decide why the spoon feels hotter.",
    speak: "Why does a metal spoon in hot tea feel hotter than the mug handle?",
    lockLine: SCIENCE_START_LOCK,
    cardHook: SCIENCE_START_LOCK,
    termsIntroduced: ["conduction", "heat flow"],
    check: {
      id: "science-start-check",
      type: "choice",
      prompt: "Why does a metal spoon in hot tea feel hotter than the tea mug handle?",
      choices: [
        {
          id: "a",
          label: "Metal conducts heat into your hand faster than the mug",
          correct: true,
          why: "Same temperature bath. Different conductivity. Skin reads heat flow.",
        },
        {
          id: "b",
          label: "Metal is always a higher temperature than liquid",
          correct: false,
          why: "The spoon is in the tea. It is not a hotter substance.",
        },
        {
          id: "c",
          label: "The spoon is chemically burning",
          correct: false,
          why: "No new substance. The path is conduction.",
        },
      ],
    },
    speakFeedbackCorrect: "Your skin reads heat flow, not a hidden extra temperature.",
    speakFeedbackWrong: "Name conduction. The spoon is the fast path, not a hotter object.",
  },
  {
    id: "science-start-lock",
    type: "lock",
    title: "Keep this line",
    iCan: "repeat the heat flow line",
    objective: "Lock the heat-flow line.",
    speak: "Your skin reads heat flow, not a hidden extra temperature.",
    lockLine: SCIENCE_START_LOCK,
    body: [SCIENCE_START_LOCK, "Name the mechanism before the slogan."],
  },
];

export const scienceStartLesson: Lesson = {
  id: "science-start-essentials",
  domainId: "science-start",
  title: "The spoon bites first",
  minutes: 6,
  objective: "Name conduction before anyone quizzes the spoon.",
  lockLine: SCIENCE_START_LOCK,
  intro: "A metal spoon in hot tea burns your fingers. The mug handle does not.",
  figure: heatFigure,
  beats: scienceStartBeats,
  sections: [
    {
      heading: "Heat flow, not a hotter object",
      paragraphs: [
        "Metal conducts heat into your hand faster than the mug.",
        SCIENCE_START_LOCK,
      ],
    },
  ],
  keyTakeaways: [SCIENCE_START_LOCK],
};
