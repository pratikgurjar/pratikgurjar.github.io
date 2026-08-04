import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// One background engine, three layers:
//  1. the wire (hero oscilloscope; bends to the cursor, dips under Blip's feet)
//  2. the rail (About → Contact) with the scroll pulse and lifecycle stations
//  3. per-section ambient fields, each with its own particles and physics.
//     Blip is a physical presence in every field: glyphs orbit him, dust and
//     tokens steer around him, the lattice lights beneath him, paper bounces
//     off his head, and every portal exit throws sparks.
// Only sections intersecting the viewport simulate. Reduced motion: static
// wire and rail only, no fields.
const STATIONS = ['about', 'experience', 'project', 'skills', 'recognition', 'certifications', 'contact']
// The card payment lifecycle, in the order it actually happens: the payment is
// created, a gateway is chosen, the cardholder is authenticated (3-D Secure),
// the issuer authorizes, the merchant captures, then clearing and settlement
// move the money. Authentication and authorization are separate steps.
const STAGES = ['INITIATE', 'ROUTE', 'AUTHENTICATE', 'AUTHORIZE', 'CAPTURE', 'CLEAR', 'SETTLED']
const SECTION_HUES = {
  top: 245,
  about: 243,
  experience: 254,
  project: 264,
  skills: 234,
  recognition: 248,
  certifications: 252,
  writing: 258,
  contact: 272,
}
const N = 120
const GLYPHS = '0123456789₹OK'

