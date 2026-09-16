import { makeRng } from "./rng.mjs";
import { W4 } from "./lexicon4.mjs";
import { W5 } from "./lexicon5.mjs";

function clueMap(pairs) {
  const map = new Map();
  for (const [word, clue] of pairs) {
    if (!map.has(word)) map.set(word, clue);
  }
  return map;
}

const C4 = clueMap(W4);
const C5 = clueMap(W5);
const WORDS4 = [...C4.keys()];
const WORDS5 = [...C5.keys()];

function slot(n, clue, r, c, len) {
  return { n, clue, r, c, len };
}

function gridFromRows(rows) {
  return rows.join("");
}

export function buildWordSquares(target, seed) {
  const rng = makeRng(seed);
  const byPref = new Map();
  for (const word of WORDS4) {
    for (let i = 1; i <= 4; i += 1) {
      const pref = word.slice(0, i);
      const list = byPref.get(pref) ?? [];
      list.push(word);
      byPref.set(pref, list);
    }
  }
  const starts = rng.shuffle(WORDS4);
  const out = [];
  const seen = new Set();

  for (const row0 of starts) {
    if (out.length >= target) break;
    const row1s = byPref.get(row0[1]) ?? [];
    for (const row1 of rng.shuffle(row1s).slice(0, 12)) {
      const p0 = row0[0] + row1[0];
      const p1 = row0[1] + row1[1];
      if (!(byPref.get(p0)?.length) || !(byPref.get(p1)?.length)) continue;
      const row2s = (byPref.get(row0[2]) ?? []).filter((w) => (byPref.get(p0 + w[0]) ?? []).length);
      for (const row2 of rng.shuffle(row2s).slice(0, 10)) {
        const q0 = p0 + row2[0];
        const q1 = p1 + row2[1];
        const q2 = row0[2] + row1[2] + row2[2];
        if (!(byPref.get(q0)?.length) || !(byPref.get(q2)?.length)) continue;
        const row3s = (byPref.get(row0[3]) ?? []).filter((w) => {
          const d0 = q0 + w[0];
          const d1 = q1 + w[1];
          const d2 = q2 + w[2];
          const d3 = row0[3] + row1[3] + row2[3] + w[3];
          return C4.has(d0) && C4.has(d1) && C4.has(d2) && C4.has(d3);
        });
        for (const row3 of rng.shuffle(row3s).slice(0, 6)) {
          const rows = [row0, row1, row2, row3];
          const cols = [0, 1, 2, 3].map((c) => rows.map((r) => r[c]).join(""));
          const key = rows.join("|");
          if (seen.has(key)) continue;
          seen.add(key);
          const across = rows.map((word, i) =>
            slot(i + 1, C4.get(word) || word, i, 0, 4),
          );
          const down = cols.map((word, i) =>
            slot(i + 1, C4.get(word) || word, 0, i, 4),
          );
          out.push({
            cat: "crossword",
            kind: "crossword",
            diff: "medium",
            minutes: 5,
            title: "4×4 word square",
            prompt: "Fill the 4×4. Across and down are all real words.",
            why: `Across: ${rows.join(", ")}. Down: ${cols.join(", ")}.`,
            size: 4,
            grid: gridFromRows(rows),
            across,
            down,
          });
          if (out.length >= target) break;
        }
        if (out.length >= target) break;
      }
      if (out.length >= target) break;
    }
  }
  return out;
}

