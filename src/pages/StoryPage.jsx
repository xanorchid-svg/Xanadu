import DeepPage, { Verse } from './DeepPage'
import { Reveal, Rise, Shimmer } from '../components/Reveal'

export default function StoryPage() {
  return (
    <DeepPage
      eyebrow="Our story"
      title={<>Remembrance. Belonging. <Shimmer>Emergence</Shimmer>.</>}
      lede="A remembering is underway. Not new. Ancient. Rising at the scale of the whole."
      next={[{ href: '/trust', label: 'How we verify' }, { href: '/path', label: 'How the match works' }]}
    >
      <section className="story-block">
        <p className="eyebrow center">The work</p>
        <Reveal as="h2" className="display center">Rebuilding the <Shimmer>bridge</Shimmer>.</Reveal>
        <Verse lines={[
          'The bridge was never destroyed.',
          'It was forgotten. Overgrown.',
          'Buried under noise and the relentless pace',
          'of a world that forgot to ask why.',
        ]} />
      </section>

      <section className="story-block">
        <p className="eyebrow center">What we cultivate</p>
        <Rise as="p" className="lede center">To listen to our ancestors. To honour those who carried the flame and passed it forward. To rebuild what was broken not through force, but through trust.</Rise>
        <Rise as="p" className="body center narrow">Together, we steward what the earth has always known: that life is meant to be full of light, love, healing, laughter, joy, play and abundance. That communities hold more than individuals can carry alone. That the spaces we gather in shape what is possible between us.</Rise>
      </section>

      <section className="story-block">
        <Verse className="verse-big" lines={[
          'There is a fabric that holds all things.',
          'Ancient. Alive.',
          'Humming at a frequency your body already knows.',
          'You have always been part of it.',
          '',
          'The village. The fire. The circle.',
          'The eyes across the room that feel like home.',
          '',
          'There was a time when you knew exactly',
          'where to go when you needed to be held.',
          'When the space itself remembered you.',
          'When the guide was already waiting.',
          '',
          'We are not building that here.',
          'We are clearing the space',
          'for what was always true',
          'to be felt again.',
        ]} />
      </section>

      <section className="story-block">
        <Verse lines={[
          'Xanadu is not a product. It is not a service.',
          'It is a covenant between the people who believe',
          'that this kind of world is still possible,',
          'and are willing to build it together,',
          'one sacred space at a time.',
        ]} />
      </section>
    </DeepPage>
  )
}
