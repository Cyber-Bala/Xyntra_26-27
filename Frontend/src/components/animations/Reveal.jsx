import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
 
let refreshTimeout = null
function queueScrollTriggerRefresh() {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh()
    refreshTimeout = null
  }, 250)
}

export default function Reveal({
  children,
  stagger = false,
  direction = 'up',
  distance = 24,
  duration = 0.7,
  threshold = '88%',
  once = true,
  className = '',
}) {
  const revealRef = useRef(null)

  useEffect(() => {
    const element = revealRef.current
    if (!element) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(element, { autoAlpha: 1, x: 0, y: 0 })
      return undefined
    }

    const targets = stagger ? Array.from(element.children) : [element]
    if (!targets.length) return undefined

    const offset =
      direction === 'left'
        ? { x: -distance, y: 0 }
        : direction === 'right'
        ? { x: distance, y: 0 }
        : direction === 'down'
        ? { x: 0, y: -distance }
        : { x: 0, y: distance }

    const revealFrom = {
      ...offset,
      autoAlpha: 0,
    }

    const revealTo = {
      x: 0,
      y: 0,
      autoAlpha: 1,
    }

    const context = gsap.context(() => {
      gsap.fromTo(targets, revealFrom, {
        ...revealTo,
        duration,
        ease: 'power2.out',
        stagger: stagger ? 0.08 : 0,
        overwrite: 'auto',
        scrollTrigger: {
          trigger: element,
          start: `top ${threshold}`,
          end: 'bottom top',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          invalidateOnRefresh: true,
        },
      })
    }, element)

    queueScrollTriggerRefresh()

    return () => {
      context.revert()
    }
  }, [direction, distance, duration, once, stagger, threshold])

  return (
    <div ref={revealRef} className={`reveal-section-wrap ${className}`}>
      {children}
    </div>
  )
}
