# TicketBench

A **multi-subject** study bench: **Tech (CompTIA A+)** plus Maths, Science, History, English, Geography, Coding, Business, Health, Music, Art, Civics, Languages, Logic, and Digital citizenship. Each hub has **at least 60 interactive lesson paths** (concept → try-this → why), one-problem quizzes, Listen / Auto-read, and shared XP. Tech still has the AI helpdesk lab and an honest Core 1 / Core 2 readiness meter. **Brain Gym** is a separate daily 2-hour puzzle desk (mini crosswords, word games, logic, mental maths) — not a 16th school subject.

This is **not** an official CompTIA product, school curriculum, or Brilliant product, and is not affiliated with, endorsed by, or sponsored by CompTIA **or Brilliant**. CompTIA A+® is a registered trademark of CompTIA. AI tickets are study aids, not exam dumps. School paths use Australian-friendly hooks where they are natural; they are not a syllabus. Brain Gym is not an IQ test.

## Run locally

```bash
npm install
cp .env.example .env.local   # then add a key if you want live A+ ticket generation
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without an AI key the **Tech lab** still works: **Generate ticket** loads a single offline practice stub. Subject challenges are authored and do not need a key.

```bash
npm run catalog   # regenerate factory JSON from scripts/topics/*.mjs
npm run brain     # regenerate Brain Gym packs (scripts/brain/*.mjs)
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

- **Home** — grouped subject cards, today’s path (remembers last subject), Sydney streak, level, Core 1 / Core 2 glance, Brain Gym card
- **Learn** — `/learn/[subject]/[path]`. Each hub is a searchable catalog with topic filters. Tech keeps nine A+ domains exam-gated; extra Tech paths have **no** `exam` tag so readiness stays on the original cores. Brain Gym is linked from Learn but is **not** a SubjectId
- **Brain Gym** (`/brain`) — challenge mode. `/brain/today` builds a ~**120 minute** playlist on the Australia/Sydney date; `/brain/browse` lazy-loads packs; `/brain/play/[id]` is the player (typed mini crosswords, word reveal, cryptograms, memory flash, choices)
- **Listen** — speaker control in every lesson / quiz / lab / challenge / Brain Gym player. **Auto-read** speaks each new prompt (not the four choices). **Choices** reads options on demand. Stop cancels speech. Browser Web Speech API (no TTS key). Preference is stored with progress
- **Quizzes** — one problem at a time (practice or exam drill), filterable by subject, search, first 48 shown until you narrow
- **Lab** — Tech only: generate a ticket. Investigate gather → tools → cause → fix
- **Challenges** — authored cafe-till / bushfire / Federation-floor runs under `/play/[id]` (also linked from the subject hub)
- **Ready** (`/ready`) — A+ exam-readiness rubric (unchanged gates)
- **Sheets** — A+ ports/RAID plus pocket Maths / Science / History tables

Progress is `localStorage` key `ticketbench-progress-v1` (same as before; new fields are additive: `autoRead`, `lastSubject`, `brain`). Existing A+ lesson and quiz IDs are unchanged, so Core progress is not wiped. Generated tickets: `ticketbench-tickets-v1`. Reset from the dashboard.

Old `/learn/mobile-devices` URLs redirect to `/learn/tech/mobile-devices`.

## Path count per subject

Hard floor: **60 distinct interactive paths in every hub.** 15 subjects × 60 = 900 minimum. Current totals (hand-authored originals + factory seeds):

| Subject | Paths | Notes |
| --- | --- | --- |
| Tech | **60** | 9 original A+ domains (exam-gated) + 51 extra shop-craft paths (no exam tag) |
| Maths | **61** | 5 original + 56 factory |
| Science | **60** | 5 original + 55 factory |
| History | **60** | 5 original + 55 factory |
| English | **60** | Literacy / sentences / reading moves |
| Geography | **60** | Maps, climate, cities, Country |
| Coding | **60** | Variables, loops, bugs, the web |
| Business | **60** | Prices, tax, work, small enterprise |
| Health | **60** | Movement, food, sleep, first aid |
| Music | **60** | Beat, pitch, texture, listening |
| Art | **60** | Seeing, colour, layout |
| Civics | **60** | Rules, parliaments, rights, votes |
| Languages | **60** | How languages work (intro, not fluency) |
| Logic | **60** | Arguments, fallacies, evidence |
| Digital | **60** | Privacy, scams, feeds, sharing |

**None under 60.** Grand total **901** paths.

Browse by topic chips and search inside each hub so 60+ stays usable.

## Brain Gym (daily 2-hour challenge)

