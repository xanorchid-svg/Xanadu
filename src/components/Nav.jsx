import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Emblem from './Emblem'
import { scrollToTarget } from '../lib/scroll'
import { openJoin } from '../lib/joinModal'

const ITEMS = [
  { label: 'Why Xanadu', href: '#why' },
  { label: 'Your stay', href: '#stay' },
  { label: 'The network', href: '#network' },
  { label: 'The Origin', href: '#origin' },
  { label: 'The app', href: '#app' },
]

export default function Nav({ home = true }) {
  const [solid, setSolid] = useState(!home)
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setSolid(!home || y > window.innerHeight * 0.6)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  // on the home page links glide; on other pages they go home to that section
  const link = (href) => (home ? href : `/${href}`)
  const go = (e, href) => {
    if (!home) return
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <header className={`nav ${solid ? 'is-solid' : ''}`}>
      <a href={home ? '#top' : '/'} className="nav-logo" onClick={(e) => go(e, '#top')} aria-label="Xanadu home">
        <span className="nav-mark"><Emblem animated={false} /></span>
        <span className="nav-word">XANADU</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {ITEMS.map((it) => (
          <a key={it.href} href={link(it.href)} onClick={(e) => go(e, it.href)}>{it.label}</a>
        ))}
      </nav>
      <Button className="nav-cta" onClick={openJoin} aria-haspopup="dialog">Join Xanadu</Button>
      <div className="nav-progress"><div ref={barRef} className="nav-progress-bar" /></div>
    </header>
  )
}
