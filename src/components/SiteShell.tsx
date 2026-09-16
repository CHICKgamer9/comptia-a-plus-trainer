"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Disclaimer } from "./ui";
import { StatusChip } from "./StatusChip";
import { DeskShiftChip } from "./DeskShiftChip";
import { getSubject, isSubjectId } from "@/content/registry";
import { getProject } from "@/content/projects";
import { BRAIN_ACCENT, BRAIN_ACCENT_DIM } from "@/content/brain/types";
import { LINGO_ACCENT, LINGO_ACCENT_DIM, LINGO_COURSES } from "@/content/lingo/courses";
import { isLingoLangId } from "@/content/lingo/types";
import { useProgress } from "./ProgressProvider";

const links = [
  { href: "/learn", label: "Learn", icon: BookIcon },
  { href: "/practice", label: "Practice", icon: QuizIcon },
  { href: "/lab", label: "Tech Lab", icon: TicketIcon, techOnly: true },
  { href: "/progress", label: "Progress", icon: ProgressIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subjectFromPath(pathname: string) {
  const learn = pathname.match(/^\/learn\/([^/]+)/);
  if (learn && isSubjectId(learn[1])) return getSubject(learn[1]);
  const projectPage = pathname.match(/^\/projects\/([^/]+)/);
  if (projectPage) {
    const project = getProject(projectPage[1]);
    if (project) return getSubject(project.subject);
  }
  if (pathname.startsWith("/lab")) return getSubject("tech");
  if (pathname.startsWith("/ready")) return getSubject("tech");
  return undefined;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { progress } = useProgress();
  const pathname = usePathname();
  const player =
    /^\/learn\/[^/]+\/[^/]+$/.test(pathname) ||
    /^\/practice\/[^/]+$/.test(pathname) ||
    /^\/practice\/mock\//.test(pathname) ||
    pathname === "/practice/pbq" ||
    /^\/play\/[^/]+$/.test(pathname) ||
    /^\/brain\/play\//.test(pathname) ||
    /^\/lingo\/[^/]+\/[^/]+$/.test(pathname) ||
    pathname.startsWith("/lab/t/");
  const immersive = pathname === "/brain/feed" || pathname.startsWith("/brain/feed/");
  const subject = subjectFromPath(pathname);
  const activeHub = subject?.id ?? progress.lastSubject;
  const labOpen = activeHub === "tech" || pathname.startsWith("/lab");
  const brain = pathname.startsWith("/brain");
  const lingoMatch = pathname.match(/^\/lingo(?:\/([^/]+))?/);
  const lingo = lingoMatch
    ? lingoMatch[1] && isLingoLangId(lingoMatch[1])
      ? LINGO_COURSES[lingoMatch[1]]
      : { accent: LINGO_ACCENT, accentDim: LINGO_ACCENT_DIM }
    : undefined;

  return (
    <div
      className="flex min-h-full flex-col"
      style={
        brain
          ? ({
              "--accent": BRAIN_ACCENT,
              "--accent-dim": BRAIN_ACCENT_DIM,
            } as CSSProperties)
          : lingo
          ? ({
              "--accent": lingo.accent,
              "--accent-dim": lingo.accentDim,
            } as CSSProperties)
          : subject
          ? ({
              "--accent": subject.accent,
              "--accent-dim": subject.accentDim,
            } as CSSProperties)
          : undefined
      }
    >
      {immersive ? null : (
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-dim font-mono text-sm font-bold text-accent ring-1 ring-accent/30">
              TB
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">TicketBench</span>
              <span className="hidden text-[11px] text-muted sm:block">
                Many subjects
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              const locked = link.techOnly && !labOpen;
              if (locked) {
                return (
                  <span
                    key={link.href}
                    title="Tech Lab opens when Tech is the active hub"
                    className="cursor-not-allowed rounded-lg px-2.5 py-1.5 text-sm text-muted/50"
                  >
                    {link.label}
                  </span>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-surface-2 text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <DeskShiftChip />
            <StatusChip />
          </nav>
        </div>
      </header>
      )}

      <main className={cn(
        "mx-auto w-full flex-1",
        immersive ? "max-w-none p-0" : "px-4 py-6 pb-24 md:pb-10",
        immersive ? "" : player ? "max-w-3xl md:py-6" : "max-w-4xl md:py-10",
      )}>
        {children}
      </main>

      {player || immersive ? null : (
        <footer className="border-t border-border pb-20 md:pb-0">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <Disclaimer compact />
          </div>
        </footer>
      )}

      {immersive ? null : (
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg gap-0 px-0.5 pb-[env(safe-area-inset-bottom)]">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            const locked = link.techOnly && !labOpen;
            if (locked) {
              return (
                <span
                  key={link.href}
                  title="Tech Lab opens when Tech is the active hub"
                  className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2 text-[9px] text-muted/40"
                >
                  <Icon active={false} />
                  {link.label}
                </span>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2 text-[9px]",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon active={active} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
      )}
    </div>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path d="M5 21.5A2.5 2.5 0 0 1 7.5 19H20" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}

function QuizIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path d="M8 9h8M8 12.5h5M8 16h3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function TicketIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.2a2.2 2.2 0 1 0 0 4.4V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.4a2.2 2.2 0 1 0 0-4.4V8Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
    </svg>
  );
}

function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V6M10 18v-7M16 18V9M22 18H2"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
