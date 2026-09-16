import type { Quiz } from "../types";

function q(
  id: string,
  prompt: string,
  choices: [string, string, string, string],
  correctIndex: number,
  explanation: string,
) {
  return { id, prompt, choices, correctIndex, explanation };
}

export const historyQuizzes: Quiz[] = [
  {
    id: "historical-thinking-quiz",
    domainId: "historical-thinking",
    title: "How history works",
    questions: [
      q("ht1", "A captain’s 1788 log is", ["secondary and therefore useless", "primary, and still biased", "not a source", "the same as a textbook"], 1, "He was there. He also wrote for an employer. Use both facts."),
      q("ht2", "A textbook chapter on Rome is usually", ["primary", "secondary", "not historical", "an artefact from Rome"], 1, "It argues about leftovers. Still useful. Still someone’s frame."),
      q("ht3", "“The assassination caused WWI” is weakest as", ["a complete cause", "a trigger among longer causes", "a date", "a name"], 0, "Sparks need tinder: alliances, militarism, imperial rivalry."),
      q("ht4", "Continuity means", ["nothing important happened", "some structures persist through a change", "time stopped", "only villains remain"], 1, "Flags change. Many lives do not, overnight."),
      q("ht5", "Historical empathy is", ["dressing up and forgiving everything", "reconstructing why a choice made sense then", "using 2026 morals as the only lens", "ignoring crimes"], 1, "Understand the box. Still allowed to judge."),
      q("ht6", "Silences in a record are", ["always a conspiracy", "evidence you should notice (who is missing)", "proof nothing happened", "only about paper shortages"], 1, "Who got to write is a power question."),
      q("ht7", "Period labels like “Medieval” are", ["universal natural facts", "useful filing cabinets, often Eurocentric", "primary sources", "illegal"], 1, "Other societies do not owe Europe those drawers."),
      q("ht8", "Bias in a source means you should", ["bin it", "read it as a handle: who, for whom", "only use archaeology", "average it with Twitter"], 1, "Biased sources are still sources."),
    ],
  },
  {
    id: "ancient-worlds-quiz",
    domainId: "ancient-worlds",
    title: "Ancient worlds",
    questions: [
      q("aw1", "Nile floods mattered because they", ["entertained tourists", "made surplus grain and specialists possible", "stopped writing", "invented democracy"], 1, "Surplus feeds scribes, priests, crews — the state kit."),
      q("aw2", "Pyramids are, among other things,", ["only magic", "logistics: labour, stone, flood-season organisation", "Roman copies", "unfinished dams"], 1, "A crew-feeding problem with theology on top."),
      q("aw3", "A Roman political technology worth remembering:", ["never building roads", "incorporating elites and extending citizenship (slowly, then not)", "banning law", "avoiding the sea"], 1, "They were good at turning outsiders into stakeholders — on Roman terms."),
      q("aw4", "The Roman west “falling” is best seen as", ["one afternoon in a cinema", "a long unravelling of logistics and legitimacy", "China invading", "the Nile stopping"], 1, "Centres of gravity had been sliding east already."),
      q("aw5", "Han governance leaned on", ["gladiators", "bureaucracy, written skill, agrarian control", "a senate identical to Rome’s", "no taxes"], 1, "Different legitimacy story, similar peasant base."),
      q("aw6", "The Silk Road was mainly", ["a single freeway brand", "relay trade across many hands", "a Roman invention only", "underwater"], 1, "Goods moved farther than most people did."),
      q("aw7", "When a grain year fails, ancient officials faced", ["only prayer", "logistics plus a story that keeps people from walking off", "unlimited imports from Australia", "printing money"], 1, "Tax, stores, army, temple — pick who eats."),
      q("aw8", "Writing in these states was a tool for", ["fan fiction only", "memory, law, and control", "replacing agriculture", "ending religion"], 1, "Lists and decrees scale better than a chief’s memory."),
    ],
  },
  {
    id: "country-contact-quiz",
    domainId: "country-contact",
    title: "Country & contact",
    questions: [
      q("cc1", "Australian history begins", ["in 1788", "tens of thousands of years earlier on this continent", "in 1901", "when Cook left England"], 1, "1788 is a collision, not a creation of the land’s human story."),
      q("cc2", "Terra nullius was", ["an accurate empty-land survey", "a legal doctrine that made British property simpler", "a Yolngu word for welcome", "a 1990s invention"], 1, "Mabo (1992) rejected it as common-law description."),
      q("cc3", "Cook 1770 and the First Fleet 1788 are", ["the same event", "different moments (chart/claim vs. colony on Eora land)", "both in Perth", "unrelated to Britain"], 1, "Do not collapse them. People were already here both times."),
      q("cc4", "Country, in this path, means", ["only dirt", "land as law, kin, and responsibility", "a sports team", "the British Crown"], 1, "Songlines are maps and archives."),
      q("cc5", "Mabo is important because it", ["gave everyone a house", "recognised native title and dumped terra nullius in common law", "repealed Federation", "ended all disputes"], 1, "A court finding, not a vibe. It did not finish every fight."),
      q("cc6", "Frontier expansion is best described as", ["peaceful unused parkland", "dispossession with violence, disease, and regional variation", "a gold-rush picnic", "uncontested"], 1, "Historians argue numbers. They do not argue it was gentle."),
      q("cc7", "“They were just products of their time” fails because", ["nobody argued then", "people at the time still disagreed with each other", "ethics hadn’t been invented", "there were no sources"], 1, "Critics existed. Structure is not a mute button."),
      q("cc8", "Hundreds of First Nations means", ["one costume is fine", "languages, law, and contact histories differ", "only the desert counts", "history starts at Botany Bay"], 1, "Palawa is not Yolngu. Precision is respect."),
    ],
  },
  {
    id: "making-australia-quiz",
    domainId: "making-australia",
    title: "Making Australia",
    questions: [
      q("ma1", "Federation happened in", ["1788", "1901", "1967", "1915"], 1, "1 January 1901. Six colonies under one roof."),
      q("ma2", "A big practical reason to federate:", ["identical railway gauges already", "defence, internal free trade, immigration control", "New Zealand demanding it", "ending states"], 1, "Tariffs and jealousy were features, not bugs, of the old setup."),
      q("ma3", "The Australian Settlement included", ["open borders and free trade only", "White Australia, protection, wage arbitration", "republicanism in 1901", "native title as clause 1"], 1, "Describe it before you dunk on it. It organised a politics."),
      q("ma4", "The 1967 referendum", ["gave First Nations people the vote for the first time, full stop", "changed constitutional counting/special-laws treatment — the vote story is more complicated", "created Federation", "repealed White Australia that afternoon"], 1, "Common mix-up. Check the actual question."),
      q("ma5", "The Senate exists partly because", ["small states wanted a chamber that could check the House", "Britain demanded gladiators", "there were no colonies", "voting was illegal"], 0, "Federation was a deal among unequally sized clubs."),
      q("ma6", "Changing the Constitution is", ["a casual statute", "deliberately hard (referendum rules)", "done by the Governor alone", "impossible"], 1, "They built a high threshold on purpose."),
      q("ma7", "White Australia as policy was", ["a rumour", "central to early Commonwealth law, not a side note", "only about tariffs", "invented in 1967"], 1, "Immigration control was a selling point of union."),
      q("ma8", "Women’s suffrage in Australia", ["started everywhere in 1901 identically", "was uneven: some colonies earlier, racial exclusions attached", "never happened", "required Mabo first"], 1, "South Australia is early. The franchise still had racial bars."),
    ],
  },
  {
    id: "twentieth-century-quiz",
    domainId: "twentieth-century",
    title: "The twentieth century",
    questions: [
      q("tc1", "Australia entered WWI primarily as", ["a UN member", "part of the British Empire", "a US state", "a Japanese ally"], 1, "Not a long Senate seminar. Imperial automaticity."),
      q("tc2", "Gallipoli vs. the Western Front:", ["Gallipoli killed more Australians", "France/Belgium killed more; Gallipoli became the louder myth", "neither involved Australians", "only New Zealand fought in France"], 1, "Myths do work. Body counts still count."),
      q("tc3", "WWI conscription referendums in Australia", ["passed easily", "failed, splitting the country without leaving the war", "were never held", "applied only to horses"], 1, "A bitter civilian fight inside an imperial war."),
      q("tc4", "Singapore 1942 mattered here because", ["it was a sports result", "it smashed the idea that the Empire could guarantee Australia’s north", "Japan joined the Commonwealth", "it ended migration"], 1, "Curtin’s look to the US sits in that shock."),
      q("tc5", "The Holocaust is", ["a metaphor for rationing", "industrial murder by a state", "a single battlefield", "unrelated to post-war migration"], 1, "Do not dilute it. Post-war arrivals carried that map."),
      q("tc6", "“Populate or perish” names", ["a gold rush", "post-war migration as a security/population project", "Federation", "Gallipoli"], 1, "New people, slower death of White Australia."),
      q("tc7", "A junior officer at Gallipoli with bad maps is a lesson in", ["one honourable button", "constraints: comms, class, offensive doctrine — plus still making a choice", "modern satellite ethics", "ignoring the men"], 1, "Judge the box they were in. Do not pretend you had GPS."),
      q("tc8", "Land rights / Mabo / Tent Embassy are", ["finished business from 1901", "long campaigns with legal and street pressure", "British army orders", "only about sport"], 1, "Dates are leverage, not finish lines."),
    ],
  },
];
