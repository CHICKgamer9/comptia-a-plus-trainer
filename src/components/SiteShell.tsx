"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Disclaimer } from "./ui";
import { StatusChip } from "./StatusChip";
import { getSubject, isSubjectId } from "@/content/registry";
import { BRAIN_ACCENT, BRAIN_ACCENT_DIM } from "@/content/brain/types";
import { LINGO_ACCENT, LINGO_ACCENT_DIM, LINGO_COURSES } from "@/content/lingo/courses";
import { isLingoLangId } from "@/content/lingo/types";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/learn", label: "Learn", icon: BookIcon },
  { href: "/brain", label: "Brain", icon: BrainIcon },
  { href: "/practice", label: "Quizzes", icon: QuizIcon },
  { href: "/lab", label: "Lab", icon: TicketIcon },
  { href: "/reference", label: "Sheets", icon: SheetIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subjectFromPath(pathname: string) {
  const learn = pathname.match(/^\/learn\/([^/]+)/);
  if (learn && isSubjectId(learn[1])) return getSubject(learn[1]);
  const play = pathname.match(/^\/play\/([^/]+)/);
  if (play) {
    // challenges live under /play; accent stays default unless we look up later
    return undefined;
  }
  return undefined;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const player =
    /^\/learn\/[^/]+\/[^/]+$/.test(pathname) ||
    /^\/practice\/[^/]+$/.test(pathname) ||
    /^\/play\/[^/]+$/.test(pathname) ||
    /^\/brain\/play\//.test(pathname) ||
    /^\/lingo\/[^/]+\/[^/]+$/.test(pathname) ||
    pathname.startsWith("/lab/t/");
  const immersive = pathname === "/brain/feed" || pathname.startsWith("/brain/feed/");
  const subject = subjectFromPath(pathname);
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-dim font-mono text-sm font-bold text-accent ring-1 ring-accent/30">
              TB
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">TicketBench</span>
              <span className="hidden text-[11px] text-muted sm:block">
                Tech · many subjects
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-surface-2 text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <StatusChip />
          </nav>
        </div>
      </header>
      )}

      <main className={cn(
        "mx-auto w-full flex-1",
        immersive ? "max-w-none p-0" : "px-4 py-6 pb-24 md:pb-10",
        immersive ? "" : player ? "max-w-3xl md:py-6" : "max-w-6xl md:py-10",
      )}>
        {children}
      </main>

      {player || immersive ? null : (
        <footer className="border-t border-border pb-20 md:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Disclaimer compact />
          </div>
        </footer>
      )}

      {immersive ? null : (
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6 px-1 pb-[env(safe-area-inset-bottom)]">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 py-2 text-[11px]",
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

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
    </svg>
  );
}

function BrainIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4.5a3 3 0 0 0-3 3v.4A3.2 3.2 0 0 0 4 10.8c0 1.4.9 2.6 2.1 3.1v2.6A2.5 2.5 0 0 0 8.6 19h2.2v-7.2H9.4V9.4h4.2V19h2.1A2.5 2.5 0 0 0 18.2 16.5v-2.5A3.2 3.2 0 0 0 20 10.8a3.2 3.2 0 0 0-2-3v-.3a3 3 0 0 0-3.2-3c-.7 0-1.4.2-1.9.6A3 3 0 0 0 9 4.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
    </svg>
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

function SheetIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path d="M14 3.5V9h5.5M8.5 13h7M8.5 16.5h5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
