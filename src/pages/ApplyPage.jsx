import { useEffect, useRef, useState } from 'react'
import Shell from '../components/Shell'
import Emblem from '../components/Emblem'
import { Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'
import {
  applicantEmail, applicantGoogle, applicantSignIn, applicantSignOut, currentApplicant,
  finishApplicantReturn, readWebsite, sendApplication,
} from '../lib/account'
import { getLenis } from '../lib/scroll'

// The same words the app stores, so the team console and matching read them the same way.
// Plant medicine and Recovery programs are paused for launch.
const PRACTICES = ['Yoga', 'Breathwork', 'Meditation', 'Sound', 'Ecstatic dance', 'Kirtan', "Women's", "Men's", 'Residencies']
const STAYS = ['A class or session', 'Weekly or monthly sessions', 'A weekend', '1–3 weeks', 'A month or more', 'A season', 'Community living']
const LANDSCAPES = ['Beach', 'Ocean', 'Jungle', 'Mountains', 'Desert', 'Forest', 'Countryside', 'Town', 'City']
const HEARD = ['Friend or family', 'Instagram', 'Facebook', 'Google', 'TikTok', 'Other']

const COPY = {
  container: {
    eyebrow: 'Founding Containers',
    title: <>Apply to hold a space <Shimmer>in Xanadu</Shimmer></>,
    lede: 'Founding Containers join free. Every space is personally reviewed before it joins, and we’ll notify you once we review your application.',
    steps: ['Your account', 'Your space', 'The spirit', 'Details', 'Trust'],
  },
  facilitator: {
    eyebrow: 'Founding Facilitators',
    title: <>Apply to guide <Shimmer>with Xanadu</Shimmer></>,
    lede: 'Founding Facilitators join free. Every guide is personally reviewed before joining, and we’ll notify you once we review your application.',
    steps: ['Your account', 'You', 'Your practice', 'Training', 'Trust'],
  },
}

const EMPTY = {
  name: '', space_name: '', country: '', region: '', town: '', phone: '', heard: '', heard_other: '',
  space_about: '', about: '', practices: [], lifestyle: [], volunteer_exchange: false, volunteer_details: '',
  sleeps: '', mats: '', rooms: '', kitchen: '', getting_here: '', links: '', languages: '',
  trainings: [{ title: '', school: '', year: '' }], references: [{ name: '', contact: '' }], insurance: '', proof: '', agreed: false,
  photos_found: [], photos: [],
}

// answers are kept on this device while they apply (survives a confirmation email or a closed tab)
const draftKey = (role) => `xanadu_apply_${role}`
const loadDraft = (role) => { try { return JSON.parse(localStorage.getItem(draftKey(role)) || 'null') } catch { return null } }
const saveDraft = (role, f) => { try { localStorage.setItem(draftKey(role), JSON.stringify(f)) } catch { /* private mode */ } }
const clearDraft = (role) => { try { localStorage.removeItem(draftKey(role)) } catch { /* ignore */ } }

function Chips({ options, value, onChange }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])
  return (
    <div className="apply-chips">
      {options.map((o) => (
        <button type="button" key={o} className={`apply-chip ${value.includes(o) ? 'is-on' : ''}`} aria-pressed={value.includes(o)} onClick={() => toggle(o)}>{o}</button>
      ))}
    </div>
  )
}

function Field({ label, optional, children }) {
  return (
    <label className="field">
      <span>{label}{optional && <small>optional</small>}</span>
      {children}
    </label>
  )
}

function Group({ label, sub, children }) {
  return (
    <div className="field">
      <span>{label}</span>
      {sub && <p className="apply-sub">{sub}</p>}
      {children}
    </div>
  )
}

const merge = (a, b) => [...new Set([...(a || []), ...(b || [])])]
const has = (v) => typeof v === 'string' ? v.trim().length > 0 : v != null

