import DeepPage, { Verse } from './DeepPage'
import Button from '../components/Button'
import StarRing from '../components/StarRing'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'

export default function OriginPage() {
  return (
    <DeepPage
      eyebrow="The Origin"
      title={<>Xanadu begins <Shimmer>with you</Shimmer>.</>}
      lede="We are beginning with the people and places we already trust."
      next={[{ href: '/trust', label: 'How we verify' }, { href: '/living-network', label: 'The living network' }]}
    >
      <section className="story-block">
        <Verse className="verse-big" lines={[
          'Not through an open call.',
          'Not through an algorithm.',
          'Through personal connection,',
          'discernment,',
          'and the slow work of knowing.',
        ]} />
      </section>

      <section className="story-block origin-ring-block">
        <StarRing mode="scroll" />
        <Reveal as="p" className="display center">When the circle feels <Shimmer>complete</Shimmer>, we open Xanadu to Seekers.</Reveal>
        <Rise as="p" className="lede center">Not before.</Rise>
      </section>

      <section className="story-block">
        <Rise as="p" className="lede center">This network grows together. Every member is known. Every space is held. Every guide is witnessed.</Rise>
        <Rise as="p" className="body center narrow">When you join, you are not a listing. You are part of something. The founding circle shapes what Xanadu becomes: its standards, its spirit and the first seekers it welcomes.</Rise>
        <Rise className="closing-actions" delay={0.15}>
          <Button href={LINKS.container}>Apply as a founding Container</Button>
          <Button href={LINKS.facilitator} variant="ghost">Apply as a founding Facilitator</Button>
        </Rise>
        <Rise as="p" className="founding-note center" delay={0.25}>Every application is reviewed personally.</Rise>
      </section>
    </DeepPage>
  )
}
