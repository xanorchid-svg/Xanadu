import { Reveal, Rise, Shimmer } from '../components/Reveal'

const PILLARS = [
  {
    name: 'Trust',
    text: 'Every space, every guide and every offering is reviewed by us before it enters the network. Nothing is here by accident. Everything has been held, considered and chosen.',
    hue: ['#E8BF8A', '#E09AC4'],
  },
  {
    name: 'Intention',
    text: 'We listen beneath the surface. Not just to what you are seeking, but to why. The match we make is not a recommendation. It is a recognition.',
    hue: ['#B58BE0', '#8F9BE6'],
  },
  {
    name: 'Alignment',
    text: 'For the people. For the land. For the wisdom lineages that have carried this flame forward. What belongs together finds each other here.',
    hue: ['#6FB7BF', '#9DBB7A'],
  },
]

export default function Pillars() {
  return (
    <section id="pillars" className="pillars">
      <div className="wrap">
        <p className="eyebrow center">What we stand on</p>
        <Reveal className="display center">Three <Shimmer>pillars</Shimmer>.</Reveal>

        <div className="pillar-row">
          {PILLARS.map((p, i) => (
            <Rise key={p.name} className="pillar" delay={i * 0.12} style={{ '--a': p.hue[0], '--b': p.hue[1], '--i': i }}>
              <div className="pillar-orbit" aria-hidden="true">
                <span className="po po-1" />
                <span className="po po-2" />
                <span className="po po-3" />
                <span className="po-core" />
              </div>
              <h3 className="pillar-name">{p.name}.</h3>
              <p className="pillar-text">{p.text}</p>
            </Rise>
          ))}
        </div>

        <div className="door-line">
          <Reveal as="p" className="door-line-text" stagger={0.06}>
            Not a marketplace.<br />A network <Shimmer>with a door</Shimmer>.
          </Reveal>
          <Rise className="door-line-links" delay={0.2}>
            <a href="/trust" className="deep-link" data-cursor="hover"><span>How we verify</span><i>→</i></a>
            <a href="/path" className="deep-link" data-cursor="hover"><span>How the match works</span><i>→</i></a>
          </Rise>
        </div>
      </div>
    </section>
  )
}
