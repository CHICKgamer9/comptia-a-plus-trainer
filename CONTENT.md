# Learn and Lingo beat contract

TicketBench is an independent study tool. It is not CompTIA, Brilliant, or Duolingo.

Live gold paths:

- Learn Start Here: `/learn/tech/tech-start`
- Learn Mobile Devices: `/learn/tech/mobile-devices`
- Lingo French U1 L1: `/lingo/fr/fr-u01-l01`

## Learn beats

A cluster is 6–12 beats. One idea each. Illegal if one beat does two of: define, contrast, decide, quiz.

Order: `hook → see → try → name → contrast → decide → lock`

Every beat has:

- `iCan` — six-word completion after “I can”
- `speak` or `{ silent: true }`
- `objective`
- `termsIntroduced` when a token is born
- `lockLine` on the lock beat
- `cardId` on **decide only**

`cardHook` on decide must equal the following lock `lockLine`. Skip still drops no card. A correct decide with `cardId` awards that card.

### Banned copy

No meta XP, streak, Binder, 4-minute, “see it once”, or “pocket picture”. No unlabeled diagrams. No multi-distinction paragraphs. First acronym is expanded. Quiz tokens must already live in `termsIntroduced`. No UX field tips.

### Prose

Concrete noun + active verb + one claim. First FRU is “field-replaceable unit”. Tech distractors are jumpy-tech mistakes.

`see` puts labels **on** the SVG. One drawing, one story.

### Speak

1–2 sentences, ≤18 words each. Periods, not em-dashes. Commas, not slashes. Pronounce so-dimm, M two, U S B C. Never CONCEPT, WHY, FIELD TIP, 4 MIN, CORE 1, buttons, or options. No praise. No `[stage directions]`. Screen text may differ from spoken. Auto-read uses `speak` only.

Keep this line in Start Here: “Name the failing piece before you order a motherboard.”

Start Here teaches a swollen pack before any quiz and awards `c-li-ion`, never USB-C PD.

Mobile Devices teaches a soldered CPU before the first quiz. Lock: “A thin-and-light faster CPU means a different laptop.”

## Lingo items

First item for a new lemma is never a quiz.

Flow: `introduce` (audio autoplay, big word, image, gloss, phonetic, free Continue) → `listen-pick` → `contrast?` → `produce` → `speak?` (only if a mic exists) → `reuse`

`new: true` ⇒ `type: introduce`. Match only after 3–5 lemmas, only among taught. Distractors from taught lemmas only. Titles are situations.

`speakTarget` is the native voice. `speakGloss` is a second English narrator utterance after a gap. Never one voice for both.

French / Indonesian / Icelandic U1 L1: “Say hello at the door.” Bonjour / Halo / Halló first.

## TTS

Renderers never call `speechSynthesis`. They call `lib/tts/speak.ts`.

- `speak({ text, lang, role: "narrator" | "target" })` → `{ stop, ended }`
- `cancelAll()` on beat, route, and Continue
- Auto-read awaits `ended`, then enables Continue. It does not click Continue.
- Auto-read defaults off. The choice persists. Global mute is separate.
- Neural if `ELEVENLABS_API_KEY` or `OPENAI_API_KEY`, else Web Speech
- Cache by hash
- One English narrator for all Learn
- Native `fr` / `id` / `is` for target only
- Web Speech: never `voices[0]`; neural/premium en → en-AU → en-GB → en-US; rate 0.92–1; cancel before utter; split on periods with a 280ms gap
- Calm / Off only. No 40-voice picker
- Never stringify React children or `innerText`

## Linter

`npm test` runs `lessonLint` and TTS tests. Old Start Here fixture must fail. The three gold lessons must pass.
