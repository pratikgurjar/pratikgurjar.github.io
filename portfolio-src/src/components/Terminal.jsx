import { useEffect, useRef, useState } from 'react'
import { identity, skills } from '../data.js'
import { prefersReducedMotion, trapFocus } from '../hooks.js'

const HELP = `available commands:
  whoami      who is this
  skills      what I work with
  ai          the applied-AI side
  contact     how to reach me
  resume      open the resume pdf
  8583        parse a message
  storm       stir the sky
  clear       clear the screen
  exit        close the terminal`

const AI = `applied AI, the practical kind:
  TableTalk   LLM agent that turns natural language into SQL,
              gated by an AST guard, a read-only transaction
              and a statement timeout before anything runs
  platform    agent-skills and integration-test scoping for an
              authentication service
  AI/ML       Claude, OpenAI, Gemini · MLOps · model deployment

rule of thumb: let the model write, never let it run unguarded.`

const WHOAMI = `${identity.name.toLowerCase().replace(' ', '.')}
backend engineer, payments infrastructure
experience: card payments at razorpay (tokenization, 3-D Secure, routing)
location: ${identity.location.toLowerCase()}`

const ISO = `> parsing ISO 8583 message…
  MTI   0100        authorization request
  F2    4532********0001   PAN (masked)
  F3    000000      processing code: purchase
  F4    000000012000       amount: 120.00
  F49   356         currency: INR

fun fact: every card tap you've ever made
became one of these messages.`

export default function Terminal({ open, onClose }) {
  const [lines, setLines] = useState([{ type: 'out', text: `pratik@portfolio: type 'help' to begin` }])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      const prev = document.activeElement
      setTimeout(() => inputRef.current?.focus(), 30)
      return () => prev?.focus?.()
    }
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight)
  }, [lines])

  if (!open) return null

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    const echo = { type: 'cmd', text: `$ ${raw}` }
    let out = null
    switch (cmd) {
      case '':
        setLines((l) => [...l, echo])
        return
      case 'help':
        out = HELP
        break
      case 'whoami':
        out = WHOAMI
        break
      case 'skills':
        out = skills.map((s) => `${s.group.toLowerCase()}: ${s.items.map((it) => it.name).join(', ')}`).join('\n')
        break
      case 'ai':
        out = AI
        break
      case 'contact':
        out = `email:    ${identity.email}\ngithub:   ${identity.github}\nlinkedin: ${identity.linkedin}`
        break
      case 'resume':
        window.open(identity.resume, '_blank')
        out = 'opening resume…'
        break
      case '8583':
        out = ISO
        break
      case 'storm':
        if (prefersReducedMotion()) {
          out = 'reduced motion is on. the sky stays calm for you.'
        } else {
          window.dispatchEvent(new Event('aurora:storm'))
          out = 'storm called. watch the sky for ~9 seconds.'
        }
        break
      case 'clear':
        setLines([])
        return
      case 'exit':
        onClose()
        return
      default:
        out = `command not found: ${cmd}. try 'help'`
    }
    setLines((l) => [...l, echo, { type: 'out', text: out }])
  }

  const onSubmit = (e) => {
    e.preventDefault()
    run(input)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="term-overlay"
      onClick={onClose}
      onKeyDown={(e) => trapFocus(e.currentTarget, e)}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
    >
      <div className="term" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <span className="dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          pratik@portfolio: ~
          <button className="close" onClick={onClose} aria-label="Close terminal">
            esc ✕
          </button>
        </div>
        <div className="term-body" ref={bodyRef}>
          {lines.map((l, i) => (
            <div key={i} className={l.type}>
              {l.text}
            </div>
          ))}
        </div>
        <form className="term-input-row" onSubmit={onSubmit}>
          <span className="prompt" aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}
