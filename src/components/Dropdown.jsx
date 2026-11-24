import { useEffect, useRef, useState } from 'react'

/**
 * A filter button that opens a panel below it. Closes on a tap outside or Esc.
 * children: the panel's content (a function gets `close`).
 */
export default function Dropdown({ label, value, active = false, children, wide = false }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return
    const out = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', out)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc) }
  }, [open])
  const close = () => setOpen(false)
  return (
    <div className={`dd ${wide ? 'dd-wide' : ''}`} ref={box}>
      <button type="button" className={`dd-btn ${active ? 'is-active' : ''} ${open ? 'is-open' : ''}`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        <span className="dd-label">{label}</span>
        <span className="dd-value">{value}</span>
        <span className="dd-caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className={`dd-panel ${wide ? 'is-wide' : ''}`} role="dialog" aria-label={label} data-lenis-prevent>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}
