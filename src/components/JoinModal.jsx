import { useEffect, useRef, useState } from 'react'
import Emblem from './Emblem'
import Sigil from './Sigil'
import { Shimmer } from './Reveal'
import { LINKS } from '../lib/links'
import { useJoinOpen, openJoin, closeJoin } from '../lib/joinModal'
import { useStay, describeStay } from '../lib/stay'
import { joinWaitlist } from '../lib/waitlist'
import { getLenis } from '../lib/scroll'

const ROLES = [
  { kind: 'seeker', role: 'Seeker', line: 'I am looking for a place, a practice, a way of living.', cta: 'Join the waitlist', hues: ['#B58BE0', '#E09AC4', '#8F9BE6'] },
  { kind: 'container', role: 'Container', line: 'I hold a retreat space, a village or land with community.', cta: 'Apply to the founding circle', href: LINKS.container, hues: ['#9DBB7A', '#6FB7BF', '#E8BF8A'] },
  { kind: 'facilitator', role: 'Facilitator', line: 'I guide retreats, trainings and classes.', cta: 'Apply to the founding circle', href: LINKS.facilitator, hues: ['#E8BF8A', '#E09AC4', '#6FB7BF'] },
]

const SEEN = 'xanadu_join_seen'
const seen = () => { try { return Date.now() - Number(localStorage.getItem(SEEN) || 0) < 7 * 864e5 } catch { return false } }
const markSeen = () => { try { localStorage.setItem(SEEN, String(Date.now())) } catch { /* private mode */ } }

/**
 * "Join Xanadu": choose how you enter.
 * Opens from the nav, and once on its own for a new visitor who has scrolled into the story.
 */
export default function JoinModal({ auto = false }) {
  const open = useJoinOpen()
  const stay = useStay()
  const [step, setStep] = useState('choose') // choose | seeker | done
  const [form, setForm] = useState({ name: '', email: '', trap: '' })
  const [state, setState] = useState('idle')
  const panelRef = useRef(null)
  const lastFocus = useRef(null)

  // a gentle invitation, once a week at most: only after someone has spent time with the story
  // and reached "A world of places", never in the middle of designing their stay
  useEffect(() => {
    if (!auto || seen()) return
    const target = document.querySelector('#places')
    if (!target) return
    const started = Date.now()
    let timer
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const wait = Math.max(2500, 20000 - (Date.now() - started))
      timer = setTimeout(() => { if (!document.querySelector('.join-modal.is-open')) openJoin() }, wait)
    }, { threshold: 0.35 })
    io.observe(target)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [auto])

  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      markSeen()
      lastFocus.current = document.activeElement
      lenis?.stop()
      document.documentElement.classList.add('modal-open')
      setTimeout(() => panelRef.current?.querySelector('button, a, input:not(.hp-trap)')?.focus(), 60)
    } else {
      lenis?.start()
      document.documentElement.classList.remove('modal-open')
      lastFocus.current?.focus?.()
      const t = setTimeout(() => { setStep('choose'); setState('idle') }, 500)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeJoin()
      if (e.key === 'Tab') {
        const f = [...panelRef.current.querySelectorAll('button, a, input:not(.hp-trap)')].filter((el) => !el.disabled)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    const s = describeStay(stay)
    try {
      await joinWaitlist({ name: form.name, email: form.email, intention: s ? `Stay: ${s}` : null, stay, source: 'join-modal', trap: form.trap })
      setStep('done'); setState('idle')
    } catch {
      setState('error')
    }
  }

  return (
    <div className={`join-modal ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="jm-backdrop" onClick={closeJoin} />
      <div ref={panelRef} className="jm-panel iri-border" role="dialog" aria-modal="true" aria-labelledby="jm-title">
        <button className="jm-close" onClick={closeJoin} aria-label="Close">×</button>
        <div className="jm-mark" aria-hidden="true"><Emblem animated={open} /></div>

        {step === 'choose' && (
          <>
            <h2 id="jm-title" className="jm-title">Join <Shimmer>Xanadu</Shimmer></h2>
            <p className="jm-sub">How are you entering?</p>
            <div className="jm-roles">
              {ROLES.map((r, i) => {
                const inner = (
                  <>
                    <Sigil kind={r.kind} hues={r.hues} />
                    <span className="jm-role-text">
                      <b>{r.role}</b>
                      <span>{r.line}</span>
                      <em>{r.cta} →</em>
                    </span>
                  </>
                )
                return r.href ? (
                  <a key={r.kind} href={r.href} className="jm-role" style={{ '--i': i, '--c': r.hues[0] }}>{inner}</a>
                ) : (
                  <button key={r.kind} className="jm-role" style={{ '--i': i, '--c': r.hues[0] }} onClick={() => setStep('seeker')}>{inner}</button>
                )
              })}
            </div>
          </>
        )}

        {step === 'seeker' && (
          <form className="jm-form" onSubmit={submit}>
            <h2 id="jm-title" className="jm-title">Be first <Shimmer>through the door</Shimmer></h2>
            <p className="jm-sub">Seekers enter when the founding circle is complete. We'll write when the doors open.</p>
            <input className="hp-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.trap} onChange={(e) => setForm({ ...form, trap: e.target.value })} />
            <label className="field">
              <span>Your name</span>
              <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </label>
            <label className="field">
              <span>Your email</span>
              <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </label>
            {describeStay(stay) && <p className="jm-stay">Your stay: {describeStay(stay)}</p>}
            <button type="submit" className="btn btn-pearl jm-submit" disabled={state === 'sending'}>
              <span className="btn-label">{state === 'sending' ? 'Sending…' : 'Join the waitlist'}</span>
            </button>
            {state === 'error' && <p className="join-error" role="alert">Something went wrong. Please try again, or write to networkxanadu@gmail.com.</p>}
            <button type="button" className="jm-back" onClick={() => setStep('choose')}>← Back</button>
          </form>
        )}

        {step === 'done' && (
          <div className="jm-done" role="status">
            <h2 id="jm-title" className="jm-title">You have been <Shimmer>received</Shimmer>.</h2>
            <p className="jm-sub">We will be in touch when the doors open. Come as you are.</p>
            <button className="btn btn-ghost" onClick={closeJoin}><span className="btn-label">Return to Xanadu</span></button>
          </div>
        )}
      </div>
    </div>
  )
}