/** Put what the AI found into the form: it fills empty fields and adds to choices, never wipes what they typed. */
function applyFound(role, f, found, url) {
  const x = found.fields || {}
  const keep = (cur, v) => (has(cur) && String(cur).trim() ? cur : (has(v) ? String(v).trim() : cur))
  if (role === 'container') {
    const lifestyle = merge(f.lifestyle, [...(x.takes_part || []), ...(x.landscapes || []), ...(x.remote_work ? ['Work remotely'] : [])])
    return {
      ...f,
      space_name: keep(f.space_name, x.name), country: keep(f.country, x.country), region: keep(f.region, x.region), town: keep(f.town, x.town),
      space_about: keep(f.space_about, x.about), practices: merge(f.practices, x.practices), lifestyle,
      sleeps: keep(f.sleeps, x.sleeps), rooms: keep(f.rooms, x.rooms), mats: keep(f.mats, x.mats), kitchen: keep(f.kitchen, x.kitchen),
      getting_here: keep(f.getting_here, x.getting_here),
      volunteer_exchange: f.volunteer_exchange || !!x.volunteer_exchange, volunteer_details: keep(f.volunteer_details, x.volunteer_details),
      links: f.links || url, photos_found: found.photos || [], photos: found.photos || [],
    }
  }
  const trainings = (x.trainings || []).filter((t) => has(t?.title)).map((t) => ({ title: t.title, school: t.school || '', year: t.year || '' }))
  const mine = f.trainings.filter((t) => t.title.trim())
  return {
    ...f,
    name: keep(f.name, x.name), town: keep(f.town, x.town), about: keep(f.about, x.about), practices: merge(f.practices, x.practices),
    languages: keep(f.languages, x.languages), links: f.links || url,
    trainings: mine.length ? f.trainings : (trainings.length ? trainings.slice(0, 10) : f.trainings),
  }
}

