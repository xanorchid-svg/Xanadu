import { useEffect, useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { prefersReducedMotion } from '../lib/sky'

/**
 * The problem, said plainly. A crack runs across the page and, as you scroll,
 * it fills with gold: kintsugi, the broken thing repaired and made more beautiful.
 */
export default function Why() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    const len = path.getTotalLength()
    const set = (p) => {
      const off = len * (1 - p)
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${off}`
      glowRef.current.style.strokeDasharray = `${len}`
      glowRef.current.style.strokeDashoffset = `${off}`
    }
    if (prefersReducedMotion()) { set(1); return }
    const onScroll = () => {
      const r = sectionRef.current.getBoundingClientRect()
      const p = (window.innerHeight * 0.85 - r.top) / (r.height * 0.7)
      set(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const crack = 'M-10,120 L140,96 L210,140 L330,88 L420,132 L560,70 L640,118 L770,84 L860,150 L990,98 L1080,128 L1210,80 L1300,110 L1450,92'

  return (
    <section id="why" ref={sectionRef} className="why">
      <div className="wrap">
        <p className="eyebrow center">Why Xanadu</p>
        <Reveal className="display center why-title" stagger={0.05}>
          Something has been broken for a long time.
        </Reveal>
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

      <div className="wrap">
        <Reveal as="p" className="lede center why-lede" stagger={0.035}>
          The trust between people and the spaces that hold them. It has become hard to know which places truly hold integrity, and true intention.
        </Reveal>
        <Rise as="p" className="body center narrow">
          The spaces we enter shape our experiences. The communities we gather with shape our lives. Xanadu exists to restore trust in the places where transformation happens.
        </Rise>
        <Rise className="definition iri-border" delay={0.15}>
          <p className="def-word">xa·na·du</p>
          <p className="def-say">/ˈzanəˌdo͞o/ &nbsp;noun</p>
          <p className="def-text">An idealized place of great or idyllic magnificence and beauty.</p>
        </Rise>
        <Reveal as="p" className="display center why-invite" stagger={0.07}>
          Xanadu is not an answer. It is an <Shimmer>invitation</Shimmer>.
        </Reveal>
      </div>
    </section>
  )
}
