# 12. Page sections and small UI parts

## Section order

Set in `src/App.jsx`:

```
Hero -> About -> Experience -> Project -> Skills
     -> Recognition -> Certifications -> Writing -> Contact
```

---

## Hero

**File:** `src/components/Hero.jsx` (69 lines)

| Element | Notes |
|---|---|
| Eyebrow | "BACKEND · PAYMENTS INFRASTRUCTURE" in mono font |
| Name | Each letter is a separate `<span>` so it can animate individually |
| Tagline | Key terms are highlighted in brighter text |
| Buttons | View resume, GitHub, LinkedIn. All are magnetic (see below). |
| Availability badge | Green pulsing dot, "Open to new roles · Indore, India" |
| SCROLL cue | Anchored to the bottom of the hero, with an animated drip line |

**Interactive typography:** hovering a letter of the name makes it thinner
(weight 700 to 400), lifts it 5px, and colours it. This works because the font
is a *variable font*, so any weight is available without loading a new file.

**Accessibility note:** the `<h1>` has `aria-label="Pratik Gurjar"` and each
letter span is `aria-hidden`, so screen readers read the name normally instead
of letter by letter.

---

## About

**File:** `src/components/About.jsx` (46 lines)

Three paragraphs. The first is larger and brighter than the other two.

**Ledger tape:** a column on the right showing fake transaction rows scrolling
upward (`AUTH 4021 **** 8814 ₹2,150.00 OK`). It pauses when hovered. Hidden
below 1240px screen width, where there is no room.

All tape data is **synthetic**. No real transaction data is used.

---

## Experience

**File:** `src/components/Experience.jsx` (56 lines)

Vertical timeline with a dot per role.

| Feature | Detail |
|---|---|
| Collapsed bullets | Razorpay shows 5 of 10 bullets, with a "+ 5 more" button |
| Expand | Button toggles, `aria-expanded` updates for screen readers |
| Tech chips | Small labels under each role |

---

## Project

**File:** `src/components/Project.jsx` (230 lines)

The TableTalk card, plus a background terminal.

**Background terminal:** 20 scripted scenes cycle forever, showing a question
being typed and either a result or a block:

- Questions are typed **character by character** with random delays of 26-74ms,
  so it looks like a human typing
- Answers appear **instantly**, because machine output does not type
- A blinking block cursor sits at the end of the line being typed
- Between scenes, a bare prompt with a blinking cursor waits

10 of the 20 scenes are dangerous statements (`DROP TABLE`, `DELETE`,
`TRUNCATE`, `GRANT`, `UPDATE`, `ALTER`, `INSERT`) that get blocked in red.

The window shows the last 5 lines, stacked from the bottom, with older lines
fading out at the top. The box is a fixed 126px tall so it never overlaps the
project card below it (measured gap: 31px).

---

## Skills

**File:** `src/components/Skills.jsx` (80 lines)

Six cards, one per group.

| Feature | Detail |
|---|---|
| Linked chips | 38 chips open official documentation, marked with a small ↗ |
| Plain chips | 27 concept chips with no official site are not links |
| Magnetic chips | Chips within 110px of the cursor lean toward it, up to 7px |
| Card tilt | Each card tilts in 3D toward the cursor |

---

## Recognition and Certifications

**Files:** `Recognition.jsx`, `Certifications.jsx` (24 lines each)

Simple row lists. Title on the left, detail on the right.

---

## Small shared UI parts

### Navigation bar

**File:** `src/components/Nav.jsx` (54 lines)

- Fixed at the top
- Becomes semi-transparent with a blur after scrolling 24px
- Contains a 2px scroll progress bar that fills as you scroll
- Section links are hidden below 720px width; the ⌘K button remains

### Back to top button

**File:** `src/components/BackToTop.jsx` (63 lines)

| Feature | Detail |
|---|---|
| Appears | After scrolling 500px |
| Progress ring | An SVG circle whose `stroke-dashoffset` shows scroll progress |
| Position | Bottom-left, floats above the footer as it comes into view |
| Keyboard | `tabIndex={-1}` while hidden, so it cannot be tabbed to invisibly |

### Stamps and seals

- Stamps (`INITIATE`, `ROUTE`, ...) animate in with a rotate-and-scale effect,
  like a rubber stamp hitting paper
- They are added and removed by the rail, so the journey replays

### Reveal animation

Elements with the class `rv` start invisible and 22px lower. When they scroll
into view, an `IntersectionObserver` adds the class `in`, and CSS transitions
them into place. A `--d` variable adds a per-item delay for staggering.
