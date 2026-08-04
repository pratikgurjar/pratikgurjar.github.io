# 19. How the parts talk to each other (event bus)

## The problem

The site has parts that need to react to each other:

- Blip must know when the rail passes a station
- The canvas must know when Blip teleports, to draw sparks
- The aurora, wire, card, and Blip must all react to the storm command

These parts are in **different components with no parent-child relationship**.
Passing data through React props would mean threading values through many
layers of components that do not care about them.

## The solution: browser events

The site uses the browser's own event system on the `window` object. Any part
can send an event; any part can listen.

```js
// sender
window.dispatchEvent(new CustomEvent('rail:station', {
  detail: { id: 'about', passed: true }
}))

// listener
window.addEventListener('rail:station', (e) => {
  console.log(e.detail.id, e.detail.passed)
})
```

## The four events

| Event | Sent by | Listened to by | Carries |
|---|---|---|---|
| `rail:station` | SignalCanvas (rail) | Blip | Section id, and whether it was passed |
| `blip:teleport` | Blip | SignalCanvas | The x,y where he arrived |
| `blip:react` | SignalCanvas (token kick) | Blip | A message to say |
| `blip:speak` | Command palette | Blip | (nothing) |
| `aurora:storm` | Terminal, Konami code | AuroraGL, SignalCanvas, CardField, Blip | (nothing) |

## What each event does

### `rail:station`
Fired when the scroll pulse passes a station dot. Blip uses it to announce the
stage name while riding.

### `blip:teleport`
Fired when Blip arrives from a portal. The canvas draws 12 sparks at that point.

### `blip:react`
Fired when a token that Blip kicked hits the guard line. Blip says
"Kicked one straight at the guard. Still caught it. Every time."
Rate-limited to once every 9 seconds.

### `aurora:storm`
Fired by the `storm` command or the Konami code. Four separate components react
independently, without knowing about each other.

## Why this design is good here

| Benefit | Explanation |
|---|---|
| No coupling | The canvas does not import Blip. Either can be deleted without breaking the other. |
| Easy to extend | A new component can listen to `aurora:storm` with three lines, no other file changes. |
| Native | No library needed. `CustomEvent` is built into browsers. |
| Debuggable | You can listen to any event from the browser console to watch it fire. |

## Cleanup rule

Every component removes its listeners when it unmounts:

```js
useEffect(() => {
  window.addEventListener('aurora:storm', onStorm)
  return () => window.removeEventListener('aurora:storm', onStorm)
}, [])
```

Without this, listeners would pile up and cause memory leaks.

## The other communication channel: a data attribute

For continuous state (not one-time events), the canvas writes to an attribute on
the `<html>` element:

```js
document.documentElement.dataset.canvasHint = 'wire'
```

The custom cursor reads it every frame to decide its shape. This suits values
that change constantly, where firing an event each time would be wasteful.
