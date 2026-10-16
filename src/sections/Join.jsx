import { useState } from 'react'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import { useStay, describeStay } from '../lib/stay'
import { joinWaitlist } from '../lib/waitlist'
import { scrollToTarget } from '../lib/scroll'

export default function Join() {
  const stay = useStay()
  const [form, setForm] = useState({ name: '', email: '', seeking: '' })
  const [state, setState] = useState('idle') // idle | sending | done | error
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const stayText = describeStay(stay)

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    const intention = [stayText && `Stay: ${stayText}`, form.seeking.trim()].filter(Boolean).join('\n\n')
    try {
      await joinWaitlist({ name: form.name, email: form.email, intention })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="join" className="join">
      <div className="wrap join-grid">
        <div className="join-copy">
          <p className="eyebrow">The waitlist</p>
          <Reveal className="display">Be first through <Shimmer>the door</Shimmer>.</Reveal>
          <Rise as="p" className="body">
            Seekers enter when the founding circle is complete. Leave your name and the stay you dream of, and we'll write to you when the doors open.
          </Rise>
          <Rise as="p" className="join-hosts" delay={0.15}>
            Hold a space or guide others? <a className="text-link" href={LINKS.container}>Apply as a Container</a> or <a className="text-link" href={LINKS.facilitator}>a Facilitator</a>.
          </Rise>
        </div>

        <Rise className="join-card iri-border" delay={0.1}>
          {state === 'done' ? (
            <div className="join-done" role="status">
              <div className="join-done-mark"><Emblem electrons /></div>
              <p className="display small">You have been <Shimmer>received</Shimmer>.</p>
              <p className="body">We will be in touch when the doors open. Come as you are.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="join-form">
              <label className="field">
                <span>Your name</span>
                <input required autoComplete="name" value={form.name} onChange={set('name')} placeholder="Full name" />
              </label>
              <label className="field">
                <span>Your email</span>
                <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
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
              {state === 'error' && (
                <p className="join-error" role="alert">Something went wrong. Please try again, or write to us at networkxanadu@gmail.com.</p>
              )}
              <p className="join-fine">We'll only write when it matters. <a href={LINKS.privacy}>Privacy</a></p>
            </form>
          )}
        </Rise>
      </div>
    </section>
  )
}
