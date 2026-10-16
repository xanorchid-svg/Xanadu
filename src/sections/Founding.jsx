import Button from '../components/Button'
import StarRing from '../components/StarRing'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'

/** The Origin, small: a band on the home page that opens onto /origin. */
export default function Founding() {
  return (
    <section id="origin" className="origin-band">
      <div className="wrap">
        <div className="origin-card iri-border">
          <StarRing mode="spin" className="origin-ring" />
          <div className="origin-copy">
            <p className="eyebrow">The Origin</p>
            <Reveal as="h2" className="origin-title" stagger={0.05}>
              We begin with the people and places we <Shimmer>already trust</Shimmer>.
            </Reveal>
            <Rise as="p" className="body">
              A founding circle of spaces and guides, gathered by hand. When the circle feels complete, we open Xanadu to Seekers. Not before.
            </Rise>
            <Rise className="origin-actions" delay={0.1}>
              <Button href={LINKS.container}>Apply as a Container</Button>
              <Button href={LINKS.facilitator} variant="ghost">Apply as a Facilitator</Button>
              <a href="/origin" className="deep-link" data-cursor="hover"><span>Read the Origin</span><i>→</i></a>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}
