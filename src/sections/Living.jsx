import { useEffect, useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { sky, prefersReducedMotion } from '../lib/sky'

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
  return (
    <section id="living" className="living">
      <div className="wrap">
        <p className="eyebrow center reduced-only">Not a booking.</p>
        <Reveal className="display center reduced-only">A way of <Shimmer>living</Shimmer>.</Reveal>
        <Reveal as="p" className="lede center" stagger={0.025}>
          Xanadu is a global network that matches people to a way of living. Yoga, breathwork, sound healing, trainings, volunteer work and more are all here, but it goes deeper.
        </Reveal>
        <Rise as="p" className="body center narrow" delay={0.3}>
          Tell us how long you want to stay, how you want to spend your days and where you feel most alive. We match you with the places and the guides who fit.
        </Rise>
      </div>
      <div className="marquees">
        <Marquee words={ROW_A} />
        <Marquee words={ROW_B} reverse />
      </div>
    </section>
  )
}
