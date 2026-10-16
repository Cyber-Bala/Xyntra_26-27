import { useEffect } from 'react'

/*
  ParticleHeadings
  ----------------
  Turns every big heading (h1/h2 >= 30px) inside .main-content-view into a field of
  square particles that:
    1. assemble from scattered dust, sweeping left -> right, when the heading scrolls into view
    2. disintegrate when the cursor / finger passes over them, then spring back home

  The real DOM text stays in place (transparent) so screen readers, SEO and selection still work.
  To exclude a heading, add  data-fx="off"  to it.
*/

const SELECTOR = '.main-content-view h1, .main-content-view h2'
const MARGIN = 90              // extra canvas room around the heading so particles can fly out
const MIN_FONT = 30
const MAX_PARTICLES = 9000
const STEP_MS = 1000 / 60
const LEVELS = ['#f6ebcb', '#f4e1ae', '#f3cf80', '#f2a93b'] // cream -> amber (top -> bottom)

const pointer = { x: -9999, y: -9999 }

class ParticleHeading {
  constructor(el, manager) {
    this.el = el
    this.m = manager
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'pt-canvas'
    this.canvas.setAttribute('aria-hidden', 'true')
    this.ctx = this.canvas.getContext('2d')
    this.n = 0
    this.visible = false
    this.revealed = false
    this.awake = false
    this.acc = 0
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible && !this.revealed && this.n) this.startReveal()
      if (this.visible) this.m.wake()
    }, { threshold: 0.15 })
    this.io.observe(el)
    this.build()
  }

  build() {
    const el = this.el
    const rect = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize)
    if (rect.width < 40 || rect.height < 20 || size < MIN_FONT) { this.n = 0; return }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = Math.ceil(rect.width + MARGIN * 2)
    const H = Math.ceil(rect.height + MARGIN * 2)

    // 1. paint the heading's real glyphs (exact browser layout) onto an offscreen canvas
    const off = document.createElement('canvas')
    off.width = W; off.height = H
    const octx = off.getContext('2d', { willReadFrequently: true })
    const grad = octx.createLinearGradient(0, MARGIN, 0, MARGIN + rect.height)
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
        octx.fillText(ch, r.left - rect.left + MARGIN, r.top - rect.top + MARGIN + asc)
      }
    }

    // 2. sample the pixels into particles
    let gap = size >= 160 ? 4 : size >= 80 ? 3 : 2
    let pts
    for (;;) {
      pts = []
      const data = octx.getImageData(0, 0, W, H).data
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const idx = ((y + (gap >> 1)) * W + x + (gap >> 1)) * 4
          if (data[idx + 3] > 110) {
            const lvl = Math.max(0, Math.min(3, Math.floor((235 - data[idx + 1]) / 17)))
            pts.push(x, y, lvl)
          }
        }
      }
      if (pts.length / 3 <= MAX_PARTICLES) break
      gap += 1
    }

    const n = pts.length / 3
    this.n = n
    this.gap = gap
    this.W = W; this.H = H; this.dpr = dpr
    this.hx = new Float32Array(n); this.hy = new Float32Array(n)
    this.x = new Float32Array(n); this.y = new Float32Array(n)
    this.vx = new Float32Array(n); this.vy = new Float32Array(n)
    this.born = new Float32Array(n)
    this.lvl = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      this.hx[i] = pts[i * 3]; this.hy[i] = pts[i * 3 + 1]; this.lvl[i] = pts[i * 3 + 2]
      this.x[i] = this.hx[i]; this.y[i] = this.hy[i]
    }
    this.radius = Math.max(70, Math.min(150, size * 0.95))
    this.strength = Math.max(5, Math.min(9, size / 14))

    // 3. mount
    this.canvas.width = W * dpr; this.canvas.height = H * dpr
    this.canvas.style.width = W + 'px'; this.canvas.style.height = H + 'px'
    this.canvas.style.left = -MARGIN + 'px'; this.canvas.style.top = -MARGIN + 'px'
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    if (!this.canvas.isConnected) el.appendChild(this.canvas)
    el.classList.add('pt-live')

    if (this.revealed) { this.draw(performance.now()) }
    else {
      this.ctx.clearRect(0, 0, W, H)
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) { this.visible = true; this.startReveal() }
    }
  }

  startReveal() {
    this.revealed = true
    const t0 = performance.now()
    const { n, W } = this
    for (let i = 0; i < n; i++) {
      this.born[i] = t0 + (this.hx[i] / W) * 650 + Math.random() * 280
      this.x[i] = this.hx[i] + (Math.random() - 0.5) * 360
      this.y[i] = this.hy[i] + (Math.random() - 0.35) * 240 + 40
      this.vx[i] = 0; this.vy[i] = 0
    }
    this.allBorn = false
    this.awake = true
    this.m.wake()
  }

  nearPointer(rect) {
    const m = this.radius
    return pointer.x > rect.left - m && pointer.x < rect.right + m && pointer.y > rect.top - m && pointer.y < rect.bottom + m
  }

  update(now, dt) {
    if (!this.n || !this.visible) { return false }
    const rect = this.el.getBoundingClientRect()
    const near = this.nearPointer(rect)
    const px = pointer.x - rect.left + MARGIN
    const py = pointer.y - rect.top + MARGIN
    const { n, hx, hy, x, y, vx, vy, born, radius: R, strength: S } = this
    const R2 = R * R
    this.acc += dt
    let steps = 0
    let motion = 0
    while (this.acc >= STEP_MS && steps < 3) {
      this.acc -= STEP_MS
      steps++
      motion = 0
      let allBorn = true
      for (let i = 0; i < n; i++) {
        if (now < born[i]) { allBorn = false; continue }
        if (near) {
          const dx = x[i] - px, dy = y[i] - py
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001
            let f = 1 - d / R
            f = f * f * S
            vx[i] += (dx / d) * f - (dy / d) * f * 0.55 + (Math.random() - 0.5) * f * 0.9
            vy[i] += (dy / d) * f + (dx / d) * f * 0.55 - f * 0.22 + (Math.random() - 0.5) * f * 0.9
          }
        }
        vx[i] = (vx[i] + (hx[i] - x[i]) * 0.085) * 0.82
        vy[i] = (vy[i] + (hy[i] - y[i]) * 0.085) * 0.82
        x[i] += vx[i]; y[i] += vy[i]
        motion += Math.abs(vx[i]) + Math.abs(vy[i]) + Math.abs(hx[i] - x[i]) + Math.abs(hy[i] - y[i])
      }
      this.allBorn = allBorn
    }
    if (steps) this.draw(now)
    if (steps && this.allBorn && !near && motion < n * 0.03) {
      for (let i = 0; i < n; i++) { x[i] = hx[i]; y[i] = hy[i]; vx[i] = 0; vy[i] = 0 }
      this.draw(now)
      return false // asleep
    }
    return true
  }

  draw(now) {
    const { ctx, n, x, y, lvl, born, gap } = this
    ctx.clearRect(0, 0, this.W, this.H)
    for (let L = 0; L < 4; L++) {
      ctx.fillStyle = LEVELS[L]
      for (let i = 0; i < n; i++) {
        if (lvl[i] !== L || now < born[i]) continue
        ctx.fillRect(Math.round(x[i]), Math.round(y[i]), gap, gap)
      }
    }
  }

  destroy() {
    this.io.disconnect()
    this.canvas.remove()
    this.el.classList.remove('pt-live')
  }
}

