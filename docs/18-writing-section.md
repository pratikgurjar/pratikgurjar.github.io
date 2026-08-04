# 18. Writing section and the article

## The section

**File:** `src/components/Writing.jsx` (33 lines)
**Position:** stage 07, between Certifications and Contact

A single card linking to the article. The card shows the title, a short summary,
the date and reading time, and an arrow that slides right on hover. It tilts in
3D like the project card.

**Design decision:** this section has **no lifecycle stamp**. The seven payment
stages stay seven. Writing is reading material placed inside the journey, not a
step of the payment.

---

## The article

**File:** `public/writing/tap-to-card.html` (about 12.6 KB)
**URL:** `/writing/tap-to-card.html`
**Title:** "What happens in the three seconds after you tap a card"
**Length:** about 1,200 words, 8 minute read

### Why a separate HTML file, not a React page

| Reason | Detail |
|---|---|
| Speed | No JavaScript at all. It is text; text does not need a framework. |
| Sharing | A real URL that can be posted anywhere |
| SEO | Search engines read it directly with no JavaScript execution |
| Simplicity | One self-contained file, easy to copy or move |

It uses the same three fonts and the same colours as the main site, so it does
not feel like a different website.

### Structure

The article follows the same seven stages as the site:

| Section | Stage tag |
|---|---|
| The tap itself | INITIATE |
| Becoming a message | AUTHENTICATE |
| Finding the issuer | ROUTE |
| The decision | AUTHORIZE |
| The part nobody sees | CAPTURE · CLEAR |
| Money, finally | SETTLED |
| Why this design has lasted | (no tag) |

### What it covers

- NFC powering the chip, and the EMV cryptogram the card generates
- Why the card number alone is nearly useless
- ISO 8583 message format, the bitmap, field numbers (2, 4, 55), MTI `0100`
- Tokenization: why a breach leaks tokens, not card numbers
- BIN lookup and routing to the issuer
- The issuer's checks: cryptogram validation, limits, fraud models
- Response code `0110`, `00` means approved, and stand-in processing
- That approval is only a promise; no money has moved yet
- Capture, clearing, interchange, T+1 settlement, reconciliation
- Why the old architecture has survived

### Content safety

All content is **public payments knowledge** (EMVCo specifications, ISO
standards, how card networks work). Nothing from internal or restricted
documents appears. No employer systems, no internal architecture, no real data.

### One honest note included

The article explains a real ordering difference that a payments person would
notice:

> At a terminal the card authenticates itself the instant you tap, before
> anything is routed. Online there is no chip in the room, so authentication
> happens after the gateway is chosen, as a 3-D Secure challenge.

This was added because the site's rail uses the online order, while the article
describes a physical tap.

### SEO on the article

It has its own canonical URL, description, Open Graph tags, and is listed in
`sitemap.xml`.

### Note

The article is written but **should be edited into your own voice** before you
consider it final. It is technically accurate, but the phrasing is not yours.
