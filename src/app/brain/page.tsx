import type { Metadata } from "next";
import { BrainHub } from "@/components/brain/BrainHub";

export const metadata: Metadata = {
  title: "Brain Gym",
};

export default function BrainPage() {
  return <BrainHub />;
}
