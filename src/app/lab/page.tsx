import type { Metadata } from "next";
import { Suspense } from "react";
import { LabDesk } from "@/components/LabDesk";
import { aiConfigured } from "@/lib/ai-config";

export const metadata: Metadata = {
  title: "Troubleshoot lab",
};

export default function LabPage() {
  return (
    <Suspense fallback={<p className="text-muted">Opening the lab…</p>}>
      <LabDesk aiEnabled={aiConfigured()} />
    </Suspense>
  );
}
