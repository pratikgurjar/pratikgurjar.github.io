import { useCallback, useRef } from 'react'
import { skills } from '../data.js'
import { useReveal, useCardFx, prefersReducedMotion } from '../hooks.js'

function Chip({ item }) {
  if (!item.url) return <span className="chip">{item.name}</span>
  return (
    <a
      className="chip chip-link"
      href={item.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${item.name} documentation`}
    >
      {item.name}
      <span className="chip-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  )
}

export default function Skills() {
  const ref = useReveal()
  const fx = useCardFx()
  const gridRef = useRef(null)
  const rafRef = useRef(0)

  // Chips lean toward the cursor within a small radius and spring back.
  const magnetize = useCallback((e) => {
    if (prefersReducedMotion()) return
    const mx = e.clientX
    const my = e.clientY
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const chips = gridRef.current?.querySelectorAll('.chip') || []
      for (const chip of chips) {
        const r = chip.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(mx - cx, my - cy)
        if (d < 110 && d > 1) {
          const f = (1 - d / 110) * 7
          chip.style.transform = `translate(${((mx - cx) / d) * f}px, ${((my - cy) / d) * f}px)`
        } else if (chip.style.transform) {
          chip.style.transform = ''
        }
      }
    })
  }, [])

  const release = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    gridRef.current?.querySelectorAll('.chip').forEach((c) => (c.style.transform = ''))
  }, [])

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="section-head rv">
        <p className="section-eyebrow">
          04 · Skills <span className="stamp">AUTHORIZE</span>
        </p>
        <h2 className="section-title">What I work with</h2>
        <p className="section-note">Linked chips open the official docs.</p>
      </div>
      <div className="skills-grid" ref={gridRef} onPointerMove={magnetize} onPointerLeave={release}>
        {skills.map((s, i) => (
          <div className="skill-card glow-card rv" style={{ '--d': `${i * 0.06}s` }} key={s.group} {...fx}>
            <p className="skill-group">{s.group}</p>
            <div className="chips">
              {s.items.map((it) => (
                <Chip item={it} key={it.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
