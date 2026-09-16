# TicketBench

Independent study lab for **CompTIA A+ Core 1 (220-1101)** and **Core 2 (220-1102)**. Lessons are **interactive paths** (one concept, then a try, then a short why), exam-style practice problems, and an **AI helpdesk lab** that writes a new ticket each run.

This is **not** an official CompTIA product and is not affiliated with, endorsed by, or sponsored by CompTIA **or Brilliant**. CompTIA A+® is a registered trademark of CompTIA. AI tickets are study aids, not exam dumps. The teaching style is inspired by bite-sized learn-by-doing platforms, not a copy of any commercial course.

## Run locally

```bash
npm install
cp .env.example .env.local   # then add a key if you want live generation
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without an AI key the lab still works: **Generate ticket** loads a single offline practice stub and tells you why. Production needs a key for fresh tickets.

```bash
npm run build
npm start
```

## Environment (live AI tickets)

Tickets are created in `POST /api/tickets` with the Vercel AI SDK. Keys stay on the server.

| Variable | Purpose |
| --- | --- |
| `AI_GATEWAY_API_KEY` | Preferred. Vercel AI Gateway — used automatically with `model: "openai/gpt-5.4"`. |
| `OPENAI_API_KEY` | Also accepted if you are not using the Gateway. |
| `AI_MODEL` | Optional override (default `openai/gpt-5.4`). Use `provider/model` slugs. |

On Vercel, AI Gateway can also authenticate with the project’s OIDC token (`VERCEL_OIDC_TOKEN`). Add `AI_GATEWAY_API_KEY` in the project env if OIDC is not enough.

Generation is rate-limited (8 requests / 10 minutes / IP) and the Generate button is debounced. Invalid model JSON is retried once, then the stub is returned instead of crashing the UI.

## What you can do

- **Home** — today’s path, Sydney streak, level, Core 1 / Core 2 readiness glance
- **Learn** — nine domain paths; one beat per screen; you tap Continue (checks gate the next beat)
- **Listen** — speaker control in the lesson / quiz / lab player. **Auto-read** speaks each new prompt (not the four choices). **Choices** reads options on demand. Stop cancels speech. Uses the browser Web Speech API (no TTS key). Preference is stored on this device with progress.
- **Quizzes** — one problem at a time (practice feedback now, or exam drill)
- **Lab** — generate a ticket (Core 1/2, theme, difficulty, or surprise). Investigate gather → tools → cause → fix
- **Ready** (`/ready`) — full readiness rubric
- **Sheets** — ports, RAID, Windows tools, etc.

Progress is `localStorage` key `ticketbench-progress-v1` (same as before; new fields are additive, including `autoRead`). Generated tickets: `ticketbench-tickets-v1`. Reset from the dashboard.

## XP, levels, streak

| Action | XP |
| --- | --- |
| First time finishing a lesson | 80 |
| Quiz answer correct (first time that item) | 12 |
| Quiz answer correct on a retake | 6 |
| Quiz answer wrong | 2 |
| Quiz complete | 15 + 25 if ≥80% + 40 if 100% |
| Ticket | up to 100 × score ratio, +50 if 4/4, +20 if ≥75% |

Levels: Helpdesk Rookie → Bench Tech → Field Tech → Desktop Specialist → Escalation Tech → A+ Contender → Core-Ready Tech → Dual-Core Contender.

Daily streak uses the **Australia/Sydney** calendar date, not the browser time zone.

## Exam-readiness rubric

Weighted: lessons 30% · quizzes 35% (latest attempt 70%, previous 30%) · lab 25% · domain coverage 10%.

**Exam-ready is gated.** The app will not say it unless:

1. Every domain lesson for that exam is done
2. Every domain quiz is taken and recency-weighted accuracy is ≥ 80%
3. Lab: Core 1 needs 4 closed tickets for that exam, Core 2 needs 3; average ≥ 75%; at least one clean (100%) close
4. No domain left with zero lesson, quiz, and ticket practice

If those gates fail, status caps at **Almost** even if the weighted % is high.

## Adding lessons / quizzes

Typed modules under `src/content/` (domains, lessons, quizzes, cheatsheets). Lessons are compiled into paths by `src/lib/lesson-path.ts` plus interactive checks in `src/content/path-checks.ts`. Lab tickets are **not** a static catalog — extend generation via `src/lib/ai-tickets.ts` and `src/lib/ticket-schema.ts`.

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Zod.
