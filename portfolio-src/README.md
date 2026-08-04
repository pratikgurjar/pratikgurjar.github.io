# Portfolio source

Vite + React. The deployed site lives at the repo root (GitHub Pages serves it as-is).

## Workflow

```bash
npm install          # once
npm run dev          # local dev at http://localhost:5173
npm run build        # production build into dist/
npm run deploy:local # copy dist/ to the repo root (then review, commit, push)
```

Content lives in `src/data.js` and comes from the resume only. The resume PDF served by the site is `public/Pratik_Gurjar_Resume.pdf`; replace it there when the resume changes, then rebuild and redeploy.

`_old-site-backup/` at the repo root holds the previous Jekyll site. It is gitignored; delete it whenever.
