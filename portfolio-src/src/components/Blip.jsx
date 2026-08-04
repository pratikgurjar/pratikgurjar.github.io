import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// Blip, the resident packet bot. Phase 2.
//
// State machine (one source of truth, `mode`):
//   dock  compact form at the bottom-right desk. Scrolling makes him ride the
//         rail (he hops to the pulse position, hops back ~1.6s after you stop).
//         Click: he unfolds a full body and enters roam.
//   roam  full body, free of the desk. Hold the cursor still for 3s anywhere
//         reasonable and a portal pair opens: one under Blip, one at your
//         cursor. He sinks into his, pops out of yours, and comments on where
//         he landed. Three teleports drain his charges; he then folds back to
//         compact and portals home with a message. Click while roaming: speaks.
// Guards: no dwell while a portal trip is in flight, near Blip himself, over
// the palette/terminal, off-window, or on coarse pointers (roam is desktop
// only). All timers cleaned up on unmount. Reduced motion: no riding, no roam;
// Blip stays a calm, clickable fact machine.
const API = 'https://v2.jokeapi.dev/joke/Programming?safe-mode&type=single'
// Each local fact carries a verified source link, shown in the bubble.
const FACTS = [
  { t: 'HTTP 402: Payment Required. Reserved since 1997, still waiting for its moment.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/402' },
  { t: 'The first computer bug was a real moth, taped into a logbook in 1947.', url: 'https://americanhistory.si.edu/collections/object/nmah_334663' },
  { t: 'Your card tap becomes an ISO 8583 message. I carry those.', url: 'https://www.iso.org/standard/79451.html' },
  { t: "Luhn's checksum from the 1950s still validates every card number you own.", url: 'https://en.wikipedia.org/wiki/Luhn_algorithm' },
  { t: 'TCP says hello three times before it trusts anyone. Healthy boundaries.', url: 'https://en.wikipedia.org/wiki/Transmission_Control_Protocol' },
  { t: 'Git was written in about two weeks. Some merge conflicts last longer.', url: 'https://en.wikipedia.org/wiki/Git' },
  { t: 'Five nines of uptime is about five minutes of downtime a year. Spend wisely.', url: 'https://en.wikipedia.org/wiki/High_availability' },
  { t: 'The @ sign is older than email. It used to mean price per unit.', url: 'https://en.wikipedia.org/wiki/At_sign' },
  { t: 'localhost is where the heart is. 127.0.0.1.', url: 'https://en.wikipedia.org/wiki/Localhost' },
  { t: "The term 'artificial intelligence' was coined for a 1956 Dartmouth workshop.", url: 'https://en.wikipedia.org/wiki/Dartmouth_workshop' },
  { t: 'The perceptron is from 1958. AI winter came twice since. It kept going.', url: 'https://en.wikipedia.org/wiki/Perceptron' },
  { t: "'Attention Is All You Need' (2017) introduced the transformer. Eight pages.", url: 'https://arxiv.org/abs/1706.03762' },
  { t: "AlexNet's 2012 ImageNet win kicked off the deep learning era on two GPUs.", url: 'https://en.wikipedia.org/wiki/AlexNet' },
  { t: 'Backpropagation went mainstream in 1986. Your gradients still descend on it.', url: 'https://en.wikipedia.org/wiki/Backpropagation' },
  { t: 'An LLM predicts the next token. Everything else you see is emergent.', url: 'https://en.wikipedia.org/wiki/Large_language_model' },
]
const ZONE_LINES = {
  top: 'The wire. I was born around here.',
  about: 'The ledger tape. Soothing, honestly.',
  experience: 'Five years on this timeline. I read all of it.',
  project: 'TableTalk. The guard blocked me once. Respect.',
  recognition: 'Ranks and education. Verified.',
  certifications: 'The certificates shelf. Batch closed.',
  writing: 'The library. I read at packet speed.',
  contact: 'The receipt. This is where deals close.',
}
const DWELL_MS = 3000
const DWELL_RADIUS = 14
const MAX_HOPS = 3
const STATION_LINES = {
  about: 'INITIATE. Here we go.',
  experience: 'ROUTE locked. Gateway picked.',
  project: 'AUTHENTICATE ✓ it is really you.',
  skills: 'AUTHORIZE ✓ issuer says yes.',
  recognition: 'CAPTURE ✓ funds claimed.',
  certifications: 'CLEAR. The batch is out.',
  contact: 'SETTLED. Money moved.',
}

