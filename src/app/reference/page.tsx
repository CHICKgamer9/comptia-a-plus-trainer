import type { Metadata } from "next";
import Link from "next/link";
import { cheatsheets } from "@/content";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Quick reference",
};

export default function ReferencePage() {
  return (
    <div>
      <PageHeader
        kicker="Reference"
        title="Ports, RAID, tools — without the scroll"
        description="The tables you want open in a second monitor while you work a quiz or a ticket."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {cheatsheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/reference/${sheet.id}`}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
          >
            <h2 className="text-lg font-semibold">{sheet.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{sheet.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