export function buildLatticeMinis(target, seed) {
  const rng = makeRng(seed);
  const byMask = new Map();
  for (const word of WORDS5) {
    const mask = `${word[0]}.${word[2]}.${word[4]}`;
    const list = byMask.get(mask) ?? [];
    list.push(word);
    byMask.set(mask, list);
  }
  const out = [];
  const seen = new Set();
  const downs = rng.shuffle(WORDS5);
  const n = downs.length;
  outer: for (let i = 0; i < n; i += 1) {
    const D0 = downs[i];
    for (let j = 0; j < Math.min(n, 48); j += 1) {
      const D1 = downs[(i + j + 1) % n];
      if (D1 === D0) continue;
      for (let k = 0; k < 20; k += 1) {
        const D2 = downs[(i * 11 + j * 5 + k * 3 + 2) % n];
        if (D2 === D0 || D2 === D1) continue;
        const A0s = byMask.get(`${D0[0]}.${D1[0]}.${D2[0]}`);
        const A1s = byMask.get(`${D0[2]}.${D1[2]}.${D2[2]}`);
        const A2s = byMask.get(`${D0[4]}.${D1[4]}.${D2[4]}`);
        if (!A0s || !A1s || !A2s) continue;
        const A0 = rng.pick(A0s);
        const A1 = rng.pick(A1s);
        const A2 = rng.pick(A2s);
        const rows = [
          A0,
          `${D0[1]}.${D1[1]}.${D2[1]}`,
          A1,
          `${D0[3]}.${D1[3]}.${D2[3]}`,
          A2,
        ];
        const key = rows.join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          cat: "crossword",
          kind: "crossword",
          diff: rng.chance(0.35) ? "hard" : "medium",
          minutes: 6,
          title: "Mini lattice crossword",
          prompt: "5×5 mini. Three across, three down. Black squares are blocked.",
          why: `Across ${A0}, ${A1}, ${A2}. Down ${D0}, ${D1}, ${D2}.`,
          size: 5,
          grid: gridFromRows(rows),
          across: [
            slot(1, C5.get(A0) || A0, 0, 0, 5),
            slot(4, C5.get(A1) || A1, 2, 0, 5),
            slot(5, C5.get(A2) || A2, 4, 0, 5),
          ],
          down: [
            slot(1, C5.get(D0) || D0, 0, 0, 5),
            slot(2, C5.get(D1) || D1, 0, 2, 5),
            slot(3, C5.get(D2) || D2, 0, 4, 5),
          ],
        });
        if (out.length >= target) break outer;
      }
    }
  }
  return out;
}

function neighbors(words) {
  const list = [...words];
  const map = new Map(list.map((w) => [w, []]));
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i];
      const b = list[j];
      let d = 0;
      for (let k = 0; k < a.length; k += 1) {
        if (a[k] !== b[k]) d += 1;
        if (d > 1) break;
      }
      if (d === 1) {
        map.get(a).push(b);
        map.get(b).push(a);
      }
    }
  }
  return map;
}

export function buildLadders(target, seed) {
  const rng = makeRng(seed);
  const graph = neighbors(WORDS4);
  const out = [];
  const seen = new Set();
  const starts = rng.shuffle(WORDS4);
  for (const start of starts) {
    if (out.length >= target) break;
    const dist = new Map([[start, [start]]]);
    const q = [start];
    while (q.length) {
      const cur = q.shift();
      const path = dist.get(cur);
      if (path.length >= 5) continue;
      for (const nxt of graph.get(cur) ?? []) {
        if (dist.has(nxt)) continue;
        const nextPath = [...path, nxt];
        dist.set(nxt, nextPath);
        q.push(nxt);
        if (nextPath.length >= 4 && nextPath.length <= 5) {
          const key = nextPath.join(">");
          if (seen.has(key) || seen.has([...nextPath].reverse().join(">"))) continue;
          seen.add(key);
          const missingAt = rng.int(1, nextPath.length - 2);
          const blanked = nextPath.map((w, i) => (i === missingAt ? "____" : w));
          const distractors = rng
            .shuffle((graph.get(nextPath[missingAt - 1]) ?? WORDS4).filter((w) => w !== nextPath[missingAt]))
            .slice(0, 3);
          const choices = rng.shuffle([nextPath[missingAt], ...distractors]);
          out.push({
            cat: "words",
            kind: "ladder",
            diff: nextPath.length >= 5 ? "hard" : "medium",
            minutes: 2,
            title: "Word ladder",
            prompt: `Change one letter at a time: ${blanked.join(" → ")}. What belongs in the blank?`,
            choices,
            correct: choices.indexOf(nextPath[missingAt]),
            why: `Path: ${nextPath.join(" → ")}. Each step changes exactly one letter.`,
            start: start,
            goal: nextPath[nextPath.length - 1],
            items: nextPath,
            answer: nextPath[missingAt],
          });
          if (out.length >= target) break;
        }
      }
      if (out.length >= target) break;
    }
  }
  return out;
}

export { C4, C5, WORDS4, WORDS5 };
