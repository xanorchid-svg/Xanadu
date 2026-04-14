import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import SacredTriangle from './SacredTriangle'
import './DeepPage.css'
import './RolePage.css'

export default function SeekerPage() {
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
          <p className="deep-overline" style={{ color: '#6b2d4e' }}>The Seeker</p>
          <h1 className="deep-title">You are not lost.<br />You are arriving.</h1>
          <div className="role-triangle">
            <SacredTriangle role="seeker" />
          </div>
          <p className="deep-subtitle">
            The pull you feel is real — toward healing, toward community,<br />
            toward something you can't quite name yet. That is enough.
          </p>
        </header>

        <div className="deep-rule" />

        <div className="role-body">

          <div className="role-block">
            <h2>You don't need to have it figured out.</h2>
            <p>Most people who find Xanadu aren't sure exactly what they're looking for. They feel a longing — for deeper connection, for a practice that holds them, for a place that feels like home. Some are in the middle of a transition. Some are called toward service and don't know where to offer it. Some simply know that the way they've been living is no longer enough.</p>
            <p>All of that is welcome here. You arrive as you are, with whatever is true right now. We listen for what lives beneath the surface — not just the words, but the intention behind them.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>What Xanadu offers you.</h2>
            <p>A curated introduction to the spaces, guides, and communities that are genuinely aligned with where you are and where you're moving. Not a search result. Not a list of options. A recognition — this is the place, this is the person, this is the moment.</p>
            <p>Every Container and Facilitator in our network has been verified for integrity. You are not navigating the internet alone. You are arriving, known, into a space that has been prepared to receive you.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>In service of something larger.</h2>
            <p>Many seekers arrive not only for themselves, but because they feel called to be part of something. To offer their hands, their presence, their gifts in devotion to life. To find the communities where that kind of showing up is not only possible — but needed.</p>
            <p>Xanadu holds space for that too. The seeker who becomes the volunteer. The student who becomes the guide. The wanderer who finds where they belong and decides to stay. Every thread in the network is connected. Yours included.</p>
          </div>

        </div>

        <div className="deep-rule" />

        <div className="deep-footer-cta">
          <p className="deep-overline">Your path begins with one step.</p>
          <Link to="/#join" className="deep-cta-btn deep-cta-btn-plum">
            <span>Enter the Network</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
