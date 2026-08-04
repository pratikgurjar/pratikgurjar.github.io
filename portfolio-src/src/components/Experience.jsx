import { useState } from 'react'
import { experience } from '../data.js'
import { useReveal } from '../hooks.js'

function Role({ r }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? r.bullets : r.bullets.slice(0, r.collapsedCount)
  const hidden = r.bullets.length - r.collapsedCount

  return (
    <article className="role rv">
      <div className="role-head">
        <h3 className="role-company">{r.company}</h3>
        <p className="role-title">{r.role}</p>
        <p className="role-period">{r.period}</p>
      </div>
      <p className="role-context">{r.context}</p>
      <ul className="role-bullets">
        {shown.map((b) => (
          <li key={b.slice(0, 32)}>{b}</li>
        ))}
      </ul>
      {hidden > 0 && (
        <button className="role-more" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          {expanded ? '− show less' : `+ ${hidden} more`}
        </button>
      )}
      <div className="chips">
        {r.tech.map((t) => (
          <span className="chip" key={t}>
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function Experience() {
  const ref = useReveal()
  return (
    <section className="section" id="experience" ref={ref}>
      <div className="section-head rv">
        <p className="section-eyebrow">
          02 · Experience <span className="stamp">ROUTE</span>
        </p>
        <h2 className="section-title">Five years, two platforms</h2>
      </div>
      <div className="timeline">
        {experience.map((r) => (
          <Role key={r.company} r={r} />
        ))}
      </div>
    </section>
  )
}
