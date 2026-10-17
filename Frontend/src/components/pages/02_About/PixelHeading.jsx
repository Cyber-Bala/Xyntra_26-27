import { useEffect, useMemo, useRef, useState } from 'react'
import './PixelHeading.css'

/* ------------------------------------------------------------------
   Pixel-dissolve heading (ported from the PixelHeading HTML preview).
   Each letter is revealed through an 8x8 dither mask, one pixel at a
   time, while small square "shards" flicker around the title.

   Usage:
     <PixelHeading level={1} size="xl" accentLine={2}>{"BUILD\nWHAT'S\nNEXT."}</PixelHeading>
     <PixelHeading level={2} size="lg" accentLine={1}>{'CHOOSE\nYOUR DOMAINS.'}</PixelHeading>

   Props
     size        'xl' | 'lg' | 'md'     font size preset
     level       1-6                    aria-level for screen readers
     accentLine  index of first line that uses the accent colour (-1 = none)
     delay       ms to wait after the heading scrolls into view
   Use "\n" in the text to start a new line.
   ------------------------------------------------------------------ */

const LEVELS = 16
const GRID = 8
const CELL = 16
const SHARDS = 18
const CHAR_STEP = 0.075

let masksReady = false

// 17 dither tiles (0 = nothing, 16 = every pixel) + the @keyframes that steps through them.
function buildMasks() {
  if (masksReady || typeof document === 'undefined') return
  masksReady = true

  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  const order = Array.from({ length: GRID * GRID }, (_, i) => i)
  for (let n = order.length - 1; n > 0; n--) {
    const j = Math.floor(rnd() * (n + 1))
    ;[order[n], order[j]] = [order[j], order[n]]
  }
  const rank = []
  order.forEach((cell, r) => {
    rank[cell] = r
  })

  let keyframes = '@keyframes pt-char{'
  for (let k = 0; k <= LEVELS; k++) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = GRID * CELL
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    const count = Math.round((k / LEVELS) * GRID * GRID)
    for (let c = 0; c < GRID * GRID; c++) {
      if (rank[c] < count) {
        ctx.fillRect((c % GRID) * CELL, Math.floor(c / GRID) * CELL, CELL, CELL)
      }
    }
    document.documentElement.style.setProperty(`--m${k}`, `url(${canvas.toDataURL()})`)
    const pct = ((k / LEVELS) * 100).toFixed(3).replace(/\.?0+$/, '')
    keyframes += `${pct}%{-webkit-mask-image:var(--m${k});mask-image:var(--m${k})}`
  }
  keyframes += '}'

  const style = document.createElement('style')
  style.setAttribute('data-pixel-heading', '')
  style.textContent = keyframes
  document.head.appendChild(style)
}

buildMasks()

export default function PixelHeading({
  as: Tag = 'div',
  level = 2,
  size = 'lg',
  accentLine = -1,
  delay = 0,
  className = '',
  children,
}) {
  const text = String(children)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  const { lines, total } = useMemo(() => {
    let s = 7
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    let c = 0
    const built = text.split('\n').map((line) =>
      line
        .split(' ')
        .filter(Boolean)
        .map((word) => {
          const chars = word.split('').map((ch) => ({
            ch,
            c: c++,
            ox: Math.floor(rnd() * 8),
            oy: Math.floor(rnd() * 8),
          }))
          c++ // the space after the word
          return chars
        }),
    )
    return { lines: built, total: text.replace(/\n/g, '').length * CHAR_STEP }
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let timer
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [delay])

  return (
    <Tag
      ref={ref}
      role="heading"
      aria-level={level}
      aria-label={text.replace(/\n/g, ' ')}
      className={`pixel-title pixel-title--${size}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      <span className="pixel-title__copy" aria-hidden="true">
        {lines.map((words, li) => (
          <span
            key={li}
            className={`pixel-title__line${accentLine >= 0 && li >= accentLine ? ' pixel-title__line--accent' : ''}`}
          >
            {words.map((chars, wi) => (
              <span key={wi}>
                <span className="pixel-title__word">
                  {chars.map((item) => (
                    <span
                      key={item.c}
                      className="pixel-title__char"
                      style={{ '--c': item.c, '--ox': item.ox, '--oy': item.oy }}
                    >
                      {item.ch}
                    </span>
                  ))}
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ))}
      </span>

      <span className="pixel-title__debris" aria-hidden="true">
        {Array.from({ length: SHARDS }).map((_, index) => (
          <i
            key={index}
            className={`pixel-title__shard pixel-title__shard--${index % 4}`}
            style={{
              '--shard-x': `${(index * 31 + 7) % 97}%`,
              '--shard-y': `${(index * 19 + 11) % 82}%`,
              '--shard-dx': `${((index * 17) % 86) - 43}px`,
              '--shard-dy': `${((index * 23) % 78) - 39}px`,
              '--shard-delay': `${0.1 + (((index * 31 + 7) % 97) / 97) * total * 0.95}s`,
            }}
          />
        ))}
      </span>
    </Tag>
  )
}