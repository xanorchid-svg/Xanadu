import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import { Shimmer } from '../components/Reveal'
import { LANDSCAPES, photoUrl } from '../lib/links'
import { useStay, setStay } from '../lib/stay'
import { tintSky } from '../lib/sky'
import { scrollToTarget, onScrollFrame } from '../lib/scroll'

// What you're seeking: the app's own words (SEEKER_ALIGN), plus retreats and communal living
const SEEKING = [
  { label: 'Yoga', c: '#B58BE0' },
  { label: 'Breathwork', c: '#6FB7BF' },
  { label: 'Meditation', c: '#8F9BE6' },
  { label: 'Sound healing', c: '#E8BF8A' },
  { label: 'Ecstatic dance', c: '#E09AC4' },
  { label: 'Kirtan', c: '#D9A67E' },
  { label: 'Retreats', c: '#9DBB7A' },
  { label: 'Communal living', c: '#86A06A' },
  { label: 'Permaculture & gardening', c: '#B7B470' },
  { label: 'Schooling', c: '#8C95C9' },
  { label: 'Festivals', c: '#E8BF8A' },
  { label: "Women's retreats", c: '#E09AC4' },
  { label: "Men's retreats", c: '#6E9A7E' },
  { label: 'Rest & stillness', c: '#E6CDA6' },
]

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
  { label: 'Work remotely', note: 'Bring your work with you. Wifi, a desk, a view.', glyph: 'remote' },
  { label: 'Volunteer exchange', note: 'Give your time and skills to a place, and become part of it.', glyph: 'exchange' },
  { label: 'Training', note: 'Deepen your practice. Study with a guide, earn a certification.', glyph: 'training' },
  { label: 'Just be', note: 'Nothing to do. Nowhere to be. Only rest and presence.', glyph: 'be' },
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
    if (step === 0 && seeking.length) { tintSky(SEEKING.find((x) => x.label === seeking[seeking.length - 1]).c, 0.5); return }
    if (step < WHERE) { tintSky(STEPS[step].tint, 0.35); return }
    const name = hover || where[where.length - 1]
    const land = LANDSCAPES.find((l) => l.name === name)
    tintSky(land ? land.color : '#B58BE0', land ? 0.95 : 0.25)
  }, [active, step, hover, where, seeking])

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

  const seekingText = seeking.length ? (seeking.length > 2 ? `${seeking.slice(0, 2).join(', ')} +${seeking.length - 2}` : seeking.join(', ')) : null
  const summary = [seekingText, length, work, where.length ? where.join(', ') : null]
  const placeholders = ['what you seek', 'how long', 'how you spend it', 'where']

  return (
    <section id="stay" ref={sectionRef} className="stay">
      <div className={`stay-scenes ${shown ? 'is-on' : ''}`} aria-hidden="true">
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
      <p className={`scene-caption ${shownLand ? 'is-on' : ''}`} aria-live="polite">
        {shownLand && <><span>Imagine</span> {shownLand.scene}</>}
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
              <p className="stay-hint">Choose as many as call to you.</p>
            </div>
            <div className="seeks">
              {SEEKING.map((x, i) => (
                <button key={x.label} className={`seek ${seeking.includes(x.label) ? 'is-picked' : ''}`} style={{ '--c': x.c, '--i': i }}
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
            <div className="works">
              {WORK.map((w, i) => (
                <button key={w.label} className={`work iri-border ${work === w.label ? 'is-picked' : ''}`} onClick={() => pickWork(w.label)} tabIndex={step === 2 ? 0 : -1} style={{ '--i': i }}>
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
