"use client";

import Link from "next/link";
import { useProgress } from "./ProgressProvider";
import { Badge, Card, ExamBadge } from "./ui";
import type { Domain, Lesson } from "@/content/types";
import { labThemeForDomain } from "@/content";
import { cn } from "@/lib/cn";

export function LessonView({
  domain,
  lesson,
}: {
  domain: Domain;
  lesson: Lesson;
}) {
  const { lessonDone, markLessonComplete } = useProgress();
  const done = lessonDone(lesson.id);

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <ExamBadge exam={domain.exam} />
        <Badge tone="muted">{lesson.minutes} min read</Badge>
        {done ? <Badge tone="ok">Completed</Badge> : null}
      </div>
      <p className="text-lg leading-8 text-foreground/90">{lesson.intro}</p>

      {lesson.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-[15px] leading-7 text-foreground/85">
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-7 text-foreground/85">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    {section.table.headers.map((header) => (
                      <th key={header} className="px-3 py-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, index) => (
                    <tr key={row.join("|")} className={index % 2 ? "bg-surface-2/40" : ""}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cell}-${cellIndex}`}
                          className={cn(
                            "px-3 py-2 align-top leading-6",
                            cellIndex === 0 && "font-mono text-[13px] text-accent",
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {section.callout ? (
            <div
              className={cn(
                "rounded-xl border px-4 py-3 text-sm leading-6",
                section.callout.type === "exam" &&
                  "border-accent/30 bg-accent-dim/60 text-foreground/90",
                section.callout.type === "tip" &&
                  "border-ok/30 bg-ok/10 text-foreground/90",
                section.callout.type === "watch" &&
                  "border-warn/30 bg-warn/10 text-foreground/90",
              )}
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                {section.callout.type === "exam"
                  ? "Exam cue"
                  : section.callout.type === "tip"
                    ? "Field tip"
                    : "Watch out"}
              </p>
              {section.callout.text}
            </div>
          ) : null}
        </section>
      ))}

      <Card className="bg-surface-2/50">
        <h2 className="text-lg font-semibold">Key takeaways</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-7">
          {lesson.keyTakeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => markLessonComplete(lesson.id)}
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
            done
              ? "border border-ok/40 bg-ok/10 text-ok"
              : "bg-accent text-background hover:brightness-110",
          )}
        >
          {done ? "Lesson marked complete" : "Mark lesson complete (+80 XP)"}
        </button>
        <Link
          href={`/practice/${domain.quizId}`}
          className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
        >
          Take the {domain.title} quiz
        </Link>
        <Link
          href={`/lab?exam=${domain.exam}&theme=${labThemeForDomain(domain.id)}`}
          className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
        >
          Generate a {domain.title} ticket
        </Link>
      </div>
    </article>
  );
}
