import { makeRng } from "./rng.mjs";
import { C4, C5, WORDS4, WORDS5 } from "./crossword.mjs";

const W6 = [
  ["GARDEN", "Where plants grow"],
  ["PLANET", "Orbits a star"],
  ["BRIDGE", "Spans a gap"],
  ["ORANGE", "Citrus / colour"],
  ["SILVER", "Metal / colour"],
  ["WINTER", "Cold season"],
  ["SUMMER", "Hot season"],
  ["FOREST", "Many trees"],
  ["ISLAND", "Water around it"],
  ["MARKET", "Buy and sell"],
  ["PUZZLE", "This thing"],
  ["TICKET", "Entry slip"],
  ["WINDOW", "Glass in a wall"],
  ["GUITAR", "Six strings often"],
  ["CAMERA", "Takes photos"],
  ["ROCKET", "Leaves Earth"],
  ["DRAGON", "Myth beast"],
  ["CASTLE", "Fortified house"],
  ["PIRATE", "Ship thief"],
  ["DOCTOR", "Heals people"],
  ["SCHOOL", "Learn place"],
  ["FRIEND", "Mate"],
  ["FAMILY", "Kin"],
  ["NUMBER", "Not a letter"],
  ["LETTER", "A to Z / mail"],
  ["CIRCLE", "Round"],
  ["SQUARE", "Four equal sides"],
  ["TRIPLE", "Times three"],
  ["CHANGE", "Make different / coins"],
  ["CHARGE", "Ask to pay / rush"],
  ["SHADOW", "Blocks light"],
  ["MIRROR", "Reflects"],
  ["BOTTLE", "Holds drink"],
  ["POCKET", "In your pants"],
  ["JACKET", "Coat-ish"],
  ["HELMET", "Head armour"],
  ["ANCHOR", "Holds a ship"],
  ["BARREL", "Cask"],
  ["BASKET", "Woven holder"],
  ["BLANKET", "Skip7"],
  ["CANDLE", "Wax light"],
  ["CARPET", "Floor cloth"],
  ["CHERRY", "Stone fruit"],
  ["COFFEE", "Brew"],
  ["COOKIE", "Biscuit US"],
  ["COTTON", "Soft fibre"],
  ["DANGER", "Risk"],
  ["DESERT", "Dry land"],
  ["DINNER", "Evening meal"],
  ["DOCTOR", "Healer"],
  ["ENGINE", "Motor"],
  ["FARMER", "Grows food"],
  ["FLOWER", "Bloom"],
  ["FROZEN", "Iced"],
  ["GARAGE", "Car house"],
  ["GOLDEN", "Like gold"],
  ["HAMMER", "Hits nails"],
  ["HUNGER", "Need food"],
  ["HUNTER", "Seeks game"],
  ["INSECT", "Six legs"],
  ["JUNGLE", "Thick wild"],
  ["KETTLE", "Boils water"],
  ["KITTEN", "Baby cat"],
  ["LADDER", "Climb rungs"],
  ["LAWYER", "Court talker"],
  ["LEMONS", "Sour fruits"],
  ["LITTLE", "Small"],
  ["LIVING", "Alive"],
  ["LONDON", "UK capital"],
  ["MAGNET", "Pulls iron"],
  ["MATTER", "Stuff"],
  ["MEADOW", "Grassy field"],
  ["METALS", "Fe etc"],
  ["MINUTE", "60 seconds"],
  ["MIRROR", "Glass self"],
  ["MONKEY", "Primate"],
  ["MOTHER", "Mum"],
  ["NARROW", "Not wide"],
  ["NATURE", "Not made"],
  ["NEEDLE", "Sew with it"],
  ["NICKEL", "Metal / coin"],
  ["NIGHTS", "Plural dark"],
  ["NOBODY", "No person"],
  ["NOTICE", "See / sign"],
  ["NUMBER", "Digit string"],
  ["OBJECT", "Thing"],
  ["OFFICE", "Work rooms"],
  ["ONLINE", "On the net"],
  ["ORANGE", "Fruit"],
  ["OXYGEN", "O2"],
  ["PACKET", "Small pack"],
  ["PALACE", "Royal house"],
  ["PENCIL", "Writes, erasable"],
  ["PEOPLE", "Humans"],
  ["PEPPER", "Spice"],
  ["PERSON", "A human"],
  ["PICNIC", "Eat outdoors"],
  ["PILLOW", "Head rest"],
  ["PIRATE", "Arr"],
  ["PLANET", "World"],
  ["PLAYER", "In a game"],
  ["PLEASE", "Polite ask"],
  ["POCKET", "Pouch"],
  ["POLICE", "Keep order"],
  ["POTATO", "Tuber"],
  ["POWDER", "Fine stuff"],
  ["PRETTY", "Nice looking"],
  ["PRINCE", "Royal son"],
  ["PRISON", "Gaol"],
  ["PROPER", "Correct"],
  ["PUBLIC", "Not private"],
  ["PUPPET", "On strings"],
  ["PYTHON", "Snake / language"],
  ["RABBIT", "Hops"],
  ["RANDOM", "No pattern"],
  ["RECORD", "Best / log"],
  ["REMOTE", "Far / clicker"],
  ["REPAIR", "Fix"],
  ["REPEAT", "Again"],
  ["REPORT", "Account"],
  ["RESCUE", "Save"],
  ["RHYTHM", "Beat"],
  ["RIBBON", "Strip"],
  ["RIDDEN", "Been on"],
  ["RITUAL", "Ceremony"],
  ["RIVERA", "skip"],
  ["ROBOTS", "Machines"],
  ["ROCKET", "Up"],
  ["ROLLED", "Turned"],
  ["RUBBER", "Eraser AU"],
  ["RUNNER", "Races"],
  ["SADDLE", "Horse seat"],
  ["SAILOR", "On a ship"],
  ["SALMON", "Pink fish"],
  ["SAMPLE", "Taste"],
  ["SAVING", "Not spending"],
  ["SCARED", "Afraid"],
  ["SCHOOL", "Classes"],
  ["SCREEN", "Display"],
  ["SCRIPT", "Code / play text"],
  ["SEARCH", "Look for"],
  ["SEASON", "Year slice"],
  ["SECOND", "After first"],
  ["SECRET", "Hidden"],
  ["SENSOR", "Detector"],
  ["SHADOW", "Shade"],
  ["SHIELD", "Blocks hits"],
  ["SHORTS", "Warm-weather pants"],
  ["SHOULD", "Ought"],
  ["SHOWER", "Bathroom rain"],
  ["SHRIMP", "Prawn-ish"],
  ["SILENT", "No sound"],
  ["SILVER", "Metal"],
  ["SIMPLE", "Not complex"],
  ["SINGER", "Uses voice"],
  ["SINGLE", "One"],
  ["SISTER", "Female sibling"],
  ["SKETCH", "Quick draw"],
  ["SLICES", "Cuts"],
  ["SLIGHT", "Small"],
  ["SLOPES", "Inclines"],
  ["SMOOTH", "Not rough"],
  ["SNAKES", "No legs"],
  ["SOCCER", "Football US"],
  ["SODIUM", "Na"],
  ["SOFTLY", "Not loud"],
  ["SOLVED", "Figured out"],
  ["SPARSE", "Thinly spread"],
  ["SPEAKS", "Talks"],
  ["SPHERE", "Ball"],
  ["SPIDER", "Eight legs"],
  ["SPIRAL", "Coil"],
  ["SPLASH", "Water hit"],
  ["SPOONS", "Utensils"],
  ["SPREAD", "Widen / jam"],
  ["SPRING", "Season / coil"],
  ["SQUARE", "Equal sides"],
  ["STABLE", "Horse house / steady"],
  ["STADIUM", "skip7"],
  ["STAIRS", "Steps"],
  ["STAPLE", "Fastener / basic food"],
  ["STARED", "Looked hard"],
  ["STATIC", "Not moving / crackle"],
  ["STEADY", "Stable"],
  ["STICKS", "Twigs"],
  ["STITCH", "Sew"],
  ["STONES", "Rocks"],
  ["STORED", "Put away"],
  ["STORMY", "Wild weather"],
  ["STRAWS", "Drink tubes"],
  ["STREAM", "Small river"],
  ["STREET", "Road"],
  ["STRICT", "Stern"],
  ["STRIKE", "Hit / walk out"],
  ["STRING", "Twine"],
  ["STRIPE", "Band"],
  ["STROKE", "Swim / hit"],
  ["STRONG", "Not weak"],
  ["STUDIO", "Work room"],
  ["STUFFY", "Airless"],
  ["SUBWAY", "Underground"],
  ["SUDDEN", "Abrupt"],
  ["SUFFER", "Hurt"],
  ["SUGARS", "Sweets"],
  ["SUITED", "Fitted"],
  ["SUMMER", "Hot months"],
  ["SUNDAY", "Week start AU often"],
  ["SUNSET", "Dusk colour"],
  ["SUPPER", "Late meal"],
  ["SURELY", "Certainly"],
  ["SURVEY", "Ask many"],
  ["SWITCH", "Toggle"],
  ["SWORD", "Blade"],
  ["SYMBOL", "Sign"],
  ["SYSTEM", "Set of parts"],
  ["TABLES", "Furniture"],
  ["TACKLE", "Grab / gear"],
  ["TAILOR", "Makes clothes"],
  ["TAKEN", "Seized"],
  ["TALENT", "Gift"],
  ["TALKED", "Spoke"],
  ["TANGLED", "skip7"],
  ["TARGET", "Aim"],
  ["TARIFF", "Trade tax"],
  ["TASTED", "Sampled"],
  ["TAUGHT", "Instructed"],
  ["TEMPLE", "Worship place"],
  ["TENNIS", "Racket sport"],
  ["THANKS", "Gratitude"],
  ["THEIRS", "Belonging to them"],
  ["THEORY", "Explanation"],
  ["THIRTY", "After twenty-nine"],
  ["THOUGH", "Although"],
  ["THREAD", "Fine string"],
  ["THRONE", "Royal seat"],
  ["THROWN", "Hurled"],
  ["THRUSH", "Bird / infection"],
  ["TICKET", "Pass"],
  ["TICKLE", "Make laugh"],
  ["TIGERS", "Big cats"],
  ["TIMBER", "Wood AU"],
  ["TIMING", "When"],
  ["TINTED", "Coloured"],
  ["TISSUE", "Thin paper"],
  ["TOASTS", "Browned bread"],
  ["TOMATO", "Red fruit"],
  ["TONGUE", "Taster"],
  ["TONNES", "Masses AU"],
  ["TOPICS", "Subjects"],
  ["TORQUE", "Twist force"],
  ["TOUCHY", "Sensitive"],
  ["TOWARD", "In the direction of"],
  ["TOWELS", "Dryers"],
  ["TOWERS", "Tall buildings"],
  ["TRACED", "Followed"],
  ["TRACKS", "Rails / prints"],
  ["TRADER", "Buys and sells"],
  ["TRAGIC", "Very sad"],
  ["TRAILS", "Paths"],
  ["TRAINS", "Rail / teaches"],
  ["TRANCE", "Daze"],
  ["TRASHY", "Tacky"],
  ["TRAVEL", "Go places"],
  ["TREATY", "Pact"],
  ["TREBLE", "High notes"],
  ["TRENCH", "Ditch"],
  ["TRIBAL", "Of a tribe"],
  ["TRICKY", "Not straightforward"],
  ["TRIPLE", "Three times"],
  ["TROOPS", "Soldiers"],
  ["TROPHY", "Prize cup"],
  ["TROPIC", "Near equator"],
  ["TROUGH", "Animal feeder"],
  ["TROWEL", "Mason tool"],
  ["TRUCKS", "Lorries"],
  ["TRUNKS", "Tree / swim shorts"],
  ["TRUSTY", "Reliable"],
  ["TRYING", "Attempting"],
  ["TUMBLE", "Fall"],
  ["TUNNEL", "Underground way"],
  ["TURKEY", "Bird / country"],
  ["TURNED", "Rotated"],
  ["TUSSLE", "Scuffle"],
  ["TWEETS", "Bird / posts"],
  ["TWELVE", "Dozen"],
  ["TWENTY", "Score"],
  ["TWISTS", "Turns"],
  ["TYCOON", "Big business"],
  ["TYPIST", "Keys for a living"],
].filter(([w]) => w.length === 6);

