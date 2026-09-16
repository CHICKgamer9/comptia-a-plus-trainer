/** Compact seed helper. Unique title/fact/trap/move/extra required. */
export function s(subject, cluster, id, title, fact, trap, move, extra) {
  return {
    subject,
    cluster,
    id,
    title,
    hook: `${title}. ${fact}`,
    fact,
    trap,
    move,
    extra,
  };
}
