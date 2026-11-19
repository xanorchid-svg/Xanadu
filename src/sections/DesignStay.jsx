import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import { Shimmer } from '../components/Reveal'
import { LANDSCAPES, photoUrl } from '../lib/links'
import { useStay, setStay } from '../lib/stay'
import { tintSky } from '../lib/sky'
import { scrollToTarget, onScrollFrame } from '../lib/scroll'

// What you're seeking: the same families and types as the app's "I'm looking for", so what someone picks here
// carries straight into their matches. Each type has a photo that fills the screen on hover, and a caption.
// A photo is either an Unsplash id or a file in public/photos (path starting with /, with a -1200 version for phones).
const FAMILIES = [
  { label: 'Move', c: '#E09AC4', types: [
    { label: 'Yoga', photo: 'photo-1758797315487-b3b225dff7d8', scene: 'Practice on an open lawn' },
    { label: 'Pilates & mobility', photo: 'photo-1747238415033-b74eec07eb59', scene: 'Strength, slow and steady' },
    { label: 'Acro & aerial', photo: 'photo-1683172346949-129ba01bffa0', scene: 'Flying, held by a friend' },
    { label: 'Ecstatic dance', photo: '/photos/seek-ecstatic-dance.jpg', scene: 'Barefoot at golden hour' },
    { label: 'Dance & movement', photo: 'photo-1533736970669-7edc3f971be1', scene: 'Arms open to the sun' },
    { label: 'Contact improv', photo: 'photo-1716632299418-fb7b0f95fbf3', scene: 'Two bodies, one conversation' },
    { label: 'Martial arts', photo: 'photo-1759352856072-985a4ddab82d', scene: 'Capoeira in the roda' },
    { label: 'Surf & ocean', photo: 'photo-1607429289259-456053385f53', scene: 'Your first green wave' },
  ] },
  { label: 'Still & heal', c: '#6FB7BF', types: [
    { label: 'Meditation', photo: '/photos/seek-meditation.jpg', scene: 'Deep rest, eyes closed' },
    { label: 'Breathwork', photo: 'photo-1600618528240-fb9fc964b853', scene: 'Breath at first light' },
    { label: 'Sound healing', photo: 'photo-1760691313751-98262affa4f9', scene: 'A gong among the singing bowls' },
    { label: 'Healing & bodywork', photo: 'photo-1600334129128-685c5582fd35', scene: 'Warm stones, unhurried hands' },
    { label: 'Ice bath & sauna', photo: 'photo-1766246595813-98526a874f46', scene: 'Cold water, clear mind' },
  ] },
  { label: 'Inner work', c: '#B58BE0', types: [
    { label: 'Shadow & inner child', photo: 'photo-1579017308347-e53e0d2fc5e9', scene: 'Writing to your younger self' },
    { label: 'Family constellations', photo: 'photo-1704386651981-0729a60da579', scene: 'Hands joined, roots seen' },
    { label: 'Somatic & embodied', photo: 'photo-1525296416200-59aaed194d0c', scene: 'Listening from the inside' },
    { label: 'Tantra & relating', photo: 'photo-1611070674042-3957c8a7f700', scene: 'Held, at the edge of the field' },
  ] },
  { label: 'Gather', c: '#E8BF8A', types: [
    { label: "Women's", photo: '/photos/seek-womens-tea.jpg', scene: 'Tea and laughter, together' },
    { label: "Men's", photo: '/photos/seek-mens-water.jpg', scene: 'Brothers in the cold water' },
    { label: 'Cacao & ceremony', photo: 'photo-1759523146335-0069847ceb16', scene: 'An altar laid for the circle' },
    { label: 'Moon gatherings', photo: 'photo-1775406326089-63d6a636f861', scene: 'Moonlight on the water' },
    { label: 'Music & jams', photo: 'photo-1523689119443-df96632084a1', scene: 'Drums until the stars come out' },
    { label: 'Community gatherings', photo: '/photos/seek-communal.jpg', scene: 'Long tables, open doors' },
    { label: 'Festivals & parties', photo: '/photos/seek-festivals-beach.jpg', scene: 'Sunset on the beach, together' },
  ] },
  { label: 'Create & learn', c: '#8F9BE6', types: [
    { label: 'Art & creativity', photo: '/photos/seek-residencies.jpg', scene: 'Making art in the sun' },
    { label: 'Writing', photo: 'photo-1633210155534-e43f00c1d627', scene: 'A notebook on the mountain' },
    { label: 'Theater & improv', photo: 'photo-1769761341012-526493327ac7', scene: 'Yes, and…' },
    { label: 'Workshops & trainings', photo: '/photos/work-training.jpg', scene: 'Practice in the open hall' },
    { label: 'Retreats', photo: '/photos/seek-retreats.jpg', scene: 'A walk to the waterfall' },
    { label: 'Spanish & languages', photo: 'photo-1769206089403-63e983a18c51', scene: '¡Hola! A new language, lived' },
  ] },
  { label: 'Family & nature', c: '#9DBB7A', types: [
    { label: 'Kids & family', photo: '/photos/seek-schooling.jpg', scene: 'Little hands in the garden' },
    { label: 'Nature & adventure', photo: 'photo-1519830103773-4bdc5166a0db', scene: 'Into the jungle, to the falls' },
    { label: 'Permaculture & garden', photo: '/photos/seek-permaculture.jpg', scene: 'Gardens that feed a village' },
    { label: 'Volunteering', photo: '/photos/work-volunteer.jpg', scene: 'Planting trees together' },
  ] },
]
const SEEKING = FAMILIES.flatMap((f) => f.types.map((t) => ({ ...t, c: f.c, family: f.label })))

