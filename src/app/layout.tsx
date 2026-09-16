import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteShell } from "@/components/SiteShell";
import { CelebrationHost } from "@/components/CelebrationHost";
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
    default: "TicketBench · CompTIA A+ study lab",
    template: "%s · TicketBench",
  },
  description:
    "Independent CompTIA A+ trainer: interactive lesson paths, quizzes, and AI helpdesk tickets. Not affiliated with CompTIA or Brilliant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <ProgressProvider>
          <SiteShell>{children}</SiteShell>
          <CelebrationHost />
        </ProgressProvider>
      </body>
    </html>
  );
}
