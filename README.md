# TicketBench

A **multi-subject** study bench: **Tech (CompTIA A+)** plus Maths, Science, History, English, Geography, Coding, Business, Health, Music, Art, Civics, Languages, Logic, and Digital citizenship. Each hub has **at least 60 interactive lesson paths** (concept → try-this → why), one-problem quizzes, Listen / Auto-read, and shared XP. **Languages (speak)** is a separate Duolingo-style area for **French, Indonesian, and Icelandic** (`/lingo`) — 60 bite-sized lessons each — and does not replace the linguistics catalog. Tech still has the AI helpdesk lab and an honest Core 1 / Core 2 readiness meter. **Brain Gym** is a separate daily 2-hour puzzle desk plus a **phone feed** (short-form challenge cards instead of empty scrolling) — not a school subject.

This is **not** an official CompTIA product, school curriculum, Brilliant product, or Duolingo product, and is not affiliated with, endorsed by, or sponsored by CompTIA **or Brilliant**. CompTIA A+® is a registered trademark of CompTIA. AI tickets are study aids, not exam dumps. School paths use Australian-friendly hooks where they are natural; they are not a syllabus. Brain Gym is not an IQ test. Language courses are beginner practice, not a fluency certificate.

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
npm run lingo     # regenerate French / Indonesian / Icelandic courses
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

- **Home** — grouped subject cards, today’s path (remembers last subject), Sydney streak, level, Core 1 / Core 2 glance, Languages + Brain Gym cards
- **Learn** — `/learn/[subject]/[path]`. Each hub is a searchable catalog with topic filters. Tech keeps nine A+ domains exam-gated; extra Tech paths have **no** `exam` tag so readiness stays on the original cores. Brain Gym is linked from Learn but is **not** a SubjectId
- **Languages (speak)** (`/lingo`) — French, Indonesian, and Icelandic skill trees (units → skills → lessons). Vocab tap, listen/read meaning, word order, match pairs, type translation (accents optional), honor-system “I said it”. **60 lessons per language**, static in-repo curriculum, no paid translation API. Progress is additive on `progress.lingo`. The `/learn/languages` hub still has the 60 linguistics paths plus a banner into `/lingo`
- **Brain Gym** (`/brain`) — challenge mode. **Phone feed** at `/brain/feed` is a full-viewport, mobile-first scroll of mixed packs (new riddles/trivia/emoji/odd-one-out plus the original desk) hashed from the Australia/Sydney date. Skip costs a little XP so it is not empty scrolling. `/brain/today` still builds a ~**120 minute** playlist; `/brain/browse` lazy-loads packs; `/brain/play/[id]` is the player (typed mini crosswords, word reveal, cryptograms, memory flash, choices)
- **Listen** — speaker control in every lesson / quiz / lab / challenge / Brain Gym player. Language lessons try `fr-FR` / `id-ID` / `is-IS` when the browser has a voice (Icelandic and Indonesian TTS are often missing — text + phonetic stay). **Auto-read** speaks each new prompt (not the four choices). **Choices** reads options on demand. Stop cancels speech. Browser Web Speech API (no TTS key). Preference is stored with progress
- **Quizzes** — one problem at a time (practice or exam drill), filterable by subject, search, first 48 shown until you narrow
- **Lab** — Tech only: generate a ticket. Investigate gather → tools → cause → fix
- **Challenges** — authored cafe-till / bushfire / Federation-floor runs under `/play/[id]` (also linked from the subject hub)
- **Ready** (`/ready`) — A+ exam-readiness rubric (unchanged gates)
- **Sheets** — A+ ports/RAID plus pocket Maths / Science / History tables

Progress is `localStorage` key `ticketbench-progress-v1` (same as before; new fields are additive: `autoRead`, `lastSubject`, `brain`, `brain.feed`, `lingo`). Existing A+ lesson and quiz IDs are unchanged, so Core progress is not wiped. Generated tickets: `ticketbench-tickets-v1`. Reset from the dashboard.

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
| Languages | **60** | How languages work (intro, not fluency). Speak courses are extra, under `/lingo` |
| Logic | **60** | Arguments, fallacies, evidence |
| Digital | **60** | Privacy, scams, feeds, sharing |

