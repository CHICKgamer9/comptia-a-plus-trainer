import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { AccountProvider } from "@/components/AccountProvider";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteShell } from "@/components/SiteShell";
import { CelebrationHost } from "@/components/CelebrationHost";
import { DropCeremony } from "@/components/card/DropCeremony";
import { SaveBenchPrompt } from "@/components/SaveBenchPrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TicketBench · Interactive paths",
    template: "%s · TicketBench",
  },
  description:
    "Interactive paths for CompTIA A+ and a shelf of school subjects. Hands-on projects, Languages (French, Indonesian, Icelandic), quizzes, a helpdesk lab, Brain Gym phone feed, and Listen/Auto-read. Not affiliated with CompTIA, Brilliant, or Duolingo.",
  appleWebApp: {
    capable: true,
    title: "TicketBench",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-icon",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <AuthProvider>
          <AccountProvider>
            <ProgressProvider>
              <SiteShell>{children}</SiteShell>
              <CelebrationHost />
              <DropCeremony />
              <SaveBenchPrompt />
            </ProgressProvider>
          </AccountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}