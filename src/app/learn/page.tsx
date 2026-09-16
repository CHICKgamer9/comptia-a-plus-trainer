import type { Metadata } from "next";
import { domains } from "@/content";
import { DomainCatalog } from "@/components/CatalogFilters";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <div>
      <PageHeader
        kicker="Learn"
        title="Nine domains, written like a tech talks"
        description="One solid lesson per A+ domain. Not a dump of official objectives — key concepts, tables you will actually use, and exam cues called out in the margins."
      />
      <DomainCatalog domains={domains} />
    </div>
  );
}