**None under 60.** Grand total **901** paths.

Browse by topic chips and search inside each hub so 60+ stays usable.

## Languages (speak) — French, Indonesian, Icelandic

Not the linguistics catalog. Hub: `/lingo`. Trees: `/lingo/fr`, `/lingo/id`, `/lingo/is`. Factory: `npm run lingo` (`scripts/lingo/*.mjs` → `src/content/lingo/packs/`).

| Course | Lessons | Notes |
| --- | --- | --- |
| French | **60** | 10 units × 6 lessons (greetings through daily life) |
| Indonesian | **60** | Same path shape; real Bahasa Indonesia spelling |
| Icelandic | **60** | þ ð æ ö kept; phonetic hints; TTS optional |

Each lesson mixes vocab tap, listen/read meaning, word order / fill-blank, match pairs, type (forgiving normalize), and honor-system speak. No hearts. XP: first correct 10, repeat 4, wrong 2, speak 8, lesson complete 50.

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
| Riddles | 800 | Lateral one-liners |
| Trivia sparks | 1400 | Science / history / geo / tech MCQ |
| Emoji equations | 700 | Rebus-lite + digit sums |
| Odd one out | 900 | Words, numbers, concepts |
| Two truths, one lie | 650 | Pick the lie |
| Micro reading | 700 | Short passage, one trap question |
| Spelling | 900 | Aussie-friendly spelling + word choice |
| Quick facts | 900 | True/false with a one-line why |
| Pattern find | 800 | Letters, symbols, tiny grids |
| What would you do? | 550 | Micro ethics / digital citizenship |
| Beats | 550 | Count, rest, note values (tap, not audio) |
| **Total** | **24,853** | Floor was 20,000 |

### Phone feed

`/brain/feed` is a mobile-first, full-viewport card stack (centred phone-width column on desktop). Mix weights live in `src/lib/brain-feed.ts` and hash **Australia/Sydney date + card index**. Skip costs **2 XP** and a short cooldown. Correct answers auto-advance. Feed cursor and session timer persist additively on `progress.brain.feed` (same `ticketbench-progress-v1` key).

### Daily playlist

`src/lib/brain-daily.ts` hashes the **Australia/Sydney** date plus category, then fills a **recipe that always totals 120 minutes**, including a standing word slice plus new families:

- Crosswords **10 min** + other word puzzles **12 min**
- Then maths 12, sequences 8, analogies 6, syllogisms 6, estimate 5, chance 6, code 6, spatial 5, memory 4, reading 5, lateral 3, logic 3, riddle 4, trivia 5, emoji 3, odd 3, spell 3, fact 3, lie 2, micro 2, pattern 2, ethic 1, beat 1

It prefers unused IDs, then wraps. The ID list **freezes** into `progress.brain.days[ymd]` on the first answer that day so later generator runs cannot reshuffle today’s desk.

Crossword UX: tap a cell, type a letter or use the on-screen letter pad, arrow keys, across/down clue lists, **Check** (free) and **Reveal letter/word** (XP penalty). Hidden input is 16px to avoid iOS zoom.

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
| Phone feed skip | −2 (plus a short cooldown) |
| Mini crossword complete | +40 (reveal letter −5, reveal word −12) |
| Daily 120 min desk cleared | +80 |
| Language step correct (first / repeat / wrong) | 10 / 4 / 2 |
| Language “I said it” (first) | 8 |
| Language lesson complete | 50 |

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

Client UI reads domain metadata from `@/content/registry` (no lesson/quiz/check JSON). Lab tickets stay AI-generated (`src/lib/ai-tickets.ts`). Subject challenges are static in `src/content/challenges.ts`. Brain Gym packs are generated JSON under `src/content/brain/packs/`. Language courses are generated JSON under `src/content/lingo/packs/`.

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Zod.
