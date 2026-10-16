import { useEffect, useRef } from 'react'
import { isTouch, prefersReducedMotion } from '../lib/sky'
import { IRI } from '../lib/links'

/**
 * A soft glowing cursor that leaves a trail of iridescent stardust.
 * Desktop only; touch devices and "reduce motion" keep the normal cursor.
 */
export default function Cursor() {
  const canvasRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    document.documentElement.classList.add('has-cursor')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const parts = []
    const m = { x: -100, y: -100, px: -100, py: -100 }
    const ring = { x: -100, y: -100, s: 1 }
    let hue = 0, hovering = false, visible = false

    const onMove = (e) => {
      m.x = e.clientX
      m.y = e.clientY
      if (!visible) {
        visible = true
        ring.x = m.x; ring.y = m.y; m.px = m.x; m.py = m.y
        dotRef.current.style.opacity = 1
        ringRef.current.style.opacity = 1
      }
      const t = e.target.closest?.('a, button, [data-cursor="hover"], input, label')
      hovering = !!t
    }
    const onLeave = () => {
      visible = false
      dotRef.current.style.opacity = 0
      ringRef.current.style.opacity = 0
    }
    const onDown = () => {
      // a little burst of stars on click
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2
        parts.push({ x: m.x, y: m.y, vx: Math.cos(a) * 2.6, vy: Math.sin(a) * 2.6, life: 1, size: 2.2, c: IRI[i % IRI.length] })
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)

    let raf
    const loop = () => {
      const dx = m.x - m.px, dy = m.y - m.py
      const speed = Math.hypot(dx, dy)
      const n = Math.min(4, Math.floor(speed / 6))
      for (let i = 0; i < n; i++) {
        hue = (hue + 1) % IRI.length
        parts.push({
          x: m.px + (dx * i) / Math.max(n, 1) + (Math.random() - 0.5) * 6,
          y: m.py + (dy * i) / Math.max(n, 1) + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.25,
          life: 1,
          size: 0.8 + Math.random() * 1.8,
          c: IRI[Math.floor(hue)],
        })
      }
      m.px = m.x; m.py = m.y

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97
        p.life -= 0.022
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx.globalAlpha = p.life * 0.9
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life + 0.3, 0, Math.PI * 2)
        ctx.fill()
      }
      if (parts.length > 260) parts.splice(0, parts.length - 260)

      ring.x += (m.x - ring.x) * 0.18
      ring.y += (m.y - ring.y) * 0.18
      ring.s += ((hovering ? 2.2 : 1) - ring.s) * 0.15
      dotRef.current.style.transform = `translate(${m.x}px, ${m.y}px)`
      ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) scale(${ring.s})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="cursor-trail" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
