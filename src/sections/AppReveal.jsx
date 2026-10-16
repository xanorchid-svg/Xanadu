import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import Button from '../components/Button'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS, LANDSCAPES } from '../lib/links'
import { prefersReducedMotion } from '../lib/sky'

const platform = () => {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

// Three screens in the style of the app, with invented content only
function ScreenSeek() {
  return (
    <div className="scr scr-seek">
      <div className="scr-mark"><Emblem animated={false} /></div>
      <p className="scr-title">What are you <Shimmer>seeking</Shimmer>?</p>
      {['Rest and stillness', 'Movement and breath', 'Community', 'A new way to live'].map((t, i) => (
        <span key={t} className={`scr-opt ${i === 3 ? 'is-on' : ''}`}>{t}</span>
      ))}
      <span className="scr-btn">Continue</span>
    </div>
  )
}
function ScreenWhere() {
  return (
    <div className="scr scr-where">
      <p className="scr-k">Step 3 of 3</p>
      <p className="scr-title">Where do you feel most <Shimmer>alive</Shimmer>?</p>
      <div className="scr-lands">
        {LANDSCAPES.map((l, i) => (
          <span key={l.name} className={`scr-land ${i === 2 || i === 1 ? 'is-on' : ''}`} style={{ '--c': l.color }}>
            <i />{l.name}
          </span>
        ))}
      </div>
    </div>
  )
}
function ScreenMatch() {
  return (
    <div className="scr scr-match">
      <div className="scr-orbit"><Emblem /></div>
      <p className="scr-title">Your stay is <Shimmer>taking shape</Shimmer></p>
      <div className="scr-tags"><span>A season</span><span>Just be</span><span>Jungle</span><span>Ocean</span></div>
      <p className="scr-note">We'll introduce you to places and guides as they join the network.</p>
    </div>
  )
}
const SCREENS = [ScreenSeek, ScreenWhere, ScreenMatch]

export default function AppReveal() {
  const [i, setI] = useState(0)
  const [qr, setQr] = useState('')
  const [os] = useState(platform)
  const phoneRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    QRCode.toString(LINKS.seeker, { type: 'svg', margin: 0, color: { dark: '#101B2C', light: '#00000000' } })
      .then(setQr).catch(() => {})
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % SCREENS.length), 3400)
    return () => clearInterval(id)
  }, [])

  // the phone floats and turns a little as you scroll past
  useEffect(() => {
    if (prefersReducedMotion()) return
    const onScroll = () => {
      const r = sectionRef.current.getBoundingClientRect()
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      phoneRef.current.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="app" ref={sectionRef} className="appsec">
      <div className="wrap app-grid">
        <div className="phone-stage">
          <div className="phone-glow" aria-hidden="true" />
          <div ref={phoneRef} className="phone">
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-screen">
              {SCREENS.map((S, n) => (
                <div key={n} className={`phone-slide ${n === i ? 'is-on' : ''}`} aria-hidden={n !== i}><S /></div>
              ))}
            </div>
          </div>
          <div className="phone-dots" role="tablist" aria-label="App screens">
            {SCREENS.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Screen ${n + 1}`} className={n === i ? 'is-on' : ''} onClick={() => setI(n)} />
            ))}
          </div>
        </div>

        <div className="app-copy">
          <p className="eyebrow">The Xanadu app</p>
          <Reveal className="display">Carry the <Shimmer>portal</Shimmer> with you.</Reveal>
          <Rise as="p" className="body">
            Design your stay, follow your matches and meet the places and guides of the network, all from your home screen.
          </Rise>
          <Rise className="app-actions" delay={0.15}>
            <Button href={LINKS.seeker}>Download the app</Button>
            <a className="text-link" href={LINKS.signIn}>I already have an account</a>
          </Rise>

          <Rise className="install" delay={0.25}>
            {os === 'desktop' && qr && (
              <div className="qr">
                <div className="qr-code" dangerouslySetInnerHTML={{ __html: qr }} />
                <p>Scan with your phone to open the app, then add it to your home screen.</p>
              </div>
            )}
            {os === 'ios' && (
              <p className="install-hint">
                <span className="install-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span>On iPhone: open the app, tap <b>Share</b>, then <b>Add to Home Screen</b>.</span>
              </p>
            )}
            {os === 'android' && (
              <p className="install-hint">
                <span className="install-icon" aria-hidden="true">⤓</span>
                <span>On Android: open the app and your browser will offer <b>Install app</b>.</span>
              </p>
            )}
            <p className="install-soon">App Store and Google Play coming soon.</p>
          </Rise>
        </div>
      </div>
    </section>
  )
}
