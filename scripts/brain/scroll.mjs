import { makeRng } from "./rng.mjs";

function shuffleChoices(rng, right, wrongs) {
  const uniq = [right, ...wrongs].map(String).filter((w, i, arr) => arr.indexOf(w) === i);
  while (uniq.length < 4) uniq.push(`${right} · ${uniq.length}`);
  const choices = rng.shuffle(uniq.slice(0, 4));
  return { choices, correct: choices.indexOf(String(right)) };
}

function fill(target, seed, make) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 12) {
    i += 1;
    const item = make(rng, i);
    if (!item) continue;
    const key = `${item.kind}|${item.prompt}|${item.answer ?? ""}|${(item.choices ?? []).join("~")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

const NAMES = ["Priya", "Jonah", "Mei", "Alex", "Sam", "Noor", "Tane", "Riley", "Asha", "Kai", "Lina", "Omar"];
const TOWNS = [
  "Ballarat",
  "Fremantle",
  "Launceston",
  "Wollongong",
  "Cairns",
  "Bendigo",
  "Hobart",
  "Darwin",
  "Geelong",
  "Toowoomba",
  "Broome",
  "Albury",
];
const ASK = ["Quick one.", "Tap the truth.", "Don't scroll past this.", "One beat.", "Stay with it."];

const DIGITS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

export function buildRiddles(target, seed) {
  const bank = [
    ["I have keys but no locks. I have space but no room. You can enter but not go outside. What am I?", "A keyboard", ["A piano", "A house", "A map"]],
    ["The more you take, the more you leave behind. What am I?", "Footsteps", ["Time", "Money", "Breath"]],
    ["What has a head and a tail but no body?", "A coin", ["A comet", "A snake", "A queue"]],
    ["What can travel around the world while staying in a corner?", "A stamp", ["A satellite", "A rumour", "Wi-Fi"]],
    ["I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", "An echo", ["A radio", "A ghost", "A flag"]],
    ["What gets wetter the more it dries?", "A towel", ["Rain", "Soap", "A sponge left in a bucket"]],
    ["What has many teeth but cannot bite?", "A comb", ["A zipper", "A saw with no handle", "A grin"]],
    ["What has hands but cannot clap?", "A clock", ["A statue", "Gloves", "A map"]],
    ["What has a neck but no head?", "A bottle", ["A shirt", "A guitar", "A river"]],
    ["What goes up but never comes down?", "Your age", ["A helium balloon forever", "Smoke", "A rocket"]],
    ["What has cities, but no houses; forests, but no trees; water, but no fish?", "A map", ["A dream", "A painting", "The internet"]],
    ["The person who makes it sells it. The person who buys it never uses it. The person who uses it never knows. What is it?", "A coffin", ["A gift", "Insurance", "A password"]],
    ["What can you catch but not throw?", "A cold", ["Your breath", "A shadow", "Sleep"]],
    ["What has an eye but cannot see?", "A needle", ["A storm", "A potato only", "A camera with the lens cap on"]],
    ["Forward I am heavy, backward I am not. What am I?", "A ton", ["A palindrome", "Lead", "A truck"]],
    ["What is full of holes but still holds water?", "A sponge", ["A net", "Swiss cheese", "A colander"]],
    ["What word is spelled incorrectly in every dictionary?", "Incorrectly", ["Dictionary", "Every", "Wrong"]],
    ["What has four wheels and flies?", "A garbage truck", ["An aeroplane", "A time machine", "A skateboard"]],
    ["What begins with T, ends with T, and has T in it?", "A teapot", ["Treat", "Tent", "That"]],
    ["What has a heart that doesn't beat?", "An artichoke", ["A stone", "A drawing", "A broken clock"]],
    ["I am taken from a mine and shut in a wooden case, from which I am never released, and used by almost everyone. What am I?", "Pencil lead", ["Gold", "Coal in a stove", "A secret"]],
    ["What is always in front of you but can't be seen?", "The future", ["Air", "Your nose", "Tomorrow's homework"]],
    ["What can fill a room but takes up no space?", "Light", ["Noise", "Smell", "Hope"]],
    ["If you drop me I'm sure to crack, but give me a smile and I'll smile back. What am I?", "A mirror", ["An egg", "Ice", "A phone"]],
    ["What runs but never walks, has a bed but never sleeps?", "A river", ["A clock", "A computer", "A rumour"]],
    ["What comes once in a minute, twice in a moment, but never in a thousand years?", "The letter M", ["Time", "Luck", "A leap second"]],
    ["I have branches, but no fruit, trunk, or leaves. What am I?", "A bank", ["A family tree only", "A library", "A river delta"]],
    ["What building has the most stories?", "A library", ["A skyscraper", "Parliament", "A myth"]],
    ["What is so fragile that saying its name breaks it?", "Silence", ["Glass", "A secret", "Ice"]],
    ["The more there is, the less you see. What is it?", "Darkness", ["Fog", "Ignorance", "Mud"]],
    ["What has one voice but walks on four legs in the morning, two at noon, and three in the evening?", "A human", ["A circus act", "A robot", "A dog"]],
    ["I have no life, but I can die. What am I?", "A battery", ["A star", "A language", "A rumour"]],
    ["What kind of room has no doors or windows?", "A mushroom", ["A cave", "Space", "A vault"]],
    ["What is cut on a table, but is never eaten?", "A deck of cards", ["A napkin", "Homework", "Fabric only"]],
    ["What belongs to you but others use it more than you?", "Your name", ["Your phone", "Your time", "Your shade"]],
    ["I fly without wings. I cry without eyes. What am I?", "A cloud", ["A drone", "Wind", "An onion"]],
    ["What has a bottom at the top?", "Your legs", ["A spinning top", "A mountain", "A cup upside down"]],
    ["You see me once in June, twice in November, but not at all in May. What am I?", "The letter E", ["Rain", "A public holiday", "The sun"]],
    ["What five-letter word becomes shorter when you add two letters?", "Short", ["Small", "Brief", "Tiny"]],
    ["What invention lets you look through a wall?", "A window", ["X-ray specs", "A door", "Wi-Fi"]],
    ["I am an odd number. Take away a letter and I become even. What number am I?", "Seven", ["Nine", "Three", "Eleven"]],
    ["What has 13 hearts but no other organs?", "A deck of cards", ["A hospital ward", "A nest", "A statue garden"]],
    ["The more you share me, the less I am. What am I?", "A secret", ["Cake", "Wi-Fi", "Silence"]],
    ["What can you hold without ever touching?", "Your breath", ["A thought only", "A grudge", "A meeting"]],
    ["I have lakes with no water, mountains with no stone, and cities with no people. What am I?", "A map", ["A globe app", "A novel", "A dream"]],
    ["What gets bigger the more you take away?", "A hole", ["Debt", "Silence", "A rumour"]],
    ["What kind of tree can you carry in your hand?", "A palm", ["A bonsai", "A pine cone", "A map of a forest"]],
    ["What has words but never speaks?", "A book", ["A mute", "A sign", "A screenshot"]],
    ["I start with E, end with E, and contain only one letter. What am I?", "An envelope", ["Eye", "Eve", "Eee"]],
    ["What is easy to get into but hard to get out of?", "Trouble", ["A tent", "A maze with a map", "Bed"]],
    ["What has a face and two hands but no arms or legs?", "A clock", ["A coin", "A mountain", "A doll"]],
    ["Where does today come before yesterday?", "In the dictionary", ["In a time zone", "In space", "On a calendar backwards"]],
    ["What has a thumb and four fingers but is not alive?", "A glove", ["A drawing of a hand", "A statue", "A phone"]],
    ["I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?", "Fire", ["A baby", "Rust", "A printer"]],
    ["What is black when it's clean and white when it's dirty?", "A chalkboard", ["A sheep", "A shirt", "A comet"]],
    ["What can you break, even if you never pick it up or touch it?", "A promise", ["A record", "Silence only", "Wind"]],
    ["What has no beginning, end, or middle?", "A doughnut", ["A circle of friends", "Pi", "A ring road with exits"]],
    ["I have a spine but no bones. What am I?", "A book", ["A cactus", "A hedgehog drawing", "A virus"]],
    ["What is always coming but never arrives?", "Tomorrow", ["The bus on paper", "Winter in Darwin", "A software update"]],
    ["What loses its head in the morning and gets it back at night?", "A pillow", ["A match", "The sun", "A coin"]],
  ];
  return fill(target, seed, (rng) => {
    const [prompt, right, wrong] = rng.pick(bank);
    const wrap = rng.pick(ASK);
    const town = rng.pick(TOWNS);
    const { choices, correct } = shuffleChoices(rng, right, wrong);
    return {
      kind: "choice",
      diff: rng.pick(["easy", "medium", "medium"]),
      minutes: 1,
      title: "Riddle",
      prompt: `${wrap} ${prompt} (Think ${town}.)`,
      choices,
      correct,
      why: `${right}. Lateral, not a trick of arithmetic.`,
    };
  });
}

export function buildTrivia(target, seed) {
  const capitals = [
    ["Australia", "Canberra", "Sydney"],
    ["New Zealand", "Wellington", "Auckland"],
    ["France", "Paris", "Lyon"],
    ["Japan", "Tokyo", "Kyoto"],
    ["Canada", "Ottawa", "Toronto"],
    ["Brazil", "Brasília", "Rio de Janeiro"],
    ["Egypt", "Cairo", "Alexandria"],
    ["Kenya", "Nairobi", "Mombasa"],
    ["India", "New Delhi", "Mumbai"],
    ["Türkiye", "Ankara", "Istanbul"],
    ["South Korea", "Seoul", "Busan"],
    ["Argentina", "Buenos Aires", "Córdoba"],
    ["Norway", "Oslo", "Bergen"],
    ["Portugal", "Lisbon", "Porto"],
    ["Greece", "Athens", "Thessaloniki"],
    ["Thailand", "Bangkok", "Chiang Mai"],
    ["Vietnam", "Hanoi", "Ho Chi Minh City"],
    ["Mexico", "Mexico City", "Guadalajara"],
    ["South Africa", "Pretoria", "Johannesburg"],
    ["Sweden", "Stockholm", "Gothenburg"],
  ];
  const science = [
    ["Which planet is known for its rings?", "Saturn", ["Jupiter", "Uranus", "Neptune"]],
    ["What gas do plants take in for photosynthesis?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Helium"]],
    ["Water boils at sea level at about?", "100°C", ["90°C", "80°C", "120°C"]],
    ["The centre of an atom is the?", "Nucleus", ["Electron cloud only", "Neutrino", "Quark soup as a whole atom"]],
    ["Which blood cells help clot?", "Platelets", ["Red cells only", "Plasma only", "Neurons"]],
    ["Sound cannot travel through?", "A vacuum", ["Water", "Steel", "Air"]],
    ["H2O is?", "Water", ["Hydrogen peroxide", "Ozone", "Salt"]],
    ["Earth's nearest star is?", "The Sun", ["Proxima Centauri as daily light", "Polaris", "Sirius"]],
    ["A lunar eclipse happens when?", "Earth is between the Sun and Moon", ["Moon is between Sun and Earth", "Mars lines up", "Only at perihelion"]],
    ["Metals that rust involve iron reacting with?", "Oxygen and water", ["Only helium", "Pure nitrogen", "Argon"]],
    ["DNA's shape is often described as a?", "Double helix", ["Single cube", "Flat sheet", "Triple zigzag only"]],
    ["Which is a mammal that lays eggs?", "Platypus", ["Kangaroo", "Echidna is also one — wait kangaroo", "Koala"]],
    ["The hardest natural mineral on Mohs is?", "Diamond", ["Quartz", "Talc", "Gold"]],
    ["Electrons have what charge?", "Negative", ["Positive", "Neutral", "Switching"]],
    ["A light-year measures?", "Distance", ["Time only", "Brightness", "Mass"]],
  ];
  const history = [
    ["Federation of Australia was in?", "1901", ["1888", "1914", "1851"]],
    ["The printing press in Europe is tied to?", "Gutenberg", ["Newton", "Darwin", "Watt"]],
    ["The first Moon landing year?", "1969", ["1957", "1972", "1961"]],
    ["Magna Carta is associated with?", "1215", ["1066", "1492", "1789"]],
    ["Who is on the Australian $5 note (Queen-era familiar face aside from the Queen)?", "Parliament House design / Queen then", ["Ned Kelly as official", "Phar Lap", "A kangaroo only"]],
    ["The Silk Road mainly linked?", "East Asia and the Mediterranean", ["Australia and Antarctica", "Iceland and Peru", "Mars and Earth"]],
    ["WWII in Europe ended in?", "1945", ["1918", "1939", "1950"]],
    ["Ancient Egypt's writing system included?", "Hieroglyphs", ["Runes only", "Hangul", "Cuneiform as the only script"]],
    ["The Industrial Revolution began in?", "Britain", ["Brazil", "Mongolia", "Fiji"]],
    ["Uluru's traditional owners include the?", "Anangu", ["Māori", "Inuit", "Sami"]],
  ];
  const tech = [
    ["HTTP status 404 means?", "Not found", ["OK", "Server error", "Redirect"]],
    ["Binary 1010 is decimal?", "10", ["5", "12", "8"]],
    ["A byte is typically how many bits?", "8", ["4", "16", "10"]],
    ["RAM is?", "Volatile working memory", ["Long-term disk", "A type of CPU core", "A monitor"]],
    ["HTTPS adds?", "TLS encryption in transit", ["A prettier font", "Free coffee", "Guaranteed truth"]],
    ["An IP address identifies a?", "Host on a network", ["Keyboard layout", "File type", "Colour profile"]],
    ["Git is mainly for?", "Version control", ["Photo filters", "Spreadsheets", "3D printing"]],
    ["A pixel is?", "A picture element", ["A type of virus", "A battery cell", "A font"]],
    ["CPU stands for?", "Central Processing Unit", ["Computer Plug Utility", "Core Print Upload", "Cache Packet USB"]],
    ["Phishing is?", "Tricking you into handing secrets", ["A kind of Ethernet", "A backup format", "A cool LED"]],
  ];
  const geo = [
    ["The longest river commonly cited is the?", "Nile (or Amazon, depending on measure)", ["Murray", "Thames", "Seine"]],
    ["Which ocean is the largest?", "Pacific", ["Atlantic", "Indian", "Arctic"]],
    ["The Great Barrier Reef is off?", "Queensland", ["Western Australia only", "Tasmania", "South Australia only"]],
    ["The equator is at latitude?", "0°", ["90°", "45°", "180°"]],
    ["Mount Kosciuszko is in?", "New South Wales", ["Victoria", "Queensland", "NT"]],
    ["The Sahara is a?", "Desert", ["Rainforest", "Tundra", "Reef"]],
    ["Iceland sits on a?", "Divergent plate boundary / hot spot mix", ["Single frozen lake", "Coal seam only", "Coral atoll"]],
    ["The Outback is mainly?", "Remote inland Australia", ["A Sydney suburb", "New Zealand's alps", "A Pacific island"]],
  ];
  return fill(target, seed, (rng) => {
    const lane = rng.int(0, 7);
    if (lane === 5) {
      const n = rng.int(2, 12);
      const ans = n * n;
      const { choices, correct } = shuffleChoices(rng, ans, [n * 2, n * n + n, n + n]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Trivia · maths spark",
        prompt: `${rng.pick(ASK)} ${n} squared is?`,
        choices,
        correct,
        why: `${n}×${n}=${ans}.`,
      };
    }
    if (lane === 6) {
      const year = rng.pick([1901, 1914, 1918, 1939, 1945, 1969, 1989, 2000, 2001]);
      const plus = rng.int(1, 8);
      const { choices, correct } = shuffleChoices(rng, year + plus, [year - plus, year, year + plus + 10]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Trivia · history spark",
        prompt: `${rng.pick(ASK)} ${year} plus ${plus} years is?`,
        choices,
        correct,
        why: `${year}+${plus}=${year + plus}.`,
      };
    }
    if (lane === 7) {
      const bit = rng.int(1, 7);
      const ans = 2 ** bit;
      const { choices, correct } = shuffleChoices(rng, ans, [bit, ans * 2, ans - 1]);
      return {
        kind: "choice",
        diff: "medium",
        minutes: 1,
        title: "Trivia · tech",
        prompt: `${rng.pick(ASK)} 2^${bit} is?`,
        choices,
        correct,
        why: `Powers of two: 2^${bit}=${ans}.`,
      };
    }
    if (lane === 0) {
      const [country, right, decoy] = rng.pick(capitals);
      const extra = rng.shuffle(capitals.filter((row) => row[0] !== country).map((row) => row[1])).slice(0, 2);
      const { choices, correct } = shuffleChoices(rng, right, [decoy, ...extra]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Trivia · geo",
        prompt: `${rng.pick(ASK)} What is the capital of ${country}?`,
        choices,
        correct,
        why: `${right} is the capital of ${country}. ${decoy} is famous but not the capital.`,
      };
    }
    const pool = lane === 1 ? science : lane === 2 ? history : lane === 3 ? tech : geo;
    const [prompt, right, wrong] = rng.pick(pool);
    const { choices, correct } = shuffleChoices(rng, right, wrong);
    const tag = ["Trivia · science", "Trivia · history", "Trivia · tech", "Trivia · geo"][Math.max(0, lane - 1)];
    return {
      kind: "choice",
      diff: rng.pick(["easy", "medium"]),
      minutes: 1,
      title: tag,
      prompt: `${rng.pick(ASK)} ${prompt}`,
      choices,
      correct,
      why: `${right}. Short spark, not a textbook chapter.`,
    };
  });
}

export function buildEmoji(target, seed) {
  const rebuses = [
    { prompt: "🐝 + 🍃 = ?", answer: "BELIEF", why: "Bee + leaf → belief.", wrong: ["BELEAF", "HONEY", "GARDEN"] },
    { prompt: "🌙 + 💡 = ?", answer: "MOONLIGHT", why: "Moon + light.", wrong: ["NIGHT", "LAMP", "DREAM"] },
    { prompt: "☀️ + 🌸 = ?", answer: "SUNFLOWER", why: "Sun + flower.", wrong: ["DAISY", "HEAT", "SPRING"] },
    { prompt: "🧠 + ⛈️ = ?", answer: "BRAINSTORM", why: "Brain + storm.", wrong: ["HEADACHE", "THUNDER", "IDEA"] },
    { prompt: "⭐ + 🐟 = ?", answer: "STARFISH", why: "Star + fish.", wrong: ["GALAXY", "TUNA", "COMET"] },
    { prompt: "🔥 + 🐕 = ?", answer: "HOTDOG", why: "Hot + dog.", wrong: ["DALMATIAN", "CHILLI", "KENNEL"] },
    { prompt: "🧀 + 🍔 = ?", answer: "CHEESEBURGER", why: "Cheese + burger.", wrong: ["PIZZA", "TOASTIE", "TACO"] },
    { prompt: "🌧️ + 🧥 = ?", answer: "RAINCOAT", why: "Rain + coat.", wrong: ["UMBRELLA", "PUDDLE", "STORM"] },
    { prompt: "📚 + 🪱 = ?", answer: "BOOKWORM", why: "Book + worm.", wrong: ["LIBRARY", "MOTH", "STUDY"] },
    { prompt: "🏠 + 💼 = ?", answer: "HOMEWORK", why: "Home + work.", wrong: ["OFFICE", "CHORES", "RENT"] },
    { prompt: "❄️ + 👨 = ?", answer: "SNOWMAN", why: "Snow + man.", wrong: ["YETI", "ICEBERG", "SKIER"] },
    { prompt: "👂 + 💍 = ?", answer: "EARRING", why: "Ear + ring.", wrong: ["JEWEL", "SOUND", "BELL"] },
    { prompt: "🍞 + 🦋 = ? (two words, no space needed)", answer: "BUTTERFLY", why: "Butter + fly.", wrong: ["MOTH", "TOAST", "CATERPILLAR"] },
    { prompt: "🔑 + 🏖️ = ?", answer: "KEYBOARD", why: "Key + board (surfboard vibe counts as board).", wrong: ["PASSWORD", "BEACH", "LOCK"] },
    { prompt: "👀 + 🍬 = ?", answer: "EYECANDY", why: "Eye + candy.", wrong: ["SWEET", "Lolly", "VISION"] },
    { prompt: "🚪 + 🔔 = ?", answer: "DOORBELL", why: "Door + bell.", wrong: ["KNOCK", "ALARM", "GATE"] },
    { prompt: "🐱 + 🐟 = ?", answer: "CATFISH", why: "Cat + fish.", wrong: ["TUNA", "KITTY", "BAIT"] },
    { prompt: "🏀 + 🏐 spelling cousin: ☀️ + 👓 = ?", answer: "SUNGLASSES", why: "Sun + glasses.", wrong: ["GOGGLES", "WINDOW", "MIRROR"] },
    { prompt: "🚗 + 🐾 = ?", answer: "CARPET", why: "Car + pet.", wrong: ["GARAGE", "TYRE", "DRIVE"] },
    { prompt: "🍇 + 🍷 vibe: 🐝 + 🍯 = ?", answer: "HONEYBEE", why: "Honey + bee (order may flip — honeybee).", wrong: ["HIVE", "SUGAR", "WASP"] },
    { prompt: "⏰ + 🐕 = ?", answer: "WATCHDOG", why: "Watch + dog.", wrong: ["ALARM", "HOUND", "TIMER"] },
    { prompt: "🌊 + 🐴 = ?", answer: "SEAHORSE", why: "Sea + horse.", wrong: ["SURF", "PONY", "TIDE"] },
    { prompt: "👑 + 🐟 = ?", answer: "KINGFISH", why: "King + fish.", wrong: ["QUEEN", "TUNA", "CORAL"] },
    { prompt: "🦶 + 🏀 = ?", answer: "FOOTBALL", why: "Foot + ball.", wrong: ["SOCCER only as a code", "SHOE", "GOAL"] },
    { prompt: "🌙 + 🚶 = ?", answer: "MOONWALK", why: "Moon + walk.", wrong: ["NIGHT", "DANCE only", "SPACE"] },
  ];
  return fill(target, seed, (rng, n) => {
    if (n % 3 !== 0) {
      const a = rng.int(1, 9);
      const b = rng.int(1, 9);
      const op = rng.pick(["+", "×", "−"]);
      let ans;
      let prompt;
      if (op === "+") {
        ans = a + b;
        prompt = `${DIGITS[a]} ${op} ${DIGITS[b]} = ?`;
      } else if (op === "×") {
        ans = a * b;
        prompt = `${DIGITS[a]} ${op} ${DIGITS[b]} = ?`;
      } else {
        const hi = Math.max(a, b);
        const lo = Math.min(a, b);
        ans = hi - lo;
        prompt = `${DIGITS[hi]} ${op} ${DIGITS[lo]} = ?`;
      }
      const { choices, correct } = shuffleChoices(rng, String(ans), [String(ans + 1), String(Math.abs(ans - 2)), String(a)]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Emoji equation",
        prompt: `${rng.pick(ASK)} ${prompt}`,
        choices,
        correct,
        why: `Read the digits, then ${op}. Answer ${ans}.`,
      };
    }
    const row = rng.pick(rebuses);
    const right = row.answer;
    const { choices, correct } = shuffleChoices(rng, right, row.wrong);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Rebus-lite",
      prompt: `${rng.pick(ASK)} ${row.prompt}`,
      choices,
      correct,
      why: row.why,
    };
  });
}

export function buildOdd(target, seed) {
  const sets = [
    { items: ["kelpie", "galah", "cactus", "kookaburra"], odd: "cactus", why: "Three animals, one plant." },
    { items: ["triangle", "square", "circle", "cube"], odd: "cube", why: "Cube is 3D; the others are 2D shapes." },
    { items: ["mercury", "venus", "luna", "mars"], odd: "luna", why: "Luna is a moon, not a planet." },
    { items: ["flute", "trumpet", "violin", "drum"], odd: "drum", why: "Drum is percussion, not a melody tube/string in the same way — or: unpitched relative to the set." },
    { items: ["copper", "iron", "oxygen", "zinc"], odd: "oxygen", why: "Oxygen is a non-metal gas here." },
    { items: ["python", "java", "html", "ruby"], odd: "html", why: "HTML is markup, not a general-purpose programming language." },
    { items: ["sprint", "marathon", "hurdle", "chess"], odd: "chess", why: "Chess is not a running event." },
    { items: ["noun", "verb", "adjective", "paragraph"], odd: "paragraph", why: "Paragraph is a chunk of text, not a part of speech." },
    { items: ["circle", "sphere", "disk", "ring"], odd: "sphere", why: "Sphere is solid 3D; others are flat-round ideas." },
    { items: ["photosynthesis", "respiration", "evaporation", "migration of wildebeest"], odd: "migration of wildebeest", why: "Three plant/physics processes vs an animal behaviour." },
    { items: ["Canberra", "Ottawa", "Sydney", "Wellington"], odd: "Sydney", why: "Sydney is not a national capital." },
    { items: ["plus", "minus", "times", "noun"], odd: "noun", why: "Noun is grammar, not an arithmetic operator." },
    { items: ["true", "false", "maybe", "boolean"], odd: "maybe", why: "Maybe is not a Boolean value." },
    { items: ["solid", "liquid", "gas", "loud"], odd: "loud", why: "Loud is not a state of matter." },
    { items: ["CPU", "RAM", "SSD", "HDMI cable as memory"], odd: "HDMI cable as memory", why: "HDMI is an interface, not a memory/storage device." },
    { items: ["haiku", "sonnet", "limerick", "spreadsheet"], odd: "spreadsheet", why: "Not a poem form." },
    { items: ["Nile", "Amazon", "Murray", "Pacific"], odd: "Pacific", why: "Pacific is an ocean, not a river." },
    { items: ["square", "rectangle", "rhombus", "ellipse"], odd: "ellipse", why: "Ellipse has no straight sides." },
    { items: ["see", "sea", "look", "watch"], odd: "sea", why: "Sea is water; the others are vision verbs (homophone trap)." },
    { items: ["helium", "neon", "argon", "chlorine"], odd: "chlorine", why: "Chlorine is not a noble gas." },
  ];
  return fill(target, seed, (rng) => {
    if (rng.chance(0.45)) {
      const base = rng.int(2, 9);
      const seq = [base, base * 2, base * 3, base * 4 + 1];
      const odd = String(seq[3]);
      const labels = rng.shuffle(seq.map(String));
      return {
        kind: "choice",
        diff: "medium",
        minutes: 1,
        title: "Odd one out · numbers",
        prompt: `${rng.pick(ASK)} Which number does not belong? ${labels.join(", ")}`,
        choices: labels,
        correct: labels.indexOf(odd),
        why: `${odd} breaks the ×${base} family (${base}, ${base * 2}, ${base * 3}).`,
      };
    }
    if (rng.chance(0.35)) {
      const start = rng.int(3, 12);
      const primesish = [start, start + 2, start + 4, start + 7];
      const even = primesish.find((n) => n % 2 === 0) ?? start + 4;
      const labels = rng.shuffle(primesish.map(String));
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Odd one out · parity",
        prompt: `Which is the odd one out (even vs odd mix)? ${labels.join(" · ")}`,
        choices: labels,
        correct: labels.indexOf(String(even)),
        why: `${even} is even; hunt the parity that appears once.`,
      };
    }
    const row = rng.pick(sets);
    const order = rng.shuffle(row.items);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Odd one out",
      prompt: `${rng.pick(ASK)} Which does not belong? ${order.join(" / ")}`,
      choices: order,
      correct: order.indexOf(row.odd),
      why: row.why,
    };
  });
}

export function buildLies(target, seed) {
  const triples = [
    {
      truths: ["Octopuses have three hearts", "Bananas are berries botanically"],
      lie: "Tomatoes are a type of mineral",
      why: "Tomatoes are fruit (berry-ish). Minerals are rocks, not salad.",
    },
    {
      truths: ["Canberra is Australia's capital", "Uluru is in the Northern Territory"],
      lie: "Hobart is north of Darwin",
      why: "Hobart is far south. Darwin is tropical north.",
    },
    {
      truths: ["Sound is slower than light", "Diamond is a form of carbon"],
      lie: "The Sun is a planet",
      why: "The Sun is a star.",
    },
    {
      truths: ["HTTP 200 means OK", "A byte is 8 bits"],
      lie: "RAM keeps files after you pull the power, always",
      why: "Ordinary RAM is volatile.",
    },
    {
      truths: ["A triangle can have a right angle", "Pi is bigger than 3"],
      lie: "A square has three sides",
      why: "Squares have four sides.",
    },
    {
      truths: ["Photosynthesis uses light", "Humans need oxygen"],
      lie: "Ice is hotter than steam at 1 atm when both exist as named",
      why: "Steam (water vapour at 100°C+) is not colder than ice.",
    },
    {
      truths: ["The Pacific is the largest ocean", "Equator latitude is 0°"],
      lie: "Australia is the largest continent",
      why: "Australia is the smallest continent. Antarctica is bigger.",
    },
    {
      truths: ["Git tracks versions", "Phishing steals trust"],
      lie: "A 404 means the server exploded on purpose as a feature",
      why: "404 is not found, not a firework.",
    },
    {
      truths: ["Echidnas lay eggs", "Kangaroos are marsupials"],
      lie: "Emus are a kind of fish",
      why: "Emus are birds.",
    },
    {
      truths: ["Water's formula is H2O", "Salt often means sodium chloride"],
      lie: "Helium is a metal you can hammer",
      why: "Helium is a noble gas.",
    },
    {
      truths: ["Shakespeare wrote Hamlet", "The printing press spread books"],
      lie: "The Moon is made of green cheese as NASA's official model",
      why: "That's a joke, not geology.",
    },
    {
      truths: ["A metre is longer than a centimetre", "1000 metres make a kilometre"],
      lie: "A millimetre is longer than a metre",
      why: "Milli means thousandth.",
    },
    {
      truths: ["Fire needs oxygen (usually)", "Rust involves iron"],
      lie: "Glass is a metal like copper",
      why: "Glass is typically an amorphous solid from silica, not a metal.",
    },
    {
      truths: ["Venus is hotter than Mars", "Jupiter is a gas giant"],
      lie: "Pluto is the largest planet in the solar system",
      why: "Jupiter is. Pluto is a dwarf planet.",
    },
    {
      truths: ["CSS styles pages", "HTML structures pages"],
      lie: "CSS is the only way to store a database of millions of users",
      why: "That's a job for a database, not a stylesheet.",
    },
  ];
  return fill(target, seed, (rng) => {
    const row = rng.pick(triples);
    const options = rng.shuffle([...row.truths, row.lie]);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Two truths, one lie",
      prompt: `${rng.pick(NAMES)} offers three lines. Pick the LIE.\n• ${options.join("\n• ")}`,
      choices: options,
      correct: options.indexOf(row.lie),
      why: row.why,
    };
  });
}

export function buildMicro(target, seed) {
  return fill(target, seed, (rng) => {
    const who = rng.pick(NAMES);
    const town = rng.pick(TOWNS);
    const n = rng.int(8, 40);
    const left = rng.int(1, 6);
    const kind = rng.int(0, 4);
    if (kind === 0) {
      const sold = n - left;
      const prompt = `${who} stacked ${n} jars in ${town}. A tourist photo mentions the clock tower. By dusk ${left} jars were still on the shelf. The rest had been sold. Ignore the clock tower. How many jars sold?`;
      const { choices, correct } = shuffleChoices(rng, sold, [n, left, n + left]);
      return {
        kind: "choice",
        diff: "medium",
        minutes: 1,
        title: "Micro reading",
        prompt,
        choices,
        correct,
        why: `Sold = ${n}−${left} = ${sold}. The town photo is bait.`,
      };
    }
    if (kind === 1) {
      const a = rng.int(2, 5);
      const b = rng.int(2, 5);
      const prompt = `Bus A leaves ${town} with ${a} people. At the next stop ${b} board and nobody gets off. A billboard quotes last year's rainfall. How many people are on the bus now?`;
      const ans = a + b;
      const { choices, correct } = shuffleChoices(rng, ans, [a, b, a * b]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Micro reading",
        prompt,
        choices,
        correct,
        why: `${a}+${b}=${ans}. Rainfall is bait.`,
      };
    }
    if (kind === 2) {
      const pages = rng.int(40, 180);
      const read = rng.int(10, 30);
      const leftPages = pages - read;
      const prompt = `${who} had a ${pages}-page zine. They read ${read} pages on the ferry and none on the tram. A footnote lists the printer's ABN. Pages left?`;
      const { choices, correct } = shuffleChoices(rng, leftPages, [pages, read, pages + read]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Micro reading",
        prompt,
        choices,
        correct,
        why: `${pages}−${read}=${leftPages}. ABN is bait.`,
      };
    }
    if (kind === 3) {
      const t = rng.int(9, 16);
      const prompt = `A sign in ${town}: “Library closed from ${t}:00 to ${t + 2}:00 for a drill.” ${who} arrives at ${t + 1}:00. A poster shows a famous painting. Can they borrow a book right then?`;
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Micro reading",
        prompt,
        choices: ["No — still inside the closed window", "Yes — posters mean open", "Only if they like the painting", "Yes — drills never close doors"],
        correct: 0,
        why: `Closed ${t}:00–${t + 2}:00 includes ${t + 1}:00. The painting is bait.`,
      };
    }
    const red = rng.int(3, 9);
    const blue = rng.int(3, 9);
    const prompt = `A bowl holds ${red} red marbles and ${blue} blue. ${who} draws one without looking. A nearby radio plays a 90s song. Probability it is red?`;
    const right = `${red}/${red + blue}`;
    const { choices, correct } = shuffleChoices(rng, right, [`${blue}/${red + blue}`, `${red}/${blue}`, `${red + blue}/${red}`]);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Micro reading",
      prompt,
      choices,
      correct,
      why: `${red} red out of ${red + blue} total. The song is bait.`,
    };
  });
}

