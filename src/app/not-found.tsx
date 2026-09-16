import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <EmptyState
      title="That page is not in the queue"
      body="The lesson, quiz, or ticket id may be wrong. Head back to the desk and pick another item."
    >
      <Link
        href="/"
        className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
      >
        Back to the dashboard
      </Link>
    </EmptyState>
  );
}
