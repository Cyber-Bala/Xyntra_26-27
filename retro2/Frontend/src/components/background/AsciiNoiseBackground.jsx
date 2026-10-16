import { useEffect, useRef } from 'react'

const ASCII_BYTES = Array.from('XYNTRA', (character) =>
  character.charCodeAt(0).toString(2).padStart(8, '0'),
)
const BYTE_CYCLE = ASCII_BYTES.length
const ROW_HEIGHT = 25
const COLUMN_WIDTH = 126
const STREAM_SPEED = 26
const FRAME_INTERVAL = 1000 / 30
const AMBER = [234, 176, 74]
const CREAM = [241, 223, 192]
const TEAL = [79, 201, 184]

function getThemeColor(position) {
  const colorStops = [AMBER, CREAM, TEAL]
  const scaledPosition = position * (colorStops.length - 1)
  const startIndex = Math.min(Math.floor(scaledPosition), colorStops.length - 2)
  const blend = scaledPosition - startIndex
  return colorStops[startIndex].map((channel, index) =>
    Math.round(channel + (colorStops[startIndex + 1][index] - channel) * blend),
  )
}

export default function AsciiNoiseBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !host || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let elapsed = 0
    let previousFrame = 0
    let animationFrame

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.ceil(width * ratio)
      canvas.height = Math.ceil(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      render()
    }

    const draw = (time) => {
      context.fillStyle = '#070908'
      context.fillRect(0, 0, width, height)
      context.font = '600 13px "Courier New", monospace'
      context.textBaseline = 'middle'

      const columns = Math.ceil(width / COLUMN_WIDTH)
      const rows = Math.ceil(height / ROW_HEIGHT) + 2
      const cycleHeight = ROW_HEIGHT * BYTE_CYCLE
      const travel = time * STREAM_SPEED

      for (let column = 0; column < columns; column += 1) {
        const x = column * COLUMN_WIDTH + 10
        const [red, green, blue] = getThemeColor(x / Math.max(width - 1, 1))
        const phase = (column % Math.max(1, Math.ceil(height / cycleHeight))) * cycleHeight
        const streamTravel = (travel + phase) % (height + cycleHeight)

        for (let row = 0; row < rows; row += 1) {
          const y = row * ROW_HEIGHT - (streamTravel % ROW_HEIGHT)
          if (y < -ROW_HEIGHT || y > height + ROW_HEIGHT) continue

          const streamRow = Math.floor((row * ROW_HEIGHT - streamTravel + phase) / ROW_HEIGHT)
          const byte = ASCII_BYTES[((streamRow % BYTE_CYCLE) + BYTE_CYCLE) % BYTE_CYCLE]
          const headY = streamTravel % (height + cycleHeight)
          const distanceFromHead = (headY - y + height + cycleHeight) % (height + cycleHeight)
          const trail = Math.max(0, 1 - distanceFromHead / (height * 0.42))
          const isHead = distanceFromHead < ROW_HEIGHT

          context.fillStyle = isHead
            ? 'rgba(255, 248, 226, 0.98)'
            : `rgba(${red}, ${green}, ${blue}, ${0.18 + trail * 0.7})`
          context.shadowColor = `rgb(${red}, ${green}, ${blue})`
          context.shadowBlur = isHead ? 10 : trail * 7
          context.fillText(byte, x, y)
        }
      }
      context.shadowBlur = 0
    }

    const render = (timestamp = 0) => {
      if (!width || !height || document.visibilityState === 'hidden') return
      if (previousFrame && timestamp - previousFrame < FRAME_INTERVAL) {
        animationFrame = window.requestAnimationFrame(render)
        return
      }
      if (previousFrame) elapsed += Math.min((timestamp - previousFrame) / 1000, 0.05)
      previousFrame = timestamp
      draw(elapsed)
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        window.cancelAnimationFrame(animationFrame)
        return
      }
      previousFrame = 0
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    resize()
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(render)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="ascii-noise-background" aria-hidden="true" />
}
