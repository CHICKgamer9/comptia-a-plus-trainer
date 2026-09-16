import type { Lesson } from "../types";

export const historyLessons: Lesson[] = [
  {
    id: "historical-thinking-essentials",
    domainId: "historical-thinking",
    title: "History is an argument with evidence",
    minutes: 12,
    intro:
      "History is not “one damn fact after another.” It is a disciplined argument about the past using leftovers: letters, tools, bones, laws, photos, oral tradition. Dates matter as scaffolding. Cause, evidence, and whose voice got recorded matter more.",
    sections: [
      {
        heading: "Primary vs secondary, and why you should care",
        paragraphs: [
          "A primary source was there: a diary, a spearhead, a census, a songline, a photograph. A secondary source argues about those leftovers: a textbook, a documentary, this path. Primary is not automatically honest. A captain’s log is a primary source and also a job application to the Admiralty.",
          "Ask: who made this, for whom, and what could they not see? Silence is evidence too — who is missing from the record?",
        ],
        callout: {
          type: "tip",
          text: "A source can be useful even when it is biased. Bias is a handle. You read with it, not around it.",
        },
      },
      {
        heading: "Cause is a braid, not a billiard ball",
        paragraphs: [
          "“The assassination caused World War I” is a spark story. Sparks need tinder: alliances, imperial rivalry, mobilisation timetables, nationalism. Historians separate trigger, short-term, and long-term causes because people use “because” lazily.",
          "Contingency means it could have gone otherwise. Structure means some doors were already half-closed. Good history holds both without turning the past into fate or into a coin flip.",
        ],
        table: {
          headers: ["Move", "Question"],
          rows: [
            ["Trigger", "What lit it that week?"],
            ["Short-term", "What piled up that year?"],
            ["Long-term", "What made this thinkable?"],
            ["Consequence", "What actually changed after?"],
          ],
        },
      },
      {
        heading: "Continuity and change",
        paragraphs: [
          "Not everything changes when a flag does. After 1788 on this continent, British law arrived and Country continued. After 1901, colonies became a Commonwealth and most women still could not vote in some places the same way, and First Nations people were counted in the census in a cruelly limited way. Look for what persisted.",
          "Periodisation (Ancient, Medieval, Modern) is a filing cabinet invented in Europe. Useful. Not universal. Islamic golden ages, the Mali empire, Song China do not sit politely in those drawers.",
        ],
      },
      {
        heading: "Empathy without cosplay",
        paragraphs: [
          "Historical empathy is reconstructing why an action made sense to someone then — not forgiving it, not dressing up as them for a day. People in 1850 did not secretly hold your 2026 opinions and hide them. They had different maps of the possible.",
          "That is the opposite of “presentism” (scolding the past for not being us) and of “they were just products of their time” as a shutdown. Products of their time still argued with each other. There were always critics in the room.",
        ],
        callout: {
          type: "watch",
          text: "If a story has only villains and mascots, you are watching a cartoon. Find the argument.",
        },
      },
    ],
    keyTakeaways: [
      "History argues from leftovers. Ask who made the source and who is missing.",
      "Causes braid: trigger, short-term, long-term.",
      "Change and continuity travel together.",
      "Empathy reconstructs motives. It does not issue pardons.",
    ],
  },
  {
    id: "ancient-worlds-essentials",
    domainId: "ancient-worlds",
    title: "Rivers, roads, and who got fed",
    minutes: 14,
    intro:
      "Ancient states grew where surplus food could be stored and argued over: Nile, Tigris-Euphrates, Yellow River, later the Mediterranean. Writing, law, and monuments are technologies of memory and control — not just pretty ruins.",
    sections: [
      {
        heading: "Egypt: the river as a machine",
        paragraphs: [
          "The Nile flooded on a schedule people could farm. Surplus grain fed specialists: scribes, priests, builders. Pharaoh sat at the join of religion and administration. Pyramids are logistics problems as much as tombs — feeding crews, quarrying, flooding season labour.",
          "Hieroglyphs plus later scripts mean we hear some Egyptian voices. Still elite voices. Farmers are in the archaeology more than in the speeches.",
        ],
      },
      {
        heading: "Rome: a city that ate a sea",
        paragraphs: [
          "Rome scaled: roads, law, colonies, a professional army, and a talent for absorbing elites of conquered places. Republic first (senate, consuls, a performance of shared rule), then emperors who kept republican costumes. Citizenship expanded slowly, then in a rush in 212 CE.",
          "The empire ran on grain, slavery, and taxes. Bread and circuses is a joke with a body count. When supply lines and legitimacy both frayed in the west, the political centre of gravity had already been sliding east for a long time.",
        ],
        table: {
          headers: ["Tool", "What it did"],
          rows: [
            ["Road / sea lane", "Move grain and soldiers"],
            ["Law", "Make strangers predictable"],
            ["Colony / veteran land", "Plant loyalty"],
            ["Citizenship", "Buy-in, not just boots"],
          ],
        },
        callout: {
          type: "tip",
          text: "If you must remember one Roman move: they were better at incorporating people than most conquerors. That is a political technology.",
        },
      },
      {
        heading: "Han China: the exam and the granary",
        paragraphs: [
          "The Han inherited Qin unification and softened it. Confucian officials, a bureaucracy that prized written skill, state monopolies, and the Silk Road as a series of relays — not a freeway with a logo. Paper, later, would change what a state could remember.",
          "Compare with Rome without making it a contest: two huge agrarian empires, different theories of legitimacy (mandate vs. civic/military glory), both running on peasants who rarely got the statues.",
        ],
      },
      {
        heading: "What would you do: a grain year fails",
        paragraphs: [
          "You are an official. The flood is late. Granaries are low. Do you tax harder to keep the army, open stores and risk next year, or blame a rival for angering the gods? Ancient politics is logistics plus story.",
          "People chose all three, in different centuries. Collapse is often a slow unravelling of trust in those choices, not a single cinematic sack.",
        ],
        bullets: [
          "1. Measure stores and who still owes tax.",
          "2. Decide who eats first: city, army, temple, hinterland.",
          "3. Tell a story that keeps people from walking away.",
          "4. Live with the enemies that story makes.",
        ],
      },
    ],
    keyTakeaways: [
      "Surplus grain funds specialists and states.",
      "Rome scaled with roads, law, and incorporation.",
      "Han scaled with bureaucracy and agrarian control.",
      "Legitimacy is a logistics story that people have to keep believing.",
    ],
  },
  {
    id: "country-contact-essentials",
    domainId: "country-contact",
    title: "This continent was never empty",
    minutes: 14,
    intro:
      "Aboriginal and Torres Strait Islander peoples have been here for tens of thousands of years — among the world’s longest continuous cultures. 1788 is not the start of Australian history. It is a collision of sovereignties, and the records are uneven on purpose.",
    sections: [
      {
        heading: "Deep time is not a prologue",
        paragraphs: [
          "Archaeology, languages, and oral traditions describe occupation back beyond 60,000 years in some places. Fire-stick farming, aquaculture (Budj Bim), trade routes, and astronomical knowledge are technologies. “Hunter-gatherer” as a shrug hides that complexity.",
          "Country is not a synonym for dirt. It is law, kin, and responsibility. Songlines are maps and archives. Treat them as intellectual systems, because they are.",
        ],
        callout: {
          type: "watch",
          text: "Do not flatten hundreds of nations into one costume. Palawa, Yolngu, Noongar, Arrernte — different languages, law, and contact histories.",
        },
      },
      {
        heading: "1770 and 1788 are not the same event",
        paragraphs: [
          "Cook’s 1770 east-coast charting and possession claim is one legal story Britain told itself. The First Fleet in 1788 is a penal colony planted on Eora land around Warrane (Sydney Harbour). People were already there. Resistance and diplomacy start immediately — Pemulwuy is not a footnote.",
          "Terra nullius (land belonging to no one) was a doctrine, not a description. It made British property law simpler. The High Court rejected it as common law in Mabo (1992). Native title is not a vibe. It is a court finding that the empty-land story was wrong.",
        ],
      },
      {
        heading: "Frontier: word vs. what happened",
        paragraphs: [
          "Pastoral expansion was a land grab with violence, disease, and stolen children in different mixes by region. Some settlers wrote of “skirmishes.” Many First Nations histories name wars. Historians argue about numbers; they do not argue that it was peaceful.",
          "Mission stations, protection boards, and later assimilation policies were state projects. They produced records — which means they also produced surveillance. Read those files as power, not as neutral care.",
        ],
        table: {
          headers: ["Claim you will hear", "Better question"],
          rows: [
            ["“Peaceful settlement”", "Whose livestock, whose water?"],
            ["“They died of disease only”", "Disease plus dispossession plus violence?"],
            ["“History is just opinions”", "Which sources, which silences?"],
            ["“It was a long time ago”", "Which laws still sit on that story?"],
          ],
        },
      },
      {
        heading: "What would you do: a river station, 1830s",
        paragraphs: [
          "You are a new overseer. Sheep are on a river that is also a meeting place. People take sheep. Do you treat it as theft, as rent they were never paid, or as war? Your answer would have placed you on a side — and the archives still show people choosing differently.",
          "The point is not to win a simulation. It is to see that “the times” contained arguments, not one script.",
        ],
      },
    ],
    keyTakeaways: [
      "Deep-time cultures on this continent are the main story, not a preface.",
      "1770 ≠ 1788. Possession claims are not empty land.",
      "Terra nullius was a legal story; Mabo broke it in Australian common law.",
      "Frontier violence and policy are evidenced. Euphemism is a source problem.",
    ],
  },
  {
    id: "making-australia-essentials",
    domainId: "making-australia",
    title: "Colonies decide to share a roof",
    minutes: 13,
    intro:
      "Six British colonies federated in 1901. That is a political technology: tariffs, railways of different gauges, defence anxiety, and a deliberately limited who-counts-as-the-people. White Australia was not a side note. It was in the opening acts.",
    sections: [
      {
        heading: "Why federate at all",
        paragraphs: [
          "Colonies had separate tariffs and jealousies. Federation promised free trade inside, a common defence, and a louder voice. It was also about controlling the continent’s immigration and labour market. The 1890s conventions were full of lawyers and politicians, not a folk circle.",
          "New Zealand looked and did not join. Western Australia nearly didn’t. Referendums had to be won twice in some places. This was close-run club politics, not destiny.",
        ],
      },
      {
        heading: "The Constitution as a deal",
        paragraphs: [
          "A federal system splits power: states keep a pile, Canberra gets another (customs, defence, post, later much more via High Court and money). Section 51 is the shopping list. The High Court became a third player immediately.",
          "The Australian Settlement that followed mixed White Australia, protection, wage arbitration, and imperial loyalty. You can hate it and still need to describe it. It organised a century of politics.",
        ],
        table: {
          headers: ["Piece", "What it tried to lock in"],
          rows: [
            ["White Australia", "Who could come and stay"],
            ["Protection", "Tariffs for local industry"],
            ["Arbitration", "Wages as a public question"],
            ["Empire", "Foreign policy on a British leash, at first"],
          ],
        },
        callout: {
          type: "exam",
          text: "Federation is 1 January 1901. Democracy in Australia is older in some colonies (male suffrage, secret ballot) and younger for others (First Nations voting access, 1967’s practical effects).",
        },
      },
      {
        heading: "Who was the “people”",
        paragraphs: [
          "Some women voted in South Australia before Federation and kept that in the Commonwealth franchise — with racial exclusions attached. First Nations people could vote in some states and were shut out in others; federal law then narrowed it. The 1967 referendum did not “give the vote” (that is a common mix-up). It changed how the Constitution treated First Nations people in counting and special laws.",
          "Mix-ups like that are why this path exists. Precision is respect.",
        ],
      },
      {
        heading: "What would you do: a 1898 convention hall",
        paragraphs: [
          "You can trade: smaller states want a Senate that can block; bigger states want majority rule in the House. Labour wants a wage system. Pastoralists want a colour bar. You will not walk out with a pure principle. You will walk out with a document.",
          "That is why the Constitution is hard to change. They built a high threshold on purpose.",
        ],
        bullets: [
          "1. Who sits in the Senate, and can they kill a budget?",
          "2. Who is counted, and who is excluded, in the franchise?",
          "3. What stays with the states?",
          "4. How hard should it be to amend later?",
        ],
      },
    ],
    keyTakeaways: [
      "Federation was a negotiated club, not a folk inevitability.",
      "The Constitution splits power and is deliberately hard to change.",
      "White Australia and labour protection were core, not garnish.",
      "1967 is not “the year First Nations people got the vote.” Check the actual question.",
    ],
  },
  {
    id: "twentieth-century-essentials",
    domainId: "twentieth-century",
    title: "A century that would not sit still",
    minutes: 14,
    intro:
      "Two world wars, a depression, decolonisation, a cold war, and rights movements rewrote maps and kitchens. Australia’s story sits inside that: Gallipoli and the Western Front, the fall of Singapore, post-war migration, Vietnam, land rights. Choose a moment and look for the decision, not the anniversary branding.",
    sections: [
      {
        heading: "1914–18: a remote war that arrived as lists",
        paragraphs: [
          "Australia entered World War I as part of the Empire, not after a Senate philosophy seminar. Gallipoli 1915 became a founding myth: courage, waste, a nationhood story. The Western Front killed more Australians. Conscription referendums failed — the country split without leaving the war.",
          "Myths do work. They also hide the Imperial context, the Ottoman dead, and the First Nations men who enlisted and came home to the same exclusions.",
        ],
      },
      {
        heading: "1939–45: when the map moved south",
        paragraphs: [
          "World War II in Europe and the Pacific is not two separate movies that happen to share a decade. After Singapore fell in 1942, invasion fear in Australia was specific, not abstract. Darwin was bombed. The US alliance thickened. John Curtin’s look to America is a real pivot in the paperwork.",
          "The Holocaust is industrial murder by a state. It is not a metaphor for something milder. Post-war migration (“populate or perish”) remade Australian cities with people who had seen that map.",
        ],
        table: {
          headers: ["Turn", "Why it matters here"],
          rows: [
            ["Gallipoli / France", "Nationhood story vs. casualty lists"],
            ["Singapore 1942", "Empire cannot guarantee the north"],
            ["Post-war migration", "New people, slower to change the White Australia law"],
            ["Vietnam / 1970s", "Alliance politics and a louder street"],
          ],
        },
      },
      {
        heading: "Rights are fought for in decades, not days",
        paragraphs: [
          "The UN, decolonisation, and civil rights were global. In Australia: 1967, equal pay fights, the 1972 Tent Embassy, Mabo, Wik, apology to the Stolen Generations (2008). None of these is a ribbon-cutting that finished the job. They are legal and moral leverage.",
          "The Cold War made some of those fights look like security questions to governments. That is part of the evidence, not a reason to skip them.",
        ],
        callout: {
          type: "tip",
          text: "When a politician says “we don’t rewrite history,” they are rewriting it. The argument is always which story gets the statue.",
        },
      },
      {
        heading: "What would you do: a ridge, 1915",
        paragraphs: [
          "You are a junior officer. The maps are wrong. The water is gone. Orders say attack at dawn. Do you send the men, delay and risk court-martial, or write the truth uphill knowing it may be filed as weakness? This is not a trick with one honourable button.",
          "The historical skill is seeing the box they were in: communications, class, empire, the cult of offensive spirit. Then you can judge without pretending you would have had a satellite phone.",
        ],
      },
    ],
    keyTakeaways: [
      "WWI: imperial entry, Gallipoli myth, larger deaths in France, failed conscription votes.",
      "WWII: Singapore and 1942 shift Australia’s security story toward the US.",
      "Rights movements are long campaigns with legal teeth, not single dates.",
      "Judging the past needs the constraints they had — and the dissenters they had.",
    ],
  },
];
