import { lazy, Suspense, useEffect, useState } from 'react'
import { identity } from '../data.js'
import { useReveal, useMagnet } from '../hooks.js'

const CardField = lazy(() => import('./CardField.jsx'))

export default function Hero() {
  const ref = useReveal()
  const magnet = useMagnet()
  const [fxReady, setFxReady] = useState(false)

  useEffect(() => {
    const go = () => setFxReady(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(go, { timeout: 1200 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(go, 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <header className="hero" id="top" ref={ref}>
      {fxReady && (
        <Suspense fallback={null}>
          <CardField />
        </Suspense>
      )}
      <p className="hero-eyebrow rv">{identity.eyebrow}</p>
      <h1 className="hero-name rv" style={{ '--d': '0.08s' }} aria-label={identity.name}>
        {identity.name.split('').map((ch, i) =>
          ch === ' ' ? (
            <span key={i} aria-hidden="true">
              {' '}
            </span>
          ) : (
            <span className="hero-letter" key={i} aria-hidden="true">
              {ch}
            </span>
          ),
        )}
      </h1>
      <p className="hero-tagline rv" style={{ '--d': '0.16s' }}>
        I build the rails cards run on: <em>tokenization</em>, <em>payment authentication</em> and{' '}
        <em>routing</em>. The systems that move money and are not allowed to go down.
      </p>
      <div className="hero-ctas rv" style={{ '--d': '0.24s' }}>
        <a className="btn btn-primary" href={identity.resume} target="_blank" rel="noreferrer" {...magnet}>
          View resume
        </a>
        <a className="btn btn-ghost" href={identity.github} target="_blank" rel="noreferrer" {...magnet}>
          GitHub
        </a>
        <a className="btn btn-ghost" href={identity.linkedin} target="_blank" rel="noreferrer" {...magnet}>
          LinkedIn
        </a>
      </div>
      <p className="rv" style={{ '--d': '0.32s' }}>
        <span className="badge-avail">
          <span className="dot" aria-hidden="true" />
          {identity.availability} · {identity.location}
        </span>
      </p>
      <p className="hero-scroll rv" style={{ '--d': '0.4s' }} aria-hidden="true">
        SCROLL
      </p>
    </header>
  )
}
