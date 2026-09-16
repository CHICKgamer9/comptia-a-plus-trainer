/** @typedef {"tech"|"maths"|"science"|"history"|"english"|"geography"|"coding"|"business"|"health"|"music"|"art"|"civics"|"languages"|"logic"|"digital"} SubjectId */

/**
 * @typedef {object} Seed
 * @property {string} id
 * @property {SubjectId} subject
 * @property {string} cluster
 * @property {string} title
 * @property {string} hook
 * @property {string} fact
 * @property {string} trap
 * @property {string} move
 * @property {string} extra
 * @property {string=} tip
 * @property {string=} watch
 * @property {string[]=} steps
 * @property {[string, string, string]=} takeaways
 * @property {string=} checkPrompt
 * @property {string=} tfPrompt
 * @property {boolean=} tfAnswer
 * @property {string=} quizStem
 */

const FRAMES = [
  ["The idea", "The trap", "The careful move"],
  ["Hold the model", "Where people slide", "What to do instead"],
  ["See it once", "The popular wrong", "A move you can reuse"],
  ["Start here", "Don't buy this", "The check that saves you"],
];

function clip(text, max = 220) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 80 ? space : max - 1)}.`;
}

function takeaways(seed) {
  if (seed.takeaways) return seed.takeaways;
  return [
    clip(seed.fact, 140),
    clip(seed.move, 140),
    "Name the trap before you pick it. Speed is how the wrong answer wins.",
  ];
}

function distractor(seed, index) {
  const pool = [
    "Restart everything and hope the symptom was a vibe.",
    "Add the numbers you can see and ignore the units.",
    "Pick the answer that sounds like a poster.",
    "Skip the check because it feels obvious this time.",
    "Blame the last person and close the ticket.",
    "Memorise a slogan instead of the mechanism.",
  ];
  return pool[(index + seed.id.length) % pool.length];
}

/**
 * @param {Seed} seed
 * @param {number} number
 */
export function expandSeed(seed, number) {
  const frame = FRAMES[Math.abs(hash(seed.id)) % FRAMES.length];
  const [h1, h2, h3] = frame;
  const checkPrompt =
    seed.checkPrompt || `Someone wants the fast answer for “${seed.title}”. What do you actually do?`;
  const tfPrompt =
    seed.tfPrompt ||
    `True or false: the popular move (“${clip(seed.trap, 70)}”) is good enough here.`;
  const tfAnswer = seed.tfAnswer ?? false;
  const mode = Math.abs(hash(seed.id + "m")) % 3;

  const domain = {
    id: seed.id,
    subject: seed.subject,
    number,
    title: seed.title,
    summary: clip(seed.hook || seed.fact, 180),
    lessonId: `${seed.id}-essentials`,
    quizId: `${seed.id}-quiz`,
    cluster: seed.cluster,
  };

  const lesson = {
    id: `${seed.id}-essentials`,
    domainId: seed.id,
    title: seed.title,
    minutes: 7 + (Math.abs(hash(seed.id)) % 5),
    intro: `${seed.hook} This path is a try-this, not an essay dump.`,
    sections: [
      {
        heading: h1,
        paragraphs: [
          seed.fact,
          `Keep that picture. “${seed.title}” is a reusable move, not a slogan you recite once.`,
        ],
        callout: {
          type: "tip",
          text: seed.tip || clip(seed.move, 160),
        },
      },
      {
        heading: h2,
        paragraphs: [
          seed.trap,
          "The trap is popular because it is faster than checking. Speed is not evidence.",
        ],
        callout: {
          type: "watch",
          text: seed.watch || "If the answer arrives in one breath, name what it skipped.",
        },
      },
      {
        heading: h3,
        paragraphs: [
          seed.move,
          seed.extra || "Write the reason in one sentence. If you cannot, you guessed.",
        ],
        bullets: seed.steps,
      },
    ],
    keyTakeaways: takeaways(seed),
  };

  if (
    (String(seed.id).startsWith("vx-") || String(seed.id).startsWith("vy-")) &&
    Math.abs(hash(seed.id + "fig")) % 5 === 0
  ) {
    lesson.figure = {
      kind: "diagram",
      diagram: diagramForSubject(seed.subject),
      alt: `Labelled teaching diagram for “${seed.title}”. Read the labels; colour is not the legend.`,
      caption: `${clip(seed.fact, 140)} Labels carry the meaning.`,
    };
  }

  /** @type {import("../src/content/types").PathCheck[]} */
  const checks = [
    {
      id: `${seed.id}-c1`,
      afterHeading: h2,
      type: "choice",
      prompt: checkPrompt,
      choices: [
        {
          id: "a",
          label: clip(seed.move, 110),
          correct: true,
          why: clip(seed.extra || seed.fact, 180),
        },
        {
          id: "b",
          label: clip(seed.trap, 110),
          correct: false,
          why: "That is the popular wrong. It skips the mechanism this path is for.",
        },
        {
          id: "c",
          label: distractor(seed, 1),
          correct: false,
          why: "Unrelated busywork. It does not test the idea.",
        },
      ],
    },
    {
      id: `${seed.id}-c2`,
      afterHeading: h1,
      type: "truefalse",
      prompt: tfPrompt,
      answer: tfAnswer,
      why: tfAnswer ? clip(seed.fact, 180) : clip(seed.move, 180),
    },
  ];

  if (mode === 0) {
    checks.push({
      id: `${seed.id}-c3`,
      afterHeading: h3,
      type: "match",
      prompt: "Match the move to what it is for.",
      pairs: [
        { left: "The idea", right: clip(seed.fact, 72) },
        { left: "The trap", right: clip(seed.trap, 72) },
        { left: "The careful move", right: clip(seed.move, 72) },
      ],
      extraRights: ["A vibe, if you squint"],
      why: "If you can pair them, you can catch the slide in the wild.",
    });
  } else if (mode === 1) {
    const items = [
      { id: "b0", label: "Name what is actually happening." },
      { id: "b1", label: clip(seed.move, 90) },
      { id: "b2", label: "Check the result against the original problem." },
    ];
    checks.push({
      id: `${seed.id}-c3`,
      afterHeading: h3,
      type: "order",
      prompt: "Put a careful pass in order.",
      items,
      correctOrder: ["b0", "b1", "b2"],
      why: "Skip the name-the-problem step and you will apply a correct trick to the wrong mess.",
    });
  } else {
    checks.push({
      id: `${seed.id}-c3`,
      afterHeading: h3,
      type: "choice",
      prompt: seed.quizStem || `Which sentence is honest about “${seed.title}”?`,
      choices: [
        {
          id: "a",
          label: clip(seed.fact, 110),
          correct: true,
          why: "That is the mechanism. Keep it.",
        },
        {
          id: "b",
          label: clip(seed.trap, 110),
          correct: false,
          why: "Trap. Popular, cheap, wrong.",
        },
        {
          id: "c",
          label: distractor(seed, 2),
          correct: false,
          why: "Noise. It does not decide this path.",
        },
      ],
    });
  }

  const quizChoices = (correct, wrongs) => {
    const choices = [correct, ...wrongs].map((item) => clip(item, 90));
    return { choices, correctIndex: 0 };
  };

  const q1 = quizChoices(seed.move, [seed.trap, distractor(seed, 3), distractor(seed, 4)]);
  const q2 = quizChoices(seed.fact, [seed.trap, "It depends on the vibe of the room.", distractor(seed, 5)]);
  const q3 = {
    prompt: `Why is this a trap: “${clip(seed.trap, 80)}”?`,
    choices: [
      "It skips the mechanism and hopes speed counts as proof",
      "It is always the exam’s preferred wording",
      "Traps are illegal in multiple choice",
      "Because posters said so",
    ],
    correctIndex: 0,
    explanation: clip(seed.move, 180),
  };
  const q4 = {
    prompt: tfPrompt,
    choices: ["True", "False", "Only on Tuesdays", "Ask the loudest person"],
    correctIndex: tfAnswer ? 0 : 1,
    explanation: tfAnswer ? clip(seed.fact, 180) : clip(seed.move, 180),
  };

  const quiz = {
    id: `${seed.id}-quiz`,
    domainId: seed.id,
    title: seed.title,
    questions: [
      {
        id: `${seed.id}-q1`,
        prompt: seed.quizStem || checkPrompt,
        choices: q1.choices,
        correctIndex: q1.correctIndex,
        explanation: clip(seed.extra || seed.fact, 200),
      },
      {
        id: `${seed.id}-q2`,
        prompt: `Which statement matches “${seed.title}”?`,
        choices: q2.choices,
        correctIndex: q2.correctIndex,
        explanation: clip(seed.fact, 200),
      },
      {
        id: `${seed.id}-q3`,
        prompt: q3.prompt,
        choices: q3.choices,
        correctIndex: q3.correctIndex,
        explanation: q3.explanation,
      },
      {
        id: `${seed.id}-q4`,
        prompt: q4.prompt,
        choices: q4.choices,
        correctIndex: q4.correctIndex,
        explanation: q4.explanation,
      },
    ],
  };

  return { domain, lesson, quiz, checks };
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}

/** @param {string} subject */
function diagramForSubject(subject) {
  const map = {
    tech: "rear-io",
    maths: "number-line",
    science: "food-web",
    history: "scroll",
    english: "clipboard",
    geography: "suburb-map",
    coding: "timer-wire",
    business: "cash-flow",
    health: "leaf",
    music: "four-bar",
    art: "prism",
    civics: "claim-test",
    languages: "window",
    logic: "claim-test",
    digital: "privacy-stack",
  };
  return map[subject] || "prism";
}

export function assertSeeds(seeds, reserved) {
  const ids = new Set();
  const titles = new Map();
  for (const seed of seeds) {
    if (reserved.has(seed.id)) {
      throw new Error(`Seed reuses reserved id: ${seed.id}`);
    }
    if (ids.has(seed.id)) throw new Error(`Duplicate seed id: ${seed.id}`);
    ids.add(seed.id);
    const key = `${seed.subject}::${seed.title.toLowerCase()}`;
    if (titles.has(key)) throw new Error(`Duplicate title in ${seed.subject}: ${seed.title}`);
    titles.set(key, seed.id);
    if (!seed.cluster) throw new Error(`Seed ${seed.id} missing cluster`);
    for (const field of ["title", "hook", "fact", "trap", "move", "extra"]) {
      if (!seed[field] || String(seed[field]).length < 8) {
        throw new Error(`Seed ${seed.id} missing ${field}`);
      }
    }
  }
}
