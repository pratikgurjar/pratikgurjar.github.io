import { useEffect, useState } from 'react'

const LINKS = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['project', 'Project'],
  ['skills', 'Skills'],
  ['writing', 'Writing'],
  ['contact', 'Contact'],
]

export default function Nav({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
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
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Primary">
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <a className="nav-logo" href="#top">
        pg<b>.</b>
      </a>
      <ul className="nav-links">
        {LINKS.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
        <li>
          <button className="nav-kbd" onClick={onOpenPalette} aria-label="⌘K command palette">
            ⌘K
          </button>
        </li>
      </ul>
    </nav>
  )
}
