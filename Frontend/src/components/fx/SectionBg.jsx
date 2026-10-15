import { useEffect, useRef, useState } from 'react'
import './SectionBg.css'

const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * SectionBg — full-bleed background image with parallax, fade-in, colour grading,
 * gold tint overlay, and per-section gradient. Sits at z-index 0 inside a
 * position:relative parent section.
 *
 * Props:
 *   src        — imported image URL (via Vite asset import)
 *   opacity    — target opacity when visible (default 0.3)
 *   position   — CSS background-position (default 'center center')
 *   gradient   — CSS gradient string for the dark overlay
 *   pixelated  — if true, adds image-rendering: pixelated
 *   className  — extra class on the root wrapper
 */
export default function SectionBg({
  src,
  opacity = 1,
  position = 'center center',
  gradient = '',
  pixelated = false,
  className = '',
}) {
  const rootRef = useRef(null)
  const imgRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    /* ── Fade-in via IntersectionObserver ──────────────────────── */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(root)

    /* ── Parallax scroll handler (max ±40 px) ─────────────────── */
    if (REDUCED()) {
      setVisible(true)
      observer.disconnect()
      return () => observer.disconnect()
    }

    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        const img = imgRef.current
        if (!img) return
        const rect = root.getBoundingClientRect()
        const viewH = window.innerHeight
        // progress goes from 0 (section just entering bottom) to 1 (section leaving top)
        const progress = 1 - (rect.top + rect.height) / (viewH + rect.height)
        const clamped = Math.max(0, Math.min(1, progress))
        // map to -40px … +40px
        const ty = (clamped - 0.5) * 80
        img.style.transform = `translateY(${ty.toFixed(1)}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initial position

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const imgStyle = {
    backgroundImage: `url(${src})`,
    backgroundPosition: position,
    '--bg-opacity': opacity,
    ...(pixelated ? { imageRendering: 'pixelated' } : {}),
  }

  return (
    <div
      ref={rootRef}
      className={`section-bg-root ${visible ? 'section-bg-visible' : ''} ${className}`}
    >
      {/* Colour-graded background image */}
      <div ref={imgRef} className="section-bg-img" style={imgStyle} />

      {/* Gold/amber tint overlay */}
      <div className="section-bg-tint" />

      {/* Section-specific dark gradient overlay */}
      {gradient && <div className="section-bg-gradient" style={{ background: gradient }} />}
    </div>
  )
}
