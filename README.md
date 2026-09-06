# Camp Compass

An original US geography adventure for kids. Travel with Pip the lantern fox, learn the fifty states by region, match their capitals, and collect fun facts — with stars, a story journal, and parent reports.

Camp Compass is a sibling of [Keytrail](https://github.com/jlevins2011/typing-game). It uses the same forest-camp branding, Pip the fox, fox-coat profiles, and PIN-protected grown-up reports. Maggie the beagle from the family’s other homeschool games makes a cameo when a trail gets bumpy.

The fox, writing, UI, and quiz content were made for this project. The blank US state outlines are [CC0 public-domain map data](https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg) from Wikimedia Commons.

## Expedition edition · 2.0

An illustrated expedition screen, camp passports, saved trails with pause and resume,
recoverable matching, touch map controls, a searchable journal, and layered chimes.
See [release notes and verification](docs/EXPEDITION-2.0.md).

## Play

Live (after Pages is enabled): [https://jlevins2011.github.io/state-capitals/](https://jlevins2011.github.io/state-capitals/)

Pushes to `main` build the game and publish that URL. GitHub Pages must serve the **`gh-pages`** branch (folder `/`), not the source on `main`.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
```

Progress lives in this browser (`localStorage`). There is no account and no network requirement after the page loads.

## How kids learn

1. **Maple Camp — Northeast** — eleven states from Maine to Maryland. Shapes first, then capitals, then story stones.
2. **Peach Ridge — Southeast** — twelve states from Virginia to Louisiana.
3. **Prairie River — Midwest** — twelve states of lakes, corn, and arches.
4. **Canyon Fire — Southwest** — Texas, Oklahoma, New Mexico, Arizona.
5. **Sunset Summit — West** — eleven states, including Alaska and Hawaii in the map insets.
6. **Night Atlas** — a mixed grand tour and an 85% proficiency exam.

Correct answers light a lantern and unlock a fact in the journal. Misses show the right answer plus a fact, then move on — kids are not stuck. Early camps open on kinder accuracy so the map keeps moving. Stars still reward smoothness. The Night Atlas summit is the proficiency gate.

## Parents

Set a 4-digit PIN on first visit. Reports show time practiced, accuracy, weak states, lesson stars, facts found, and a printable session history. Data stays on the device.

## License

All rights reserved unless you choose another license for commercialization. Map geometry is CC0 as noted above.
