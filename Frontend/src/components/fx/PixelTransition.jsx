import { useEffect, useRef } from 'react'

/**
 * PixelTransition
 * Dual-Wave Retro Algorithmic Pixel Transition:
 * - Wave 1 (Cover Wave):
 *   A sweeping diagonal wave of pure black retro pixel blocks (#000000) expands
 *   from top-left (0, 0) across to bottom-right, growing each block from scale 0 to 1
 *   and completely covering the departing page (e.g., Registration).
 * - Midpoint & Hold:
 *   The screen is 100% solid black. onMidpoint() synchronously swaps the underlying route.
 *   A brief hold gives React time to mount and settle the destination view.
 * - Wave 2 (Second Pixel Wave - Reveal Wave):
 *   A second diagonal pixel wave sweeps from top-left across to bottom-right.
 *   As the second wave arrives at each grid cell, the black pixel block visibly shrinks
 *   from full scale (1.0) down to zero (0.0), progressively revealing the vibrant
 *   destination page (e.g., Home) in a smooth, continuous, retro geometric cascade.
 * - Once the final pixel shrinks away at bottom-right, the transition completes cleanly.
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

    // Pixel block size & grid metrics
    const size = Math.max(16, Math.min(26, Math.floor(W / 52)))
    const cols = Math.ceil(W / size)
    const rows = Math.ceil(H / size)
    const maxDiag = (cols - 1) + (rows - 1)

    // Diagonal wave timing constants (tuned for ultra-smooth 60/120fps motion)
    const stepTime = Math.max(2.4, Math.min(3.8, 380 / maxDiag))
    const growTime = 135 // Wave 1: block expansion time
    const holdTime = 65 // Full solid black hold duration for view swap
    const shrinkTime = 195 // Wave 2: second pixel wave block shrink time

    // Exact midpoint: when the bottom-right corner reaches 100% solid coverage
    const midpointTime = maxDiag * stepTime + growTime
    // Trailing wave starts shrinking only after the hold window completes
    const trailStartTime = midpointTime + holdTime
    // Total animation time
    const totalTime = trailStartTime + maxDiag * stepTime + shrinkTime

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Solid black backdrop throughout the hold window to guarantee zero glitch or pixel bleed
      const isPeakHold = t >= midpointTime - 8 && t <= trailStartTime
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

          // Wave 1 hasn't arrived at this cell yet: fully clear (showing old page)
          if (t < leadArrival) continue

          const px = x * size
          const py = y * size

          // Phase 1 (Wave 1: Cover Wave):
          // Pure black pixel block grows outward from center until covering the cell
          if (t < leadArrival + growTime) {
            const p = (t - leadArrival) / growTime
            const e = easeOutCubic(p)
            const curSize = Math.max(1, (size + 0.6) * e)
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
          // Phase 2: Fully solid black block holding until Wave 2 arrives
          else if (t < trailArrival) {
            ctx.fillStyle = '#000000'
            ctx.fillRect(
              Math.floor(px),
              Math.floor(py),
              Math.ceil(size + 0.6),
              Math.ceil(size + 0.6)
            )
          }
          // Phase 3 (Wave 2: Reveal Wave):
          // The second pixel wave! Black pixel blocks visibly shrink from full size down to 0,
          // opening diagonal windows into the destination page
          else if (t < trailArrival + shrinkTime) {
            const p = (t - trailArrival) / shrinkTime
            // Smooth shrinkage from full size down to 0
            const curSize = Math.max(0, (size + 0.6) * (1 - p))
            const offset = (size - curSize) * 0.5
            const alpha = Math.max(0, 1 - Math.pow(p, 3))

            ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`
            ctx.fillRect(
              Math.floor(px + offset),
              Math.floor(py + offset),
              Math.ceil(curSize),
              Math.ceil(curSize)
            )
          }
          // Phase 4: Block has completely shrunk to 0, destination page is 100% visible
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