const LENGTHS = [
  { label: 'Less than 5 hours', size: 12 },
  { label: '1 night', size: 18 },
  { label: 'A weekend', size: 25 },
  { label: 'A week or two', size: 33 },
  { label: 'A month or more', size: 43 },
  { label: 'A season', size: 56 },
  { label: 'Make it home', size: 74 },
]

const WORK = [
  { label: 'Work remotely', note: 'Bring your work with you. Wifi, a desk, a view.', glyph: 'remote', c: '#6FB7BF', photo: '/photos/work-remote.jpg', scene: 'Your desk, above the bay' },
  { label: 'Volunteer exchange', note: 'Give your time and skills to a place, and become part of it.', glyph: 'exchange', c: '#9DBB7A', photo: '/photos/work-volunteer.jpg', scene: 'Planting trees together' },
  { label: 'Training', note: 'Deepen your practice. Study with a guide, earn a certification.', glyph: 'training', c: '#B58BE0', photo: '/photos/work-training.jpg', scene: 'Practice in the open hall' },
  { label: 'Just be', note: 'Nothing to do. Nowhere to be. Only rest and presence.', glyph: 'be', c: '#E09AC4', photo: '/photos/work-just-be.jpg', scene: 'Nothing but the sea and sky' },
]

const STEPS = [
  { n: '01', q: <>What are you <Shimmer>seeking</Shimmer>?</>, tint: '#B58BE0' },
  { n: '02', q: <>How <Shimmer>long</Shimmer> will you stay?</>, tint: '#6FB7BF' },
  { n: '03', q: <>Will you work, or <Shimmer>just be</Shimmer>?</>, tint: '#E09AC4' },
  { n: '04', q: <>Where do you feel most <Shimmer>alive</Shimmer>?</>, tint: null },
]
const N = STEPS.length
const WHERE = N - 1

