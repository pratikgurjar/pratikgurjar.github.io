import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// Hero centerpiece: a payment card drawn as particles, and now a toy.
//  - drag horizontally to spin it; release and it keeps spinning, then
//    settles snapped to the nearest face
//  - a quick click flips it: the back has a magstripe, signature dashes
//    and three CVV dots
//  - dots swell slightly near the cursor; storms shake it
// Face culling is a soft crossfade on the face normal, so edge-on the card
// thins out like a real object. Desktop only; reduced motion gets a static
// assembled front. window.__cardYaw is exposed for end-to-end tests.
const W = 3.4
const H = 2.15

function buildPoints() {
  const pts = []
  const inCard = (x, y) => {
    const rx = Math.abs(x) - (W / 2 - 0.28)
    const ry = Math.abs(y) - (H / 2 - 0.28)
    if (rx > 0 && ry > 0 && Math.hypot(rx, ry) > 0.28) return false
    return true
  }
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 19; j++) {
      const x = -W / 2 + (W * i) / 29
      const y = -H / 2 + (H * j) / 18
      if (!inCard(x, y)) continue
      const border = i === 0 || i === 29 || j === 0 || j === 18
      pts.push({ x, y, z: 0, s: border ? 1.5 : 1, a: border ? 0.55 : 0.22, face: 0 })
    }
  }
  for (let i = 0; i < 7; i++)
    for (let j = 0; j < 5; j++)
      pts.push({ x: -1.18 + i * 0.09, y: 0.28 + j * 0.09, z: 0.05, s: 1.7, a: 0.85, face: 1 })
  for (let r = 0; r < 3; r++) {
    const rad = 0.14 + r * 0.11
    for (let k = 0; k <= 6; k++) {
      const ang = -Math.PI / 3 + ((k / 6) * (Math.PI * 2)) / 3
      pts.push({ x: 1.05 + Math.cos(ang) * rad, y: 0.5 + Math.sin(ang) * rad, z: 0.04, s: 1.3, a: 0.6, face: 1 })
    }
  }
  for (let g = 0; g < 4; g++)
    for (let d = 0; d < 4; d++)
      pts.push({ x: -1.25 + g * 0.72 + d * 0.13, y: -0.42, z: 0.04, s: 1.8, a: 0.8, face: 1 })
  for (let d = 0; d < 6; d++) pts.push({ x: -1.25 + d * 0.14, y: -0.78, z: 0.03, s: 1.2, a: 0.45, face: 1 })
  // Back face: magstripe band, signature dashes, CVV.
  for (let i = 0; i < 28; i++)
    for (let j = 0; j < 3; j++)
      pts.push({ x: -W / 2 + 0.15 + (i * (W - 0.3)) / 27, y: 0.62 + j * 0.11, z: -0.04, s: 1.6, a: 0.6, face: -1 })
  for (let d = 0; d < 14; d++)
    pts.push({ x: -1.3 + d * 0.13, y: -0.15, z: -0.04, s: d % 3 === 2 ? 0.9 : 1.4, a: 0.5, face: -1 })
  for (let d = 0; d < 3; d++) pts.push({ x: 0.85 + d * 0.16, y: -0.15, z: -0.05, s: 2, a: 0.9, face: -1 })
  for (let d = 0; d < 5; d++) pts.push({ x: -1.3 + d * 0.16, y: -0.62, z: -0.03, s: 1.1, a: 0.4, face: -1 })
  return pts
}

