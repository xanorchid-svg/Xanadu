import { useState } from 'react'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import { useStay, describeStay } from '../lib/stay'
import { createSeeker } from '../lib/account'
import GoogleJoin from '../components/GoogleJoin'
import { scrollToTarget } from '../lib/scroll'

export default function Join() {
  const stay = useStay()
  const [form, setForm] = useState({ name: '', email: '', password: '', seeking: '', trap: '' })
  const [state, setState] = useState('idle') // idle | sending | check-email | done
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const stayText = describeStay(stay)
  const intention = () => [stayText && `Stay: ${stayText}`, form.seeking.trim()].filter(Boolean).join('\n\n')

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'sending') return
    if (form.trap) { setState('done'); return } // quietly drop bots
    setState('sending'); setError('')
    try {
      const r = await createSeeker({ name: form.name, email: form.email, password: form.password, intention: intention(), stay, source: 'join-section' })
      setState(r)
    } catch (err) {
      setError(err.message); setState('idle')
    }
  }

  return (
    <section id="join" className="join">
      <div className="wrap join-grid">
        <div className="join-copy">
          <p className="eyebrow">The waitlist</p>
          <Reveal className="display">Be first through <Shimmer>the door</Shimmer>.</Reveal>
          <Rise as="p" className="body">
            Seekers enter when the founding circle is complete. Create your Xanadu account now with the stay you dream of, and we'll write to you when the doors open.
          </Rise>
          <Rise as="p" className="join-hosts" delay={0.15}>
            Hold a space or guide others? <a className="text-link" href={LINKS.container}>Apply as a Container</a> or <a className="text-link" href={LINKS.facilitator}>a Facilitator</a>.
          </Rise>
        </div>

        <Rise className="join-card iri-border" delay={0.1}>
          {state === 'done' || state === 'check-email' ? (
            <div className="join-done" role="status">
              <div className="join-done-mark"><Emblem electrons /></div>
              {state === 'done' ? (
                <>
                  <p className="display small">You have been <Shimmer>received</Shimmer>.</p>
                  <p className="body">Your Xanadu account is ready, and you're on the waitlist. We will be in touch when the doors open. Come as you are.</p>
                </>
              ) : (
                <>
                  <p className="display small">One last <Shimmer>step</Shimmer>.</p>
                  <p className="body">We sent a link to {form.email.trim()}. Tap it to confirm your account, and your place on the waitlist is held.</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="join-form">
              <input className="hp-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.trap} onChange={set('trap')} />
              <GoogleJoin intention={intention} stay={stay} source="join-section" onError={setError} />
              <label className="field">
                <span>Your name</span>
                <input required autoComplete="name" value={form.name} onChange={set('name')} placeholder="Full name" />
              </label>
              <label className="field">
                <span>Your email</span>
                <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </label>
              <label className="field">
                <span>Create a password</span>
                <input required type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" />
              </label>
              <div className="field">
                <span>Your stay</span>
                {stayText ? (
                  <p className="join-stay">
                    {[...stay.seeking, stay.length, stay.work, ...stay.where].filter(Boolean).map((t) => <em key={t} className="chip is-set">{t}</em>)}
                  </p>
                ) : (
                  <button type="button" className="join-design" onClick={() => scrollToTarget('#stay')}>Design your stay ↑</button>
                )}
              </div>
              <label className="field">
                <span>What are you seeking? <small>optional</small></span>
                <textarea rows={3} value={form.seeking} onChange={set('seeking')} placeholder="A feeling, a shift, a remembering…" />
              </label>
              <button type="submit" className="btn btn-pearl join-submit" disabled={state === 'sending'} data-cursor="hover">
                <span className="btn-label">{state === 'sending' ? 'Sending…' : 'Join the waitlist'}</span>
              </button>
              {error && <p className="join-error" role="alert">{error}</p>}
              <p className="join-fine">We'll only write when it matters. <a href={LINKS.terms}>Terms</a> · <a href={LINKS.privacy}>Privacy</a></p>
            </form>
          )}
        </Rise>
      </div>
    </section>
  )
}
