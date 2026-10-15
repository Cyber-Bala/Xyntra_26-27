import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Evolution.css'

gsap.registerPlugin(ScrollTrigger)

/* ---------------------------------------------------------------------------
   Four machines, drawn in code on a 130 x 90 cell grid (1 cell = 1 particle).
   The particles morph between them as you scroll, and scatter from the cursor.
--------------------------------------------------------------------------- */
const COLS = 130
const ROWS = 90
const CELL = 4
const N = 3600
const C = { cream: '#f4e7c3', amber: '#f2a93b', coral: '#e8475f', dim: '#7a4f1d' }
const PALETTE = [C.cream, C.amber, C.coral, C.dim]

const ERAS = [
  { year: '1982', name: 'The blinking cursor', line: 'One screen, one prompt, and nobody telling you what to build.' },
  { year: '1995', name: 'The beige box', line: 'Computers moved into every room, and the web connected them.' },
  { year: '2010', name: 'The cloud laptop', line: 'A whole workshop fit in a backpack and shipped overnight.' },
  { year: '2026', name: 'You, plus AI', line: 'The tools build alongside you now. You bring the idea and 24 hours.' },
]

function makePainter(ctx) {
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1) }
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }
  const frame = (x, y, w, h, t, c) => { rect(x, y, w, t, c); rect(x, y + h - t, w, t, c); rect(x, y, t, h, c); rect(x + w - t, y, t, h, c) }
  const line = (x0, y0, x1, y1, c, thick = false) => {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
    let err = dx - dy, x = x0, y = y0
    for (;;) { px(x, y, c); if (thick) { px(x + 1, y, c); px(x, y + 1, c); px(x + 1, y + 1, c) } if (x === x1 && y === y1) break; const e2 = 2 * err; if (e2 > -dy) { err -= dy; x += sx } if (e2 < dx) { err += dx; y += sy } }
  }
  const ellipse = (cx, cy, rx, ry, c, every = 1) => {
    for (let a = 0, k = 0; a < 360; a += 1.5, k++) { if (k % every === 0) px(cx + Math.cos(a * Math.PI / 180) * rx, cy + Math.sin(a * Math.PI / 180) * ry, c) }
  }
  return { px, rect, frame, line, ellipse }
}

const SHAPES = [
  // 1 — CRT monitor with a blinking prompt
  (d) => {
    d.frame(22, 10, 86, 56, 3, C.cream)
    d.rect(40, 4, 50, 6, C.dim); d.frame(40, 4, 50, 6, 1, C.cream)
    d.frame(30, 17, 70, 42, 2, C.amber)
    for (let y = 20; y < 57; y += 2) d.rect(33, y, 64, 1, C.dim)
    d.rect(36, 25, 3, 1, C.cream); d.rect(37, 26, 3, 1, C.cream); d.rect(38, 27, 3, 1, C.cream); d.rect(37, 28, 3, 1, C.cream); d.rect(36, 29, 3, 1, C.cream)
    d.rect(44, 28, 6, 3, C.amber)
    d.rect(36, 40, 30, 2, C.amber); d.rect(36, 46, 22, 2, C.amber)
    d.rect(48, 66, 34, 6, C.dim); d.frame(48, 66, 34, 6, 1, C.cream)
    d.rect(36, 72, 58, 4, C.cream)
    d.rect(100, 52, 3, 3, C.coral)
    d.frame(30, 80, 70, 6, 1, C.dim)
  },
  // 2 — beige tower + boxy monitor + keyboard
  (d) => {
    d.frame(34, 8, 62, 46, 3, C.cream)
    d.frame(40, 14, 50, 34, 2, C.amber)
    d.rect(43, 17, 44, 4, C.amber); d.rect(43, 24, 20, 2, C.cream); d.rect(43, 29, 30, 2, C.dim); d.rect(43, 34, 24, 2, C.dim); d.rect(70, 36, 14, 8, C.coral)
    d.rect(56, 54, 18, 4, C.dim)
    d.frame(20, 58, 90, 18, 3, C.cream)
    d.rect(28, 64, 30, 2, C.amber); d.rect(28, 69, 30, 1, C.dim)
    d.rect(94, 64, 4, 4, C.coral); d.rect(86, 64, 4, 4, C.amber)
    for (let x = 30; x < 100; x += 5) { d.rect(x, 79, 4, 3, C.cream); d.rect(x, 84, 4, 2, C.dim) }
  },
  // 3 — thin laptop with panes
  (d) => {
    d.frame(26, 10, 78, 50, 2, C.cream)
    d.rect(29, 13, 72, 4, C.amber)
    d.rect(29, 19, 16, 38, C.dim)
    for (let y = 22; y < 54; y += 5) d.rect(31, y, 12, 2, C.amber)
    d.rect(49, 22, 40, 2, C.cream); d.rect(49, 27, 30, 2, C.amber); d.rect(55, 32, 36, 2, C.cream); d.rect(55, 37, 24, 2, C.amber); d.rect(49, 42, 44, 2, C.dim); d.rect(49, 47, 20, 2, C.cream)
    d.rect(92, 49, 6, 6, C.coral)
    d.line(12, 78, 22, 62, C.cream); d.line(118, 78, 108, 62, C.cream)
    d.rect(22, 62, 86, 2, C.cream); d.rect(12, 78, 106, 3, C.cream)
    d.rect(52, 70, 26, 5, C.dim); d.frame(52, 70, 26, 5, 1, C.amber)
  },
  // 4 — AI core: chunky wireframe cube, orbit rings, circuit nodes
  (d) => {
    const cx = 65, cy = 42
    const top = [[cx, cy - 28], [cx + 26, cy - 14], [cx, cy], [cx - 26, cy - 14]]
    const bot = top.map(([x, y]) => [x, y + 28])
    for (let i = 0; i < 4; i++) { const a = top[i], b = top[(i + 1) % 4]; d.line(a[0], a[1], b[0], b[1], C.cream, true) }
    for (let i = 0; i < 4; i++) { const a = bot[i], b = bot[(i + 1) % 4]; d.line(a[0], a[1], b[0], b[1], C.cream, true) }
    for (let i = 0; i < 4; i++) d.line(top[i][0], top[i][1], bot[i][0], bot[i][1], C.cream, true)
    d.rect(cx - 8, cy - 2, 16, 16, C.amber); d.rect(cx - 4, cy + 2, 8, 8, C.cream); d.frame(cx - 11, cy - 5, 22, 22, 1, C.coral)
    for (let k = 0; k < 2; k++) { d.ellipse(cx, cy + 6 + k, 58, 15, C.amber, 1); d.ellipse(cx, cy + 6 + k, 38, 42, C.cream, 2) }
    ;[[8, 50, 24], [112, 38, 92], [cx + 12, 4, cx + 8], [cx - 44, 80, cx - 20], [cx + 46, 78, cx + 22]].forEach(([x, y, tx], i) => {
      d.rect(x, y, 6, 6, i === 2 ? C.coral : C.amber)
      d.line(x + 3, y + 3, tx, i === 2 ? cy - 28 : cy + 12, C.dim, true)
    })
  },
]

