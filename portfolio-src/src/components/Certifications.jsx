import { certifications } from '../data.js'
import { useReveal } from '../hooks.js'

export default function Certifications() {
  const ref = useReveal()
  return (
    <section className="section" id="certifications" ref={ref}>
      <div className="section-head rv">
        <p className="section-eyebrow">
          06 · Certifications <span className="stamp">CLEAR</span>
        </p>
        <h2 className="section-title">Certifications</h2>
      </div>
      <div className="recog">
        {certifications.map((r, i) => (
          <div className="recog-row rv" style={{ '--d': `${i * 0.05}s` }} key={r.title}>
            <p className="recog-title">{r.title}</p>
            <p className="recog-detail">{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
