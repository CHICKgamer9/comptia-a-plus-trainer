import type { Metadata } from "next";
import { domains, quizzes } from "@/content";
import { QuizCatalog } from "@/components/CatalogFilters";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Quizzes",
};

export default function PracticePage() {
  return (
    <div>
      <PageHeader
        kicker="Practice"
        title="Exam-style questions with the why"
        description="Ten items per domain. Pick an answer, then read why it is right or wrong before you move on. Best score is kept on this device."
      />
      <QuizCatalog quizzes={quizzes} domains={domains} />
    </div>
  );
}
