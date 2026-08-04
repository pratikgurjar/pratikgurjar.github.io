# Portfolio documentation: start here

This folder explains how the portfolio is built. One file per feature.

## Reading order

| # | File | What it covers |
|---|---|---|
| 01 | [01-tech-stack.md](01-tech-stack.md) | Every tool and library used, and why |
| 02 | [02-project-structure.md](02-project-structure.md) | Folder layout, build, deploy |
| 03 | [03-content-data.md](03-content-data.md) | Where the text comes from |
| 04 | [04-payment-lifecycle-concept.md](04-payment-lifecycle-concept.md) | The idea the whole site is built on |
| 05 | [05-signal-canvas-wire-and-rail.md](05-signal-canvas-wire-and-rail.md) | The line in the hero and the rail on the left |
| 06 | [06-section-backgrounds.md](06-section-backgrounds.md) | The moving particles in each section |
| 07 | [07-aurora-webgl.md](07-aurora-webgl.md) | The colour cloud in the background |
| 08 | [08-card-field.md](08-card-field.md) | The dotted card in the hero |
| 09 | [09-blip-the-bot.md](09-blip-the-bot.md) | The robot: states, movement, portals |
| 10 | [10-custom-cursor.md](10-custom-cursor.md) | The custom mouse pointer |
| 11 | [11-command-palette-and-terminal.md](11-command-palette-and-terminal.md) | Cmd+K menu and the hidden terminal |
| 12 | [12-sections-and-ui.md](12-sections-and-ui.md) | Normal page sections and small UI parts |
| 13 | [13-contact-and-qr.md](13-contact-and-qr.md) | Receipt block and the QR code |
| 14 | [14-hooks-and-shared-code.md](14-hooks-and-shared-code.md) | Shared functions used everywhere |
| 15 | [15-performance.md](15-performance.md) | Speed work and measured numbers |
| 16 | [16-accessibility.md](16-accessibility.md) | Accessibility work and measured numbers |
| 17 | [17-seo-and-analytics.md](17-seo-and-analytics.md) | Search engines, sharing, visitor counting |
| 18 | [18-writing-section.md](18-writing-section.md) | The article page |
| 19 | [19-event-bus.md](19-event-bus.md) | How the parts talk to each other |
| 20 | [20-how-to-change-things.md](20-how-to-change-things.md) | Common edits you may want to make |

## One paragraph summary

The site is a single page built with React and Vite. It has no animation
libraries. Every animation is written by hand using the browser's own drawing
tools (Canvas 2D, one WebGL shader, and CSS). The whole page tells one story: a
card payment moving through its seven steps, from start to settled.

## Key numbers (measured, not estimated)

| Thing | Value |
|---|---|
| Main JavaScript file, gzipped | 61.9 KB |
| CSS file, gzipped | 6.08 KB |
| Extra JavaScript chunks | 6 files, loaded after the page is ready |
| Fonts | 3 files, 108.6 KB total |
| Lighthouse performance | 99 |
| Lighthouse accessibility | 100 |
| Lighthouse best practices | 100 |
| Lighthouse SEO | 100 |
| Frames per second | 121 (measured with all effects running) |
| Total source lines | 4,430 |
