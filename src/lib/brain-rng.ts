export function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed: string | number) {
  let s = typeof seed === "number" ? seed >>> 0 : hashSeed(String(seed));
  function next() {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  }
  return {
    next,
    int(min: number, max: number) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick<T>(list: T[]) {
      return list[Math.floor(next() * list.length)] as T;
    },
    shuffle<T>(list: T[]) {
      const nextList = [...list];
      for (let i = nextList.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [nextList[i], nextList[j]] = [nextList[j], nextList[i]];
      }
      return nextList;
    },
  };
}

export function itemId(cat: string, index: number) {
  return `b-${cat}-${String(index).padStart(5, "0")}`;
}

export function parseBrainId(id: string): { cat: string; index: number } | null {
  const match = /^b-([a-z]+)-(\d+)$/.exec(id);
  if (!match) return null;
  return { cat: match[1], index: Number(match[2]) };
}
