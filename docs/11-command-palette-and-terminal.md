# 11. Command palette and terminal

## Part 1: Command palette

**File:** `src/components/CommandPalette.jsx` (108 lines)
**Opens with:** `Cmd+K` (Mac) or `Ctrl+K` (Windows), or the ⌘K button in the nav

### Commands available

| Command | Action |
|---|---|
| Jump to about / experience / project / skills / recognition / certifications / writing / contact | Smooth scroll to that section |
| Copy email | Copies the email address |
| View resume | Opens the PDF in a new tab |
| Open GitHub | Opens the GitHub profile |
| Open LinkedIn | Opens the LinkedIn profile |
| Open terminal | Opens the hidden terminal |
| Poke Blip | Makes Blip say a fact |

### How it works

- Typing filters the list (simple text match, case-insensitive)
- Arrow keys move the selection
- `Enter` runs the selected command
- `Escape` closes
- Clicking the dark background closes

### One bug that was found and fixed

Originally `Enter` was handled with `if (e.key === 'Enter')` inside `onKeyDown`.
Testing showed the key event was not always delivered with a usable `key` value.

**Fix:** the palette is now a real `<form>` element and uses `onSubmit`. The
browser fires submit natively when Enter is pressed in a text field. This is
more reliable and also works with different keyboards, IME input, and mobile "Go"
buttons.

The same fix was applied to the terminal.

---

## Part 2: The terminal

**File:** `src/components/Terminal.jsx` (167 lines)
**Opens with:** the "Open terminal" command in the palette

A fake command line at the bottom of the screen.

### Commands

| Command | Output |
|---|---|
| `help` | Lists all commands |
| `whoami` | Short profile summary |
| `skills` | All skill groups and items |
| `ai` | The applied-AI summary, ending with a rule of thumb |
| `contact` | Email, GitHub, LinkedIn |
| `resume` | Opens the resume PDF |
| `8583` | Prints a fake ISO 8583 message breakdown with field numbers |
| `storm` | Triggers the aurora storm easter egg |
| `clear` | Clears the screen |
| `exit` | Closes the terminal |

Unknown commands print `command not found: <x>. try 'help'`.

### Notes

- The `8583` output is a **fake, synthetic** message. The PAN is masked. It
  exists to explain the format, not to show real data.
- `storm` respects reduced motion: if the visitor has it on, it prints
  "reduced motion is on. the sky stays calm for you." and does not fire.

---

## Shared behaviour: both overlays

| Feature | How |
|---|---|
| Focus trap | Tab cycles inside the overlay only, never behind it |
| Focus restore | When closed, focus returns to the element you were on |
| Scroll lock | `document.body.style.overflow = 'hidden'` while open |
| Escape to close | Works in both |
| Screen readers | `role="dialog"`, `aria-modal="true"`, and a label |

The focus trap is a shared function, `trapFocus()`, in `src/hooks.js`.

---

## Part 3: The storm easter egg

**Triggered by:** the `storm` terminal command, or the Konami code
(↑ ↑ ↓ ↓ ← → ← → B A) typed anywhere on the page.

**Duration:** 9 seconds, then it calms down automatically.

**What happens:**

| Layer | Effect |
|---|---|
| Aurora | Time runs 4× faster, energy up, hue swings ±38°, random white lightning |
| Wire | Six random bumps hit at once |
| Rail | Three ripples fire |
| Card | Shakes |
| Blip | Says "Storm in the network. Hold on to something." |

**Measured:** average screen brightness rose from 20.7 to 55.1 (2.66×), with
lightning peaks at 260 against a calm maximum of 70. It returned to 19.9 after
the window ended.

The Konami listener ignores keystrokes typed inside input fields, so it cannot
fire while you are using the palette or terminal.