const SYNONYMS = [
  ["BIG", "LARGE", "HUGE", "TINY"],
  ["SMALL", "TINY", "LITTLE", "HUGE"],
  ["FAST", "QUICK", "RAPID", "SLOW"],
  ["SLOW", "SLUGGISH", "LEISURELY", "QUICK"],
  ["HAPPY", "GLAD", "JOYFUL", "SAD"],
  ["SAD", "UNHAPPY", "DOWNCAST", "GLAD"],
  ["SMART", "CLEVER", "BRIGHT", "DULL"],
  ["ANGRY", "IRATE", "LIVID", "CALM"],
  ["CALM", "PLACID", "SERENE", "IRATE"],
  ["BEGIN", "START", "COMMENCE", "END"],
  ["END", "FINISH", "CEASE", "START"],
  ["HELP", "AID", "ASSIST", "HINDER"],
  ["LOOK", "SEE", "GLANCE", "IGNORE"],
  ["TALK", "SPEAK", "CHAT", "SILENCE"],
  ["WALK", "STROLL", "HIKE", "SIT"],
  ["RUN", "SPRINT", "DASH", "CRAWL"],
  ["BUY", "PURCHASE", "ACQUIRE", "SELL"],
  ["SELL", "VEND", "PEDDLE", "BUY"],
  ["NEAR", "CLOSE", "NIGH", "FAR"],
  ["FAR", "DISTANT", "REMOTE", "NEAR"],
  ["OLD", "ANCIENT", "AGED", "NEW"],
  ["NEW", "FRESH", "NOVEL", "OLD"],
  ["TRUE", "CORRECT", "ACCURATE", "FALSE"],
  ["FALSE", "UNTRUE", "WRONG", "TRUE"],
  ["RICH", "WEALTHY", "AFFLUENT", "POOR"],
  ["POOR", "NEEDY", "BROKE", "RICH"],
  ["BRAVE", "BOLD", "COURAGEOUS", "COWARD"],
  ["LOUD", "NOISY", "DEAFENING", "QUIET"],
  ["QUIET", "SILENT", "HUSHED", "NOISY"],
  ["COLD", "CHILLY", "ICY", "HOT"],
  ["HOT", "WARM", "SCORCHING", "COLD"],
  ["WET", "DAMP", "SOAKED", "DRY"],
  ["DRY", "ARID", "PARCHED", "WET"],
  ["HARD", "DIFFICULT", "TOUGH", "EASY"],
  ["EASY", "SIMPLE", "SIMPLE", "HARD"],
  ["CLEAN", "TIDY", "SPOTLESS", "DIRTY"],
  ["DIRTY", "FILTHY", "GRIMY", "CLEAN"],
  ["EMPTY", "VACANT", "BARE", "FULL"],
  ["FULL", "FILLED", "PACKED", "EMPTY"],
  ["FRIEND", "MATE", "ALLY", "FOE"],
  ["ENEMY", "FOE", "RIVAL", "ALLY"],
  ["GIFT", "PRESENT", "OFFERING", "THEFT"],
  ["STORY", "TALE", "YARN", "FACT"],
  ["HOUSE", "HOME", "DWELLING", "STREET"],
  ["CAR", "AUTO", "VEHICLE", "BOAT"],
  ["FOOD", "TUCKER", "NOURISHMENT", "HUNGER"],
  ["KID", "CHILD", "YOUNGSTER", "ADULT"],
  ["JOB", "WORK", "GIG", "HOBBY"],
  ["MONEY", "CASH", "DOUGH", "DEBT"],
];

