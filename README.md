# TicketBench

A **multi-subject** study bench: **Tech (CompTIA A+)** plus Maths, Science, History, English, Geography, Coding, Business, Health, Music, Art, Civics, Languages, Logic, and Digital citizenship. Each hub has **at least 60 interactive lesson paths** (concept → try-this → why) plus a large factory volume pass, **three hands-on projects**, one-problem quizzes, Listen / Auto-read, and shared XP. **Binder** is a knowledge-card layer (not stickers): correct work drops cards you slot into a Home chassis. **Languages (speak)** is a separate Duolingo-style area for **French, Indonesian, and Icelandic** (`/lingo`) — 60 bite-sized lessons each — and does not replace the linguistics catalog. Tech still has the AI helpdesk lab and an honest Core 1 / Core 2 readiness meter. **Brain Gym** is a separate daily 2-hour puzzle desk plus a **phone feed** (short-form challenge cards instead of empty scrolling) — not a school subject. **Projects** sit beside Learn / Quizzes / Lab / Brain.

This is **not** an official CompTIA product, school curriculum, Brilliant product, or Duolingo product, and is not affiliated with, endorsed by, or sponsored by CompTIA **or Brilliant**. CompTIA A+® is a registered trademark of CompTIA. AI tickets are study aids, not exam dumps. School paths and projects use Australian-friendly hooks where they are natural; they are not a syllabus. Brain Gym is not an IQ test. Language courses are beginner practice, not a fluency certificate.

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

## Accounts and learner profiles

Guest **Start Here** still uses `localStorage` (`ticketbench-progress-v1`). No signup required.

Signed-in **Accounts** are Clerk users (email magic link and/or Google + Apple — enable those providers in the Clerk dashboard; skip passwords for v1). **Profiles** (1–6) live in Neon. Progress, Binder, cards, lingo, and streaks are JSON on the profile, never on the account. Billing fields (`plan`, `seat_limit`, `stripe_customer_id`) stay on the account.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser key. Leave empty to stay guest-only. |
| `CLERK_SECRET_KEY` | Clerk server key. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `DATABASE_URL` | Neon connection string. First signed-in request creates tables if missing. Also run `db/001_accounts.sql` for RLS policies. |
| `HOUSE_SEAT_LIMIT` | Optional house seat seed (1–6, default 6). |

