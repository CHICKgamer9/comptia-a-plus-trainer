import type { Metadata } from "next";
import { LingoHub } from "@/components/lingo/LingoHub";

export const metadata: Metadata = {
  title: "Languages",
};

export default function LingoPage() {
  return <LingoHub />;
}
