import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Emblem from './Emblem'
import { LINKS } from '../lib/links'
import { scrollToTarget } from '../lib/scroll'

const ITEMS = [
  { label: 'Your stay', href: '#stay' },
  { label: 'Three paths', href: '#paths' },
  { label: 'Places', href: '#places' },
  { label: 'The app', href: '#app' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > window.innerHeight * 0.6)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <header className={`nav ${solid ? 'is-solid' : ''}`}>
      <a href="#top" className="nav-logo" onClick={(e) => go(e, '#top')} aria-label="Xanadu — back to top">
        <span className="nav-mark"><Emblem animated={false} /></span>
        <span className="nav-word">XANADU</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {ITEMS.map((it) => (
          <a key={it.href} href={it.href} onClick={(e) => go(e, it.href)}>{it.label}</a>
        ))}
      </nav>
      <Button href={LINKS.seeker} className="nav-cta">Get the app</Button>
      <div className="nav-progress"><div ref={barRef} className="nav-progress-bar" /></div>
    </header>
  )
}
