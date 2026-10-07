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

    let revealTween
    const context = gsap.context(() => {
      gsap.set(targets, { y: 40, autoAlpha: 0 })

      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          revealTween = gsap.to(targets, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: stagger ? 0.08 : 0,
            overwrite: 'auto',
          })
        },
      })
    }, element)

    return () => {
      revealTween?.kill()
      context.revert()
    }
  }, [stagger])

  return <div ref={revealRef} className={className}>{children}</div>
}
