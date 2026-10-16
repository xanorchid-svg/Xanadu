import { useEffect, useRef } from 'react'

/** Watch an element; add `is-in` once it enters the viewport. */
export function useInView(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: options.threshold ?? 0.2, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options.threshold, options.rootMargin])
  return ref
}
