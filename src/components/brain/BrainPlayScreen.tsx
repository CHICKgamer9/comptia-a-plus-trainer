"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useProgress } from "../ProgressProvider";
import { BrainPlayer } from "./BrainPlayer";
import { loadBrainItem } from "@/content/brain/load";
import type { BrainItem } from "@/content/brain/types";
import { DAILY_TARGET_MINUTES } from "@/content/brain/types";
import { dayRecord, nextUnanswered } from "@/lib/brain-daily";
import { sydneyDate } from "@/lib/sydney-date";
import { EmptyState } from "../ui";

export function BrainPlayScreen({ id }: { id: string }) {
  const { progress, recordBrainAnswer } = useProgress();
  const recorded = useRef(false);
  const [item, setItem] = useState<BrainItem | null | undefined>(undefined);
  const ymd = sydneyDate();
  const day = useMemo(
    () => dayRecord(ymd, progress.brain),
    [ymd, progress.brain],
  );
  const answered = useMemo(() => new Set(day.answered), [day.answered]);
  const minutesLeft = Math.max(0, day.minutesTarget - day.minutesDone);
  const nextId = nextUnanswered(day.ids.filter((entry) => entry !== id), answered) ??
    nextUnanswered(day.ids, answered);

  useEffect(() => {
    recorded.current = false;
    let alive = true;
    loadBrainItem(id).then((found) => {
      if (alive) setItem(found);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (item === undefined) {
    return <p className="text-sm text-muted">Loading challenge…</p>;
  }
  if (!item) {
    return (
      <EmptyState title="Missing challenge" body="That Brain Gym id is not in the packs.">
        <Link href="/brain" className="text-sm text-accent">
          Back to Brain Gym
        </Link>
      </EmptyState>
    );
  }

  const inToday = day.ids.includes(id);
  const nextHref = nextId && nextId !== id ? `/brain/play/${nextId}` : "/brain/today";

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-xl items-center justify-between gap-3">
        <Link href={inToday ? "/brain/today" : "/brain/browse"} className="text-sm text-muted hover:text-foreground">
          ← {inToday ? "Today" : "Browse"}
        </Link>
        <Link href="/brain" className="text-sm text-muted hover:text-foreground">
          Hub
        </Link>
      </div>
      <BrainPlayer
        item={item}
        kicker={inToday ? `Daily · ${ymd}` : "Brain Gym"}
        minutesLeft={inToday ? minutesLeft : undefined}
        minutesTarget={inToday ? DAILY_TARGET_MINUTES : undefined}
        nextHref={nextHref}
        nextLabel={nextId && nextId !== id ? "Next in playlist" : "Today’s desk"}
        onResolved={(correct, _spoken, penalty, skipped) => {
          if (recorded.current) return;
          recorded.current = true;
          recordBrainAnswer({
            id: item.id,
            ymd,
            playlistIds: day.ids,
            minutes: item.minutes,
            minutesTarget: DAILY_TARGET_MINUTES,
            correct,
            skipped,
            penalty: penalty ? -penalty : 0,
            crossword: item.kind === "crossword",
            cat: item.cat,
          });
        }}
      />
    </div>
  );
}
