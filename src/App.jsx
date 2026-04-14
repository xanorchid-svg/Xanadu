import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-scroll'
import logoSlogan from './assets/logo_slogan.svg'
import logomark from './assets/logomark.svg'
import { supabase } from './supabase'
import './App.css'
import WaitlistPopup from './WaitlistPopup'

const IMAGES = {
  hero: new URL('./assets/hero.png', import.meta.url).href,
  containers: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=85',
  seeker: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&q=85',
  facilitators: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=85',
  creation: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85',
  trust: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85',
  intention: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=85',
  alignment: new URL('./assets/alignment.png', import.meta.url).href,
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: '', intention: '' })
  const [submitted, setSubmitted] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const heroBgRef = useRef(null)
  const livingWordRef = useRef(null)

  const heroSubRef = useReveal()
  const livingRef = useReveal()
  const pillarsHeaderRef = useReveal()
  const theworkRef = useReveal()
  const networkHeaderRef = useReveal()
  const midCtaRef = useReveal()
  const creationRef = useReveal()
  const livingNetworkRef = useReveal()
  const joinRef = useReveal()
  const pillar1Ref = useReveal()
  const pillar2Ref = useReveal()
  const pillar3Ref = useReveal()
  const card1Ref = useReveal()
  const card2Ref = useReveal()
  const card3Ref = useReveal()

  useEffect(() => {
    const img = new Image()
    img.src = IMAGES.hero
    img.onload = () => setHeroLoaded(true)

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)

      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${y * 0.28}px)`
      }

      if (livingWordRef.current) {
        const rect = livingWordRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85) {
          livingWordRef.current.classList.add('visible')
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role) return
    setSubmitting(true)
    setFormError(null)
    const { error } = await supabase
      .from('waitlist')
      .insert([{
        name: formData.name,
        email: formData.email,
        role: formData.role,
        intention: formData.intention,
      }])
    setSubmitting(false)
    if (error) {
      setFormError('Something went wrong. Please try again.')
      console.error(error)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="site">
      <WaitlistPopup />

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <img src={logomark} alt="Xanadu" className="nav-logo" />
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="pillars" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>Three Pillars</Link>
            <Link to="network" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>The Network</Link>
            <Link to="creation" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>The Creation</Link>
            <Link to="join" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>Join</Link>
          </div>
          <Link to="join" smooth duration={900} offset={-76} className="nav-cta" onClick={() => setMenuOpen(false)}>
            Join the Network
          </Link>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div
          ref={heroBgRef}
          className={`hero-bg ${heroLoaded ? 'hero-bg-loaded' : ''}`}
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <p className="hero-whisper">A Network for Awakening Places</p>
        <Link to="hero-sub" smooth duration={1000} offset={0} className="scroll-hint">
          <span>Begin</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 3v14M1 12l6 6 6-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* HERO SUB */}
      <section className="hero-sub-section" id="hero-sub">
        <div className="hero-sub-inner">
          <p ref={heroSubRef} className="hero-sub reveal">
            Something has been broken for a long time.<br />
            The trust between people and the spaces that hold them.<br />
            <em>Xanadu is not an answer. It is an invitation.</em>
          </p>
          <p className="hero-definition reveal reveal-delay-2" ref={useReveal()}>
            <em>xa·na·du</em>&nbsp; /ˈzanəˌdo͞o/&nbsp; —&nbsp; an idealized place of great or idyllic magnificence and beauty.
          </p>
          <div className="reveal reveal-delay-3" ref={useReveal()}>
            <Link to="join" smooth duration={1000} offset={-76}>
              <button className="btn-hero"><span>Enter the Network</span></button>
            </Link>
          </div>
        </div>
      </section>

      {/* LIVING SYSTEM */}
      <section className="living" id="living">
        <div className="living-inner">
          <div ref={livingRef} className="reveal">
            <p className="overline">A Living System</p>
            <h2>To return. To remember.<br />To build something worth belonging to.</h2>
            <div className="rule" />
            <p className="body-lg">
              The spaces we enter shape our experiences. The communities we gather with shape our lives. Yet it has become difficult to know which places truly hold integrity — and true intention. Xanadu exists to restore trust in the environments where transformation happens.
            </p>
          </div>
          <div ref={livingWordRef} className="living-word">TRUST.</div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="pillars" id="pillars">
        <div ref={pillarsHeaderRef} className="section-header reveal">
          <p className="overline">Three Pillars</p>
          <h2>What We Stand On</h2>
        </div>
        <div className="pillars-grid">

          <div ref={pillar1Ref} className="pillar reveal reveal-left">
            <div className="pillar-bg-inner" style={{ backgroundImage: `url(${IMAGES.trust})` }} />
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Trust.</h3>
              <p>Every space, every guide, every offering is verified by us before it enters the network. Nothing is here by accident. Everything has been held, considered, and chosen.</p>
            </div>
          </div>

          <div ref={pillar2Ref} className="pillar pillar-tall reveal reveal-delay-2">
            <div className="pillar-bg-inner" style={{ backgroundImage: `url(${IMAGES.intention})` }} />
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Intention.</h3>
              <p>We listen beneath the surface. Not just to what you are seeking — but to why. The match we make is not a recommendation. It is a recognition.</p>
            </div>
          </div>

          <div ref={pillar3Ref} className="pillar reveal reveal-right">
            <div className="pillar-bg-inner" style={{ backgroundImage: `url(${IMAGES.alignment})` }} />
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Alignment.</h3>
              <p>For the people. For the land. For the wisdom lineages that have carried this flame forward. What belongs together finds each other here.</p>
            </div>
          </div>

        </div>
      </section>

      {/* THE WORK */}
      <section className="thework" id="thework">
        <div className="thework-orbit" />
        <div ref={theworkRef} className="thework-inner reveal">
          <p className="overline">The Work</p>
          <h2>Rebuilding<br />the Bridge</h2>
          <div className="rule rule-light" />
          <p className="thework-body">
            The bridge was never destroyed.<br />
            It was forgotten. Overgrown.<br />
            Buried under noise and the relentless pace<br />
            of a world that forgot to ask <em>why.</em>
          </p>
          <p className="thework-mark">✦</p>
        </div>
      </section>

      {/* THE NETWORK */}
      <section className="network" id="network">
        <div ref={networkHeaderRef} className="section-header reveal">
          <p className="overline">The Network</p>
          <h2>Who We Connect</h2>
          <p className="section-sub">Three threads. One fabric.</p>
        </div>
        <div className="network-grid">

          <div ref={card1Ref} className="network-card reveal reveal-left">
            <div className="network-card-bg" style={{ backgroundImage: `url(${IMAGES.containers})` }} />
            <div className="card-veil" />
            <div className="card-content">
              <p className="card-label">Containers</p>
              <h3>Sacred Spaces</h3>
              <p>Ecovillages, retreat centers, temples, and sanctuaries that have been verified for integrity. Spaces where the land itself has been prepared to hold the work.</p>
            </div>
          </div>

          <div ref={card2Ref} className="network-card network-card-center reveal reveal-delay-2">
            <div className="network-card-bg" style={{ backgroundImage: `url(${IMAGES.seeker})` }} />
            <div className="card-veil card-veil-plum" />
            <div className="card-content">
              <p className="card-label">You</p>
              <h3>The Seeker</h3>
              <p>Arriving exactly as you are. Whether seeking healing, a practice, a community, or a place to offer your gifts — your path is real. We help you find where it leads.</p>
            </div>
          </div>

          <div ref={card3Ref} className="network-card reveal reveal-right">
            <div className="network-card-bg" style={{ backgroundImage: `url(${IMAGES.facilitators})` }} />
            <div className="card-veil" />
            <div className="card-content">
              <p className="card-label">Facilitators</p>
              <h3>Wisdom Keepers</h3>
              <p>Breathwork guides, somatic practitioners, yoga teachers, ceremonialists — verified guides who have walked the path and are called to walk beside you.</p>
            </div>
          </div>

        </div>
      </section>

      {/* THE PATH — condensed */}
      <section className="path" id="path">
        <div className="path-inner reveal" ref={useReveal()}>
          <p className="overline">How It Works</p>
          <h2>The Path</h2>
          <p className="path-summary">
            You share your intention — a feeling, a shift, a remembering.<br />
            Xanadu listens beneath the surface and makes the match.<br />
            Not an algorithm. A recognition.
          </p>
          <a href="/path" className="dive-deeper">Dive Deeper</a>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="mid-cta" id="mid-cta">
        <div ref={midCtaRef} className="mid-cta-inner reveal">
          <p className="mid-cta-mark">✦</p>
          <p className="mid-cta-text">
            The network is forming.<br />
            <em>Be among the first to enter.</em>
          </p>
          <Link to="join" smooth duration={1000} offset={-76}>
            <button className="btn-hero"><span>I Am Ready</span></button>
          </Link>
        </div>
      </section>

      {/* THE CREATION */}
      <section className="creation" id="creation" style={{ backgroundImage: `url(${IMAGES.creation})` }}>
        <div className="creation-veil" />
        <div ref={creationRef} className="creation-inner reveal">
          <p className="overline">The Creation</p>
          <h2>What We Cultivate</h2>
          <div className="creation-trio">
            <span>Remembrance.</span>
            <span>Belonging.</span>
            <span>Emergence.</span>
          </div>
          <p className="creation-body">
            A remembering is underway. Not new — ancient. Rising at the scale of the whole. To listen to our ancestors. To honour those who carried the flame and passed it forward. Together, we steward what the earth has always known — that life is meant to be full of light, love, healing, laughter, joy, play, abundance.
          </p>
          <blockquote className="creation-poem">
            There is a fabric that holds all things.<br />
            Ancient. Alive.<br />
            Humming at a frequency your body already knows.<br />
            You have always been part of it.<br />
            The village. The fire. The circle.<br />
            The eyes across the room that feel like home.
          </blockquote>
          <p className="creation-close">We are not building connection here.<br />We are clearing the space for what was always true to be felt again.</p>
          <a href="/creation" className="dive-deeper dive-deeper-light">Dive Deeper</a>
        </div>
      </section>

      {/* LIVING NETWORK */}
      <section className="living-network-section" id="living-network">
        <div ref={livingNetworkRef} className="living-network-inner reveal">
          <p className="overline">The Living Network</p>
          <h2 className="ln-heading">What grows here,<br />grows together.</h2>
          <div className="ln-body">
            <p>
              This is not a directory.<br />
              It is a living system — and it only thrives when what is inside it is real.
            </p>
            <p>
              When you enter Xanadu, you are seen.<br />
              Your space. Your work. Your gifts. Your path —<br />
              offered to the people who are genuinely ready to receive them.
            </p>
            <p className="ln-emphasis">
              <em>The exposure you seek is not reach. It is resonance.</em>
            </p>
            <p>
              That is what the network provides.<br />
              And it only exists because you are willing to be part of it.
            </p>
          </div>
          <Link to="join" smooth duration={1000} offset={-76}>
            <button className="btn-hero ln-btn"><span>Begin the Journey</span></button>
          </Link>
        </div>
      </section>

      {/* JOIN */}
      <section className="join" id="join">
        <div ref={joinRef} className="join-inner reveal">
          <img src={logomark} alt="" className="join-mark" />
          <p className="overline">Join the Network</p>
          <h2>The Ancient Future.<br />We Are Here to Steward Its Return.</h2>
          <p className="join-sub">Come as you are. Grow together.</p>

          {submitted ? (
            <div className="form-success">
              <img src={logomark} alt="" className="success-mark" />
              <h3>You have been received.</h3>
              <p>We will be in touch when the time is right.</p>
            </div>
          ) : (
            <form className="join-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Your email address"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="field">
                <label>I am entering as —</label>
                <div className="role-options">
                  {[
                    { id: 'Seeker', icon: '◎', desc: 'Seeking healing, growth & belonging' },
                    { id: 'Facilitator', icon: '◈', desc: 'A guide, teacher & wisdom keeper' },
                    { id: 'Container', icon: '⬡', desc: 'A sacred space that holds the work' },
                  ].map(({ id, icon, desc }) => (
                    <button
                      key={id}
                      type="button"
                      className={`role-btn ${formData.role === id ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, role: id})}
                    >
                      <span className="role-icon">{icon}</span>
                      <span className="role-name">{id}</span>
                      <span className="role-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Your intention <span className="optional">— optional</span></label>
                <textarea
                  placeholder="What are you bringing, seeking, or offering?"
                  rows={3}
                  value={formData.intention}
                  onChange={e => setFormData({...formData, intention: e.target.value})}
                />
              </div>

              {formError && <p className="form-error">{formError}</p>}

              <button type="submit" className="btn-submit" disabled={submitting}>
                <span>{submitting ? 'Sending...' : 'Come as You Are'}</span>
              </button>
              {!formData.role && (
                <p className="form-hint">Select your role to continue.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <img src={logoSlogan} alt="Xanadu" className="footer-logo" />
        <div className="footer-links">
          <a href="mailto:dreamxanadu@gmail.com">dreamxanadu@gmail.com</a>
          <span>·</span>
          <a href="tel:+14693603197">+1 (469) 360-3197</a>
        </div>
        <p className="footer-copy">© 2026 Xanadu. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