const COMPOUNDS = [
  ["SUN", "FLOWER", "SUNFLOWER"],
  ["RAIN", "BOW", "RAINBOW"],
  ["TOOTH", "BRUSH", "TOOTHBRUSH"],
  ["BASKET", "BALL", "BASKETBALL"],
  ["FOOT", "BALL", "FOOTBALL"],
  ["NOTE", "BOOK", "NOTEBOOK"],
  ["HAIR", "CUT", "HAIRCUT"],
  ["MOON", "LIGHT", "MOONLIGHT"],
  ["STAR", "FISH", "STARFISH"],
  ["CUP", "CAKE", "CUPCAKE"],
  ["PAN", "CAKE", "PANCAKE"],
  ["POP", "CORN", "POPCORN"],
  ["HOT", "DOG", "HOTDOG"],
  ["AIR", "PLANE", "AIRPLANE"],
  ["RAIL", "WAY", "RAILWAY"],
  ["HIGH", "WAY", "HIGHWAY"],
  ["SEA", "SHELL", "SEASHELL"],
  ["SNOW", "MAN", "SNOWMAN"],
  ["FIRE", "FLY", "FIREFLY"],
  ["BUTTER", "FLY", "BUTTERFLY"],
  ["COW", "BOY", "COWBOY"],
  ["MAIL", "BOX", "MAILBOX"],
  ["KEY", "BOARD", "KEYBOARD"],
  ["PASS", "WORD", "PASSWORD"],
  ["SUN", "SET", "SUNSET"],
  ["SUN", "RISE", "SUNRISE"],
  ["DOWN", "LOAD", "DOWNLOAD"],
  ["UP", "LOAD", "UPLOAD"],
  ["PLAY", "GROUND", "PLAYGROUND"],
  ["BED", "ROOM", "BEDROOM"],
  ["BATH", "ROOM", "BATHROOM"],
  ["CLASS", "ROOM", "CLASSROOM"],
  ["NEWS", "PAPER", "NEWSPAPER"],
  ["GRAND", "MOTHER", "GRANDMOTHER"],
  ["SOME", "THING", "SOMETHING"],
  ["ANY", "ONE", "ANYONE"],
  ["EVERY", "DAY", "EVERYDAY"],
  ["OUT", "SIDE", "OUTSIDE"],
  ["IN", "SIDE", "INSIDE"],
  ["OVER", "BOARD", "OVERBOARD"],
  ["UNDER", "GROUND", "UNDERGROUND"],
  ["CROSS", "WALK", "CROSSWALK"],
  ["EARTH", "QUAKE", "EARTHQUAKE"],
  ["THUNDER", "STORM", "THUNDERSTORM"],
  ["WATER", "FALL", "WATERFALL"],
  ["LIGHTH", "OUSE", "LIGHTHOUSE"],
  ["LIGHT", "HOUSE", "LIGHTHOUSE"],
  ["FARM", "HOUSE", "FARMHOUSE"],
  ["TREE", "HOUSE", "TREEHOUSE"],
  ["DOG", "HOUSE", "DOGHOUSE"],
  ["BIRD", "HOUSE", "BIRDHOUSE"],
  ["BOOK", "SHELF", "BOOKSHELF"],
  ["CANDLE", "STICK", "CANDLESTICK"],
  ["CHOP", "STICK", "CHOPSTICK"],
  ["MATCH", "BOX", "MATCHBOX"],
  ["SHOE", "LACE", "SHOELACE"],
  ["WEEK", "END", "WEEKEND"],
  ["AFTER", "NOON", "AFTERNOON"],
  ["BREAK", "FAST", "BREAKFAST"],
  ["COURT", "YARD", "COURTYARD"],
  ["DRIVE", "WAY", "DRIVEWAY"],
  ["FOOT", "PATH", "FOOTPATH"],
  ["HAND", "SHAKE", "HANDSHAKE"],
  ["HEAD", "LIGHT", "HEADLIGHT"],
  ["HEAD", "PHONE", "HEADPHONE"],
  ["LAP", "TOP", "LAPTOP"],
  ["NOTE", "PAD", "NOTEPAD"],
  ["RAIN", "COAT", "RAINCOAT"],
  ["SAND", "STONE", "SANDSTONE"],
  ["SEA", "SIDE", "SEASIDE"],
  ["SKY", "LINE", "SKYLINE"],
  ["SOFT", "WARE", "SOFTWARE"],
  ["HARD", "WARE", "HARDWARE"],
  ["TIME", "TABLE", "TIMETABLE"],
  ["TOOTH", "PASTE", "TOOTHPASTE"],
  ["WASTE", "LAND", "WASTELAND"],
  ["WATER", "MELON", "WATERMELON"],
  ["WHEEL", "CHAIR", "WHEELCHAIR"],
  ["WILD", "FIRE", "WILDFIRE"],
  ["WORK", "SHOP", "WORKSHOP"],
];

