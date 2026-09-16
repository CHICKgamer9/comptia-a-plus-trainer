import type { Domain, Lesson, PathCheck, Quiz, SubjectId } from "./types";
import { SUBJECTS } from "./subjects";
import { techStartLesson } from "./learn/gold/tech-start";
import { scienceStartLesson } from "./learn/gold/science-start";
import { starterLessonFromSeed } from "./learn/starter-beats";

interface StarterSeed {
  id: SubjectId;
  title: string;
  hook: string;
  tryPrompt: string;
  choices: [string, string, string];
  why: string;
  takeaway: string;
}

const SEEDS: StarterSeed[] = [
  {
    id: "tech",
    title: "A 4-minute tech bite",
    hook: "A helpdesk ticket is a story with parts. Name the failing piece before you order a motherboard.",
    tryPrompt: "A laptop trackpad is lifting the palm rest. What do you do first?",
    choices: [
      "Treat it as a swollen battery: power down and do not crush the pack",
      "Tighten the trackpad screws until the bulge flattens",
      "Reinstall Windows to recalibrate the battery",
    ],
    why: "A rising palm rest is chemistry, not firmware. Isolate the pack, then replace it.",
    takeaway: "Symptom first, then the cheapest FRU that matches — not a board swap.",
  },
  {
    id: "maths",
    title: "A 4-minute maths bite",
    hook: "Estimate before you calculate. If the answer is wildly off, the method is wrong.",
    tryPrompt: "19 × 21 is closest to which estimate?",
    choices: ["400", "200", "80"],
    why: "20 × 20 = 400. 19 × 21 is one less and one more than 20, so it sits next to 400.",
    takeaway: "Round to friendly numbers, then check the exact work against that picture.",
  },
  {
    id: "science",
    title: "A 4-minute science bite",
    hook: "A model is a useful lie: keep the bits that predict, drop the bits that only decorate.",
    tryPrompt: "Why does a metal spoon in hot tea feel hotter than the tea mug handle?",
    choices: [
      "Metal conducts heat into your hand faster than the mug",
      "Metal is always a higher temperature than liquid",
      "The spoon is chemically burning",
    ],
    why: "Same temperature bath; different conductivity. Your skin reads heat flow, not a hidden extra degrees.",
    takeaway: "Name the mechanism (conduction here) before the slogan.",
  },
  {
    id: "history",
    title: "A 4-minute history bite",
    hook: "A date is a pin. A cause is a story you can argue with evidence.",
    tryPrompt: "What makes a claim historical rather than just a list of years?",
    choices: [
      "It says what changed and points at evidence",
      "It has more dates than the next paragraph",
      "It names a famous person",
    ],
    why: "History is cause, choice, and sources — not a calendar dump.",
    takeaway: "Ask “what changed, for whom, and how do we know?”",
  },
  {
    id: "english",
    title: "A 4-minute English bite",
    hook: "A sentence does a job. If the job is unclear, fix the verb before you add adjectives.",
    tryPrompt: "Which rewrite makes the job clearer?",
    choices: [
      "The committee delayed the vote.",
      "A delay was caused in relation to the vote by the committee.",
      "Voting, delayed, happened.",
    ],
    why: "Subject + strong verb beats a fog of “was caused in relation to.”",
    takeaway: "Say who did what. Then add the why.",
  },
  {
    id: "geography",
    title: "A 4-minute geography bite",
    hook: "Scale first: a street, a city, a continent. The same fact can be true at one scale and misleading at another.",
    tryPrompt: "A coastal city is wet this week. What must you still ask?",
    choices: [
      "Is this a local storm, a regional season, or a climate claim?",
      "Which celebrity lives there?",
      "What is the city’s logo colour?",
    ],
    why: "Weather is not climate. Geography starts by naming the scale.",
    takeaway: "Place + scale + evidence, then the slogan.",
  },
  {
    id: "coding",
    title: "A 4-minute coding bite",
    hook: "A program is a recipe. The computer does exactly the steps, including the wrong ones.",
    tryPrompt: "A loop prints 0, 1, 2. The coder wanted 1, 2, 3. What likely happened?",
    choices: [
      "The counter started at 0 instead of 1",
      "The computer rounded the numbers down for fun",
      "Print always subtracts one",
    ],
    why: "Off-by-one is the classic. Check the start, the end, and whether you include both edges.",
    takeaway: "Read the first and last iteration out loud before you blame the language.",
  },
  {
    id: "business",
    title: "A 4-minute business bite",
    hook: "Follow the cash. A price is not a vibe; it is cost, tax, and a margin someone has to live on.",
    tryPrompt: "A $10 item with 10% tax at the till costs the customer…",
    choices: ["$11", "$10", "$9"],
    why: "Tax sits on top unless the sign said “including tax.” $10 × 1.10 = $11.",
    takeaway: "Write the formula before you trust the sticker.",
  },
  {
    id: "health",
    title: "A 4-minute health bite",
    hook: "A body system has a job. Sleep is not a moral score; it is recovery chemistry.",
    tryPrompt: "Why does a hard training day often need extra sleep?",
    choices: [
      "Tissue repair and memory consolidation happen during sleep",
      "Sleep burns more calories than a run",
      "Muscles only grow while you scroll",
    ],
    why: "Load is the stress. Sleep is part of the adaptation, not a reward sticker.",
    takeaway: "Name the system (recovery) before the poster slogan.",
  },
  {
    id: "music",
    title: "A 4-minute music bite",
    hook: "Beat is time you can count. Pitch is high/low. Texture is how many things happen at once.",
    tryPrompt: "Clapping on 1 and 3 in 4/4 emphasises…",
    choices: ["The strong beats of the bar", "Only the harmony", "The lyrics"],
    why: "In 4/4, 1 is the downbeat and 3 is the next strong beat. That is meter, not melody.",
    takeaway: "Count it, then name it.",
  },
  {
    id: "art",
    title: "A 4-minute art bite",
    hook: "Design is a decision. Contrast, alignment, and one focal point beat a pile of decorations.",
    tryPrompt: "A poster has ten fonts and no empty space. What is the first fix?",
    choices: [
      "Cut typefaces and leave a quiet area around the title",
      "Add a drop shadow to every word",
      "Centre every line so it feels official",
    ],
    why: "Hierarchy needs contrast and rest. More ornaments hide the job.",
    takeaway: "Change one thing on purpose, then look again.",
  },
  {
    id: "civics",
    title: "A 4-minute civics bite",
    hook: "Power has a checklist: who decides, who checks them, and who can change the rule.",
    tryPrompt: "A parliament passes a law. What still matters?",
    choices: [
      "Whether courts, a second house, or voters can review or replace it",
      "Whether the law has a logo",
      "Whether the minister liked the font",
    ],
    why: "Civics is process and limits, not a vibe about “the government.”",
    takeaway: "Who decides, and who checks them?",
  },
  {
    id: "languages",
    title: "A 4-minute languages bite",
    hook: "A language is a system: sounds, word pieces, and polite contact. One pattern beats a phrasebook dump.",
    tryPrompt: "Why might a word list fail you in a real conversation?",
    choices: [
      "You still need sounds, word order, and when to be polite",
      "Lists are illegal in most countries",
      "People only reply in English",
    ],
    why: "Vocab is fuel. Grammar and pragmatics are the engine. Open a speak course when you want practice.",
    takeaway: "Learn one reusable pattern, then reuse it.",
  },
  {
    id: "logic",
    title: "A 4-minute logic bite",
    hook: "Name the claim, then test it. A confident tone is not evidence.",
    tryPrompt: "“Every swan I saw was white, so all swans are white.” What went wrong?",
    choices: [
      "The sample cannot prove a universal from a few sightings",
      "White is not a colour",
      "Swans do not exist",
    ],
    why: "Induction from a limited sample is leaky. One counterexample (a black swan) breaks the leap.",
    takeaway: "Ask what would count as a disproof.",
  },
  {
    id: "digital",
    title: "A 4-minute digital bite",
    hook: "The internet is a place with consequences. A link can lie; a permission is a door.",
    tryPrompt: "An email says “your bank” and wants a password via a short link. First move?",
    choices: [
      "Do not click. Open the bank app or typed URL yourself",
      "Reply with the password so they can “verify”",
      "Forward it to everyone at work for fun",
    ],
    why: "Phishing lives on urgency and borrowed logos. You never authenticate through the surprise link.",
    takeaway: "Separate the message from the door you walk through.",
  },
];

