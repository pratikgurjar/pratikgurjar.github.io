# 09. Blip: the packet bot

**File:** `src/components/Blip.jsx` (463 lines)
**Technology:** React state, CSS animations, `setTimeout` timers
**Libraries:** none

Blip is the small robot in the corner. He is built from styled `<span>`
elements, not an image or SVG file.

## How he is drawn

| Part | Element | CSS |
|---|---|---|
| Body | `<button class="blip-body">` | Rounded rectangle, panel colour, indigo border |
| Antenna | `<span class="blip-antenna">` | 2px line with a glowing dot on top |
| Eyes | 2 × `<span class="blip-eye">` | Rounded bars, indigo, with glow |
| Arms | 2 × `<span class="blip-arm">` | Height 0 normally, grows to 14px in full body mode |
| Legs | 2 × `<span class="blip-leg">` | Height 0 normally, grows to 12px |
| zzz | `<span class="blip-zzz">` | Text, hidden unless resting |

**Why CSS instead of an image:** the parts animate independently (eyes narrow,
arms extend, antenna changes colour), and it scales without blurring.

## The state machine

There are three modes, stored in one variable. This is deliberate: one source of
truth prevents conflicting states.

| Mode | Meaning |
|---|---|
| `dock` | Compact form. Sits at the desk or rides the rail. |
| `roam` | Full body with arms and legs. Can teleport. |
| `returning` | Travelling home after using all portals. |

## Behaviour 1: moods

| Mood | Trigger | Appearance |
|---|---|---|
| `alert` | Mouse or scroll activity within 4 seconds | Eyes open, antenna pulses green, faster bob |
| `rest` | No activity for 4 seconds, and not on the rail | Eyes narrow to 3px, antenna grey, `zzz` appears |

**Important detail:** scrolling counts as activity. Earlier only mouse movement
counted, so Blip fell asleep while riding the rail during scrolling. Fixed by
updating the activity timestamp on scroll.

While perched on the rail he never sleeps, by design.

## Behaviour 2: eye tracking

On every mouse move, the code calculates the angle from Blip to the cursor and
moves the pupils up to 2.4px in that direction using CSS variables:

```js
pupils.style.setProperty('--ex', `${(dx / d) * f}px`)
```

When riding the rail, the eyes instead look in the scroll direction.

## Behaviour 3: riding the rail

While you scroll:
1. Blip moves to the rail's pulse position
2. He leans (a CSS rotation animation)
3. He announces each station he passes: "INITIATE. Here we go.",
   "ROUTE locked. Gateway picked.", and so on
4. He bounces at each station

When you stop scrolling, he **stays where he is** on the rail. He only returns
to the desk when the rail leaves the screen (you are back at the hero, or past
the receipt).

Earlier he returned to the desk 1.6 seconds after scrolling stopped, which was
distracting. That was changed.

## Behaviour 4: perched fact ticker

When he is standing still on the rail, every 11 seconds he shows a fact with a
source link. He waits if another message is already showing.

## Behaviour 5: speaking

Clicking Blip (in roam mode) or the "Poke Blip" palette command fetches a
programming joke:

```js
fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode&type=single')
```

- 3 second timeout using `AbortController`
- If it fails, slow, or returns something too long, a local fact is shown instead
- 15 local facts are built in, each with a **verified source URL**

Fact topics: HTTP 402, the 1947 moth bug, ISO 8583, Luhn checksum, TCP
handshake, Git, five nines uptime, the @ symbol, localhost, Dartmouth 1956,
perceptron, the transformer paper, AlexNet, backpropagation, LLM next-token
prediction.

All 15 source URLs were checked with real HTTP requests before being added.

## Behaviour 6: portals (the biggest feature)

Clicking Blip in dock mode unfolds his full body and starts roam mode.

**Rules:**
1. Hold the cursor still for **3 seconds** anywhere reasonable
2. Two portal rings open: one under Blip, one at your cursor
3. He shrinks and rotates into his portal (0.38 seconds)
4. Position jumps instantly while hidden
5. He pops out of the second portal, rotating back
6. He comments on where he landed
7. After **3 portals**, he folds up and returns to the desk

**Guards that prevent bugs:**

| Guard | Purpose |
|---|---|
| No dwell while travelling | Prevents overlapping teleports |
| No dwell within 110px of Blip | Prevents pointless teleports |
| No dwell while palette or terminal is open | Prevents teleporting during typing |
| No dwell when cursor leaves the window | Prevents teleport to a stale position |
| Target clamped to screen edges | Prevents teleporting off-screen |
| Desktop only (fine pointer) | Touch has no hover, so roam is disabled |
| All timers tracked in a Set | Every timer is cleared on unmount |

Verified behaviour: 0 portals at 2.9 seconds, portal opens at 3.0 seconds,
3 hops then automatic return to the exact dock position.

## Behaviour 7: location awareness

When he lands, he reads the page to find out where he is:

```js
document.elementFromPoint(x, y).closest('.skill-card')
```

If he lands on a skill card, he names that group. Otherwise he uses the
section he is inside. This is real DOM reading, not random text.

## Speech bubble rules

- Always attached to Blip, always opening to his **left**
- Flips to open downward when he is near the top of the screen
- Width adapts to available space (maximum 250px)
- If there is less than 170px of room, it tucks **under** him instead
- Text uses `overflow-wrap: break-word` so long words cannot spill out

## Position rules

- Never above the fixed navigation bar (minimum 78px from top)
- Never over the footer (floats up as the footer scrolls in)
- Dock position: 84px from the right edge, above the footer
