"use client";

import { useEffect, useState } from "react";
import { getBenchCard } from "@/content/bench-cards";
import { useProgress } from "../ProgressProvider";
import { TicketCard } from "./TicketCard";

export function DropCeremony() {
  const { bench, acknowledgePrint } = useProgress();
  const pending = bench.pendingPrints?.[0];
  const printKey = pending ? `${pending.cardId}:${pending.printIndex}:${pending.source}` : "";
  const [readyKey, setReadyKey] = useState("");

  useEffect(() => {
    if (!printKey) return;
    const timer = window.setTimeout(() => setReadyKey(printKey), 1680);
    return () => window.clearTimeout(timer);
  }, [printKey]);

  if (!pending) return null;
  const card = getBenchCard(pending.cardId);
  if (!card) return null;
  const owned = bench.owned.find((row) => row.cardId === pending.cardId);
  const ready = readyKey === printKey;

  return (
    <div className="drop-ceremony" role="dialog" aria-label="Ticket printed">
      <div className="drop-bench" />
      <div className="drop-printer">
        <div className="drop-printer-mouth">
          <span />
          <span />
          <span />
        </div>
        <p className="drop-printer-label">THERMAL · TICKETBENCH</p>
      </div>
      <div className={`drop-ticket is-ready ${pending.dust ? "is-dust" : ""}`}>
        <TicketCard
          card={card}
          owned={owned}
          size="hero"
          draw
          interactive={ready}
          showBack={false}
        />
        {pending.dust ? <div className="drop-dust-stamp">DUST</div> : null}
      </div>
      <button
        type="button"
        className="drop-slot"
        disabled={!ready}
        onClick={() => acknowledgePrint()}
      >
        Slot in binder
      </button>
    </div>
  );
}
