export function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed) {
  let s = typeof seed === "number" ? seed >>> 0 : hashSeed(String(seed));
  function next() {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  }
  return {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(list) {
      return list[Math.floor(next() * list.length)];
    },
    shuffle(list) {
      const nextList = [...list];
      for (let i = nextList.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [nextList[i], nextList[j]] = [nextList[j], nextList[i]];
      }
      return nextList;
    },
    chance(p) {
      return next() < p;
    },
  };
}

export function itemId(cat, index) {
  return `b-${cat}-${String(index).padStart(5, "0")}`;
}
