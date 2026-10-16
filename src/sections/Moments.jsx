import { useEffect, useRef, useState } from 'react'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { photoUrl } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

/**
 * Moments: a slow, rotating gallery of the life Xanadu gathers people into.
 * Groups, one or two people, and places with nobody in them yet.
 * Free-licensed Unsplash photos; to swap one, change its `id`.
 */
const MOMENTS = [
  { id: 'photo-1758274535230-3641d0632878', tag: 'Community', line: 'Morning practice, together' },
  { id: 'photo-1644027620741-a0d859d0245e', tag: 'Retreat', line: 'An open pavilion above the rice terraces' },
  { id: 'photo-1758885428976-dd612a7f3046', tag: 'Breath', line: 'Breath, and nothing else' },
  { id: 'photo-1611843467160-25afb8df1074', tag: 'Earth', line: 'Hands in the soil' },
  { id: 'photo-1790441948907-ffb08a0b00f7', tag: 'Community', line: 'A circle in the meadow' },
  { id: 'photo-1754078219069-7565df2033b0', tag: 'Retreat', line: 'A lodge in the green hills' },
  { id: 'photo-1501631259223-89d4e246ed23', tag: 'Connection', line: 'Sharing the view' },
  { id: 'photo-1758272960011-3586efc17bbf', tag: 'Community', line: 'Songs around the fire' },
  { id: 'photo-1571391034628-2a2261e8273f', tag: 'Ritual', line: 'A bowl of tea, held slowly' },
  { id: 'photo-1616940779493-6958fbd615fe', tag: 'Retreat', line: 'A light-filled place to land' },
  { id: 'photo-1558106340-87553f4cff67', tag: 'Practice', line: 'By the river, mountains beyond' },
  { id: 'photo-1438109382753-8368e7e1e7cf', tag: 'Earth', line: 'Tending the garden' },
  { id: 'photo-1589923188900-85dae523342b', tag: 'Earth', line: 'Planting the season' },
]

const DUR = 5600

export default function Moments() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)
  const touch = useRef(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '200px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused || reduced) return
    const t = setTimeout(() => setI((n) => (n + 1) % MOMENTS.length), DUR)
    return () => clearTimeout(t)
  }, [i, inView, paused, reduced])

  const go = (n) => setI((n + MOMENTS.length) % MOMENTS.length)
  const m = MOMENTS[i]

  return (
    <section id="moments" className="moments">
      <div className="wrap moments-head">
        <div>
          <p className="eyebrow">Moments</p>
          <Reveal className="display moments-title">A life worth <Shimmer>gathering</Shimmer> for.</Reveal>
        </div>
        <Rise as="p" className="moments-sub" delay={0.15}>
          Retreats and trainings, gardens and fires, breath and stillness. Alone, in twos, or in a circle of many.
        </Rise>
      </div>

      <Rise className="wrap moments-stage-wrap" delay={0.1}>
        <div
          ref={ref}
          className="moments-stage iri-border"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touch.current == null) return
            const dx = e.changedTouches[0].clientX - touch.current
            if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
            touch.current = null
          }}
          role="region" aria-roledescription="carousel" aria-label="Moments from the kind of life Xanadu gathers"
        >
          {MOMENTS.map((p, n) => {
            // load the shown photo and its neighbours; the rest wait their turn
            const load = inView && (n === i || n === (i + 1) % MOMENTS.length || n === (i - 1 + MOMENTS.length) % MOMENTS.length)
            return (
              <figure key={p.id} className={`moment ${n === i ? 'is-on' : ''} ${n % 2 ? 'drift-l' : 'drift-r'}`} aria-hidden={n !== i}>
                {(load || n === i) && (
                  <img
                    src={photoUrl(p.id, 1800)}
                    srcSet={`${photoUrl(p.id, 900)} 900w, ${photoUrl(p.id, 1800)} 1800w, ${photoUrl(p.id, 2600)} 2600w`}
                    sizes="(max-width: 1400px) 100vw, 1400px" alt={p.line} decoding="async"
                  />
                )}
              </figure>
            )
          })}
          <div className="moments-veil" aria-hidden="true" />
          <figcaption className="moments-cap" key={i} aria-live="polite">
            <span className="moments-tag">{m.tag}</span>
            <span className="moments-line">{m.line}</span>
          </figcaption>
          <div className="moments-nav">
            <button className="moments-arrow" onClick={() => go(i - 1)} aria-label="Previous moment">←</button>
            <div className="moments-bars" aria-hidden="true">
              {MOMENTS.map((p, n) => (
                <span key={p.id} className={n < i ? 'done' : n === i ? 'now' : ''}>
                  <i key={n === i ? `${i}-${paused}` : 'x'} style={{ animationDuration: `${DUR}ms`, animationPlayState: paused || reduced ? 'paused' : 'running' }} />
                </span>
              ))}
            </div>
            <button className="moments-arrow" onClick={() => go(i + 1)} aria-label="Next moment">→</button>
          </div>
        </div>
      </Rise>
    </section>
  )
}
