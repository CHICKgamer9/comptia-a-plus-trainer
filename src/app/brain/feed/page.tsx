import type { Metadata } from "next";
import { BrainFeed } from "@/components/brain/BrainFeed";

export const metadata: Metadata = {
  title: "Phone feed",
  description: "Vertical Brain Gym cards — a short-form scroll of real challenges instead of empty feeds.",
};

export default function BrainFeedPage() {
  return <BrainFeed />;
}
