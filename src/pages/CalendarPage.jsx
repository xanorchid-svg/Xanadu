import { useMemo, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { openJoin } from '../lib/joinModal'
import { FAMILIES, addDays, categoriesOf, fmtDay, inFamily, iso, timeRange, useEvents } from '../lib/events'

const WHEN = ['Coming up', 'Today', 'Tomorrow', 'This weekend', 'This week', 'This month']

/** The dates a "when" chip covers, from today. */
function windowFor(when, today) {
  const d = new Date(today + 'T12:00:00')
  const dow = (d.getDay() + 6) % 7 // Monday = 0
  switch (when) {
    case 'Today': return [today, today]
    case 'Tomorrow': return [addDays(today, 1), addDays(today, 1)]
    case 'This weekend': return dow >= 4 ? [today, addDays(today, 6 - dow)] : [addDays(today, 4 - dow), addDays(today, 6 - dow)]
    case 'This week': return [today, addDays(today, 6 - dow)]
    case 'This month': { const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 12); return [today, iso(end)] }
    default: return [today, '9999-12-31']
  }
}

/** A short list of an event's types, for its card. */
const typesOf = (e) => [...categoriesOf(e)].slice(0, 2)

export function EventCard({ e }) {
  const verified = !!(e.space_id || e.facilitator_id)
  return (
    <a href={`/event/${e.id}`} className="cal-card" data-cursor="hover">
      <div className="cal-thumb">
        {e.photo_url ? <img src={e.photo_url} alt="" loading="lazy" decoding="async" /> : <span aria-hidden="true">✦</span>}
      </div>
      <div className="cal-card-body">
        <p className="cal-time">{timeRange(e) || 'Time to be confirmed'}{e.end_date && e.end_date !== e.start_date ? ` · until ${fmtDay(e.end_date, { month: 'short', day: 'numeric' })}` : ''}</p>
        <h3 className="cal-title">{e.title}</h3>
        <p className="cal-where">{[e.venue, e.town].filter(Boolean).join(' · ')}</p>
        <p className="cal-meta">
          {e.price_note && <span>{e.price_note}</span>}
          {typesOf(e).map((t) => <span key={t} className="cal-tag">{t}</span>)}
          {verified && <span className="cal-tag is-verified">Verified host ✦</span>}
        </p>
      </div>
    </a>
  )
}

export default function CalendarPage() {
  const today = useMemo(() => iso(new Date()), [])
  const { events, loading, failed } = useEvents()
  const [when, setWhen] = useState('Coming up')
  const [family, setFamily] = useState('')
  const [q, setQ] = useState('')

  const days = useMemo(() => {
    const [a, b] = windowFor(when, today)
    const words = q.trim().toLowerCase()
    const shown = events.filter((e) => {
      if (!e.start_date) return when === 'Coming up'
      if (e.start_date > b || (e.end_date || e.start_date) < a) return false
      if (family && !inFamily(e, family)) return false
      if (words && !`${e.title} ${e.description} ${e.venue} ${e.town} ${(e.tags ?? []).join(' ')}`.toLowerCase().includes(words)) return false
      return true
    })
    // each event sits under its own day, or the first day of the window if it began earlier (a retreat already running)
    const by = new Map()
    for (const e of shown) {
      const k = !e.start_date ? 'tbc' : e.start_date < a ? a : e.start_date
      if (!by.has(k)) by.set(k, [])
      by.get(k).push(e)
    }
    return [...by.entries()].sort(([x], [y]) => x.localeCompare(y))
  }, [events, when, family, q, today])

  const label = (k) => k === 'tbc' ? 'Date to be confirmed' : k === today ? `Today · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : k === addDays(today, 1) ? `Tomorrow · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : fmtDay(k)
  const count = days.reduce((n, [, l]) => n + l.length, 0)

  return (
    <Shell>
      <article className="cal">
        <header className="cal-hero">
          <a href="/" className="deep-back" data-cursor="hover">← Back to Xanadu</a>
          <p className="eyebrow center">The Nosara calendar</p>
          <Reveal as="h1" className="display center">What’s <Shimmer>on</Shimmer></Reveal>
          <Rise as="p" className="lede center deep-lede" delay={0.2}>
            Yoga, breathwork, sound, circles, dance and gatherings around Nosara, Costa Rica. Open to everyone. No account needed.
          </Rise>
        </header>

        <div className="cal-controls">
          <div className="cal-row" role="group" aria-label="When">
            {WHEN.map((w) => (
              <button key={w} type="button" className={`cal-chip ${when === w ? 'is-on' : ''}`} aria-pressed={when === w} onClick={() => setWhen(w)}>{w}</button>
            ))}
          </div>
          <div className="cal-row" role="group" aria-label="Type">
            <button type="button" className={`cal-chip ${!family ? 'is-on' : ''}`} aria-pressed={!family} onClick={() => setFamily('')}>Everything</button>
            {FAMILIES.map((f) => (
              <button key={f.label} type="button" className={`cal-chip ${family === f.label ? 'is-on' : ''}`} aria-pressed={family === f.label} onClick={() => setFamily(family === f.label ? '' : f.label)}>{f.label}</button>
            ))}
          </div>
          <label className="cal-search">
            <span className="sr-only">Search events</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: cacao, ecstatic dance, Guiones…" />
          </label>
        </div>

        <div className="cal-list" aria-live="polite">
          {loading && <p className="cal-empty">Loading what’s on…</p>}
          {!loading && failed && <p className="cal-empty">The calendar didn’t load. Please refresh the page.</p>}
          {!loading && !failed && count === 0 && (
            <div className="cal-empty">
              <p>Nothing matches yet.</p>
              <button type="button" className="cal-chip" onClick={() => { setWhen('Coming up'); setFamily(''); setQ('') }}>Show everything coming up</button>
            </div>
          )}
          {days.map(([k, list]) => (
            <section key={k} className="cal-day">
              <h2 className="cal-day-h">{label(k)}</h2>
              <div className="cal-cards">{list.map((e) => <EventCard key={e.id} e={e} />)}</div>
            </section>
          ))}
        </div>

        <CalendarJoin />
      </article>
    </Shell>
  )
}

/** The way in: everything beyond browsing is for members. */
export function CalendarJoin() {
  return (
    <section className="cal-join">
      <Reveal as="h2" className="display center">See who’s <Shimmer>going</Shimmer>.</Reveal>
      <Rise as="p" className="lede center deep-lede" delay={0.15}>
        Join Xanadu free to say you’re going, see who else is, message the community and find sessions like bodywork and guidance.
      </Rise>
      <Rise className="closing-actions" delay={0.25}>
        <Button onClick={openJoin} aria-haspopup="dialog">Join Xanadu free</Button>
        <Button href="/apply/facilitator" variant="ghost">Host events with us</Button>
      </Rise>
    </section>
  )
}