/** /apply/container and /apply/facilitator: account first, then the application, on the website. */
export default function ApplyPage({ role }) {
  const c = COPY[role]
  const [step, setStep] = useState(0)
  const [f, setF] = useState(() => ({ ...EMPTY, ...(loadDraft(role) ?? {}) }))
  const [who, setWho] = useState(null) // the signed-in applicant { email, name }
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [sentTo, setSentTo] = useState('') // waiting on their confirmation email
  const [mode, setMode] = useState('new') // new | existing (email accounts)
  const [acct, setAcct] = useState({ email: '', password: '' })
  const [site, setSite] = useState({ url: '', state: 'idle', note: '' }) // idle | reading | filled
  const top = useRef(null)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v?.target ? (v.target.type === 'checkbox' ? v.target.checked : v.target.value) : v }))

  useEffect(() => { if (!done) saveDraft(role, f) }, [role, f, done])

  // signed in already (back from Google or their confirmation email, or earlier today): go straight to the application
  useEffect(() => {
    finishApplicantReturn()
      .then((u) => {
        setWho(u)
        if (u) {
          setF((s) => ({ ...s, name: s.name || u.name || '' }))
          setStep((n) => (n === 0 ? 1 : n))
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setChecking(false))
  }, [])

  const scrollUp = () => {
    const el = top.current
    if (!el) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: -100 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  useEffect(scrollUp, [step, done, sentTo])

  const check = (n) => {
    const t = (v) => v.trim().length > 0
    if (n === 0 && !who) return 'Please create your account or sign in first.'
    if (role === 'container') {
      if (n === 1 && (!t(f.name) || !t(f.space_name) || !t(f.country) || !t(f.town))) return 'Please add your name, your space’s name, country and town.'
      if (n === 1 && !f.heard) return 'Please tell us where you heard about Xanadu.'
      if (n === 2 && !t(f.space_about)) return 'Please describe your space in a few sentences.'
      if (n === 4 && !t(f.proof)) return 'Please share reviews or referrals so we can welcome you.'
    } else {
      if (n === 1 && (!t(f.name) || !t(f.town))) return 'Please add your name and where you’re based.'
      if (n === 1 && !f.heard) return 'Please tell us where you heard about Xanadu.'
      if (n === 2 && (!f.practices.length || !t(f.about))) return 'Please choose your practices and write a few words about your work.'
      if (n === 4 && !f.references.some((r) => t(r.name) && t(r.contact))) return 'Please add at least one reference.'
    }
    if (n === 4 && !f.agreed) return 'Please agree to the community guidelines.'
    return ''
  }
  const next = () => { const e = check(step); setError(e); if (!e) setStep(step + 1) }
  const prev = () => { setError(''); setStep(step - 1) }

  /* ----- account ----- */
  const google = async () => {
    setBusy(true); setError('')
    try { await applicantGoogle(role) } // the page leaves for Google here
    catch (e) { setError(e.message); setBusy(false) }
  }
  const emailAccount = async (e) => {
    e.preventDefault()
    if (!acct.email.trim() || !acct.password) { setError('Please enter your email and a password.'); return }
    setBusy(true); setError('')
    try {
      const r = mode === 'existing' ? await applicantSignIn(acct) : await applicantEmail({ role, ...acct })
      if (r === 'check-email') { setSentTo(acct.email.trim()); setBusy(false); return }
      const u = await currentApplicant()
      setWho(u); setF((s) => ({ ...s, name: s.name || u?.name || '' })); setStep(1)
    } catch (err) {
      if (err.code === 'exists') setMode('existing')
      setError(err.message)
    }
    setBusy(false)
  }
  const switchAccount = async () => { await applicantSignOut(); setWho(null); setStep(0); setError('') }

  /* ----- AI reads their website ----- */
  const fill = async () => {
    if (!site.url.trim()) { setError('Paste your website address first.'); return }
    setError(''); setSite((s) => ({ ...s, state: 'reading', note: '' }))
    try {
      const found = await readWebsite(role === 'container' ? 'space' : 'facilitator', site.url)
      setF((s) => applyFound(role, s, found, site.url.trim()))
      setSite((s) => ({ ...s, state: 'filled', note: found.notes || '' }))
    } catch (e) {
      setSite((s) => ({ ...s, state: 'idle' })); setError(e.message)
    }
  }

  /* ----- send ----- */
  const app = () => {
    const heard = f.heard === 'Other' ? (f.heard_other.trim() ? `Other: ${f.heard_other.trim().slice(0, 120)}` : 'Other') : f.heard
    const base = { name: f.name, town: f.town, region: f.region, heard_from: heard, practices: f.practices, phone: f.phone, links: f.links, proof: f.proof }
    return role === 'container'
      ? { ...base, space_name: f.space_name, country: f.country, space_about: f.space_about, lifestyle: f.lifestyle, volunteer_exchange: f.volunteer_exchange,
          volunteer_details: f.volunteer_exchange ? f.volunteer_details : '', sleeps: f.sleeps, mats: f.mats, rooms: f.rooms, kitchen: f.kitchen, getting_here: f.getting_here }
      : { ...base, about: f.about, languages: f.languages, insurance: f.insurance,
          trainings: f.trainings.filter((t) => t.title.trim()), references: f.references.filter((r) => r.name.trim() && r.contact.trim()) }
  }
  const send = async () => {
    for (let n = 0; n <= 4; n++) { const m = check(n); if (m) { setError(m); setStep(n); return } }
    setBusy(true); setError('')
    try {
      await sendApplication(role, app(), role === 'container' ? f.photos : [])
      clearDraft(role); setDone(true)
    } catch (e) {
      if (e.code === 'signed-out') { setWho(null); setStep(0) }
      setError(e.message)
    }
    setBusy(false)
  }

  const list = (k, i, key) => (e) => setF((s) => ({ ...s, [k]: s[k].map((x, j) => (j === i ? { ...x, [key]: e.target.value } : x)) }))
  const last = step === c.steps.length - 1
  const togglePhoto = (p) => set('photos')(f.photos.includes(p) ? f.photos.filter((x) => x !== p) : [...f.photos, p])

  const aiCard = (
    <div className="apply-ai">
      <p className="apply-ai-title">Have a website? <Shimmer>Let Xanadu fill this in.</Shimmer></p>
      <p className="apply-sub">Our AI reads your website and fills in your application. You check every step and add anything it missed.</p>
      <div className="apply-ai-row">
        <input value={site.url} onChange={(e) => setSite({ ...site, url: e.target.value })} placeholder="yourwebsite.com" inputMode="url" autoComplete="url" aria-label="Your website" />
        <button type="button" className="btn btn-pearl" onClick={fill} disabled={site.state === 'reading'}>
          <span className="btn-label">{site.state === 'reading' ? 'Reading…' : 'Fill it in'}</span>
        </button>
      </div>
      {site.state === 'reading' && <p className="apply-note">Reading your website. This takes about 20 seconds.</p>}
      {site.state === 'filled' && (
        <p className="apply-ai-done" role="status">Filled in from your website. Please check each step and add anything missing.{site.note ? ` ${site.note}` : ''}</p>
      )}
      <p className="apply-note">Instagram and Facebook pages can’t be read; your own website works best.</p>
    </div>
  )

  return (
    <Shell>
      <article className="deep apply">
        <header className="deep-hero apply-hero">
          <div className="deep-emblem" aria-hidden="true"><Emblem electrons /></div>
          <a href="/" className="deep-back" data-cursor="hover">← Back to Xanadu</a>
          <p className="eyebrow center">{c.eyebrow}</p>
          <h1 className="display center">{c.title}</h1>
          <p className="lede center deep-lede">{c.lede}</p>
        </header>

        <div className="wrap apply-wrap" ref={top}>
          <div className="join-card iri-border apply-card">
            {done ? (
              <div className="join-done" role="status">
                <div className="join-done-mark"><Emblem electrons /></div>
                <p className="display small">Thank you for <Shimmer>applying</Shimmer>.</p>
                <p className="body">We’ve received your application. We’ll notify you once we review it. Thank you for joining the Xanadu dream.</p>
                <a href="/" className="btn btn-ghost apply-home"><span className="btn-label">Return to Xanadu</span></a>
              </div>
            ) : sentTo ? (
              <div className="join-done" role="status">
                <div className="join-done-mark"><Emblem electrons /></div>
                <p className="display small">Check your <Shimmer>email</Shimmer>.</p>
                <p className="body">We sent a link to {sentTo}. Tap it to confirm your account, and it will bring you right back here to fill in your application.</p>
                <button type="button" className="btn btn-ghost apply-home" onClick={() => { setSentTo(''); setMode('existing') }}><span className="btn-label">I’ve confirmed, sign in</span></button>
              </div>
            ) : (
              <form className="join-form" onSubmit={(e) => { e.preventDefault(); if (step === 0) { if (who) next(); return } if (last) send(); else next() }} noValidate>
                <div className="apply-progress" aria-hidden="true">{c.steps.map((s, i) => <i key={s} className={i <= step ? 'is-on' : ''} />)}</div>
                <p className="apply-step">Step {step + 1} of {c.steps.length} · {c.steps[step]}</p>

                {step === 0 && (checking ? <p className="apply-sub">One moment…</p> : who ? (
                  <>
                    <p className="apply-sub">You’re signed in as <b className="apply-me">{who.email}</b>.</p>
                    <button type="button" className="apply-switch" onClick={switchAccount}>Use a different account</button>
                  </>
                ) : (
                  <>
                    <p className="apply-sub">Start by creating your Xanadu account. You’ll use it when Xanadu opens.</p>
                    <button type="button" className="btn-google" onClick={google} disabled={busy} data-cursor="hover">
                      <GoogleMark />
                      <span>{busy ? 'One moment…' : 'Continue with Google'}</span>
                    </button>
                    <p className="join-or" aria-hidden="true"><span>or with email</span></p>
                    <Field label="Your email"><input type="email" autoComplete="email" value={acct.email} onChange={(e) => setAcct({ ...acct, email: e.target.value })} placeholder="you@example.com" /></Field>
                    <Field label={mode === 'existing' ? 'Your password' : 'Create a password'}>
                      <input type="password" minLength={8} autoComplete={mode === 'existing' ? 'current-password' : 'new-password'} value={acct.password}
                        onChange={(e) => setAcct({ ...acct, password: e.target.value })} placeholder={mode === 'existing' ? 'Your Xanadu password' : 'At least 8 characters'}
                        onKeyDown={(e) => { if (e.key === 'Enter') emailAccount(e) }} />
                    </Field>
                    <button type="button" className="btn btn-ghost" onClick={emailAccount} disabled={busy}>
                      <span className="btn-label">{busy ? 'One moment…' : mode === 'existing' ? 'Sign in' : 'Create my account'}</span>
                    </button>
                    <button type="button" className="apply-switch" onClick={() => { setMode(mode === 'new' ? 'existing' : 'new'); setError('') }}>
                      {mode === 'new' ? 'I already have a Xanadu account' : 'I’m new: create an account'}
                    </button>
                  </>
                ))}

                {role === 'container' && step === 1 && (
                  <>
                    {aiCard}
                    <Field label="Your name"><input value={f.name} onChange={set('name')} autoComplete="name" placeholder="Full name" /></Field>
                    <Field label="Your space’s name"><input value={f.space_name} onChange={set('space_name')} placeholder="e.g. Casa Luna" /></Field>
                    <div className="apply-row">
                      <Field label="Country"><input value={f.country} onChange={set('country')} autoComplete="country-name" placeholder="e.g. Costa Rica" /></Field>
                      <Field label="State, province or island" optional><input value={f.region} onChange={set('region')} placeholder="e.g. Guanacaste" /></Field>
                    </div>
                    <Field label="Town"><input value={f.town} onChange={set('town')} placeholder="e.g. Nosara" /></Field>
                    <Field label="Phone, for your intro call" optional><input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="Private to the Xanadu team" /></Field>
                    <Heard f={f} set={set} />
                  </>
                )}
                {role === 'container' && step === 2 && (
                  <>
                    <Field label="About your space"><textarea rows={6} value={f.space_about} onChange={set('space_about')} placeholder="The land, the spirit of the place and who it’s for." /></Field>
                    <Group label="Practices you host"><Chips options={PRACTICES} value={f.practices} onChange={set('practices')} /></Group>
                    <Group label="What you welcome" sub="From drop-in classes to people who live here. Pick all that fit."><Chips options={STAYS} value={f.lifestyle} onChange={set('lifestyle')} /></Group>
                    <Group label="Your landscape" sub="What surrounds your space."><Chips options={LANDSCAPES} value={f.lifestyle} onChange={set('lifestyle')} /></Group>
                    <Group label="Good for remote work?"><Chips options={['Work remotely']} value={f.lifestyle} onChange={set('lifestyle')} /></Group>
                    <label className="apply-check">
                      <input type="checkbox" checked={f.volunteer_exchange} onChange={set('volunteer_exchange')} />
                      <span>We welcome volunteer exchange (work in exchange for a stay)</span>
                    </label>
                    {f.volunteer_exchange && <Field label="What volunteers help with" optional><textarea rows={3} value={f.volunteer_details} onChange={set('volunteer_details')} placeholder="e.g. Garden and kitchen, 4 hours a day, in exchange for a bed and meals" /></Field>}
                  </>
                )}
                {role === 'container' && step === 3 && (
                  <>
                    {f.photos_found.length > 0 && (
                      <Group label="Photos from your website" sub="Tap to choose which ones join your application.">
                        <div className="apply-photos">
                          {f.photos_found.map((p) => (
                            <button type="button" key={p} className={`apply-photo ${f.photos.includes(p) ? 'is-on' : ''}`} aria-pressed={f.photos.includes(p)} onClick={() => togglePhoto(p)}>
                              <img src={p} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
                              <i aria-hidden="true">✓</i>
                            </button>
                          ))}
                        </div>
                      </Group>
                    )}
                    <div className="apply-row">
                      <Field label="Sleeps" optional><input value={f.sleeps} onChange={set('sleeps')} placeholder="e.g. 16" /></Field>
                      <Field label="Practice space holds" optional><input value={f.mats} onChange={set('mats')} placeholder="e.g. 20 mats" /></Field>
                    </div>
                    <Field label="Room types" optional><input value={f.rooms} onChange={set('rooms')} placeholder="e.g. Private rooms and shared dorms" /></Field>
                    <Field label="Kitchen and meals" optional><input value={f.kitchen} onChange={set('kitchen')} placeholder="e.g. Plant-based, on-site chef" /></Field>
                    <Field label="Getting here" optional><input value={f.getting_here} onChange={set('getting_here')} placeholder="e.g. 5 min walk to the beach" /></Field>
                    <Field label="Website or Instagram" optional><input value={f.links} onChange={set('links')} placeholder="So we can see your space" /></Field>
                  </>
                )}

                {role === 'facilitator' && step === 1 && (
                  <>
                    {aiCard}
                    <Field label="Your name"><input value={f.name} onChange={set('name')} autoComplete="name" placeholder="Full name" /></Field>
                    <Field label="Where you’re based"><input value={f.town} onChange={set('town')} placeholder="e.g. Ubud, Bali" /></Field>
                    <Field label="Phone" optional><input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="Private to the Xanadu team" /></Field>
                    <Heard f={f} set={set} />
                  </>
                )}
                {role === 'facilitator' && step === 2 && (
                  <>
                    <Group label="What you offer"><Chips options={PRACTICES.filter((p) => p !== 'Residencies')} value={f.practices} onChange={set('practices')} /></Group>
                    <Field label="Languages" optional><input value={f.languages} onChange={set('languages')} placeholder="e.g. English, Español" /></Field>
                    <Field label="About you"><textarea rows={6} value={f.about} onChange={set('about')} placeholder="How you came to this work and what people can expect when they sit with you." /></Field>
                    <Field label="Website or Instagram" optional><input value={f.links} onChange={set('links')} placeholder="So we can see your work" /></Field>
                  </>
                )}
                {role === 'facilitator' && step === 3 && (
                  <>
                    <p className="apply-sub">Add what you’ve trained in. You can add more later.</p>
                    {f.trainings.map((t, i) => (
                      <div key={i} className="apply-box">
                        <div className="apply-box-head"><span>Training {i + 1}</span>
                          {f.trainings.length > 1 && <button type="button" onClick={() => set('trainings')(f.trainings.filter((_, j) => j !== i))}>Remove</button>}</div>
                        <Field label="Certification or training"><input value={t.title} onChange={list('trainings', i, 'title')} /></Field>
                        <div className="apply-row apply-row-year">
                          <Field label="School"><input value={t.school} onChange={list('trainings', i, 'school')} /></Field>
                          <Field label="Year"><input value={t.year} onChange={list('trainings', i, 'year')} inputMode="numeric" /></Field>
                        </div>
                      </div>
                    ))}
                    {f.trainings.length < 10 && <button type="button" className="apply-add" onClick={() => set('trainings')([...f.trainings, { title: '', school: '', year: '' }])}>+ Add another training</button>}
                  </>
                )}

                {step === 4 && (
                  <>
                    <p className="apply-sub">Every member is welcomed personally. This stays private to the Xanadu team.</p>
                    {role === 'container' ? (
                      <Field label="Reviews or referrals (links welcome)"><textarea rows={4} value={f.proof} onChange={set('proof')} placeholder="e.g. Google or Airbnb reviews, or people who can speak to your space" /></Field>
                    ) : (
                      <>
                        {f.references.map((r, i) => (
                          <div key={i} className="apply-box">
                            <div className="apply-box-head"><span>Reference {i + 1}</span>
                              {f.references.length > 1 && <button type="button" onClick={() => set('references')(f.references.filter((_, j) => j !== i))}>Remove</button>}</div>
                            <Field label="Name"><input value={r.name} onChange={list('references', i, 'name')} /></Field>
                            <Field label="Email or phone"><input value={r.contact} onChange={list('references', i, 'contact')} /></Field>
                          </div>
                        ))}
                        {f.references.length < 3 && <button type="button" className="apply-add" onClick={() => set('references')([...f.references, { name: '', contact: '' }])}>+ Add reference ({f.references.length} of 3)</button>}
                        <Field label="Insurance" optional><input value={f.insurance} onChange={set('insurance')} placeholder="Provider and policy, if you have it" /></Field>
                      </>
                    )}
                    <label className="apply-check">
                      <input type="checkbox" checked={f.agreed} onChange={set('agreed')} />
                      <span>I agree to hold space with care and honesty, to make no medical or guaranteed-outcome claims, and to keep everyone safe, including people in altered states.</span>
                    </label>
                    <p className="apply-note">We use AI to help review applications; a person makes every decision.</p>
                  </>
                )}

                {error && <p className="join-error" role="alert">{error}</p>}

                {(step > 0 || who) && (
                  <div className="apply-nav">
                    {step > 1 && <button type="button" className="btn btn-ghost" onClick={prev} disabled={busy}><span className="btn-label">Back</span></button>}
                    <button type="submit" className="btn btn-pearl" disabled={busy} data-cursor="hover">
                      <span className="btn-label">{last ? (busy ? 'Sending…' : 'Send my application') : 'Continue'}</span>
                    </button>
                  </div>
                )}
                {(step === 0 || last) && <p className="join-fine">By applying you agree to the <a href={LINKS.terms}>Terms</a> and <a href={LINKS.privacy}>Privacy Policy</a>.</p>}
              </form>
            )}
          </div>
        </div>
      </article>
    </Shell>
  )
}

function Heard({ f, set }) {
  return (
    <Group label="Where did you hear about Xanadu?">
      <div className="apply-chips">
        {HEARD.map((o) => (
          <button type="button" key={o} className={`apply-chip ${f.heard === o ? 'is-on' : ''}`} aria-pressed={f.heard === o} onClick={() => set('heard')(f.heard === o ? '' : o)}>{o}</button>
        ))}
      </div>
      {f.heard === 'Other' && <input value={f.heard_other} onChange={set('heard_other')} placeholder="Tell us where" aria-label="Where you heard about Xanadu" />}
    </Group>
  )
}

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
    <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
  </svg>
)
