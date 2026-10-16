import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LANDSCAPES } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'
import { scrollToTarget } from '../lib/scroll'

/**
 * A glimpse of the app, before it reaches the stores.
 * Each feature plays as a short animated demo inside the phone.
 * To use a real screen recording instead, add `video: '/videos/stay.mp4'` to a feature
 * (put the file in public/videos/) and it plays in place of the animated demo.
 */

const DUR = 5200

function DemoStay() {
  return (
    <div className="scr demo-stay">
      <p className="scr-k">Design your stay</p>
      <p className="scr-title">How long will you <Shimmer>stay</Shimmer>?</p>
      <div className="d-chips">
        {['A weekend', 'A week or two', 'A month or more', 'A season', 'Make it home'].map((t, i) => (
          <span key={t} className={`d-chip ${i === 3 ? 'd-pick d-pick-1' : ''}`}>{t}</span>
        ))}
      </div>
      <p className="scr-title sm">Work, or <Shimmer>just be</Shimmer>?</p>
      <div className="d-chips">
        {['Work remotely', 'Volunteer exchange', 'Training', 'Just be'].map((t, i) => (
          <span key={t} className={`d-chip ${i === 2 ? 'd-pick d-pick-2' : ''}`}>{t}</span>
        ))}
      </div>
      <div className="d-lands">
        {LANDSCAPES.slice(0, 6).map((l, i) => (
          <span key={l.name} className={`d-land ${i === 2 ? 'd-pick d-pick-3' : ''}`} style={{ '--c': l.color }}><i />{l.name}</span>
        ))}
      </div>
    </div>
  )
}

