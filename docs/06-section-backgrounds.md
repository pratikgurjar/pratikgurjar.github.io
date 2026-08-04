# 06. Section background fields

**File:** `src/components/SignalCanvas.jsx` (the field drawing functions)
**Technology:** Canvas 2D
**Libraries:** none

Each section has its own moving background. All six are drawn on the same
canvas as the wire and rail.

## The six fields

| Section | What moves | Reacts to cursor | Reacts to Blip |
|---|---|---|---|
| About | Rising glyphs: digits, ₹, "OK" | Glyphs dodge away | Glyphs orbit around him |
| Experience | Short dashes flowing right (time dust) | Dust parts | Dust flows around him |
| Project | Small squares moving toward a dashed line | — | He kicks them at the line |
| Skills | A grid of dots (circuit board) | Dots brighten near cursor | Board lights up under him, plus a ring |
| Recognition | Drifting circles (seals) | — | Circles drift toward him |
| Contact | Falling paper specks | — | Paper bounces off his head |

## The Project field explained

This one carries meaning. It shows the TableTalk project's safety guard:

1. Squares flow from the left toward a dashed vertical line
2. The dashed line sits at the left edge of the project card (the "AST guard")
3. About 1 in 5 squares turn **red and bounce back** at the line
4. The rest pass through

When Blip is in the section, any square that comes within 32 pixels of him is
**kicked**: it turns brighter, speeds up to 3.4-5.0 pixels per frame, and flies
at the guard line. When a kicked square hits the line, six red sparks burst out,
and Blip says a line about it (limited to once every 9 seconds).

**Why:** the project is a tool that generates SQL and blocks dangerous
statements. The background shows that idea without words.

## A bug that was found and fixed

Particles first stored their position in **screen coordinates**. When the page
scrolled, the section moved but the particles did not, so they drifted outside
their section and disappeared.

**Detection:** a pixel-counting test scanned the canvas per section. Four of six
sections returned 0 lit pixels.

**Fix:** particles now store **section-local coordinates** (`lx`, `ly`, measured
from the section's own top-left corner). Each frame they are converted to screen
position using the section's live rectangle.

**After fix:** all six sections returned thousands of lit pixels (about 3,600 to
9,200 each).

## Performance rules

```js
if (section is off-screen by more than 40px) {
  fields.delete(id)     // free the particles
  continue              // skip all work
}
```

Particle counts are small on purpose:

| Field | Particle count |
|---|---|
| About | 24 |
| Experience | 22 |
| Project | 18 |
| Recognition | 14 |
| Contact | 24 |
| Skills | grid, calculated by screen size |

Measured result: 121 frames per second with fields running.

## Reduced motion

If the visitor has "reduce motion" enabled in their operating system, no fields
are drawn at all. Only the static wire and rail appear.
