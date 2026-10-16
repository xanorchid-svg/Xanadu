import { useEffect, useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { IRI } from '../lib/links'
import { prefersReducedMotion, isTouch } from '../lib/sky'

/**
 * A living web: points of light drift and reach for each other.
 * Near the cursor they gather and glow, like a network noticing you.
 */
function Web() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, nodes = [], visible = false, raf
    const mouse = { x: -999, y: -999 }

    const make = () => {
      const n = Math.round(Math.min(90, (W * H) / (isTouch() ? 9000 : 13000)))
      nodes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 2.2, c: IRI[i % IRI.length], ph: Math.random() * 6.28,
      }))
    }
    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      make()
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(canvas)
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const onLeave = () => { mouse.x = -999; mouse.y = -999 }
    window.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)

    const LINK = 120
    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        if (!reduced) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy)
          if (d < 180 && d > 1) { n.vx += (dx / d) * 0.012; n.vy += (dy / d) * 0.012 }
          n.vx *= 0.995; n.vy *= 0.995
          n.x += n.vx; n.y += n.vy
          if (n.x < 0 || n.x > W) n.vx *= -1
          if (n.y < 0 || n.y > H) n.vy *= -1
        }
      }
      ctx.lineWidth = 0.8
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK) {
            const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            g.addColorStop(0, a.c); g.addColorStop(1, b.c)
            ctx.strokeStyle = g
            ctx.globalAlpha = (1 - d / LINK) * 0.45
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      for (const n of nodes) {
        const near = Math.max(0, 1 - Math.hypot(mouse.x - n.x, mouse.y - n.y) / 180)
        const pulse = 0.7 + 0.3 * Math.sin(t / 900 + n.ph)
        const r = n.r * (1 + near * 1.4) * pulse
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4)
        g.addColorStop(0, n.c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#FFF6E6'
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.6, 0, Math.PI * 2); ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return <canvas ref={ref} className="web" aria-hidden="true" />
}

export default function LivingNetwork() {
  return (
    <section id="network" className="lnet">
      <Web />
      <div className="wrap lnet-inner">
        <p className="eyebrow center">The living network</p>
        <Reveal className="display center lnet-title" stagger={0.07}>
          What grows here, grows <Shimmer>together</Shimmer>.
        </Reveal>
        <Rise as="p" className="lede center lnet-lede">
          This is not a directory. It is a living system.
        </Rise>
        <Rise as="p" className="body center narrow" delay={0.15}>
          A space here is not competing for clicks. A guide is not posting into a void. They arrive into a room where someone is already waiting for exactly what they carry. Every true encounter makes the whole network more trusted.
        </Rise>
        <Rise as="p" className="lnet-quote" delay={0.25}>The exposure you seek is not reach. It is resonance.</Rise>
        <Rise className="deep-links" delay={0.3}>
          <a href="/living-network" className="deep-link" data-cursor="hover"><span>Dive deeper</span><i>→</i></a>
        </Rise>
      </div>
    </section>
  )
}
