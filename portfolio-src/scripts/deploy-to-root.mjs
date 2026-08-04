// Syncs the Vite build output (dist/) to the repo root for GitHub Pages.
// Never touches portfolio-src/ or the .git directory.
import { cpSync, existsSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const src = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(src, 'dist')
const root = join(src, '..')

if (!existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first')
  process.exit(1)
}

// Remove previous build output at root (assets/ is fully generated).
for (const entry of ['assets', 'index.html', 'fonts']) {
  const p = join(root, entry)
  if (existsSync(p)) rmSync(p, { recursive: true })
}

for (const entry of readdirSync(dist)) {
  cpSync(join(dist, entry), join(root, entry), { recursive: true })
}

writeFileSync(join(root, '.nojekyll'), '')
console.log('Deployed dist/ → repo root. Review and push yourself.')
