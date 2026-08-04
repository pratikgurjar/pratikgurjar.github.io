import { useEffect, useRef, useState } from 'react'

// Back to top, bottom-left by the rail: appears once you have scrolled,
// wears the journey progress as a ring, and rides the rail home on click.
const R = 15
const CIRC = 2 * Math.PI * R

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const ringRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        setVisible(window.scrollY > 500)
        ringRef.current?.style.setProperty('stroke-dashoffset', `${CIRC * (1 - p)}`)
        // Stay above the footer as it rises into view.
        const f = document.querySelector('.footer')?.getBoundingClientRect()
        const lift = f && f.top < window.innerHeight ? window.innerHeight - f.top + 14 : 0
        if (btnRef.current) btnRef.current.style.bottom = `${24 + lift}px`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <button
      ref={btnRef}
      className={`back-top${visible ? ' back-top-on' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="19" cy="19" r={R} fill="none" stroke="rgba(139,135,247,0.2)" strokeWidth="1.5" />
        <circle
          ref={ringRef}
          cx="19"
          cy="19"
          r={R}
          fill="none"
          stroke="var(--accent-bright)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
          transform="rotate(-90 19 19)"
        />
        <path d="M19 24 V14 M14.5 18.5 L19 14 l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}
