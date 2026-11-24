import { lazy, Suspense, useEffect, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import { openJoin } from '../lib/joinModal'
import { categoriesOf, contactLink, safeLink, timeRange, useEvent, whenText } from '../lib/events'
import { CalendarJoin } from './CalendarPage'
import { spotKey, spotOf } from '../lib/places'

const EventMap = lazy(() => import('../components/EventMap'))

/** One event, open to everyone: what, when, where, price and how to reach the host. */
export default function EventPage({ id }) {
  const { event: e, loading } = useEvent(id)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!e) return
    document.title = `${e.title} · ${whenText(e)} — Xanadu`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', `${e.title}${e.venue ? ` at ${e.venue}` : ''}, ${whenText(e)}. ${e.description ?? ''}`.slice(0, 300))
  }, [e])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: e.title, url })
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* they closed the share sheet */ }
  }

  if (loading) return <Shell><article className="cal"><p className="cal-empty cal-pad">Loading…</p></article></Shell>
  if (!e) {
    return (
      <Shell>
        <article className="cal cal-pad center">
          <h1 className="display center">This one has passed or moved.</h1>
          <p className="lede center deep-lede">See everything that’s coming up instead.</p>
          <div className="closing-actions"><Button href="/rituals">See all rituals</Button></div>
        </article>
      </Shell>
    )
  }

  const contact = contactLink(e.contact)
  const link = safeLink(e.link)
  const verified = !!(e.space_id || e.facilitator_id)
  const types = [...categoriesOf(e)]
  const spot = spotOf(e)

  return (
    <Shell>
      <article className="cal">
        <div className="ev">
          <a href="/rituals" className="deep-back" data-cursor="hover">← All rituals</a>
          <div className="ev-grid">
            {e.photo_url && <div className="ev-poster"><img src={e.photo_url} alt={`Poster for ${e.title}`} /></div>}
            <div className="ev-info">
              <p className="eyebrow">{verified ? 'From a verified host ✦' : 'Shared by the community · not verified'}</p>
              <h1 className="ev-title">{e.title}</h1>
              <dl className="ev-facts">
                <div><dt>When</dt><dd>{whenText(e)}{timeRange(e) && <><br />{timeRange(e)}</>}</dd></div>
                {(e.venue || e.town) && <div><dt>Where</dt><dd>{[e.venue, e.town].filter(Boolean).join(', ')}</dd></div>}
                {e.price_note && <div><dt>Price</dt><dd>{e.price_note}</dd></div>}
                {e.contact && !contact && <div><dt>Contact</dt><dd>{e.contact}</dd></div>}
              </dl>
              {types.length > 0 && <p className="cal-meta">{types.map((t) => <span key={t} className="cal-tag">{t}</span>)}</p>}
              {e.description && <p className="ev-desc">{e.description}</p>}
              {spot && (
                <div className="ev-map">
                  <Suspense fallback={<div className="xmap xmap-mini" />}>
                    <EventMap mini pins={[{ key: spotKey(spot), spot, count: 1, title: e.venue || spot.label }]} />
                  </Suspense>
                  <p className="ev-note">{spot.exact ? (e.venue || spot.label) : `${spot.label} · the exact spot comes from the host`}</p>
                </div>
              )}
              <div className="ev-actions">
                <Button onClick={openJoin} aria-haspopup="dialog">I’m going</Button>
                {contact && <Button href={contact.href} variant="ghost" target="_blank">{contact.label}</Button>}
                {link && <Button href={link} variant="ghost" target="_blank">Host’s page</Button>}
                <button type="button" className="cal-chip" onClick={share}>{copied ? 'Link copied' : 'Share'}</button>
              </div>
              <p className="ev-note">“I’m going” and who’s going are for members: joining is free. Booking and payment happen with the host.</p>
            </div>
          </div>
        </div>
        <CalendarJoin />
      </article>
    </Shell>
  )
}
