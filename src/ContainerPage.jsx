import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import SacredTriangle from './SacredTriangle'
import './DeepPage.css'
import './RolePage.css'

export default function ContainerPage() {
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
          <p className="deep-overline" style={{ color: '#4f5f4a' }}>The Container</p>
          <h1 className="deep-title">The land is ready.<br />The right people are coming.</h1>
          <div className="role-triangle">
            <SacredTriangle role="container" />
          </div>
          <p className="deep-subtitle">
            You have built something real. Something with integrity.<br />
            Xanadu makes sure it reaches the people it was made for.
          </p>
        </header>

        <div className="deep-rule" />

        <div className="role-body">

          <div className="role-block">
            <h2>The space deserves the right people.</h2>
            <p>You have invested deeply — in the land, in the infrastructure, in the intention. You have held the space with care and built something genuinely worthy of the experiences it hosts. But without the right facilitators and a steady flow of seekers ready to receive what your space offers, that investment sits waiting.</p>
            <p>The visibility problem is real. Directories list everyone. Algorithms reward volume. The sacred gets buried under the commercial. Xanadu was built to solve exactly this.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>What Xanadu offers you.</h2>
            <p>A verified listing in a curated network — not a directory, but a living ecosystem. Facilitators who are specifically looking for spaces with your quality and intention. Seekers who have been matched to your space because of who they are and what they're ready for.</p>
            <p>Every introduction we make on your behalf comes with context. The facilitator knows something about your land before they arrive. The seeker knows something about the quality of what they're walking into. These are not cold transactions. They are prepared encounters.</p>
          </div>

          <div className="deep-divider" />

          <div className="role-block">
            <h2>Stewardship recognised.</h2>
            <p>We verify every Container — not just that you exist, but that you hold space with integrity. We ask about your land relationship, your lineage, your operating history, and the guides who have worked there and can speak to what you've built.</p>
            <p>The Xanadu verification badge is a signal to every facilitator and seeker in the network that your space has been seen, considered, and found worthy of trust. In a world hungry for real places — that signal is everything.</p>
          </div>

        </div>

        <div className="deep-rule" />

        <div className="deep-footer-cta">
          <p className="deep-overline">Ready to be found by the right people?</p>
          <Link to="/#join" className="deep-cta-btn deep-cta-btn-sage">
            <span>Enter the Network</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