export default function DesignStay() {
  const sectionRef = useRef(null)
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)
  const { seeking, length, work, where } = useStay()
  const [hover, setHover] = useState(null)
  const [seekHover, setSeekHover] = useState(null)
  const [openFam, setOpenFam] = useState(FAMILIES[0].label)
  const [workHover, setWorkHover] = useState(null)
  const [near, setNear] = useState(false) // start loading the photos just before they're needed

  // which step we're on comes from how far through the (tall) section you've scrolled
  useEffect(() => {
    return onScrollFrame(
      () => {
        const el = sectionRef.current
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { top: r.top, bottom: r.bottom, total: el.offsetHeight - window.innerHeight, vh: window.innerHeight }
      },
      (m) => {
        if (!m) return
        const p = Math.min(1, Math.max(0, -m.top / m.total))
        setStep(Math.min(N - 1, Math.floor(p * N)))
        setActive(m.top < m.vh * 0.5 && m.bottom > m.vh * 0.5)
        if (m.top < m.vh * 2.5) setNear(true)
      }
    )
  }, [])

  // the sky takes on the colour of the moment
  useEffect(() => {
    if (!active) { tintSky(null); return }
    if (step === 0) {
      const x = SEEKING.find((s) => s.label === (seekHover || seeking[seeking.length - 1]))
      if (x) { tintSky(x.c, 0.5); return }
    }
    if (step < WHERE) { tintSky(STEPS[step].tint, 0.35); return }
    const name = hover || where[where.length - 1]
    const land = LANDSCAPES.find((l) => l.name === name)
    tintSky(land ? land.color : '#B58BE0', land ? 0.95 : 0.25)
  }, [active, step, hover, where, seeking, seekHover])

  const goStep = (i) => {
    const el = sectionRef.current
    const total = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    scrollToTarget(top + total * ((i + 0.5) / N))
  }

  const toggleSeeking = (label) => setStay((s) => ({ seeking: s.seeking.includes(label) ? s.seeking.filter((n) => n !== label) : [...s.seeking, label] }))
  const pickLength = (l) => { setStay({ length: l }); setTimeout(() => goStep(2), 450) }
  const pickWork = (w) => { setStay({ work: w }); setTimeout(() => goStep(3), 450) }
  const toggleWhere = (name) => setStay((s) => ({ where: s.where.includes(name) ? s.where.filter((n) => n !== name) : [...s.where, name] }))

  // the place you're hovering (or the last one you chose) fills the whole screen
  const shown = active && step === WHERE ? (hover || where[where.length - 1]) : null
  const shownLand = LANDSCAPES.find((l) => l.name === shown)
  // ...and in step 01, a photo of what you're hovering (or the last thing you chose)
  const shownSeek = active && step === 0 ? SEEKING.find((x) => x.label === (seekHover || seeking[seeking.length - 1])) : null
  // ...and in step 03, a photo of the way you'd spend your days
  const shownWork = active && step === 2 ? WORK.find((w) => w.label === (workHover || work)) : null
  const caption = shownLand ? shownLand.scene : shownSeek ? shownSeek.scene : shownWork ? shownWork.scene : null

  const seekingText = seeking.length ? (seeking.length > 2 ? `${seeking.slice(0, 2).join(', ')} +${seeking.length - 2}` : seeking.join(', ')) : null
  const summary = [seekingText, length, work, where.length ? where.join(', ') : null]
  const placeholders = ['what you seek', 'how long', 'how you spend it', 'where']

  return (
    <section id="stay" ref={sectionRef} className="stay">
      <div className={`stay-scenes ${shown || shownSeek || shownWork ? 'is-on' : ''}`} aria-hidden="true">
        {near && WORK.map((w) => (
          <div key={w.label} className={`scene ${shownWork === w ? 'is-on' : ''}`} style={{ '--c': w.c }}>
            <img src={w.photo} srcSet={`${w.photo.replace('.jpg', '-1200.jpg')} 1200w, ${w.photo} 2400w`} sizes="100vw" alt="" loading="lazy" decoding="async" />
          </div>
        ))}
        {near && SEEKING.filter((x) => x.family === openFam || seeking.includes(x.label)).map((x) => (
          <div key={x.label} className={`scene ${shownSeek === x ? 'is-on' : ''}`} style={{ '--c': x.c }}>
            {x.photo.startsWith('/') ? (
              <img
                src={x.photo}
                srcSet={`${x.photo.replace('.jpg', '-1200.jpg')} 1200w, ${x.photo} 2400w`}
                sizes="100vw" alt="" loading="lazy" decoding="async"
              />
            ) : (
              <img
                src={photoUrl(x.photo, 1600)}
                srcSet={`${photoUrl(x.photo, 900)} 900w, ${photoUrl(x.photo, 1600)} 1600w, ${photoUrl(x.photo, 2400)} 2400w`}
                sizes="100vw" alt="" loading="lazy" decoding="async"
              />
            )}
          </div>
        ))}
        {near && LANDSCAPES.map((l) => (
          <div key={l.name} className={`scene ${shown === l.name ? 'is-on' : ''}`} style={{ '--c': l.color }}>
            <img
              src={photoUrl(l.photo, 1600)}
              srcSet={`${photoUrl(l.photo, 900)} 900w, ${photoUrl(l.photo, 1600)} 1600w, ${photoUrl(l.photo, 2400)} 2400w`}
              sizes="100vw" alt="" loading="lazy" decoding="async"
            />
          </div>
        ))}
        <div className="scene-veil" />
      </div>
      <p className={`scene-caption ${caption ? 'is-on' : ''} ${shownSeek || shownWork ? 'is-seek' : ''}`} aria-live="polite">
        {caption && <><span>Imagine</span> {caption}</>}
      </p>
      <div className="stay-sticky">
        <div className="stay-head">
          <p className="eyebrow">Design your stay</p>
          <div className="stay-steps" role="tablist" aria-label="Steps">
            {STEPS.map((s, i) => (
              <button key={s.n} role="tab" aria-selected={step === i} className={`stay-dot ${step === i ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`} onClick={() => goStep(i)}>
                <span>{s.n}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="stay-panels">
          {/* 01 — what you're seeking (choose any) */}
          <div className={`stay-panel ${step === 0 ? 'is-on' : step > 0 ? 'is-past' : ''}`} aria-hidden={step !== 0}>
            <div>
              <h2 className="stay-q">{STEPS[0].q}</h2>
              <p className="stay-hint">Open a family, then choose as many as call to you.</p>
            </div>
            <div className="seeks seek-fams" role="tablist" aria-label="Families">
              {FAMILIES.map((f) => {
                const n = f.types.filter((t) => seeking.includes(t.label)).length
                return (
                  <button key={f.label} role="tab" aria-selected={openFam === f.label} className={`seek seek-fam ${openFam === f.label ? 'is-open' : ''} ${n ? 'has-picks' : ''}`} style={{ '--c': f.c }}
                    onClick={() => setOpenFam(f.label)} tabIndex={step === 0 ? 0 : -1}>
                    <i aria-hidden="true" />{f.label}{n ? <small>{n}</small> : null}
                  </button>
                )
              })}
            </div>
            <div className="seeks" key={openFam} onPointerLeave={() => setSeekHover(null)}>
              {SEEKING.filter((x) => x.family === openFam).map((x, i) => (
                <button key={x.label} className={`seek ${seeking.includes(x.label) ? 'is-picked' : ''}`} style={{ '--c': x.c, '--i': i }}
                  onPointerEnter={() => setSeekHover(x.label)} onFocus={() => setSeekHover(x.label)} onBlur={() => setSeekHover(null)}
                  onClick={() => toggleSeeking(x.label)} aria-pressed={seeking.includes(x.label)} tabIndex={step === 0 ? 0 : -1}>
                  <i aria-hidden="true" />{x.label}
                </button>
              ))}
            </div>
            <button className={`stay-next ${seeking.length ? 'is-ready' : ''}`} onClick={() => goStep(1)} tabIndex={step === 0 ? 0 : -1}>
              {seeking.length ? 'Continue' : 'Skip for now'} <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* 02 — how long */}
          <div className={`stay-panel ${step === 1 ? 'is-on' : step > 1 ? 'is-past' : ''}`} aria-hidden={step !== 1}>
            <h2 className="stay-q">{STEPS[1].q}</h2>
            <div className="lengths">
              <div className="lengths-line" aria-hidden="true" />
              {LENGTHS.map((l, i) => (
                <button key={l.label} className={`length ${length === l.label ? 'is-picked' : ''}`} onClick={() => pickLength(l.label)} tabIndex={step === 1 ? 0 : -1} style={{ '--i': i }}>
                  <span className="length-orb" style={{ '--s': `${l.size}px` }} />
                  <span className="length-label">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 03 — work or just be */}
          <div className={`stay-panel ${step === 2 ? 'is-on' : step > 2 ? 'is-past' : ''}`} aria-hidden={step !== 2}>
            <h2 className="stay-q">{STEPS[2].q}</h2>
            <div className="works" onPointerLeave={() => setWorkHover(null)}>
              {WORK.map((w, i) => (
                <button key={w.label} className={`work iri-border ${work === w.label ? 'is-picked' : ''}`} onPointerEnter={() => setWorkHover(w.label)} onFocus={() => setWorkHover(w.label)} onBlur={() => setWorkHover(null)}
                  onClick={() => pickWork(w.label)} tabIndex={step === 2 ? 0 : -1} style={{ '--i': i }}>
                  <span className={`glyph glyph-${w.glyph}`} aria-hidden="true"><i /><i /><i /></span>
                  <span className="work-label">{w.label}</span>
                  <span className="work-note">{w.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 04 — where */}
          <div className={`stay-panel ${step === WHERE ? 'is-on' : ''}`} aria-hidden={step !== WHERE}>
            <h2 className="stay-q">{STEPS[WHERE].q}</h2>
            <div className="lands" onPointerLeave={() => setHover(null)}>
              {LANDSCAPES.map((l, i) => (
                <button
                  key={l.name}
                  className={`land ${where.includes(l.name) ? 'is-picked' : ''}`}
                  style={{ '--c': l.color, '--i': i }}
                  onPointerEnter={() => setHover(l.name)}
                  onFocus={() => setHover(l.name)}
                  onBlur={() => setHover(null)}
                  onClick={() => toggleWhere(l.name)}
                  aria-pressed={where.includes(l.name)}
                  tabIndex={step === WHERE ? 0 : -1}
                >
                  <span className="land-label">{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`stay-summary iri-border ${seeking.length || length || work || where.length ? 'has-any' : ''}`}>
          <p className="summary-text" aria-live="polite">
            <span className="summary-k">Your stay</span>
            {summary.map((v, i) => (
              <span key={i} className={`chip ${v ? 'is-set' : ''}`}>{v || placeholders[i]}</span>
            ))}
          </p>
          <Button href="#join" className="summary-cta" onClick={(e) => { e.preventDefault(); scrollToTarget('#join') }}>Save my stay</Button>
        </div>
      </div>
    </section>
  )
}
