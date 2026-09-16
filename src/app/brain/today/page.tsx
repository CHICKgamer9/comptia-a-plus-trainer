import type { Metadata } from "next";
import { BrainToday } from "@/components/brain/BrainToday";

export const metadata: Metadata = {
  title: "Today’s Brain Gym",
};

export default function BrainTodayPage() {
  return <BrainToday />;
}
