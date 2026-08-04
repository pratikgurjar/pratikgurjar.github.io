# 08. CardField: the dotted payment card

**File:** `src/components/CardField.jsx` (249 lines)
**Technology:** Canvas 2D with hand-written 3D maths
**Libraries:** none (no three.js)

The rotating card made of dots, on the right side of the hero.

## Why a card and not a globe

A rotating dotted globe is the most common hero graphic in developer
portfolios. A payment card:
- Matches the actual job (card payments)
- Uses the same dot-particle style
- Is not used by everyone else

## How the dots are built

About 700 points are generated in code:

| Group | How it is made |
|---|---|
| Card body | 30 × 19 grid, corners rounded by a distance check |
| Border | Edge points drawn brighter and larger |
| Chip | 7 × 5 grid of dots |
| Contactless waves | 3 arcs of 7 points each |
| Card number | 4 groups of 4 dots (masked number style) |
| Name row | 6 small dots |
| Magstripe (back) | 28 × 3 band |
| Signature strip (back) | 14 dashes |
| CVV (back) | 3 bright dots |

Each point stores: position (x, y, z), size, opacity, and which face it belongs
to (front = 1, back = -1, both = 0).

## The 3D maths

There is no 3D library. Each frame, for every point:

1. **Rotate around the Y axis** (spin left-right)
   ```
   X = x·cos(yaw) + z·sin(yaw)
   Z = -x·sin(yaw) + z·cos(yaw)
   ```
2. **Rotate around the X axis** (tilt up-down)
3. **Perspective divide** (far things look smaller)
   ```
   f = 3.6 / (3.6 + Z)
   screenX = centreX + X × scale × f
   ```
4. **Draw a circle** at that screen position

## Face hiding

Front dots fade out as the card turns away, back dots fade in:

```js
if (front face)  visibility = clamp(cos(yaw) × 3)
if (back face)   visibility = clamp(-cos(yaw) × 3)
```

**Why multiply by 3:** it makes the crossover sharper, so both faces are not
visible at the same time. When the card is edge-on, almost nothing shows, like a
real thin object.

## Interactions

| Action | Result |
|---|---|
| Load | Dots fly in from random positions and assemble (1.3 seconds) |
| Move mouse over it | Card tilts toward the cursor |
| Move mouse near a dot | Dot grows up to 1.9× and brightens (within 90px) |
| Drag left/right | Card spins, with momentum |
| Release after drag | Keeps spinning, slows down, then snaps flat to the nearest face |
| Quick click | Flips exactly half a turn to show the other side |
| Storm easter egg | Card shakes for 9 seconds |
| Idle | Gentle sway |

### Spin physics

```js
spin += spinVelocity
spinVelocity *= 0.965          // friction

if (|spinVelocity| < 0.002) {   // nearly stopped
  rest = round(spin / π) × π    // nearest flat face
  spin += (rest - spin) × 0.08  // ease into it
}
```

Measured: a drag threw the card to 9.87 radians; it coasted and settled at
exactly 5π (snap error 0.000). A quick click added exactly π (half turn).

### Click versus drag

```js
const quick = (time held < 260ms) && (movement < 6px)
```

This prevents a small accidental movement during a click from being treated as
a drag.

## Cursor states

- Hovering the card: cursor ring becomes dashed (meaning "you can grab this")
- Dragging: ring shrinks and fills

## Limits

| Limit | Value | Reason |
|---|---|---|
| Hidden below | 1000px screen width | On small screens there is no room; text comes first |
| Pixel ratio cap | 2 | Avoids drawing 9x pixels on 3x screens |
| `touch-action: pan-y` | | Vertical scrolling still works when a finger passes over the card |
| Reduced motion | Static assembled front face | No spinning, no assembly animation |
