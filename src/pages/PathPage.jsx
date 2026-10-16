import DeepPage, { Step } from './DeepPage'
import { Shimmer } from '../components/Reveal'

export default function PathPage() {
  return (
    <DeepPage
      eyebrow="How the match works"
      title={<>From your words to the right <Shimmer>door</Shimmer>.</>}
      lede="The match is not the most popular option. It is the most aligned one."
      next={[{ href: '/trust', label: 'How we verify' }, { href: '/story', label: 'Our story' }]}
    >
      <Step n="01" title="Share your intention">
        <p>Everything begins with honesty. Not a checklist of preferences, but a true expression of where you are and what you are moving toward. A feeling. A question you have been sitting with. A threshold you sense yourself approaching.</p>
        <p>You don't need to know what you are looking for. You need to know what is true right now. That is enough.</p>
        <p>Then you design your stay: how long, how you want to spend your days, and where you feel most alive.</p>
      </Step>
      <Step n="02" title="We find what fits">
        <p>Xanadu reads your words for what lives beneath them, and holds them alongside what we know about every space and guide in the network: their practices, their lineage, the spirit of their place.</p>
        <p>You only ever see places and people we have already reviewed and met. Sometimes the match is a small space in the mountains with three open dates. Sometimes it is a guide you would never have found searching alone.</p>
        <p>We hold the network, so you don't have to navigate it.</p>
      </Step>
      <Step n="03" title="Arrive as a known person">
        <p>You don't arrive as a booking number. You can meet the community before you land, and the people of the place know who is coming. You arrive into a prepared space. The work begins before you arrive.</p>
      </Step>
      <Step n="04" title="The network grows">
        <p>Every seeker who is well matched deepens the trust of every space and guide who receives them. Every space that holds someone well builds the reputation of the whole.</p>
        <p>This is not a platform. It is a living system. And you are part of it now.</p>
      </Step>
    </DeepPage>
  )
}
