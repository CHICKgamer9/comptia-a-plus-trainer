import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TicketBench",
    short_name: "TicketBench",
    description:
      "Interactive paths for CompTIA A+ and a shelf of school subjects. Not affiliated with CompTIA, Brilliant, or Duolingo.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090d",
    theme_color: "#07090d",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