export function buildSpell(target, seed) {
  const pairs = [
    ["colour", "color", "Australian/British spelling prefers colour."],
    ["organise", "organize", "AU often keeps -ise: organise."],
    ["centre", "center", "AU: centre (place), unless it's a sports Center brand."],
    ["metre", "meter", "AU: metre for length; meter is often the measuring device."],
    ["defence", "defense", "AU: defence."],
    ["licence", "license", "AU: licence is the noun; license can be the verb."],
    ["practise", "practice", "AU: practise the verb; practice the noun."],
    ["travelling", "traveling", "AU usually doubles the l: travelling."],
    ["aluminium", "aluminum", "AU/UK: aluminium."],
    ["tyre", "tire", "AU: tyre on a car; tire can mean weary."],
    ["grey", "gray", "AU commonly grey."],
    ["favourite", "favorite", "AU: favourite."],
    ["analogue", "analog", "AU often analogue (signal), analog appears in tech US."],
    ["honour", "honor", "AU: honour."],
    ["realise", "realize", "AU: realise."],
    ["jewellery", "jewelry", "AU: jewellery."],
    ["programme", "program", "AU: programme for a show; program is fine for software."],
    ["cheque", "check", "AU: cheque for the bank slip."],
    ["mould", "mold", "AU: mould (fungus / shape)."],
    ["harbour", "harbor", "AU: harbour."],
  ];
  const grammar = [
    ["They're going to the shop.", "Their going to the shop.", "They're = they are."],
    ["The dog wagged its tail.", "The dog wagged it's tail.", "It's = it is. Possession is its."],
    ["The effect was loud.", "The affect was loud.", "Effect is usually the noun."],
    ["Fewer pebbles, not less, when you can count them.", "Less pebbles is always the formal choice.", "Fewer for count nouns."],
    ["Who's coming?", "Whose coming? as the contraction", "Who's = who is."],
    ["Let's eat, Grandma.", "Let's eat Grandma.", "Commas save grandmas."],
    ["I could have gone.", "I could of gone.", "Could have, not could of."],
    ["She and I went.", "Me and her went. as careful grammar", "Subject pronouns for the subject."],
    ["A lot of time.", "Alot of time.", "Alot is not a word."],
    ["Definitely.", "Definately.", "The vowel is i: definitely."],
  ];
  return fill(target, seed, (rng) => {
    if (rng.chance(0.55)) {
      const [au, us, why] = rng.pick(pairs);
      const decoy = au.replace("our", "or").replace("ise", "ize") === au ? us + "e" : us + "ue";
      const { choices, correct } = shuffleChoices(rng, au, [us, decoy, us.toUpperCase()]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Spelling",
        prompt: `${rng.pick(ASK)} Aussie-friendly spelling of the US-ish “${us}”?`,
        choices,
        correct,
        why,
      };
    }
    const [good, bad, why] = rng.pick(grammar);
    const { choices, correct } = shuffleChoices(rng, good, [bad, bad.replace(" ", "  "), `${bad}!!`]);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Word choice",
      prompt: `${rng.pick(ASK)} Which line is the careful choice?`,
      choices,
      correct,
      why,
    };
  });
}

