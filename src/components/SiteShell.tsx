"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
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
import { ProfileSwitcher } from "./ProfileSwitcher";

const links: {
  href: string;
  label: string;
  icon: (props: { active: boolean }) => ReactNode;
  match?: string;
}[] = [
  { href: "/learn", label: "Learn", icon: BookIcon },
  { href: "/brain/feed", label: "Brain", icon: BrainIcon, match: "/brain" },
  { href: "/practice", label: "Practice", icon: QuizIcon },
  { href: "/progress", label: "Progress", icon: ProgressIcon },
];

function isActive(pathname: string, href: string, match?: string) {
  const root = match ?? href;
  if (root === "/") return pathname === "/";
  return pathname === root || pathname.startsWith(`${root}/`);
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
          <div className="flex items-center gap-1">
            <ProfileSwitcher />
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active = isActive(pathname, link.href, link.match);
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
              {labOpen ? <TechLabChip active={pathname.startsWith("/lab")} /> : null}
              <BinderChip active={pathname.startsWith("/binder")} />
              <DeskShiftChip />
              <StatusChip />
            </nav>
            <div className="flex items-center gap-1 md:hidden">
              {labOpen ? <TechLabChip active={pathname.startsWith("/lab")} /> : null}
              <BinderChip active={pathname.startsWith("/binder")} />
            </div>
          </div>
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
            const active = isActive(pathname, link.href, link.match);
            const Icon = link.icon;
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

function BinderChip({ active }: { active: boolean }) {
  return (
    <Link
      href="/binder"
      title="Binder — printed tickets"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium",
        active
          ? "border-accent/40 bg-accent-dim text-accent"
          : "border-border bg-surface text-muted hover:text-foreground",
      )}
    >
      Binder
    </Link>
  );
}

function TechLabChip({ active }: { active: boolean }) {
  return (
    <Link
      href="/lab"
      title="Helpdesk tickets — Tech hub"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium",
        active
          ? "border-accent/40 bg-accent-dim text-accent"
          : "border-border bg-surface text-muted hover:text-foreground",
      )}
    >
      Tech Lab
    </Link>
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
