# 17. SEO, sharing, and analytics

## Result

Lighthouse SEO score: **100**

---

## Meta tags in `index.html`

| Tag | Value | Purpose |
|---|---|---|
| `<title>` | Pratik Gurjar · Backend Engineer, Payments Infrastructure | Shown in search results and the browser tab |
| `description` | One sentence about the work | The grey text under the title in Google |
| `canonical` | https://pratikgurjar.github.io/ | Tells search engines the official URL |
| `theme-color` | #0a0a0f | Colours the browser bar on mobile |
| `viewport` | width=device-width | Required for mobile layout |

---

## Social sharing (Open Graph)

When the link is pasted into LinkedIn, WhatsApp, Slack, or X, these tags control
the preview card:

| Tag | Value |
|---|---|
| `og:type` | website |
| `og:title` | Pratik Gurjar · Backend Engineer, Payments Infrastructure |
| `og:description` | Card payments infrastructure summary |
| `og:url` | https://pratikgurjar.github.io/ |
| `og:image` | https://pratikgurjar.github.io/og.png |
| `twitter:card` | summary_large_image |

**The og.png image** (1200 × 630, 71.3 KB) was generated in this project. It
shows the name, role, availability badge, site URL, and a small network graphic,
using the site's colours. It was made by writing an SVG and converting it to PNG
in the browser using a canvas.

---

## Structured data (JSON-LD)

A block of JSON in `index.html` tells search engines who this page is about:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pratik Gurjar",
  "jobTitle": "Backend Engineer, Payments Infrastructure",
  "url": "https://pratikgurjar.github.io/",
  "email": "mailto:pratikgurjar66@gmail.com",
  "address": { "addressLocality": "Indore", "addressCountry": "IN" },
  "alumniOf": "National Institute of Technology, Tiruchirappalli",
  "sameAs": ["GitHub URL", "LinkedIn URL"]
}
```

**Why:** this is the format Google understands for people. It can link the page
to your name, job, and profiles.

---

## Crawler files

**`robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://pratikgurjar.github.io/sitemap.xml
```
Allows all search engines and points to the sitemap.

**`sitemap.xml`** lists two pages:
- The home page
- The article page (`/writing/tap-to-card.html`)

---

## 404 page

**File:** `public/404.html` (1.8 KB)

GitHub Pages automatically serves this for any URL that does not exist.

| Feature | Detail |
|---|---|
| Design | Matches the site: dark background, indigo 404, mono font |
| Graphic | A flat wire with one last heartbeat blip (SVG, inline) |
| Message | "Route not found. The switch has no rail for this path." |
| Joke | "If it helps: 402 is Payment Required. This is not that." |
| Button | "Back to the network" |
| Technology | Plain HTML and CSS. No JavaScript, no React. |
| `noindex` | Tells search engines not to index the error page |

---

## Analytics

**Service:** Google Analytics (property `G-2594RYWHMC`)

This property already existed from the old version of the site. It was restored
rather than creating a new one.

**How it loads:**

```js
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(e =>
  addEventListener(e, loadGtag, { once: true, passive: true })
)
```

It waits for the first real interaction. This keeps the performance score at 99
(see [15-performance.md](15-performance.md)).

**Verified:** no analytics script before interaction; script present with 4
dataLayer events about one second after a click.

**Trade-off:** a visitor who opens and leaves without interacting is not counted.

**Alternative if you want cookie-free analytics:** GoatCounter is a one-line
replacement for the script tag. This is noted in the repository README.
