// Smooth scrolling lives here so any component can glide to a section.
let lenis = null
export const setLenis = (l) => { lenis = l }
export const getLenis = () => lenis

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof target === 'number') {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, ...opts })
    else window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: opts.offset ?? 0 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
