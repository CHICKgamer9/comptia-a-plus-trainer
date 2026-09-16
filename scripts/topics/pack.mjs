import { s } from "./s.mjs";

export function pack(subject, rows) {
  return rows.map(([id, cluster, title, fact, trap, move, extra]) =>
    s(subject, cluster, id, title, fact, trap, move, extra),
  );
}
