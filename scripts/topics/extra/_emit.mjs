/** Format volume files from compact rows. */
import { writeFileSync } from "node:fs";

export function emit(name, exportName, subject, rows) {
  if (rows.length !== 96 && !(subject === "tech" && rows.length === 100)) {
    throw new Error(`${name} expected 96, got ${rows.length}`);
  }
  const body = rows
    .map(
      ([id, cluster, title, fact, trap, move, extra]) =>
        `  [${j(id)}, ${j(cluster)}, ${j(title)},\n    ${j(fact)},\n    ${j(trap)},\n    ${j(move)},\n    ${j(extra)}],`,
    )
    .join("\n");
  const src = `import { pack } from "../pack.mjs";\n\nexport const ${exportName} = pack(${j(subject)}, [\n${body}\n]);\n`;
  writeFileSync(new URL(`./${name}.mjs`, import.meta.url), src);
  console.log("wrote", name, rows.length);
}

function j(s) {
  return JSON.stringify(s);
}

export function row(id, cluster, title, fact, trap, move, extra) {
  for (const [k, v] of Object.entries({ id, cluster, title, fact, trap, move, extra })) {
    if (!v || String(v).length < 8) throw new Error(`short ${k} in ${id}`);
  }
  return [id, cluster, title, fact, trap, move, extra];
}
