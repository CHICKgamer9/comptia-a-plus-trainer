import type { Scenario } from "./types";

export const challenges: Scenario[] = [
  {
    id: "cafe-till",
    title: "The cafe till",
    ticketId: "MATH-1",
    requester: "Weekend shift · Priya",
    location: "Brunswick",
    priority: "Medium",
    subject: "maths",
    kind: "challenge",
    domainIds: ["percentages", "number-sense"],
    difficulty: "medium",
    minutes: 8,
    summary: "GST, a stacked discount, and a bill split that should not require a priest.",
    ticket:
      "Saturday rush. A sandwich is $12.10 including GST. A regular wants 15% off a $40 catering tray, then asks if the till can also take “another 10% because they brought a flyer.” Two friends split a $66 inclusive bill “evenly plus 10% tip on the pre-split total.” The queue is judging you.",
    steps: [
      {
        id: "g",
        phase: "gather",
        title: "Look closely",
        prompt: "The $12.10 sandwich is GST-inclusive. How much of that is GST (10%)?",
        findings: "Inclusive price is 110% of the pre-GST amount. GST is 1/11 of the inclusive price, not 10% added again.",
        choices: [
          {
            id: "a",
            label: "Add 10% more at the till — $1.21 extra",
            correct: false,
            feedback: "Inclusive already contains GST. Do not GST a GST.",
          },
          {
            id: "b",
            label: "$1.10 — $12.10 ÷ 11",
            correct: true,
            feedback: "Yes. Pre-GST is $11. GST is $1.10. 10% of $11, sitting inside $12.10.",
          },
          {
            id: "c",
            label: "$12.10 × 0.10 = $1.21 of GST inside it",
            correct: false,
            feedback: "That’s 10% of the already-taxed price. The GST share of an inclusive price is 1/11.",
          },
          {
            id: "d",
            label: "Zero — food never has GST",
            correct: false,
            feedback: "Some foods don’t. This sandwich, in this problem, does. Read the ticket.",
          },
        ],
      },
      {
        id: "t",
        phase: "tools",
        title: "Try a model",
        prompt: "15% off $40, then another 10% on what remains. What should the till charge?",
        findings: "0.85 × 0.90 = 0.765 of original. $40 × 0.765 = $30.60. Not 25% off.",
        choices: [
          {
            id: "a",
            label: "$30 — just take 25% because percents add",
            correct: false,
            feedback: "The second cut hits the already-reduced pile. Adding percents is how queues become arguments.",
          },
          {
            id: "b",
            label: "$30.60 — 15% off, then 10% of the remainder",
            correct: true,
            feedback: "Successive percentages multiply. $34 after 15%, then $30.60.",
          },
          {
            id: "c",
            label: "$36 — only the 10% flyer",
            correct: false,
            feedback: "Both discounts apply in this story. Just not as a sum.",
          },
          {
            id: "d",
            label: "$40 — discounts are illegal on weekends",
            correct: false,
            feedback: "Brunswick would like a word.",
          },
        ],
      },
      {
        id: "c",
        phase: "cause",
        title: "Decide",
        prompt: "$66 inclusive, 10% tip on that total, split two ways. Each person pays?",
        findings: "Tip $6.60. Grand $72.60. Half is $36.30. Estimate first: ~$66 + $7 ≈ $73, half ≈ $36.50.",
        choices: [
          {
            id: "a",
            label: "$33 each — split then forget the tip",
            correct: false,
            feedback: "The tip was in the sentence. It did not evaporate.",
          },
          {
            id: "b",
            label: "$36.30 each",
            correct: true,
            feedback: "66 × 1.1 = 72.6, ÷ 2. The estimate said you were in the right suburb.",
          },
          {
            id: "c",
            label: "$72.60 each — tip twice, once per person",
            correct: false,
            feedback: "That’s the whole bill, twice. Generous, not even.",
          },
          {
            id: "d",
            label: "$6.60 each — they only pay the tip",
            correct: false,
            feedback: "Priya would like the sandwiches paid for as well.",
          },
        ],
      },
      {
        id: "f",
        phase: "fix",
        title: "Check it",
        prompt: "Which check catches the most till disasters?",
        findings: "Neighbourhood estimate, then the exact multiplier. If they disagree, a place value or a stacked percent went feral.",
        choices: [
          {
            id: "a",
            label: "Estimate the neighbourhood, then apply the multiplier (1.1, 0.85…)",
            correct: true,
            feedback: "Number sense first. Exact second. That is the whole maths path wearing an apron.",
          },
          {
            id: "b",
            label: "Add every percent you see, always",
            correct: false,
            feedback: "That is how 20+20 becomes a 40% fairy tale.",
          },
          {
            id: "c",
            label: "Trust the first number the screen draws",
            correct: false,
            feedback: "Screens print $192 coffees with a straight face.",
          },
          {
            id: "d",
            label: "Convert everything to Roman numerals",
            correct: false,
            feedback: "Save it for the history challenge.",
          },
        ],
      },
    ],
    debrief:
      "Inclusive GST is 1/11 of the ticketed price. Stacked discounts multiply. Tip then split (or split then tip — pick one story and stick to it). Estimate is a lie detector, not a personality.",
    source: "fallback",
  },
  {
    id: "bushfire-ridge",
    title: "Ridge before the northerly",
    ticketId: "SCI-1",
    requester: "Fire tower · Alex",
    location: "Dandenongs fringe",
    priority: "High",
    subject: "science",
    kind: "challenge",
    domainIds: ["energy-systems", "ecosystems-au", "forces-motion"],
    difficulty: "medium",
    minutes: 9,
    summary: "Heat, fuel, wind, and a eucalypt ridge that does not care about your vibes.",
    ticket:
      "A hot northerly is forecast. Fine fuel on the ridge is crispy. Someone on the radio says “the energy gets used up once the grass burns, so the forest is safe.” Someone else wants to hose the air to “remove the oxygen atoms.” You have one briefing before the wind turns.",
    steps: [
      {
        id: "g",
        phase: "gather",
        title: "Look closely",
        prompt: "The grass fire “uses up energy.” What is the honest ledger?",
        findings: "Chemical energy in fuel becomes thermal and light. It is transferred, not deleted. Heat can pre-dry the next fuel.",
        choices: [
          {
            id: "a",
            label: "Energy vanishes when flame looks done, so the ridge is automatically safe",
            correct: false,
            feedback: "Conservation does not mean the forest got a receipt that says PAID.",
          },
          {
            id: "b",
            label: "Chemical → thermal/light; heat can still prime the next fuel",
            correct: true,
            feedback: "Forms change. Radiant heat and convection are how fires climb a slope.",
          },
          {
            id: "c",
            label: "Mass is destroyed, which is the same as energy",
            correct: false,
            feedback: "Classroom fires do not need relativity. Atoms go to gases and ash.",
          },
          {
            id: "d",
            label: "Only kinetic energy exists during bushfire",
            correct: false,
            feedback: "Wind is part of it. Chemistry is the stash.",
          },
        ],
      },
      {
        id: "t",
        phase: "tools",
        title: "Try a model",
        prompt: "Why do eucalypt ridges with a hot northerly behave so rudely?",
        findings: "Oily fuel, slope (heat rises / preheats uphill), wind alignment. Indigenous cool burns and mosaic country are part of the longer science, not a footnote.",
        choices: [
          {
            id: "a",
            label: "Australia has no fire-adapted plants, so this is a freak",
            correct: false,
            feedback: "Many plants here are fire-involved. That does not make a crown fire gentle.",
          },
          {
            id: "b",
            label: "Fuel chemistry + slope preheating + wind — energy transfer uphill",
            correct: true,
            feedback: "Forces (wind), energy (heat), ecosystem (fuel). One briefing, three paths.",
          },
          {
            id: "c",
            label: "Oxygen atoms can be hosed out of the atmosphere locally",
            correct: false,
            feedback: "You will not delete the atmosphere with a garden hose.",
          },
          {
            id: "d",
            label: "Net force on the air is always zero, so wind cannot matter",
            correct: false,
            feedback: "If net force were zero the northerly would not be a forecast.",
          },
        ],
      },
      {
        id: "c",
        phase: "cause",
        title: "Decide",
        prompt: "A local wants the tower to “let it rip so the banksia can seed.” Your call?",
        findings: "Some species need fire. A hot, fast, out-of-season crown fire is not a cool mosaic burn. Mechanism ≠ permission slip for this afternoon.",
        choices: [
          {
            id: "a",
            label: "All fire is equally ecological — stand down",
            correct: false,
            feedback: "Intensity, timing, and patchiness are the science. This forecast is not a cool burn.",
          },
          {
            id: "b",
            label: "Fire-adapted ≠ this fire. Treat the northerly as a heat-and-fuel problem",
            correct: true,
            feedback: "You can hold two facts: serotiny is real, and this ridge can still kill.",
          },
          {
            id: "c",
            label: "Bleach the soil with salt to prevent plants",
            correct: false,
            feedback: "That’s not ecology. That’s a crime against a catchment.",
          },
          {
            id: "d",
            label: "Energy conservation means fires cannot grow",
            correct: false,
            feedback: "Conservation never promised small flames.",
          },
        ],
      },
      {
        id: "f",
        phase: "fix",
        title: "Check it",
        prompt: "Best one-line brief for the crew?",
        findings: "Name the transfers. Name the fuel. Name the wind. Leave the vibe at home.",
        choices: [
          {
            id: "a",
            label: "Hot, dry, wind-aligned, uphill fuel — heat will pre-dry the next unburnt patch",
            correct: true,
            feedback: "That’s a model you can act on. TicketBench science in a radio sentence.",
          },
          {
            id: "b",
            label: "Nature wants this, so no tactics",
            correct: false,
            feedback: "Nature is not a press secretary.",
          },
          {
            id: "c",
            label: "Spray antibiotics on the trees",
            correct: false,
            feedback: "Wrong path. That’s cells, and still wrong.",
          },
          {
            id: "d",
            label: "If we cannot see flame, energy is gone",
            correct: false,
            feedback: "Embers and heat are still on the ledger.",
          },
        ],
      },
    ],
    debrief:
      "Energy changes form; heat still does work on the next fuel. Australian fire ecology is real and so are extreme days. A model names fuel, slope, and wind — not “nature said so.”",
    source: "fallback",
  },
  {
    id: "federation-floor",
    title: "Federation floor, 1898",
    ticketId: "HIS-1",
    requester: "Convention clerk · Walsh",
    location: "Melbourne",
    priority: "High",
    subject: "history",
    kind: "challenge",
    domainIds: ["making-australia", "historical-thinking"],
    difficulty: "medium",
    minutes: 9,
    summary: "Small states, a colour bar, and a document that is supposed to last. You do not get a pure principle.",
    ticket:
      "You have a pencil and a noisy hall. NSW and Victoria want majority rule. Smaller colonies want a Senate that can bite. Labour wants wages as a public question. Several delegates want a colour bar in the immigration power. New Zealand’s chair is empty. The clerk would like a clause before tea.",
    steps: [
      {
        id: "g",
        phase: "gather",
        title: "Look closely",
        prompt: "What is this convention actually doing?",
        findings: "Writing a deal among colonies, not discovering destiny. Absence of NZ is evidence. So is who is not in the room (most of the continent’s First Peoples, most women, most labour).",
        choices: [
          {
            id: "a",
            label: "Recording a folk inevitability that had to happen",
            correct: false,
            feedback: "WA nearly stayed out. NZ did. Inevitability is a later statue.",
          },
          {
            id: "b",
            label: "Negotiating a club: tariffs, defence, immigration, Senate maths",
            correct: true,
            feedback: "A constitution is a bargain with a high lock. Read the absences too.",
          },
          {
            id: "c",
            label: "Copying Rome’s senate because of togas",
            correct: false,
            feedback: "Names travel. The deal is local: jealous colonies and a continent.",
          },
          {
            id: "d",
            label: "Repealing terra nullius as clause 1",
            correct: false,
            feedback: "They did not. That fight is later paperwork (and still unfinished).",
          },
        ],
      },
      {
        id: "t",
        phase: "tools",
        title: "Try a model",
        prompt: "Small states demand a Senate that can block. You…",
        findings: "This is why the document is hard to change and why money bills become a later crisis genre. Structure is a choice.",
        choices: [
          {
            id: "a",
            label: "Give them a house that can check the majority — that’s the price of union",
            correct: true,
            feedback: "You can hate the later fights and still see why the clause was the ticket price.",
          },
          {
            id: "b",
            label: "Ignore them — bigger colonies are more real",
            correct: false,
            feedback: "Then you do not get a Commonwealth this year. Maybe not at all.",
          },
          {
            id: "c",
            label: "Let Britain appoint the whole parliament",
            correct: false,
            feedback: "They wanted a local roof, still imperial, not a total franchise deletion.",
          },
          {
            id: "d",
            label: "Put it off until 1967",
            correct: false,
            feedback: "Wrong tool. 1967 is a different question.",
          },
        ],
      },
      {
        id: "c",
        phase: "cause",
        title: "Decide",
        prompt: "A delegate wants immigration power aimed at a colour bar. Historically, what happened?",
        findings: "White Australia was not garnish. It was early statute and a selling point. You can describe that without endorsing it — that is the history skill.",
        choices: [
          {
            id: "a",
            label: "It was a rumour; the Settlement was only about railways",
            correct: false,
            feedback: "Rail gauges stayed a mess. The colour bar became law.",
          },
          {
            id: "b",
            label: "It became central policy — describe it as part of the deal, then you can fight it with facts",
            correct: true,
            feedback: "Honesty before dunk. The Australian Settlement bundled this with protection and arbitration.",
          },
          {
            id: "c",
            label: "First Nations people wrote it in",
            correct: false,
            feedback: "They were not the authors of that bar. Many were targets of other bars.",
          },
          {
            id: "d",
            label: "Mabo already existed, so it didn’t matter",
            correct: false,
            feedback: "Mabo is 1992. Do not time-travel the High Court.",
          },
        ],
      },
      {
        id: "f",
        phase: "fix",
        title: "Check it",
        prompt: "Tea is served. What should the clerk’s minute emphasise?",
        findings: "A source from this room will sound like a winner’s minute. Read it as a handle: who spoke, who is missing.",
        choices: [
          {
            id: "a",
            label: "“The people spoke as one” and stop",
            correct: false,
            feedback: "Which people. The minute would be doing a job.",
          },
          {
            id: "b",
            label: "The clauses, the trades, and who was not franchised to argue them",
            correct: true,
            feedback: "Primary source + silence. That is How History Works wearing a waistcoat.",
          },
          {
            id: "c",
            label: "Only the catering",
            correct: false,
            feedback: "Useful for social history. Not sufficient for the Constitution.",
          },
          {
            id: "d",
            label: "That 1788 already federated everyone",
            correct: false,
            feedback: "Different collision, different century.",
          },
        ],
      },
    ],
    debrief:
      "Federation was a negotiated club with a high lock, a Senate price, and a colour bar in the opening acts. Read the minute as a source: who spoke, who was missing. Destiny is a statue someone put up later.",
    source: "fallback",
  },
];

export function getChallenge(id: string) {
  return challenges.find((item) => item.id === id);
}

export function getChallengesBySubject(subject: string) {
  return challenges.filter((item) => item.subject === subject);
}
