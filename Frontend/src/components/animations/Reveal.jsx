import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Reveal({ children, stagger = false, className = '' }) {
  const revealRef = useRef(null)

  useEffect(() => {
    const element = revealRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const targets = stagger ? Array.from(element.children) : [element]
    if (!targets.length) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(targets,
        { y: stagger ? 30 : 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'none',
          stagger: stagger ? 0.08 : 0,
          overwrite: 'auto',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            end: 'top 46%',
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        },
      )
    }, element)

    return () => {
      context.revert()
    }
  }, [stagger])

  return <div ref={revealRef} className={className}>{children}</div>
}
