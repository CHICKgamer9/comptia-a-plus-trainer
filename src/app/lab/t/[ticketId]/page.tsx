import type { Metadata } from "next";
import { PlayTicket } from "@/components/PlayTicket";

export const metadata: Metadata = {
  title: "Ticket",
};

export default function TicketPlayPage() {
  return <PlayTicket />;
}
