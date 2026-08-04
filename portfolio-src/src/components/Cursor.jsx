import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// Signal-probe cursor: a crosshair dot and a trailing ring that carries a live
// sparkline of cursor velocity, like a probe reading the page. States:
//   hidden  over text inputs (native caret restored)
//   wire    over the hero oscilloscope line (ring stretches, ready to bend)
//   link    over links and chips (ring expands, sparkline flattens)
//   button  over buttons and CTAs (ring expands further, fills)
//   default probe with live sparkline
// Fine pointers only; never rendered for touch or reduced motion.
const SPARK_W = 26
const SPARK_H = 10
const SPARK_N = 22

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const sparkRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    setEnabled(true)
    document.documentElement.classList.add('custom-cursor')

    let raf = 0
    let x = -100
    let y = -100
    let px = -100
    let py = -100
    let rx = -100
    let ry = -100
    let elState = ''
    let pressed = false
    const speeds = new Array(SPARK_N).fill(0)

    const stateFor = () => {
      if (elState === 'hidden') return 'hidden'
      const hint = document.documentElement.dataset.canvasHint
      if (hint === 'grabbing') return 'grabbing'
      if (elState) return elState
      if (hint === 'wire' || hint === 'card') return hint
      return 'default'
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      const t = e.target
      if (t.closest?.('input, textarea, select')) elState = 'hidden'
      else if (t.closest?.('button, .btn')) elState = 'button'
      else if (t.closest?.('a')) elState = 'link'
      else elState = ''
    }
    const onDown = () => {
      pressed = true
    }
    const onUp = () => {
      pressed = false
    }
    const onWindowLeave = (e) => {
      if (!e.relatedTarget) {
        x = -100
        y = -100
      }
    }

    const drawSpark = (ctx, flat) => {
      ctx.clearRect(0, 0, SPARK_W, SPARK_H)
      ctx.strokeStyle = 'rgba(139, 135, 247, 0.9)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < SPARK_N; i++) {
        const sx = (SPARK_W * i) / (SPARK_N - 1)
        const v = flat ? 0 : Math.min(1, speeds[i] / 40)
        const sy = SPARK_H - 1.5 - v * (SPARK_H - 3)
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
      }
      ctx.stroke()
    }

    const sparkCtx = () => {
      const c = sparkRef.current
      if (!c) return null
      if (!c.__init) {
        c.width = SPARK_W
        c.height = SPARK_H
        c.__init = true
      }
      return c.getContext('2d')
    }

    const tick = () => {
      const speed = Math.hypot(x - px, y - py)
      px = x
      py = y
      speeds.push(speed)
      speeds.shift()
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot && ring) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        const squeeze = pressed ? ' scale(0.85)' : ''
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)${squeeze}`
        const s = stateFor()
        if (ring.dataset.state !== s) {
          ring.dataset.state = s
          dot.dataset.state = s
        }
        const ctx = sparkCtx()
        if (ctx && s !== 'hidden') drawSpark(ctx, s === 'link' || s === 'button')
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('mouseout', onWindowLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mouseout', onWindowLeave)
    }
  }, [])

  if (!enabled) return null
  return (
    <>
      <div ref={ringRef} className="cur-ring" data-state="default" aria-hidden="true">
        <canvas ref={sparkRef} className="cur-spark" />
      </div>
      <div ref={dotRef} className="cur-dot" data-state="default" aria-hidden="true" />
    </>
  )
}
