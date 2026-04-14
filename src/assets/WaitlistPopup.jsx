import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'
import './WaitlistPopup.css'

const SHOWN_KEY = 'xanadu_popup_shown'

export default function WaitlistPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [intention, setIntention] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const triggered = useRef(false)

  useEffect(() => {
    // If already shown this session, do nothing
    if (sessionStorage.getItem(SHOWN_KEY)) return

    const tryShow = () => {
      if (triggered.current) return
      triggered.current = true
      window.removeEventListener('scroll', onScroll)
      // Small delay so the popup doesn't jar on the exact scroll threshold
      setTimeout(() => {
        sessionStorage.setItem(SHOWN_KEY, 'true')
        setVisible(true)
      }, 600)
    }

    const onScroll = () => {
      // Fire once user has scrolled past the hero (one full viewport height)
      if (window.scrollY > window.innerHeight * 0.9) {
        tryShow()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Also check immediately in case page is loaded already scrolled
    if (window.scrollY > window.innerHeight * 0.9) {
      tryShow()
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
    }, 400)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    setError('')
    try {
      const { error: sbError } = await supabase
        .from('waitlist')
        .insert([{ name, email, role: role || 'Seeker', intention }])
      if (sbError) throw sbError
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className={`xp-overlay ${closing ? 'xp-closing' : ''}`} onClick={close}>
      <div className="xp-modal" onClick={e => e.stopPropagation()}>

        <button className="xp-close" onClick={close} aria-label="Close">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="xp-mark">✦</div>
            <p className="xp-overline">The Network Is Forming</p>
            <h2 className="xp-heading">Step Inside</h2>
            <p className="xp-sub">
              Leave your name and intention.<br />
              We'll reach out when the time is right.
            </p>

            <form className="xp-form" onSubmit={handleSubmit}>
              <div className="xp-row">
                <input
                  className="xp-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <input
                  className="xp-input"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="xp-roles">
                {[
                  { id: 'Seeker',      symbol: '◎' },
                  { id: 'Facilitator', symbol: '◈' },
                  { id: 'Container',   symbol: '⬡' },
                ].map(({ id, symbol }) => (
                  <button
                    key={id}
                    type="button"
                    className={`xp-role ${role === id ? 'xp-role-active' : ''}`}
                    onClick={() => setRole(id)}
                  >
                    <span className="xp-role-symbol">{symbol}</span>
                    <span className="xp-role-name">{id}</span>
                  </button>
                ))}
              </div>

              <textarea
                className="xp-input xp-textarea"
                placeholder="Your intention — optional"
                value={intention}
                onChange={e => setIntention(e.target.value)}
                rows={2}
              />

              {error && <p className="xp-error">{error}</p>}

              <button className="xp-btn" type="submit" disabled={loading}>
                <span>{loading ? 'Sending…' : 'Come as You Are'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="xp-success">
            <div className="xp-mark xp-mark-gold">✦</div>
            <h2 className="xp-heading">You have been received.</h2>
            <p className="xp-sub">We will be in touch<br />when the time is right.</p>
          </div>
        )}

      </div>
    </div>
  )
}
