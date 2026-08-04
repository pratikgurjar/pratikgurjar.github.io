import { useReveal, useCardFx } from '../hooks.js'

const ARTICLES = [
  {
    title: 'What happens in the three seconds after you tap a card',
    teaser:
      'The full life of a contactless payment: EMV cryptograms, ISO 8583, routing, the authorization decision, and why no money moves until tomorrow.',
    meta: 'August 2026 · 8 min read',
    href: '/writing/tap-to-card.html',
  },
]

export default function Writing() {
  const ref = useReveal()
  const fx = useCardFx(2.2)
  return (
    <section className="section" id="writing" ref={ref}>
      <div className="section-head rv">
        <p className="section-eyebrow">07 · Writing</p>
        <h2 className="section-title">After the receipt, the reading</h2>
      </div>
      {ARTICLES.map((a) => (
        <a className="writing-card glow-card rv" href={a.href} key={a.href} {...fx}>
          <h3 className="writing-title">{a.title}</h3>
          <p className="writing-teaser">{a.teaser}</p>
          <p className="writing-meta">
            {a.meta} <span className="writing-go">read →</span>
          </p>
        </a>
      ))}
    </section>
  )
}
