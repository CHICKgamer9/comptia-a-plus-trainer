import type { ContentFigure, TeachDiagramId } from "./types";

export function diagramFigure(
  diagram: TeachDiagramId,
  alt: string,
  caption: string,
  credit?: string,
): ContentFigure {
  return { kind: "diagram", diagram, alt, caption, credit };
}

export function imageFigure(src: string, alt: string, caption: string, credit?: string): ContentFigure {
  return { kind: "image", src, alt, caption, credit };
}

export function videoFigure(src: string, alt: string, caption: string, credit?: string): ContentFigure {
  return { kind: "video", src, alt, caption, credit };
}

/** Map a Learn cluster (or subject) to a reusable teaching diagram. */
export function diagramForCluster(cluster?: string, subject?: string): TeachDiagramId {
  const key = `${subject ?? ""}:${cluster ?? ""}`.toLowerCase();
  if (key.includes("core 1") || key.includes("hardware")) return "rear-io";
  if (key.includes("network")) return "soho-topo";
  if (key.includes("security") || key.includes("privacy")) return "privacy-stack";
  if (key.includes("number") || key.includes("fraction") || key.includes("algebra")) return "number-line";
  if (key.includes("geometry")) return "room-scale";
  if (key.includes("life") || key.includes("eco") || key.includes("living")) return "food-web";
  if (key.includes("matter") || key.includes("atom")) return "atom";
  if (key.includes("code") || key.includes("web")) return "timer-wire";
  if (key.includes("music") || key.includes("beat")) return "four-bar";
  if (key.includes("logic") || key.includes("argu")) return "claim-test";
  if (key.includes("money") || key.includes("business") || key.includes("cash")) return "cash-flow";
  if (key.includes("map") || key.includes("geo") || key.includes("place")) return "suburb-map";
  if (key.includes("os") || key.includes("window")) return "window";
  return "prism";
}
