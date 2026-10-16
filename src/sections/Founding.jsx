import { useEffect, useRef } from 'react'
import Button from '../components/Button'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS, IRI } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

const N = 13

/**
 * The founding circle. A ring of stars lights up one by one as you scroll:
 * "When the circle feels complete, we open Xanadu to Seekers."
 */
export default function Founding() {
  const sectionRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const stars = [...ringRef.current.querySelectorAll('.fc-star')]
    const arc = ringRef.current.querySelector('.fc-arc')
    const set = (p) => {
      const lit = Math.round(p * N)
      stars.forEach((s, i) => s.classList.toggle('is-lit', i < lit))
      arc.style.strokeDashoffset = `${1 - p}`
    }
    if (prefersReducedMotion()) { set(1); return }
    const onScroll = () => {
      const r = sectionRef.current.getBoundingClientRect()
      const p = (window.innerHeight * 0.7 - r.top) / (r.height * 0.75)
      set(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="founding" ref={sectionRef} className="founding">
      <div className="wrap founding-grid">
        <div className="fc-ring" ref={ringRef} aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <defs>
              <linearGradient id="fc-g" x1="0" y1="0" x2="1" y2="1">
                {IRI.map((c, i) => <stop key={c} offset={i / (IRI.length - 1)} stopColor={c} />)}
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(246,241,232,.1)" />
            <circle className="fc-arc" cx="200" cy="200" r="150" fill="none" stroke="url(#fc-g)" strokeWidth="1.6"
              pathLength="1" strokeDasharray="1" strokeDashoffset="1" transform="rotate(-90 200 200)" />
          </svg>
          {Array.from({ length: N }).map((_, i) => {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2
            return (
              <span key={i} className="fc-star" style={{ left: `${50 + Math.cos(a) * 37.5}%`, top: `${50 + Math.sin(a) * 37.5}%`, '--c': IRI[i % IRI.length], '--d': `${i * 0.05}s` }} />
            )
          })}
          <span className="fc-center">✦</span>
        </div>

        <div className="founding-copy">
          <p className="eyebrow">The Origin · The founding circle</p>
          <Reveal className="display">Xanadu begins <Shimmer>with you</Shimmer>.</Reveal>
          <Reveal as="p" className="lede" stagger={0.03}>
            We are beginning with the people and places we already trust. Not through an open call. Not through an algorithm. Through personal connection, discernment and the slow work of knowing.
          </Reveal>
          <Rise as="p" className="body">
            This network grows together. Every member is known. Every space is held. Every guide is witnessed. When you join, you are not a listing. You are part of something. When the circle feels complete, we open Xanadu to Seekers. Not before.
          </Rise>
          <Rise className="founding-actions" delay={0.15}>
            <Button href={LINKS.container}>Apply as a Container</Button>
            <Button href={LINKS.facilitator} variant="ghost">Apply as a Facilitator</Button>
          </Rise>
          <Rise as="p" className="founding-note" delay={0.25}>
            Every application is reviewed personally. <a href="/trust" className="text-link">How we verify</a>
          </Rise>
        </div>
      </div>
    </section>
  )
}
