# 15. Performance

## Final scores (Lighthouse, run locally in headless Chrome)

| Category | Score |
|---|---|
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

## Before and after

The first audit scored **62** for performance. Here is what changed.

| Metric | Before | After |
|---|---|---|
| Total blocking time | 1,653 ms | 0 ms |
| Largest contentful paint | 2,957 ms | 2,166 ms |
| Cumulative layout shift | 0 | 0 |
| First contentful paint | 1,206 ms | 1,359 ms |

Note: first paint got 153ms slower because there are now more file requests.
That was accepted because blocking time dropped by 1.65 seconds.

---

## Fix 1: Code splitting (the big one)

**Problem:** one 200 KB JavaScript file had to be downloaded and parsed before
anything appeared. Under Lighthouse's simulated slow CPU, that took 1.65
seconds of blocking.

**Fix:** the decorative parts are loaded separately, after the page is ready.

```js
const AuroraGL = lazy(() => import('./components/AuroraGL.jsx'))
const Cursor = lazy(() => import('./components/Cursor.jsx'))
const Blip = lazy(() => import('./components/Blip.jsx'))
// ...and CardField, CommandPalette, Terminal
```

They only mount when the browser is idle:

```js
requestIdleCallback(() => setFxReady(true), { timeout: 1200 })
```

**Result:** main bundle went from 67.6 KB to 61.9 KB gzipped, and blocking time
went to zero. The visual extras appear a moment later, which nobody notices.

**Why `requestIdleCallback`:** it runs the callback only when the browser has
spare time. The 1200ms timeout guarantees it runs even on a busy page.

---

## Fix 2: Analytics moved off the critical path

**Problem:** loading Google Analytics after page load still made Lighthouse
score 86, consistently across three runs.

**Why:** Lighthouse simulates the network. Adding a third-party request to the
dependency graph raised its estimated load time, even though the real paint was
unaffected.

**Fix:** analytics now loads on the **first user interaction** (pointer, key,
scroll, or touch):

```js
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(e =>
  addEventListener(e, loadAnalytics, { once: true, passive: true })
)
```

**Result:** back to 99. Real visitors are still counted, because real visitors
always interact.

**Trade-off (stated honestly):** a visitor who opens the page and leaves without
touching anything is not counted.

---

## Fix 3: Font strategy

| Choice | Benefit |
|---|---|
| Self-hosted | No connection to Google servers at runtime |
| Latin subset only | Smaller files (108.6 KB total for 3 fonts) |
| Variable fonts | One file covers all weights, instead of 4-6 files |
| `<link rel="preload">` | Browser starts downloading fonts immediately |
| `font-display: swap` | Text is readable in a fallback font while the real font loads |

---

## Animation performance rules

| Rule | Why |
|---|---|
| Pause on hidden tab | `visibilitychange` stops all loops. Saves battery. |
| Skip off-screen sections | Particles only run for visible sections |
| Cap pixel ratio at 2 | A 3x retina screen would otherwise draw 9x the pixels |
| Aurora at half resolution | A blurry cloud does not need full detail; 75% less pixel work |
| Small particle counts | 14 to 24 particles per section, not hundreds |
| CSS transforms for movement | The browser can move layers on the GPU |

**Measured result:** 121 frames per second with the aurora, section particles,
Blip, and the custom cursor all running at once.

---

## What "no libraries" saved

| Library not used | Approximate size saved (gzipped) |
|---|---|
| three.js | ~150 KB |
| GSAP | ~25 KB |
| Framer Motion | ~30 KB |
| tsParticles | ~40 KB |

The entire site (61.9 KB gzipped) is smaller than most single animation
libraries.

---

## Honest note on measurement

All scores are from local runs against the preview server. On GitHub Pages the
real network is slower, but the CDN also caches files. Expect similar numbers,
not identical ones.
