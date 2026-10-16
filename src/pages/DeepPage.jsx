import Shell from '../components/Shell'
import Emblem from '../components/Emblem'
import Button from '../components/Button'
import { Reveal, Rise } from '../components/Reveal'
import { LINKS } from '../lib/links'

/** The shared frame for the "dive deeper" pages. */
export default function DeepPage({ eyebrow, title, lede, children, next }) {
  return (
    <Shell>
      <article className="deep">
        <header className="deep-hero">
          <div className="deep-emblem" aria-hidden="true"><Emblem electrons /></div>
          <a href="/" className="deep-back" data-cursor="hover">← Back to Xanadu</a>
          <p className="eyebrow center">{eyebrow}</p>
          <Reveal as="h1" className="display center">{title}</Reveal>
          {lede && <Rise as="p" className="lede center deep-lede" delay={0.3}>{lede}</Rise>}
        </header>
        <div className="deep-body">{children}</div>
        <footer className="deep-end">
          <Reveal as="p" className="display center">Come as you are.</Reveal>
          <Rise className="closing-actions" delay={0.15}>
            <Button href={LINKS.join}>Join the waitlist</Button>
            <Button href={LINKS.container} variant="ghost">Host a space</Button>
            <Button href={LINKS.facilitator} variant="ghost">Guide with us</Button>
          </Rise>
          {next && (
            <Rise className="deep-links center" delay={0.25}>
              {next.map((n) => <a key={n.href} href={n.href} className="deep-link" data-cursor="hover"><span>{n.label}</span><i>→</i></a>)}
            </Rise>
          )}
        </footer>
      </article>
    </Shell>
  )
}

/** A numbered step with a heading and prose. */
export function Step({ n, title, children }) {
  return (
    <section className="deep-step">
      <Rise className="deep-num" aria-hidden="true">{n}</Rise>
      <div>
        <Reveal as="h2" className="deep-h">{title}</Reveal>
        <Rise className="deep-prose" delay={0.15}>{children}</Rise>
      </div>
    </section>
  )
}

/** Lines of verse, revealed one by one. */
export function Verse({ lines, className = '' }) {
  return (
    <div className={`verse ${className}`}>
      {lines.map((l, i) => (l === '' ? <br key={i} /> : <Rise key={i} as="p" delay={(i % 6) * 0.08}>{l}</Rise>))}
    </div>
  )
}
