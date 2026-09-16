import type { Metadata } from "next";
import { BinderView } from "@/components/BinderView";

export const metadata: Metadata = {
  title: "Binder",
};

export default function BinderPage() {
  return <BinderView />;
}