function seedFor(id: SubjectId) {
  return SEEDS.find((seed) => seed.id === id)!;
}

export const starterDomains: Domain[] = SUBJECTS.map((subject) => {
  const seed = seedFor(subject.id);
  return {
    id: `${subject.id}-start`,
    subject: subject.id,
    number: 0,
    title: "Start here",
    summary: seed.hook,
    lessonId: `${subject.id}-start-essentials`,
    quizId: `${subject.id}-start-quiz`,
    cluster: "Start here",
  };
});

export const starterLessons: Lesson[] = SEEDS.map((seed) => {
  if (seed.id === "tech") return techStartLesson;
  if (seed.id === "science") return scienceStartLesson;
  return starterLessonFromSeed(seed);
});

export const starterChecks: Record<string, PathCheck[]> = Object.fromEntries(
  SEEDS.map((seed) => [
    `${seed.id}-start`,
    [
      {
        id: `${seed.id}-start-check`,
        type: "choice" as const,
        prompt: seed.tryPrompt,
        choices: seed.choices.map((label, index) => ({
          id: String.fromCharCode(97 + index),
          label,
          correct: index === 0,
          why: seed.why,
        })),
      } satisfies PathCheck,
    ],
  ]),
);

export const starterQuizzes: Quiz[] = SEEDS.map((seed) => ({
  id: `${seed.id}-start-quiz`,
  domainId: `${seed.id}-start`,
  title: `${SUBJECTS.find((subject) => subject.id === seed.id)?.title ?? seed.id} · start`,
  questions: [
    {
      id: `${seed.id}-start-q1`,
      prompt: seed.tryPrompt,
      choices: [...seed.choices],
      correctIndex: 0,
      explanation: seed.why,
    },
  ],
}));

export function starterDomainId(subject: SubjectId) {
  return `${subject}-start`;
}

export function starterHref(subject: SubjectId) {
  return `/learn/${subject}/${subject}-start`;
}