Not a subject hub (no 60-path rule). Factory packs live in `src/content/brain/packs/` (`npm run brain`). Client UI lazy-loads **one category JSON at a time**.

| Category | Unique items | Notes |
| --- | --- | --- |
| Crosswords | **1400** | 600 playable 4×4 word squares + 800 5×5 lattice minis (typed grid, across/down clues) |
| Words | **3700** | Anagrams, ladders, cryptograms, word-reveal, acrostic-lite, synonym/antonym, missing letter, compounds |
| Mental maths | 2400 | |
| Sequences | 1400 | |
| Analogies | 1100 | |
| Syllogisms | 900 | |
| Estimation | 800 | |
| Chance | 770 | |
| Code trace | 900 | |
| Spatial | 133 | |
| Memory | 400 | Flash then ask |
| Reading traps | 800 | |
| Lateral | 600 | |
| Logic grids | 700 | |
| **Total** | **16,003** | Floor was 8,000 |

### Daily playlist

`src/lib/brain-daily.ts` hashes the **Australia/Sydney** date plus category, then fills a **recipe that always totals 120 minutes**, including a standing word slice:

- Crosswords **12 min** + other word puzzles **18 min** (30 min of words every day)
- Then maths 16, sequences 10, analogies 8, syllogisms 8, estimate 6, chance 8, code 8, spatial 6, memory 6, reading 6, lateral 4, logic 4

It prefers unused IDs, then wraps. The ID list **freezes** into `progress.brain.days[ymd]` on the first answer that day so later generator runs cannot reshuffle today’s desk.

With ~2 min average items, a full desk is about **60 IDs/day**. 16,003 unique IDs last **~266 days** before any wrap — a year of daily sessions will not exhaust the pool early. Crosswords (1,400) and word puzzles (3,700) are large enough that the daily word slice does not obviously repeat in the first many months.

Crossword UX: tap a cell, type a letter, arrow keys, across/down clue lists, **Check** (free) and **Reveal letter/word** (XP penalty). Mobile uses the device keyboard via a focused hidden input.

## XP, levels, streak

| Action | XP |
| --- | --- |
| First time finishing a lesson | 80 |
| Quiz answer correct (first time that item) | 12 |
| Quiz answer correct on a retake | 6 |
| Quiz answer wrong | 2 |
| Quiz complete | 15 + 25 if ≥80% + 40 if 100% |
| Ticket / challenge | up to 100 × score ratio, +50 if 4/4, +20 if ≥75% |
| Brain Gym correct / wrong | 10 / 2 |
| Mini crossword complete | +40 (reveal letter −5, reveal word −12) |
| Daily 120 min desk cleared | +80 |

Levels: Spark → Scout → Pathfinder → Specialist → Scholar → Contender → Polymath → Mastery.

Daily streak uses the **Australia/Sydney** calendar date, not the browser time zone.

## Exam-readiness rubric (Tech / A+ only)

Weighted: lessons 30% · quizzes 35% (latest attempt 70%, previous 30%) · lab 25% · domain coverage 10%.

**Exam-ready is gated.** The app will not say it unless:

1. Every **exam-tagged** domain lesson for that exam is done
2. Every **exam-tagged** domain quiz is taken and recency-weighted accuracy is ≥ 80%
3. Lab: Core 1 needs 4 closed tickets for that exam, Core 2 needs 3; average ≥ 75%; at least one clean (100%) close
4. No exam-tagged domain left with zero lesson, quiz, and ticket practice

Extra Tech paths are additive study; they do not change those gates. If those gates fail, status caps at **Almost** even if the weighted % is high.

## Adding a path

**Factory (preferred at this scale):** add a unique seed row in `scripts/topics/<subject>.mjs`, then `npm run catalog`. Seeds must not reuse reserved original IDs (`mobile-devices`, `number-sense`, …). Extra Tech seeds must omit `exam`.

**Hand-authored (originals):**

1. Add a `Domain` with `subject` in `src/content/domains.ts` or `domains-school.ts`
2. Author a `Lesson` under `src/content/lessons/` and a `Quiz` under `src/content/quizzes/`
3. Add checks in `src/content/path-checks.ts` or `path-checks-school.ts` (`afterHeading` must match a section heading)
4. `lessonToPath` compiles intro + sections + checks + recap

Client UI reads domain metadata from `@/content/registry` (no lesson/quiz/check JSON). Lab tickets stay AI-generated (`src/lib/ai-tickets.ts`). Subject challenges are static in `src/content/challenges.ts`. Brain Gym packs are generated JSON under `src/content/brain/packs/`.

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Zod.
