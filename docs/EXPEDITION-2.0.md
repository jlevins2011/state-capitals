# Camp Compass 2.0 — Expedition edition

The player journey now connects a campsite title screen, a focused six-camp expedition,
state discoveries, short learning trails, and passport celebrations. Existing v1 family
and lesson records stay in `camp-compass.v1`; no progress reset is required.

## Gameplay

- Resume a trail after returning to camp or reloading. Drafts are separate from completed
  sessions, and are cleared only after finishing. One current trail is saved per explorer.
- Pause explicitly or automatically when the browser tab is hidden. Reported practice
  time excludes the introduction and pauses.
- Match all four pairs even after a mistake. Each correct pair earns one lantern; misses
  are attributed to the selected state. Completed pairs cannot score twice. Existing
  historical sessions retain their original scoring.
- Map zoom, pan, reset, keyboard selection, and removal of answer-revealing hover labels.
- Correct answers are highlighted, corrections remain until acknowledged, and streaks
  celebrate consecutive correct answers without imposing a time limit.
- Camp passport stamps require the regional exam. Later camps remain locked until the
  preceding trail is passed. Stars are achievement scores, not a spendable currency.
- Field guides show names, capitals, and nicknames before non-exam trails. The searchable
  journal collects state stories. Overview lanterns use state discoveries, not lesson IDs.
- Local artwork and system fonts avoid runtime font or image services. All animations
  respect reduced motion; sound controls mute both new notes and the active output.

## Family platform boundary

Curriculum stays in `src/data`, scoring in `src/lib/quiz.ts`, persistence in
`src/lib/storage.ts`, and session ownership in `src/store/StoreContext.tsx`.
`src/lib/familyServices.ts` converts a completed session into a versioned learning receipt
with a stable event ID. A future shared family host can consume those receipts and map
local child IDs to its own students without coupling lessons to account management.

This release does not link accounts or grant Lumen Isles credits. The host must verify
learning events, deduplicate event IDs, apply parent policies, and authorize credit or
playtime awards. Browser-local receipts are not trusted payment or credit authorization.

## Verification

`npm test` covers curriculum, quiz generation, unlocks, map labels and geometry, state
discoveries, stamps, sound behavior, and draft persistence. `npm run build` typechecks
and produces the static release. For a browser playthrough, run a development server
on 127.0.0.1:5174 and `npm run test:browser`. Install the Playwright Chromium browser
with `npx playwright install chromium` if Chrome is not present. `CAMP_TEST_URL` and
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` can override the target and browser.

The browser suite uses synthetic explorers and only permits localhost traffic. It
checks fresh and legacy progress, pause/reload recovery, completed trail scoring,
matching errors and recovery, next-trail state reset, passport unlocks, small screens,
keyboard map controls, journal filtering, settings, and parent entry. Screenshots go
to the operating-system temporary directory. Physical iPad testing is separate.

## Artwork

`public/art/camp-dusk.webp` was created with the built-in image generation tool, then
encoded as WebP for delivery. The full generation prompt is in `docs/ART-PROMPT.txt`.

## 2.0.1 — Fun facts without testing

Fun-fact and nickname questions are removed from all trails and exams. The six former
trivia trails now review state identification and capitals, retaining their lesson IDs
so completed progress, earned stars, and unlocks remain valid. Facts appear after
answers as “Just for fun · not tested” and enter the journal regardless of whether the
geography answer was correct. They never contribute their own score.

An unfinished saved deck containing old trivia restarts with geography-only questions;
its old partial trivia score is not carried forward. Completed records are untouched.
