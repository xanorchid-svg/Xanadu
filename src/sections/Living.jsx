import { useEffect, useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { sky, prefersReducedMotion } from '../lib/sky'
import { useInView } from '../lib/useInView'

const ROW_A = ['a weekend', 'breathwork', 'the jungle', 'a season', 'sound healing', 'the ocean', 'make it home', 'ceremony', 'the mountains', 'a month or more']
const ROW_B = ['just be', 'yoga', 'the desert', 'work remotely', 'the forest', 'training', 'volunteer', 'the countryside', 'movement', 'a week or two']

function Marquee({ words, reverse }) {
  const trackRef = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = trackRef.current
    let x = 0, raf
    const loop = () => {
      // drifts on its own; scrolling makes it rush
      const speed = 0.35 + sky.velocity * 9
      x += reverse ? speed : -speed
      const w = el.scrollWidth / 2
      if (x <= -w) x += w
      if (x > 0) x -= w
      el.style.transform = `translate3d(${x}px,0,0) skewX(${(reverse ? 1 : -1) * Math.min(sky.velocity * 30, 12)}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reverse])
  const items = [...words, ...words]
  return (
    <div className={`marquee ${reverse ? 'is-reverse' : ''}`} aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className={i % 3 === 1 ? 'mq-fill' : 'mq-line'}>{w}<i>✦</i></span>
        ))}
      </div>
    </div>
  )
}

export default function Living() {
  const bridgeRef = useInView({ threshold: 0.4 })
  return (
    <section id="living" className="living">
      <div className="wrap">
        <p className="eyebrow center reduced-only">Not a booking.</p>
        <Reveal className="display center reduced-only">A way of <Shimmer>living</Shimmer>.</Reveal>
        <p className="eyebrow center">What Xanadu is</p>
        <Reveal className="display center living-title" stagger={0.06}>
          A <Shimmer>bridge</Shimmer>, rebuilt.
        </Reveal>

        <div ref={bridgeRef} className="bridge" aria-hidden="true">
          <svg viewBox="0 0 600 190">
            <defs>
              <linearGradient id="bridge-g" x1="0" x2="1">
                <stop offset="0" stopColor="#B58BE0" />
                <stop offset=".5" stopColor="#E8BF8A" />
                <stop offset="1" stopColor="#9DBB7A" />
              </linearGradient>
            </defs>
            <path className="bridge-ghost" d="M60,160 Q300,-40 540,160" />
            <path className="bridge-arc" d="M60,160 Q300,-40 540,160" pathLength="1" />
          </svg>
          <span className="bn bn-seeker"><i />The seeker</span>
          <span className="bn bn-guide"><i />The guide</span>
          <span className="bn bn-space"><i />The space</span>
        </div>

        <Reveal as="p" className="lede center living-lede" stagger={0.03}>
          It was never destroyed. Only forgotten, overgrown, buried under noise. Xanadu rebuilds the bridge between those who seek, the places that hold them and the guides who walk beside them.
        </Reveal>
        <Rise as="p" className="body center narrow" delay={0.2}>
          A weekend or a lifetime. Sound healing, breathwork, trainings, volunteer work and more. Tell us how long, how you'll spend your days and where you feel most alive, and we'll match you to where you belong.
        </Rise>
      </div>
      <div className="marquees">
        <Marquee words={ROW_A} />
        <Marquee words={ROW_B} reverse />
      </div>
    </section>
  )
}
