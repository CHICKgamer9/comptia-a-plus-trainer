# TicketBench

Independent study lab for **CompTIA A+ Core 1 (220-1101)** and **Core 2 (220-1102)**. Lessons in plain language, exam-style quizzes with explanations, and helpdesk tickets you solve step by step.

This is **not** an official CompTIA product and is not affiliated with, endorsed by, or sponsored by CompTIA. CompTIA A+® is a registered trademark of CompTIA.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
npm start
```

## What you can do

- **Home** — progress on this device, continue studying, jump a random ticket
- **Learn** — one lesson per domain (both exams)
- **Quizzes** — 10 questions per domain; explanation after every answer
- **Lab** — 16 multi-step tickets: gather info → choose tools → name the cause → apply the fix
- **Sheets** — ports, connectors, RAID, Windows tools, Wi-Fi, methodology, file systems, safety/backups

Progress is stored in `localStorage` (`ticketbench-progress-v1`). No account. Reset from the dashboard.

## Coverage

**Core 1 (220-1101)** — Mobile devices, networking, hardware, virtualization/cloud, hardware & network troubleshooting.

**Core 2 (220-1102)** — Operating systems (Windows focus, macOS/Linux awareness), security, software troubleshooting, operational procedures.

Each domain has a lesson and a quiz. Hardware, network, OS, security, printer, and mobile themes appear in the lab.

## Adding content

Content is typed TypeScript modules, not a CMS.

| Kind | Where |
| --- | --- |
| Types | `src/content/types.ts` |
| Domain list | `src/content/domains.ts` |
| Lessons | `src/content/lessons/core1.ts`, `core2.ts` |
| Quizzes | `src/content/quizzes/core1.ts`, `core2.ts` |
| Tickets | `src/content/scenarios/hardware-network.ts`, `os-security.ts` |
| Cheatsheets | `src/content/cheatsheets.ts` |

1. Add an object that matches `Lesson`, `Quiz`, `Scenario`, or `Cheatsheet`.
2. For a new domain, add it to `domains.ts` and point `lessonId` / `quizId` at the new modules.
3. Export the new item from the folder `index.ts` arrays (already concatenates Core 1 + Core 2).
4. Routes are static: `generateStaticParams` reads those arrays.

Scenario steps should stay four phases (`gather` | `tools` | `cause` | `fix`) with one correct choice each. Wrong choices need a real explanation — that is the product.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4. Deploy as a standard Next.js app (including Vercel).
