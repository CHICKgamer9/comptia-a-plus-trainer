import type { Metadata } from "next";
import { domains, quizzes } from "@/content";
import { QuizCatalog } from "@/components/CatalogFilters";

export const metadata: Metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Practice
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">One problem at a time</h1>
      <p className="mx-auto mt-3 mb-8 max-w-md text-center text-sm leading-6 text-muted">
        Practice mode explains immediately. Exam drill waits until the end. Same questions, less
        form-filling.
      </p>
      <QuizCatalog quizzes={quizzes} domains={domains} />
    </div>
  );
}
