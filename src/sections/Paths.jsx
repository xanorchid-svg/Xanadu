import { useRef } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import { isTouch } from '../lib/sky'

const DOORS = [
  {
    role: 'Seeker',
    title: 'I am seeking',
    text: 'An experience, a season, or a different way to live. Design your stay and we will match you.',
    cta: 'Begin as a Seeker',
    href: LINKS.seeker,
    hues: ['#B58BE0', '#E09AC4', '#8F9BE6'],
  },
  {
    role: 'Container',
    title: 'I hold a space',
    text: 'A retreat space, a village, a piece of land with a community on it. Open it to people looking for exactly that.',
    cta: 'Host a space',
    href: LINKS.container,
    hues: ['#9DBB7A', '#6FB7BF', '#E8BF8A'],
  },
  {
    role: 'Facilitator',
    title: 'I guide',
    text: 'Retreats, trainings, classes. Find the spaces your work belongs in, and the people it is for.',
    cta: 'Guide with us',
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
        style={{ '--h1': d.hues[0], '--h2': d.hues[1], '--h3': d.hues[2] }} data-cursor="hover">
        <span className="door-frame" aria-hidden="true" />
        <span className="door-inside" aria-hidden="true"><i /><i /><i /></span>
        <span className="door-light" aria-hidden="true" />
        <span className="door-body">
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
        <p className="eyebrow center">Three paths, one network</p>
        <Reveal className="display center">Which <Shimmer>door</Shimmer> is yours?</Reveal>
        <Rise as="p" className="body center narrow">
          Seekers, the places that hold them, and the guides who walk with them. None of them is complete without the others. Xanadu holds the centre.
        </Rise>
        <div className="doors">
          {DOORS.map((d, i) => <Door key={d.role} d={d} i={i} />)}
        </div>
      </div>
    </section>
  )
}
