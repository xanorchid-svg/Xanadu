import { useEffect, useRef, useState } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { PLACES, IRI } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

const D2R = Math.PI / 180

const hexRgb = (h) => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const IRI_RGB = IRI.map(hexRgb)
const iriAt = (t) => {
  t = ((t % 1) + 1) % 1 * IRI_RGB.length
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

// the constellation: places joined in a loop
const ORDER = ['California', 'Colorado', 'Costa Rica', 'Peru', 'Buenos Aires', 'Portugal', 'Bali']
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
  const [focus, setFocus] = useState(null)
  const focusRef = useRef(null)
  useEffect(() => { focusRef.current = focus }, [focus])

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
      R = W * 0.36
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const st = { rot: 60 * D2R, vel: reduced ? 0 : 0.0018, tilt: -0.32, dragging: false, lastX: 0, lastY: 0 }
    const places = PLACES.map((p) => ({ ...p, v: toVec(p.lat, p.lon) }))
    const byName = Object.fromEntries(places.map((p) => [p.name, p]))
    const arcs = ORDER.map((n, i) => [byName[n].v, byName[ORDER[(i + 1) % ORDER.length]].v])

    const project = (v, lift = 1) => {
      const c = Math.cos(st.rot), s = Math.sin(st.rot)
      const x = v[0] * c + v[2] * s
      const z0 = -v[0] * s + v[2] * c
      const ct = Math.cos(st.tilt), sn = Math.sin(st.tilt)
      const y = v[1] * ct - z0 * sn
      const z = v[1] * sn + z0 * ct
      return [W / 2 + x * R * lift, W / 2 - y * R * lift, z]
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

    let raf, t0 = performance.now(), visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      const t = Math.max(0, now - t0) / 1000

      // turn toward a chosen place, otherwise drift
      const f = focusRef.current && byName[focusRef.current]
      if (f && !st.dragging) {
        const target = -f.lon * D2R
        let d = target - st.rot
        d = Math.atan2(Math.sin(d), Math.cos(d))
        st.rot += d * 0.06
        st.tilt += (-f.lat * D2R * 0.6 - st.tilt) * 0.05
      } else if (!st.dragging) {
        const base = reduced ? 0 : 0.0018
        st.vel += (base - st.vel) * 0.02
        st.rot += st.vel
      }

      ctx.clearRect(0, 0, W, W)
      const cx = W / 2

      // halo
      const halo = ctx.createRadialGradient(cx, cx, R * 0.6, cx, cx, R * 1.45)
      halo.addColorStop(0, 'rgba(143,155,230,0.0)')
      halo.addColorStop(0.45, 'rgba(181,139,224,0.16)')
      halo.addColorStop(0.7, 'rgba(111,183,191,0.06)')
      halo.addColorStop(1, 'rgba(16,27,44,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, W, W)

      // body
      const body = ctx.createRadialGradient(cx - R * 0.35, cx - R * 0.4, R * 0.1, cx, cx, R)
      body.addColorStop(0, 'rgba(42,31,57,0.75)')
      body.addColorStop(1, 'rgba(12,21,34,0.92)')
      ctx.fillStyle = body
      ctx.beginPath(); ctx.arc(cx, cx, R, 0, Math.PI * 2); ctx.fill()

      // iridescent rim
      const rim = ctx.createLinearGradient(0, 0, W, W)
      IRI.forEach((c, i) => rim.addColorStop(((i / IRI.length) + t * 0.05) % 1, c))
      ctx.strokeStyle = rim
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(cx, cx, R, 0, Math.PI * 2); ctx.stroke()
      ctx.globalAlpha = 1

      // star-field dots
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

      // constellation arcs, lifted off the surface, with a spark travelling each one
      ctx.lineWidth = 1
      arcs.forEach(([a, b], ai) => {
        const N = 40
        let prev = null
        for (let i = 0; i <= N; i++) {
          const k = i / N
          const lift = 1 + 0.16 * Math.sin(Math.PI * k)
          const p = project(slerp(a, b, k), lift)
          if (prev && p[2] > -0.05 && prev[2] > -0.05) {
            const c = iriAt(ai / arcs.length + k * 0.2)
            ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${0.15 + Math.max(0, p[2]) * 0.45})`
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke()
          }
          prev = p
        }
        if (!reduced) {
          const k = ((t * 0.18 + ai * 0.37) % 1)
          const p = project(slerp(a, b, k), 1 + 0.16 * Math.sin(Math.PI * k))
          if (p[2] > 0) {
            const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 7)
            g.addColorStop(0, 'rgba(255,244,218,0.95)')
            g.addColorStop(1, 'rgba(232,191,138,0)')
            ctx.fillStyle = g
            ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill()
          }
        }
      })

      // places
      ctx.font = `500 ${W < 420 ? 11 : 12.5}px Manrope, sans-serif`
      ctx.textBaseline = 'middle'
      for (const p of places) {
        const [x, y, z] = project(p.v)
        if (z < 0) continue
        const on = focusRef.current === p.name
        const pulse = (((t * 0.8 + p.lon / 90) % 1) + 1) % 1
        ctx.strokeStyle = `rgba(232,191,138,${(1 - pulse) * 0.7 * z})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(x, y, 3 + pulse * (on ? 22 : 14), 0, Math.PI * 2); ctx.stroke()
        const g = ctx.createRadialGradient(x, y, 0, x, y, on ? 12 : 8)
        g.addColorStop(0, 'rgba(255,248,230,1)')
        g.addColorStop(0.35, 'rgba(232,191,138,0.9)')
        g.addColorStop(1, 'rgba(232,191,138,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, on ? 12 : 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(246,241,232,${Math.min(1, z * 1.6) * (on ? 1 : 0.82)})`
        const left = p.side ? p.side === 'right' : x > cx
        ctx.textAlign = left ? 'left' : 'right'
        ctx.fillText(p.name, x + (left ? 12 : -12), y - 1)
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
          <p className="eyebrow">Where Xanadu is waking up</p>
          <Reveal className="display">A <Shimmer>constellation</Shimmer> of places.</Reveal>
          <Rise as="p" className="body">
            Seven places to begin, from the mountains of Colorado to the jungles of Bali. More are waking up as the network grows.
          </Rise>
          <Rise className="place-chips" delay={0.15}>
            {PLACES.map((p) => (
              <button key={p.name}
                className={`place-chip iri-border ${focus === p.name ? 'is-on' : ''}`}
                onPointerEnter={() => setFocus(p.name)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(p.name)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus(focus === p.name ? null : p.name)}>
                {p.name}
              </button>
            ))}
          </Rise>
        </div>
        <div className="globe-wrap">
          <canvas ref={canvasRef} className="globe" aria-label="A turning globe of stars marking Colorado, California, Costa Rica, Peru, Buenos Aires, Portugal and Bali" role="img" />
          <p className="globe-hint" aria-hidden="true">drag to turn</p>
        </div>
      </div>
    </section>
  )
}
