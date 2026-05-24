import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'
import './WaitlistPopup.css'

export default function WaitlistPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', role: '', intention: '',
    phone: '', instagram: '', city: '', country: '',
    container_name: '', offerings: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shown = useRef(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const show = () => {
    if (shown.current) return
    shown.current = true
    setVisible(true)
  }

  useEffect(() => {
    const entryTimer = setTimeout(show, 4000)
    const onMouseLeave = (e) => { if (e.clientY <= 5) show() }
    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      clearTimeout(entryTimer)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const close = () => {
    setClosing(true)
    setTimeout(() => { setVisible(false); setClosing(false) }, 400)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) return
    setLoading(true)
    setError('')
    try {
      if (form.role === 'Container') {
        const { error: sbError } = await supabase.from('container_applications').insert([{
          your_name: form.name,
          email: form.email,
          phone: form.phone || null,
          container_name: form.container_name || null,
          instagram: form.instagram || null,
          city: form.city || null,
          country: form.country || null,
          offerings: form.offerings || null,
          lineage: form.intention || null,
          role: 'container',
        }])
        if (sbError) throw sbError
      } else if (form.role === 'Facilitator') {
        const { error: sbError } = await supabase.from('facilitator_applications').insert([{
          your_name: form.name,
          email: form.email,
          phone: form.phone || null,
          instagram: form.instagram || null,
          city: form.city || null,
          country: form.country || null,
          offerings: form.offerings || null,
          lineage: form.intention || null,
          role: 'facilitator',
        }])
        if (sbError) throw sbError
      } else {
        const { error: sbError } = await supabase.from('waitlist').insert([{
          name: form.name,
          email: form.email,
          role: form.role,
          intention: form.intention,
        }])
        if (sbError) throw sbError
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  const isFacOrCon = form.role === 'Facilitator' || form.role === 'Container'

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
            <p className="xp-overline">The Origin — Now Forming</p>
            <h2 className="xp-heading">Step Inside</h2>

            <form className="xp-form" onSubmit={handleSubmit}>

              {/* Role selector — first */}
              <div className="xp-roles">
                {[
                  { id: 'Seeker',      symbol: '◎' },
                  { id: 'Facilitator', symbol: '◈' },
                  { id: 'Container',   symbol: '⬡' },
                ].map(({ id, symbol }) => (
                  <button key={id} type="button"
                    className={`xp-role ${form.role === id ? 'xp-role-active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, role: id }))}>
                    <span className="xp-role-symbol">{symbol}</span>
                    <span className="xp-role-name">{id}</span>
                  </button>
                ))}
              </div>

              {form.role && (
                <>
                  {/* Name + Email always show */}
                  <div className="xp-row">
                    <input className="xp-input" type="text" placeholder="Your name"
                      value={form.name} onChange={set('name')} required />
                    <input className="xp-input" type="email" placeholder="Your email"
                      value={form.email} onChange={set('email')} required />
                  </div>

                  {/* Facilitator + Container extras */}
                  {isFacOrCon && (
                    <>
                      <div className="xp-row">
                        <input className="xp-input" type="tel" placeholder="Phone (optional)"
                          value={form.phone} onChange={set('phone')} />
                        <input className="xp-input" type="text" placeholder="Instagram (optional)"
                          value={form.instagram} onChange={set('instagram')} />
                      </div>
                      <div className="xp-row">
                        <input className="xp-input" type="text" placeholder="City"
                          value={form.city} onChange={set('city')} />
                        <input className="xp-input" type="text" placeholder="Country"
                          value={form.country} onChange={set('country')} />
                      </div>
                      {form.role === 'Container' && (
                        <input className="xp-input" type="text" placeholder="Container name"
                          value={form.container_name} onChange={set('container_name')} />
                      )}
                      <textarea className="xp-input xp-textarea" rows={2}
                        placeholder={form.role === 'Container'
                          ? 'What kinds of experiences do you host?'
                          : 'What do you offer?'}
                        value={form.offerings} onChange={set('offerings')} />
                    </>
                  )}

                  {/* Intention — required, no optional label */}
                  <textarea className="xp-input xp-textarea" rows={2}
                    placeholder={
                      form.role === 'Facilitator'
                        ? 'Why do you do this work? What called you to it?'
                        : form.role === 'Container'
                        ? 'What is the spirit of your space?'
                        : 'What are you bringing, seeking, or offering?'
                    }
                    value={form.intention} onChange={set('intention')} />
                </>
              )}

              {error && <p className="xp-error">{error}</p>}

              <button className="xp-btn" type="submit"
                disabled={loading || !form.role || !form.name || !form.email}>
                <span>{loading ? 'Sending…' : 'Come as You Are'}</span>
              </button>

              {!form.role && <p className="xp-hint">Select your role to begin.</p>}
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
