import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Aurora from './Aurora'
import Cursor from './Cursor'
import Nav from './Nav'
import Footer from './Footer'
import JoinModal from './JoinModal'
import { sky, prefersReducedMotion } from '../lib/sky'
import { setLenis, scrollState } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

/** Everything every page shares: the sky, the cursor, smooth scrolling, the nav and the footer. */
export default function Shell({ home = false, children }) {
  useEffect(() => {
    const reduced = prefersReducedMotion()
    document.documentElement.classList.toggle('reduced', reduced)

    let lenis = null
    let lastY = scrollState.y
    // window.innerHeight forces a layout in Chrome, so it is cached, never read per frame
    let vh = Math.max(window.innerHeight, 1)
    const onResize = () => { vh = Math.max(window.innerHeight, 1) }
    window.addEventListener('resize', onResize)
    const tick = (time) => {
      lenis?.raf(time * 1000)
      // scroll speed feeds the aurora and the marquees (cached position: no layout read every frame)
      const y = scrollState.y
      const v = Math.abs(y - lastY) / vh
      lastY = y
      sky.velocity += (Math.min(v * 6, 1) - sky.velocity) * 0.12
    }

    if (!reduced) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
      setLenis(lenis)
      lenis.on('scroll', (l) => { scrollState.y = l.scroll; ScrollTrigger.update() })
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // fonts change line lengths: re-measure pinned sections once they arrive,
    // then honour a link like /#join coming from another page
    const ready = document.fonts?.ready ?? Promise.resolve()
    let t
    ready.then(() => {
      ScrollTrigger.refresh()
      const hash = window.location.hash
      if (hash && hash.length > 1) {
        t = setTimeout(() => {
          const el = document.querySelector(hash)
          if (!el) return
          if (lenis) lenis.scrollTo(el, { immediate: true })
          else el.scrollIntoView()
        }, 300)
      }
    })

    return () => {
      clearTimeout(t)
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      lenis?.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Aurora />
      <Cursor />
      <Nav home={home} />
      <main id="main">{children}</main>
      <Footer />
      <JoinModal auto={home} />
    </>
  )
}
