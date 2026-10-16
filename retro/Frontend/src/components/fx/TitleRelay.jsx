import { useEffect } from 'react'

/* ==========================================================================
   TitleRelay — High-Fidelity Airborne Fluid Disintegration & Reassembly
   --------------------------------------------------------------------------
   A living, unified retro particle swarm that connects all section headings
   across both the Landing Page and the Registration Flow:
     XYNTRA  ──fluid air stream──►  BUILD WHAT'S NEXT.  ──► ... ──► REGISTER
   
   Fluid Dynamics:
   - True multi-octave atmospheric wind currents (billows, wave eddies, micro-vortices).
   - Scroll-driven velocity drafting: trailing tails follow the scroll vector.
   - Absolutely NO central circles or artificial rings.
   - Initial assemble-from-dust on page load.
   - Fluid vortex repulsion under the cursor.
   - Full support for single-heading and multi-heading stages.
   ========================================================================== */

const SELECTOR = [
  '.main-content-view h1',
  '.main-content-view h2',
  '.main-content-view .registration-title',
  '.main-content-view .form-title h3',
  '.main-content-view .stage-card h2',
].join(', ')

const MIN_FONT = 18
const MAX_N = 7500
const LEVELS = ['#f6ebcb', '#f4e1ae', '#f3cf80', '#f2a93b'] // cream -> phosphor amber
const CORAL = '#e8475f'
const GOLD_SPARK = '#ffca68'

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const ease = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t

/* Offscreen sampling: render glyphs and extract particle grid points */
function sampleHeading(el) {
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const size = parseFloat(cs.fontSize)
  if (rect.width < 24 || rect.height < 14 || size < MIN_FONT) return null

  const PAD = 10
  const W = Math.ceil(rect.width + PAD * 2)
  const H = Math.ceil(rect.height + PAD * 2)
  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const octx = off.getContext('2d', { willReadFrequently: true })
  const grad = octx.createLinearGradient(0, PAD, 0, PAD + rect.height)
  grad.addColorStop(0, '#f6ebcb')
  grad.addColorStop(1, '#f2a93b')
  octx.fillStyle = grad
  octx.textBaseline = 'alphabetic'

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let node
  while ((node = walker.nextNode())) {
    if (!node.nodeValue.trim()) continue
    const pcs = getComputedStyle(node.parentElement)
    octx.font = `${pcs.fontStyle} ${pcs.fontWeight} ${pcs.fontSize} ${pcs.fontFamily}`
    const asc = octx.measureText('M').fontBoundingBoxAscent || parseFloat(pcs.fontSize) * 0.9
    const upper = pcs.textTransform === 'uppercase'
    const text = node.nodeValue
    for (let i = 0; i < text.length; i++) {
      if (!text[i].trim()) continue
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getClientRects()[0]
      if (!r || !r.width) continue
      const ch = upper ? text[i].toUpperCase() : text[i]
      octx.fillText(ch, r.left - rect.left + PAD, r.top - rect.top + PAD + asc)
    }
  }

  let gap = size >= 120 ? 4 : size >= 60 ? 3 : 2
  let pts
  for (;;) {
    pts = []
    const data = octx.getImageData(0, 0, W, H).data
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        const idx = ((y + (gap >> 1)) * W + x + (gap >> 1)) * 4
        if (data[idx + 3] > 100) {
          const lvl = Math.max(0, Math.min(3, Math.floor((235 - data[idx + 1]) / 17)))
          pts.push(x - PAD, y - PAD, lvl)
        }
      }
    }
    if (pts.length / 3 <= MAX_N) break
    gap += 1
  }

  const n = pts.length / 3
  if (!n) return null
  const X = new Float32Array(n)
  const Y = new Float32Array(n)
  const L = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    X[i] = pts[i * 3]
    Y[i] = pts[i * 3 + 1]
    L[i] = pts[i * 3 + 2]
  }
  return { el, gap, n, X, Y, L, rectWidth: rect.width }
}

