import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import logo from './assets/logo.svg'
import logoSlogan from './assets/logo_slogan.svg'
import logomark from './assets/logomark.svg'
import './App.css'

const IMAGES = {
  hero: new URL('./assets/hero.png', import.meta.url).href,
  containers: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=85',
  seeker: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&q=85',
  facilitators: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=85',
  creation: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85',
  trust: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85',
  intention: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=85',
  alignment: '/src/assets/alignment.png',
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: '', intention: '' })
  const [submitted, setSubmitted] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = IMAGES.hero
    img.onload = () => setHeroLoaded(true)

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.role) return
    setSubmitted(true)
  }

  return (
    <div className="site">

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <img src={logomark} alt="Xanadu" className="nav-logo" />
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="pillars" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>Three Pillars</Link>
            <Link to="network" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>The Network</Link>
            <Link to="path" smooth duration={900} offset={-76} onClick={() => setMenuOpen(false)}>The Path</Link>
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
          className={`hero-bg ${heroLoaded ? 'hero-bg-loaded' : ''}`}
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <Link to="living" smooth duration={1000} offset={-76} className="scroll-hint">
          <span>Begin</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 3v14M1 12l6 6 6-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* HERO SUB */}
      <section className="hero-sub-section" id="hero-sub">
        <div className="hero-sub-inner">
          <p className="hero-sub">
            Something has been broken for a long time.<br />
            The trust between people and the spaces that hold them.<br />
            <em>Xanadu is not an answer. It is an invitation.</em>
          </p>
          <p className="hero-definition">
            <em>xa·na·du</em> &nbsp;/ˈzanəˌdo͞o/ &nbsp;—&nbsp; an idealized place of great or idyllic magnificence and beauty.
          </p>
          <Link to="join" smooth duration={1000} offset={-76}>
            <button className="btn-hero">Enter the Network</button>
          </Link>
        </div>
      </section>

     {/* LIVING SYSTEM */}
      <section className="living" id="about">
        <div className="living-inner">
          <p className="overline">A Living System</p>
          <h2>To return. To remember.<br />To build something worth belonging to.</h2>
          <div className="rule" />
          <p className="body-lg">
            The spaces we enter shape our experiences. The communities we gather with shape our lives. Yet it has become difficult to know which places truly hold integrity and true intentions. Xanadu exists to restore trust in the environments where transformation happens.
          </p>
          <div className="living-word">TRUST.</div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="pillars" id="pillars">
        <div className="section-header">
          <p className="overline">Three Pillars</p>
          <h2>What We Stand On</h2>
        </div>
        <div className="pillars-grid">
          <div className="pillar" style={{ backgroundImage: `url(${IMAGES.trust})` }}>
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Trust.</h3>
              <p>We verify the integrity of every space, every guide, every offering in our network. Nothing is here by chance. Everything is held with purpose.</p>
            </div>
          </div>
          <div className="pillar pillar-tall" style={{ backgroundImage: `url(${IMAGES.intention})` }}>
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Intention.</h3>
              <p>The path is already yours. We help you see it more clearly — not by changing who you are, but by bringing you closer to what already fits. Heart-led. Grounded. True.</p>
            </div>
          </div>
          <div className="pillar" style={{ backgroundImage: `url(${IMAGES.alignment})` }}>
            <div className="pillar-veil" />
            <div className="pillar-content">
              <h3>Alignment.</h3>
              <p>Here for the people. Here for the land. Here for the wisdom. Here for the medicine. Here for the future. Here for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE WORK */}
      <section className="thework" id="thework">
        <div className="thework-inner">
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
        <div className="section-header">
          <p className="overline">The Network</p>
          <h2>Who We Connect</h2>
          <p className="section-sub">Three threads. One fabric.</p>
        </div>
        <div className="network-grid">
          <div className="network-card" style={{ backgroundImage: `url(${IMAGES.containers})` }}>
            <div className="card-veil" />
            <div className="card-content">
              <p className="card-label">Containers</p>
              <h3>Sacred Spaces</h3>
              <p>Trusted ecovillages, retreat centers, schools, temples, and sanctuaries — physical grounds where transformation is possible because the space itself has been prepared to receive it.</p>
            </div>
          </div>
          <div className="network-card network-card-center" style={{ backgroundImage: `url(${IMAGES.seeker})` }}>
            <div className="card-veil card-veil-plum" />
            <div className="card-content">
              <p className="card-label">You</p>
              <h3>The Seeker</h3>
              <p>Arriving exactly as you are — whether seeking deep personal healing, a training that will awaken your gifts, or a way to offer your hands in service. Your path is valid. We help you find it.</p>
            </div>
          </div>
          <div className="network-card" style={{ backgroundImage: `url(${IMAGES.facilitators})` }}>
            <div className="card-veil" />
            <div className="card-content">
              <p className="card-label">Facilitators</p>
              <h3>Wisdom Keepers</h3>
              <p>Breathwork guides, yoga teachers, shamans, somatic practitioners, plant medicine ceremonialists — people who have walked the path and are called to walk beside you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PATH */}
      <section className="path" id="path">
        <div className="path-inner">
          <p className="overline">How It Works</p>
          <h2>The Path</h2>
          <div className="path-steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3>Share Your Intention</h3>
              <p>Get clear on what you're seeking. A feeling. A shift. A remembering. You don't need all the answers — just honesty.</p>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-num">02</span>
              <h3>We Make the Match</h3>
              <p>Xanadu listens beneath the surface — connecting you with the right people, the right spaces, the right moment.</p>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-num">03</span>
              <h3>Follow the Path</h3>
              <p>Step into the experience. Meet what's there. Build, connect, and expand within it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE CREATION */}
      <section className="creation" id="creation" style={{ backgroundImage: `url(${IMAGES.creation})` }}>
        <div className="creation-veil" />
        <div className="creation-inner">
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
        </div>
      </section>

      {/* JOIN */}
      <section className="join" id="join">
        <div className="join-inner">
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

              <button type="submit" className="btn-submit">
                Enter the Network
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