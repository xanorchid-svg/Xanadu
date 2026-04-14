import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import './DeepPage.css'

export default function LivingNetworkDeep() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="deep-page deep-page-navy">

      {/* Concentric circles — same as landing section */}
      <div className="ln-deep-circles" />

      {/* NAV */}
      <nav className="deep-nav deep-nav-dark">
        <Link to="/" className="deep-nav-return deep-nav-return-light">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M1 6L6 1M1 6l5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Return</span>
        </Link>
        <Link to="/">
          <img src={logomark} alt="Xanadu" className="deep-nav-mark deep-nav-mark-light" />
        </Link>
        <div style={{ width: 80 }} />
      </nav>

      {/* CONTENT */}
      <div className="deep-content deep-content-navy">

        <header className="deep-header">
          <p className="deep-overline deep-overline-gold">The Living Network</p>
          <h1 className="deep-title deep-title-white">
            What grows here,<br />grows together.
          </h1>
          <p className="deep-subtitle deep-subtitle-muted">
            This is not a directory.<br />
            It is a living system.
          </p>
        </header>

        <div className="deep-rule deep-rule-gold" />

        <div className="deep-body deep-body-navy">

          <p className="ln-deep-body">
            A living system only thrives when what is inside it is real. When the spaces are genuine. When the guides have truly walked the path they teach. When the seekers arrive with honest intention rather than curated expectation.
          </p>

          <p className="ln-deep-body">
            This is why verification is not a feature of Xanadu. It is the foundation. Every Container, every Facilitator enters through an intake process — questions about lineage, about practice, about how they hold space. References are gathered. Conversations are had. The badge is earned, not purchased.
          </p>

          <div className="deep-rule deep-rule-gold" />

          <div className="ln-deep-pull">
            <em>The exposure you seek is not reach. It is resonance.</em>
          </div>

          <div className="deep-rule deep-rule-gold" />

          <p className="ln-deep-body">
            When you enter Xanadu, you are seen. Not as a listing. Not as a lead. As a whole person — your space, your work, your gifts, your path — offered to the people who are genuinely ready to receive them.
          </p>

          <p className="ln-deep-body">
            A Container in the network is not competing for clicks. They are being introduced, by us, to seekers whose intentions we have already read. A Facilitator is not posting into a void. They are arriving into a room where someone is already waiting for exactly what they carry.
          </p>

          <p className="ln-deep-body">
            This is how the network grows — not by adding more listings, but by deepening the quality of every connection within it. Each genuine encounter builds trust. Each matched seeker becomes a reference. Each verified guide makes the whole network more credible.
          </p>

          <div className="deep-rule deep-rule-gold" />

          <p className="ln-deep-body">
            We grow by being known.<br />
            Not by performing. Not by marketing.<br />
            By showing up, truthfully, in a place that was built to hold that.
          </p>

          <p className="ln-deep-close">
            That is what the network provides.<br />
            And it only exists because you are willing to be part of it.
          </p>

        </div>

        <div className="deep-footer-cta">
          <p className="deep-overline deep-overline-gold">Be part of what is forming.</p>
          <Link to="/#join" className="deep-cta-btn deep-cta-btn-navy">
            <span>Come as You Are</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
