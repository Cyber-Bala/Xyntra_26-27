import { useEffect, useRef } from 'react'

/**
 * PixelTransition
 * Pure Black Retro Algorithmic Pixel Wave Transition:
 * - A single tiny black pixel starts in the top-left corner (0, 0).
 * - A sweeping diagonal wave of pure black pixel blocks (#000000) expands across the screen.
 * - At the exact moment the wave reaches the bottom-right corner and the screen is 100% solid black,
 *   onMidpoint() synchronously swaps the underlying route.
 * - With ZERO pause, the trailing wave immediately dissolves the black pixels from top-left
 *   to bottom-right in the exact same fluid diagonal motion, revealing the destination page.
 * - Ultra-smooth 60/120fps performance, razor-sharp integer pixel alignment, and pure black retro aesthetic.
 */
export default function PixelTransition({ isActive, onMidpoint, onComplete }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const midpointTriggered = useRef(false)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Prevent any scrolling during transition
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = window.innerWidth
    const H = window.innerHeight

    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.scale(dpr, dpr)

    // Pixel block size & grid metrics
    const size = Math.max(16, Math.min(26, Math.floor(W / 52)))
    const cols = Math.ceil(W / size)
    const rows = Math.ceil(H / size)
    const maxDiag = (cols - 1) + (rows - 1)

    // Diagonal wave timing constants
    const stepTime = Math.max(2.4, Math.min(3.8, 380 / maxDiag))
    const growTime = 130 // Individual block expansion time
    const dissolveTime = 160 // Individual block dissolve time
    const holdTime = 100 // Full solid black hold duration for React to settle destination view

    // Exact midpoint: when the bottom-right corner reaches 100% solid coverage
    const midpointTime = maxDiag * stepTime + growTime
    // Trailing wave starts dissolving only after the hold window completes
    const trailStartTime = midpointTime + holdTime
    // Total animation time
    const totalTime = trailStartTime + maxDiag * stepTime + dissolveTime

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    const easeInCubic = (t) => t * t * t

    let t0 = null
    midpointTriggered.current = false

    function frame(now) {
      if (t0 === null) t0 = now
      const t = now - t0

      // Midpoint: Synchronize route behind 100% solid black screen
      if (!midpointTriggered.current && t >= midpointTime) {
        midpointTriggered.current = true
        onMidpoint?.()
      }

      ctx.clearRect(0, 0, W, H)

      // Solid black backdrop throughout the hold window to guarantee zero glitch or pixel bleed
      const isPeakHold = t >= midpointTime - 15 && t <= trailStartTime + 15
      if (isPeakHold) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, W, H)
      }

      // Sweep through grid cells diagonally: diag = x + y
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const diag = x + y
          const leadArrival = diag * stepTime
          const trailArrival = trailStartTime + diag * stepTime

          // Wave hasn't arrived at this cell yet
          if (t < leadArrival) continue

          const px = x * size
          const py = y * size

          // Phase 1: Expanding wave front (pure black pixel growing outward from center)
          if (t < leadArrival + growTime) {
            const p = (t - leadArrival) / growTime
            const e = easeOutCubic(p)
            const curSize = Math.max(1, size * e)
            const offset = (size - curSize) * 0.5

            ctx.fillStyle = '#000000'
            ctx.fillRect(
              Math.floor(px + offset),
              Math.floor(py + offset),
              Math.ceil(curSize),
              Math.ceil(curSize)
            )

            // Subtle retro CRT phosphor sparkle on leading edge pixel
            if (p < 0.35 && diag === 0) {
              ctx.fillStyle = '#ffffff'
              ctx.fillRect(Math.floor(px), Math.floor(py), 3, 3)
            }
          }
          // Phase 2: Fully solid black block holding until trailing dissolve wave arrives
          else if (t < trailArrival) {
            ctx.fillStyle = '#000000'
            ctx.fillRect(
              Math.floor(px),
              Math.floor(py),
              Math.ceil(size),
              Math.ceil(size)
            )
          }
          // Phase 3: Trailing dissolve wave sweeping in the exact same diagonal direction
          else if (t < trailArrival + dissolveTime) {
            const p = (t - trailArrival) / dissolveTime
            const alpha = Math.max(0, 1 - easeInCubic(p))
            const shrink = Math.max(1, size * (1 - p * 0.12))
            const offset = (size - shrink) * 0.5

            ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`
            ctx.fillRect(
              Math.floor(px + offset),
              Math.floor(py + offset),
              Math.ceil(shrink),
              Math.ceil(shrink)
            )
          }
          // Phase 4: Block has dissolved completely into the destination page
        }
      }

      if (t < totalTime) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        if (!midpointTriggered.current) {
          midpointTriggered.current = true
          onMidpoint?.()
        }
        ctx.clearRect(0, 0, W, H)
        document.documentElement.style.overflow = prevOverflow
        onComplete?.()
      }
    }

    animRef.current = requestAnimationFrame(frame)

    return () => {
      document.documentElement.style.overflow = prevOverflow
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isActive, onMidpoint, onComplete])

  if (!isActive) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        pointerEvents: 'auto',
        overflow: 'hidden',
        background: 'transparent',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