function DemoMatch() {
  const cards = [
    { t: 'A season in the jungle', s: 'Costa Rica · Example space', tags: ['Jungle', 'Training', 'A season'], c: '#86A06A' },
    { t: 'Breathwork teacher training', s: 'Bali · Example offering', tags: ['Training', 'Breathwork'], c: '#B58BE0' },
    { t: 'Volunteer by the ocean', s: 'Portugal · Example space', tags: ['Ocean', 'Volunteer'], c: '#7FB3C2' },
  ]
  return (
    <div className="scr demo-match">
      <p className="scr-k">Matched to you</p>
      <p className="scr-title">Places that <Shimmer>fit</Shimmer> you</p>
      <div className="d-scan" aria-hidden="true"><Emblem /></div>
      {cards.map((c, i) => (
        <div key={c.t} className="d-card" style={{ '--c': c.c, '--d': `${0.9 + i * 0.45}s` }}>
          <span className="d-card-img" />
          <span className="d-card-body">
            <b>{c.t}</b>
            <small>{c.s}</small>
            <span className="d-tags">{c.tags.map((t) => <em key={t}>{t}</em>)}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function DemoDiscover() {
  return (
    <div className="scr demo-discover">
      <p className="scr-k">Discover</p>
      <div className="d-search"><span>Search experiences</span></div>
      <div className="d-filters">
        {['Any', 'Retreat', 'Training', 'Drop-in', 'Volunteer'].map((f, i) => (
          <span key={f} className={`d-filter ${i === 2 ? 'd-pick d-pick-1' : ''}`}>{f}</span>
        ))}
      </div>
      <div className="d-rail">
        {['#E09AC4', '#6FB7BF', '#E8BF8A', '#8F9BE6'].map((c, i) => (
          <span key={c} className="d-tile" style={{ '--c': c, '--d': `${1 + i * 0.2}s` }}><i /><b /><small /></span>
        ))}
      </div>
      <p className="scr-k mt">On your calendar</p>
      <div className="d-cal">
        {Array.from({ length: 14 }).map((_, i) => <span key={i} className={[3, 4, 5, 10].includes(i) ? 'on' : ''} style={{ '--d': `${1.6 + i * 0.05}s` }} />)}
      </div>
    </div>
  )
}

function DemoCommunity() {
  const msgs = [
    { me: false, t: 'Welcome to the circle ✦ Who is arriving this season?' },
    { me: true, t: 'Me! Landing in March for the training.' },
    { me: false, t: 'Come to sound healing on Sunday, we save you a mat.' },
    { me: true, t: 'I would love that 🙏' },
  ]
  return (
    <div className="scr demo-community">
      <p className="scr-k">Community</p>
      <p className="scr-title sm">Arrive as a <Shimmer>known person</Shimmer></p>
      <div className="d-msgs">
        {msgs.map((m, i) => (
          <span key={i} className={`d-msg ${m.me ? 'me' : ''}`} style={{ '--d': `${0.6 + i * 0.9}s` }}>{m.t}</span>
        ))}
        <span className="d-typing" style={{ '--d': '4.2s' }}><i /><i /><i /></span>
      </div>
    </div>
  )
}

function DemoHost() {
  const steps = ['Application received', 'Review, by hand', 'Intro call', 'Welcome to Xanadu']
  return (
    <div className="scr demo-host">
      <p className="scr-k">For founding hosts and guides</p>
      <p className="scr-title sm">Your <Shimmer>founding</Shimmer> application</p>
      <ol className="d-steps">
        {steps.map((s, i) => (
          <li key={s} style={{ '--d': `${0.6 + i * 0.8}s` }}><span>{i < 3 ? '✓' : i + 1}</span>{s}</li>
        ))}
      </ol>
      <div className="d-badge" style={{ '--d': '3.6s' }}>✦ Founding member</div>
    </div>
  )
}

const FEATURES = [
  { key: 'stay', title: 'Design your stay', text: 'How long, how you spend your days and where you feel most alive.', Demo: DemoStay },
  { key: 'match', title: 'Matched to you', text: 'Places, guides and offerings that fit your stay, from the people we have already met.', Demo: DemoMatch },
  { key: 'discover', title: 'Discover', text: 'Retreats, trainings, drop-ins and volunteer exchanges, all reviewed before they appear.', Demo: DemoDiscover },
  { key: 'community', title: 'Community', text: 'Meet the people of a place before you arrive, and stay connected after.', Demo: DemoCommunity },
  { key: 'host', title: 'For hosts and guides', text: 'Apply, share your space or your work, and welcome the people looking for it.', Demo: DemoHost },
]

export default function AppShowcase() {
  const [i, setI] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [paused, setPaused] = useState(false)
  const phoneRef = useRef(null)
  const sectionRef = useRef(null)
  const reduced = prefersReducedMotion()

  // stories-style: each feature plays, then the next
  useEffect(() => {
    if (reduced || paused) return
    const id = setTimeout(() => { setI((n) => (n + 1) % FEATURES.length); setCycle((c) => c + 1) }, DUR)
    return () => clearTimeout(id)
  }, [i, cycle, paused, reduced])

  useEffect(() => {
    if (reduced) return
    const onScroll = () => {
      const r = sectionRef.current.getBoundingClientRect()
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      phoneRef.current.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  const pick = (n) => { setI(n); setCycle((c) => c + 1) }
  const F = FEATURES[i]

  return (
    <section id="app" ref={sectionRef} className="appsec">
      <div className="wrap app-grid">
        <div className="phone-stage" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          <div className="phone-glow" aria-hidden="true" />
          <div ref={phoneRef} className="phone">
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-bars" aria-hidden="true">
              {FEATURES.map((f, n) => (
                <span key={f.key} className={n < i ? 'done' : n === i ? 'now' : ''}>
                  <i key={n === i ? cycle : 'x'} style={{ animationDuration: `${DUR}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
                </span>
              ))}
            </div>
            <div className="phone-screen">
              {F.video ? (
                <video key={F.key} src={F.video} autoPlay muted loop playsInline className="phone-video" />
              ) : (
                <div key={`${F.key}-${cycle}`} className="phone-slide is-on"><F.Demo /></div>
              )}
            </div>
          </div>
        </div>

        <div className="app-copy">
          <p className="eyebrow">A glimpse of the app</p>
          <Reveal className="display">Carry the <Shimmer>portal</Shimmer> with you.</Reveal>
          <Rise as="p" className="body">
            The Xanadu app is on its way to the App Store and Google Play. Here is what it holds.
          </Rise>
          <Rise as="ul" className="features" delay={0.1}>
            {FEATURES.map((f, n) => (
              <li key={f.key}>
                <button className={`feature ${n === i ? 'is-on' : ''}`} onClick={() => pick(n)} aria-pressed={n === i}>
                  <span className="feature-title">{f.title}</span>
                  <span className="feature-text">{f.text}</span>
                </button>
              </li>
            ))}
          </Rise>
          <Rise className="app-actions" delay={0.2}>
            <Button href="#join" onClick={(e) => { e.preventDefault(); scrollToTarget('#join') }}>Be first in</Button>
            <span className="install-soon">Coming soon to the App Store and Google Play</span>
          </Rise>
        </div>
      </div>
    </section>
  )
}
