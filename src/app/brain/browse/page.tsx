import type { Metadata } from "next";
import { Suspense } from "react";
import { BrainBrowse } from "@/components/brain/BrainBrowse";

export const metadata: Metadata = {
  title: "Browse Brain Gym",
};

export default function BrainBrowsePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading packs…</p>}>
      <BrainBrowse />
    </Suspense>
  );
}
