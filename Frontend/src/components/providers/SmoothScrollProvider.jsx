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
      duration: reducedMotion ? 0.01 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
      smoothTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    const handleScroll = () => ScrollTrigger.update()
    const handleTick = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', handleScroll)
    gsap.ticker.add(handleTick)
    gsap.ticker.lagSmoothing(0)
    window.lenisInstance = lenis

    const handleRefresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', handleRefresh)
    window.addEventListener('resize', handleRefresh)
    const refreshTimer = setTimeout(handleRefresh, 300)

    return () => {
      clearTimeout(refreshTimer)
      window.removeEventListener('load', handleRefresh)
      window.removeEventListener('resize', handleRefresh)
      gsap.ticker.remove(handleTick)
      lenis.off('scroll', handleScroll)
      lenis.destroy()
      if (window.lenisInstance === lenis) window.lenisInstance = undefined
    }
  }, [])

  return children
}
