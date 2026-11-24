import { lazy, Suspense, useMemo, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { openJoin } from '../lib/joinModal'
import Dropdown from '../components/Dropdown'
import { FAMILIES, addDays, categoriesOf, classesBetween, contactLink, fmtDay, iso, timeRange, useEvents, useStudioClasses } from '../lib/events'
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
  const studioClasses = useStudioClasses()
  const [when, setWhen] = useState('Coming up')
  const [types, setTypes] = useState([])
  const [view, setView] = useState('List')
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)

  const shown = useMemo(() => {
    const [a, b] = windowFor(when, today)
    const words = q.trim().toLowerCase()
    return events.filter((e) => {
      if (!e.start_date) return when === 'Coming up'
      if (e.start_date > b || (e.end_date || e.start_date) < a) return false
      if (types.length) { const mine = categoriesOf(e); if (!types.some((t) => mine.has(t))) return false }
      if (words && !`${e.title} ${e.description} ${e.venue} ${e.town} ${(e.tags ?? []).join(' ')}`.toLowerCase().includes(words)) return false
      return true
    })
  }, [events, when, types, q, today])

  // one pin per place; tapping a pin narrows the list to what's on there
  const pins = useMemo(() => {
    const by = new Map()
    for (const e of shown) {
      const s = spotOf(e)
      if (!s) continue
      const k = spotKey(s)
      const p = by.get(k) ?? { key: k, spot: s, count: 0, title: '' }
      p.count += 1
      p.title = p.count > 1 ? `${p.count} rituals · ${s.exact ? e.venue || s.label : s.label}` : `${e.title} · ${e.venue || s.label}`
      by.set(k, p)
    }
    return [...by.values()]
  }, [shown])
  const pin = pins.find((p) => p.key === picked)

  // daily studio classes join the list only when someone picks a type (Yoga, Pilates, Breathwork…) and it matches
  const classes = useMemo(() => {
    if (!types.length || picked) return []
    const [a, b] = windowFor(when, today)
    const words = q.trim().toLowerCase()
    return classesBetween(studioClasses, a, b > addDays(today, 6) && when === 'Coming up' ? addDays(today, 6) : b)
      .filter((c) => (c.tags ?? []).some((t) => types.includes(t)))
      .filter((c) => !words || `${c.title} ${c.studio} ${c.teacher} ${c.venue}`.toLowerCase().includes(words))
  }, [studioClasses, types, when, q, today, picked])

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
    const byClass = new Map()
    for (const c of classes) { if (!byClass.has(c.date)) byClass.set(c.date, []); byClass.get(c.date).push(c) }
    for (const k of byClass.keys()) if (!by.has(k)) by.set(k, [])
    return [...by.entries()].sort(([x], [y]) => x.localeCompare(y)).map(([k, l]) => [k, l, byClass.get(k) ?? []])
  }, [shown, pin, when, today, classes])

  const label = (k) => k === 'tbc' ? 'Date to be confirmed' : k === today ? `Today · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : k === addDays(today, 1) ? `Tomorrow · ${fmtDay(k, { month: 'long', day: 'numeric' })}` : fmtDay(k)
  const count = days.reduce((n, [, l, c]) => n + l.length + c.length, 0)

  return (
    <Shell>
      <article className="cal">
        <header className="cal-hero">
          <p className="eyebrow center">Now in Nosara, Costa Rica</p>
          <Reveal as="h1" className="display center"><Shimmer>Rituals</Shimmer></Reveal>
          <Rise as="p" className="cal-sub center" delay={0.2}>weaving your xanadu one ritual at a time</Rise>
        </header>

        <div className="cal-controls">
          <div className="cal-bar">
            <Dropdown label="When" value={when} active={when !== 'Coming up'}>
              {(close) => (
                <ul className="dd-list">
                  {WHEN.map((w) => (
                    <li key={w}><button type="button" className={`dd-item ${when === w ? 'is-on' : ''}`} onClick={() => { setWhen(w); close() }}>{w}</button></li>
                  ))}
                </ul>
              )}
            </Dropdown>
            <Dropdown label="Type" value={!types.length ? 'Everything' : types.length === 1 ? types[0] : `${types.length} types`} active={types.length > 0} wide>
              {(close) => (
                <div className="dd-types">
                  {FAMILIES.map((f) => {
                    const all = f.types.every((t) => types.includes(t))
                    return (
                      <div key={f.label} className="dd-fam">
                        <button type="button" className={`dd-fam-h ${all ? 'is-on' : ''}`} onClick={() => setTypes((cur) => all ? cur.filter((t) => !f.types.includes(t)) : [...new Set([...cur, ...f.types])])}>
                          {f.label}<span>{all ? 'Clear' : 'All'}</span>
                        </button>
                        <ul className="dd-list">
                          {f.types.map((t) => {
                            const on = types.includes(t)
                            return (
                              <li key={t}>
                                <button type="button" className={`dd-item dd-check ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setTypes((cur) => on ? cur.filter((x) => x !== t) : [...cur, t])}>
                                  <i aria-hidden="true">{on ? '✓' : ''}</i>{t}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                  <div className="dd-foot">
                    <button type="button" className="cal-chip" onClick={() => setTypes([])}>Clear all</button>
                    <button type="button" className="cal-chip is-on" onClick={close}>Done</button>
                  </div>
                </div>
              )}
            </Dropdown>
            <div className="cal-view" role="group" aria-label="View">
              {['List', 'Map'].map((v) => (
                <button key={v} type="button" className={view === v ? 'is-on' : ''} aria-pressed={view === v} onClick={() => { setView(v); if (v === 'List') setPicked(null) }}>{v}</button>
              ))}
            </div>
          </div>
          <label className="cal-search">
            <span className="sr-only">Search rituals</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: cacao, ecstatic dance, Guiones…" />
          </label>
        </div>

        {view === 'Map' && (
          <div className="cal-mapwrap">
            <Suspense fallback={<div className="xmap" />}>
              <EventMap pins={pins} picked={picked} onPick={setPicked} />
            </Suspense>
            {pin ? (
              <p className="cal-picked">
                <span>Showing {pin.count === 1 ? 'what’s on' : `${pin.count} rituals`} at <b>{pin.spot.exact ? (pin.title.split(' · ').slice(1).join(' · ') || pin.spot.label) : pin.spot.label}</b></span>
                <button type="button" className="cal-chip" onClick={() => setPicked(null)}>Show all</button>
              </p>
            ) : <p className="cal-picked"><span>Tap a pin to see what’s on there.</span></p>}
          </div>
        )}

        <div className="cal-list" aria-live="polite">
          {loading && <p className="cal-empty">Loading what’s on…</p>}
          {!loading && failed && <p className="cal-empty">The calendar didn’t load. Please refresh the page.</p>}
          {!loading && !failed && count === 0 && (
            <div className="cal-empty">
              <p>Nothing matches yet.</p>
              <button type="button" className="cal-chip" onClick={() => { setWhen('Coming up'); setTypes([]); setQ(''); setPicked(null) }}>Show everything coming up</button>
            </div>
          )}
          {!types.length && !loading && (
            <p className="cal-hint">Pick a type like Yoga or Pilates to see the studios’ daily classes too.</p>
          )}
          {days.map(([k, list, cls]) => (
            <section key={k} className="cal-day">
              <h2 className="cal-day-h">{label(k)}</h2>
              {list.length > 0 && <div className="cal-cards">{list.map((e) => <EventCard key={e.id} e={e} />)}</div>}
              {cls.length > 0 && (
                <div className="cls">
                  <p className="cls-h">Studio classes</p>
                  <ul className="cls-list">{cls.map((c) => <ClassRow key={c.id + c.date} c={c} />)}</ul>
                </div>
              )}
            </section>
          ))}
        </div>

        <CalendarJoin />
      </article>
    </Shell>
  )
}

