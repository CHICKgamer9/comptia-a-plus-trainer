"use client";

import type { ContentFigure } from "@/content/types";
import { TeachDiagram } from "./teach-diagrams";

function youtubeId(src: string) {
  try {
    const url = new URL(src);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
    if (url.hostname.includes("youtube")) {
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2];
      return url.searchParams.get("v") ?? undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function vimeoId(src: string) {
  try {
    const url = new URL(src);
    if (!url.hostname.includes("vimeo.com")) return undefined;
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0] === "video" ? parts[1] : parts[0];
  } catch {
    return undefined;
  }
}

function VideoEmbed({ src, title }: { src: string; title: string }) {
  const yt = youtubeId(src);
  const vimeo = vimeoId(src);
  const embed = yt
    ? `https://www.youtube-nocookie.com/embed/${yt}?rel=0`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo}`
      : undefined;
  if (!embed) {
    return (
      <p className="rounded-xl border border-border px-3 py-4 text-sm text-muted">
        Video URL was not a YouTube or Vimeo link. Caption still stands.
      </p>
    );
  }
  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-background">
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-full w-full border-0"
      />
    </div>
  );
}

export function TeachFigure({ figure }: { figure: ContentFigure }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface-2/40">
      <div className="max-h-[40vh] overflow-auto px-3 pt-3 text-accent touch-pinch-zoom md:max-h-none sm:px-4 sm:pt-4">
        {figure.kind === "diagram" && figure.diagram ? (
          <TeachDiagram id={figure.diagram} alt={figure.alt} />
        ) : null}
        {figure.kind === "image" && figure.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- captions + arbitrary /figures paths; lazy by default
          <img
            src={figure.src}
            alt={figure.alt}
            loading="lazy"
            decoding="async"
            className="mx-auto max-h-[40vh] w-full object-contain md:max-h-64"
          />
        ) : null}
        {figure.kind === "video" && figure.src ? (
          <VideoEmbed src={figure.src} title={figure.alt} />
        ) : null}
      </div>
      <figcaption className="px-4 py-3 text-sm leading-6 text-muted">
        {figure.caption}
        {figure.credit ? (
          <span className="mt-1 block text-[11px] text-muted/80">{figure.credit}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
