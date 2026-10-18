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

// ---------- one scroll loop for the whole page ----------
// Reading layout (scroll position, element sizes) right after something changed styles forces the
// browser to lay the page out again. With several sections doing that on every scroll it adds up,
// especially on phones. So: the scroll position is cached once per scroll event, and every section
// measures first (read) and then updates (write), all together, once per frame.
export const scrollState = { y: typeof window !== 'undefined' ? window.scrollY : 0 }
const jobs = new Set()
let queued = false
const run = () => {
  queued = false
  const measured = []
  for (const j of jobs) measured.push(j.read ? j.read() : undefined)
  let i = 0
  for (const j of jobs) j.write?.(measured[i++])
}
const queue = () => {
  if (!queued) { queued = true; requestAnimationFrame(run) }
}
const onWindowScroll = () => { scrollState.y = window.scrollY; queue() }
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  window.addEventListener('resize', queue)
}

/**
 * Run `read` (measure only, no style changes) then `write(measurement)` once per frame while scrolling.
 * Returns an unsubscribe function.
 */
export function onScrollFrame(read, write) {
  const job = { read, write }
  jobs.add(job)
  queue()
  return () => jobs.delete(job)
}
