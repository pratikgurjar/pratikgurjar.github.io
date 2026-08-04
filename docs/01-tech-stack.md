# 01. Tech stack: every tool used and why

## Runtime dependencies (ship to the browser)

| Library | Version | Why it is used |
|---|---|---|
| react | ^18.3.1 | Builds the page from small reusable components. Handles state changes (for example: Blip is awake or asleep). |
| react-dom | ^18.3.1 | Puts React components onto the real web page. |

That is the complete list. Two packages.

## Build dependencies (used only on your computer, not shipped)

| Library | Version | Why it is used |
|---|---|---|
| vite | ^6.0.0 | Bundler. Turns many source files into a few small files for the browser. Also runs the local dev server. |
| @vitejs/plugin-react | ^4.3.4 | Lets Vite understand React's JSX syntax (HTML written inside JavaScript). |

## Tools used once, then discarded

These were used to generate files. They are not part of the project.

| Tool | Used for | Why it is not in the project |
|---|---|---|
| qrcode (npm) | Generated the QR code image | The QR is a fixed image. No need to generate it in the browser. |
| jsqr (npm) | Read the QR code back to test it | Testing only. |
| pngjs (npm) | Read PNG pixels during QR testing | Testing only. |
| lighthouse (npx) | Measured speed and accessibility scores | Testing only. |
| axe-core (CDN) | Found accessibility problems | Testing only, loaded in the browser during checks. |
| Apple Pages | Converted the resume .docx to .pdf | One-time conversion. |

## Animation libraries that were NOT used, and why

| Library | Common use | Why it was skipped |
|---|---|---|
| GSAP | Animation timelines | The animations here are physics loops, not timelines. Plain `requestAnimationFrame` does the job with no download. |
| Framer Motion | React animations | Adds about 30 KB. The same reveals and hovers are done with CSS transitions at no cost. |
| three.js | 3D graphics | Adds 150 KB or more. The card and the aurora needed only simple maths, so raw Canvas 2D and one WebGL shader were enough. |
| tsParticles | Particle effects | Ready-made particle looks are generic. Custom particles here carry meaning (ledger rows, tokens hitting a guard). |
| Lenis | Smooth scrolling | The browser's own smooth scrolling was enough. |
| Tailwind CSS | Utility CSS | Plain CSS with variables was enough for one page and keeps the CSS file small. |

**Result:** zero animation libraries. All motion is hand-written.

## Browser features used instead of libraries

| Browser feature | Used for |
|---|---|
| Canvas 2D API | The wire, the rail, section particles, the dotted card |
| WebGL + GLSL shader | The aurora colour cloud in the background |
| requestAnimationFrame | The animation loop (runs about 60-120 times per second) |
| IntersectionObserver | Detects when a section scrolls into view, to start reveals |
| CSS custom properties (variables) | All colours and spacing, so themes change in one place |
| CSS transitions and keyframes | Hovers, fades, blinking cursor, stamps |
| Clipboard API | Copy email button |
| matchMedia | Detects `prefers-reduced-motion` and mouse-vs-touch |
| Page Visibility API | Pauses animation when the browser tab is hidden |
| Fetch API | Loads a joke from a public API for Blip |

## External services

| Service | Used for | Cost | Notes |
|---|---|---|---|
| JokeAPI (v2.jokeapi.dev) | One programming joke when Blip is clicked | Free, no signup | Safe mode is on. If it fails or is slow (3 second limit), a local fact is shown instead. |
| Google Fonts | Downloaded the 3 font files once | Free | Fonts are now self-hosted. The site does not call Google at runtime. |
| Google Analytics | Counting visitors | Free | Loads only after the first user interaction. |
| GitHub Pages | Website hosting | Free | Serves the files in the repository root. |

## Fonts

| Font | File size | Used for |
|---|---|---|
| Space Grotesk | 21.8 KB | Big headings and names |
| Inter | 47.3 KB | Normal reading text |
| JetBrains Mono | 39.5 KB | Code-style text, labels, terminal, stamps |

All three are:
- Free and open source
- Self-hosted (stored in this project, not fetched from Google)
- Latin characters only (smaller file size)
- Variable fonts (one file covers all weights)
