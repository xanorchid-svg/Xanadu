import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Aurora from './components/Aurora'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Living from './sections/Living'
import DesignStay from './sections/DesignStay'
import Paths from './sections/Paths'
import Places from './sections/Places'
import AppReveal from './sections/AppReveal'
import Closing from './sections/Closing'
import { sky, prefersReducedMotion } from './lib/sky'
import { setLenis } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const reduced = prefersReducedMotion()
    document.documentElement.classList.toggle('reduced', reduced)

    // old addresses (/seeker, /path…) land on the new single page
    if (window.location.pathname !== '/') window.history.replaceState(null, '', '/' + window.location.hash)

    let lenis = null
    let lastY = window.scrollY
    const tick = (time) => {
      lenis?.raf(time * 1000)
      // scroll velocity feeds the aurora and the marquees
      const y = window.scrollY
      const v = Math.abs(y - lastY) / Math.max(window.innerHeight, 1)
      lastY = y
      sky.velocity += (Math.min(v * 6, 1) - sky.velocity) * 0.12
    }

    if (!reduced) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
      setLenis(lenis)
      lenis.on('scroll', ScrollTrigger.update)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // fonts change line lengths; re-measure pinned sections once they arrive
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#living">Skip to content</a>
      <Aurora />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Living />
        <DesignStay />
        <Paths />
        <Places />
        <AppReveal />
        <Closing />
      </main>
    </>
  )
}
