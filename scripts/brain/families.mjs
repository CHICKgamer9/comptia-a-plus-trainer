import { makeRng } from "./rng.mjs";

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function simplify(n, d) {
  const g = gcd(n, d);
  return [n / g, d / g];
}

function shuffleChoices(rng, right, wrongs) {
  const uniq = [right, ...wrongs].map(String).filter((w, i, arr) => arr.indexOf(w) === i);
  while (uniq.length < 4) uniq.push(String(Number(right) + uniq.length + 3));
  const choices = rng.shuffle(uniq.slice(0, 4));
  return { choices, correct: choices.indexOf(String(right)) };
}

export function buildMaths(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const templates = [
    (r) => {
      const a = r.int(13, 48);
      const b = r.int(7, 19);
      const c = r.int(2, 9);
      const ans = a + b * c;
      const { choices, correct } = shuffleChoices(r, ans, [a + b * c + c, (a + b) * c, a * b + c]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Order of operations",
        prompt: `No calculator. ${a} + ${b} × ${c} = ?`,
        choices,
        correct,
        why: `Multiply first: ${b}×${c}=${b * c}, then +${a} = ${ans}. Brackets would be different.`,
      };
    },
    (r) => {
      const a = r.int(4, 12);
      const b = r.int(4, 12);
      const c = r.int(2, 6);
      const ans = (a + b) * c;
      const { choices, correct } = shuffleChoices(r, ans, [a + b * c, a * b * c, a + b + c]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Brackets first",
        prompt: `(${a} + ${b}) × ${c} = ?`,
        choices,
        correct,
        why: `Brackets: ${a}+${b}=${a + b}, times ${c} = ${ans}.`,
      };
    },
    (r) => {
      const whole = r.int(40, 240);
      const p = r.pick([10, 15, 20, 25, 5, 40]);
      const ans = (whole * p) / 100;
      const { choices, correct } = shuffleChoices(r, ans, [whole * p, whole / p, whole - p]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Percent of",
        prompt: `${p}% of ${whole} is ?`,
        choices,
        correct,
        why: `${p}% means ×${p}/100. ${whole}×${p}/100 = ${ans}.`,
      };
    },
    (r) => {
      const pre = r.int(20, 90);
      const inc = r.pick([10, 11, 10]);
      const ans = Math.round(pre * (1 + inc / 100) * 100) / 100;
      const gst = inc === 10;
      const { choices, correct } = shuffleChoices(r, ans, [pre + inc, pre * inc, pre / 1.1]);
      return {
        diff: "medium",
        minutes: 2,
        title: gst ? "Add GST" : "Add percent",
        prompt: gst
          ? `A shop price is $${pre} before GST (10%). Inclusive total?`
          : `Raise ${pre} by ${inc}%.`,
        choices: choices.map((c) => (String(c).includes("$") ? c : `$${c}`)),
        correct,
        why: gst ? `Inclusive = 110% of ${pre} = $${ans}.` : `${pre}×${1 + inc / 100} = ${ans}.`,
      };
    },
    (r) => {
      const inc = r.int(22, 99);
      const gst = Math.round((inc / 11) * 100) / 100;
      const { choices, correct } = shuffleChoices(r, gst, [inc * 0.1, inc / 10, inc - 10]);
      return {
        diff: "hard",
        minutes: 2,
        title: "GST inside",
        prompt: `$${inc} includes 10% GST. How much of that is GST?`,
        choices: choices.map((c) => `$${c}`),
        correct,
        why: `GST is 1/11 of the inclusive price: ${inc}/11 = ${gst}.`,
      };
    },
    (r) => {
      const n = r.int(3, 9);
      const d = r.pick([4, 5, 6, 8, 10, 12]);
      const of = r.int(12, 60);
      const ans = (n * of) / d;
      if (ans !== Math.floor(ans)) return null;
      const { choices, correct } = shuffleChoices(r, ans, [of / d, n * of, of - n]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Fraction of",
        prompt: `${n}/${d} of ${of} = ?`,
        choices,
        correct,
        why: `Divide ${of} by ${d} (=${of / d}), times ${n} = ${ans}.`,
      };
    },
    (r) => {
      const a = r.int(2, 9);
      const b = r.int(3, 11);
      const [n, d] = simplify(a, b);
      return {
        diff: "easy",
        minutes: 1,
        title: "Simplify the fraction",
        prompt: `Simplify ${a * 3}/${b * 3}.`,
        choices: [`${n}/${d}`, `${a}/${b + 1}`, `${a * 3}/${b}`, `${n + 1}/${d}`],
        correct: 0,
        why: `Cancel a common 3: ${a * 3}/${b * 3} = ${n}/${d}.`,
      };
    },
    (r) => {
      const a = r.int(2, 8);
      const b = r.int(3, 9);
      const d = a * b;
      const n = a + b;
      const [sn, sd] = simplify(n, d);
      const { choices, correct } = shuffleChoices(r, `${sn}/${sd}`, [`${n}/${d}`, `${a + b}/${a + b}`, `${a}/${b}`]);
      return {
        diff: "hard",
        minutes: 2,
        title: "Add fractions",
        prompt: `1/${a} + 1/${b} = ?`,
        choices,
        correct,
        why: `Common denominator ${d}: ${b}/${d} + ${a}/${d} = ${n}/${d} = ${sn}/${sd}.`,
      };
    },
    (r) => {
      const n = r.int(47, 199);
      const d = r.pick([3, 4, 5, 6, 7, 8, 9]);
      const ans = n % d;
      const { choices, correct } = shuffleChoices(r, ans, [Math.floor(n / d), d - ans, n / d]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Remainder",
        prompt: `What is the remainder when ${n} is divided by ${d}?`,
        choices,
        correct,
        why: `${d}×${Math.floor(n / d)} = ${d * Math.floor(n / d)}, leftover ${ans}.`,
      };
    },
    (r) => {
      const h1 = r.int(7, 16);
      const m1 = r.pick([0, 10, 15, 20, 30, 45]);
      const add = r.pick([25, 40, 50, 70, 95, 110]);
      const total = h1 * 60 + m1 + add;
      const h2 = Math.floor(total / 60) % 24;
      const m2 = total % 60;
      const ans = `${h2}:${String(m2).padStart(2, "0")}`;
      const { choices, correct } = shuffleChoices(r, ans, [
        `${h1}:${String((m1 + add) % 60).padStart(2, "0")}`,
        `${(h1 + 1) % 24}:${String(m2).padStart(2, "0")}`,
        `${h2}:${String((m2 + 10) % 60).padStart(2, "0")}`,
      ]);
      return {
        diff: "medium",
        minutes: 2,
        title: "Clock arithmetic",
        prompt: `A ferry leaves at ${h1}:${String(m1).padStart(2, "0")} and takes ${add} minutes. Arrival time?`,
        choices,
        correct,
        why: `${h1}:${String(m1).padStart(2, "0")} plus ${add} min is ${ans}.`,
      };
    },
    (r) => {
      const km = r.int(3, 18);
      const m = km * 1000;
      const { choices, correct } = shuffleChoices(r, m, [km * 100, km * 10, km * 1609]);
      return {
        diff: "easy",
        minutes: 1,
        title: "km to metres",
        prompt: `${km} km in metres?`,
        choices,
        correct,
        why: `1 km = 1000 m, so ${km}000 m.`,
      };
    },
    (r) => {
      const c = r.int(-5, 35);
      const f = Math.round((c * 9) / 5 + 32);
      const { choices, correct } = shuffleChoices(r, f, [c * 2 + 30, c * 9 + 32, 32 - c]);
      return {
        diff: "medium",
        minutes: 2,
        title: "C to F (approx check)",
        prompt: `${c}°C in Fahrenheit (exact: ×9/5 + 32)?`,
        choices,
        correct,
        why: `${c}×9/5 = ${(c * 9) / 5}, plus 32 = ${f}.`,
      };
    },
    (r) => {
      const nums = [r.int(4, 20), r.int(4, 20), r.int(4, 20), r.int(4, 20)];
      const ans = nums.reduce((a, b) => a + b, 0) / 4;
      if (ans !== Math.floor(ans)) return null;
      const { choices, correct } = shuffleChoices(r, ans, [nums[0], Math.max(...nums), nums.reduce((a, b) => a + b, 0)]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Mean",
        prompt: `Mean of ${nums.join(", ")}?`,
        choices,
        correct,
        why: `Sum ${nums.reduce((a, b) => a + b, 0)} ÷ 4 = ${ans}.`,
      };
    },
    (r) => {
      const d = r.int(12, 90);
      const t = r.pick([2, 3, 4, 5, 6]);
      const ans = d / t;
      if (ans !== Math.floor(ans)) return null;
      const { choices, correct } = shuffleChoices(r, ans, [d * t, d - t, t]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Speed",
        prompt: `${d} km in ${t} h. Average speed?`,
        choices: choices.map((c) => `${c} km/h`),
        correct,
        why: `Distance ÷ time = ${d}/${t} = ${ans} km/h.`,
      };
    },
    (r) => {
      const a = r.int(8, 24);
      const b = r.int(3, 9);
      const ans = 2 * (a + b);
      const { choices, correct } = shuffleChoices(r, ans, [a * b, a + b, 2 * a + b]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Rectangle perimeter",
        prompt: `A rectangle is ${a} by ${b}. Perimeter?`,
        choices,
        correct,
        why: `2×(${a}+${b}) = ${ans}. Area would be ${a * b}.`,
      };
    },
    (r) => {
      const a = r.int(6, 18);
      const b = r.int(4, 12);
      const ans = a * b;
      const { choices, correct } = shuffleChoices(r, ans, [2 * (a + b), a + b, a * b * 2]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Rectangle area",
        prompt: `A patio is ${a} m by ${b} m. Area in m²?`,
        choices,
        correct,
        why: `Length × width = ${ans}. Perimeter is ${2 * (a + b)}.`,
      };
    },
    (r) => {
      const n = r.int(11, 49);
      const ans = n * n;
      const { choices, correct } = shuffleChoices(r, ans, [n * 2, n * n - n, (n - 1) * (n + 1)]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Square it",
        prompt: `${n}² = ?`,
        choices,
        correct,
        why: `${n}×${n} = ${ans}. Nearby trap ${(n - 1) * (n + 1)} = n²−1.`,
      };
    },
    (r) => {
      const n = r.pick([16, 25, 36, 49, 64, 81, 100, 121, 144, 169]);
      const ans = Math.sqrt(n);
      const { choices, correct } = shuffleChoices(r, ans, [n / 2, ans + 1, n]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Square root",
        prompt: `√${n} = ?`,
        choices,
        correct,
        why: `${ans}×${ans} = ${n}.`,
      };
    },
    (r) => {
      const x = r.int(3, 12);
      const a = r.int(2, 8);
      const b = r.int(4, 30);
      const rhs = a * x + b;
      const { choices, correct } = shuffleChoices(r, x, [rhs / a, a + b, rhs - a]);
      return {
        diff: "medium",
        minutes: 2,
        title: "Solve for x",
        prompt: `${a}x + ${b} = ${rhs}. x = ?`,
        choices,
        correct,
        why: `Subtract ${b}: ${a}x = ${rhs - b}. Divide by ${a}: x = ${x}.`,
      };
    },
    (r) => {
      const seq0 = r.int(2, 9);
      const d = r.int(3, 11);
      const n = r.int(6, 10);
      const ans = seq0 + (n - 1) * d;
      const { choices, correct } = shuffleChoices(r, ans, [seq0 + n * d, seq0 * d, ans + d]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Nth term (arithmetic)",
        prompt: `Sequence ${seq0}, ${seq0 + d}, ${seq0 + 2 * d}, … What is term ${n}?`,
        choices,
        correct,
        why: `Term n = ${seq0} + (n−1)×${d} = ${ans}.`,
      };
    },
    (r) => {
      const a = r.int(12, 40);
      const ratio = r.pick([2, 3, 4]);
      const parts = ratio + 1;
      if (a % parts !== 0) return null;
      const unit = a / parts;
      const ans = unit * ratio;
      const { choices, correct } = shuffleChoices(r, ans, [unit, a / ratio, a - ratio]);
      return {
        diff: "medium",
        minutes: 2,
        title: "Ratio split",
        prompt: `Split ${a} in the ratio ${ratio}:1. Larger share?`,
        choices,
        correct,
        why: `${ratio}+1 = ${parts} parts. Each part ${unit}. Larger = ${ans}.`,
      };
    },
    (r) => {
      const price = r.int(8, 40);
      const off = r.pick([10, 20, 25, 50]);
      const ans = price * (1 - off / 100);
      const { choices, correct } = shuffleChoices(r, ans, [price - off, price * (off / 100), price + off]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Discount",
        prompt: `$${price} item, ${off}% off. Sale price?`,
        choices: choices.map((c) => `$${c}`),
        correct,
        why: `Pay ${100 - off}% = $${ans}.`,
      };
    },
    (r) => {
      const n = r.int(24, 96);
      const ans = n * 1.5;
      const { choices, correct } = shuffleChoices(r, ans, [n * 1.15, n + 50, n * 2]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Time-and-a-half",
        prompt: `Ordinary rate $${n}/h. Time-and-a-half for one hour?`,
        choices: choices.map((c) => `$${c}`),
        correct,
        why: `1.5 × ${n} = ${ans}. Not +50%.`,
      };
    },
    (r) => {
      const a = r.int(100, 400);
      const b = r.int(8, 25);
      const ans = a - b;
      const { choices, correct } = shuffleChoices(r, ans, [a + b, a * b, b - a]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Change",
        prompt: `Pay $${a} for a $${a - ans} bill. Change?`,
        choices: choices.map((c) => `$${c}`),
        correct,
        why: `${a} − ${a - ans} = ${ans}.`,
      };
    },
    (r) => {
      const n = r.int(4, 9);
      const ans = (n * (n + 1)) / 2;
      const { choices, correct } = shuffleChoices(r, ans, [n * n, n * 2, n * (n - 1)]);
      return {
        diff: "hard",
        minutes: 2,
        title: "Triangular number",
        prompt: `1+2+…+${n} = ?`,
        choices,
        correct,
        why: `n(n+1)/2 = ${n}×${n + 1}/2 = ${ans}.`,
      };
    },
    (r) => {
      const a = r.int(3, 9);
      const b = r.int(2, 6);
      const ans = a ** b;
      const { choices, correct } = shuffleChoices(r, ans, [a * b, a + b, (a + 1) ** b]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Power",
        prompt: `${a}^${b} = ?`,
        choices,
        correct,
        why: `${a} multiplied by itself ${b} times = ${ans}.`,
      };
    },
    (r) => {
      const n = r.int(15, 80);
      const ans = 180 - n;
      const { choices, correct } = shuffleChoices(r, ans, [90 - n, 360 - n, n]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Straight angle",
        prompt: `A straight line. One angle is ${n}°. The adjacent angle?`,
        choices: choices.map((c) => `${c}°`),
        correct,
        why: `Straight line = 180°. ${180}−${n}=${ans}.`,
      };
    },
    (r) => {
      const n = r.int(20, 120);
      const ans = 360 - n;
      const { choices, correct } = shuffleChoices(r, ans, [180 - n, 90 + n, n]);
      return {
        diff: "easy",
        minutes: 1,
        title: "Around a point",
        prompt: `Angles around a point. One is ${n}°. What is left for the rest as one lump?`,
        choices: choices.map((c) => `${c}°`),
        correct,
        why: `Full turn 360°. Remainder ${ans}°.`,
      };
    },
    (r) => {
      const a = r.int(5, 20);
      const b = r.int(5, 20);
      const c = r.int(5, 20);
      const ok = a + b > c && a + c > b && b + c > a;
      return {
        diff: "medium",
        minutes: 1,
        title: "Triangle inequality",
        prompt: `Can ${a}, ${b}, ${c} be side lengths of a triangle?`,
        choices: ["Yes", "No", "Only if right-angled", "Only on a sphere"],
        correct: ok ? 0 : 1,
        why: ok
          ? `Each pair sums to more than the third.`
          : `A pair sums to ≤ the third, so it flattens or fails.`,
      };
    },
    (r) => {
      const n = r.int(8, 28);
      const ans = n * (n - 1);
      const { choices, correct } = shuffleChoices(r, ans, [n * n, n * (n + 1), 2 * n]);
      return {
        diff: "hard",
        minutes: 2,
        title: "Permutations P(n,2)",
        prompt: `${n} people. How many ways to pick a president then a deputy (order matters, no repeat)?`,
        choices,
        correct,
        why: `${n} choices then ${n - 1} = ${ans}. Not n² (that would reuse).`,
      };
    },
    (r) => {
      const n = r.int(6, 14);
      const ans = (n * (n - 1)) / 2;
      const { choices, correct } = shuffleChoices(r, ans, [n * (n - 1), n * 2, n]);
      return {
        diff: "hard",
        minutes: 2,
        title: "Handshakes",
        prompt: `${n} people, each pair shakes once. How many handshakes?`,
        choices,
        correct,
        why: `C(${n},2) = ${n}×${n - 1}/2 = ${ans}.`,
      };
    },
    (r) => {
      const k = r.int(3, 8);
      const ans = 2 ** k;
      const { choices, correct } = shuffleChoices(r, ans, [2 * k, k * k, 2 ** k - 1]);
      return {
        diff: "medium",
        minutes: 1,
        title: "Binary subsets",
        prompt: `${k} yes/no flags. How many combinations?`,
        choices,
        correct,
        why: `2^${k} = ${ans}. Including all-no.`,
      };
    },
  ];

  let guard = 0;
  while (out.length < target && guard < target * 12) {
    guard += 1;
    const t = templates[guard % templates.length];
    const made = t(rng);
    if (!made) continue;
    const key = `${made.prompt}|${made.choices?.join(";")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ cat: "maths", kind: made.choices?.includes("Yes") ? "choice" : "choice", ...made });
  }
  return out;
}

export function buildSequences(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];
  const templates = [
    (r) => {
      const a = r.int(1, 80);
      const d = r.int(1, 20);
      const seq = [a, a + d, a + 2 * d, a + 3 * d];
      const ans = a + 4 * d;
      const { choices, correct } = shuffleChoices(r, ans, [ans + d, ans - 1, a * 5]);
      return { title: "Add constant", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Add ${d} each time.` };
    },
    (r) => {
      const a = r.int(2, 18);
      const m = r.pick([2, 3, 4]);
      const seq = [a, a * m, a * m * m, a * m ** 3];
      const ans = a * m ** 4;
      if (ans > 4000) return null;
      const { choices, correct } = shuffleChoices(r, ans, [a * m * 4, seq[3] + a, a * (m + 1) ** 3]);
      return { title: "Multiply constant", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `×${m} each step.` };
    },
    (r) => {
      const a = r.int(1, 12);
      const b = r.int(1, 9);
      const seq = [a, a + b, a + 2 * b + 1, a + 3 * b + 3];
      const ans = a + 4 * b + 6;
      const { choices, correct } = shuffleChoices(r, ans, [ans + 1, ans - 2, seq[3] + b]);
      return {
        title: "Growing gap",
        prompt: `Next: ${seq.join(", ")}, ? (gaps grow by 1)`,
        choices,
        correct,
        why: `Gaps increase by 1 each time.`,
      };
    },
    (r) => {
      const a = r.int(1, 20);
      const b = r.int(1, 20);
      const seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
      const ans = 3 * a + 5 * b;
      const { choices, correct } = shuffleChoices(r, ans, [ans + a, seq[4] + b, a + b + seq[4]]);
      return { title: "Fibonacci-ish", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Each term is the sum of the previous two.` };
    },
    (r) => {
      const a = r.int(0, 30);
      const seq = [a + 1, a + 4, a + 9, a + 16];
      const ans = a + 25;
      const { choices, correct } = shuffleChoices(r, ans, [a + 20, a + 36, seq[3] + 4]);
      return { title: "Add square numbers", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Add 1², 2², 3², 4², 5².` };
    },
    (r) => {
      const a = r.int(20, 90);
      const d = r.int(2, 12);
      const seq = [a, a - d, a - 2 * d, a - 3 * d];
      const ans = a - 4 * d;
      const { choices, correct } = shuffleChoices(r, ans, [a - 3 * d - 1, a - 5 * d, 0]);
      return { title: "Subtract constant", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Subtract ${d} each time.` };
    },
    (r) => {
      const start = r.int(0, 8);
      const seq = primes.slice(start, start + 5);
      const ans = primes[start + 5];
      const { choices, correct } = shuffleChoices(r, ans, [ans + 1, ans - 1, seq[4] + 2]);
      return { title: "Primes", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Prime numbers. ${ans + 1} is not the next prime.` };
    },
    (r) => {
      const a = r.int(1, 9);
      const shown = [String(a), String(a).repeat(2), String(a).repeat(3)];
      return {
        title: "Digit repeat",
        prompt: `Next: ${shown.join(", ")}, ?`,
        choices: [String(a).repeat(4), String(Number(shown[2]) + a), `${a * 4}`, String(a).repeat(5)],
        correct: 0,
        why: `One more digit ${a} each time.`,
      };
    },
    (r) => {
      const n = r.int(2, 16);
      const seq = [n * n, (n + 1) * (n + 1), (n + 2) * (n + 2), (n + 3) * (n + 3)];
      const ans = (n + 4) * (n + 4);
      const { choices, correct } = shuffleChoices(r, ans, [seq[3] + 2 * n, (n + 4) * (n + 3), seq[3] + 4]);
      return { title: "Squares", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Consecutive squares. Next is ${n + 4}² = ${ans}.` };
    },
    (r) => {
      const a = r.int(1, 25);
      const p = r.int(2, 9);
      const q = r.int(1, 8);
      const seq = [a, a * p + q, (a * p + q) * p + q, ((a * p + q) * p + q) * p + q];
      const ans = seq[3] * p + q;
      if (ans > 8000) return null;
      const { choices, correct } = shuffleChoices(r, ans, [seq[3] * p, seq[3] + q, ans + p]);
      return { title: "Times then plus", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Each term: ×${p} then +${q}.` };
    },
    (r) => {
      const a = r.int(1, 15);
      const b = r.int(1, 12);
      const seq = [a, b, a + 1, b + 1, a + 2];
      const ans = b + 2;
      const { choices, correct } = shuffleChoices(r, ans, [a + 3, b + 1, a + b]);
      return { title: "Two interleaved", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Two sequences taking turns, each going up by 1.` };
    },
    (r) => {
      const n = r.int(3, 12);
      const seq = [n, n + (n + 1), n + (n + 1) + (n + 2), n + (n + 1) + (n + 2) + (n + 3)];
      const ans = seq[3] + (n + 4);
      const { choices, correct } = shuffleChoices(r, ans, [seq[3] + n, ans + 1, seq[3] * 2]);
      return { title: "Add consecutive", prompt: `Next: ${seq.join(", ")}, ?`, choices, correct, why: `Add the next integer each time.` };
    },
  ];
  let guard = 0;
  while (out.length < target && guard < target * 14) {
    guard += 1;
    const made = templates[guard % templates.length](rng);
    if (!made) continue;
    const key = made.prompt;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ cat: "sequence", kind: "choice", diff: "medium", minutes: 1, ...made });
  }
  return out;
}

export function buildAnalogies(target, seed) {
  const rng = makeRng(seed);
  const pairs = [
    ["hot", "cold", "up", "down", "sideways", "warm", "north"],
    ["dog", "puppy", "cat", "kitten", "pack", "bark", "tail"],
    ["sheep", "lamb", "cow", "calf", "herd", "milk", "horn"],
    ["bird", "nest", "bee", "hive", "honey", "wing", "tree"],
    ["author", "book", "composer", "symphony", "piano", "page", "library"],
    ["finger", "hand", "toe", "foot", "shoe", "walk", "arm"],
    ["hour", "minute", "minute", "second", "clock", "day", "week"],
    ["painter", "brush", "writer", "pen", "story", "canvas", "desk"],
    ["kangaroo", "joey", "frog", "tadpole", "pouch", "jump", "lily"],
    ["key", "lock", "password", "account", "door", "type", "safe"],
    ["desert", "dry", "ocean", "wet", "salt", "blue", "wave"],
    ["noun", "thing", "verb", "action", "adjective", "comma", "sentence"],
    ["circle", "circumference", "square", "perimeter", "area", "corner", "pi"],
    ["cause", "effect", "spark", "fire", "smoke", "heat", "wood"],
    ["doctor", "hospital", "teacher", "school", "lesson", "nurse", "book"],
    ["sun", "day", "moon", "night", "star", "tide", "sky"],
    ["leaf", "tree", "petal", "flower", "stem", "green", "root"],
    ["map", "territory", "menu", "meal", "chef", "paper", "road"],
    ["hammer", "nail", "screwdriver", "screw", "wood", "tool", "hit"],
    ["library", "books", "gallery", "art", "museum", "quiet", "shelf"],
    ["engine", "car", "heart", "body", "blood", "road", "fuel"],
    ["seed", "plant", "egg", "bird", "nest", "shell", "feather"],
    ["pen", "ink", "pencil", "graphite", "eraser", "paper", "draw"],
    ["north", "south", "east", "west", "left", "up", "map"],
    ["input", "output", "question", "answer", "exam", "prompt", "code"],
  ];
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 6) {
    i += 1;
    const row = rng.pick(pairs);
    const extra = rng.pick(pairs);
    const prompt = `${row[0].toUpperCase()} is to ${row[1].toUpperCase()} as ${row[2].toUpperCase()} is to ?`;
    const choices = rng.shuffle([row[3], row[4], row[5], extra[0]]);
    const key = prompt + choices.join();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      cat: "analogy",
      kind: "choice",
      diff: "medium",
      minutes: 1,
      title: "Verbal analogy",
      prompt,
      choices,
      correct: choices.indexOf(row[3]),
      why: `The relation ${row[0]}→${row[1]} matches ${row[2]}→${row[3]}.`,
    });
  }
  return out;
}

export function buildSyllogisms(target, seed) {
  const rng = makeRng(seed);
  const sets = [
    ["wombats", "marsupials", "mammals"],
    ["sparrows", "birds", "animals"],
    ["squares", "rectangles", "quadrilaterals"],
    ["nurses", "health workers", "employees"],
    ["ferries", "boats", "vehicles"],
    ["oak trees", "trees", "plants"],
    ["trains", "vehicles", "machines"],
    ["haiku", "poems", "texts"],
    ["copper", "metals", "elements"],
    ["dingoes", "canids", "mammals"],
    ["rosellas", "parrots", "birds"],
    ["kelpies", "dogs", "animals"],
    ["haikus", "poems", "artworks"],
    ["sedans", "cars", "vehicles"],
    ["flutes", "instruments", "objects"],
    ["salmon", "fish", "animals"],
    ["diamonds", "gems", "minerals"],
    ["sonnets", "poems", "texts"],
    ["trams", "vehicles", "machines"],
    ["eucalypts", "trees", "plants"],
    ["penguins", "birds", "animals"],
    ["triangles", "polygons", "shapes"],
    ["surgeons", "doctors", "professionals"],
    ["canoes", "boats", "vehicles"],
    ["pines", "trees", "plants"],
    ["buses", "vehicles", "machines"],
    ["limericks", "poems", "texts"],
    ["silver", "metals", "elements"],
    ["quolls", "marsupials", "mammals"],
    ["empires", "states", "organisations"],
    ["novels", "books", "texts"],
    ["galahs", "parrots", "birds"],
    ["utes", "cars", "vehicles"],
    ["violins", "instruments", "objects"],
    ["trout", "fish", "animals"],
    ["emeralds", "gems", "minerals"],
    ["ballads", "poems", "texts"],
    ["ferries", "vessels", "vehicles"],
    ["acacias", "trees", "plants"],
    ["ibis", "birds", "animals"],
    ["hexagons", "polygons", "shapes"],
    ["paramedics", "health workers", "employees"],
    ["kayaks", "boats", "vehicles"],
    ["banksias", "plants", "living things"],
    ["trucks", "vehicles", "machines"],
    ["iron", "metals", "elements"],
    ["koalas", "marsupials", "mammals"],
    ["essays", "texts", "works"],
    ["cockatoos", "parrots", "birds"],
    ["bicycles", "vehicles", "machines"],
    ["clarinets", "instruments", "objects"],
    ["cod", "fish", "animals"],
    ["sapphires", "gems", "minerals"],
    ["odes", "poems", "texts"],
    ["barges", "boats", "vehicles"],
    ["wattles", "plants", "living things"],
    ["crows", "birds", "animals"],
    ["pentagons", "polygons", "shapes"],
    ["dentists", "health workers", "professionals"],
    ["yachts", "boats", "vehicles"],
    ["cedars", "trees", "plants"],
    ["scooters", "vehicles", "machines"],
    ["tin", "metals", "elements"],
    ["bandicoots", "marsupials", "mammals"],
    ["memoirs", "books", "texts"],
    ["lorikeets", "parrots", "birds"],
    ["vans", "cars", "vehicles"],
    ["harps", "instruments", "objects"],
    ["tuna", "fish", "animals"],
    ["rubies", "gems", "minerals"],
    ["epics", "poems", "texts"],
    ["dinghies", "boats", "vehicles"],
    ["melaleucas", "trees", "plants"],
    ["magpies", "birds", "animals"],
    ["octagons", "polygons", "shapes"],
    ["pharmacists", "health workers", "employees"],
    ["rafts", "boats", "vehicles"],
    ["grevilleas", "plants", "living things"],
    ["motorbikes", "vehicles", "machines"],
    ["zinc", "metals", "elements"],
    ["possums", "marsupials", "mammals"],
    ["reports", "texts", "works"],
  ];
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 12) {
    i += 1;
    const [a, b, c] = rng.pick(sets);
    const mode = i % 12;
    let prompt;
    let answer;
    let why;
    if (mode === 0) {
      prompt = `All ${a} are ${b}. All ${b} are ${c}. Therefore all ${a} are ${c}.`;
      answer = true;
      why = "Subset chains: A⊂B⊂C so A⊂C.";
    } else if (mode === 1) {
      prompt = `All ${a} are ${b}. Some ${b} are ${c}. Therefore some ${a} are ${c}.`;
      answer = false;
      why = `The ${c} overlap might miss the ${a} subset entirely.`;
    } else if (mode === 2) {
      prompt = `No ${a} are ${c}. All ${b} are ${c}. Therefore no ${a} are ${b}.`;
      answer = true;
      why = "If B sits inside C and A misses C, A misses B.";
    } else if (mode === 3) {
      prompt = `Some ${a} are ${b}. Some ${b} are ${c}. Therefore some ${a} are ${c}.`;
      answer = false;
      why = "Two 'some' overlaps need not touch.";
    } else if (mode === 4) {
      prompt = `All ${a} are ${b}. No ${b} are ${c}. Therefore no ${a} are ${c}.`;
      answer = true;
      why = "If A sits in B and B misses C, A misses C.";
    } else if (mode === 5) {
      prompt = `All ${a} are ${b}. All ${a} are ${c}. Therefore all ${b} are ${c}.`;
      answer = false;
      why = "A can be a proper subset of B; the rest of B need not be C.";
    } else if (mode === 6) {
      prompt = `Some ${a} are not ${b}. All ${c} are ${b}. Therefore some ${a} are not ${c}.`;
      answer = true;
      why = "Those A outside B cannot be inside C, because C sits in B.";
    } else if (mode === 7) {
      prompt = `No ${a} are ${b}. All ${c} are ${a}. Therefore no ${c} are ${b}.`;
      answer = true;
      why = "C sits inside A, and A misses B, so C misses B.";
    } else if (mode === 8) {
      prompt = `All ${a} are ${b}. Some ${a} are ${c}. Therefore some ${b} are ${c}.`;
      answer = true;
      why = "The overlapping A are also B, so some B are C.";
    } else if (mode === 9) {
      prompt = `Some ${a} are ${b}. No ${b} are ${c}. Therefore some ${a} are not ${c}.`;
      answer = true;
      why = "The A that are B cannot be C.";
    } else if (mode === 10) {
      prompt = `All ${b} are ${a}. All ${c} are ${a}. Therefore some ${b} are ${c}.`;
      answer = false;
      why = "Two subsets of A need not overlap.";
    } else {
      prompt = `No ${a} are ${b}. Some ${c} are ${a}. Therefore some ${c} are not ${b}.`;
      answer = true;
      why = "Those C that are A miss B.";
    }
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    out.push({
      cat: "syllogism",
      kind: "truefalse",
      diff: mode === 1 || mode === 3 || mode === 5 || mode === 10 ? "hard" : "medium",
      minutes: 2,
      title: "Syllogism",
      prompt: `${prompt} True or false?`,
      answer,
      why,
    });
  }
  return out;
}

export function buildEstimates(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const items = [
    () => {
      const n = rng.int(6, 90);
      return {
        prompt: `About how many minutes in ${n} hours? (nearest 100)`,
        answer: String(Math.round((n * 60) / 100) * 100),
        why: `${n}×60 = ${n * 60}.`,
        wrongs: [String(n * 100), String(n * 24), String(n * 10)],
      };
    },
    () => {
      const pages = rng.pick([40, 48, 64, 80, 96, 120]);
      const n = rng.int(2, 24);
      return {
        prompt: `A stack of ${pages}-page booklets, ${n} booklets. Pages, roughly?`,
        answer: String(n * pages),
        why: `${n}×${pages} = ${n * pages}.`,
        wrongs: [String(n * 100), String(n * 8), String(pages / n)],
      };
    },
    () => {
      const km = rng.int(2, 40);
      const speed = rng.pick([4, 5, 6, 8, 10]);
      if (km % speed !== 0) return null;
      return {
        prompt: `Walk ${km} km at ${speed} km/h. Hours, roughly?`,
        answer: String(km / speed),
        why: `Time = distance/speed = ${km}/${speed}.`,
        wrongs: [String(km * speed), String(km - speed), String(speed / km)],
      };
    },
    () => {
      const n = rng.int(2, 16);
      return {
        prompt: `2^${n} is closest to which order of magnitude (powers of 10)? Pick the integer nearest log10(2^${n}).`,
        answer: String(Math.round(n * 0.301)),
        why: `log10(2)≈0.30 so ${n}×0.30 ≈ ${(n * 0.3).toFixed(1)}.`,
        wrongs: [String(n), String(n - 1), "0"],
      };
    },
    () => {
      const r = rng.int(2, 25);
      const ans = Math.round(3.14 * r * r);
      return {
        prompt: `Area of a circle radius ${r} (π≈3.14), nearest whole?`,
        answer: String(ans),
        why: `πr² ≈ 3.14×${r * r} ≈ ${ans}.`,
        wrongs: [String(3 * r * r), String(Math.round(2 * 3.14 * r)), String(r * r)],
      };
    },
    () => {
      const n = rng.int(3, 40);
      const unit = rng.pick([250, 500, 750]);
      return {
        prompt: `${n} bottles at ${unit} mL each. Litres, roughly?`,
        answer: String((n * unit) / 1000),
        why: `${n}×${unit} mL = ${n * unit} mL = ${(n * unit) / 1000} L.`,
        wrongs: [String(n * unit), String(n), String(unit / 1000)],
      };
    },
    () => {
      const people = rng.int(12, 90);
      const each = rng.pick([8, 10, 12, 15]);
      return {
        prompt: `${people} people, about ${each} biscuits each. Biscuits to bake (nearest 10)?`,
        answer: String(Math.round((people * each) / 10) * 10),
        why: `${people}×${each} = ${people * each}.`,
        wrongs: [String(people + each), String(people * 10), String(each * 10)],
      };
    },
    () => {
      const a = rng.int(18, 80);
      const b = rng.int(18, 80);
      return {
        prompt: `About ${a} × ${b}. Closest to which hundred?`,
        answer: String(Math.round((a * b) / 100) * 100),
        why: `${a}×${b} = ${a * b}.`,
        wrongs: [String(a * 100), String(b * 100), String(a + b)],
      };
    },
  ];
  let guard = 0;
  while (out.length < target && guard < target * 14) {
    guard += 1;
    const made = items[guard % items.length]();
    if (!made || seen.has(made.prompt)) continue;
    seen.add(made.prompt);
    const { choices, correct } = shuffleChoices(rng, made.answer, made.wrongs);
    out.push({
      cat: "estimate",
      kind: "choice",
      diff: "medium",
      minutes: 2,
      title: "Estimation",
      prompt: made.prompt,
      choices,
      correct,
      why: made.why,
    });
  }
  return out;
}

export function buildChance(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 12) {
    i += 1;
    const mode = i % 8;
    let prompt;
    let right;
    let wrongs;
    let why;
    let diff = "medium";
    if (mode === 0) {
      const n = rng.int(2, 20);
      right = `1/${n}`;
      prompt = `A fair ${n}-sided spinner, labelled 1–${n}. P(landing on 1)?`;
      wrongs = [`1/${n + 1}`, `${n}/1`, "1/2"];
      why = `One favourable, ${n} equally likely.`;
    } else if (mode === 1) {
      const k = rng.int(2, 6);
      right = `1/${2 ** k}`;
      prompt = `A fair coin flipped ${k} times. P(all heads)?`;
      wrongs = ["1/2", `1/${k}`, `${k}/2`];
      why = `${2 ** k} equally likely strings; one is all heads.`;
    } else if (mode === 2) {
      const red = rng.int(1, 12);
      const blue = rng.int(1, 12);
      const total = red + blue;
      right = `${red}/${total}`;
      prompt = `A bag: ${red} red, ${blue} blue. One draw. P(red)?`;
      wrongs = [`${red}/${blue}`, `${blue}/${total}`, "1/2"];
      why = `${red} red over ${total} marbles.`;
    } else if (mode === 3) {
      const p = rng.pick([2, 3, 4, 5, 6, 8, 10]);
      right = `1/${p * p}`;
      prompt = `Independent events A,B each 1/${p}. P(both)?`;
      wrongs = [`1/${p}`, `2/${p}`, "0"];
      why = `Multiply independent probabilities: 1/${p}×1/${p}=1/${p * p}.`;
      diff = "easy";
    } else if (mode === 4) {
      const faces = rng.pick([4, 6, 8, 10, 12, 20]);
      const even = faces / 2;
      right = "1/2";
      prompt = `You roll a fair d${faces}. P(even)?`;
      wrongs = [`1/${faces}`, `${even}/${faces - 1}`, "1/3"];
      why = `${even} even faces of ${faces}.`;
    } else if (mode === 5) {
      const n = rng.int(4, 16);
      const k = rng.int(1, n - 1);
      right = `${k}/${n}`;
      prompt = `A box of ${n} tickets numbered 1–${n}. P(drawing a number ≤ ${k})?`;
      wrongs = [`1/${n}`, `${k}/${n - 1}`, `${n}/${k}`];
      why = `${k} favourable of ${n}.`;
    } else if (mode === 6) {
      const green = rng.int(1, 8);
      const yellow = rng.int(1, 8);
      const white = rng.int(1, 8);
      const total = green + yellow + white;
      right = `${green + yellow}/${total}`;
      prompt = `Bag: ${green} green, ${yellow} yellow, ${white} white. P(not white)?`;
      wrongs = [`${white}/${total}`, `${green}/${total}`, "1/3"];
      why = `Not white = ${green + yellow} of ${total}.`;
    } else {
      const n = rng.int(2, 10);
      right = `${n - 1}/${n}`;
      prompt = `Fair ${n}-sided die. P(not rolling a 1)?`;
      wrongs = [`1/${n}`, `${n}/${n - 1}`, "1/2"];
      why = `${n - 1} of ${n} faces are not 1.`;
    }
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    const choices = rng.shuffle([right, ...wrongs].filter((w, idx, arr) => arr.indexOf(w) === idx).slice(0, 4));
    if (!choices.includes(right) || choices.length < 3) continue;
    out.push({
      cat: "chance",
      kind: "choice",
      diff,
      minutes: 2,
      title: "Probability intuition",
      prompt,
      choices,
      correct: choices.indexOf(right),
      why,
    });
  }
  return out;
}

export function buildCode(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const words = ["hi", "ok", "ab", "go", "we", "to", "up", "on", "no", "ya"];
  let i = 0;
  while (out.length < target && i < target * 10) {
    i += 1;
    const a = rng.int(1, 12);
    const b = rng.int(1, 12);
    const n = rng.int(2, 8);
    const mode = i % 8;
    let prompt;
    let ans;
    let why;
    if (mode === 0) {
      prompt = `x = ${a}\nx = x + ${b}\nx = x * 2\nWhat is x?`;
      ans = (a + b) * 2;
      why = `Start ${a}, add ${b} → ${a + b}, times 2 → ${ans}.`;
    } else if (mode === 1) {
      prompt = `s = 0\nfor i in 1..${n}: s = s + i\nWhat is s?`;
      ans = (n * (n + 1)) / 2;
      why = `Sum 1..${n} = ${ans}.`;
    } else if (mode === 2) {
      const lim = a + rng.int(2, 5);
      prompt = `n = ${a}\nwhile n < ${lim}: n = n + 1\nHow many times did the body run?`;
      ans = lim - a;
      why = `n runs ${a} … ${lim - 1} then stops at ${lim}. ${ans} trips.`;
    } else if (mode === 3) {
      prompt = `a, b = ${a}, ${b}\na, b = b, a\nWhat is a?`;
      ans = b;
      why = "Swap. a takes old b.";
    } else if (mode === 4) {
      const w = rng.pick(words);
      prompt = `x = "${w}"\nWhat is len(x) after x = x + x?`;
      ans = w.length * 2;
      why = `Concatenate with itself: length doubles to ${ans}.`;
    } else if (mode === 5) {
      const times = rng.int(2, 4);
      prompt = `p = ${a}\nfor _ in range(${times}): p = p * 2\nWhat is p?`;
      ans = a * 2 ** times;
      why = `Double ${times} times: ${a} → ${ans}.`;
    } else if (mode === 6) {
      prompt = `x = ${a}\nfor _ in range(${n}): x = x + ${b}\nWhat is x?`;
      ans = a + n * b;
      why = `Add ${b}, ${n} times: ${a} + ${n}×${b} = ${ans}.`;
    } else {
      prompt = `t = ${a}\nt = t - ${b}\nt = t * ${n}\nWhat is t?`;
      ans = (a - b) * n;
      why = `${a}−${b}=${a - b}, times ${n} = ${ans}.`;
    }
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    const { choices, correct } = shuffleChoices(rng, ans, [ans + 1, ans - 1, a + b]);
    out.push({
      cat: "code",
      kind: "choice",
      diff: "medium",
      minutes: 2,
      title: "Trace the code",
      prompt: `Trace this:\n${prompt}`,
      choices,
      correct,
      why,
    });
  }
  return out;
}

export function buildSpatial(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  const order = ["north", "east", "south", "west"];
  let i = 0;
  while (out.length < target && i < target * 12) {
    i += 1;
    const n = rng.int(2, 8);
    const mode = i % 6;
    let prompt;
    let ans;
    let why;
    let wrongs;
    if (mode === 0) {
      const cubes = n ** 3;
      const painted = n === 2 ? 8 : 8 + 12 * (n - 2) + 6 * (n - 2) ** 2;
      prompt = `An ${n}×${n}×${n} cube is painted outside then cut into 1×1×1 cubes. How many have NO paint?`;
      ans = n > 2 ? (n - 2) ** 3 : 0;
      wrongs = [cubes, painted, n * n];
      why = `Inner cube is ${(n - 2 < 1 ? 0 : n - 2)}³ = ${ans}.`;
    } else if (mode === 1) {
      const start = rng.pick(order);
      const turns = rng.shuffle(["right", "right", "left", "left", "right"]).slice(0, rng.int(2, 4));
      let iFace = order.indexOf(start);
      for (const t of turns) iFace = (iFace + (t === "right" ? 1 : 3)) % 4;
      ans = order[iFace][0].toUpperCase() + order[iFace].slice(1);
      prompt = `You face ${start}. Turn ${turns.join(", then ")}. Which way do you face?`;
      wrongs = order.filter((d) => d !== order[iFace]).map((d) => d[0].toUpperCase() + d.slice(1));
      why = `Start ${start}; ${turns.join(" then ")} lands ${order[iFace]}.`;
    } else if (mode === 2) {
      const dir = rng.pick(["clockwise", "counter-clockwise"]);
      const deg = rng.pick([90, 180, 270]);
      const from = rng.pick(["up", "right", "down", "left"]);
      prompt = `A 2D arrow pointing ${from} is rotated ${deg}° ${dir}. It now points?`;
      const faces = ["up", "right", "down", "left"];
      const steps = (deg / 90) * (dir === "clockwise" ? 1 : 3);
      const face = faces[(faces.indexOf(from) + steps) % 4];
      ans = face;
      wrongs = faces.filter((d) => d !== face);
      why = `${deg}° ${dir} from ${from} is ${face}.`;
    } else if (mode === 3) {
      const k = rng.int(1, 4);
      prompt = `A cube net: a row of ${k + 3} squares with one square attached to the side of square ${k}. Can it fold to a cube?`;
      ans = k + 3 <= 4 ? "Yes" : "No";
      wrongs = ans === "Yes" ? ["No", "Only if tape", "Only opposite faces painted"] : ["Yes", "Only if tape", "Always"];
      why = k + 3 <= 4 ? "Classic valid net (branch off a short row)." : "A row of 5+ already uses too many faces in a line.";
    } else if (mode === 4) {
      prompt = `A ${n}×${n} square is folded in half, then in half again. How many layers thick?`;
      ans = 4;
      wrongs = [2, n, n * 2];
      why = "Each fold doubles layers: 1→2→4.";
    } else {
      const painted = n > 2 ? 8 + 12 * (n - 2) + 6 * (n - 2) ** 2 : 8;
      prompt = `An ${n}×${n}×${n} cube painted outside then diced. How many small cubes have paint on at least one face?`;
      ans = n ** 3 - (n > 2 ? (n - 2) ** 3 : 0);
      wrongs = [painted, n ** 3, 6 * n * n];
      why = `Total ${n ** 3} minus inner ${(n > 2 ? (n - 2) ** 3 : 0)} = ${ans}.`;
    }
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    const { choices, correct } = shuffleChoices(rng, ans, wrongs);
    out.push({
      cat: "spatial",
      kind: "choice",
      diff: "hard",
      minutes: 2,
      title: "Spatial",
      prompt,
      choices,
      correct,
      why,
    });
  }
  return out;
}

export function buildMemory(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const glyphs = ["12", "7", "19", "3", "44", "8", "31", "5", "27", "16", "Q", "R", "L", "M", "K", "π", "Δ", "N"];
  const seen = new Set();
  while (out.length < target) {
    const len = rng.int(5, 8);
    const flash = rng.shuffle(glyphs).slice(0, len);
    const key = flash.join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    const mode = out.length % 3;
    if (mode === 0) {
      const missing = flash[rng.int(0, len - 1)];
      const shown = flash.filter((g) => g !== missing);
      const { choices, correct } = shuffleChoices(rng, missing, rng.shuffle(glyphs.filter((g) => !flash.includes(g))).slice(0, 3));
      out.push({
        cat: "memory",
        kind: "memory",
        diff: len >= 7 ? "hard" : "medium",
        minutes: 2,
        title: "Missing from the flash",
        prompt: "Which token was in the flash but missing from this list?",
        extra: shown,
        flash,
        choices,
        correct,
        why: `Flash was ${flash.join(" · ")}. Missing ${missing}.`,
      });
    } else if (mode === 1) {
      const last = flash[flash.length - 1];
      const { choices, correct } = shuffleChoices(rng, last, flash.slice(0, 3));
      out.push({
        cat: "memory",
        kind: "memory",
        diff: "medium",
        minutes: 2,
        title: "Last in span",
        prompt: "What was the LAST token in the flash?",
        flash,
        choices,
        correct,
        why: `Sequence ended with ${last}.`,
      });
    } else {
      const items = flash.map((label, idx) => ({ id: `t${idx}`, label }));
      out.push({
        cat: "memory",
        kind: "memory",
        diff: "hard",
        minutes: 2,
        title: "Order the flash",
        prompt: "Put the tokens in the order they appeared.",
        flash,
        extra: items.map((item) => item.id),
        items: items.map((item) => item.label),
        order: items.map((_, idx) => idx),
        why: `Order: ${flash.join(" → ")}.`,
      });
    }
    if (out.length >= target) break;
  }
  return out;
}

export function buildReading(target, seed) {
  const rng = makeRng(seed);
  const out = [];
  const towns = ["Ballarat", "Fremantle", "Launceston", "Wollongong", "Cairns", "Bendigo", "Hobart", "Darwin"];
  const names = ["Priya", "Jonah", "Mei", "Alex", "Sam", "Noor", "Tane", "Riley"];
  const goods = ["apples", "bolts", "tickets", "jars", "planks", "cables"];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 6) {
    i += 1;
    const who = rng.pick(names);
    const town = rng.pick(towns);
    const n = rng.int(12, 48);
    const g = rng.pick(goods);
    const left = rng.int(2, 9);
    const sold = n - left;
    const prompt = `${who} packed ${n} ${g} in ${town} on Tuesday. By Thursday ${sold} were gone and ${left} stayed in the shed. A note says “do not count the ones still in the shed as sold.” How many were sold?`;
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    const { choices, correct } = shuffleChoices(rng, sold, [n, left, n + left]);
    out.push({
      cat: "reading",
      kind: "choice",
      diff: "medium",
      minutes: 2,
      title: "Read for detail",
      prompt,
      choices,
      correct,
      why: `Sold = packed minus leftover = ${n}−${left} = ${sold}. The town and weekday are bait.`,
    });
  }
  return out;
}

export function buildLateral(target, seed) {
  const rng = makeRng(seed);
  const traps = [
    {
      prompt: "A doctor says “this medicine is 80% effective, so 20 people in a 100 will be fine anyway.” What's wrong?",
      right: "They mixed baseline recovery with the drug’s effect — 80% effective is not 20 spontaneous cures",
      wrong: [
        "Percentages cannot apply to people",
        "Doctors are not allowed to say 80%",
        "100 is too small a sample to ever speak",
      ],
      why: "Effectiveness is about the treatment, not leftover people who were always fine.",
    },
    {
      prompt: "“Average income rose, so most people are richer.” What's wrong?",
      right: "A mean can rise from a few huge incomes while the median person does not",
      wrong: ["Averages always equal medians", "Income cannot be averaged", "Richer is not a number"],
      why: "Mean ≠ median. Skew lies.",
    },
    {
      prompt: "“The train is never late on days I check, therefore it is never late.” What's wrong?",
      right: "You only sampled days you checked — selection bias",
      wrong: ["Trains cannot be late", "Never is a fine word if you feel it", "Checking causes lateness"],
      why: "Unobserved days can be late.",
    },
    {
      prompt: "“After the rooster crows, the sun rises, so the rooster causes sunrise.” What's wrong?",
      right: "Sequence is not cause — correlation / post hoc",
      wrong: ["Roosters do cause astronomy", "The sun is a rooster", "Nothing can be known"],
      why: "Post hoc ergo propter hoc.",
    },
    {
      prompt: "A shop: “Was $80, now $40 — 100% off!” What's wrong?",
      right: "Half off is 50%, not 100%. 100% off would be free",
      wrong: ["You cannot discount twice", "$40 is 100% of $40", "Percents only go to 10"],
      why: "Drop of 40 on 80 is 50%.",
    },
    {
      prompt: "“All swans I saw were white, so all swans are white.” What's wrong? (Aussie hint.)",
      right: "Induction from a local sample — black swans exist",
      wrong: ["Swans cannot be black by definition", "Seeing is the only proof", "Colour is not a property"],
      why: "Falsifiable generalisation. Australia famously falsified it.",
    },
    {
      prompt: "“This survey of 12 mates proves 90% of Australia agrees.” What's wrong?",
      right: "Tiny, friendly sample is not the country — sampling bias",
      wrong: ["12 is always enough", "Mates cannot be surveyed", "90% is illegal"],
      why: "Friends are not a random sample of a nation.",
    },
    {
      prompt: "“Crime rose after ice cream sales rose, so ice cream causes crime.” What's wrong?",
      right: "A hidden season (heat) can drive both — confounding",
      wrong: ["Ice cream is illegal", "Crime cannot be measured", "Sales never rise"],
      why: "Two effects of heat are not cause.",
    },
    {
      prompt: "“We tested the new sign on the busiest corner only, and crashes fell, so it works everywhere.” What's wrong?",
      right: "Regression to the mean / site cherry-pick — one busy corner is not every road",
      wrong: ["Signs never work", "Corners cannot have signs", "Crashes are imaginary"],
      why: "Extreme sites drift back; you didn't test quiet roads.",
    },
    {
      prompt: "“Nobody has proved it false, therefore it is true.” What's wrong?",
      right: "Ignorance is not evidence — argument from ignorance",
      wrong: ["Unproved things are always true", "Proof is optional", "False things cannot be spoken"],
      why: "Lack of disproof is not proof.",
    },
    {
      prompt: "“Either we ban all phones or society collapses.” What's wrong?",
      right: "False dilemma — more options exist than two extremes",
      wrong: ["Phones cannot be banned", "Society already collapsed", "There are always exactly two options"],
      why: "Binary framing hides the middle.",
    },
    {
      prompt: "“The first 3 coin flips were heads, so the next must be tails to balance.” What's wrong?",
      right: "Gambler's fallacy — fair flips have no memory",
      wrong: ["Coins remember", "Three heads is impossible", "Tails is due by law"],
      why: "Independent trials don't owe you a tails.",
    },
    {
      prompt: "“Our app has 1-star and 5-star reviews, so the average user is a 3.” What's wrong?",
      right: "Review polarisation / self-selection — the silent middle may not review",
      wrong: ["Stars cannot be averaged", "1 and 5 make 3 always", "Apps cannot have ratings"],
      why: "Who bothers to review is a biased sample.",
    },
    {
      prompt: "“This hospital has a higher death rate, so its doctors are worse.” What's wrong?",
      right: "Case mix — it may take the sickest patients",
      wrong: ["Death rates never mislead", "Doctors cannot be compared", "Hospitals are identical"],
      why: "Raw rates ignore who arrived already critical.",
    },
    {
      prompt: "“I wore the lucky socks and we won, so the socks caused the win.” What's wrong?",
      right: "One coincidence is not a mechanism — superstition",
      wrong: ["Socks affect physics", "Wins cannot be caused", "Luck is a force"],
      why: "Anecdote plus desire is not cause.",
    },
    {
      prompt: "“Prices went up 10% then down 10%, so we're back where we started.” What's wrong?",
      right: "Percents don't cancel — down 10% is on a larger base",
      wrong: ["10 and 10 always cancel", "Prices cannot fall", "Percents only go up"],
      why: "100 → 110 → 99.",
    },
    {
      prompt: "“Every world champion drinks water, so water makes champions.” What's wrong?",
      right: "Common factor is not the cause — almost everyone drinks water",
      wrong: ["Champions never drink", "Water is banned", "Only tea creates skill"],
      why: "A near-universal habit explains nothing.",
    },
    {
      prompt: "“The sample mean is 50, so every person is about 50.” What's wrong?",
      right: "A mean is not a person — variance still exists",
      wrong: ["Means are always exact people", "50 cannot be a mean", "People cannot be numbered"],
      why: "Distributions have spread.",
    },
    {
      prompt: "“We excluded the outliers after seeing the result we wanted.” What's wrong?",
      right: "P-hacking / data peeking — the cut was chosen to flatter the claim",
      wrong: ["Outliers must always be deleted", "Results cannot be seen", "Cuts are never a choice"],
      why: "The rule has to be fixed before you peek.",
    },
    {
      prompt: "“This graph starts the axis at 98, so the tiny rise looks huge.” What's wrong?",
      right: "Misleading scale — truncated axis exaggerates change",
      wrong: ["Axes must start at 98", "Graphs cannot lie", "Tiny rises are always huge"],
      why: "Scale is a rhetorical choice.",
    },
  ];
  const ask = ["Name the slide.", "What failed?", "Where is the cheat?", "Spot the dodge.", "Which move is dirty?"];
  const towns = ["Sydney", "Perth", "Hobart", "Darwin", "Adelaide", "Brisbane", "Canberra", "Melbourne"];
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 8) {
    i += 1;
    const t = traps[i % traps.length];
    const choices = rng.shuffle([t.right, ...t.wrong]);
    const prompt = `${t.prompt} (${rng.pick(ask)} Think ${rng.pick(towns)}.)`;
    const key = prompt;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      cat: "lateral",
      kind: "choice",
      diff: "hard",
      minutes: 2,
      title: "What's wrong",
      prompt,
      choices,
      correct: choices.indexOf(t.right),
      why: t.why,
    });
  }
  return out;
}

export function buildLogic(target, seed) {
  const rng = makeRng(seed);
  const names = ["Ada", "Bess", "Cam", "Dee", "Eli"];
  const pets = ["kelpie", "cat", "python", "galah", "axolotl"];
  const out = [];
  const seen = new Set();
  let i = 0;
  while (out.length < target && i < target * 6) {
    i += 1;
    const who = rng.shuffle(names).slice(0, 3);
    const have = rng.shuffle(pets).slice(0, 3);
    const map = Object.fromEntries(who.map((n, idx) => [n, have[idx]]));
    const clue1 = `${who[0]} does not have the ${have[1]}.`;
    const clue2 = `${who[1]} has the ${have[1]}.`;
    const clue3 = `The ${have[2]} is not ${who[0]}'s.`;
    const prompt = `${who.join(", ")} have ${have.join(", ")} — one each.\n${clue1}\n${clue2}\n${clue3}\nWhat does ${who[2]} have?`;
    if (seen.has(prompt)) continue;
    seen.add(prompt);
    const choices = rng.shuffle(have);
    out.push({
      cat: "logic",
      kind: "choice",
      diff: "hard",
      minutes: 3,
      title: "Tiny logic grid",
      prompt,
      choices,
      correct: choices.indexOf(map[who[2]]),
      why: `${who[1]} has ${have[1]}. ${who[0]} is not ${have[1]} and not ${have[2]}, so ${who[0]} has ${have[0]}. Left for ${who[2]}: ${map[who[2]]}.`,
    });
  }
  return out;
}
