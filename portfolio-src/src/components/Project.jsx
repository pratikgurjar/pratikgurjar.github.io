import { useEffect, useRef, useState } from 'react'
import { project } from '../data.js'
import { useReveal, useCardFx, prefersReducedMotion } from '../hooks.js'

// Background terminal that demonstrates TableTalk's guard live. Twenty scenes
// cycle through a rolling window: harmless questions get SELECTs and results,
// dangerous statements get caught by the guard, every time. Data is synthetic.
const SCENES = [
  [
    { t: '> show me payments that failed today', c: 'q' },
    { t: '  SELECT id, amount FROM payments', c: 'r' },
    { t: "  WHERE status = 'failed' · 3 rows", c: 'r' },
  ],
  [
    { t: '> DROP TABLE payments;', c: 'q' },
    { t: '  ✗ blocked · AST guard · not a SELECT', c: 'x' },
  ],
  [
    { t: '> top gateway by success rate', c: 'q' },
    { t: '  SELECT gw, avg(ok) GROUP BY gw · gw-2', c: 'r' },
  ],
  [
    { t: '> refund everything', c: 'q' },
    { t: '  ✗ blocked · UPDATE is not a SELECT', c: 'x' },
  ],
  [
    { t: '> tokens expiring this week', c: 'q' },
    { t: '  SELECT count(*) FROM tokens · 12 rows', c: 'r' },
  ],
  [
    { t: '> DELETE FROM users WHERE 1=1;', c: 'q' },
    { t: '  ✗ blocked · AST guard says no', c: 'x' },
  ],
  [
    { t: '> average settlement delay', c: 'q' },
    { t: '  avg(t_settle - t_auth) · about a day', c: 'r' },
  ],
  [
    { t: '> TRUNCATE ledger;', c: 'q' },
    { t: '  ✗ blocked · nice try', c: 'x' },
  ],
  [
    { t: '> largest payment this month', c: 'q' },
    { t: '  SELECT max(amount) · ₹1,24,999.00', c: 'r' },
  ],
  [
    { t: '> ALTER TABLE payments DROP amount;', c: 'q' },
    { t: '  ✗ blocked · the schema stays intact', c: 'x' },
  ],
  [
    { t: '> failed 3DS challenges today', c: 'q' },
    { t: '  SELECT count(*) WHERE otp_ok = 0 · 7', c: 'r' },
  ],
  [
    { t: '> GRANT ALL TO intern;', c: 'q' },
    { t: '  ✗ blocked · not even a query', c: 'x' },
  ],
  [
    { t: '> busiest hour for card taps', c: 'q' },
    { t: '  GROUP BY hour ORDER BY taps · 19:00', c: 'r' },
  ],
  [
    { t: '> retry storms in the last 24h', c: 'q' },
    { t: '  HAVING retries > 5 · 2 merchants', c: 'r' },
  ],
  [
    { t: '> UPDATE balance SET amount = 0;', c: 'q' },
    { t: '  ✗ blocked · read-only transaction', c: 'x' },
  ],
  [
    { t: '> any duplicate captures?', c: 'q' },
    { t: '  GROUP BY ref HAVING n > 1 · 0 rows', c: 'r' },
  ],
  [
    { t: '> SELECT * FROM payments;', c: 'q' },
    { t: '  statement timeout · trimmed at 5s', c: 'x' },
  ],
  [
    { t: '> which BIN declines the most', c: 'q' },
    { t: '  GROUP BY bin ORDER BY declines desc', c: 'r' },
  ],
  [
    { t: '> INSERT INTO payments VALUES (1);', c: 'q' },
    { t: '  ✗ blocked · SELECT or nothing', c: 'x' },
  ],
  [
    { t: '> is the guard even on', c: 'q' },
    { t: '  the guard is always on.', c: 'r' },
  ],
]
const WINDOW = 5

function SqlBackdrop() {
  const ref = useRef(null)
  const [lines, setLines] = useState([])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setLines(SCENES.slice(0, 3).flat())
      return
    }
    let timers = []
    let started = false
    let scene = 0
    let pendingPrompt = false
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))
    // Pushing a line moves the caret off whatever came before it.
    const push = (line) =>
      setLines((prev) => [...prev.map((l) => ({ ...l, cur: false })), line].slice(-WINDOW))
    const setLast = (text) =>
      setLines((prev) => prev.map((l, i) => (i === prev.length - 1 ? { ...l, t: text } : l)))
    const dropCaret = () =>
      setLines((prev) => prev.map((l, i) => (i === prev.length - 1 ? { ...l, cur: false } : l)))

    // A person types the question, hesitating slightly between keys.
    const typeQuery = (line, done) => {
      const full = line.t
      let j = 2
      const step = () => {
        setLast(full.slice(0, ++j))
        if (j < full.length) later(step, 26 + Math.random() * 48)
        else
          later(() => {
            dropCaret()
            done()
          }, 480)
      }
      later(step, 520)
    }
    // The machine answers all at once, the way real output arrives.
    const printOutput = (line, done) => {
      push({ ...line, t: '', cur: false })
      later(() => {
        setLast(line.t)
        later(done, line.c === 'x' ? 1000 : 560)
      }, 340)
    }

    const playScene = () => {
      const s = SCENES[scene % SCENES.length]
      scene++
      let i = 0
      const next = () => {
        if (i >= s.length) {
          // Leave a prompt blinking; the next scene types into it.
          push({ t: '> ', c: 'q', cur: true })
          pendingPrompt = true
          later(playScene, 2100)
          return
        }
        const line = s[i++]
        if (line.c === 'q') {
          if (pendingPrompt) pendingPrompt = false
          else push({ ...line, t: '> ', cur: true })
          typeQuery(line, next)
        } else {
          printOutput(line, next)
        }
      }
      next()
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true
          playScene()
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="sql-backdrop" aria-hidden="true" ref={ref}>
      {lines.map((l, i) => (
        <p className={`sql-line sql-${l.c}`} key={i}>
          {l.t}
          {l.cur && <span className="sql-caret" />}
        </p>
      ))}
    </div>
  )
}

export default function Project() {
  const ref = useReveal()
  const fx = useCardFx(2.2)
  return (
    <section className="section project-section" id="project" ref={ref}>
      <SqlBackdrop />
      <div className="section-head rv">
        <p className="section-eyebrow">
          03 · Project <span className="stamp">AUTHENTICATE</span>
        </p>
        <h2 className="section-title">TableTalk</h2>
      </div>
      <div className="project-card glow-card rv" {...fx}>
        <div className="project-top">
          <p className="project-strap">{project.strap}</p>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="guards">
          {project.guards.map((g) => (
            <div className="guard" key={g.name}>
              <p className="guard-name">{g.name}</p>
              <p className="guard-detail">{g.detail}</p>
            </div>
          ))}
        </div>
        <div className="project-foot">
          <div className="chips">
            {project.stack.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          {project.github && (
            <a
              className="btn btn-ghost project-link"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
