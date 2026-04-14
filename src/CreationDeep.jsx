import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logomark from './assets/logomark.svg'
import './DeepPage.css'

const CREATION_IMAGE = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85'

export default function CreationDeep() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="deep-page">

      {/* HERO BG — fixed nature image */}
      <div
        className="creation-deep-bg"
        style={{ backgroundImage: `url(${CREATION_IMAGE})` }}
      />
      <div className="creation-deep-veil" />

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
      <div className="deep-content deep-content-creation">

        <header className="deep-header">
          <p className="deep-overline deep-overline-gold">The Creation</p>
          <h1 className="deep-title deep-title-light">What We Cultivate</h1>
          <div className="creation-deep-trio">
            <span>Remembrance.</span>
            <span>Belonging.</span>
            <span>Emergence.</span>
          </div>
        </header>

        <div className="deep-rule deep-rule-gold" />

        <div className="deep-body deep-body-creation">

          <p className="creation-deep-body">
            A remembering is underway. Not new — ancient. Rising at the scale of the whole.
          </p>

          <p className="creation-deep-body">
            To listen to our ancestors. To honour those who carried the flame and passed it forward. To rebuild what was broken not through force, but through trust. Through showing up in the right places, with the right people, at the right time.
          </p>

          <p className="creation-deep-body">
            Together, we steward what the earth has always known — that life is meant to be full of light, love, healing, laughter, joy, play, abundance. That communities hold more than individuals can carry alone. That the spaces we gather in shape the quality of what is possible between us.
          </p>

          <div className="deep-rule deep-rule-gold" />

          <blockquote className="creation-deep-poem">
            There is a fabric that holds all things.<br />
            Ancient. Alive.<br />
            Humming at a frequency your body already knows.<br /><br />
            You have always been part of it.<br />
            The village. The fire. The circle.<br />
            The eyes across the room that feel like home.<br /><br />
            There was a time when you knew exactly<br />
            where to go when you needed to be held.<br />
            When the space itself remembered you.<br />
            When the guide was already waiting.<br /><br />
            We are not building that here.<br />
            We are clearing the space<br />
            for what was always true<br />
            to be felt again.
          </blockquote>

          <div className="deep-rule deep-rule-gold" />

          <p className="creation-deep-close">
            Xanadu is not a product. It is not a service.<br />
            It is a covenant between the people who believe<br />
            that this kind of world is still possible —<br />
            and are willing to build it together,<br />
            one sacred space at a time.
          </p>

        </div>

        <div className="deep-footer-cta">
          <p className="deep-overline deep-overline-gold">Be part of what is forming.</p>
          <Link to="/#join" className="deep-cta-btn deep-cta-btn-light">
            <span>Come as You Are</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
