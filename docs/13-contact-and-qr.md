# 13. Contact section and the QR code

**File:** `src/components/Contact.jsx` (82 lines)

## The receipt design

The contact section is styled as a printed payment receipt, because it is the
final stage (SETTLED) of the payment journey.

| Element | Detail |
|---|---|
| Header | `* TRANSACTION RECEIPT *` |
| Rows | Label, dotted leader line, value |
| Rows shown | STATUS `SETTLED ✓`, AVAILABILITY, LOCATION, AMOUNT DUE `ONE EMAIL` |
| Email button | Large mono text, click to copy |
| Links | Write instead, GitHub, LinkedIn, Resume |
| QR code | Contact card |
| Footer | `thank you · come again` |
| Tear edge | A zigzag CSS pattern at the bottom, like torn paper |

The "AMOUNT DUE ...... ONE EMAIL" row replaced an earlier "CHANNEL ...... EMAIL"
row, which did not communicate anything.

## The email copy button

| Detail | How |
|---|---|
| Copy method | `navigator.clipboard.writeText()` |
| Fallback | A hidden textarea plus `document.execCommand('copy')` for older browsers |
| Feedback | Shows `copied ✓` for 2 seconds |
| Screen readers | The feedback area is `aria-live="polite"` so it is announced |

**Centring fix:** the `copied ✓` label reserves 52px on the right. This pushed
the email off-centre. The fix adds a matching invisible 52px spacer on the left
using `::before`. Measured: 87px gap on both sides, in both states, and the
button does not change width when clicked.

---

## The QR code

### What it does

Scanning it with a phone camera offers to save the contact details. The contact
data is stored **inside the QR pattern itself**, so it works with no internet
connection.

### What it contains

```
BEGIN:VCARD
VERSION:3.0
N:Gurjar;Pratik;;;
TEL:+916265038563
EMAIL:pratikgurjar66@gmail.com
END:VCARD
```

That is the vCard format, version 3.0. Four pieces of data: last name, first
name, phone, email.

### How it was generated

- Generated **once** using the `qrcode` npm package on the command line
- Saved as an SVG file: `src/assets/contact-qr.svg`
- The npm package is **not** part of the website. No QR library ships to the browser.

**Why generate once:** the contact details do not change on every page load.
Generating in the browser would add about 10 KB of JavaScript for no benefit.

### Technical choices

| Choice | Value | Reason |
|---|---|---|
| Error correction | M (medium) | Balances size against damage tolerance |
| Modules | 45 × 45 | Result of the data length |
| Display size | 128px | Gives 2.9 pixels per module |
| Colours | Dark modules on a light tile | Inverted (light on dark) QRs fail on many scanners |
| Format | SVG | Sharp at any size, small file |

### Testing done

The QR was decoded back using the `jsqr` package to confirm the data survives:

| Render size | Pixels per module | Decode result |
|---|---|---|
| 88px | 1.96 | PASS |
| 100px | 2.22 | PASS |
| 128px | 2.89 | PASS |
| 176px | 3.91 | PASS |

At every size the decoded text matched the original vCard exactly.

### Cache safety

The SVG is imported through the build (`import qrUrl from '../assets/contact-qr.svg'`)
instead of being linked from the `public` folder. Vite inlines it into the
JavaScript bundle as a data URI, and the bundle filename contains a content
hash. This means a changed QR can never be served from an old browser cache.

### Not clickable

The QR is a plain `<div>`, not a link. Clicking it does nothing. It was
previously a download link, which triggered a "Save As" dialog. That was
removed on request.

### Known limitation (documented honestly)

On some Android phones, the QR scanner does not pass the vCard to the contacts
importer properly. It flattens the card into a single display-name string, so
the "First name" box can show the full name and the surname can appear twice.

This was tested with three different encodings (structured name, single-field
name, and MECARD format) and all behaved the same, which shows the cause is the
scanner app, not the QR data.

Options that would avoid it (encoding a URL to a `.vcf` file so the phone's real
vCard importer handles it) were tested but not kept, because that requires the
site to be live and connected.
