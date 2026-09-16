import type { Metadata } from "next";
import { BrainPlayScreen } from "@/components/brain/BrainPlayScreen";

export const metadata: Metadata = {
  title: "Brain Gym play",
};

export default async function BrainPlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrainPlayScreen key={id} id={id} />;
}
