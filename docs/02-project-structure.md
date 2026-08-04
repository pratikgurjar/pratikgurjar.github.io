# 02. Project structure, build, and deploy

## Two folders, two jobs

```
pratikgurjar.github.io/
├── index.html          <- the live website (built output)
├── assets/             <- built JS and CSS (auto-generated)
├── fonts/              <- the 3 font files
├── writing/            <- the article page
├── 404.html            <- error page
├── og.png              <- social sharing image
├── contact-qr.svg      <- QR code image
├── Pratik_Gurjar_Resume.pdf
├── robots.txt, sitemap.xml, favicon.svg
├── .nojekyll           <- tells GitHub not to process the files
│
├── portfolio-src/      <- the SOURCE CODE (edit here)
└── docs/               <- these documents
```

**Rule:** edit files inside `portfolio-src/`. Never edit files in the root by
hand, because the build overwrites them.

## Inside portfolio-src

```
portfolio-src/
├── index.html          <- page shell, meta tags, analytics snippet
├── package.json        <- dependency list
├── vite.config.js      <- build settings
├── scripts/
│   └── deploy-to-root.mjs   <- copies build output to repo root
├── public/             <- files copied as-is (fonts, pdf, 404, robots)
└── src/
    ├── main.jsx        <- starting point, 10 lines
    ├── App.jsx         <- lists all sections in order, 111 lines
    ├── data.js         <- all the text content, 164 lines
    ├── hooks.js        <- shared functions, 111 lines
    ├── assets/         <- QR code (goes through the build)
    ├── styles/
    │   └── index.css   <- all styling, 1166 lines
    └── components/     <- 18 component files
```

## File sizes (source lines)

| File | Lines | What it does |
|---|---|---|
| styles/index.css | 1166 | All styling |
| components/SignalCanvas.jsx | 722 | Wire, rail, all section particles |
| components/Blip.jsx | 463 | The robot |
| components/AuroraGL.jsx | 254 | Background colour cloud |
| components/CardField.jsx | 249 | Dotted payment card |
| components/Project.jsx | 230 | Project section and SQL terminal |
| components/Terminal.jsx | 167 | Hidden terminal |
| data.js | 164 | Text content |
| components/Cursor.jsx | 144 | Custom mouse pointer |
| App.jsx, hooks.js | 111 each | Page assembly, shared functions |
| components/CommandPalette.jsx | 108 | Cmd+K menu |
| Other 11 components | 24-82 each | Normal page sections |

Total: 4,430 lines.

## The three commands

```bash
cd portfolio-src

npm install          # install dependencies (run once)
npm run dev          # local dev server with live reload, http://localhost:5173
npm run build        # create the production files in dist/
npm run deploy:local # copy dist/ to the repository root
```

## What the build produces

| File | Size | Gzipped | When it loads |
|---|---|---|---|
| index.html | 3.65 KB | 1.32 KB | First |
| index-[hash].css | 25.66 KB | 6.08 KB | First |
| index-[hash].js | 190.11 KB | 61.90 KB | First |
| Blip-[hash].js | 10.80 KB | 4.52 KB | After page is ready |
| AuroraGL-[hash].js | 5.00 KB | 2.30 KB | After page is ready |
| CardField-[hash].js | 4.60 KB | 2.12 KB | After page is ready |
| Terminal-[hash].js | 3.51 KB | 1.78 KB | After page is ready |
| CommandPalette-[hash].js | 2.38 KB | 1.12 KB | After page is ready |
| Cursor-[hash].js | 2.35 KB | 1.14 KB | After page is ready |

**Why the split:** the main file must load before the page appears. The visual
extras are not needed for reading, so they load later. This is why the
performance score is 99 instead of 62. See [15-performance.md](15-performance.md).

**Why `[hash]` in the filename:** the hash changes when the file content
changes. This forces browsers to download the new version instead of showing an
old cached one.

## The deploy script

`scripts/deploy-to-root.mjs` does four things:

1. Checks that `dist/` exists (fails clearly if you forgot to build)
2. Deletes the old `assets/`, `fonts/`, and `index.html` from the root
3. Copies everything from `dist/` to the root
4. Creates an empty `.nojekyll` file

**Why `.nojekyll`:** GitHub Pages runs a tool called Jekyll by default, which
ignores folders starting with an underscore. This empty file turns that off so
the files are served exactly as they are.

**The script never touches `.git` or `portfolio-src/`.** It cannot delete your
source code.

## Hosting

GitHub Pages serves the repository root as a website. There is no build step on
GitHub. You build on your computer and commit the result. This means:

- No build minutes used
- No CI configuration
- What you test locally is exactly what goes live
