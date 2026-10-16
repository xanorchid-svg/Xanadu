import { useEffect, useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { IRI } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

const D2R = Math.PI / 180

const hexRgb = (h) => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const IRI_RGB = IRI.map(hexRgb)
const iriAt = (t) => {
  t = (((t % 1) + 1) % 1) * IRI_RGB.length
  const a = IRI_RGB[Math.floor(t)], b = IRI_RGB[(Math.floor(t) + 1) % IRI_RGB.length], f = t % 1
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}

const toVec = (lat, lon) => {
  const p = lat * D2R, l = lon * D2R
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)]
}

// a star-field sphere: points spread evenly with a Fibonacci spiral
const DOTS = (() => {
  const n = 1100, out = []
  const g = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = g * i
    out.push({ v: [Math.cos(th) * r, y, Math.sin(th) * r], s: Math.random(), t: Math.random() })
  }
  return out
})()

// Unnamed points of light on every continent: the kinds of places the network reaches for.
// Coasts, jungles, mountains, deserts, villages and cities. No names, no claims.
const NODES = [
  [39.5, -105.8], [36.8, -121.9], [20.7, -105.3], [9.9, -85.6], [18.4, -66.1], [-13.5, -72.0], [-34.6, -58.4], [-22.9, -43.2],
  [38.7, -9.1], [37.4, -5.9], [43.7, 7.3], [41.9, 12.5], [35.9, 14.5], [64.1, -21.9], [31.6, -8.0], [-1.3, 36.8], [-33.9, 18.4],
  [12.0, 76.0], [27.7, 85.3], [7.9, 98.3], [-8.4, 115.2], [35.0, 135.8], [-41.3, 174.8], [-28.6, 153.6], [21.3, -157.8], [-17.5, -149.6],
].map(([lat, lon], i) => ({ v: toVec(lat, lon), ph: i * 0.37 }))

const slerp = (a, b, t) => {
  const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const om = Math.acos(d)
  if (om < 1e-4) return a
  const s = Math.sin(om)
  const k1 = Math.sin((1 - t) * om) / s, k2 = Math.sin(t * om) / s
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]
}

