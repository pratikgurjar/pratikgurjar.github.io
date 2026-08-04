# 16. Accessibility

## Result

- **Lighthouse accessibility score: 100**
- **axe-core violations: 0**

Before the audit: score 95, with 1 serious violation and 46 unverifiable items.

---

## Fix 1: Text contrast

**Problem:** the muted text colour `#6e6e78` measured **3.9:1** against the
background. The WCAG AA standard requires **4.5:1** for small text.

**Fix:** raised the colour tokens. Contrast was calculated against the *worst
case* background (where the aurora brightens it), not just flat black.

| Token | Before | After |
|---|---|---|
| `--text-2` | #9b9ba6 | #bcbcc6 |
| `--text-3` | #8a8a94 | #a2a2ad |
| body copy | #c4c4cd | #dcdce3 |

**Measured contrast after the change** (16 text styles checked):

| Element | Ratio |
|---|---|
| About body text | 17.7:1 |
| Experience bullets | 14.5:1 |
| Hero tagline, chips, summaries | 10.5:1 |
| Dates, meta, footer | 7.8:1 |

Lowest value on the page: **7.8:1**. The requirement is 4.5:1.

**Why one change fixed everything:** all colours come from CSS variables, so
editing 3 values updated every element on the site.

---

## Fix 2: Label mismatch

**Problem:** the ⌘K button had `aria-label="Open command palette"`, but its
visible text was "⌘K". This breaks WCAG rule 2.5.3, which requires the label to
contain the visible text. Voice control users saying "click ⌘K" would fail.

**Fix:** the label now starts with the visible text: `aria-label="⌘K command palette"`.

---

## Fix 3: Keyboard traps in dialogs

Automated tools cannot test open dialogs, so this was checked by hand.

| Problem | Fix |
|---|---|
| Tab escaped the dialog to links behind it | Added `trapFocus()` so Tab cycles inside |
| Focus was lost when a dialog closed | Focus now returns to the element you came from |
| The page scrolled behind an open dialog | `body { overflow: hidden }` while open |

**Verified:** focusing the last item and pressing Tab moves to the first item.

---

## Built-in accessibility features

| Feature | Implementation |
|---|---|
| Skip link | First tab stop, jumps past the nav to the content |
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` |
| Heading order | One `<h1>`, then `<h2>` per section, then `<h3>` |
| Focus rings | 2px visible outline on every focusable element |
| Decorative canvases | All marked `aria-hidden="true"` so screen readers skip them |
| Hidden buttons | `tabIndex={-1}` when invisible (back-to-top button) |
| Live regions | `aria-live="polite"` on the copy confirmation and Blip's speech |
| Expandable content | `aria-expanded` on the "+ 5 more" button |
| Hero name | `aria-label` on the `<h1>`, letter spans `aria-hidden`, so it is not read letter by letter |
| QR image | `alt=""` with a visible caption, so it is announced once, not twice |

---

## Reduced motion support

Every animated component checks:

```js
window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

| Component | Behaviour when reduced motion is on |
|---|---|
| Wire and rail | One static frame, repainted only on scroll |
| Section particles | Not drawn at all |
| Aurora | One static frame |
| Card | Static, assembled, front face only |
| Blip | No riding, no portals, no bobbing. Still clickable for facts. |
| Custom cursor | Not rendered. Normal system cursor is used. |
| Reveals | Content appears immediately, no fade or slide |
| Storm | Refuses to run, prints a message instead |

There is also a global CSS rule:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

This catches anything missed in JavaScript.

---

## Touch device handling

| Feature | On touch |
|---|---|
| Custom cursor | Disabled |
| Blip roam and portals | Disabled (needs hover) |
| Card | Hidden below 1000px |
| Ledger tape | Hidden below 1240px |
| SQL terminal | Hidden below 900px |
| Blip tap to speak | Works |
| All content and navigation | Works |
