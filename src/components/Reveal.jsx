import { Children, isValidElement, cloneElement } from 'react'
import { useInView } from '../lib/useInView'

/**
 * Headings that rise and unblur word by word.
 * Plain strings are split into words; elements (like <Shimmer>) stay whole and count as one word.
 */
export function Reveal({ as = 'h2', children, className = '', delay = 0, stagger = 0.06 }) {
  const Tag = as
  const ref = useInView()
  let i = 0
  const wrap = (node, key) => (
    <span className="rw" key={key}>
      <span className="rw-i" style={{ transitionDelay: `${delay + i++ * stagger}s` }}>{node}</span>
    </span>
  )
  const out = []
  Children.forEach(children, (child, ci) => {
    if (typeof child === 'string') {
      child.split(/(\s+)/).forEach((w, wi) => {
        if (!w) return
        if (/^\s+$/.test(w)) out.push(' ')
        else out.push(wrap(w, `${ci}-${wi}`))
      })
    } else if (isValidElement(child) && child.type === 'br') {
      out.push(cloneElement(child, { key: `br-${ci}` }))
    } else {
      out.push(wrap(child, `${ci}`))
    }
  })
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {out}
    </Tag>
  )
}

/** A block that fades and rises into view. */
export function Rise({ as = 'div', children, className = '', delay = 0, style, ...rest }) {
  const Tag = as
  const ref = useInView()
  return (
    <Tag ref={ref} className={`rise ${className}`} style={{ ...style, transitionDelay: `${delay}s` }} {...rest}>
      {children}
    </Tag>
  )
}

/** A word that shimmers in the iridescent sheen. */
export function Shimmer({ children }) {
  return <em className="shimmer">{children}</em>
}