export function buildFacts(target, seed) {
  const rows = [
    ["Light is faster than sound in air.", true, "That's why you see the flash before thunder."],
    ["The capital of France is Lyon.", false, "Paris is the capital. Lyon is a major city."],
    ["Humans are mammals.", true, "Hair, milk, warm blood — the mammal bundle."],
    ["The Great Barrier Reef is off Tasmania.", false, "It's off Queensland."],
    ["Zero is an even number.", true, "Even means divisible by 2; 0 is."],
    ["A square is a rectangle.", true, "Equal sides, but still four right angles."],
    ["HTML is a programming language in the same sense as Python.", false, "HTML is markup."],
    ["Venus is farther from the Sun than Earth is.", false, "Venus is closer."],
    ["Australia is in the Southern Hemisphere.", true, "South of the equator."],
    ["Rust is a chemical change.", true, "New substance: iron oxide."],
    ["The Moon produces its own visible light like a lantern.", false, "We see reflected sunlight."],
    ["1000 millilitres = 1 litre.", true, "Milli = thousandth."],
    ["Penguins live wild in the Arctic as a native group like polar bears.", false, "Wild penguins are Southern Hemisphere (plus zoos)."],
    ["Binary 10 is two.", true, "1×2 + 0×1 = 2."],
    ["A kilometre is shorter than a metre.", false, "Kilo = thousand metres."],
    ["Photosynthesis happens in chloroplasts.", true, "Green bits, light work."],
    ["The Nile flows through Egypt.", true, "Classic geography."],
    ["Sound travels fastest in a vacuum.", false, "It needs a medium; vacuum is silent."],
    ["Canberra is inland.", true, "A planned capital, not on the harbour."],
    ["All birds can fly.", false, "Emus, kiwis, penguins disagree."],
    ["Pi is exactly 22/7.", false, "22/7 is an approximation."],
    ["Ice is less dense than liquid water.", true, "That's why ice floats."],
    ["The HTTP method GET is meant to be safe/read-ish.", true, "It shouldn't be used to delete the universe."],
    ["Mount Everest is in Australia.", false, "Himalaya, not the Blue Mountains."],
    ["A compass needle aligns with Earth's magnetic field.", true, "That's the trick."],
    ["Helium balloons sink in air because helium is denser.", false, "Helium is less dense, so they rise."],
    ["The equator is a line of longitude.", false, "It's latitude 0°."],
    ["Batteries store chemical energy.", true, "Converted to electrical when you close the circuit."],
    ["Shakespeare wrote in the 20th century.", false, "Late 1500s–early 1600s."],
    ["Water expands when it freezes.", true, "Unusual, and important for pipes."],
  ];
  return fill(target, seed, (rng) => {
    const [prompt, answer, why] = rng.pick(rows);
    const who = rng.pick(NAMES);
    const town = rng.pick(TOWNS);
    const twist = rng.pick(["True or false?", "Hold or flip?", "Keep or bin?"]);
    return {
      kind: "truefalse",
      diff: "easy",
      minutes: 1,
      title: "Quick fact",
      prompt: `${who} in ${town} says: “${prompt}” ${twist}`,
      answer,
      why,
    };
  });
}

