# 14. Shared functions (hooks)

**File:** `src/hooks.js` (111 lines)

These are small reusable functions used by many components. In React, a
function starting with `use` is called a "hook".

---

## `prefersReducedMotion()`

```js
window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

Returns `true` if the visitor has turned on "reduce motion" in their operating
system settings.

**Used by:** every animated component. It is checked before starting any
animation loop.

---

## `useReveal()`

Makes elements fade and slide into view when scrolled to.

**How it works:**
1. Finds all child elements with the class `rv`
2. Watches them with an `IntersectionObserver`
3. When an element becomes 12% visible, adds the class `in`
4. Stops watching that element (it only animates once)

**Why IntersectionObserver instead of scroll events:** the browser handles the
detection natively, off the main thread. Scroll-event checking would run
hundreds of times per second and make scrolling slower.

**Reduced motion:** if enabled, all elements get the `in` class immediately, so
content is visible with no animation.

---

## `useCardFx(maxTilt)`

Gives a card two effects at once:

1. **Spotlight** — sets `--mx` and `--my` CSS variables to the cursor position
   inside the card. CSS uses these to draw a soft light that follows the cursor.
2. **3D tilt** — sets `--rx` and `--ry` rotation variables based on how far the
   cursor is from the card centre.

**Used by:** project card, skill cards, writing card.

**Why CSS variables instead of inline styles:** the JavaScript only writes 4
numbers. All the visual work (gradients, transforms) stays in CSS, where the
browser can optimise it.

---

## `useMagnet(strength, max)`

Makes a button lean slightly toward the cursor when hovered.

```js
translate = clamp(distanceFromCentre × 0.18, max 4px)
```

The movement is capped at 4 pixels, so it is noticeable but not silly.

**Used by:** hero buttons.

**Reduced motion:** returns immediately without moving anything.

---

## `trapFocus(container, event)`

Keeps keyboard focus inside an open dialog.

**How it works:**
1. Finds all focusable elements inside the container
2. If `Tab` is pressed on the last one, jump to the first
3. If `Shift+Tab` is pressed on the first one, jump to the last

**Used by:** command palette, terminal.

**Why it matters:** without it, pressing Tab inside a dialog moves focus to
links hidden behind the dialog. Keyboard users get lost.

---

## `copyToClipboard(text)`

Copies text, with a fallback for older browsers.

```js
if (navigator.clipboard?.writeText) {
  return navigator.clipboard.writeText(text).catch(() => legacy())
}
legacy()
```

The `legacy()` path creates a hidden textarea, selects it, and runs
`document.execCommand('copy')`. It is positioned off-screen at `left: -9999px`
so it never flashes on screen.

**Note:** the modern clipboard API only works on HTTPS or localhost. The
fallback covers plain HTTP and older browsers.

---

## Why these are shared

Before extracting them, the same reveal logic and copy logic appeared in several
components. Sharing them means:
- A bug is fixed once, not five times
- Reduced-motion handling is consistent everywhere
- Each component file stays short and readable
