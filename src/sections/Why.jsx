import { onScrollFrame } from '../lib/scroll'
import { useEffect, useRef } from 'react'
import { Reveal, Rise } from '../components/Reveal'
import { prefersReducedMotion } from '../lib/sky'

/**
 * The problem, said once and plainly.
 * A crack runs across the page and fills with gold as you scroll: kintsugi,
 * the broken thing repaired and made more beautiful.
 */
export default function Why() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    const len = path.getTotalLength()
    const set = (p) => {
      const off = `${len * (1 - p)}`
      for (const el of [path, glowRef.current]) {
        el.style.strokeDasharray = `${len}`
        el.style.strokeDashoffset = off
      }
    }
    if (prefersReducedMotion()) { set(1); return }
    return onScrollFrame(
      () => { const r = sectionRef.current.getBoundingClientRect(); return (window.innerHeight * 0.9 - r.top) / (r.height * 0.9) },
      (p) => set(Math.max(0, Math.min(1, p)))
    )
  }, [])

  const crack = 'M-10,120 L140,96 L210,140 L330,88 L420,132 L560,70 L640,118 L770,84 L860,150 L990,98 L1080,128 L1210,80 L1300,110 L1450,92'

  return (
    <section id="why" ref={sectionRef} className="why">
      <div className="wrap why-grid">
        <div>
          <p className="eyebrow">Why Xanadu</p>
          <Reveal className="display why-title" stagger={0.05}>
            Something has been broken for a long time.
          </Reveal>
        </div>
        <Rise className="why-copy" delay={0.15}>
          <p>The trust between people and the places that hold them.</p>
          <p>It has become hard to know which spaces carry real integrity and intention. Xanadu exists to restore that trust.</p>
        </Rise>
      </div>

      <svg className="kintsugi" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="kin" x1="0" x2="1">
            <stop offset="0" stopColor="#E8BF8A" />
            <stop offset=".3" stopColor="#E09AC4" />
            <stop offset=".55" stopColor="#B58BE0" />
            <stop offset=".8" stopColor="#6FB7BF" />
            <stop offset="1" stopColor="#E8BF8A" />
          </linearGradient>
          <filter id="kin-glow" x="-10%" y="-200%" width="120%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path d={crack} fill="none" stroke="rgba(246,241,232,.12)" strokeWidth="1" />
        <path ref={glowRef} d={crack} fill="none" stroke="url(#kin)" strokeWidth="6" filter="url(#kin-glow)" opacity=".7" />
        <path ref={pathRef} d={crack} fill="none" stroke="url(#kin)" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </section>
  )
}
