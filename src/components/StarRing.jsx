import { onScrollFrame } from '../lib/scroll'
import { useEffect, useRef } from 'react'
import { IRI } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

const N = 13

/**
 * The founding circle: a ring of stars.
 * mode "scroll": stars light one by one as you scroll past (the Origin page).
 * mode "spin": all lit, turning slowly (the small Origin band on the home page).
 */
export default function StarRing({ mode = 'scroll', className = '' }) {
  const ringRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const stars = [...ring.querySelectorAll('.fc-star')]
    const arc = ring.querySelector('.fc-arc')
    const set = (p) => {
      const lit = Math.round(p * N)
      stars.forEach((s, i) => s.classList.toggle('is-lit', i < lit))
      arc.style.strokeDashoffset = `${1 - p}`
    }
    if (mode === 'spin' || prefersReducedMotion()) { set(1); return }
    return onScrollFrame(
      () => (window.innerHeight * 0.95 - ring.getBoundingClientRect().top) / (window.innerHeight * 0.8),
      (p) => set(Math.max(0, Math.min(1, p)))
    )
  }, [mode])

  return (
    <div className={`fc-ring ${mode === 'spin' ? 'is-spin' : ''} ${className}`} ref={ringRef} aria-hidden="true">
      <div className="fc-turn">
        <svg viewBox="0 0 400 400">
          <defs>
            <linearGradient id={`fc-g-${mode}`} x1="0" y1="0" x2="1" y2="1">
              {IRI.map((c, i) => <stop key={c} offset={i / (IRI.length - 1)} stopColor={c} />)}
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(246,241,232,.1)" />
          <circle className="fc-arc" cx="200" cy="200" r="150" fill="none" stroke={`url(#fc-g-${mode})`} strokeWidth="1.6"
            pathLength="1" strokeDasharray="1" strokeDashoffset="1" transform="rotate(-90 200 200)" />
        </svg>
        {Array.from({ length: N }).map((_, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2
          return (
            <span key={i} className="fc-star" style={{ left: `${50 + Math.cos(a) * 37.5}%`, top: `${50 + Math.sin(a) * 37.5}%`, '--c': IRI[i % IRI.length] }} />
          )
        })}
      </div>
      <span className="fc-center">✦</span>
    </div>
  )
}
