import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      duration: reducedMotion ? 0.01 : 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
      smoothTouch: false,
    })

    const handleScroll = () => ScrollTrigger.update()
    const handleTick = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', handleScroll)
    gsap.ticker.add(handleTick)
    gsap.ticker.lagSmoothing(0)
    window.lenisInstance = lenis

    const onReady = () => ScrollTrigger.refresh()
    if (document.fonts?.ready) {
      document.fonts.ready.then(onReady)
    }
    window.addEventListener('load', onReady)
    requestAnimationFrame(onReady)

    return () => {
      window.removeEventListener('load', onReady)
      gsap.ticker.remove(handleTick)
      lenis.off('scroll', handleScroll)
      lenis.destroy()
      if (window.lenisInstance === lenis) window.lenisInstance = undefined
    }
  }, [])

  return children
}
