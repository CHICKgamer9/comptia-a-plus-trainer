import type { Metadata } from "next";
import { Suspense } from "react";
import { BinderView } from "@/components/BinderView";

export const metadata: Metadata = {
  title: "Binder",
};

export default function BinderPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Opening the Binder…</p>}>
      <BinderView />
    </Suspense>
  );
}
