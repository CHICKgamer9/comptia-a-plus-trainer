"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ScenarioRunner } from "./ScenarioRunner";
import { EmptyState } from "./ui";
import {
  getServerTicketSnapshot,
  getStoredTicket,
  getTicketSnapshot,
  subscribeTickets,
} from "@/lib/ticket-store";

export function PlayTicket() {
  const params = useParams<{ ticketId: string }>();
  useSyncExternalStore(subscribeTickets, getTicketSnapshot, getServerTicketSnapshot);
  const ticket = params.ticketId ? getStoredTicket(params.ticketId) : undefined;

  if (!ticket) {
    return (
      <EmptyState
        title="That ticket is not on this device"
        body="Generated tickets live in localStorage. If you opened a link from another browser, generate a new one."
      >
        <Link
          href="/lab"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-background"
        >
          Back to the lab
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <Link href="/lab" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
        ← Ticket queue
      </Link>
      <ScenarioRunner scenario={ticket} />
    </div>
  );
}
