import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Emblem from '../components/Emblem'
import { Shimmer } from '../components/Reveal'
import { prefersReducedMotion, isTouch } from '../lib/sky'
import { scrollToTarget } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * The portal. The emblem orbits, breathes, and leans toward you.
 * Scroll, and you fall through it: the emblem swells past the edges,
 * light floods in, and the first words emerge from its centre.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const tiltRef = useRef(null)
  const emblemRef = useRef(null)
  const copyRef = useRef(null)
  const irisRef = useRef(null)
  const emergeRef = useRef(null)
  const ringsRef = useRef(null)
  const hintRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  // the emblem leans toward the cursor
  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    const el = tiltRef.current
    let tx = 0, ty = 0, cx = 0, cy = 0, raf
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.transform = `rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg) translate3d(${cx * 10}px, ${cy * 8}px, 0)`
      if (ringsRef.current) ringsRef.current.style.transform = `translate(${-cx * 18}px, ${-cy * 14}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  // falling through the portal
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 1,
          pin: stageRef.current,
          anticipatePin: 1,
        },
      })
      tl.to(copyRef.current, { opacity: 0, y: -60, filter: 'blur(14px)', duration: 0.18 }, 0)
        .to(hintRef.current, { opacity: 0, duration: 0.08 }, 0)
        .to(emblemRef.current, { scale: 18, rotate: 50, ease: 'power3.in', duration: 0.82 }, 0)
        .to(ringsRef.current, { scale: 3.2, opacity: 0, ease: 'power2.in', duration: 0.6 }, 0)
        .fromTo(irisRef.current, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.4, ease: 'power2.in', duration: 0.3 }, 0.48)
        .to(emblemRef.current, { opacity: 0, duration: 0.12 }, 0.7)
        .to(irisRef.current, { opacity: 0.0, scale: 2.2, ease: 'power1.out', duration: 0.3 }, 0.78)
        .fromTo(emergeRef.current,
          { opacity: 0, scale: 0.4, filter: 'blur(24px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.3 }, 0.68)
        .to({}, { duration: 0.08 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={sectionRef} className={`hero ${ready ? 'is-ready' : ''}`}>
      <div ref={stageRef} className="hero-stage">
        <div ref={ringsRef} className="hero-rings" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * -1.6}s` }} />
          ))}
        </div>

        <div className="hero-emblem">
          <div ref={emblemRef} className="hero-emblem-scale">
            <div className="hero-halo" aria-hidden="true"><i /><i /></div>
            <div ref={tiltRef} className="hero-emblem-tilt">
              <Emblem electrons drawIn animated />
            </div>
          </div>
          <div ref={irisRef} className="hero-iris" aria-hidden="true" />
        </div>

        <div ref={copyRef} className="hero-copy">
          <p className="eyebrow">A network for awakening places</p>
          <h1 className="hero-title">
            <span className="ht-line">Xanadu begins</span>{' '}
            <span className="ht-line">with <Shimmer>you</Shimmer>.</span>
          </h1>
        </div>

        <div ref={emergeRef} className="hero-emerge">
          <p className="emerge-small">Not a booking.</p>
          <p className="emerge-big">A way of <Shimmer>living</Shimmer>.</p>
          <p className="definition-line"><span className="def-w">xa·na·du</span> <span className="def-s">/ˈzanəˌdo͞o/</span> an idealized place of great or idyllic magnificence and beauty.</p>
        </div>

        <button ref={hintRef} className="hero-hint" onClick={() => scrollToTarget('#living')} data-cursor="hover">
          <span className="hint-in">
            <span>Fall in</span>
            <i aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  )
}