class RelayEngine {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'relay-canvas'
    this.canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.heads = []
    this.N = 0
    this.pointer = { x: -9999, y: -9999, t: 0 }
    this.raf = 0
    this.st = { cur: 0, prev: 0 }
    this.lastKey = ''
    this.t0 = performance.now()
    this.resize()
    this.tick = this.tick.bind(this)
    this.raf = requestAnimationFrame(this.tick)
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.vw = window.innerWidth
    this.vh = window.innerHeight
    this.canvas.width = this.vw * this.dpr
    this.canvas.height = this.vh * this.dpr
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.lastKey = ''
  }

  build() {
    const rawList = [...document.querySelectorAll(SELECTOR)].filter((el) => el.dataset.fx !== 'off')
    // Deduplicate DOM elements
    const uniqueElements = Array.from(new Set(rawList))
    this.heads.forEach((h) => h.el.classList.remove('pt-live'))
    const sampled = uniqueElements.map(sampleHeading).filter(Boolean)
    if (!sampled.length) {
      this.heads = []
      this.ctx.clearRect(0, 0, this.vw, this.vh)
      return
    }

    this.sig = sampled.map((h) => h.el)
    this.N = Math.min(MAX_N, sampled.reduce((m, h) => Math.max(m, h.n), 0))
    const N = this.N

    sampled.forEach((h) => {
      const perm = Array.from({ length: h.n }, (_, i) => i)
      for (let i = perm.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0
        ;[perm[i], perm[j]] = [perm[j], perm[i]]
      }
      h.hx = new Float32Array(N)
      h.hy = new Float32Array(N)
      h.hl = new Uint8Array(N)
      for (let j = 0; j < N; j++) {
        const k = perm[j % h.n]
        h.hx[j] = h.X[k]
        h.hy[j] = h.Y[k]
        h.hl[j] = h.L[k]
      }
    })
    this.heads = sampled

    // Rich fluid dynamics & wind octaves
    this.ox = new Float32Array(N)
    this.oy = new Float32Array(N)
    this.vx = new Float32Array(N)
    this.vy = new Float32Array(N)
    this.swX = new Float32Array(N)
    this.swY = new Float32Array(N)
    this.spreadX = new Float32Array(N)
    this.spreadY = new Float32Array(N)
    this.lag = new Float32Array(N)
    this.curlTh = new Float32Array(N)
    this.curlR = new Float32Array(N)
    this.curlSpeed = new Float32Array(N)
    this.sparkType = new Uint8Array(N) // 0: normal, 1: gold, 2: coral

    // Assemble-from-dust intro properties
    this.born = new Float32Array(N)
    this.introX = new Float32Array(N)
    this.introY = new Float32Array(N)

    const now = performance.now()
    const firstHead = sampled[0]
    const fW = firstHead.rectWidth || 600

    for (let j = 0; j < N; j++) {
      this.swX[j] = Math.random() * Math.PI * 2
      this.swY[j] = Math.random() * Math.PI * 2
      // Broader, more expansive billow spread
      this.spreadX[j] = 80 + Math.random() * 260
      this.spreadY[j] = 45 + Math.random() * 150
      this.lag[j] = Math.random()
      this.curlTh[j] = Math.random() * Math.PI * 2
      this.curlR[j] = 14 + Math.random() * 48
      this.curlSpeed[j] = 0.0016 + Math.random() * 0.0038

      const randSpark = Math.random()
      this.sparkType[j] = randSpark < 0.09 ? 2 : randSpark < 0.22 ? 1 : 0

      // Sweeping air wave intro
      const letterPos = firstHead.hx[j] / Math.max(fW, 100)
      this.born[j] = now + letterPos * 640 + Math.random() * 240
      this.introX[j] = (Math.random() - 0.5) * (this.vw * 0.85)
      this.introY[j] = (Math.random() - 0.45) * 320 + 80
    }

    this.introUntil = now + 1650
    this.st.cur = 0
    this.st.prev = 0
    this.lastKey = ''
  }

  needsRebuild() {
    const rawList = [...document.querySelectorAll(SELECTOR)].filter((el) => el.dataset.fx !== 'off')
    const uniqueElements = Array.from(new Set(rawList))
    const ok = uniqueElements.filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width >= 24 && r.height >= 14 && parseFloat(getComputedStyle(el).fontSize) >= MIN_FONT
    })
    if (ok.length !== this.sig?.length) return true
    return ok.some((el, i) => el !== this.sig[i])
  }

  setLive(h, on) {
    if (!h) return
    if (on && !h.el.classList.contains('pt-live')) h.el.classList.add('pt-live')
    if (!on && h.el.classList.contains('pt-live')) h.el.classList.remove('pt-live')
  }

  tick(now) {
    this.raf = requestAnimationFrame(this.tick)
    const heads = this.heads
    const M = heads.length
    if (!M || document.hidden) return
    const { vw, vh, ctx, N } = this

    const rects = heads.map((h) => h.el.getBoundingClientRect())
    const cs = rects.map((r) => r.top + r.height / 2)

    // Smooth focal plane tracker
    const focalY = vh * 0.44
    let target = 0

    if (M === 1) {
      // Single-heading stage (e.g. Email verification, Status, Payment pages)
      const r0 = rects[0]
      const trigger = Math.min(vh * 0.40, r0.bottom + window.scrollY - 20)
      const dA = clamp((trigger - r0.bottom) / (vh * 0.48), 0, 1)
      target = dA // goes from 0 (assembled) to 1 (disintegrating down into air)
    } else {
      if (focalY <= cs[0]) {
        target = 0
      } else if (focalY >= cs[cs.length - 1]) {
        target = cs.length - 1
      } else {
        for (let i = 0; i < cs.length - 1; i++) {
          if (focalY >= cs[i] && focalY < cs[i + 1]) {
            const span = cs[i + 1] - cs[i]
            target = span > 0 ? i + (focalY - cs[i]) / span : i
            break
          }
        }
      }
    }

    // Exponential smoothing for fluid air inertia
    const prevCur = this.st.cur
    this.st.cur += (target - this.st.cur) * 0.13
    const scrollVel = (this.st.cur - prevCur) * 10.0
    this.st.prev = prevCur

    let A, B, tt, mid, rA, rB, HA, HB

    if (M === 1) {
      A = 0
      B = 0
      tt = ease(this.st.cur)
      mid = Math.sin(Math.PI * 0.5 * tt) // rises to 1 as it flows away
      rA = rects[0]
      rB = rects[0]
      HA = heads[0]
      HB = heads[0]
      this.setLive(heads[0], tt < 0.90)
    } else {
      const p = clamp(this.st.cur, 0, M - 1)
      A = Math.min(Math.floor(p), M - 2)
      B = Math.min(A + 1, M - 1)
      const rawT = p - A

      // Wider, more expansive fluid transition
      tt = ease(clamp((rawT - 0.05) / 0.90, 0, 1))
      mid = Math.sin(Math.PI * tt)

      rA = rects[A]
      rB = rects[B]
      HA = heads[A]
      HB = heads[B]

      heads.forEach((h, i) => {
        const hide =
          (i === A && tt < 0.95) ||
          (i === B && tt > 0.05)
        this.setLive(h, hide)
      })
    }

    const introActive = now < this.introUntil
    const pointerRecent = now - this.pointer.t < 1400
    const inFlight = mid > 0.001

    const key = `${rA.top | 0}|${rA.left | 0}|${rB.top | 0}|${this.st.cur.toFixed(3)}|${vw}|${vh}`
    if (!pointerRecent && !introActive && !inFlight && !this.energy && key === this.lastKey) return
    this.lastKey = key

    const gapSize = lerp(HA.gap, HB.gap, tt)
    const size = Math.max(2, Math.round(gapSize))
    const px = this.pointer.x
    const py = this.pointer.y
    const R = 130
    const R2 = R * R

    const {
      ox, oy, vx, vy,
      swX, swY, spreadX, spreadY, lag,
      curlTh, curlR, curlSpeed, sparkType,
      born, introX, introY
    } = this

    let energy = 0
    ctx.clearRect(0, 0, vw, vh)

    for (let L = 0; L < 4; L++) {
      ctx.fillStyle = LEVELS[L]
      for (let j = 0; j < N; j++) {
        const lvl = tt >= 0.5 ? HB.hl[j] : HA.hl[j]
        if (lvl !== L) continue

        // 1. Base travel trajectory: follows the scroll path from Heading A to Heading B
        const ax = rA.left + HA.hx[j]
        const ay = rA.top + HA.hy[j]
        const bx = rB.left + HB.hx[j]
        const by = rB.top + HB.hy[j]

        let x = lerp(ax, bx, tt)
        let y = lerp(ay, by, tt)

        // 2. Pronounced Multi-Octave Fluid Flow (NO CIRCLE, NO RING)
        if (mid > 0.001) {
          // Octave 1: Broad rolling atmospheric billow
          const billowX =
            Math.sin(swX[j] + tt * 3.8 + now * 0.0009) * spreadX[j] * mid
          const billowY =
            Math.cos(swY[j] * 1.8 + tt * 3.2 + now * 0.0007) * spreadY[j] * mid

          // Octave 2: Turbulent cross-current waves
          const waveX =
            Math.cos(swY[j] * 2.6 + tt * 5.5 + now * 0.0016) * (spreadX[j] * 0.45) * mid
          const waveY =
            Math.sin(swX[j] * 2.2 + tt * 4.8 + now * 0.0014) * (spreadY[j] * 0.5) * mid

          // Vertical draft & trailing tail (dynamically stretched by scroll velocity)
          const vertSpan = M === 1 ? vh * 0.45 : by - ay
          const trailingTail =
            (lag[j] - 0.5) *
            Math.min(420, Math.max(90, Math.abs(vertSpan) * 0.55)) *
            mid

          // Dynamic velocity stretch along the air stream
          const velocityStretch = scrollVel * (lag[j] * 12.0) * mid

          // Octave 3: Micro-vortex eddies
          const curlX = Math.cos(curlTh[j] + now * curlSpeed[j] + tt * 4.5) * curlR[j] * mid
          const curlY = Math.sin(curlTh[j] + now * curlSpeed[j] + tt * 4.5) * curlR[j] * mid

          x += billowX + waveX + curlX
          y += billowY + waveY + trailingTail + velocityStretch + curlY
        }

        // 3. Assemble-from-dust intro (XYNTRA & Registration titles)
        if (introActive && A === 0) {
          if (now < born[j]) continue
          const introProg = clamp((now - born[j]) / 720)
          if (introProg < 1) {
            const s = ease(introProg)
            x = lerp(ax + introX[j], x, s)
            y = lerp(ay + introY[j], y, s)
          }
        }

        // 4. Interactive Cursor Swirl Wake with fluid spring physics
        const ddx = x + ox[j] - px
        const ddy = y + oy[j] - py
        const d2 = ddx * ddx + ddy * ddy
        if (d2 < R2) {
          const d = Math.sqrt(d2) + 0.01
          let f = 1 - d / R
          f = f * f * 7.5
          // Radial repulsion + tangential swirl
          const swirl = (1 - d / R) * 4.5
          vx[j] +=
            (ddx / d) * f -
            (ddy / d) * swirl +
            (Math.random() - 0.5) * f * 0.9
          vy[j] +=
            (ddy / d) * f +
            (ddx / d) * swirl -
            f * 0.25 +
            (Math.random() - 0.5) * f * 0.9
        }

        vx[j] = (vx[j] - ox[j] * 0.08) * 0.83
        vy[j] = (vy[j] - oy[j] * 0.08) * 0.83
        ox[j] += vx[j]
        oy[j] += vy[j]
        energy += Math.abs(ox[j]) + Math.abs(oy[j])

        const fx = x + ox[j]
        const fy = y + oy[j]
        if (fx < -14 || fx > vw + 14 || fy < -14 || fy > vh + 14) continue

        // Sparkle and hot ember accents in mid-flight
        if (mid > 0.25 && sparkType[j] === 2) {
          ctx.fillStyle = CORAL
          ctx.fillRect(Math.round(fx), Math.round(fy), size + 1, size + 1)
          ctx.fillStyle = LEVELS[L]
        } else if (mid > 0.25 && sparkType[j] === 1) {
          ctx.fillStyle = GOLD_SPARK
          ctx.fillRect(Math.round(fx), Math.round(fy), size, size)
          ctx.fillStyle = LEVELS[L]
        } else {
          ctx.fillRect(Math.round(fx), Math.round(fy), size, size)
        }
      }
    }

    this.energy = energy > N * 0.04
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.heads.forEach((h) => h.el.classList.remove('pt-live'))
    this.canvas.remove()
  }
}

export default function TitleRelay() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const engine = new RelayEngine()
    let resizeTimer

    const start = () => engine.build()
    if (document.fonts?.ready) document.fonts.ready.then(start); else start()

    // Watch for route transitions & DOM alterations
    const watch = setInterval(() => {
      if (engine.needsRebuild()) engine.build()
    }, 600)

    // MutationObserver on content container for instantaneous route switch detection
    const mainView = document.querySelector('.main-content-view') || document.body
    const mo = new MutationObserver(() => {
      if (engine.needsRebuild()) engine.build()
    })
    mo.observe(mainView, { childList: true, subtree: true })

    const onMove = (e) => {
      engine.pointer.x = e.clientX
      engine.pointer.y = e.clientY
      engine.pointer.t = performance.now()
    }
    const onLeave = () => {
      engine.pointer.x = -9999
      engine.pointer.y = -9999
    }
    const onResize = () => {
      engine.resize()
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => engine.build(), 200)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('popstate', start)
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      clearInterval(watch)
      clearTimeout(resizeTimer)
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('popstate', start)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      engine.destroy()
    }
  }, [])

  return null
}
