import DeepPage, { Step } from './DeepPage'
import { Shimmer } from '../components/Reveal'

export default function TrustPage() {
  return (
    <DeepPage
      eyebrow="How we verify"
      title={<>Verification is not a feature. It is the <Shimmer>foundation</Shimmer>.</>}
      lede="A living system only thrives when what is inside it is real. So nothing enters Xanadu without being known."
      next={[{ href: '/path', label: 'How the match works' }, { href: '/story', label: 'Our story' }]}
    >
      <Step n="01" title="An application, in their own words">
        <p>Every Container and every Facilitator applies. Spaces tell us about their land, how they hold people and what they offer. Guides tell us about their practice, their lineage and their trainings.</p>
        <p>Everyone agrees to our community guidelines before they go any further.</p>
      </Step>
      <Step n="02" title="References">
        <p>We ask for people who have worked with them or been held by them: at least one, up to three. References are part of every review.</p>
      </Step>
      <Step n="03" title="Read by hand">
        <p>We read every application ourselves. No automated approvals, no paid placement. The founding badge is earned, not purchased.</p>
      </Step>
      <Step n="04" title="A conversation">
        <p>We meet each founding member on a short call: you, your work and why you do it. Trust is built between people.</p>
      </Step>
      <Step n="05" title="Welcome, and every offering after">
        <p>Only then does a profile go live. Each new retreat, training or volunteer exchange is reviewed again before it appears. And only guests who booked through Xanadu can leave a review.</p>
      </Step>
      <section className="deep-quote">
        <p className="display center">The exposure you seek is not reach.<br />It is <Shimmer>resonance</Shimmer>.</p>
        <p className="body center narrow">A space in the network is not competing for clicks. A guide is not posting into a void. They are arriving into a room where someone is already waiting for exactly what they carry. We grow by being known.</p>
      </section>
    </DeepPage>
  )
}