export function buildPatterns(target, seed) {
  return fill(target, seed, (rng) => {
    const lane = rng.int(0, 4);
    if (lane === 0) {
      const a = rng.pick("ABCDEFGH".split(""));
      const b = rng.pick("LMNPQR".split(""));
      const row = `${a}${b} ${a}${b} ${a}${b} ${a}?`;
      const right = b;
      const { choices, correct } = shuffleChoices(rng, right, [a, "Z", b + a]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Pattern find",
        prompt: `Fill the missing letter: ${row}`,
        choices,
        correct,
        why: `Repeating pair ${a}${b}. The last piece is ${b}.`,
      };
    }
    if (lane === 1) {
      const n = rng.int(2, 5);
      const seq = [n, n + n, n + n + n, n + n + n + n];
      const next = n * 5;
      const shown = `${seq.join(", ")}, ?`;
      const { choices, correct } = shuffleChoices(rng, next, [next + n, seq[3] + 1, n]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Pattern find",
        prompt: `Add-a-constant pattern: ${shown}`,
        choices,
        correct,
        why: `Add ${n} each time. Next is ${next}.`,
      };
    }
    if (lane === 2) {
      const marks = ["■", "□", "▲", "○"];
      const a = rng.pick(marks);
      const b = rng.pick(marks.filter((m) => m !== a));
      const row = `${a}${b}${a}${b}${a}?`;
      const { choices, correct } = shuffleChoices(rng, b, [a, "◆", `${a}${b}`]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Pattern find",
        prompt: `Visual row: ${row}`,
        choices,
        correct,
        why: `Alternating ${a} and ${b}. Next is ${b}.`,
      };
    }
    if (lane === 3) {
      const word = rng.pick(["CAT", "DOG", "SUN", "MAP", "NET", "BUG", "ZIP"]);
      const shifted = word
        .split("")
        .map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + 1) % 26) + 65))
        .join("");
      const prompt = `Each letter steps one forward in the alphabet: ${word} → ${shifted} → ?`;
      const next = shifted
        .split("")
        .map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + 1) % 26) + 65))
        .join("");
      const { choices, correct } = shuffleChoices(rng, next, [word, shifted, next.split("").reverse().join("")]);
      return {
        kind: "choice",
        diff: "medium",
        minutes: 1,
        title: "Pattern find",
        prompt,
        choices,
        correct,
        why: `Caesar +1 again: ${shifted} → ${next}.`,
      };
    }
    const grid = rng.pick([
      ["1 2 3", "2 3 4", "3 4 ?", "5", "Each row adds 1 to each cell.", ["6", "4", "3"]],
      ["2 4 8", "3 6 12", "4 8 ?", "16", "×2 across the row.", ["12", "8", "10"]],
    ]);
    const [r1, r2, r3, right, why, wrong] = grid;
    const { choices, correct } = shuffleChoices(rng, right, wrong);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Pattern find",
      prompt: `Grid:\n${r1}\n${r2}\n${r3}`,
      choices,
      correct,
      why,
    };
  });
}

