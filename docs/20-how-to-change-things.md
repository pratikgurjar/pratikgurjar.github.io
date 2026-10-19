# 20. How to change things

Every change follows the same three steps:

```bash
cd portfolio-src
# 1. edit the file
npm run build          # 2. build
npm run deploy:local   # 3. copy to the repo root
git add -A && git commit -m "..." && git push   # 4. publish
```

---

## Change your job title, email, or links

**File:** `src/data.js`, the `identity` object

```js
export const identity = {
  name: 'Pratik Gurjar',
  eyebrow: 'Backend · Payments infrastructure',
  availability: 'Immediate Joiner',
  location: 'Indore, India',
  email: 'pratikgurjar66@gmail.com',
  github: 'https://github.com/pratikgurjar',
  linkedin: 'https://www.linkedin.com/in/pratik-gurjar',
  resume: '/Pratik_Gurjar_Resume.pdf',
}
```

**Also update if the email changes:** the QR code and the JSON-LD block in
`index.html`. The QR must be regenerated (see below).

---

## Add a job

**File:** `src/data.js`, the `experience` array

```js
{
  company: 'Company Name',
  role: 'Your Role',
  period: 'Jan 2027 to present',
  context: 'One line about the work.',
  tech: ['Java', 'Go'],
  bullets: ['First achievement.', 'Second achievement.'],
  collapsedCount: 5,        // how many bullets show before "+ more"
}
```

Add it to the **top** of the array for reverse-chronological order.

---

## Add a skill

**File:** `src/data.js`, the `skills` array

```js
{ name: 'Kotlin', url: 'https://kotlinlang.org/' }
```

Use `url: null` if there is no official site. **Check the URL works before
adding it.**

---

## Update the resume PDF

1. Put the new PDF at `portfolio-src/public/Pratik_Gurjar_Resume.pdf`
2. Build and deploy

The filename must stay the same, or update `identity.resume` in `data.js`.

---

## Regenerate the QR code

Only needed if your phone number or email changes.

```bash
mkdir /tmp/qr && cd /tmp/qr
npm init -y && npm install qrcode
node -e "
const QR=require('qrcode');
const v=['BEGIN:VCARD','VERSION:3.0','N:Gurjar;Pratik;;;',
  'TEL:+916265038563','EMAIL:pratikgurjar66@gmail.com','END:VCARD',''].join('\r\n');
QR.toString(v,{type:'svg',errorCorrectionLevel:'M',margin:2,
  color:{dark:'#0a0a0f',light:'#f2f2f5'}}).then(s=>require('fs').writeFileSync('qr.svg',s));
"
cp qr.svg <project>/portfolio-src/src/assets/contact-qr.svg
```

Then build and deploy. Test by scanning it before publishing.

---

## Add a new section

1. Create `src/components/NewSection.jsx`, copying `Certifications.jsx` as a
   starting point
2. Import and add it in `src/App.jsx` in the right position
3. Add a link in `src/components/Nav.jsx`
4. Add a jump command in `src/components/CommandPalette.jsx`
5. Add a colour in `SECTION_HUES` in both `SignalCanvas.jsx` and `AuroraGL.jsx`
6. If it should be a payment stage, add it to `STATIONS` in `SignalCanvas.jsx`
   and to `STATION_LINES` in `Blip.jsx`, and renumber the sections after it

---

## Change colours

**File:** `src/styles/index.css`, the `:root` block at the top

```css
:root {
  --bg: #0a0a0f;              /* page background */
  --panel: #121218;           /* card background */
  --line: #23232d;            /* borders */
  --text: #f2f2f5;            /* headings */
  --text-2: #bcbcc6;          /* body text */
  --text-3: #a2a2ad;          /* dates, meta */
  --accent: #5b54e8;          /* buttons */
  --accent-bright: #8b87f7;   /* highlights */
  --ok: #3ecf8e;              /* green ticks */
}
```

**Warning:** if you darken the text colours, check contrast stays above 4.5:1.
The current lowest is 7.8:1.

Canvas colours are separate. They use `hsla()` with the section hue and are
inside the component files.

---

## Add a new article

1. Copy `public/writing/tap-to-card.html` to a new filename
2. Replace the content, title, description, and canonical URL
3. Add an entry to the `ARTICLES` array in `src/components/Writing.jsx`
4. Add the URL to `public/sitemap.xml`

---

## Turn off an effect

| Effect | How to disable |
|---|---|
| Blip | Remove `<Blip />` from `App.jsx` |
| Aurora | Remove `<AuroraGL />` from `App.jsx` |
| Custom cursor | Remove `<Cursor />` from `App.jsx` |
| Dotted card | Remove the `<CardField />` block from `Hero.jsx` |
| Section particles | Remove the field name from `FIELD_DRAWERS` in `SignalCanvas.jsx` |

Each is independent. Removing one does not break the others.

---

## Test before publishing

```bash
npm run preview          # serves the built files locally
```

Then check:
1. Scroll top to bottom, watch the stamps appear
2. Scroll back up, confirm they clear
3. Press Cmd+K, try a command
4. Open the terminal, type `help`
5. Click Blip
6. Check the browser console for errors
7. Resize the window narrow to check mobile layout
