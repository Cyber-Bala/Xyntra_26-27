import { useEffect, useRef } from 'react'

const GLYPHS = ' .,:;irsXA253hMHGS#9B&@'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function AsciiNoiseBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !host || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cellWidth = 10
    const cellHeight = 14
    let width = 0
    let height = 0
    let time = 0

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.ceil(width * ratio)
      canvas.height = Math.ceil(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }

    const draw = () => {
      context.fillStyle = '#070709'
      context.fillRect(0, 0, width, height)
      context.font = '11px "Courier New", monospace'
      context.textBaseline = 'top'

      const columns = Math.ceil(width / cellWidth)
      const rows = Math.ceil(height / cellHeight)
      for (let row = 0; row < rows; row += 1) {
        const y = row * cellHeight
        const ny = y / Math.max(height, 1)
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellWidth
          const nx = x / Math.max(width, 1)
          const broadWave = Math.sin(nx * 8.2 + Math.sin(ny * 5.4 + time * 0.22) * 1.7 + time * 0.12)
          const fineWave = Math.cos(nx * 17.5 - ny * 7.1 - time * 0.1) * 0.34
          const cloudBand = Math.sin((nx + ny * 0.72) * 12.4 + Math.cos(ny * 8.3 + time * 0.16)) * 0.3
          const vignette = 1 - Math.min(0.56, Math.abs(nx - 0.5) * 0.7 + Math.abs(ny - 0.48) * 0.2)
          const light = clamp((0.48 + broadWave * 0.22 + fineWave + cloudBand) * vignette, 0, 1)
          const glyphIndex = Math.min(GLYPHS.length - 1, Math.floor(light * (GLYPHS.length - 1)))
          if (light < 0.43 || glyphIndex < 10) continue

          const gray = Math.round(116 + light * 118)
          const alpha = 0.045 + light * 0.15
          context.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`
          context.fillText(GLYPHS[glyphIndex], x, y)
        }
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    const animation = reducedMotion ? undefined : window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      time += 0.035
      draw()
    }, 140)

    return () => {
      observer.disconnect()
      if (animation) window.clearInterval(animation)
    }
  }, [])

  return <canvas ref={canvasRef} className="ascii-noise-background" aria-hidden="true" />
}
