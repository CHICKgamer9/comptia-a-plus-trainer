"use client";

import { useEffect, useState } from "react";
import { getBenchCard } from "@/content/bench-cards";
import { useProgress } from "../ProgressProvider";
import { TicketCard } from "./TicketCard";

export function DropCeremony() {
  const { bench, acknowledgePrint } = useProgress();
  const pending = bench.pendingPrints?.[0];
  const [phase, setPhase] = useState<"idle" | "slide" | "stamp" | "ink" | "draw" | "ready">("idle");

  useEffect(() => {
    if (!pending) {
      setPhase("idle");
      return;
    }
    setPhase("slide");
    const timers = [
      window.setTimeout(() => setPhase("stamp"), 420),
      window.setTimeout(() => setPhase("ink"), 820),
      window.setTimeout(() => setPhase("draw"), 1180),
      window.setTimeout(() => setPhase("ready"), 1680),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [pending?.cardId, pending?.printIndex, pending?.source]);

  if (!pending) return null;
  const card = getBenchCard(pending.cardId);
  if (!card) return null;
  const owned = bench.owned.find((row) => row.cardId === pending.cardId);

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
      <div className={`drop-ticket is-${phase} ${pending.dust ? "is-dust" : ""}`}>
        {phase === "slide" ? (
          <div className="drop-blank" />
        ) : (
          <TicketCard
            card={card}
            owned={owned}
            size="hero"
            draw={phase === "draw" || phase === "ready"}
            interactive={phase === "ready"}
            showBack={false}
          />
        )}
        {pending.dust ? <div className="drop-dust-stamp">DUST</div> : null}
      </div>
      <button
        type="button"
        className="drop-slot"
        disabled={phase !== "ready"}
        onClick={() => acknowledgePrint()}
      >
        Slot in binder
      </button>
    </div>
  );
}
