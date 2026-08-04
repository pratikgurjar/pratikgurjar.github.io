# pratikgurjar.github.io

Portfolio of Pratik Gurjar, backend engineer working on card payments infrastructure. Live at [pratikgurjar.github.io](https://pratikgurjar.github.io/).

The site tells one story: a payment moving through its lifecycle. Scrolling advances a pulse down a rail through seven stations, INITIATE to SETTLED, and every layer of the page plays along.

## What is in here

**The wire.** An oscilloscope line in the hero with an idle heartbeat. It bends around the cursor, and clicking it jumps to that stage of the journey. Hover it and the seven lifecycle stops appear.

**The rail.** A vertical line running the length of the page. As you scroll, a pulse travels it and stamps each section with the real card lifecycle, in order: INITIATE, ROUTE, AUTHENTICATE, AUTHORIZE, CAPTURE, CLEAR, SETTLED. Authentication and authorization are deliberately separate stations, because they are separate steps. Scroll back up and the journey resets, ready to replay.

**The card.** The hero centerpiece is a payment card drawn as roughly 700 particles with a chip, contactless arcs and masked PAN groups. Drag it to spin with inertia, click to flip it over, and it settles snapped to a face. There is a magstripe on the back.

**The aurora.** A WebGL fragment shader renders a domain-warped nebula behind everything. It tints to the active section, gains energy while you scroll, and parallaxes toward the cursor.

**Blip.** The resident packet bot. He rides the rail while you scroll and narrates the stations, wakes and sleeps with your activity, speaks programming facts on click (JokeAPI with a local fallback), and, once deployed to full body, portals to wherever your cursor rests for three seconds. Three hops and he folds up and goes home.

**Section fields.** Each section has its own ambient particle system: rising ledger glyphs, streaming time-dust, a token stream that a dashed guard line keeps blocking, a circuit lattice, drifting seals, falling receipt paper. Blip is a physical presence in all of them. He kicks tokens.

**Writing.** One article, served as a plain HTML page with zero JavaScript: what happens in the three seconds after you tap a card. The contact section is a printed receipt, complete with a scan-to-save QR code and a tear-off edge.

There is a command palette on ⌘K. There is a terminal in it. The terminal knows a few commands the help text does not spoil. Try the sky.

## Engineering notes

- Vite + React. No animation libraries: no GSAP, no Framer Motion, no three.js. Every effect is hand-rolled canvas 2D, one WebGL shader, and CSS.
- Critical bundle around 60 KB gzipped. The decorative layer code-splits into six chunks that load after `requestIdleCallback`.
- Lighthouse (local, headless): performance 99, accessibility 100, best practices 100, SEO 100. Zero axe-core violations.
- Contrast holds WCAG AA against worst-case shader-brightened backgrounds. Overlays trap focus and restore it. Everything honors `prefers-reduced-motion` with static fallbacks.
- Three fonts, latin subsets only, self-hosted. Total font payload around 111 KB.
- The systems talk over window events (`rail:station`, `blip:teleport`, `aurora:storm`), so layers subscribe to each other without imports.

## Repo layout

```
/                  deployed build (GitHub Pages serves this as-is)
portfolio-src/     source: components, styles, scripts
docs/              21 plain-English explainers: every feature, every tool, and why
_old-site-backup/  previous Jekyll site, gitignored, kept locally
```

Workflow lives in [portfolio-src/README.md](portfolio-src/README.md): `npm run build`, then `npm run deploy:local` copies the build to the repo root.

Analytics is Google Analytics (idle-loaded so it never touches paint). A lighter cookie-free alternative like GoatCounter is a one-line swap in `portfolio-src/index.html`.
