import type { LearnBeat } from "@/content/types";

function cluster(prefix: string, lockLine: string, topic: {
  hook: [string, string];
  see: [string, string, string[]];
  try: [string, string, string, string];
  name: [string, string, string];
  contrast: [string, string];
  decide: [string, string, string, string, string];
}): LearnBeat[] {
  const [hookTitle, hookSpeak] = topic.hook;
  const [seeTitle, seeSpeak, labels] = topic.see;
  const [tryTitle, trySpeak, tryRight, tryWrong] = topic.try;
  const [nameTitle, nameSpeak, term] = topic.name;
  const [contrastTitle, contrastSpeak] = topic.contrast;
  const [decideTitle, decideSpeak, decidePrompt, decideRight, decideWhy] = topic.decide;
  return [
    {
      id: `${prefix}-hook`,
      type: "hook",
      title: hookTitle,
      iCan: "meet the ticket in front",
      speak: hookSpeak,
      body: [hookSpeak.replace(/\.$/, ""), "Hold the ask until you can name the part."],
      objective: hookTitle,
    },
    {
      id: `${prefix}-see`,
      type: "see",
      title: seeTitle,
      iCan: "read the labels on the drawing",
      speak: seeSpeak,
      body: ["Read the labels. One drawing, one story."],
      figure: {
        kind: "diagram",
        diagram: labels.includes("WAN") ? "soho-topo" : labels.includes("HDMI") ? "rear-io" : "claim-test",
        alt: seeTitle,
        caption: seeSpeak,
        labels,
      },
      termsIntroduced: labels,
    },
    {
      id: `${prefix}-try`,
      type: "try",
      title: tryTitle,
      iCan: "try the first fork",
      speak: trySpeak,
      body: [trySpeak],
      check: {
        id: `${prefix}-try`,
        type: "choice",
        prompt: trySpeak,
        choices: [
          { id: "a", label: tryRight, correct: true, why: decideWhy },
          { id: "b", label: tryWrong, correct: false, why: decideWhy },
          { id: "c", label: "Reinstall the operating system first", correct: false, why: decideWhy },
        ],
      },
      speakFeedbackCorrect: decideWhy,
      speakFeedbackWrong: decideWhy,
    },
    {
      id: `${prefix}-name`,
      type: "name",
      title: nameTitle,
      iCan: "name the working idea",
      speak: nameSpeak,
      body: [nameSpeak, `Keep the name ${term}.`],
      termsIntroduced: [term],
    },
    {
      id: `${prefix}-contrast`,
      type: "contrast",
      title: contrastTitle,
      iCan: "hold the miss against the hit",
      speak: contrastSpeak,
      body: [contrastSpeak, `Not this: ${tryWrong}.`],
    },
    {
      id: `${prefix}-decide`,
      type: "decide",
      title: decideTitle,
      iCan: "pick the working answer",
      speak: decideSpeak,
      lockLine,
      cardHook: lockLine,
      check: {
        id: `${prefix}-decide`,
        type: "choice",
        prompt: decidePrompt,
        choices: [
          { id: "a", label: decideRight, correct: true, why: decideWhy },
          { id: "b", label: tryWrong, correct: false, why: decideWhy },
          { id: "c", label: "Ignore the labels and guess the brand", correct: false, why: decideWhy },
        ],
      },
      speakFeedbackCorrect: lockLine,
      speakFeedbackWrong: lockLine,
    },
    {
      id: `${prefix}-lock`,
      type: "lock",
      title: "Keep this line",
      iCan: "repeat the lock line",
      speak: lockLine,
      lockLine,
      body: [lockLine, "Say it again before the next ticket."],
    },
  ];
}

export const core1AuthoredBeats: Record<string, LearnBeat[]> = {
  networking: cluster("net-path", "Ping an address before you blame a name.", {
    hook: ["The website is down", "The user says the internet is dead. Lights are still on."],
    see: ["Walk the boxes", "Street, then router, then switch, then the host.", ["WAN", "router", "LAN", "host"]],
    try: [
      "First ping",
      "What do you ping first to split the path?",
      "The gateway address on this LAN",
      "A random website name",
    ],
    name: ["Name the fork", "Ping an address tests the path. Ping a name also needs D N S.", "DNS"],
    contrast: ["Address versus name", "A live address and a dead name is a directory problem."],
    decide: [
      "Pick the first test",
      "The browser fails. The cable light is on. What do you ping first?",
      "The browser fails. The cable light is on. What do you ping first?",
      "The gateway address, then a public address, then a name",
      "A live address and a dead name splits routing from DNS.",
    ],
  }),
  hardware: cluster("hw-port", "Name the connector before you order the cable.", {
    hook: ["The cable in the closet", "Someone wants a cable from the closet. The hole on the box is not named."],
    see: ["Read the rear panel", "Labels name HDMI, DisplayPort, U S B C, and the power inlet.", ["HDMI", "DisplayPort", "USB-C", "DC"]],
    try: [
      "Which hole",
      "The monitor stays black. Which label do you read first?",
      "The video label on the rear panel",
      "The brand sticker on the box",
    ],
    name: ["Name the hole", "U S B C is a shape. The spec sheet says if video rides along.", "USB-C"],
    contrast: ["Shape versus job", "A matching shape does not prove the port speaks video."],
    decide: [
      "Order the right cable",
      "What do you name before you order a cable?",
      "What do you name before you order a cable?",
      "The connector and the job it must do",
      "Name the connector before you order the cable.",
    ],
  }),
  "virtualization-cloud": cluster("virt-host", "A guest spends real host RAM.", {
    hook: ["The guest crawls", "A virtual machine crawls. The host fan is loud."],
    see: ["Host feeds the guest", "The guest file sits on the host disk and spends host memory.", ["host", "guest", "RAM", "disk"]],
    try: [
      "Where to look",
      "The guest is slow. Where do you look first?",
      "Host RAM and the virtual disk file",
      "A new guest wallpaper",
    ],
    name: ["Name the hypervisor", "A hypervisor carves one machine into guests. Those guests spend host parts.", "hypervisor"],
    contrast: ["Type one versus type two", "Type one sits on the metal. Type two sits on a host operating system."],
    decide: [
      "Why the guest crawls",
      "A guest crawls and the host swaps. What ran out?",
      "A guest crawls and the host swaps. What ran out?",
      "Host RAM. The guest spends real memory.",
      "A guest spends real host RAM.",
    ],
  }),
  "hw-net-troubleshooting": cluster("ts-loop", "One change at a time, then write it down.", {
    hook: ["Nothing happens", "The box looks dead. You need a loop, not a hunch."],
    see: ["Six steps", "Identify, theory, test, plan, verify, document.", ["identify", "theory", "test", "document"]],
    try: [
      "First split",
      "No lights and no fans. What failed first?",
      "The power path",
      "The website cache",
    ],
    name: ["Name the loop", "Identify the problem, then form a theory, then test one change.", "troubleshooting loop"],
    contrast: ["Guess versus test", "A hunch that changes three parts at once cannot teach you which one worked."],
    decide: [
      "Keep the loop",
      "What do you do after a theory fails?",
      "What do you do after a theory fails?",
      "Form a new theory and test one change",
      "One change at a time, then write it down.",
    ],
  }),
};