export function buildEthics(target, seed) {
  const scenes = [
    {
      prompt: "A classmate's embarrassing photo is in the group chat. What is the solid move?",
      right: "Don't spread it; ask for it to be taken down; check they're OK",
      wrong: ["Forward it so everyone is 'in on the joke'", "Edit it to be meaner", "Assume consent because it's already there"],
      why: "Sharing without consent piles harm. Stop the spread.",
    },
    {
      prompt: "An app wants every permission 'to work'. You only need the camera once. What do you do?",
      right: "Deny extras; grant the minimum; revoke later",
      wrong: ["Allow all so the icon looks happier", "Post your password in the review", "Permissions are fake"],
      why: "Least privilege is a real-life setting, not just a textbook.",
    },
    {
      prompt: "A 'prize' SMS wants you to tap a short link and log into your bank. What now?",
      right: "Don't tap. Treat it as phishing. Use the bank's own app/site",
      wrong: ["Tap fast before the prize expires", "Send a photo of your card 'to verify'", "Reply with your PIN"],
      why: "Urgency + login = classic phish.",
    },
    {
      prompt: "You trained an AI on a mate's private diary 'for fun'. What's wrong?",
      right: "You used their private words without consent",
      wrong: ["Diaries want to be public", "AI training erases ethics", "Fun is always a defence"],
      why: "Private text stays theirs unless they say yes.",
    },
    {
      prompt: "A deepfake of a teacher is circulating. Your feed wants a laugh react. Best move?",
      right: "Don't amplify. Flag it. Remember real people get hit",
      wrong: ["Stitch it for clout", "Assume it's harmless because it's 'just AI'", "Tag more classes"],
      why: "Distribution is the damage.",
    },
    {
      prompt: "You found a USB in the library labelled 'exam answers'. Plug it in?",
      right: "No — unknown USB is a classic malware drop. Hand it to staff",
      wrong: ["Plug it into the school admin PC", "Open every file at home", "It's fine if the label is funny"],
      why: "Curiosity is how autorun wins.",
    },
    {
      prompt: "Your little sibling is 10 and wants a public location-sharing app. You…",
      right: "Help set private/safer defaults; talk to a parent/carer; no public pinpoint",
      wrong: ["Turn on live location to the whole internet", "Tell them privacy is for adults only", "Use their name, school, and bus stop in the bio"],
      why: "Kids + public location is a risk sandwich.",
    },
    {
      prompt: "A friend asks you to log into their account 'just this once' because they 'trust you'.",
      right: "Don't share logins. Help them reset through official flow",
      wrong: ["Take the password and also change their email", "Reuse that password on your own stuff", "Post the password so others can 'help'"],
      why: "Shared logins blow up accountability and recovery.",
    },
    {
      prompt: "You screenshot a private chat and post it to a story. Harmless?",
      right: "No — private context isn't yours to broadcast",
      wrong: ["Stories expire so ethics expire", "If they typed it, it's public", "Only illegal things are off limits"],
      why: "Consent is about context, not just the pixels.",
    },
    {
      prompt: "An online shop is 90% off with only a Telegram handle to pay. You…",
      right: "Walk away. Too-good + off-platform pay is a scam pattern",
      wrong: ["Gift-card the full amount immediately", "Give remote desktop 'support'", "Send extra ID 'to release shipping'"],
      why: "Pressure and odd payment rails are the tell.",
    },
    {
      prompt: "You accidentally get a classmate's email with medical info. Next step?",
      right: "Don't forward. Tell them it arrived; delete your copy if appropriate",
      wrong: ["Read it aloud at lunch", "File it for later gossip", "Sell the detail"],
      why: "Misdirected private data is still private.",
    },
    {
      prompt: "A generator site wants you to paste other people's assignments to 'humanise' them.",
      right: "That's still their work / possibly academic misconduct — don't launder it",
      wrong: ["Paste the whole class drive", "It's fine if the site says creative commons in Comic Sans", "Ethics pause during exam week"],
      why: "Tooling doesn't wash the permission problem.",
    },
  ];
  return fill(target, seed, (rng) => {
    const row = rng.pick(scenes);
    const town = rng.pick(TOWNS);
    const { choices, correct } = shuffleChoices(rng, row.right, row.wrong);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "What would you do?",
      prompt: `${rng.pick(ASK)} (${town}) ${row.prompt}`,
      choices,
      correct,
      why: row.why,
    };
  });
}

