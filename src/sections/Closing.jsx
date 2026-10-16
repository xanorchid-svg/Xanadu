import Button from '../components/Button'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { openJoin } from '../lib/joinModal'

export default function Closing() {
  return (
    <section className="closing">
      <div className="closing-emblem" aria-hidden="true"><Emblem electrons /></div>
      <div className="wrap center">
        <Reveal className="display huge center">Xanadu begins<br />with <Shimmer>you</Shimmer>.</Reveal>
        <Rise as="p" className="closing-sub" delay={0.15}>Come as you are. Grow together.</Rise>
        <Rise className="closing-actions" delay={0.25}>
          <Button onClick={openJoin} aria-haspopup="dialog">Join Xanadu</Button>
        </Rise>
      </div>
    </section>
  )
}
