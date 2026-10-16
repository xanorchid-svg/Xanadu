import Button from '../components/Button'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import { scrollToTarget } from '../lib/scroll'

export default function Closing() {
  return (
    <section className="closing">
      <div className="closing-emblem" aria-hidden="true"><Emblem electrons /></div>
      <div className="wrap center">
        <Reveal className="display huge center">Xanadu begins<br />with <Shimmer>you</Shimmer>.</Reveal>
        <Rise as="p" className="closing-sub" delay={0.15}>Come as you are. Grow together.</Rise>
        <Rise className="closing-actions" delay={0.25}>
          <Button href="#join" onClick={(e) => { e.preventDefault(); scrollToTarget('#join') }}>Join the waitlist</Button>
          <Button href={LINKS.container} variant="ghost">Host a space</Button>
          <Button href={LINKS.facilitator} variant="ghost">Guide with us</Button>
        </Rise>
      </div>
    </section>
  )
}