export function buildBeats(target, seed) {
  return fill(target, seed, (rng) => {
    const lane = rng.int(0, 3);
    if (lane === 0) {
      const beats = rng.pick([3, 4, 6]);
      const bars = rng.int(1, 3);
      const total = beats * bars;
      const prompt = `A ${beats}/4 bar has ${beats} beats. How many beats in ${bars} bar${bars > 1 ? "s" : ""} of ${beats}/4?`;
      const { choices, correct } = shuffleChoices(rng, total, [beats, bars, total + beats]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Beat count",
        prompt: `${rng.pick(ASK)} ${prompt}`,
        choices,
        correct,
        why: `${beats}×${bars}=${total} beats.`,
      };
    }
    if (lane === 1) {
      const pattern = rng.pick(["X . X .", "X X . .", "X . . X", "X X X ."]);
      const hits = pattern.split(" ").filter((s) => s === "X").length;
      const prompt = `Clap pattern (X = clap, . = rest) in one bar: ${pattern}\nHow many claps?`;
      const { choices, correct } = shuffleChoices(rng, hits, [4, hits + 1, 1]);
      return {
        kind: "choice",
        diff: "easy",
        minutes: 1,
        title: "Rhythm tap",
        prompt,
        choices,
        correct,
        why: `Count the X marks: ${hits}.`,
      };
    }
    if (lane === 2) {
      const note = rng.pick([
        ["crotchet", "1"],
        ["minim", "2"],
        ["semibreve", "4"],
        ["quaver", "1/2"],
      ]);
      const prompt = `In 4/4, a ${note[0]} lasts how many beats?`;
      const { choices, correct } = shuffleChoices(rng, note[1], ["3", "8", "0"]);
      return {
        kind: "choice",
        diff: "medium",
        minutes: 1,
        title: "Note values",
        prompt: `${rng.pick(ASK)} ${prompt}`,
        choices,
        correct,
        why: `A ${note[0]} is ${note[1]} beat(s) in the usual 4/4 mapping.`,
      };
    }
    const count = rng.int(2, 4);
    const rest = rng.int(1, 2);
    const prompt = `Tap this: ${"ta ".repeat(count)}${". ".repeat(rest)}ta\nIf ta=1 beat and .=rest, total beats in the spoken line (including rests)?`;
    const total = count + rest + 1;
    const { choices, correct } = shuffleChoices(rng, total, [count, count + 1, total + 2]);
    return {
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Beat count",
      prompt,
      choices,
      correct,
      why: `${count} tas + ${rest} rests + last ta = ${total} beats.`,
    };
  });
}