/** One studio class: time, class, where, who, price, and how to reach the studio. */
function ClassRow({ c }) {
  const [open, setOpen] = useState(false)
  const contact = contactLink(c.contact)
  return (
    <li className={`cls-row ${open ? 'is-open' : ''}`}>
      <button type="button" className="cls-main" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="cls-time">{c.start_time}{c.end_time ? `–${c.end_time}` : ''}</span>
        <span className="cls-title">{c.title}</span>
        <span className="cls-where">{c.studio}{c.room && c.studio === 'Bodhi Tree' ? ` · ${c.room}` : ''}{c.teacher ? ` · ${c.teacher}` : ''}</span>
      </button>
      {open && (
        <div className="cls-more">
          <p><b>Price</b> {c.price_note || 'Ask the studio'}</p>
          <p><b>Where</b> {[c.venue, c.town].filter(Boolean).join(', ')}</p>
          {c.notes && <p>{c.notes}</p>}
          <p className="cls-actions">
            {contact && <a href={contact.href} target="_blank" rel="noopener">{contact.label.replace('the host', 'the studio')}</a>}
            {!contact && c.contact && <span>{c.contact}</span>}
            {c.link && <a href={c.link} target="_blank" rel="noopener">The studio’s schedule</a>}
          </p>
          <p className="cls-src">From {c.studio}’s own schedule, checked {fmtDay(c.checked_on, { month: 'short', day: 'numeric' })}. Times can change: check with the studio.</p>
        </div>
      )}
    </li>
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
        <Button href="/apply/facilitator" variant="ghost">Host with us</Button>
      </Rise>
    </section>
  )
}
