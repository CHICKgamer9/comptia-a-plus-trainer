import type { Metadata } from "next";
import { PbqRunner } from "@/components/PbqRunner";

export const metadata: Metadata = {
  title: "PBQ",
};

export default function PbqPage() {
  return (
    <div>
      <p className="mx-auto mb-6 max-w-xl text-sm text-muted">
        Performance tasks: match ports, order steps, pick parts, place FRUs. Study aid, not an official item.
      </p>
      <PbqRunner />
    </div>
  );
}
