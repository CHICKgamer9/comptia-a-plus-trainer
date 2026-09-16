# TicketBench

A **multi-subject** study bench: **Tech (CompTIA A+)**, **Maths**, **Science**, and **History**. Each subject is interactive paths (concept → try-this → why), one-problem quizzes, Listen / Auto-read, and shared XP. Tech still has the AI helpdesk lab and an honest Core 1 / Core 2 readiness meter.

This is **not** an official CompTIA product, school curriculum, or Brilliant product, and is not affiliated with, endorsed by, or sponsored by CompTIA **or Brilliant**. CompTIA A+® is a registered trademark of CompTIA. AI tickets are study aids, not exam dumps. History paths use Australian-friendly hooks where they are natural; they are not a syllabus.

## Run locally

```bash
npm install
cp .env.example .env.local   # then add a key if you want live A+ ticket generation
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without an AI key the **Tech lab** still works: **Generate ticket** loads a single offline practice stub. Maths / Science / History challenges are authored and do not need a key.

```bash
npm run build
npm start
```

## Environment (live AI tickets)

Tickets are created in `POST /api/tickets` with the Vercel AI SDK. Keys stay on the server. Only the Tech lab uses this.

| Variable | Purpose |
| --- | --- |
| `AI_GATEWAY_API_KEY` | Preferred. Vercel AI Gateway — used automatically with `model: "openai/gpt-5.4"`. |
| `OPENAI_API_KEY` | Also accepted if you are not using the Gateway. |
| `AI_MODEL` | Optional override (default `openai/gpt-5.4`). Use `provider/model` slugs. |

On Vercel, AI Gateway can also authenticate with the project’s OIDC token (`VERCEL_OIDC_TOKEN`). Add `AI_GATEWAY_API_KEY` in the project env if OIDC is not enough.

Generation is rate-limited (8 requests / 10 minutes / IP) and the Generate button is debounced. Invalid model JSON is retried once, then the stub is returned instead of crashing the UI.

## What you can do

- **Home** — subject cards, today’s path (remembers last subject), Sydney streak, level, Core 1 / Core 2 glance
- **Learn** — `/learn/[subject]/[path]`. Tech keeps nine A+ domains. Maths, Science, and History each have five interactive paths
- **Listen** — speaker control in every lesson / quiz / lab / challenge player. **Auto-read** speaks each new prompt (not the four choices). **Choices** reads options on demand. Stop cancels speech. Browser Web Speech API (no TTS key). Preference is stored with progress
- **Quizzes** — one problem at a time (practice or exam drill), filterable by subject
- **Lab** — Tech only: generate a ticket. Investigate gather → tools → cause → fix
- **Challenges** — authored cafe-till / bushfire / Federation-floor runs under `/play/[id]` (also linked from the subject hub)
- **Ready** (`/ready`) — A+ exam-readiness rubric (unchanged gates)
- **Sheets** — A+ ports/RAID plus pocket Maths / Science / History tables

Progress is `localStorage` key `ticketbench-progress-v1` (same as before; new fields are additive: `autoRead`, `lastSubject`). Existing A+ lesson and quiz IDs are unchanged, so Core progress is not wiped. Generated tickets: `ticketbench-tickets-v1`. Reset from the dashboard.

Old `/learn/mobile-devices` URLs redirect to `/learn/tech/mobile-devices`.

## Subjects (MVP)

| Subject | Paths | Extra |
| --- | --- | --- |
| Tech | 9 A+ domains (Core 1 + Core 2) | AI lab + readiness |
| Maths | Number sense, fractions, percentages, algebra, geometry | Cafe till challenge |
| Science | Atoms, forces, energy, cells, ecosystems | Ridge-before-the-northerly challenge |
| History | Historical thinking, ancient worlds, Country & contact, making Australia, twentieth century | Federation-floor challenge |

## XP, levels, streak

| Action | XP |
| --- | --- |
| First time finishing a lesson | 80 |
| Quiz answer correct (first time that item) | 12 |
| Quiz answer correct on a retake | 6 |
| Quiz answer wrong | 2 |
| Quiz complete | 15 + 25 if ≥80% + 40 if 100% |
| Ticket / challenge | up to 100 × score ratio, +50 if 4/4, +20 if ≥75% |

Levels: Spark → Scout → Pathfinder → Specialist → Scholar → Contender → Polymath → Mastery.

Daily streak uses the **Australia/Sydney** calendar date, not the browser time zone.

## Exam-readiness rubric (Tech / A+ only)

Weighted: lessons 30% · quizzes 35% (latest attempt 70%, previous 30%) · lab 25% · domain coverage 10%.

**Exam-ready is gated.** The app will not say it unless:

1. Every domain lesson for that exam is done
2. Every domain quiz is taken and recency-weighted accuracy is ≥ 80%
3. Lab: Core 1 needs 4 closed tickets for that exam, Core 2 needs 3; average ≥ 75%; at least one clean (100%) close
4. No domain left with zero lesson, quiz, and ticket practice

If those gates fail, status caps at **Almost** even if the weighted % is high.

## Adding a path

1. Add a `Domain` with `subject` in `src/content/domains.ts` or `domains-school.ts`
2. Author a `Lesson` under `src/content/lessons/` and a `Quiz` under `src/content/quizzes/`
3. Add checks in `src/content/path-checks.ts` or `path-checks-school.ts` (`afterHeading` must match a section heading)
4. `lessonToPath` compiles intro + sections + checks + recap

Lab tickets stay AI-generated (`src/lib/ai-tickets.ts`). Subject challenges are static in `src/content/challenges.ts`.

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Zod.
