# 05. SignalCanvas: the wire and the rail

**File:** `src/components/SignalCanvas.jsx` (722 lines)
**Technology:** Canvas 2D API, `requestAnimationFrame`
**Libraries:** none

This is the largest component. It draws three things on one full-screen canvas:
the wire, the rail, and all the section particle fields (particles are covered
separately in [06-section-backgrounds.md](06-section-backgrounds.md)).

---

## Part 1: The wire

The horizontal line in the hero section.

### How it is drawn

- The line is made of **120 points** (`N = 120`) spread left to right
- Each point has a vertical offset that can move
- Every frame, the points are joined with straight lines
- Drawn twice: once thick and faint (glow), once thin and bright (the line)

### Physics: how it bends

Each point behaves like a weight on a spring:

```
velocity += -0.08 * offset - 0.12 * velocity
offset   += velocity
```

- `-0.08 * offset` pulls the point back to the centre line (spring)
- `-0.12 * velocity` slows it down (friction)

**Why a spring:** it produces a natural wobble that settles by itself. No
animation timeline is needed.

### What makes it move

| Trigger | Effect |
|---|---|
| Mouse near the line | Points within 110px are pulled toward the cursor |
| Idle heartbeat | Every 2.8 seconds a small bump travels across |
| Click on the line | Two bumps fire out, left and right |
| Storm easter egg | Six random bumps at once |
| Blip standing on it | A 12px dip appears under his feet |

The heartbeat shape uses this formula:

```js
beatShape(t) = exp(-t²) × (1 - t²)
```

This gives a rise-and-dip shape, like an ECG line.

### Stage labels

When the mouse is near the wire, seven tick marks and labels appear.

**They follow the wire.** For each label, the code:
1. Samples the wire's height at that x position (interpolating between the two
   nearest points)
2. Calculates the slope at that point
3. Rotates the tick and text to match the slope

**Why:** originally the labels sat at a fixed height while the wire bent past
them, which looked detached. Now the label group moves with the line. Measured:
pulling the wire down 22px moved the label group down 22px.

### Position

The wire's height is not a fixed percentage. It is calculated from the layout:

```js
y = midpoint between (availability badge bottom) and (SCROLL cue top)
minimum 26px below the badge, minimum 34px above the cue
```

**Why:** a fixed percentage (86% of the hero height) broke on short screens,
where the badge ended up below the line. Reading the real element positions
fixes this at any screen height.

---

## Part 2: The rail

The vertical line on the left, running from the About section to Contact.

### What it draws

| Element | Description |
|---|---|
| Base line | Faint, full length |
| Travelled line | Brighter, from the top down to the pulse |
| Pulse | A bright dot with a gradient tail, at 42% of screen height |
| Stations | 7 dots, one per section |
| Ripples | A circle expands when a station is passed |

### How stations work

For each section, the code checks whether its position is above or below the
pulse:

```js
const done = stationY <= pulseY
setStation(id, done)
```

When the state changes, three things happen:
1. The dot fills in (or empties)
2. The CSS class `stamped` is added to that section's stamp chip
3. A `rail:station` event is fired, which Blip listens to

**Why an event:** the canvas does not need to know Blip exists. Any part of the
site can listen. See [19-event-bus.md](19-event-bus.md).

### Replayable

The state is recalculated every frame from the current scroll position. Nothing
is remembered permanently, so scrolling up genuinely reverses the journey.
Measured: 7 stamps at the bottom, 0 stamps back at the top, stamps return on the
second scroll down.

---

## Colour changes by section

Each section has a hue number (0-360):

| Section | Hue |
|---|---|
| Hero | 245 |
| About | 243 |
| Experience | 254 |
| Project | 264 |
| Skills | 234 |
| Recognition | 248 |
| Certifications | 252 |
| Writing | 258 |
| Contact | 272 |

Every frame the current hue moves 4% closer to the target hue. This makes the
colour drift slowly instead of jumping.

## Performance protections

| Protection | How |
|---|---|
| Pause when tab is hidden | `visibilitychange` event stops the loop |
| Skip off-screen work | Section particles only run when the section is visible |
| Retina limit | Pixel ratio capped at 2, so 3x screens do not draw 9x pixels |
| Reduced motion | Draws one static frame, repainted on scroll only |
