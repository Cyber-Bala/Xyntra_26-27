import { useEffect, useRef } from 'react'
import './pixel-heading.css'

const shardCount = 18
const GRID = 8 // 8x8 pixel mask per letter (matches a pixel font's 8px grid)
const CELL = 16 // px per mask cell inside the generated tile
const LEVELS = 16 // 0 = empty ... 16 = every pixel visible
const LETTER_STEP = 0.075 // seconds between letter starts (keep in sync with pixel-heading.css)

/** Builds 17 dither tiles once and exposes them as CSS variables --pt-m0 ... --pt-m16. */
function ensurePixelMasks() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (root.dataset.pixelMasks === '1') return

  // deterministic shuffle so every letter reveals its pixels in the same scattered order
  const order = Array.from({ length: GRID * GRID }, (_, i) => i)
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let n = order.length - 1; n > 0; n--) {
    const j = Math.floor(rnd() * (n + 1))
    ;[order[n], order[j]] = [order[j], order[n]]
  }
  const rank = []
  order.forEach((cell, r) => (rank[cell] = r))

  for (let level = 0; level <= LEVELS; level++) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = GRID * CELL
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#000'
    const count = Math.round((level / LEVELS) * GRID * GRID)
    for (let c = 0; c < GRID * GRID; c++) {
      if (rank[c] < count) ctx.fillRect((c % GRID) * CELL, Math.floor(c / GRID) * CELL, CELL, CELL)
    }
    root.style.setProperty(`--pt-m${level}`, `url(${canvas.toDataURL()})`)
  }
  root.dataset.pixelMasks = '1'
}

export function PixelHeading({ as = 'h2', id, className = '', children }) {
  const Tag = as
  const ref = useRef(null)

  useEffect(() => {
    ensurePixelMasks()
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const text = typeof children === 'string' ? children : String(children || '')
  const total = text.length * LETTER_STEP
  let cursor = 0
  const words = text.split(' ').map((word) => {
    const start = cursor
    cursor += word.length + 1
    return { word, start }
  })

  return (
    <Tag ref={ref} id={id} className={`pixel-title ${className}`} data-reveal>
      <span className="pixel-title__copy" aria-label={text}>
        {words.map(({ word, start }, wi) => (
          <span key={wi}>
            <span className="pixel-title__word" aria-hidden="true">
              {Array.from(word).map((ch, ci) => {
                const idx = start + ci
                const style = {
                  '--c': idx,
                  '--ox': (idx * 5 + 3) % 8,
                  '--oy': (idx * 3 + idx * idx) % 8,
                }
                return (
                  <span className="pixel-title__char" key={ci} style={style}>
                    {ch}
                  </span>
                )
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
      <span className="pixel-title__debris" aria-hidden="true">
        {Array.from({ length: shardCount }, (_, index) => {
          const style = {
            '--shard-x': `${(index * 31 + 7) % 97}%`,
            '--shard-y': `${(index * 19 + 11) % 82}%`,
            '--shard-dx': `${((index * 17) % 86) - 43}px`,
            '--shard-dy': `${((index * 23) % 78) - 39}px`,
            '--shard-delay': `${0.1 + (((index * 31 + 7) % 97) / 97) * total * 0.95}s`,
          }
          return <i className={`pixel-title__shard pixel-title__shard--${index % 4}`} key={index} style={style} />
        })}
      </span>
    </Tag>
  )
}

export default PixelHeading
