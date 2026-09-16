import type { LearnBeat, Lesson } from "@/content/types";

export const TECH_START_LOCK =
  "A rising palm rest is a swollen pack. Do not crush it.";

export const TECH_START_CARD_ID = "c-li-ion";

const packFigure = {
  kind: "diagram" as const,
  diagram: "swollen-pack" as const,
  alt: "Laptop side view. A lithium-ion pack under the palm rest has swelled and lifted the trackpad.",
  caption: "The pack sits under the palm rest. A bulge lifts the trackpad. Do not press it flat.",
  labels: ["palm rest", "trackpad", "lithium-ion pack", "bulge"],
};

export const techStartBeats: LearnBeat[] = [
  {
    id: "tech-start-hook",
    type: "hook",
    title: "The palm rest is rising",
    iCan: "spot a pack lifting palm rest",
    objective: "Meet a swollen pack as a ticket, not a slogan.",
    speak: "Name the failing piece before you order a motherboard.",
    body: [
      "A laptop comes in with a trackpad that no longer sits flush. The palm rest has a soft bulge.",
      "You are looking at a part, not a Windows setting.",
    ],
  },
  {
    id: "tech-start-see",
    type: "see",
    title: "One drawing, one story",
    iCan: "read labels on the chassis",
    objective: "See the pack under the palm rest.",
    speak: "The lithium ion pack sits under the palm rest. A bulge lifts the trackpad.",
    body: ["Read the labels on the drawing. The pack is the failing piece."],
    figure: packFigure,
    termsIntroduced: ["palm rest", "trackpad", "lithium-ion pack", "bulge"],
  },
  {
    id: "tech-start-try",
    type: "try",
    title: "Hands off the bulge",
    iCan: "choose not to crush the bulge",
    objective: "Refuse the crush-it instinct.",
    speak: "If you press the bulge flat, the pack can crack and vent.",
    body: ["The bulge is chemistry pushing outward. Flattening it is how cells tear."],
    check: {
      id: "tech-start-try",
      type: "choice",
      prompt: "The bulge is soft. What do your hands do?",
      choices: [
        {
          id: "a",
          label: "Leave it. Power the laptop down. Do not press the palm rest flat.",
          correct: true,
          why: "Pressure on a swollen cell can crack it. Hands off, then isolate the pack.",
        },
        {
          id: "b",
          label: "Press the palm rest until the trackpad sits flush again.",
          correct: false,
          why: "That crushes the pack. Crushing is the failure, not the fix.",
        },
        {
          id: "c",
          label: "Run a battery calibration so Windows shrinks the cell.",
          correct: false,
          why: "A percentage in Windows cannot un-swell chemistry.",
        },
      ],
    },
    speakFeedbackCorrect: "Hands off. Power down. The pack still needs isolating.",
    speakFeedbackWrong: "Do not crush the palm rest. Power down and leave the bulge alone.",
  },
  {
    id: "tech-start-name",
    type: "name",
    title: "Name the failing piece",
    iCan: "call the bulge a swollen pack",
    objective: "Name the lithium-ion pack.",
    speak: "That bulge is a swollen lithium ion pack, not a loose screw.",
    body: [
      "The part under the palm rest is a lithium-ion pack. When it fails, it swells.",
      "Name the pack before you order a board.",
    ],
    termsIntroduced: ["swollen pack", "lithium-ion pack", "isolate"],
  },
  {
    id: "tech-start-contrast",
    type: "contrast",
    title: "Isolate, do not crush",
    iCan: "pick isolate over flatten",
    objective: "Contrast crush versus isolate.",
    speak: "Isolate the pack and power down. Do not crush the palm rest.",
    body: [
      "Crushing the palm rest treats a cell like a dented lid.",
      "Isolating the pack treats it like a chemical that can vent.",
    ],
    termsIntroduced: ["isolate"],
  },
  {
    id: "tech-start-decide",
    type: "decide",
    title: "Pick the first move",
    iCan: "pick the safety first move",
    objective: "Decide the safety-first move on a rising palm rest.",
    speak: "A trackpad is lifting the palm rest. What do you do first?",
    cardId: TECH_START_CARD_ID,
    cardHook: TECH_START_LOCK,
    lockLine: TECH_START_LOCK,
    termsIntroduced: ["swollen pack", "isolate", "palm rest"],
    check: {
      id: "tech-start-check",
      type: "choice",
      prompt: "A laptop trackpad is lifting the palm rest. What do you do first?",
      choices: [
        {
          id: "a",
          label: "Treat it as a swollen pack: power down and do not crush the pack",
          correct: true,
          why: "A rising palm rest is chemistry. Isolate the pack, then replace it.",
        },
        {
          id: "b",
          label: "Tighten the trackpad screws until the bulge flattens",
          correct: false,
          why: "Screws into a swollen pack crush a cell. That is the danger, not the fix.",
        },
        {
          id: "c",
          label: "Reinstall Windows to recalibrate the battery",
          correct: false,
          why: "An operating system cannot un-swell a lithium-ion pack.",
        },
      ],
    },
    speakFeedbackCorrect: "Power down and isolate the pack. Do not crush it.",
    speakFeedbackWrong: "The rising palm rest is a swollen pack. Do not crush it.",
  },
  {
    id: "tech-start-lock",
    type: "lock",
    title: "Keep this line",
    iCan: "repeat the pack safety line",
    objective: "Lock the pack safety line.",
    speak: "A rising palm rest is a swollen pack. Do not crush it.",
    lockLine: TECH_START_LOCK,
    body: [TECH_START_LOCK, "Name the failing piece before you order a motherboard."],
  },
];

export const techStartLesson: Lesson = {
  id: "tech-start-essentials",
  domainId: "tech-start",
  title: "The palm rest is rising",
  minutes: 6,
  objective: "Name and isolate a swollen lithium-ion pack before you crush a palm rest.",
  lockLine: TECH_START_LOCK,
  intro: "A laptop trackpad is lifting the palm rest. Name the failing pack before you order a board.",
  figure: packFigure,
  beats: techStartBeats,
  sections: [
    {
      heading: "The pack under the palm rest",
      paragraphs: [
        "A rising palm rest is a swollen lithium-ion pack. Power down. Do not crush it.",
        "Name the failing piece before you order a motherboard.",
      ],
    },
  ],
  keyTakeaways: [TECH_START_LOCK, "Name the failing piece before you order a motherboard."],
};
