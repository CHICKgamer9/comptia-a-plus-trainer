"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hidePhoneHeader, hidePhoneTabs, isBrainFeed } from "@/lib/phone-chrome";
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
import { PhoneOverflow } from "./PhoneOverflow";

const desktopLinks: {
  href: string;
  label: string;
  match?: string;
}[] = [
  { href: "/learn", label: "Learn" },
  { href: "/brain/feed", label: "Brain", match: "/brain" },
  { href: "/practice", label: "Practice" },
  { href: "/progress", label: "Progress" },
];

const phoneTabs: {
  href: string;
  label: string;
  icon: (props: { active: boolean }) => ReactNode;
  match?: string;
}[] = [
  { href: "/learn", label: "Learn", icon: BookIcon },
  { href: "/brain/feed", label: "Brain", icon: BrainIcon, match: "/brain" },
  { href: "/binder", label: "Binder", icon: BinderIcon },
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

function useKeyboardInset() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const sync = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty("--keyboard-inset", `${Math.round(inset)}px`);
    };
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      document.documentElement.style.setProperty("--keyboard-inset", "0px");
    };
  }, []);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { progress } = useProgress();
  const pathname = usePathname();
  useKeyboardInset();
  const player =
    /^\/learn\/[^/]+\/[^/]+$/.test(pathname) ||
    /^\/practice\/[^/]+$/.test(pathname) ||
    /^\/practice\/mock\//.test(pathname) ||
    pathname === "/practice/pbq" ||
    /^\/play\/[^/]+$/.test(pathname) ||
    /^\/brain\/play\//.test(pathname) ||
    /^\/lingo\/[^/]+\/[^/]+$/.test(pathname) ||
    pathname.startsWith("/lab/t/");
  const feed = isBrainFeed(pathname);
  const hideTabs = hidePhoneTabs(pathname);
  const hideHeader = hidePhoneHeader(pathname);
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
      data-phone-tabs={hideTabs ? "off" : "on"}
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
      {hideHeader ? null : (
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          <div className="mx-auto flex h-[52px] max-w-4xl items-center justify-between px-4 md:h-14">
            <Link href="/" className="flex min-h-11 min-w-11 items-center gap-2.5" aria-label="TicketBench home">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-dim font-mono text-sm font-bold text-accent ring-1 ring-accent/30">
                TB
              </span>
              <span className="hidden leading-tight md:block">
                <span className="block text-sm font-semibold">TicketBench</span>
                <span className="hidden text-[11px] text-muted sm:block">
                  Many subjects
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <div className="hidden md:contents">
                <ProfileSwitcher />
                <nav className="hidden items-center gap-1 md:flex">
                  {desktopLinks.map((link) => {
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
              </div>
              <PhoneOverflow />
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "mx-auto w-full flex-1",
          feed ? "max-w-none p-0" : hideHeader ? "max-w-3xl px-4 pt-0 pb-[max(1rem,env(safe-area-inset-bottom))] md:py-6" : "px-4 py-4 md:py-10",
          feed ? "" : player ? "max-w-3xl" : "max-w-4xl",
          feed || hideTabs
            ? ""
            : "pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+1rem)] md:pb-10",
        )}
      >
        {children}
      </main>

      {player || feed ? null : (
        <footer className="border-t border-border pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] md:pb-0">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <Disclaimer compact />
          </div>
        </footer>
      )}

      {hideTabs ? null : (
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl md:hidden"
          aria-label="Primary"
        >
          <div className="mx-auto flex max-w-lg px-0.5 pb-[env(safe-area-inset-bottom)]">
            {phoneTabs.map((link) => {
              const active = isActive(pathname, link.href, link.match);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] [touch-action:manipulation]",
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

function BinderIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
