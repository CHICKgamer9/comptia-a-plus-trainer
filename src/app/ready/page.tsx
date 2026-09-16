import type { Metadata } from "next";
import { ReadyView } from "@/components/ReadyView";

export const metadata: Metadata = {
  title: "Exam readiness",
};

export default function ReadyPage() {
  return <ReadyView />;
}
