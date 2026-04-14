import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import logomark from './assets/logomark.svg'
import './WaitlistPopup.css'

export default function WaitlistPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (triggered) return
      // Trigger after scrolling past ~80vh — past the hero sub section
      if (window.scrollY > window.innerHeight * 0.85) {
        setTriggered(true)
        setTimeout(() => setVisible(true), 400)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [triggered])

  const dismiss = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
    }, 600)
  }

  if (!visible) return null

  return (
    <div className={`popup-overlay ${closing ? 'popup-closing' : ''}`} onClick={dismiss}>
      <div
        className={`popup-card ${closing ? 'popup-card-closing' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="popup-close" onClick={dismiss} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>

        <img src={logomark} alt="" className="popup-mark" />

        <p className="popup-overline">You have found us.</p>

        <h2 className="popup-heading">
          The network<br />is forming.
        </h2>

        <p className="popup-body">
          Something sacred is being built here —<br />
          slowly, intentionally, with care.<br />
          <em>Be among the first to enter.</em>
        </p>

        <div className="popup-divider" />

        <Link
          to="join"
          smooth
          duration={1000}
          offset={-76}
          className="popup-cta"
          onClick={dismiss}
        >
          Enter the Network
        </Link>

        <button className="popup-skip" onClick={dismiss}>
          Not yet
        </button>
      </div>
    </div>
  )
}