const compactDock = () => {
  const vh = window.innerHeight
  const f = document.querySelector('.footer')?.getBoundingClientRect()
  const floor = f && f.top < vh ? f.top : vh
  return { x: window.innerWidth - 84, y: Math.min(vh - 66, floor - 62) }
}

export default function Blip() {
  const [mode, setMode] = useState('dock')
  const [mood, setMood] = useState('alert')
  const [riding, setRiding] = useState(false)
  const [perched, setPerched] = useState(false)
  const [traveling, setTraveling] = useState(false)
  const [pos, setPos] = useState(() => (typeof window === 'undefined' ? { x: 0, y: 0 } : compactDock()))
  const [instant, setInstant] = useState(false)
  const [portals, setPortals] = useState([])
  const [popping, setPopping] = useState(false)
  const [bubble, setBubble] = useState(null)

  const rootRef = useRef(null)
  const pupilsRef = useRef(null)
  const lastMove = useRef(performance.now())
  const bubbleTimer = useRef(0)
  const factIndex = useRef(Math.floor(Math.random() * FACTS.length))
  const fetching = useRef(false)
  const timers = useRef(new Set())
  const dwell = useRef({ x: 0, y: 0, timer: 0 })
  const hops = useRef(0)
  const modeRef = useRef('dock')
  const travelingRef = useRef(false)
  const posRef = useRef(pos)
  const ridingRef = useRef(false)
  const perchedRef = useRef(false)
  const lastFact = useRef(0)
  const settleTimer = useRef(0)
  modeRef.current = mode
  travelingRef.current = traveling
  posRef.current = pos
  ridingRef.current = riding

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
    return id
  }

  const say = (msg, ms = 8000) => {
    clearTimeout(bubbleTimer.current)
    setBubble(typeof msg === 'string' ? { text: msg } : { text: msg.t, url: msg.url })
    bubbleTimer.current = setTimeout(() => setBubble(null), ms)
  }

  const nextLocalFact = () => {
    factIndex.current = (factIndex.current + 1) % FACTS.length
    return FACTS[factIndex.current]
  }

  const speak = async () => {
    if (fetching.current) return
    fetching.current = true
    say('…', 4000)
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 3000)
      const res = await fetch(API, { signal: ctrl.signal })
      clearTimeout(t)
      const data = await res.json()
      const joke = !data.error && typeof data.joke === 'string' ? data.joke.trim() : ''
      say(joke && joke.length <= 220 ? joke : nextLocalFact(), 10000)
    } catch {
      say(nextLocalFact(), 10000)
    } finally {
      fetching.current = false
    }
  }

  const zoneLine = (x, y) => {
    for (const id of Object.keys(ZONE_LINES)) {
      const el = document.getElementById(id)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (y >= r.top && y <= r.bottom) {
        if (id === 'skills') break
        return ZONE_LINES[id]
      }
    }
    const under = document.elementFromPoint(x, y)
    const group = under?.closest?.('.skill-card')?.querySelector('.skill-group')?.textContent
    if (group) return `${group} territory. I know these.`
    const skills = document.getElementById('skills')
    if (skills) {
      const r = skills.getBoundingClientRect()
      if (y >= r.top && y <= r.bottom) return 'So many chips. None edible.'
    }
    if (document.elementFromPoint(x, y)?.closest?.('.footer')) return 'The basement. Cozy.'
    return 'Interesting spot. Noted.'
  }

  const clearDwell = () => {
    clearTimeout(dwell.current.timer)
    dwell.current.timer = 0
  }

  const teleportTo = (tx, ty, onArrive) => {
    if (travelingRef.current) return
    setTraveling(true)
    travelingRef.current = true
    clearDwell()
    const from = posRef.current
    const a = { id: Math.random(), x: from.x + 23, y: from.y + 25 }
    const b = { id: Math.random(), x: tx + 23, y: ty + 25 }
    setPortals([a, b])
    later(() => {
      setInstant(true)
      setPos({ x: tx, y: ty })
      later(() => setInstant(false), 60)
    }, 380)
    later(() => setPortals([]), 1100)
    later(() => {
      setTraveling(false)
      travelingRef.current = false
      setPopping(true)
      later(() => setPopping(false), 500)
      window.dispatchEvent(new CustomEvent('blip:teleport', { detail: { x: tx + 23, y: ty + 25 } }))
      onArrive?.()
    }, 900)
  }

  const returnHome = () => {
    setMode('returning')
    later(() => {
      teleportTo(compactDock().x, compactDock().y, () => {
        setMode('dock')
        perchedRef.current = false
        setPerched(false)
        hops.current = 0
        say('Three hops used. Folding up, recharging at my desk.', 7000)
      })
    }, 500)
  }

  const openPortalAt = (cx, cy) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tx = Math.min(vw - 76, Math.max(24, cx - 23))
    const ty = Math.min(vh - 96, Math.max(84, cy - 25))
    hops.current += 1
    const hop = hops.current
    teleportTo(tx, ty, () => {
      if (hop >= MAX_HOPS) {
        say(zoneLine(cx, cy) + '\nThat was my last charge.', 3800)
        later(returnHome, 1900)
      } else {
        say(`${zoneLine(cx, cy)}\n${MAX_HOPS - hop} portal${MAX_HOPS - hop === 1 ? '' : 's'} left.`, 6000)
      }
    })
  }

  const deploy = () => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) {
      speak()
      return
    }
    hops.current = 0
    setMode('roam')
    say(`Full body online. Hold your cursor still for 3s\nand I will portal to it. ${MAX_HOPS} charges.`, 9000)
  }

  const onBodyClick = () => {
    if (travelingRef.current || modeRef.current === 'returning') return
    if (modeRef.current === 'dock') deploy()
    else speak()
  }

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const localTimers = timers.current

    const onMove = (e) => {
      lastMove.current = performance.now()
      const root = rootRef.current
      const pupils = pupilsRef.current
      if (root && pupils && !reduced) {
        const r = root.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const f = Math.min(2.4, d / 90)
        pupils.style.setProperty('--ex', `${(dx / d) * f}px`)
        pupils.style.setProperty('--ey', `${(dy / d) * f}px`)
      }
      if (modeRef.current !== 'roam' || travelingRef.current) return
      const moved = Math.hypot(e.clientX - dwell.current.x, e.clientY - dwell.current.y)
      if (moved > DWELL_RADIUS || !dwell.current.timer) {
        dwell.current.x = e.clientX
        dwell.current.y = e.clientY
        clearDwell()
        dwell.current.timer = setTimeout(() => {
          dwell.current.timer = 0
          const { x, y } = dwell.current
          if (modeRef.current !== 'roam' || travelingRef.current) return
          if (document.querySelector('.palette-overlay, .term-overlay')) return
          const p = posRef.current
          if (Math.hypot(x - (p.x + 23), y - (p.y + 25)) < 110) return
          openPortalAt(x, y)
        }, DWELL_MS)
      }
    }
    const onLeaveWindow = (e) => {
      if (!e.relatedTarget) clearDwell()
    }

    const ridePosition = () => {
      const first = document.getElementById('about')
      const last = document.getElementById('contact')
      if (!first || !last) return null
      const railX = first.getBoundingClientRect().left + 6
      const topV = first.getBoundingClientRect().top - 30
      const endV = last.getBoundingClientRect().top + 40
      const pulseV = Math.max(topV, Math.min(endV, window.innerHeight * 0.42))
      if (endV < 60 || topV > window.innerHeight * 0.55) return null
      // Stay below the fixed nav and above the footer.
      const f = document.querySelector('.footer')?.getBoundingClientRect()
      const floor = f && f.top < window.innerHeight ? f.top - 58 : window.innerHeight - 58
      return { x: railX + 12, y: Math.max(78, Math.min(floor, pulseV - 24)) }
    }
    let lastScrollY = window.scrollY
    const onScroll = () => {
      // Scrolling counts as activity: Blip wakes up and engages.
      lastMove.current = performance.now()
      const dir = Math.sign(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      if (reduced || modeRef.current !== 'dock' || travelingRef.current) return
      const rp = ridePosition()
      if (rp) {
        perchedRef.current = true
        setPerched(true)
        setRiding(true)
        setPos(rp)
        // Riding gaze: look the way we're traveling.
        pupilsRef.current?.style.setProperty('--ex', '0px')
        pupilsRef.current?.style.setProperty('--ey', `${dir * 2.4}px`)
      } else if (perchedRef.current) {
        // Rail left the viewport (back at the hero or past the receipt):
        // hop off and head to the desk.
        perchedRef.current = false
        setPerched(false)
        setRiding(false)
        setPos(compactDock())
      } else {
        // At the desk: keep floating above the footer as it rises.
        setPos(compactDock())
      }
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(() => {
        // Scrolling stopped: stay perched right here on the rail,
        // just drop the riding lean.
        setRiding(false)
      }, 1400)
    }

    const onResize = () => {
      if (modeRef.current !== 'dock' || travelingRef.current) return
      if (perchedRef.current) {
        const rp = ridePosition()
        if (rp) {
          setPos(rp)
          return
        }
        perchedRef.current = false
        setPerched(false)
      }
      setPos(compactDock())
    }
    const onPoke = () => speak()
    const onReact = (e) => {
      if (modeRef.current === 'roam' && !travelingRef.current && e.detail?.msg) say(e.detail.msg, 5000)
    }
    const onStation = (e) => {
      const { id, passed } = e.detail || {}
      if (!passed || !ridingRef.current || !STATION_LINES[id]) return
      say(STATION_LINES[id], 1700)
      setPopping(true)
      later(() => setPopping(false), 420)
    }
    const onStorm = () => {
      say('Storm in the network.\nHold on to something.', 4200)
      setPopping(true)
      later(() => setPopping(false), 420)
    }
    const moodCheck = () => {
      // Perched on the rail he stays awake; sleep is for the desk.
      setMood(perchedRef.current || performance.now() - lastMove.current <= 4000 ? 'alert' : 'rest')
      // Perched and quiet: tick through cited facts.
      if (
        perchedRef.current &&
        !ridingRef.current &&
        modeRef.current === 'dock' &&
        !travelingRef.current &&
        performance.now() - lastFact.current > 11000 &&
        !document.querySelector('.blip-bubble')
      ) {
        lastFact.current = performance.now()
        say(nextLocalFact(), 9000)
      }
      settleMood.current = setTimeout(moodCheck, 800)
    }
    const settleMood = { current: 0 }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeaveWindow)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('blip:speak', onPoke)
    window.addEventListener('blip:react', onReact)
    window.addEventListener('rail:station', onStation)
    window.addEventListener('aurora:storm', onStorm)
    moodCheck()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseout', onLeaveWindow)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('blip:speak', onPoke)
      window.removeEventListener('blip:react', onReact)
      window.removeEventListener('rail:station', onStation)
      window.removeEventListener('aurora:storm', onStorm)
      clearTimeout(settleMood.current)
      clearTimeout(settleTimer.current)
      clearTimeout(bubbleTimer.current)
      clearDwell()
      localTimers.forEach(clearTimeout)
      localTimers.clear()
    }
  }, [])

  const full = mode === 'roam' || mode === 'returning'
  const cls = [
    'blip',
    `blip-${mood}`,
    full ? 'blip-full' : '',
    riding ? 'blip-riding' : '',
    traveling ? 'blip-traveling' : '',
    popping ? 'blip-pop' : '',
    instant ? 'blip-notrans' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {portals.map((p) => (
        <div className="portal" key={p.id} style={{ transform: `translate3d(${p.x}px, ${p.y}px, 0)` }} aria-hidden="true">
          <span className="portal-ring" />
          <span className="portal-ring portal-ring-2" />
        </div>
      ))}
      <div className={cls} ref={rootRef} style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}>
        {bubble && (pos.x - 26 >= 170 || pos.x + 12 >= 120) && (
          <div
            className={`blip-bubble${
              pos.x - 26 < 170 ? ' blip-bubble-under' : pos.y < 230 ? ' blip-bubble-down' : ''
            }`}
            role="status"
            style={{ maxWidth: `${Math.min(250, pos.x - 26 >= 170 ? pos.x - 26 : pos.x + 12)}px` }}
          >
            {bubble.text}
            {bubble.url && (
              <a className="blip-src" href={bubble.url} target="_blank" rel="noreferrer">
                source ↗
              </a>
            )}
          </div>
        )}
        <button
          className="blip-body"
          onClick={onBodyClick}
          aria-label={mode === 'dock' ? 'Blip the mascot. Click to deploy full body' : 'Blip the mascot. Click for a fact'}
        >
          <span className="blip-antenna" aria-hidden="true">
            <span className="blip-antenna-dot" />
          </span>
          <span className="blip-face" aria-hidden="true" ref={pupilsRef}>
            <span className="blip-eye" />
            <span className="blip-eye" />
          </span>
          <span className="blip-arm blip-arm-l" aria-hidden="true" />
          <span className="blip-arm blip-arm-r" aria-hidden="true" />
          <span className="blip-zzz" aria-hidden="true">
            zzz
          </span>
        </button>
        <span className="blip-legs" aria-hidden="true">
          <span className="blip-leg" />
          <span className="blip-leg" />
        </span>
      </div>
    </>
  )
}
