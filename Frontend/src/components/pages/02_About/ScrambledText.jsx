import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

import './ScrambledText.css'

gsap.registerPlugin(SplitText, ScrambleTextPlugin)

// Scramble effect inspired by Tom Miller (GSAP community) / React Bits.
// Characters near the cursor scramble and then settle back.
//   radius      px around the cursor that is affected
//   duration    seconds for the longest scramble
//   speed       scramble speed
//   scrambleChars  characters used while scrambling
//   clickBurst  a click scrambles a wider area
//   intro       play one scramble over the whole text on mount
export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  clickBurst = false,
  intro = false,
  className = '',
  style = {},
  children,
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const target = root?.querySelector('p')
    if (!target) return undefined

    const split = SplitText.create(target, { type: 'words,chars', wordsClass: 'word', charsClass: 'char' })
    const chars = split.chars

    chars.forEach((c) => {
      gsap.set(c, { display: 'inline-block', attr: { 'data-content': c.innerHTML } })
    })

    const scramble = (c, dur, delay = 0) => {
      gsap.to(c, {
        overwrite: true,
        delay,
        duration: dur,
        scrambleText: { text: c.dataset.content || '', chars: scrambleChars, speed },
        ease: 'none',
      })
    }

    const affect = (event, reach) => {
      chars.forEach((c) => {
        const { left, top, width, height } = c.getBoundingClientRect()
        const dist = Math.hypot(event.clientX - (left + width / 2), event.clientY - (top + height / 2))
        if (dist < reach) scramble(c, duration * (1 - dist / reach))
      })
    }

    const handleMove = (event) => affect(event, radius)
    const handleClick = (event) => affect(event, radius * 2)

    root.addEventListener('pointermove', handleMove)
    if (clickBurst) root.addEventListener('click', handleClick)

    if (intro) {
      chars.forEach((c, i) => scramble(c, duration, i * 0.012))
    }

    return () => {
      root.removeEventListener('pointermove', handleMove)
      root.removeEventListener('click', handleClick)
      gsap.killTweensOf(chars)
      split.revert()
    }
  }, [radius, duration, speed, scrambleChars, clickBurst, intro, children])

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{children}</p>
    </div>
  )
}