import { useEffect, useRef } from 'react'
import './CursorAura.css'

export default function CursorAura() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const touchPointer = window.matchMedia('(pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const usesMouse = finePointer.matches && !reducedMotion.matches
    const usesTouch = touchPointer.matches
    if (!usesMouse && !usesTouch) return undefined

    const cursor = cursorRef.current
    if (!cursor) return undefined

    if (usesMouse) document.documentElement.classList.add('has-custom-cursor')
    let frame = 0
    let touchTimer = 0
    let x = -100
    let y = -100

    const updatePosition = (event) => {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        cursor.classList.add('is-visible')
        frame = 0
      })
    }

    const move = (event) => {
      if (event.pointerType === 'touch' && !cursor.classList.contains('is-touching')) return
      updatePosition(event)
    }

    const setTargetState = (event) => {
      const interactive = event.target instanceof Element
        && event.target.closest('button, a, input, label, select, textarea, [role="button"]')
      cursor.classList.toggle('is-over-control', Boolean(interactive))
    }

    const press = (event) => {
      if (event.pointerType === 'touch') {
        window.clearTimeout(touchTimer)
        cursor.classList.add('is-touching', 'is-visible')
        setTargetState(event)
        updatePosition(event)
        return
      }
      cursor.classList.add('is-pressed')
    }

    const release = (event) => {
      if (event.pointerType === 'touch') {
        cursor.classList.remove('is-touching')
        touchTimer = window.setTimeout(() => {
          cursor.classList.remove('is-visible', 'is-over-control')
        }, 480)
        return
      }
      cursor.classList.remove('is-pressed')
    }

    const leave = () => cursor.classList.remove('is-visible', 'is-over-control', 'is-pressed', 'is-touching')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', setTargetState, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', release, { passive: true })
    window.addEventListener('pointerleave', leave, { passive: true })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.clearTimeout(touchTimer)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', setTargetState)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return <span className="cursor-aura" ref={cursorRef} aria-hidden="true" />
}