function scramble(rng, word) {
  let letters = word.split("");
  for (let n = 0; n < 8; n += 1) {
    letters = rng.shuffle(letters);
    if (letters.join("") !== word) return letters.join("");
  }
  return letters.join("");
}

function caesar(text, shift) {
  return text
    .split("")
    .map((ch) => {
      const c = ch.toUpperCase();
      if (c < "A" || c > "Z") return ch;
      return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
    })
    .join("");
}

const CRYPTO_PHRASES = [
  "READ THE CLUE TWICE",
  "LOOK BOTH WAYS",
  "PACK THE ESKY",
  "CATCH THE FERRY",
  "MIND THE GAP",
  "HOLD THE RAIL",
  "BRING A JUMPER",
  "CHECK THE TIDE",
  "LOCK THE SHED",
  "FEED THE DOG",
  "WATCH THE ROAD",
  "SAVE YOUR WORK",
  "COUNT TO THREE",
  "TRUST THE MAP",
  "WAIT YOUR TURN",
  "KEEP IT TIDY",
  "SHARE THE LOAD",
  "NAME THE TRAP",
  "SLOW IS SMOOTH",
  "THINK THEN TYPE",
  "ASK A BETTER QUESTION",
  "LEAVE NO TRACE",
  "STAY ON THE PATH",
  "DRINK SOME WATER",
  "CHECK YOUR UNITS",
  "DRAW THE DIAGRAM",
  "READ IT ALOUD",
  "START WITH WHY",
  "FINISH THE JOB",
  "MAKE A SMALL MOVE",
];

