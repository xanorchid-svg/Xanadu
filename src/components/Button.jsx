import { useRef } from 'react'
import { isTouch } from '../lib/sky'

/**
 * Pearl buttons: a slowly shifting iridescent gradient with a light sweep,
 * and a gentle magnetic pull toward the cursor.
 */
export default function Button({ href, children, variant = 'pearl', className = '', onClick, ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    if (isTouch()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  const Tag = href ? 'a' : 'button'
  const external = href && /^https?:/.test(href)
  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`btn btn-${variant} ${className}`}
      data-cursor="hover"
      {...(external ? { rel: 'noopener' } : {})}
      {...rest}
    >
      <span className="btn-label">{children}</span>
    </Tag>
  )
}
