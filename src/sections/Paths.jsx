import { useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import { isTouch } from '../lib/sky'
import { scrollToTarget } from '../lib/scroll'
import Sigil from '../components/Sigil'

const DOORS = [
  {
    kind: 'seeker',
    role: 'The Seeker',
    title: 'I am seeking',
    text: 'You feel the pull toward something: healing, community, service, devotion. You may not have the words for it yet. You don\u2019t need them. You need a place built to receive you exactly where you are.',
    cta: 'Join the waitlist',
    href: '#join',
    hues: ['#B58BE0', '#E09AC4', '#8F9BE6'],
  },
  {
    kind: 'container',
    role: 'Containers \u00b7 Sacred spaces',
    title: 'I hold a space',
    text: 'You have prepared the land. The space is ready. But the right guides don\u2019t find you, and the seekers who would thrive here don\u2019t know you exist. Xanadu closes that gap.',
    cta: 'Apply as a founding Container',
    href: LINKS.container,
    hues: ['#9DBB7A', '#6FB7BF', '#E8BF8A'],
  },
  {
    kind: 'facilitator',
    role: 'Facilitators \u00b7 Wisdom keepers',
    title: 'I guide',
    text: 'You carry real medicine. But finding the spaces worthy of your work, and the people ready for it, is its own labour. Xanadu holds that for you, so you can do what you came here to do.',
    cta: 'Apply as a founding Facilitator',
    href: LINKS.facilitator,
    hues: ['#E8BF8A', '#E09AC4', '#6FB7BF'],
  },
]

function Door({ d, i }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (isTouch()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--lx', `${x * 100}%`)
    el.style.setProperty('--ly', `${y * 100}%`)
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 8}deg)`
  }
  const onLeave = () => { ref.current.style.transform = '' }
  return (
    <Rise delay={i * 0.12} className="door-wrap">
      <a ref={ref} href={d.href} className="door" onPointerMove={onMove} onPointerLeave={onLeave}
        onClick={d.href.startsWith('#') ? (e) => { e.preventDefault(); scrollToTarget(d.href) } : undefined}
        style={{ '--h1': d.hues[0], '--h2': d.hues[1], '--h3': d.hues[2] }} data-cursor="hover">
        <span className="door-frame" aria-hidden="true" />
        <span className="door-inside" aria-hidden="true"><i /><i /><i /></span>
        <span className="door-light" aria-hidden="true" />
        <span className="door-body">
          <Sigil kind={d.kind} hues={d.hues} />
          <span className="door-role">{d.role}</span>
          <span className="door-title">{d.title}</span>
          <span className="door-text">{d.text}</span>
          <span className="door-cta">{d.cta} <i aria-hidden="true">→</i></span>
        </span>
      </a>
    </Rise>
  )
}

export default function Paths() {
  return (
    <section id="paths" className="paths">
      <div className="wrap">
        <p className="eyebrow center">Who we connect</p>
        <Reveal className="display center">Which <Shimmer>door</Shimmer> is yours?</Reveal>
        <Rise as="p" className="body center narrow">
          Three threads, one fabric. None is complete without the others.
        </Rise>
        <div className="doors">
          {DOORS.map((d, i) => <Door key={d.role} d={d} i={i} />)}
        </div>
      </div>
    </section>
  )
}
