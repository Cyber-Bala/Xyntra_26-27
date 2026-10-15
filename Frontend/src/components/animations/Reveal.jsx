import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Reveal({ children, stagger = false, direction = 'up', retro = false, className = '' }) {
  const revealRef = useRef(null)

  useEffect(() => {
    const element = revealRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const targets = stagger ? Array.from(element.children) : [element]
    if (!targets.length) return undefined

    const offset = direction === 'left' ? { x: -24 } : direction === 'right' ? { x: 24 } : { y: stagger ? 18 : 28 }
    const revealFrom = {
      ...offset,
      autoAlpha: 0,
      ...(retro && direction !== 'up'
        ? { clipPath: direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }
        : {}),
    }
    const revealTo = {
      x: 0,
      y: 0,
      autoAlpha: 1,
      ...(retro && direction !== 'up' ? { clipPath: 'inset(0 0 0 0)' } : {}),
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        revealFrom,
        {
          ...revealTo,
          duration: retro ? 0.78 : 0.65,
          ease: 'power2.out',
          stagger: stagger ? 0.08 : 0,
          overwrite: 'auto',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
            invalidateOnRefresh: true,
          },
        },
      )
    }, element)

    return () => {
      context.revert()
    }
  }, [direction, retro, stagger])

  return <div ref={revealRef} className={className}>{children}</div>
}
