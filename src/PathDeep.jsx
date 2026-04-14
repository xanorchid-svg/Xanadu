import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import './DeepPage.css'

export default function PathDeep() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="deep-page deep-page-light">

      {/* NAV */}
      <nav className="deep-nav deep-nav-light">
        <Link to="/" className="deep-nav-return">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M1 6L6 1M1 6l5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Return</span>
        </Link>
        <Link to="/">
          <img src={logomark} alt="Xanadu" className="deep-nav-mark deep-nav-mark-dark" />
        </Link>
        <div style={{ width: 80 }} />
      </nav>

      {/* CONTENT */}
      <div className="deep-content">

        <header className="deep-header">
          <p className="deep-overline">How It Works</p>
          <h1 className="deep-title">The Path</h1>
          <p className="deep-subtitle">
            Not a search. Not a recommendation engine.<br />
            A recognition.
          </p>
        </header>

        <div className="deep-rule" />

        <div className="deep-body">

          <div className="deep-step">
            <span className="deep-step-num">01</span>
            <div className="deep-step-content">
              <h2>Share Your Intention</h2>
              <p>
                Everything begins with honesty. Not a checklist of preferences — but a genuine expression of where you are and what you're moving toward. A feeling. A question you've been sitting with. A threshold you sense yourself approaching.
              </p>
              <p>
                You don't need to know what you're looking for. You need to know what's true right now. That is enough. Xanadu listens for what lives beneath the words.
              </p>
            </div>
          </div>

          <div className="deep-divider" />

          <div className="deep-step">
            <span className="deep-step-num">02</span>
            <div className="deep-step-content">
              <h2>We Make the Match</h2>
              <p>
                This is not an algorithm. No filter. No ranking. A human being reads your intention and holds it alongside what we know about every Container and Facilitator in the network — their lineage, their current work, the quality of their space, the testimonies of those who have been held there before.
              </p>
              <p>
                The match we make is not the most popular option. It is the most aligned one. Sometimes that means a small space in the mountains with three available dates. Sometimes it means a facilitator you would never have found searching alone.
              </p>
              <p>
                We hold the network so you don't have to navigate it.
              </p>
            </div>
          </div>

          <div className="deep-divider" />

          <div className="deep-step">
            <span className="deep-step-num">03</span>
            <div className="deep-step-content">
              <h2>The Introduction</h2>
              <p>
                When the match feels right, we make a warm introduction — not a booking link, not an automated confirmation. A real message, from us, to the Container or Facilitator, on your behalf.
              </p>
              <p>
                You are arriving as a known person into a prepared space. They have been told who you are and what you're bringing. The work begins before you arrive.
              </p>
            </div>
          </div>

          <div className="deep-divider" />

          <div className="deep-step">
            <span className="deep-step-num">04</span>
            <div className="deep-step-content">
              <h2>Follow the Path</h2>
              <p>
                Step into the experience. Meet what is there. The journey you take inside the network is yours — we only made the door visible. What happens when you walk through it belongs to you.
              </p>
              <p>
                The network grows with every genuine encounter. Every Seeker who is well-matched deepens the trust of every Container and Facilitator who receives them. Every Container who holds someone well builds the reputation of the whole.
              </p>
              <p>
                This is not a platform. It is a living system. You are part of it now.
              </p>
            </div>
          </div>

        </div>

        <div className="deep-rule" />

        <div className="deep-footer-cta">
          <p className="deep-overline">Ready to begin?</p>
          <Link to="/#join" className="deep-cta-btn">
            <span>Enter the Network</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
