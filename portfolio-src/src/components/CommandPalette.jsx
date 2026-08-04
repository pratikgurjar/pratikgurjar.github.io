import { useEffect, useMemo, useRef, useState } from 'react'
import { identity } from '../data.js'
import { copyToClipboard, trapFocus } from '../hooks.js'

export default function CommandPalette({ open, onClose, onOpenTerminal }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const actions = useMemo(
    () => [
      { label: 'Jump to about', k: '01', run: () => jump('about') },
      { label: 'Jump to experience', k: '02', run: () => jump('experience') },
      { label: 'Jump to project', k: '03', run: () => jump('project') },
      { label: 'Jump to skills', k: '04', run: () => jump('skills') },
      { label: 'Jump to recognition', k: '05', run: () => jump('recognition') },
      { label: 'Jump to certifications', k: '06', run: () => jump('certifications') },
      { label: 'Jump to writing', k: '07', run: () => jump('writing') },
      { label: 'Jump to contact', k: '08', run: () => jump('contact') },
      { label: 'Copy email', k: '⌘', run: () => copyToClipboard(identity.email) },
      { label: 'View resume', k: 'pdf', run: () => window.open(identity.resume, '_blank') },
      { label: 'Open GitHub', k: '↗', run: () => window.open(identity.github, '_blank') },
      { label: 'Open LinkedIn', k: '↗', run: () => window.open(identity.linkedin, '_blank') },
      { label: 'Open terminal', k: '>_', run: onOpenTerminal },
      { label: 'Poke Blip', k: '◉', run: () => window.dispatchEvent(new Event('blip:speak')) },
    ],
    [onOpenTerminal],
  )

  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      const prev = document.activeElement
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
      return () => prev?.focus?.()
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  if (!open) return null

  const runItem = (item) => {
    onClose()
    item.run()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (filtered[active]) runItem(filtered[active])
  }

  return (
    <div
      className="palette-overlay"
      onClick={onClose}
      onKeyDown={(e) => trapFocus(e.currentTarget, e)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <form className="palette" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type a command…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Search commands"
        />
        <ul className="palette-list">
          {filtered.map((a, i) => (
            <li key={a.label}>
              <button
                type="button"
                className={`palette-item${i === active ? ' active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => runItem(a)}
              >
                {a.label}
                <span className="k">{a.k}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="palette-empty">Nothing matches "{query}"</li>}
        </ul>
      </form>
    </div>
  )
}
