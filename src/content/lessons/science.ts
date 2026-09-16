import type { Lesson } from "../types";
import { diagramFigure } from "../figures";

export const scienceLessons: Lesson[] = [
  {
    id: "atoms-matter-essentials",
    domainId: "atoms-matter",
    title: "Matter is packed, not smooth",
    minutes: 12,
    intro:
      "Everything you can poke is made of atoms — nuclei of protons and neutrons, electrons in a cloud, not little planets on rails. Chemistry is rearranging those Lego blocks. The atoms themselves almost never vanish in a classroom reaction.",
    sections: [
      {
        heading: "The particle picture",
        paragraphs: [
          "An element is one kind of atom. Carbon is carbon whether it is diamond or the graphite in a pencil. A compound is atoms bonded in a fixed recipe: water is H₂O, not “some hydrogen near some oxygen.” A mixture is a salad — salt water, air — you can usually unmix it.",
          "Atoms are mostly empty space with a dense nucleus. If the nucleus were a pea in a stadium, the electrons would be gnats in the cheap seats. Solid, liquid, gas is how packed and how free to move those particles are — not three different substances.",
        ],
        callout: {
          type: "tip",
          text: "Heat a solid and the particles jiggle harder. Melt means they can slide. Boil means they can fly. The particles are the same water the whole time.",
        },
      },
      {
        heading: "States and changes of state",
        paragraphs: [
          "Ice, water, steam: same H₂O, different freedom. Melting and boiling need energy to break attractions, not to “make heat particles.” Condensation and freezing dump that energy back out — which is why steam burns worse than the pot water.",
          "Mass is conserved in a closed jar. A candle in a bell jar does not destroy wax; it turns it into gases you could, in principle, weigh. If the jar is open, the gases leave and people say the wax “vanished.”",
        ],
        table: {
          headers: ["Change", "What the particles do"],
          rows: [
            ["Melt", "Packed but sliding"],
            ["Boil / evaporate", "Escape as a gas"],
            ["Condense", "Gas sticks back into liquid"],
            ["Freeze", "Lock into a solid pattern"],
          ],
        },
      },
      {
        heading: "The periodic table is a seating chart",
        paragraphs: [
          "Rows (periods) add electron shells. Columns (groups) share personality: Group 1 is keen to lose an electron, Group 18 (noble gases) already look finished. Atomic number is protons — that is the element’s ID. Mass number is protons plus neutrons.",
          "Isotopes are the same element with different neutron counts. Carbon-12 and carbon-14 are both carbon. One is stable. One is the clock in old bones.",
        ],
      },
      {
        heading: "Bonds are deals, not glue sticks",
        paragraphs: [
          "Ionic: electrons transferred, ions attract (salt). Covalent: electrons shared (water, carbon dioxide). Metals: a sea of electrons, which is why they conduct. You do not need the full Year 11 treatment — you need to know a reaction rearranges deals, it does not invent gold.",
          "A chemical change makes a new substance (baking soda + vinegar, rust). A physical change does not (melting chocolate, tearing paper). Bubbles, heat, colour, or a precipitate are clues, not proof on their own — but they are the clues you actually get.",
        ],
        callout: {
          type: "watch",
          text: "Atoms are conserved. If a reaction “makes gas,” the atoms were in the reactants. Count them. That is balancing.",
        },
      },
    ],
    keyTakeaways: [
      "Atoms: dense nucleus, electron cloud. Element = proton count.",
      "State changes move particles; they do not transmute them.",
      "Mixtures unmix; compounds have a recipe.",
      "Chemical change rearranges bonds. Mass is conserved if nothing leaves.",
    ],
  },
  {
    id: "forces-motion-essentials",
    domainId: "forces-motion",
    title: "Pushes that add up",
    minutes: 13,
    intro:
      "A force is a push or pull measured in newtons. Motion does not require a force to keep going — that is the lie your muscles tell you. Forces change motion. Friction and air are forces too, which is why Earth is not an ice rink.",
    sections: [
      {
        heading: "Newton 1: leave it alone and it keeps doing that",
        paragraphs: [
          "An object at rest stays at rest. An object moving at constant velocity keeps that velocity — unless a net force acts. The reason a bike slows is not “motion wearing out.” It is friction and drag stealing speed.",
          "In space, a probe does not need an engine to keep coasting. Engines are for changing velocity: speeding up, slowing down, or turning.",
        ],
        callout: {
          type: "exam",
          text: "Constant speed in a straight line means net force is zero — not “no forces exist.” They cancel.",
        },
      },
      {
        heading: "Newton 2: unbalanced force means acceleration",
        paragraphs: [
          "F = ma. More net force, more acceleration. More mass, less acceleration for the same force. Acceleration is any change in velocity: faster, slower, or turning. A car on a roundabout at 60 km/h is accelerating because its direction is changing.",
          "Weight is the gravitational force: W = mg. On Earth g is about 9.8 m/s². Mass does not change on the Moon. Weight does. Your kitchen scale is secretly a force meter that got labelled in kilograms for convenience — physicists still side-eye it.",
        ],
        table: {
          headers: ["Idea", "In one line"],
          rows: [
            ["Mass", "How much stuff (kg)"],
            ["Weight", "Gravity’s pull (N)"],
            ["Speed", "How fast"],
            ["Velocity", "Speed plus direction"],
            ["Acceleration", "Change of velocity"],
          ],
        },
      },
      {
        heading: "Newton 3: you cannot punch the universe without it punching back",
        paragraphs: [
          "Forces come in pairs: equal size, opposite direction, on different objects. You push the wall, the wall pushes you. A rocket pushes gas backwards; gas pushes the rocket forwards. The pair is not “action then later reaction.” They are simultaneous.",
          "If the pair is equal, why does anything move? Because the forces act on different bodies. You and the Earth pull each other; you move more because your mass is a joke compared with the planet.",
        ],
      },
      {
        heading: "Friction is not always the villain",
        paragraphs: [
          "Static friction lets you walk. Without it, shoes polish ice. Kinetic friction opposes sliding. Drag grows with speed, which is why a skydiver stops speeding up and hits terminal velocity — forces balance again.",
          "A free-body sketch is the whole method: draw the object, arrows for each force, ask whether they cancel. If they do not, something is accelerating.",
        ],
        bullets: [
          "1. Name the object.",
          "2. Draw every force on it (not the ones it inflicts on others).",
          "3. Ask if they cancel.",
          "4. If not, it accelerates in the net direction.",
        ],
      },
    ],
    keyTakeaways: [
      "Net force zero → constant velocity (including rest).",
      "F = ma. Turning counts as acceleration.",
      "Weight is a force; mass is not.",
      "Force pairs act on two different objects at the same time.",
    ],
  },
  {
    id: "energy-systems-essentials",
    domainId: "energy-systems",
    title: "Energy changes clothes, not amount",
    minutes: 12,
    intro:
      "Energy is the bookkeeping of change: kinetic, gravitational potential, chemical, thermal, electrical, light. In a closed system the total holds. Devices do not “use up” energy. They turn it into forms you wanted plus waste heat you did not.",
    sections: [
      {
        heading: "Name the form",
        paragraphs: [
          "A cyclist at speed has kinetic energy. At the top of a hill, more gravitational potential. A muesli bar is chemical. A phone battery is chemical too, waiting to be electrical. Sound and light are waves carrying energy. Heat is the messy kinetic energy of jostling particles.",
          "You cannot see energy as a fluid. You infer it from what can happen next: fall, burn, glow, move.",
        ],
        table: {
          headers: ["Form", "Everyday stash"],
          rows: [
            ["Kinetic", "A moving tram"],
            ["Gravitational", "Water behind a dam"],
            ["Chemical", "Petrol, food, battery"],
            ["Thermal", "Hot soup"],
            ["Electrical", "A circuit that is actually on"],
          ],
        },
      },
      {
        heading: "Transfers and conservation",
        paragraphs: [
          "A toaster turns electrical energy into thermal and a bit of light. A solar panel turns light into electrical (not very efficiently). A hydro dam turns gravitational potential into kinetic then electrical. At each step some leaks as heat. Conservation still holds: the leak is not a disappearance. It is a spread-out form that is hard to recapture.",
          "Efficiency is useful output over total input. 100% would mean no waste heat. Nothing you own is 100%. That is physics, not a defective brand.",
        ],
        callout: {
          type: "watch",
          text: "“Energy is used up” is everyday talk. In the ledger it was transferred, usually into thermal energy of the room.",
        },
      },
      {
        heading: "Work and power",
        paragraphs: [
          "Work, in physics, is force times distance in the direction of the force. Holding a piano still is exhausting and does zero work on the piano — it did not move. Carrying it upstairs does work against gravity.",
          "Power is work (or energy transferred) per second, in watts. A 2,400 W kettle is not “stronger magic.” It transfers energy faster. Same tea, less time, more current.",
        ],
      },
      {
        heading: "Earth’s energy budget, quickly",
        paragraphs: [
          "Almost all surface energy starts as sunlight. Photosynthesis stores some as chemical. We dig up old photosynthesis as coal and oil. Burning it is a fast unwind of carbon that took ages to bury — that is the climate problem in one mechanism, not a vibe.",
          "Renewables harvest the current sunlight (solar), its knock-ons (wind, hydro), or Earth’s interior (geothermal). They still have trade-offs. Physics does not do free lunch. It does do better menus.",
        ],
        callout: {
          type: "tip",
          text: "If you can name the input form, the useful output, and the waste, you already understand the device.",
        },
      },
    ],
    keyTakeaways: [
      "Energy has forms; it transfers; the total in a closed system holds.",
      "Waste heat is still energy. Efficiency is never 100% in real machines.",
      "Work needs movement in the force’s direction. Power is the rate.",
      "Fossil carbon is stored sunlight released quickly.",
    ],
  },
  {
    id: "cells-life-essentials",
    domainId: "cells-life",
    title: "Life has a smallest room",
    minutes: 13,
    intro:
      "A cell is the smallest unit that is unambiguously alive: membrane, chemistry, and (usually) DNA. Bacteria are one room. You are a city of rooms. Viruses are not cells — they are instructions that hijack rooms.",
    sections: [
      {
        heading: "Cell theory, without the poster glaze",
        paragraphs: [
          "All living things are made of cells. New cells come from existing cells. That second sentence is why “spontaneous mice from wheat” died as a theory. Microscopes plus careful experiments beat folklore.",
          "A membrane decides what enters. Cytoplasm is the workplace. DNA is the recipe book. Ribosomes read recipes to build proteins. That kit is shared from E. coli to eucalypts.",
        ],
      },
      {
        heading: "Prokaryote vs eukaryote",
        paragraphs: [
          "Bacteria and archaea: no nucleus, DNA loose, generally smaller. Plants, animals, fungi, protists: nucleus, membrane-bound organelles. Mitochondria release usable energy from food. Chloroplasts (plants, algae) capture light. You have mitochondria because an ancient merger went extremely well.",
          "Plant cells add a cellulose wall and usually a big vacuole. That is why celery snaps and steak does not.",
        ],
        table: {
          headers: ["Part", "Job"],
          rows: [
            ["Nucleus", "Keeps the DNA"],
            ["Mitochondria", "Respiration, ATP"],
            ["Chloroplast", "Photosynthesis"],
            ["Membrane", "Gate and skin"],
            ["Cell wall", "Rigid plant/fungal support"],
          ],
        },
      },
      {
        heading: "DNA, genes, and not destiny-in-a-sentence",
        paragraphs: [
          "DNA is a four-letter code (A, T, C, G). A gene is a stretch that usually codes for a protein. You inherited two copies of most genes, one from each parent. Environment still matters: sunlight, diet, training, luck.",
          "Mitosis copies a cell for growth and repair. Meiosis makes gametes with half the chromosomes so fertilisation restores the count. Mix-ups here are how sexed species keep shuffling the deck.",
        ],
        callout: {
          type: "watch",
          text: "A virus is not a cell. It has genetic material in a coat and no metabolism of its own. Antibiotics target bacteria, not viruses. That distinction saves lives.",
        },
      },
      {
        heading: "From cells to you",
        paragraphs: [
          "Cells → tissues → organs → systems. A muscle cell is specialised; it turned some genes up and others down. Stem cells are less decided. Cancer is a control failure: divide too much, ignore stop signs.",
          "You do not need a medical degree. You need the map: life is compartmentalised chemistry running on recipes that copy, with errors, which is both evolution and cancer depending on timescale and luck.",
        ],
      },
    ],
    keyTakeaways: [
      "Cells from cells. Membrane + metabolism + information.",
      "Eukaryotes hide DNA in a nucleus and run organelles.",
      "Genes are DNA recipes; they are not the whole story.",
      "Viruses hijack. Antibiotics are for bacteria.",
    ],
  },
  {
    id: "ecosystems-au-essentials",
    domainId: "ecosystems-au",
    title: "Who eats whom, and what fire does",
    minutes: 14,
    intro:
      "An ecosystem is living things plus the non-living stage they share. Energy flows one way (sun → eaters → heat). Matter cycles. Australia is not a generic forest poster: poor soils, fire, El Niño, and species that evolved in isolation.",
    figure: diagramFigure(
      "food-web",
      "Simple Australian food web from sun to paperbark and grasses, then possum and insect, then magpie. Arrows mean is eaten by.",
      "Start from the sun. Arrows are “is eaten by.” A chain is a cartoon; a web is the map.",
    ),
    sections: [
      {
        heading: "Food webs, not chains",
        paragraphs: [
          "A chain is a cartoon. A web is the real map: many arrows, omnivores, scavengers. Producers (plants, algae, some bacteria) catch sunlight. Consumers eat. Decomposers unlock the atoms again. Knock out a species and the arrows reroute — or they do not, and you get a mess.",
          "Only about 10% of the energy in one level shows up in the next. That is why there are more grass plants than dingoes, and why a meat-heavy plate is energetically expensive.",
        ],
        callout: {
          type: "tip",
          text: "Arrows in a food web mean “energy goes this way,” which is “is eaten by,” not “eats.” People reverse them constantly.",
        },
      },
      {
        heading: "Cycles: carbon, water, nitrogen",
        paragraphs: [
          "Carbon: photosynthesis in, respiration and burning out. The ocean and rocks are huge vaults. Fast-burning vaults we opened with coal and oil is the climate lever.",
          "Water: evaporate, condense, rain, flow, freeze. Nitrogen: air is full of it, but most living things cannot use N₂ until bacteria (or fertiliser factories) fix it. Over-fertilise a river and algae boom, then crash, then fish suffocate. That is a nutrient plot, not a mystery.",
        ],
      },
      {
        heading: "Australian wrinkles",
        paragraphs: [
          "This continent is old, weathered, and often nutrient-poor. Eucalypts and banksias are stingy-soil specialists. Many plants want fire: some banksia cones open after heat, some eucalypt seeds sit in capsules until a burn. Aboriginal fire management (cool burns, mosaic country) is science and law, not a campfire story — it shaped the living map for tens of thousands of years.",
          "The Great Barrier Reef is a coral city in partnership with algae. Warm too long and the algae leave: bleaching. Cane toads, rabbits, and cats are introduced plot twists. Isolation made marsupials and monotremes; ships made invasives.",
        ],
        table: {
          headers: ["Place", "Thing to notice"],
          rows: [
            ["Red Centre", "Boom-bust rain, fire, spinifex"],
            ["Reef", "Coral + algae, heat stress"],
            ["Wet tropics", "Ancient rainforest refuges"],
            ["Southern bush", "Eucalypt, oil, crown fire"],
          ],
        },
      },
      {
        heading: "Interdependence and the human patch",
        paragraphs: [
          "Keystone species punch above their weight — a predator that stops one herbivore eating the place bare. Remove it and the web slumps. Climate shifts the stage (heat, drought, marine heatwaves) faster than some species can walk.",
          "Conservation is not “nature over there.” Cities still sit in catchments. A stormwater drain is a tributary with branding.",
        ],
        callout: {
          type: "exam",
          text: "If a question gives you a web and asks what happens when one species dies, follow the arrows and the 10% rule — do not invent a moral.",
        },
      },
    ],
    keyTakeaways: [
      "Energy flows, matter cycles. Webs beat chains.",
      "~10% of energy moves up a level.",
      "Australia: poor soils, fire-adapted plants, isolation, invasives.",
      "Bleaching, toads, and drought are mechanism questions, not vibes.",
    ],
  },
];