export default function CardField() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 1000) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    let raf = 0
    let running = false
    const pts = buildPoints().map((p) => ({
      ...p,
      fx: (Math.random() - 0.5) * 9,
      fy: (Math.random() - 0.5) * 7,
      fz: (Math.random() - 0.5) * 6,
      delay: Math.random() * 0.5,
    }))
    const t0 = performance.now()
    let cw = 0
    let ch = 0
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    let shakeUntil = 0
    let spin = 0
    let spinVel = 0
    const drag = { on: false, lastX: 0, startX: 0, startY: 0, startT: 0, moved: 0 }
    const local = { x: -9999, y: -9999 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = canvas.clientWidth
      ch = canvas.clientHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ease = (t) => 1 - Math.pow(1 - t, 3)
    const clamp01 = (v) => Math.max(0, Math.min(1, v))

    const draw = (now) => {
      ctx.clearRect(0, 0, cw, ch)
      const t = (now - t0) / 1000
      const storm = now < shakeUntil
      tilt.x += (tilt.tx - tilt.x) * 0.06
      tilt.y += (tilt.ty - tilt.y) * 0.06
      if (!drag.on) {
        spin += spinVel
        spinVel *= 0.965
        if (Math.abs(spinVel) < 0.002) {
          const rest = Math.round(spin / Math.PI) * Math.PI
          spin += (rest - spin) * 0.08
        }
      }
      window.__cardYaw = spin
      const sway = Math.sin(t * 0.32) * 0.28
      const yaw = spin + sway * Math.cos(spin) * 0.4 + tilt.x + (storm ? Math.sin(t * 31) * 0.05 : 0)
      const pitch = -0.16 + Math.sin(t * 0.21) * 0.1 + tilt.y + (storm ? Math.cos(t * 27) * 0.04 : 0)
      const cy = Math.cos(yaw)
      const sy = Math.sin(yaw)
      const cx = Math.cos(pitch)
      const sx = Math.sin(pitch)
      const facing = Math.cos(yaw)
      const scale = Math.min(cw, ch * 1.6) / 4.6
      const assemble = reduced ? 1 : Math.min(1, Math.max(0, (t - 0.15) / 1.3))
      for (const p of pts) {
        let vis = 1
        if (p.face === 1) vis = clamp01(facing * 3)
        else if (p.face === -1) vis = clamp01(-facing * 3)
        if (vis <= 0.01) continue
        const k = reduced ? 1 : ease(Math.min(1, Math.max(0, (assemble - p.delay * 0.4) / 0.6)))
        const px = p.fx + (p.x - p.fx) * k
        const py = p.fy + (p.y - p.fy) * k
        const pz = p.fz + (p.z - p.fz) * k
        let X = px * cy + pz * sy
        let Z = -px * sy + pz * cy
        let Y = py * cx - Z * sx
        Z = py * sx + Z * cx
        const f = 3.6 / (3.6 + Z)
        const sxp = cw / 2 + X * scale * f
        const syp = ch / 2 - Y * scale * f
        const depth = Math.max(0.35, Math.min(1.25, f))
        const md = Math.hypot(sxp - local.x, syp - local.y)
        const swell = md < 90 ? 1 + (1 - md / 90) * 0.9 : 1
        ctx.fillStyle = `hsla(247, 70%, ${74 + (swell > 1 ? 6 : 0)}%, ${p.a * k * depth * vis})`
        ctx.beginPath()
        ctx.arc(sxp, syp, p.s * depth * 1.15 * swell, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (now) => {
      draw(now)
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
    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect()
      local.x = e.clientX - r.left
      local.y = e.clientY - r.top
      return r
    }
    const onMove = (e) => {
      const r = toLocal(e)
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height
      tilt.tx = Math.max(-0.4, Math.min(0.4, nx * 0.7))
      tilt.ty = Math.max(-0.3, Math.min(0.3, ny * 0.5))
      if (drag.on) {
        const dx = e.clientX - drag.lastX
        drag.lastX = e.clientX
        drag.moved += Math.abs(dx)
        spin += dx * 0.011
        spinVel = dx * 0.011
      }
    }
    const onDown = (e) => {
      if (e.button !== 0) return
      drag.on = true
      drag.lastX = e.clientX
      drag.startX = e.clientX
      drag.startY = e.clientY
      drag.startT = performance.now()
      drag.moved = 0
      document.documentElement.dataset.cardDrag = '1'
      canvas.setPointerCapture?.(e.pointerId)
    }
    const onUp = (e) => {
      if (!drag.on) return
      drag.on = false
      delete document.documentElement.dataset.cardDrag
      const quick = performance.now() - drag.startT < 260 && drag.moved < 6
      if (quick) {
        spinVel = 0
        const target = (Math.round(spin / Math.PI) + 1) * Math.PI
        const flip = setInterval(() => {
          spin += (target - spin) * 0.14
          if (Math.abs(target - spin) < 0.01) {
            spin = target
            clearInterval(flip)
          }
        }, 16)
      }
    }
    const onLeaveCanvas = () => {
      local.x = -9999
      local.y = -9999
    }
    const onStorm = () => {
      shakeUntil = performance.now() + 9000
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) {
      draw(t0 + 2000)
    } else {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
      canvas.addEventListener('pointerleave', onLeaveCanvas)
      window.addEventListener('aurora:storm', onStorm)
      document.addEventListener('visibilitychange', onVisibility)
      start()
    }
    return () => {
      stop()
      delete document.documentElement.dataset.cardDrag
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeaveCanvas)
      window.removeEventListener('aurora:storm', onStorm)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="card-field" aria-hidden="true" />
}
