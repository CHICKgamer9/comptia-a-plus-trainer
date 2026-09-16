import type { Metadata } from "next";
import { BrainHistory } from "@/components/brain/BrainHistory";

export const metadata: Metadata = {
  title: "Brain Gym history",
};

export default function BrainHistoryPage() {
  return <BrainHistory />;
}
