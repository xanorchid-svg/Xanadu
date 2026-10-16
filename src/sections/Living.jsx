import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { useInView } from '../lib/useInView'
import Emblem from '../components/Emblem'

export default function Living() {
  const triRef = useInView({ threshold: 0.35 })
  return (
    <section id="living" className="living">
      <div className="wrap">
        <p className="eyebrow center reduced-only">Not a booking.</p>
        <Reveal className="display center reduced-only">A way of <Shimmer>living</Shimmer>.</Reveal>
        <div className="reduced-only center"><p className="definition-line"><span className="def-w">xa·na·du</span> <span className="def-s">/ˈzanəˌdo͞o/</span> an idealized place of great or idyllic magnificence and beauty.</p></div>
        <p className="eyebrow center">What Xanadu is</p>
        <Reveal className="display center living-title" stagger={0.06}>
          Rebuilding the <Shimmer>Bridge</Shimmer>
        </Reveal>

        <div ref={triRef} className="tri" aria-hidden="true">
          <svg viewBox="0 0 400 360">
            <defs>
              <linearGradient id="tri-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#9DBB7A" />
                <stop offset=".35" stopColor="#6FB7BF" />
                <stop offset=".65" stopColor="#B58BE0" />
                <stop offset="1" stopColor="#E8BF8A" />
              </linearGradient>
            </defs>
            {/* the triangle: container (top), seeker (left), facilitator (right) */}
            <path className="tri-ghost" d="M200,40 L50,310 L350,310 Z" />
            <path className="tri-edge" d="M200,40 L50,310 L350,310 Z" pathLength="1" />
            {/* the bridges, all running through Xanadu */}
            {[[200, 40], [50, 310], [350, 310]].map(([x, y], i) => (
              <g key={i}>
                <line className="tri-spoke" x1={x} y1={y} x2="200" y2="220" pathLength="1" style={{ transitionDelay: `${1.4 + i * 0.25}s` }} />
                <circle r="2.6" className="tri-spark" style={{ animationDelay: `${i * 0.9}s` }}>
                  <animateMotion dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" path={`M${x},${y} L200,220`} />
                </circle>
              </g>
            ))}
          </svg>
          <div className="tri-core"><Emblem /></div>
          <span className="tn tn-container"><i />Container</span>
          <span className="tn tn-seeker"><i />Seeker</span>
          <span className="tn tn-facilitator"><i />Facilitator</span>
          <span className="tn-x">Xanadu</span>
        </div>

        <Rise as="p" className="body center narrow" delay={0.2}>
          A few hours or a lifetime. Sound healing, breathwork, trainings, volunteer work and more. Tell us how long, how you'll spend your days and where you feel most alive, and we'll match you to where you belong.
        </Rise>
      </div>
    </section>
  )
}