export default function SignalCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    let raf = 0
    let running = false
    let W = 0
    let H = 0
    let hue = 245
    let hueTarget = 245
    const mouse = { x: -9999, y: -9999 }
    const offsets = new Float32Array(N)
    const vels = new Float32Array(N)
    let bumps = []
    let ripples = []
    let sparks = []
    let lastBeat = 0
    const passed = new Set()
    const fields = new Map()
    let blip = null

    const setHint = (v) => {
      if (document.documentElement.dataset.canvasHint !== v) document.documentElement.dataset.canvasHint = v
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fields.clear()
    }

    const readBlip = () => {
      const el = document.querySelector('.blip')
      if (!el) {
        blip = null
        return
      }
      const r = el.getBoundingClientRect()
      blip = { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top, w: r.width }
    }

    const wireGeom = () => {
      const hero = document.getElementById('top')
      if (!hero) return null
      const r = hero.getBoundingClientRect()
      if (r.bottom < 0) return null
      // Sit in the gap between the availability badge and the scroll cue, so
      // the wire never collides with either on short viewports.
      const badge = document.querySelector('.badge-avail')?.getBoundingClientRect()
      const cue = document.querySelector('.hero-scroll')?.getBoundingClientRect()
      let y = r.top + r.height * 0.86
      if (badge && cue && cue.top > badge.bottom) {
        y = Math.min(badge.bottom + (cue.top - badge.bottom) * 0.45, cue.top - 34)
        y = Math.max(y, badge.bottom + 26)
      }
      return { left: r.left + 8, right: r.right - 8, y }
    }

    const updateHue = () => {
      let active = 'top'
      for (const id of Object.keys(SECTION_HUES)) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top < H * 0.5 && r.bottom > H * 0.35) active = id
      }
      hueTarget = SECTION_HUES[active]
      hue += (hueTarget - hue) * 0.04
    }

    const beatShape = (t) => Math.exp(-t * t) * (1 - t * t)

    const drawWire = (now) => {
      const g = wireGeom()
      if (!g) return
      const span = g.right - g.left
      if (!reduced) {
        if (now - lastBeat > 2800) {
          lastBeat = now
          bumps.push({ pos: -60, amp: 22, dir: 1 })
        }
        bumps = bumps.filter((b) => b.pos > -100 && b.pos < span + 100)
        for (const b of bumps) b.pos += 5.5 * b.dir
        for (let i = 0; i < N; i++) {
          const x = g.left + (span * i) / (N - 1)
          const dx = Math.abs(x - mouse.x)
          if (dx < 110 && Math.abs(g.y + offsets[i] - mouse.y) < 90) {
            const target = Math.max(-60, Math.min(60, (mouse.y - g.y) * Math.exp(-((dx / 60) ** 2))))
            vels[i] += (target - offsets[i]) * 0.06
          }
          vels[i] += -0.08 * offsets[i] - 0.12 * vels[i]
          offsets[i] += vels[i]
        }
      }
      const blipOnWire = blip && Math.abs(blip.y - g.y) < 90 && blip.x > g.left && blip.x < g.right
      const pts = []
      for (let i = 0; i < N; i++) {
        const xi = (span * i) / (N - 1)
        let y = g.y + offsets[i]
        for (const b of bumps) y += b.amp * beatShape((xi - b.pos) / 30)
        if (blipOnWire) y += 12 * Math.exp(-(((g.left + xi - blip.x) / 34) ** 2))
        pts.push([g.left + xi, y])
      }
      for (const [w, a] of [
        [4, 0.07],
        [1.5, 0.55],
      ]) {
        ctx.strokeStyle = `hsla(${hue}, 74%, 72%, ${a})`
        ctx.lineWidth = w
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < N; i++) ctx.lineTo(pts[i][0], pts[i][1])
        ctx.stroke()
      }
      // Scrubber affordance: hovering the wire reveals the seven lifecycle
      // stops; clicking jumps to that section.
      if (document.documentElement.dataset.canvasHint === 'wire') {
        // Ticks and labels ride the wire: sample its height (and slope) at each
        // stop so they bend, tilt and settle with it.
        const sampleAt = (x) => {
          const t = ((x - g.left) / span) * (N - 1)
          const i = Math.max(0, Math.min(N - 2, Math.floor(t)))
          const f = t - i
          const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f
          const slope = (pts[i + 1][1] - pts[i][1]) / (span / (N - 1))
          return { y, slope }
        }
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        for (let i = 0; i < STAGES.length; i++) {
          const fx = g.left + span * ((i + 0.5) / STAGES.length)
          const { y: fy, slope } = sampleAt(fx)
          const angle = Math.atan(slope)
          ctx.save()
          ctx.translate(fx, fy)
          ctx.rotate(angle)
          ctx.strokeStyle = `hsla(${hue}, 70%, 74%, 0.6)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, -7)
          ctx.lineTo(0, 7)
          ctx.stroke()
          ctx.fillStyle = `hsla(${hue}, 60%, 76%, 0.75)`
          ctx.fillText(STAGES[i], 0, 22)
          ctx.restore()
        }
        ctx.textAlign = 'start'
      }
    }

    const drawRail = () => {
      const first = document.getElementById(STATIONS[0])
      const last = document.getElementById(STATIONS[STATIONS.length - 1])
      if (!first || !last) return
      const railX = Math.round(first.getBoundingClientRect().left + 6) + 0.5
      const topV = first.getBoundingClientRect().top - 30
      const endV = last.getBoundingClientRect().top + 40
      if (topV > H || endV < 0) return
      const pulseV = Math.max(topV, Math.min(endV, H * 0.42))

      ctx.strokeStyle = `hsla(${hue}, 60%, 70%, 0.08)`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(railX, Math.max(0, topV))
      ctx.lineTo(railX, Math.min(H, endV))
      ctx.stroke()

      ctx.strokeStyle = `hsla(${hue}, 72%, 72%, 0.3)`
      ctx.beginPath()
      ctx.moveTo(railX, Math.max(0, topV))
      ctx.lineTo(railX, pulseV)
      ctx.stroke()

      const setStation = (id, on, sy) => {
        const had = passed.has(id)
        if (on === had) return
        if (on) passed.add(id)
        else passed.delete(id)
        document.querySelector(`#${id} .stamp`)?.classList.toggle('stamped', on)
        if (on && sy !== undefined && !reduced) ripples.push({ x: railX, y: sy, t: 0 })
        window.dispatchEvent(new CustomEvent('rail:station', { detail: { id, passed: on } }))
      }
      for (const id of STATIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        const sy = el.getBoundingClientRect().top + 40
        if (sy < -20 || sy > H + 20) {
          setStation(id, sy < -20)
          continue
        }
        const done = sy <= pulseV
        setStation(id, done, done ? sy : undefined)
        ctx.beginPath()
        ctx.arc(railX, sy, 4, 0, Math.PI * 2)
        if (done) {
          ctx.fillStyle = `hsla(${hue}, 74%, 70%, 0.9)`
          ctx.fill()
        } else {
          ctx.strokeStyle = 'rgba(155, 155, 166, 0.4)'
          ctx.lineWidth = 1.2
          ctx.stroke()
        }
      }

      if (pulseV > topV && pulseV < endV) {
        const grad = ctx.createLinearGradient(railX, pulseV - 46, railX, pulseV)
        grad.addColorStop(0, `hsla(${hue}, 75%, 66%, 0)`)
        grad.addColorStop(1, `hsla(${hue}, 75%, 66%, 0.5)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(railX, pulseV - 46)
        ctx.lineTo(railX, pulseV)
        ctx.stroke()
        ctx.fillStyle = `hsla(${hue}, 78%, 70%, 0.95)`
        ctx.beginPath()
        ctx.arc(railX, pulseV, 3.4, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.t += 0.03
        if (r.t >= 1) {
          ripples.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `hsla(${hue}, 76%, 70%, ${0.35 * (1 - r.t)})`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(r.x, r.y, 5 + r.t * 34, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // ── Ambient fields ──────────────────────────────────────────────
    const rand = (a, b) => a + Math.random() * (b - a)

    const field = (id, count, spawn) => {
      let f = fields.get(id)
      if (!f) {
        f = { parts: [] }
        fields.set(id, f)
      }
      while (f.parts.length < count) f.parts.push(spawn())
      return f
    }

    const avoid = (p, cx, cy, radius, force) => {
      const dx = p.x - cx
      const dy = p.y - cy
      const d = Math.hypot(dx, dy)
      if (d < radius && d > 1) {
        p.x += (dx / d) * force * (1 - d / radius)
        p.y += (dy / d) * force * (1 - d / radius)
      }
    }

    // Particle fields store SECTION-LOCAL coordinates (lx/ly) so scrolling
    // never strands them; they are translated by the live section rect.
    const drawAbout = (r) => {
      const f = field('about', 24, () => ({
        lx: rand(0, r.width),
        ly: rand(0, r.height),
        vy: rand(-0.32, -0.12),
        ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        a: rand(0.06, 0.16),
        sway: rand(0, Math.PI * 2),
      }))
      ctx.font = '10px "JetBrains Mono", monospace'
      const bx = blip ? blip.x - r.left : null
      const by = blip ? blip.y - r.top : null
      for (const p of f.parts) {
        p.ly += p.vy
        p.sway += 0.01
        p.lx += Math.sin(p.sway) * 0.15
        if (bx !== null) {
          const dx = bx - p.lx
          const dy = by - p.ly
          const d = Math.hypot(dx, dy)
          if (d < 160 && d > 24) {
            p.lx += (dx / d) * 0.5 + (-dy / d) * 0.35
            p.ly += (dy / d) * 0.5 + (dx / d) * 0.35
          }
        }
        avoid(p, mouse.x - r.left, mouse.y - r.top, 70, 0.8)
        if (p.ly < -10) {
          p.ly = r.height + 10
          p.lx = rand(0, r.width)
        }
        if (p.lx < -20) p.lx = r.width + 20
        if (p.lx > r.width + 20) p.lx = -20
        ctx.fillStyle = `hsla(${hue}, 55%, 72%, ${p.a})`
        ctx.fillText(p.ch, r.left + p.lx, r.top + p.ly)
      }
    }

    const drawExperience = (r) => {
      const f = field('experience', 22, () => ({
        lx: rand(0, r.width),
        ly: rand(0, r.height),
        vx: rand(0.2, 0.55),
        a: rand(0.06, 0.15),
        len: rand(6, 14),
      }))
      for (const p of f.parts) {
        p.lx += p.vx
        if (blip) avoid(p, blip.x - r.left, blip.y - r.top, 95, 1.4)
        avoid(p, mouse.x - r.left, mouse.y - r.top, 60, 0.6)
        if (p.lx > r.width + 16) {
          p.lx = -14
          p.ly = rand(0, r.height)
        }
        ctx.strokeStyle = `hsla(${hue}, 60%, 72%, ${p.a})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(r.left + p.lx, r.top + p.ly)
        ctx.lineTo(r.left + p.lx + p.len, r.top + p.ly)
        ctx.stroke()
      }
    }

    const drawProject = (r) => {
      const card = document.querySelector('.project-card')
      const guardL = card ? card.getBoundingClientRect().left + 8 - r.left : r.width * 0.4
      const f = field('project', 18, () => ({
        lx: rand(-40, Math.max(40, guardL - 60)),
        ly: rand(20, r.height - 20),
        vx: rand(0.5, 0.95),
        state: 'flow',
        a: rand(0.16, 0.32),
        life: 1,
      }))
      const bx = blip ? blip.x - r.left : null
      const by = blip ? blip.y - r.top : null
      for (const p of f.parts) {
        if (p.state === 'flow') {
          p.lx += p.vx
          if (bx !== null) {
            const d = Math.hypot(p.lx - bx, p.ly - by)
            if (d < 32) {
              // Blip kicks it: hard shot straight at the guard line.
              p.state = 'kicked'
              p.vx = 3.4 + Math.random() * 1.6
              p.vy = Math.max(-1.5, Math.min(1.5, (p.ly - by) * 0.12))
              window.__blipKicks = (window.__blipKicks || 0) + 1
            } else {
              avoid(p, bx, by, 80, 1.6)
            }
          }
          if (p.lx >= guardL) {
            if (Math.random() < 0.22) {
              p.state = 'blocked'
              p.vx = -p.vx * 0.55
            } else {
              p.state = 'passed'
            }
          }
        } else if (p.state === 'kicked') {
          p.lx += p.vx
          p.ly += p.vy
          p.vy *= 0.98
          if (p.lx >= guardL) {
            p.state = 'blocked'
            p.vx = -1.6
            for (let i = 0; i < 6; i++) {
              sparks.push({
                x: r.left + guardL,
                y: r.top + p.ly,
                vx: rand(-2.6, -0.6),
                vy: rand(-1.8, 1.8),
                life: 1,
                red: true,
              })
            }
            if (!drawProject.lastQuip || performance.now() - drawProject.lastQuip > 9000) {
              drawProject.lastQuip = performance.now()
              window.dispatchEvent(
                new CustomEvent('blip:react', {
                  detail: { msg: 'Kicked one straight at the guard.\nStill caught it. Every time.' },
                }),
              )
            }
          }
        } else {
          p.lx += p.vx * (p.state === 'blocked' ? 1 : 0.4)
          p.life -= 0.02
        }
        if (p.life <= 0 || p.lx < -60) {
          p.lx = rand(-40, 40)
          p.ly = rand(20, r.height - 20)
          p.vx = rand(0.5, 0.95)
          p.vy = 0
          p.state = 'flow'
          p.life = 1
        }
        const kicked = p.state === 'kicked'
        ctx.fillStyle =
          p.state === 'blocked'
            ? `rgba(226, 75, 74, ${0.55 * p.life})`
            : `hsla(${hue}, 65%, ${kicked ? 78 : 70}%, ${(kicked ? 0.5 : p.a) * p.life})`
        const s = kicked ? 5 : 4
        ctx.fillRect(r.left + p.lx, r.top + p.ly, s, s)
      }
      ctx.strokeStyle = `hsla(${hue}, 60%, 70%, 0.1)`
      ctx.setLineDash([3, 7])
      ctx.beginPath()
      ctx.moveTo(r.left + guardL, Math.max(r.top + 10, 0))
      ctx.lineTo(r.left + guardL, Math.min(r.bottom - 10, H))
      ctx.stroke()
      ctx.setLineDash([])
    }

    const drawSkills = (r) => {
      const step = 56
      const x0 = r.left + ((step - ((r.left % step) + step)) % step)
      for (let x = x0; x < r.right; x += step) {
        for (let y = Math.max(r.top, -step); y < Math.min(r.bottom, H + step); y += step) {
          const dc = Math.hypot(x - mouse.x, y - mouse.y)
          const db = blip ? Math.hypot(x - blip.x, y - blip.y) : 9999
          const near = Math.max(0, 1 - Math.min(dc, db) / 150)
          ctx.fillStyle = `hsla(${hue}, 60%, 72%, ${0.055 + near * 0.26})`
          ctx.beginPath()
          ctx.arc(x, y, 1.3 + near * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (blip && blip.y > r.top && blip.y < r.bottom) {
        ctx.strokeStyle = `hsla(${hue}, 70%, 72%, 0.14)`
        ctx.beginPath()
        ctx.arc(blip.x, blip.y, 54, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const drawRecognition = (r) => {
      const f = field('recognition', 14, () => ({
        lx: rand(0, r.width),
        ly: rand(0, r.height),
        vy: rand(-0.22, -0.08),
        rad: rand(2.5, 5.5),
        a: rand(0.07, 0.16),
        sway: rand(0, Math.PI * 2),
      }))
      const bx = blip ? blip.x - r.left : null
      const by = blip ? blip.y - r.top : null
      for (const p of f.parts) {
        p.ly += p.vy
        p.sway += 0.008
        p.lx += Math.sin(p.sway) * 0.2
        if (bx !== null) {
          const dx = bx - p.lx
          const dy = by - p.ly
          const d = Math.hypot(dx, dy)
          if (d < 170 && d > 30) {
            p.lx += (dx / d) * 0.35
            p.ly += (dy / d) * 0.35
          }
        }
        if (p.ly < -8) {
          p.ly = r.height + 8
          p.lx = rand(0, r.width)
        }
        ctx.strokeStyle = `hsla(${(hue + 60) % 360}, 45%, 65%, ${p.a})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(r.left + p.lx, r.top + p.ly, p.rad, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const drawContact = (r) => {
      const receipt = document.querySelector('.receipt')
      const floorL = receipt ? receipt.getBoundingClientRect().top + 6 - r.top : r.height - 120
      const f = field('contact', 24, () => ({
        lx: rand(0, r.width),
        ly: rand(-60, Math.max(0, floorL - 30)),
        vy: rand(0.3, 0.7),
        vx: 0,
        a: rand(0.12, 0.26),
        life: 1,
        state: 'fall',
      }))
      const bTopL = blip ? blip.top - r.top : null
      const bxL = blip ? blip.x - r.left : null
      for (const p of f.parts) {
        if (p.state === 'fall') {
          p.ly += p.vy
          p.lx += Math.sin(p.ly * 0.02) * 0.3 + p.vx
          p.vx *= 0.96
          if (bTopL !== null && p.ly >= bTopL - 4 && p.ly <= bTopL + 6 && Math.abs(p.lx - bxL) < blip.w / 2 + 4) {
            p.state = 'bounce'
            p.vy = -p.vy * 0.6
            p.vx = (p.lx - bxL) * 0.08
          } else if (p.ly >= floorL) {
            p.state = 'settle'
          }
        } else if (p.state === 'bounce') {
          p.vy += 0.06
          p.ly += p.vy
          p.lx += p.vx
          p.life -= 0.03
        } else {
          p.life -= 0.05
        }
        if (p.life <= 0) {
          p.lx = rand(0, r.width)
          p.ly = rand(-60, 0)
          p.vy = rand(0.3, 0.7)
          p.vx = 0
          p.state = 'fall'
          p.life = 1
        }
        ctx.fillStyle = `rgba(196, 196, 205, ${p.a * p.life})`
        ctx.fillRect(r.left + p.lx, r.top + p.ly, 2, 2)
      }
    }

    const FIELD_DRAWERS = {
      about: drawAbout,
      experience: drawExperience,
      project: drawProject,
      skills: drawSkills,
      recognition: drawRecognition,
      contact: drawContact,
    }

    const drawFields = () => {
      for (const id of Object.keys(FIELD_DRAWERS)) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.bottom < -40 || r.top > H + 40) {
          fields.delete(id)
          continue
        }
        FIELD_DRAWERS[id](r)
      }
    }

    const drawSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.94
        s.vy *= 0.94
        s.life -= 0.03
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.strokeStyle = s.red
          ? `rgba(226, 75, 74, ${0.7 * s.life})`
          : `hsla(${hue}, 78%, 70%, ${0.7 * s.life})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 2.4, s.y - s.vy * 2.4)
        ctx.stroke()
      }
    }

    const frame = (now) => {
      ctx.clearRect(0, 0, W, H)
      updateHue()
      readBlip()
      drawWire(now || performance.now())
      drawRail()
      if (!reduced) {
        drawFields()
        drawSparks()
      }
    }

    const loop = (now) => {
      frame(now)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!running && !reduced) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (e.target.closest?.('.card-field')) {
        setHint(document.documentElement.dataset.cardDrag ? 'grabbing' : 'card')
        return
      }
      const g = wireGeom()
      const overUI = e.target.closest?.('a, button, input, textarea, form, nav')
      if (!overUI && g && mouse.x > g.left && mouse.x < g.right && Math.abs(mouse.y - g.y) < 70) setHint('wire')
      else setHint('')
    }
    const onClick = (e) => {
      if (e.target.closest?.('a, button, input, textarea, form, nav, .palette-overlay, .term-overlay')) return
      const g = wireGeom()
      if (g && Math.abs(e.clientY - g.y) < 90) {
        const px = e.clientX - g.left
        bumps.push({ pos: px, amp: 34, dir: 1 }, { pos: px, amp: 34, dir: -1 })
        const idx = Math.max(0, Math.min(STATIONS.length - 1, Math.floor((px / (g.right - g.left)) * STATIONS.length)))
        document.getElementById(STATIONS[idx])?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    const onStorm = () => {
      const g = wireGeom()
      if (g) {
        const span = g.right - g.left
        for (let i = 0; i < 6; i++) {
          bumps.push({ pos: rand(0, span), amp: rand(18, 34), dir: Math.random() < 0.5 ? 1 : -1 })
        }
      }
      const first = document.getElementById(STATIONS[0])
      if (first) {
        const railX = first.getBoundingClientRect().left + 6
        for (let i = 0; i < 3; i++) ripples.push({ x: railX, y: rand(H * 0.2, H * 0.8), t: 0 })
      }
    }
    const onTeleport = (e) => {
      const { x, y } = e.detail || {}
      if (typeof x !== 'number') return
      for (let i = 0; i < 12; i++) {
        const ang = (Math.PI * 2 * i) / 12 + Math.random() * 0.4
        const sp = rand(1.6, 3.4)
        sparks.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1 })
      }
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      setHint('')
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    let staticRaf = 0
    const staticPaint = () => {
      cancelAnimationFrame(staticRaf)
      staticRaf = requestAnimationFrame(() => frame(performance.now()))
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) {
      staticPaint()
      window.addEventListener('scroll', staticPaint, { passive: true })
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('click', onClick)
      window.addEventListener('mouseout', onLeave)
      window.addEventListener('blip:teleport', onTeleport)
      window.addEventListener('aurora:storm', onStorm)
      document.addEventListener('visibilitychange', onVisibility)
      start()
    }
    return () => {
      stop()
      cancelAnimationFrame(staticRaf)
      setHint('')
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', staticPaint)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('blip:teleport', onTeleport)
      window.removeEventListener('aurora:storm', onStorm)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="net-canvas" aria-hidden="true" />
}
