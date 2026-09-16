"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Difficulty, ExamId, Scenario, ScenarioTheme } from "@/content/types";
import {
  getServerTicketSnapshot,
  getTicketSnapshot,
  parseTicketStore,
  putTicket,
  subscribeTickets,
} from "@/lib/ticket-store";
import { useProgress } from "./ProgressProvider";
import {
  Badge,
  Card,
  DifficultyBadge,
  ExamBadge,
  PageHeader,
  ThemeBadge,
} from "./ui";
import { cn } from "@/lib/cn";

type ExamFilter = ExamId | "surprise";
type ThemeFilter = ScenarioTheme | "surprise";
type DiffFilter = Difficulty | "surprise";

export function LabDesk({ aiEnabled }: { aiEnabled: boolean }) {
  const router = useRouter();
  const search = useSearchParams();
  const { progress } = useProgress();
  const raw = useSyncExternalStore(
    subscribeTickets,
    getTicketSnapshot,
    getServerTicketSnapshot,
  );
  const store = parseTicketStore(raw);
  const [exam, setExam] = useState<ExamFilter>(
    (search.get("exam") as ExamId) || "surprise",
  );
  const [theme, setTheme] = useState<ThemeFilter>(
    (search.get("theme") as ScenarioTheme) || "surprise",
  );
  const [difficulty, setDifficulty] = useState<DiffFilter>("surprise");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [configured, setConfigured] = useState(aiEnabled);
  const cooldown = useRef(0);

  async function generate(forceStub = false) {
    if (busy) return;
    const now = Date.now();
    if (now - cooldown.current < 2500) return;
    cooldown.current = now;
    setBusy(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          theme,
          difficulty,
          forceStub,
        }),
      });
      const data = (await res.json()) as {
        ticket?: Scenario;
        warning?: string;
        error?: string;
        configured?: boolean;
      };
      if (typeof data.configured === "boolean") setConfigured(data.configured);
      if (!res.ok || !data.ticket) {
        setError(data.error || "Could not generate a ticket.");
        return;
      }
      putTicket(data.ticket);
      if (data.warning) setWarning(data.warning);
      router.push(`/lab/t/${data.ticket.id}`);
    } catch {
      setError("Network error. Check your connection and retry.");
    } finally {
      setBusy(false);
    }
  }

  const history = store.order
    .map((id) => store.tickets[id])
    .filter(Boolean) as Scenario[];

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        kicker="Lab"
        title="A new ticket every run"
        description="The model writes a four-beat investigation. You work it one move at a time. Completions feed XP and readiness."
      />

      {configured === false ? (
        <Card className="mb-4 border-warn/30">
          <p className="text-sm leading-6">
            Live AI is not configured here. You can still drill the offline stub, or set{" "}
            <code className="font-mono text-accent">AI_GATEWAY_API_KEY</code> (Vercel AI
            Gateway) so every click is a new ticket. See the README.
          </p>
        </Card>
      ) : null}

      <Card className="mb-6 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-wider text-accent">Generate</p>
        <p className="mt-1 text-lg font-semibold">What kind of puzzle?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <FilterSelect
            label="Exam"
            value={exam}
            onChange={(value) => setExam(value as ExamFilter)}
            options={[
              ["surprise", "Surprise me"],
              ["220-1101", "Core 1"],
              ["220-1102", "Core 2"],
            ]}
          />
          <FilterSelect
            label="Theme"
            value={theme}
            onChange={(value) => setTheme(value as ThemeFilter)}
            options={[
              ["surprise", "Surprise me"],
              ["hardware", "Hardware"],
              ["network", "Network"],
              ["os", "OS"],
              ["security", "Security"],
              ["printer", "Printer"],
              ["mobile", "Mobile"],
            ]}
          />
          <FilterSelect
            label="Difficulty"
            value={difficulty}
            onChange={(value) => setDifficulty(value as DiffFilter)}
            options={[
              ["surprise", "Surprise me"],
              ["easy", "Easy"],
              ["medium", "Medium"],
              ["hard", "Hard"],
            ]}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => generate()}
            className={cn(
              "rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-background",
              busy && "opacity-60",
            )}
          >
            {busy ? "Writing a ticket…" : "Generate ticket"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => generate(true)}
            className="rounded-2xl border border-border px-5 py-3 text-sm hover:bg-surface-2"
          >
            Use practice stub
          </button>
        </div>
        {busy ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-accent/20 bg-accent-dim/30 px-4 py-3">
            <p className="text-sm text-accent">Building gather → tools → cause → fix…</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/40">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
            </div>
          </div>
        ) : null}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {warning ? <p className="mt-3 text-sm text-warn">{warning}</p> : null}
        <p className="mt-4 text-xs leading-5 text-muted">
          AI-generated tickets are study aids, not official CompTIA items. Treat odd
          details as a chance to sanity-check against the lessons.
        </p>
      </Card>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">
        Recent tickets on this device
      </h2>
      {history.length === 0 ? (
        <Card>
          <p className="font-medium">Queue is empty</p>
          <p className="mt-2 text-sm text-muted">
            Generate a ticket to start the lab. Scores stick after refresh.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {history.map((ticket) => {
            const best = progress.scenarioScores[ticket.id];
            return (
              <Link
                key={ticket.id}
                href={`/lab/t/${ticket.id}`}
                className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-warn">{ticket.ticketId}</span>
                  <ExamBadge exam={ticket.exam} />
                  <ThemeBadge theme={ticket.theme} />
                  <DifficultyBadge level={ticket.difficulty} />
                  {ticket.source === "fallback" ? (
                    <Badge tone="warn">Stub</Badge>
                  ) : (
                    <Badge tone="accent">AI</Badge>
                  )}
                  {best ? (
                    <Badge tone={best.score === best.total ? "ok" : "warn"}>
                      {best.score}/{best.total}
                    </Badge>
                  ) : (
                    <Badge tone="muted">Open</Badge>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{ticket.title}</h3>
                <p className="mt-2 text-sm text-muted">{ticket.summary}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-foreground"
      >
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
