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
  putTicket,
  subscribeTickets,
} from "@/lib/ticket-store";
import { SEEDED_TICKET_ID, seededTicket } from "@/lib/ticket-fallback";

export function PlayTicket() {
  const params = useParams<{ ticketId: string }>();
  useSyncExternalStore(subscribeTickets, getTicketSnapshot, getServerTicketSnapshot);
  let ticket = params.ticketId ? getStoredTicket(params.ticketId) : undefined;
  if (!ticket && params.ticketId === SEEDED_TICKET_ID) {
    ticket = seededTicket();
    putTicket(ticket);
  }

  if (!ticket) {
    return (
      <EmptyState
        title="That ticket is not here"
        body="If you opened a generated ticket from another browser, generate a new one in Tech Lab."
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
      <Link href="/lab" className="mb-4 hidden text-sm text-muted hover:text-foreground md:inline-block">
        ← Ticket queue
      </Link>
      <ScenarioRunner scenario={ticket} />
    </div>
  );
}