function buildTargets() {
  const sets = SHAPES.map((draw) => {
    const cv = document.createElement('canvas')
    cv.width = COLS; cv.height = ROWS
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    draw(makePainter(ctx))
    const data = ctx.getImageData(0, 0, COLS, ROWS).data
    const cells = []
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 4
      if (data[i + 3] > 128) {
        const r = data[i], g = data[i + 1]
        const ci = r > 230 && g > 215 ? 0 : r > 230 && g > 140 ? 1 : r > 200 && g < 110 ? 2 : 3
        cells.push([x, y, ci])
      }
    }
    for (let i = cells.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [cells[i], cells[j]] = [cells[j], cells[i]] }
    const X = new Float32Array(N), Y = new Float32Array(N), K = new Uint8Array(N)
    for (let i = 0; i < N; i++) {
      const c = cells[i % cells.length]
      X[i] = c[0]; Y[i] = c[1]; K[i] = c[2]
    }
    return { X, Y, K }
  })
  return sets
}

const GLYPHS = '#%&*+=<>/\\|0123456789'
function scramble(el, text) {
  let frame = 0
  const total = 16
  clearInterval(el._scr)
  el._scr = setInterval(() => {
    frame++
    const keep = Math.floor((frame / total) * text.length)
    el.textContent = text.split('').map((ch, i) => (i < keep || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('')
    if (frame >= total) { clearInterval(el._scr); el.textContent = text }
  }, 32)
}

export default function Evolution({ onNavigate }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const yearRef = useRef(null)
  const nameRef = useRef(null)
  const lineRef = useRef(null)
  const barRef = useRef(null)
  const [era, setEra] = useState(0)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // text swap + scramble when the era changes
  useEffect(() => {
    if (!nameRef.current) return
    if (yearRef.current) yearRef.current.textContent = ERAS[era].year
    if (lineRef.current) lineRef.current.textContent = ERAS[era].line
    if (reduced) nameRef.current.textContent = ERAS[era].name
    else scramble(nameRef.current, ERAS[era].name)
  }, [era, reduced])

  useEffect(() => {
    if (reduced) return undefined
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const targets = buildTargets()
    const ox = new Float32Array(N), oy = new Float32Array(N), ovx = new Float32Array(N), ovy = new Float32Array(N)
    const sw = new Float32Array(N), sr = new Float32Array(N)
    for (let i = 0; i < N; i++) { sw[i] = Math.random() * 6.283; sr[i] = 40 + Math.random() * 150 }

    let cssW = 0, cssH = 0, scale = 1, offX = 0, offY = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      cssW = r.width; cssH = r.height
      canvas.width = cssW * dpr; canvas.height = cssH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scale = Math.min(cssW / (COLS * CELL), cssH / (ROWS * CELL))
      offX = (cssW - COLS * CELL * scale) / 2
      offY = (cssH - ROWS * CELL * scale) / 2
    }
    resize()

    const mouse = { x: -999, y: -999 }
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const onLeave = () => { mouse.x = -999; mouse.y = -999 }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    const state = { target: 0, cur: 0, inView: false, raf: 0, lastEra: 0, running: false }
    const ease = (t) => t * t * (3 - 2 * t)

    const frame = () => {
      state.cur += (state.target - state.cur) * 0.12
      const p = Math.min(Math.max(state.cur, 0), 3)
      const i0 = Math.min(Math.floor(p), 2)
      const t = p - i0
      const tt = ease(Math.min(Math.max((t - 0.22) / 0.56, 0), 1))
      const A = targets[i0], B = targets[i0 + 1]
      const eraNow = Math.round(p)
      if (eraNow !== state.lastEra) { state.lastEra = eraNow; setEra(eraNow) }
      section.style.setProperty('--crt', String(Math.max(0, 1 - p / 2.2)))
      if (barRef.current) barRef.current.style.transform = `scaleX(${p / 3})`

      ctx.clearRect(0, 0, cssW, cssH)
      const mid = Math.sin(Math.PI * tt)
      const size = Math.max(2, Math.round(CELL * scale) - 1)
      const R = 90, R2 = R * R
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = PALETTE[c]
        for (let i = 0; i < N; i++) {
          const kc = tt < 0.5 ? A.K[i] : B.K[i]
          if (kc !== c) continue
          let gx = A.X[i] + (B.X[i] - A.X[i]) * tt
          let gy = A.Y[i] + (B.Y[i] - A.Y[i]) * tt
          const ang = sw[i] + tt * 5
          let x = offX + gx * CELL * scale + Math.cos(ang) * sr[i] * mid * scale
          let y = offY + gy * CELL * scale + Math.sin(ang) * sr[i] * mid * scale
          // cursor disintegration
          const dx = x + ox[i] - mouse.x, dy = y + oy[i] - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.01, f = (1 - d / R) * 5
            ovx[i] += (dx / d) * f - (dy / d) * f * 0.5 + (Math.random() - 0.5) * f
            ovy[i] += (dy / d) * f + (dx / d) * f * 0.5 - f * 0.2 + (Math.random() - 0.5) * f
          }
          ovx[i] = (ovx[i] - ox[i] * 0.08) * 0.84; ovy[i] = (ovy[i] - oy[i] * 0.08) * 0.84
          ox[i] += ovx[i]; oy[i] += ovy[i]
          ctx.fillRect(Math.round(x + ox[i]), Math.round(y + oy[i]), size, size)
        }
      }
      if (state.inView || Math.abs(state.target - state.cur) > 0.003) state.raf = requestAnimationFrame(frame)
      else state.running = false
    }
    const kick = () => { if (!state.running) { state.running = true; state.raf = requestAnimationFrame(frame) } }

    const mm = window.matchMedia('(max-width: 860px)')
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * (mm.matches ? 3 : 3.4)),
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => { state.target = Math.min(Math.max((self.progress - 0.05) / 0.82, 0), 1) * 3; kick() },
    })
    // run the loop whenever the canvas is on screen (pinned or not) so hover still works after the pin releases
    const io = new IntersectionObserver(([e]) => { state.inView = e.isIntersecting; if (e.isIntersecting) kick() }, { threshold: 0.05 })
    io.observe(canvas)
    // draw once so the first era is visible before the section is pinned
    state.running = true
    frame()
    const onResize = () => { resize(); ScrollTrigger.refresh() }
    window.addEventListener('resize', onResize)
    return () => {
      st.kill(); io.disconnect(); cancelAnimationFrame(state.raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  if (reduced) {
    return (
      <section className="evo-section evo-static" id="story">
        <h2>Four eras. One idea.</h2>
        <ol>{ERAS.map((e) => (<li key={e.year}><span>{e.year}</span><strong>{e.name}</strong><p>{e.line}</p></li>))}</ol>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="evo-section" id="story" style={{ '--crt': 1 }}>
      <div className="evo-inner">
        <div className="evo-copy">
          <h2 className="evo-title">Four eras. <br />One idea.</h2>
          <div className="evo-era" aria-live="polite">
            <span ref={yearRef} className="evo-year" data-fx="off">1982</span>
            <span ref={nameRef} className="evo-name" data-fx="off">{ERAS[0].name}</span>
            <p ref={lineRef} className="evo-line">{ERAS[0].line}</p>
            {era === 3 && (
              <button type="button" className="evo-cta" onClick={() => onNavigate?.(3)}>Join XYNTRA 26</button>
            )}
          </div>
          <div className="evo-track" aria-hidden="true">
            <div ref={barRef} className="evo-track-fill" />
            {ERAS.map((e, i) => (<span key={e.year} className={`evo-tick ${i <= era ? 'on' : ''}`} style={{ left: `${(i / 3) * 100}%` }}>{e.year}</span>))}
          </div>
        </div>
        <div className="evo-stage">
          <canvas ref={canvasRef} className="evo-canvas" role="img" aria-label="A computer that evolves from a 1980s CRT monitor to a futuristic AI core as you scroll" />
          <div className="evo-scan" aria-hidden="true" />
        </div>
      </div>
      <p className="evo-hint" aria-hidden="true">scroll</p>
    </section>
  )
}
