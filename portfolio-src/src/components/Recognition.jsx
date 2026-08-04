import { recognition } from '../data.js'
import { useReveal } from '../hooks.js'

export default function Recognition() {
  const ref = useReveal()
  return (
    <section className="section" id="recognition" ref={ref}>
      <div className="section-head rv">
        <p className="section-eyebrow">
          05 · Recognition <span className="stamp">CAPTURE</span>
        </p>
        <h2 className="section-title">Education and ranks</h2>
      </div>
      <div className="recog">
        {recognition.map((r, i) => (
          <div className="recog-row rv" style={{ '--d': `${i * 0.05}s` }} key={r.title}>
            <p className="recog-title">{r.title}</p>
            <p className="recog-detail">{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
