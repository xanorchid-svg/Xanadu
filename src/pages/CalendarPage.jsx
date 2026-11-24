import { lazy, Suspense, useMemo, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { openJoin } from '../lib/joinModal'
import { FAMILIES, addDays, categoriesOf, fmtDay, inFamily, iso, timeRange, useEvents } from '../lib/events'
import { spotKey, spotOf } from '../lib/places'

const EventMap = lazy(() => import('../components/EventMap'))

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
  const [picked, setPicked] = useState(null)

  const shown = useMemo(() => {
    const [a, b] = windowFor(when, today)
    const words = q.trim().toLowerCase()
    return events.filter((e) => {
      if (!e.start_date) return when === 'Coming up'
      if (e.start_date > b || (e.end_date || e.start_date) < a) return false
      if (family && !inFamily(e, family)) return false
      if (words && !`${e.title} ${e.description} ${e.venue} ${e.town} ${(e.tags ?? []).join(' ')}`.toLowerCase().includes(words)) return false
      return true
    })
  }, [events, when, family, q, today])

  // one pin per place; tapping a pin narrows the list to what's on there
  const pins = useMemo(() => {
    const by = new Map()
    for (const e of shown) {
      const s = spotOf(e)
      if (!s) continue
      const k = spotKey(s)
      const p = by.get(k) ?? { key: k, spot: s, count: 0, title: '' }
      p.count += 1
      p.title = p.count > 1 ? `${p.count} events · ${s.exact ? e.venue || s.label : s.label}` : `${e.title} · ${e.venue || s.label}`
      by.set(k, p)
    }
    return [...by.values()]
  }, [shown])
  const pin = pins.find((p) => p.key === picked)

  const days = useMemo(() => {
    const [a] = windowFor(when, today)
    const list = pin ? shown.filter((e) => { const s = spotOf(e); return s && spotKey(s) === pin.key }) : shown
    // each event sits under its own day, or the first day of the window if it began earlier (a retreat already running)
    const by = new Map()
    for (const e of list) {
      const k = !e.start_date ? 'tbc' : e.start_date < a ? a : e.start_date
      if (!by.has(k)) by.set(k, [])
      by.get(k).push(e)
    }
    return [...by.entries()].sort(([x], [y]) => x.localeCompare(y))
  }, [shown, pin, when, today])

  const label = (k) => k === 'tbc' ? 'Date to be confirmed' : k === today ? `Today · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : k === addDays(today, 1) ? `Tomorrow · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : fmtDay(k)
  const count = days.reduce((n, [, l]) => n + l.length, 0)

  return (
    <Shell>
      <article className="cal">
        <header className="cal-hero">
          <a href="/" className="deep-back" data-cursor="hover">← Back to Xanadu</a>
          <Reveal as="h1" className="display center"><Shimmer>Events</Shimmer></Reveal>
          <Rise as="p" className="cal-sub center" delay={0.2}>weaving your xanadu one event at a time</Rise>
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

        <div className="cal-mapwrap">
          <Suspense fallback={<div className="xmap" />}>
            <EventMap pins={pins} picked={picked} onPick={setPicked} />
          </Suspense>
          {pin && (
            <p className="cal-picked">
              <span>Showing {pin.count === 1 ? 'the event' : `${pin.count} events`} at <b>{pin.spot.exact ? (pin.title.split(' · ').slice(1).join(' · ') || pin.spot.label) : pin.spot.label}</b></span>
              <button type="button" className="cal-chip" onClick={() => setPicked(null)}>Show all</button>
            </p>
          )}
        </div>

        <div className="cal-list" aria-live="polite">
          {loading && <p className="cal-empty">Loading what’s on…</p>}
          {!loading && failed && <p className="cal-empty">The calendar didn’t load. Please refresh the page.</p>}
          {!loading && !failed && count === 0 && (
            <div className="cal-empty">
              <p>Nothing matches yet.</p>
              <button type="button" className="cal-chip" onClick={() => { setWhen('Coming up'); setFamily(''); setQ(''); setPicked(null) }}>Show everything coming up</button>
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
