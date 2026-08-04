import { lazy, Suspense, useEffect, useState } from 'react'
import SignalCanvas from './components/SignalCanvas.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Project from './components/Project.jsx'
import Skills from './components/Skills.jsx'
import Recognition from './components/Recognition.jsx'
import Certifications from './components/Certifications.jsx'
import Writing from './components/Writing.jsx'
import Contact from './components/Contact.jsx'
import BackToTop from './components/BackToTop.jsx'

// The decorative and overlay layer loads as separate chunks once the main
// thread is idle, keeping the critical bundle lean for first paint.
const AuroraGL = lazy(() => import('./components/AuroraGL.jsx'))
const Cursor = lazy(() => import('./components/Cursor.jsx'))
const CommandPalette = lazy(() => import('./components/CommandPalette.jsx'))
const Terminal = lazy(() => import('./components/Terminal.jsx'))
const Blip = lazy(() => import('./components/Blip.jsx'))

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
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

  useEffect(() => {
    document.body.style.overflow = paletteOpen || termOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [paletteOpen, termOpen])

  useEffect(() => {
    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    let buffer = []
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setTermOpen(false)
        setPaletteOpen((o) => !o)
        return
      }
      if (e.target.closest?.('input, textarea')) return
      buffer.push(e.key.toLowerCase())
      if (buffer.length > KONAMI.length) buffer.shift()
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        buffer = []
        window.dispatchEvent(new Event('aurora:storm'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <SignalCanvas />
      {fxReady && (
        <Suspense fallback={null}>
          <AuroraGL />
          <Cursor />
        </Suspense>
      )}
      <div className="app">
        <Nav onOpenPalette={() => setPaletteOpen(true)} />
        <Hero />
        <main id="main">
          <About />
          <Experience />
          <Project />
          <Skills />
          <Recognition />
          <Certifications />
          <Writing />
          <Contact />
        </main>
        <BackToTop />
        <footer className="footer">
          <span>© 2026 Pratik Gurjar · Designed and built by me</span>
          <span className="hint">⌘K commands · bend the wire · scroll the rail · find the terminal</span>
        </footer>
      </div>
      {fxReady && (
        <Suspense fallback={null}>
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onOpenTerminal={() => setTermOpen(true)}
          />
          <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
          <Blip />
        </Suspense>
      )}
    </>
  )
}