export function buildWordPuzzles(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const pool4 = WORDS4.filter((w) => C4.get(w));
  const pool5 = WORDS5.filter((w) => C5.get(w));
  const pool6 = W6.map((row) => row[0]);

  function push(item, key) {
    if (seen.has(key) || out.length >= target) return;
    seen.add(key);
    out.push(item);
  }

  let i = 0;
  while (out.length < target && i < target * 8) {
    i += 1;
    const lane = i % 8;
    if (lane === 0) {
      const word = rng.pick(i % 3 === 0 ? pool6 : i % 2 === 0 ? pool5 : pool4);
      const mixed = scramble(rng, word);
      if (mixed === word) continue;
      const decoys = rng
        .shuffle((word.length === 4 ? pool4 : word.length === 5 ? pool5 : pool6).filter((w) => w !== word && w.length === word.length))
        .slice(0, 3);
      const choices = rng.shuffle([word, ...decoys]);
      push(
        {
          cat: "words",
          kind: "choice",
          diff: word.length >= 6 ? "hard" : "medium",
          minutes: 1,
          title: "Anagram",
          prompt: `Unscramble ${mixed} into a real word.`,
          choices,
          correct: choices.indexOf(word),
          why: `${mixed} rearranges to ${word}.`,
          answer: word,
        },
        `ana|${word}|${mixed}`,
      );
    } else if (lane === 1) {
      const word = rng.pick(pool5);
      const drop = rng.int(0, word.length - 1);
      const shown = word.slice(0, drop) + "_" + word.slice(drop + 1);
      const decoys = rng.shuffle(pool5.filter((w) => w !== word && w.length === 5)).slice(0, 3);
      const choices = rng.shuffle([word, ...decoys]);
      push(
        {
          cat: "words",
          kind: "choice",
          diff: "easy",
          minutes: 1,
          title: "Missing letter",
          prompt: `Fill the blank: ${shown} — clue: ${C5.get(word)}.`,
          choices,
          correct: choices.indexOf(word),
          why: `The word is ${word} (${C5.get(word)}).`,
          answer: word,
        },
        `miss|${word}|${drop}`,
      );
    } else if (lane === 2) {
      const row = rng.pick(SYNONYMS);
      const antonym = rng.chance(0.45);
      const prompt = antonym
        ? `Which is the best ANTONYM of ${row[0]}?`
        : `Which is the best SYNONYM of ${row[0]}?`;
      const right = antonym ? row[3] : row[1];
      const wrongs = antonym ? [row[1], row[2], rng.pick(SYNONYMS)[0]] : [row[3], rng.pick(SYNONYMS)[3], rng.pick(pool4)];
      const uniq = [right, ...wrongs].filter((w, idx, arr) => arr.indexOf(w) === idx).slice(0, 4);
      if (uniq.length < 4) continue;
      const choices = rng.shuffle(uniq);
      push(
        {
          cat: "words",
          kind: "choice",
          diff: "medium",
          minutes: 1,
          title: antonym ? "Antonym sprint" : "Synonym sprint",
          prompt,
          choices,
          correct: choices.indexOf(right),
          why: antonym
            ? `${row[0]} sits opposite ${right}. ${row[1]} is a synonym.`
            : `${row[0]} tracks with ${right}. ${row[3]} is the opposite slide.`,
          answer: right,
        },
        `syn|${row[0]}|${antonym}|${right}`,
      );
    } else if (lane === 3) {
      const [a, b, whole] = rng.pick(COMPOUNDS);
      const mode = rng.int(0, 2);
      if (mode === 0) {
        const choices = rng.shuffle([
          whole,
          a + b.slice(1),
          b + a,
          a + " " + b,
        ].filter((w, idx, arr) => arr.indexOf(w) === idx));
        if (!choices.includes(whole) || choices.length < 3) continue;
        push(
          {
            cat: "words",
            kind: "choice",
            diff: "easy",
            minutes: 1,
            title: "Compound join",
            prompt: `Join ${a} + ${b} into the usual compound.`,
            choices,
            correct: choices.indexOf(whole),
            why: `${a} + ${b} writes as ${whole}.`,
            answer: whole,
          },
          `cmp|${whole}|join`,
        );
      } else {
        const wrong = rng.pick(COMPOUNDS.filter((row) => row[2] !== whole));
        const choices = rng.shuffle([`${a} + ${b}`, `${wrong[0]} + ${wrong[1]}`, `${b} + ${a}`, `${a} + ${wrong[1]}`]);
        push(
          {
            cat: "words",
            kind: "choice",
            diff: "medium",
            minutes: 1,
            title: "Compound split",
            prompt: `Split ${whole} into its two usual parts.`,
            choices,
            correct: choices.indexOf(`${a} + ${b}`),
            why: `${whole} is ${a} + ${b}.`,
            answer: `${a}+${b}`,
          },
          `cmp|${whole}|split`,
        );
      }
    } else if (lane === 4) {
      const word = rng.pick(pool5.concat(pool4));
      push(
        {
          cat: "words",
          kind: "reveal",
          diff: word.length >= 5 ? "medium" : "easy",
          minutes: 2,
          title: "Word reveal",
          prompt: `Reveal the word. Clue: ${word.length === 4 ? C4.get(word) : C5.get(word)}. ${word.length} letters. Six misses.`,
          why: `The word is ${word}.`,
          answer: word,
        },
        `rev|${word}`,
      );
    } else if (lane === 5) {
      const phrase = rng.pick(CRYPTO_PHRASES);
      const shift = rng.int(1, 25);
      const cipher = caesar(phrase, shift);
      push(
        {
          cat: "words",
          kind: "crypto",
          diff: phrase.length > 14 ? "hard" : "medium",
          minutes: 3,
          title: "Letter-sub cryptogram",
          prompt: `This is a Caesar shift of English. Decode:\n${cipher}`,
          why: `Shift ${shift}. Plain: ${phrase}.`,
          cipher,
          answer: phrase,
        },
        `cry|${phrase}|${shift}`,
      );
    } else if (lane === 6) {
      const word = rng.pick(pool5);
      const letters = word.split("");
      const acrostic = letters.map((ch) => {
        const pool = WORDS5.filter((w) => w.startsWith(ch) && w !== word);
        return rng.pick(pool.length ? pool : WORDS5);
      });
      push(
        {
          cat: "words",
          kind: "input",
          diff: "hard",
          minutes: 2,
          title: "Acrostic-lite",
          prompt: `Read the first letters:\n${acrostic.map((w, i) => `${i + 1}. ${w}`).join("\n")}\nWhat 5-letter word do they spell? Clue: ${C5.get(word)}.`,
          why: `Initials ${letters.join("")} = ${word}.`,
          answer: word,
        },
        `acr|${word}|${acrostic.join(",")}`,
      );
    } else {
      const word = rng.pick(pool6);
      const mixed = scramble(rng, word);
      push(
        {
          cat: "words",
          kind: "input",
          diff: "hard",
          minutes: 2,
          title: "Type the anagram",
          prompt: `Type the 6-letter word hidden in ${mixed}.`,
          why: `${mixed} → ${word}.`,
          answer: word,
        },
        `anain|${word}|${mixed}`,
      );
    }
  }
  return out;
}
