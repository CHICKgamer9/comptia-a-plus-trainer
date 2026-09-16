import { getBadge } from "./badges";

export interface ToastEvent {
  id: string;
  kind: "level" | "badge" | "card";
  title: string;
  body: string;
  cardId?: string;
  rarity?: string;
  cardType?: string;
}

const listeners = new Set<() => void>();
let queue: ToastEvent[] = [];

export function enqueueToasts(events: ToastEvent[]) {
  const resolved = events.map((event) => {
    if (event.kind !== "badge") return event;
    const badge = getBadge(event.body);
    return badge
      ? { ...event, title: badge.title, body: badge.blurb }
      : event;
  });
  queue = [...queue, ...resolved];
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: string) {
  queue = queue.filter((event) => event.id !== id);
  listeners.forEach((listener) => listener());
}

export function dismissAllToasts() {
  queue = [];
  listeners.forEach((listener) => listener());
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const EMPTY_TOASTS: ToastEvent[] = [];

export function getToastSnapshot() {
  return queue;
}

export function getServerToastSnapshot(): ToastEvent[] {
  return EMPTY_TOASTS;
}
