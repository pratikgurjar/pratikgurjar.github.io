import { useEffect, useRef, useCallback } from 'react'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds .in once the element scrolls into view. Elements keep .rv from markup.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.querySelectorAll('.rv').forEach((n) => n.classList.add('in'))
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    if (el.classList.contains('rv')) io.observe(el)
    el.querySelectorAll('.rv').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

// Card spotlight plus 3D tilt: --mx/--my drive the glow, --rx/--ry the tilt.
export function useCardFx(maxTilt = 3.5) {
  const onMouseMove = useCallback(
    (e) => {
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      el.style.setProperty('--mx', `${px}px`)
      el.style.setProperty('--my', `${py}px`)
      if (prefersReducedMotion()) return
      el.style.setProperty('--rx', `${((py / r.height - 0.5) * -2 * maxTilt).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${((px / r.width - 0.5) * 2 * maxTilt).toFixed(2)}deg`)
    },
    [maxTilt],
  )
  const onMouseLeave = useCallback((e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }, [])
  return { onMouseMove, onMouseLeave }
}

// Magnetic pull, a few px toward the cursor. No-op with reduced motion.
export function useMagnet(strength = 0.18, max = 4) {
  const onMove = useCallback(
    (e) => {
      if (prefersReducedMotion()) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const tx = Math.max(-max, Math.min(max, dx * strength))
      const ty = Math.max(-max, Math.min(max, dy * strength))
      el.style.transform = `translate(${tx}px, ${ty}px)`
    },
    [strength, max],
  )
  const onLeave = useCallback((e) => {
    e.currentTarget.style.transform = ''
  }, [])
  return { onMouseMove: onMove, onMouseLeave: onLeave }
}

// Keep Tab cycling inside an open overlay (palette, terminal).
export function trapFocus(container, e) {
  if (e.key !== 'Tab' || !container) return
  const els = container.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')
  if (!els.length) return
  const first = els[0]
  const last = els[els.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

export function copyToClipboard(text) {
  const legacy = () => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => legacy())
  }
  legacy()
  return Promise.resolve()
}