Vercel setup: add the [Clerk](https://vercel.com/marketplace/clerk) and [Neon](https://vercel.com/marketplace/neon) Marketplace integrations to `comptia-a-plus-trainer`, or paste keys from clerk.com / neon.tech. Then `vercel env pull .env.local`. In Clerk, turn on Email, Google, and Apple. In Neon, apply `db/001_accounts.sql` (or let the app `CREATE TABLE` on first use, then apply the RLS section). House extra seats: `UPDATE accounts SET plan = 'house', seat_limit = 6 WHERE email = '…';`

`/account` shows plan, seats, and email. `/account/profiles` adds, renames, and deletes learners (delete wipes that profile’s progress only). The header chip switches profiles without signing out again. After first signup, `/account/onboarding` asks “Who is learning?”. “Save this bench” copies guest state onto a new profile and does not wipe the guest key.

| Plan | Default seats |
| --- | --- |
| Free | 1 |
| Bench | 3 |
| House | `seat_limit` (seed 6, max 6) |

On Vercel, AI Gateway can also authenticate with the project’s OIDC token (`VERCEL_OIDC_TOKEN`). Add `AI_GATEWAY_API_KEY` in the project env if OIDC is not enough.

Generation is rate-limited (8 requests / 10 minutes / IP) and the Generate button is debounced. Invalid model JSON is retried once, then the stub is returned instead of crashing the UI.

## What you can do

- **Home** — grouped subject cards, today’s path (remembers last subject), Bench chassis, Sydney streak, level, Core 1 / Core 2 glance, Languages + Brain Gym + Projects cards
- **Learn** — `/learn/[subject]/[path]`. Each hub is a searchable catalog with topic filters. Tech keeps nine A+ domains exam-gated; extra Tech paths have **no** `exam` tag so readiness stays on the original cores. Brain Gym is linked from Learn but is **not** a SubjectId. Subject cards include **Try a project**
- **Projects** (`/projects`, `/projects/[id]`) — hands-on builds in every hub (3 each, 45 total). Filter with `?hub=maths`. Steps + done-when checklist; completion writes `projectChecks` / `completedProjects` on the same local progress object and awards the project’s XP. Tech’s helpdesk-reply project uses this UI, then points at Lab
- **Binder** (`/binder`) — 9-pocket sheets of printed tickets. Flip to review, drag onto the 3-bay Lab mat. Fusion spends extra copies only. Crests seal a full domain sheet; glue prints from named recipes.
- **Languages (speak)** (`/lingo`) — French, Indonesian, and Icelandic skill trees (units → skills → lessons). Vocab tap, listen/read meaning, word order, match pairs, type translation (accents optional), honor-system “I said it”. **60 lessons per language**, static in-repo curriculum, no paid translation API. Progress is additive on `progress.lingo`. The `/learn/languages` hub still has the 60 linguistics paths plus a banner into `/lingo`
- **Brain Gym** (`/brain`) — challenge mode. **Phone feed** at `/brain/feed` is a full-viewport, mobile-first scroll of mixed packs (new riddles/trivia/emoji/odd-one-out plus the original desk) hashed from the Australia/Sydney date. Skip costs a little XP so it is not empty scrolling. `/brain/today` still builds a ~**120 minute** playlist; `/brain/browse` lazy-loads packs; `/brain/play/[id]` is the player (typed mini crosswords, word reveal, cryptograms, memory flash, choices)
- **Listen** — speaker control in every lesson / quiz / lab / challenge / Brain Gym player. Language lessons try `fr-FR` / `id-ID` / `is-IS` when the browser has a voice (Icelandic and Indonesian TTS are often missing — text + phonetic stay). **Auto-read** speaks each new prompt (not the four choices). **Choices** reads options on demand. Stop cancels speech. Browser Web Speech API (no TTS key). Preference is stored with progress
- **Quizzes** — one problem at a time (practice or exam drill), filterable by subject, search, first 48 shown until you narrow
- **Lab** — Tech only: generate a ticket. Investigate gather → tools → cause → fix. A full Binder loadout biases the ticket and adds XP on close
- **Desk Shift** — 8 / 15 / 25 minutes from Home. Header pill while open. Close the desk with no loot pack. Optional weekly bench special: one extra print from a rotting domain.
- **Challenges** — authored cafe-till / bushfire / Federation-floor runs under `/play/[id]` (also linked from the subject hub)
- **Ready** (`/ready`) — A+ exam-readiness rubric (unchanged gates)
- **Sheets** — A+ ports/RAID plus pocket Maths / Science / History tables; Binder backs deep-link from matching sheets

Progress is `localStorage` key `ticketbench-progress-v1` (same as before; new fields are additive: `autoRead`, `lastSubject`, `brain`, `brain.feed`, `lingo`, `projectChecks`, `completedProjects`, `bench`). Existing A+ lesson and quiz IDs are unchanged, so Core progress is not wiped. Generated tickets: `ticketbench-tickets-v1`. Reset from the dashboard wipes the Binder too.

Old `/learn/mobile-devices` URLs redirect to `/learn/tech/mobile-devices`.

## Path count per subject

Hard floor: **60 distinct interactive paths in every hub.** Extra factory seeds (`scripts/topics/extra/`, including the `more/` balance pass) add **1,799** lessons. Before volume: **901**. After: **2,700**. Every major hub is topped to **180** so coverage is complete, not just past the 1,400 floor.

| Subject | Paths | Notes |
| --- | --- | --- |
| Tech | **180** | 9 original A+ domains (exam-gated) + 51 shop-craft + 120 volume (no exam tag) |
| Maths | **180** | 5 original + 56 factory + 119 volume |
| Science | **180** | 5 original + 55 factory + 120 volume |
| History | **180** | 5 original + 55 factory + 120 volume |
| English | **180** | 60 factory + 120 volume |
| Geography | **180** | 60 factory + 120 volume |
| Coding | **180** | 60 factory + 120 volume |
| Business | **180** | 60 factory + 120 volume |
| Health | **180** | 60 factory + 120 volume |
| Music | **180** | 60 factory + 120 volume |
| Art | **180** | 60 factory + 120 volume |
| Civics | **180** | 60 factory + 120 volume |
| Languages | **180** | 60 factory + 120 volume. Speak courses are extra, under `/lingo` |
| Logic | **180** | 60 factory + 120 volume |
| Digital | **180** | 60 factory + 120 volume |

**None under 60.** Grand total **2,700** paths (**+1,799** new). About one in five volume lessons ships a captioned teaching diagram.

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
| Project complete (first time) | the project’s `xp` (typically 90 / 120 / 150) |
| Lab close with 3-card loadout | +20 |

Levels: Spark → Scout → Pathfinder → Specialist → Scholar → Contender → Polymath → Mastery.

Daily streak uses the **Australia/Sydney** calendar date, not the browser time zone.

## Binder (knowledge cards)

Cards are parts, symptoms, tools, procedures — not stickers. Catalog: `src/content/bench-cards.ts` (asserted ≥40 cards and ≥5 fusion recipes). Owned state lives on `progress.bench` in the same localStorage object.

**Drops (never on skip):**

| Event | Drop |
| --- | --- |
| Learn bite finished | Exactly one ticket. Same concept → same card. Deterministic. |
| Bite correct | Path card (not crest, not glue). First print is unique; repeats dust that unique. Named `cardId` wins. Otherwise ~12% a tighter related pick (domain sheet / path / tags); the rest use the existing domain pool. |
| Bite wrong | No card. Skip and try beats also print nothing. |
| Brain correct (first time that item) | At most one ticket. Seed is `brain:{cat}:{itemId}` so a scroll session does not reprint one card. Most prints come from the general pool; **12%** are category-related (`RELATED_DROP_RATE`). The last 8 prints are excluded when another card is available. Skip / wrong / repeat = nothing. |
| Lab ticket closed | Exactly one ticket from the ticket’s tags. Loadout cards take wear. |
| Domain sheet full | Crest seal only — not a loot roll. |
| Named fusion recipe | Glue ticket only. Ghost crafts stay visible on the tray. |
| Weekly bench special | Optional one extra print from a rotting domain. Still not random rarity. |

Duplicates: later prints dust the unique (no second copy). Fusion spends dust only — a unique never goes below 1. No shop, no IAP, no Night Pack.

**Add a card:** append a `BenchCard` in `src/content/bench-cards.ts` (`body` is the back face). Add a unique diagram in `src/components/card/CardArt.tsx`. Optional `slot` for the chassis, `sheetId` to deep-link from `/reference/[sheetId]`, `tags` so path/lab/brain drops can find it. Add a `FusionRecipe` if it should combine.

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

**Factory volume (same schema):** add a unique `vx-` or `vy-` seed in `scripts/topics/extra/<subject>.mjs` (first pass) or `scripts/topics/extra/more/<subject>.mjs` (balance pass) — `pack()` rows: id, cluster, title, fact, trap, move, extra — then `npm run catalog`. Floor for extra seeds is **1,400** (`VOLUME_FLOOR`). A later balance pass tops every hub to **180** paths. About one in five volume lessons also gets a captioned `ContentFigure` diagram.

**Hand-authored (originals):**

1. Add a `Domain` with `subject` in `src/content/domains.ts` or `domains-school.ts`
2. Author a `Lesson` under `src/content/lessons/` and a `Quiz` under `src/content/quizzes/`
3. Add checks in `src/content/path-checks.ts` or `path-checks-school.ts` (`afterHeading` must match a section heading)
4. `lessonToPath` compiles intro + sections + checks + recap

Client UI reads domain metadata from `@/content/registry` (no lesson/quiz/check JSON). Lab tickets stay AI-generated (`src/lib/ai-tickets.ts`). Subject challenges are static in `src/content/challenges.ts`. Brain Gym packs are generated JSON under `src/content/brain/packs/`. Language courses are generated JSON under `src/content/lingo/packs/`. Hands-on projects live in `src/content/projects/` (`stem.ts`, `world.ts`, `make-life.ts`) and are listed from `/projects`.

## Adding a project

1. Add a `Project` in the matching `src/content/projects/*.ts` file (`id`, `subject`, `title`, `blurb`, `goal`, `materials`, ordered `steps`, `checklist`, optional `pathIds`, `difficulty`, `minutes`, `xp`)
2. Keep Australian English where the rest of the hub does. Floor is **3 real projects per subject** (asserted at import)
3. Optional `pathIds` should be existing domain ids so a finished path can suggest the project
4. Optional `figure` on the project or a `figure` on a step (`diagramFigure` / `imageFigure` / `videoFigure` from `src/content/figures.ts`)

## Adding a figure (paths and projects)

Teaching media is a `ContentFigure` (`kind`: `diagram` | `image` | `video`) with **alt** and **caption**. Colour is never the only legend — diagrams use labels, ticks, solid vs dashed.

**Where it hangs**

- `Lesson.figure` — opening beat of a path
- `LessonSection.figure` — that section’s hook beat (`lessonToPath` copies it)
- `Project.figure` / `ProjectStep.figure` — rendered by `TeachFigure`

If a path has no authored figure, `lessonToPath` still attaches a captioned diagram from the domain map or `diagramForCluster(cluster, subject)` so factory paths are not blank.

**How to add one**

```ts
import { diagramFigure, imageFigure, videoFigure } from "@/content/figures";

figure: diagramFigure(
  "rear-io", // see TeachDiagramId in src/content/types.ts
  "Alt text that works without the drawing.",
  "Caption: what to notice. Labels in the drawing are the legend.",
)

figure: imageFigure("/figures/my-port-photo.webp", "Alt…", "Caption…") // file in public/figures/

figure: videoFigure(
  "https://www.youtube.com/watch?v=AYdF7b3nMto",
  "Alt / iframe title",
  "Caption. Optional extra — the path still stands if they skip it.",
  "Credit · no autoplay",
)
```

New labelled SVGs go in `src/components/teach-diagrams.tsx` (add the id to `TeachDiagramId`). Prefer that over stock photos. Embeds use youtube-nocookie / Vimeo, `loading="lazy"`, **no autoplay**. Raster images: keep them small, `loading="lazy"`.

Sample set already wired: Core 1 mobile / networking / hardware, Core 2 OS / security, Maths number-sense, Science ecosystems, plus Projects (cable map, Wi-Fi map, budget, room scale, food web, study timer, fact-check, suburb map, 4-bar, privacy audit).

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Zod.
