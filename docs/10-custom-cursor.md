# 10. Custom cursor

**File:** `src/components/Cursor.jsx` (144 lines)
**Technology:** Canvas 2D (for the sparkline), CSS transforms
**Libraries:** none

The normal mouse pointer is hidden and replaced with a two-part cursor.

## The design: a signal probe

| Part | Behaviour |
|---|---|
| Dot | Follows the mouse exactly, no delay |
| Ring | Follows with a delay (lag), so it trails behind |
| Sparkline | A tiny live graph inside the ring showing your cursor speed |

**Why this design:** the site's visual language is oscilloscopes and signals.
A cursor that measures and displays your own movement matches that. It also
shows live data, which suits an engineer's portfolio.

Three other designs were considered and rejected: a ledger pen with a balance
readout, a packet courier that docks into elements, and a compass beacon
pointing at the nearest link.

## The trailing maths

```js
ringX += (mouseX - ringX) * 0.16
```

This moves the ring 16% of the remaining distance each frame. The result is
smooth easing that never overshoots.

## The sparkline

- Stores the last 22 mouse speeds
- Draws them as a small line graph, 26 × 10 pixels
- Speed is calculated as the distance moved since the last frame
- Flattens to a straight line over links and buttons

## Cursor states

| State | Trigger | Appearance |
|---|---|---|
| `default` | Normal | 30px ring with live sparkline |
| `link` | Over a link or chip | Ring grows to 44px, sparkline flattens |
| `button` | Over a button or CTA | Ring grows to 52px, fills with colour |
| `wire` | Over the hero wire | Ring becomes a 46 × 26 ellipse |
| `card` | Over the dotted card | Ring becomes dashed (means "grab me") |
| `grabbing` | Dragging the card | Ring shrinks to 24px and fills |
| `hidden` | Over a text input | Cursor disappears, normal text caret returns |

Pressing the mouse shrinks the ring to 85% for feedback.

## How states are communicated

Two sources:

1. **DOM check** on mouse move:
   ```js
   if (target.closest('button, .btn')) elState = 'button'
   else if (target.closest('a')) elState = 'link'
   ```
2. **Canvas hint**: the canvas sets `document.documentElement.dataset.canvasHint`
   to `wire`, `card`, or `grabbing`. The cursor reads it.

**Why a data attribute:** the canvas and the cursor are separate components with
no parent-child relationship. A shared attribute on `<html>` lets them
communicate without wiring props through the whole app.

## When it is disabled

```js
const fine = window.matchMedia('(pointer: fine)').matches
if (!fine || prefersReducedMotion()) return
```

- **Touch devices**: no custom cursor (there is no pointer to replace)
- **Reduced motion**: no custom cursor (the trailing motion could be unpleasant)

In both cases the component renders nothing and the normal system cursor is used.

## Why `cursor: none` is applied carefully

The CSS hides the pointer on `html`, links, buttons, and chips. It is *not*
hidden on text inputs, so the text caret still appears where you need it.
