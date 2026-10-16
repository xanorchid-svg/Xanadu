import DeepPage from './DeepPage'
import { Reveal, Rise, Shimmer } from '../components/Reveal'

export default function LivingNetworkPage() {
  return (
    <DeepPage
      eyebrow="The living network"
      title={<>What grows here, grows <Shimmer>together</Shimmer>.</>}
      lede="This is not a directory. It is a living system."
      next={[{ href: '/trust', label: 'How we verify' }, { href: '/origin', label: 'The Origin' }]}
    >
      <section className="story-block">
        <Rise as="p" className="lede center">A living system only thrives when what is inside it is real.</Rise>
        <Rise as="p" className="body center narrow">When the spaces are genuine. When the guides have truly walked the path they teach. When the seekers arrive with honest intention rather than curated expectation.</Rise>
        <Rise as="p" className="body center narrow">This is why verification is not a feature of Xanadu. It is the foundation. The badge is earned, not purchased.</Rise>
      </section>

      <section className="story-block">
        <Reveal as="p" className="display center">The exposure you seek is not reach. It is <Shimmer>resonance</Shimmer>.</Reveal>
        <Rise as="p" className="body center narrow">When you enter Xanadu, you are seen. Not as a listing. Not as a lead. As a whole person: your space, your work, your gifts, your path, offered to the people who are truly ready to receive them.</Rise>
        <Rise as="p" className="body center narrow">A Container in the network is not competing for clicks. A Facilitator is not posting into a void. They are arriving into a room where someone is already waiting for exactly what they carry.</Rise>
      </section>

      <section className="story-block">
        <Rise as="p" className="lede center">This is how the network grows: not by adding more listings, but by deepening every connection within it.</Rise>
        <Rise as="p" className="body center narrow">Each true encounter builds trust. Each matched seeker becomes a reference. Each verified guide makes the whole network more credible.</Rise>
        <Reveal as="p" className="display center">We grow by being <Shimmer>known</Shimmer>.</Reveal>
        <Rise as="p" className="body center narrow">By showing up, truthfully, in a place that was built to hold that. That is what the network provides. And it only exists because you are willing to be part of it.</Rise>
      </section>
    </DeepPage>
  )
}