class Manager {
  constructor() {
    this.items = new Map()
    this.running = false
    this.last = 0
    this.loop = this.loop.bind(this)
  }

  scan() {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (el.dataset.fx === 'off') return
      const existing = this.items.get(el)
      if (!existing) this.items.set(el, new ParticleHeading(el, this))
      else if (!existing.n) existing.build() // was hidden / zero-size earlier
    })
    for (const [el, inst] of this.items) {
      if (!el.isConnected) { inst.destroy(); this.items.delete(el) }
    }
  }

  rebuild() { this.items.forEach((inst) => inst.build()) }

  wake() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    requestAnimationFrame(this.loop)
  }

  loop(now) {
    const dt = Math.min(now - this.last, 50)
    this.last = now
    let any = false
    this.items.forEach((inst) => { if (inst.awake) { inst.awake = inst.update(now, dt); any = any || inst.awake } })
    if (any) requestAnimationFrame(this.loop)
    else this.running = false
  }

  onPointer(e) {
    pointer.x = e.clientX
    pointer.y = e.clientY
    this.items.forEach((inst) => {
      if (inst.visible && inst.n && !inst.awake) {
        if (inst.nearPointer(inst.el.getBoundingClientRect())) inst.awake = true
      }
    })
    this.wake()
  }

  destroy() { this.items.forEach((inst) => inst.destroy()); this.items.clear() }
}

export default function ParticleHeadings() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const manager = new Manager()
    let resizeTimer
    const onPointer = (e) => manager.onPointer(e)
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999 }
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => manager.rebuild(), 250) }

    const start = () => { manager.scan() }
    if (document.fonts?.ready) document.fonts.ready.then(start); else start()
    const rescan = setInterval(() => manager.scan(), 1500)

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      clearInterval(rescan); clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      manager.destroy()
    }
  }, [])
  return null
}
