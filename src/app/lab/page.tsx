import type { Metadata } from "next";
import { scenarios } from "@/content";
import { ScenarioCatalog } from "@/components/CatalogFilters";
import { PageHeader } from "@/components/ui";
import { RandomTicketLink } from "@/components/ContinueLink";

export const metadata: Metadata = {
  title: "Troubleshoot lab",
};

export default function LabPage() {
  return (
    <div>
      <PageHeader
        kicker="Lab"
        title="Helpdesk tickets, not one-shot trivia"
        description="Sixteen scenarios. Each one walks gather → tools → cause → fix. You get scored on the first pick at every step, then told why it was right or wrong."
        actions={
          <RandomTicketLink className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background">
            Random ticket
          </RandomTicketLink>
        }
      />
      <ScenarioCatalog scenarios={scenarios} />
    </div>
  );
}
