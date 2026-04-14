import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import SacredTriangle from './SacredTriangle'
import './DeepPage.css'
import './RolePage.css'

export default function FacilitatorPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="deep-page deep-page-light">
      <nav className="deep-nav deep-nav-light">
        <Link to="/" className="deep-nav-return">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M1 6L6 1M1 6l5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Return</span>
        </Link>
        <Link to="/"><img src={logomark} alt="Xanadu" className="deep-nav-mark deep-nav-mark-dark" /></Link>
        <div style={{ width: 80 }} />
      </nav>

      <div className="deep-content">
        <header className="deep-header">
          <p className="deep-overline" style={{ color: '#b8862a' }}>The Facilitator</p>
          <h1 className="deep-title">Your medicine is real.<br />Let it find its people.</h1>
          <div className="role-triangle">
            <SacredTriangle role="facilitator" />
          </div>
          <p className="deep-subtitle">
            You have done the inner work. You carry a lineage.<br />
            You know how to hold space. Now let us hold the logistics.
          </p>
        </header>

        <div className="deep-rule" />

        <div className="role-body">

          <div className="role-block">
            <h2>The work of finding should not fall on you.</h2>
            <p>Guides, teachers, and practitioners spend enormous energy finding the right spaces to work in — and the right people to work with. They post into social media voids. They navigate directories that put them next to anyone willing to pay a listing fee. They reach out cold to retreat centres that have no idea who they are.</p>
            <p>This is not the work you came to do. Xanadu takes that burden off you and places it where it belongs — with a network built specifically to connect integrity with integrity.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>What Xanadu offers you.</h2>
            <p>Verified connection to Containers — sacred spaces that have been vetted for the quality of their land, their lineage, and their intention. Spaces that are genuinely looking for guides like you. Introductions made by us, personally, with context about who you are and what you carry.</p>
            <p>And a steady flow of seekers whose intentions we have already read — people who are ready for what you offer, matched to you because of the specificity of their longing and the specificity of your gifts.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>Part of a living lineage.</h2>
            <p>Every Facilitator in Xanadu is verified — not just listed. We ask about your training, your lineage, your practice, and the people who can speak to the quality of your work. The badge you earn is not a marketing asset. It is a signal to every seeker and container in the network that you have been seen and found worthy.</p>
            <p>In a world where anyone can claim to be a guide, that signal matters more than ever. And the community you join is one that takes its responsibility to life seriously — in devotion to the work, in service of what is real.</p>
          </div>

        </div>

        <div className="deep-rule" />

        <div className="deep-footer-cta">
          <p className="deep-overline">Ready to be found by the right people?</p>
          <Link to="/#join" className="deep-cta-btn deep-cta-btn-gold">
            <span>Enter the Network</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
