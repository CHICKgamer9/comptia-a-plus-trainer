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

export const scienceQuizzes: Quiz[] = [
  {
    id: "atoms-matter-quiz",
    domainId: "atoms-matter",
    title: "Atoms & matter",
    questions: [
      q("am1", "What identifies an element?", ["Neutron count", "Proton count (atomic number)", "How shiny it is", "The mass number only"], 1, "Atomic number = protons. That is the element’s ID. Neutrons make isotopes."),
      q("am2", "Ice → water is mainly", ["a chemical change into a new substance", "the same particles, more freedom to move", "atoms splitting", "oxygen leaving"], 1, "State change. H₂O stays H₂O."),
      q("am3", "A compound is", ["a salad you can sieve", "atoms bonded in a fixed recipe", "one kind of atom", "anything wet"], 1, "Water is H₂O. Salt water is a mixture."),
      q("am4", "In a closed jar, a burning candle’s atoms", ["vanish", "are conserved, rearranged into gases", "turn into energy with no mass", "become neutrons"], 1, "Mass is conserved if nothing leaves. Open air lets the gases go."),
      q("am5", "Ionic bonding, in one line:", ["electrons shared", "electrons transferred, ions attract", "a metal sea", "gravity between nuclei"], 1, "Salt is the poster: Na⁺ and Cl⁻."),
      q("am6", "Noble gases sit where they do because", ["they are metals", "their electron arrangements look finished", "they are radioactive", "they form ions easily"], 1, "Group 18 is unreactive compared with Group 1."),
      q("am7", "Isotopes of carbon differ in", ["protons", "neutrons", "element name", "electron charge"], 1, "Same protons (still carbon), different neutrons. C-12 vs C-14."),
      q("am8", "Melting chocolate is", ["chemical", "physical", "nuclear", "impossible to classify"], 1, "Same substance, new state. Baking it into a cake is a different story."),
    ],
  },
  {
    id: "forces-motion-quiz",
    domainId: "forces-motion",
    title: "Forces & motion",
    questions: [
      q("fm1", "A bike slowing on flat ground is mainly", ["motion wearing out", "unbalanced friction and drag", "Newton 3 failing", "mass decreasing"], 1, "Newton 1: it would keep going if net force were zero."),
      q("fm2", "F = ma says, for the same force, more mass means", ["more acceleration", "less acceleration", "no change", "more weight only on the Moon"], 1, "Inertia. Heavier things need more force for the same kick."),
      q("fm3", "A car turning at constant speed is", ["not accelerating", "accelerating (direction changes)", "weightless", "in Newton 1 only"], 1, "Velocity includes direction. Roundabouts are acceleration."),
      q("fm4", "Mass vs weight:", ["same units", "mass is kg; weight is a force (N)", "weight never changes", "mass is only on Earth"], 1, "Moon: same mass, smaller weight."),
      q("fm5", "Newton 3 pairs act", ["on the same object, delayed", "on two objects, simultaneously, opposite", "only in space", "only when something moves"], 1, "You push the wall; the wall pushes you. Equal size."),
      q("fm6", "Terminal velocity means", ["no gravity", "drag + other resistance balance weight", "mass is zero", "Newton 2 is off"], 1, "Net force returns to zero, so acceleration stops."),
      q("fm7", "Holding a fridge still does", ["lots of work on the fridge", "zero work on the fridge (no movement)", "negative mass", "create energy"], 1, "Work needs displacement in the force’s direction."),
      q("fm8", "Net force zero implies", ["no forces exist", "constant velocity (including rest)", "it must be in space", "it is accelerating"], 1, "Forces can cancel. That is not the same as absent."),
    ],
  },
  {
    id: "energy-systems-quiz",
    domainId: "energy-systems",
    title: "Energy",
    questions: [
      q("en1", "In a closed system, total energy", ["falls to zero", "is conserved (changes form)", "becomes mass always", "is only kinetic"], 1, "Transfers and transformations. The ledger still balances."),
      q("en2", "A toaster’s waste is mostly", ["sound", "thermal energy of the room", "missing atoms", "potential energy"], 1, "Useful output is hot bread. The rest heats the kitchen."),
      q("en3", "Efficiency is", ["useful output / total input", "input / output", "always 100% if new", "voltage × time"], 0, "Real machines leak heat. 100% would be a physics celebrity."),
      q("en4", "Water behind a dam is mainly storing", ["chemical energy", "gravitational potential", "nuclear", "sound"], 1, "Height in a gravitational field. Hydro unwraps it."),
      q("en5", "Power is", ["energy stored", "energy transferred per second", "force × mass", "always in joules"], 1, "Watts. A bigger kettle is a faster transfer, not a different kind of tea."),
      q("en6", "Fossil fuels are, energetically,", ["created in mines as heat", "old stored chemical energy from photosynthesis", "pure potential with no carbon", "geothermal"], 1, "Burning is a fast unwind of buried carbon."),
      q("en7", "Work on an object requires", ["feeling tired", "force and movement along that force", "high temperature", "electricity"], 1, "A tired statue-holder does zero work on the statue."),
      q("en8", "Name input, useful output, waste for a solar panel:", ["light → electrical + heat", "heat → light + sound", "chemical → nuclear", "wind → food"], 0, "If you can name those three, you understand the device."),
    ],
  },
  {
    id: "cells-life-quiz",
    domainId: "cells-life",
    title: "Cells & life",
    questions: [
      q("cl1", "New cells come from", ["wheat piles", "existing cells", "viruses assembling them", "spontaneous clay"], 1, "Cell theory. Spontaneous generation lost."),
      q("cl2", "Bacteria are typically", ["eukaryotes with chloroplasts", "prokaryotes without a nucleus", "not made of cells", "plants"], 1, "DNA loose in the cell. No nucleus membrane."),
      q("cl3", "Mitochondria’s headline job is", ["photosynthesis", "respiration / ATP", "making cellulose", "storing DNA for plants only"], 1, "You have them. Plants have them too, plus chloroplasts."),
      q("cl4", "A virus is", ["a small bacterium", "genetic material in a coat that hijacks cells", "a type of fungus", "killed by all antibiotics"], 1, "No metabolism of its own. Antibiotics target bacteria."),
      q("cl5", "A gene is", ["always destiny", "usually a DNA recipe for a protein", "a chromosome", "only in animals"], 1, "Environment still gets a vote."),
      q("cl6", "Plant cells, unlike typical animal cells, have", ["ribosomes", "a cellulose wall (and usually chloroplasts / big vacuole)", "membranes", "DNA"], 1, "That’s why celery snaps."),
      q("cl7", "Mitosis is for", ["halving chromosomes for gametes", "growth and repair copies", "killing viruses", "making ATP"], 1, "Meiosis is the half-set shuffle."),
      q("cl8", "Antibiotics are the right tool for", ["influenza", "a bacterial infection (when indicated)", "all fevers", "broken bones"], 1, "Viral illnesses ignore them. Stewardship matters."),
    ],
  },
  {
    id: "ecosystems-au-quiz",
    domainId: "ecosystems-au",
    title: "Ecosystems",
    questions: [
      q("ec1", "In a food web, arrows show", ["who eats (point to predator? wait)", "energy flow (toward the eater)", "migration only", "rainfall"], 1, "Energy goes to the consumer. People reverse arrows constantly."),
      q("ec2", "Roughly how much energy moves up one trophic level?", ["90%", "10%", "50%", "100%"], 1, "The rest is used or lost as heat. Hence few apex predators."),
      q("ec3", "Producers are", ["dingoes", "plants/algae catching sunlight", "only fungi", "humans"], 1, "Photosynthesis is the usual on-ramp."),
      q("ec4", "Many Australian plants cope with fire by", ["never burning", "traits like serotiny / epicormic buds", "moving to New Zealand", "storing petrol"], 1, "Heat-opening cones, lignotubers, oily leaves — fire is part of the system."),
      q("ec5", "Coral bleaching is mainly", ["fish eating coral overnight", "corals losing their algal partners under heat stress", "plastic turning white", "tides stopping"], 1, "The partnership fails in marine heatwaves."),
      q("ec6", "Cane toads in Australia are", ["native keystones", "an introduced species with messy consequences", "producers", "extinct"], 1, "Isolation then a shipping plot twist."),
      q("ec7", "Matter in ecosystems", ["vanishes when something dies", "cycles (decomposers included)", "only flows like energy", "is created by predators"], 1, "Energy flows through; atoms get reused."),
      q("ec8", "Terraforming a paddock still sits in", ["outer space", "a catchment / ecosystem", "a food vacuum", "the mantle"], 1, "Drains are tributaries with branding."),
    ],
  },
];
