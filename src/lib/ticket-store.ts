import type { Scenario } from "@/content/types";

export const TICKET_STORE_KEY = "ticketbench-tickets-v1";
const MAX_TICKETS = 24;

export interface TicketStore {
  tickets: Record<string, Scenario>;
  order: string[];
}

const listeners = new Set<() => void>();

export function emptyTicketStore(): TicketStore {
  return { tickets: {}, order: [] };
}

export function parseTicketStore(raw: string): TicketStore {
  if (!raw) return emptyTicketStore();
  try {
    const parsed = JSON.parse(raw) as TicketStore;
    return {
      tickets: parsed.tickets ?? {},
      order: Array.isArray(parsed.order) ? parsed.order : [],
    };
  } catch {
    return emptyTicketStore();
  }
}

export function loadTicketStore(): TicketStore {
  if (typeof window === "undefined") return emptyTicketStore();
  return parseTicketStore(window.localStorage.getItem(TICKET_STORE_KEY) ?? "");
}

export function saveTicketStore(store: TicketStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TICKET_STORE_KEY, JSON.stringify(store));
  listeners.forEach((listener) => listener());
}

export function putTicket(ticket: Scenario) {
  const store = loadTicketStore();
  const order = [ticket.id, ...store.order.filter((id) => id !== ticket.id)].slice(
    0,
    MAX_TICKETS,
  );
  const tickets: Record<string, Scenario> = { [ticket.id]: ticket };
  order.forEach((id) => {
    if (id === ticket.id) return;
    if (store.tickets[id]) tickets[id] = store.tickets[id];
  });
  saveTicketStore({ tickets, order });
}

export function getStoredTicket(id: string): Scenario | undefined {
  return loadTicketStore().tickets[id];
}

export function subscribeTickets(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTicketSnapshot() {
  return window.localStorage.getItem(TICKET_STORE_KEY) ?? "";
}

export function getServerTicketSnapshot() {
  return "";
}

export function clearTickets() {
  saveTicketStore(emptyTicketStore());
}