export default function Places() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, R = 0
    const resize = () => {
      W = canvas.clientWidth
      canvas.width = W * dpr
      canvas.height = W * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = W * 0.38
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const st = { rot: 60 * D2R, vel: reduced ? 0 : 0.0018, tilt: -0.32, dragging: false, lastX: 0, lastY: 0 }

    const project = (v, lift = 1) => {
      const c = Math.cos(st.rot), s = Math.sin(st.rot)
      const x = v[0] * c + v[2] * s
      const z0 = -v[0] * s + v[2] * c
      const ct = Math.cos(st.tilt), sn = Math.sin(st.tilt)
      const y = v[1] * ct - z0 * sn
      const z = v[1] * sn + z0 * ct
      return [W / 2 + x * R * lift, W / 2 - y * R * lift, z]
    }

    // connections are born, travel, and fade: a network forming in real time
    const arcs = []
    const spawn = (now) => {
      const a = NODES[Math.floor(Math.random() * NODES.length)]
      let b = a
      while (b === a) b = NODES[Math.floor(Math.random() * NODES.length)]
      arcs.push({ a: a.v, b: b.v, born: now, life: 4200 + Math.random() * 2400, hue: Math.random() })
    }
    if (reduced) {
      for (let i = 0; i < 9; i++) arcs.push({ a: NODES[i * 2].v, b: NODES[(i * 2 + 5) % NODES.length].v, born: -1e9, life: Infinity, hue: i / 9 })
    }

    const down = (e) => { st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY; canvas.setPointerCapture(e.pointerId) }
    const move = (e) => {
      if (!st.dragging) return
      const dx = e.clientX - st.lastX, dy = e.clientY - st.lastY
      st.rot += dx * 0.006
      st.tilt = Math.max(-1.1, Math.min(1.1, st.tilt + dy * 0.004))
      st.vel = dx * 0.0008
      st.lastX = e.clientX; st.lastY = e.clientY
    }
    const up = () => { st.dragging = false }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    let raf, t0 = performance.now(), visible = true, lastSpawn = 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      const t = Math.max(0, now - t0) / 1000

      if (!st.dragging) {
        const base = reduced ? 0 : 0.0018
        st.vel += (base - st.vel) * 0.02
        st.rot += st.vel
      }
      if (!reduced && now - lastSpawn > 650 && arcs.length < 14) { spawn(now); lastSpawn = now }

      ctx.clearRect(0, 0, W, W)
      const cx = W / 2

      const halo = ctx.createRadialGradient(cx, cx, R * 0.6, cx, cx, R * 1.4)
      halo.addColorStop(0, 'rgba(143,155,230,0.0)')
      halo.addColorStop(0.45, 'rgba(181,139,224,0.16)')
      halo.addColorStop(0.7, 'rgba(111,183,191,0.06)')
      halo.addColorStop(1, 'rgba(16,27,44,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, W, W)

      const body = ctx.createRadialGradient(cx - R * 0.35, cx - R * 0.4, R * 0.1, cx, cx, R)
      body.addColorStop(0, 'rgba(42,31,57,0.75)')
      body.addColorStop(1, 'rgba(12,21,34,0.92)')
      ctx.fillStyle = body
      ctx.beginPath(); ctx.arc(cx, cx, R, 0, Math.PI * 2); ctx.fill()

      const rim = ctx.createLinearGradient(0, 0, W, W)
      IRI.forEach((c, i) => rim.addColorStop(((i / IRI.length) + t * 0.05) % 1, c))
      ctx.strokeStyle = rim
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(cx, cx, R, 0, Math.PI * 2); ctx.stroke()
      ctx.globalAlpha = 1

      for (const d of DOTS) {
        const [x, y, z] = project(d.v)
        if (z < -0.15) continue
        const a = Math.max(0, z) * 0.95 + 0.12
        const tw = 0.6 + 0.4 * Math.sin(t * 1.6 + d.t * 20)
        const c = iriAt(d.v[1] * 0.4 + d.v[0] * 0.2 + t * 0.03)
        ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a * tw})`
        const s = 0.8 + d.s * 1.6 * (0.5 + z * 0.5)
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      }

      // arcs: draw out, carry a spark, then fade
      ctx.lineWidth = 1.1
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i]
        const age = (now - arc.born) / arc.life
        if (age >= 1) { arcs.splice(i, 1); continue }
        const grow = reduced ? 1 : Math.min(1, age * 2.6)
        const fade = reduced ? 0.8 : age < 0.7 ? 1 : 1 - (age - 0.7) / 0.3
        const N = 36
        let prev = null
        for (let k = 0; k <= N * grow; k++) {
          const u = k / N
          const p = project(slerp(arc.a, arc.b, u), 1 + 0.2 * Math.sin(Math.PI * u))
          if (prev && p[2] > -0.05 && prev[2] > -0.05) {
            const c = iriAt(arc.hue + u * 0.25)
            ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${(0.2 + Math.max(0, p[2]) * 0.6) * fade})`
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke()
          }
          prev = p
        }
        if (!reduced && grow < 1) {
          const p = project(slerp(arc.a, arc.b, grow), 1 + 0.2 * Math.sin(Math.PI * grow))
          if (p[2] > 0) {
            const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 8)
            g.addColorStop(0, 'rgba(255,246,228,1)')
            g.addColorStop(1, 'rgba(232,191,138,0)')
            ctx.fillStyle = g
            ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, Math.PI * 2); ctx.fill()
          }
        }
      }

      // the points of light
      for (const n of NODES) {
        const [x, y, z] = project(n.v)
        if (z < 0) continue
        const pulse = (((t * 0.6 + n.ph) % 1) + 1) % 1
        ctx.strokeStyle = `rgba(232,191,138,${(1 - pulse) * 0.55 * z})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(x, y, 2 + pulse * 12, 0, Math.PI * 2); ctx.stroke()
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7)
        g.addColorStop(0, `rgba(255,248,230,${0.4 + z * 0.6})`)
        g.addColorStop(0.4, `rgba(232,191,138,${0.3 + z * 0.5})`)
        g.addColorStop(1, 'rgba(232,191,138,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <section id="places" className="places">
      <div className="wrap places-grid">
        <div className="places-copy">
          <p className="eyebrow">Across the globe</p>
          <Reveal className="display">A world of <Shimmer>places</Shimmer>.</Reveal>
          <Rise as="p" className="body">
            Xanadu connects people with places and communities all over the world. Jungle and coastline, mountain and desert, village and city. Wherever you feel most alive, the network is growing toward it.
          </Rise>
          <Rise as="p" className="places-note" delay={0.15}>
            Know a place that belongs here? <a className="text-link" href="mailto:networkxanadu@gmail.com">Tell us</a>
          </Rise>
        </div>
        <div className="globe-wrap">
          <canvas ref={canvasRef} className="globe" aria-label="A turning globe of light, with new connections forming between places around the world" role="img" />
          <p className="globe-hint" aria-hidden="true">drag to turn</p>
        </div>
      </div>
    </section>
  )
}
