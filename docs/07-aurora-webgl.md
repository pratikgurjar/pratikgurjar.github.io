# 07. Aurora: the WebGL background

**File:** `src/components/AuroraGL.jsx` (254 lines)
**Technology:** WebGL 1.0 with a hand-written GLSL fragment shader
**Libraries:** none (no three.js)

This is the soft coloured cloud behind everything.

## Why WebGL and not an image or CSS

| Option | Problem |
|---|---|
| A PNG image | Static. Cannot react to scroll or cursor. Large file. |
| CSS gradients | Cannot do organic, cloud-like noise. |
| three.js | 150 KB or more for something this simple. |
| **Custom shader** | About 2 KB of code. Runs on the graphics card, so the CPU stays free. |

## How a fragment shader works (short version)

A fragment shader is a small program that runs **once for every pixel**, at the
same time, on the graphics card. It receives the pixel position and returns a
colour. Because thousands of pixels are calculated in parallel, it is very fast.

## The shader's steps

1. **Hash function**: turns a coordinate into a repeatable pseudo-random number
2. **Noise function**: smooths those random numbers between grid points
3. **fbm (fractal brownian motion)**: adds 4 layers of noise at increasing detail
   and decreasing strength. This creates a cloud-like texture.
4. **Domain warping**: uses noise to distort the input of more noise. This is
   what makes the shapes swirl instead of looking like static fog.
5. **Colour**: converts the section's hue number to RGB, mixes two tones
6. **Vignette**: darkens the edges of the screen

## Inputs from JavaScript (uniforms)

| Uniform | Meaning |
|---|---|
| `u_res` | Canvas size in pixels |
| `u_t` | Time (drives the drift) |
| `u_hue` | Current section colour |
| `u_m` | Mouse position (0 to 1) |
| `u_v` | Scroll speed (0 to 1) |
| `u_storm` | Storm strength (0 to 1) |
| `u_flash` | Lightning brightness |

## Behaviour

| Input | Visual result |
|---|---|
| Scrolling | Clouds brighten and become more active. Measured: average brightness doubles (19.5 to 39.9) during fast scrolling. |
| Mouse movement | Clouds drift slightly, plus a soft glow follows the cursor |
| Section change | Colour shifts to the new section's hue |
| Storm command | Time runs 4x faster, hue swings ±38°, random white flashes |

## Performance choices

| Choice | Reason |
|---|---|
| Renders at **half resolution** | A blurry cloud does not need full pixels. This cuts pixel work by 75%. |
| 4 noise layers, not 8 | 8 looks slightly better and costs twice as much |
| Single triangle, not two | One triangle covering the screen avoids a seam and one extra vertex |
| Pauses when tab hidden | Saves battery |

## Failure handling

```js
const gl = canvas.getContext('webgl', {...})
if (!gl) return          // no WebGL: component renders nothing
```

If the shader fails to compile, a warning is logged and the component stops. The
site keeps working; only the background cloud is missing.

## A tuning mistake that was measured and fixed

The first shader version was too dim to see. Measured: average pixel brightness
9.1 out of 765, with only 1.6% of the screen lit.

Values were raised, then re-measured: brightness 20.7, with 31.5% of the screen
lit. This is the current version.

## Stacking order (important)

The aurora canvas is **opaque** (`alpha: false`). It must sit *below* the wire
and rail canvas.

At one point the code-splitting change caused the aurora to load *after* the
other canvas, and since both had the same stacking level, the aurora covered the
wire and rail completely. They were still being drawn, but invisible.

**Fix:** explicit stacking in CSS:

```css
.aurora-canvas { z-index: 0; }
.net-canvas    { z-index: 1; }
```

**Lesson recorded in the code comments:** never rely on load order for stacking.
