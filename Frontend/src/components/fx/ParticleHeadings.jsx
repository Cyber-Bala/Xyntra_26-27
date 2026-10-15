import { useEffect } from 'react'

/*
  ParticleHeadings
  ----------------
  High-performance interactive particle typography:
    1. Assembles from scattered dust sweeping across whenever entering view
       (both when scrolling down AND scrolling up, and on every page refresh).
    2. Disintegrates into scattering embers when cursor/finger touches or passes over,
       then springs back smoothly into place.
    3. Auto-sleeps when settled to maintain 60 FPS locked render speed and 0% idle CPU.
    4. Fallback layout prevents text disappearing during font load or GSAP autoAlpha.
*/

const SELECTOR = '.main-content-view h1, .main-content-view h2, .registration-view h1, .registration-view h2, .register-heading h1, .register-heading h2, .register-stage-page h1, .register-stage-page h2'
const MARGIN = 80
const MIN_FONT = 22
const MAX_PARTICLES = 8500
const STEP_MS = 1000 / 60
const LEVELS = ['#f6ebcb', '#f4e1ae', '#f3cf80', '#f2a93b'] // cream -> amber

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

    // Bidirectional scroll reveal trigger
    this.io = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting
      this.visible = isVisible

      if (isVisible) {
        if (!this.n) this.build()
        if (this.n) {
          this.startReveal()
          this.awake = true
          this.m.wake()
        }
      } else {
        // Reset when scrolled out of view so scrolling back (up or down) triggers assembly again
        this.revealed = false
        this.awake = false
      }
    }, { threshold: 0.08, rootMargin: '30px 0px 30px 0px' })

    this.io.observe(el)
    this.build()
  }

  build() {
    const el = this.el
    const rect = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize) || 0
    if (rect.width < 30 || rect.height < 15 || size < MIN_FONT) {
      this.n = 0
      el.classList.remove('pt-live')
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const W = Math.ceil(rect.width + MARGIN * 2)
    const H = Math.ceil(rect.height + MARGIN * 2)

    // 1. Paint real glyphs onto an offscreen canvas
    const off = document.createElement('canvas')
    off.width = W
    off.height = H
    const octx = off.getContext('2d', { willReadFrequently: true })
    const grad = octx.createLinearGradient(0, MARGIN, 0, MARGIN + rect.height)
    grad.addColorStop(0, '#f6ebcb')
    grad.addColorStop(1, '#f2a93b')
    octx.fillStyle = grad
    octx.textBaseline = 'alphabetic'

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    let node
    let drawnCount = 0

    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue
      const parent = node.parentElement || el
      const pcs = getComputedStyle(parent)
      octx.font = `${pcs.fontStyle} ${pcs.fontWeight} ${pcs.fontSize} ${pcs.fontFamily}`
      const asc = octx.measureText('M').fontBoundingBoxAscent || parseFloat(pcs.fontSize) * 0.88
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
        drawnCount++
      }
    }

    // Fallback: If range rects were 0 (e.g. parent temporarily autoAlpha: 0), direct render
    if (drawnCount === 0) {
      octx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      octx.textAlign = cs.textAlign === 'center' ? 'center' : 'left'
      const xPos = cs.textAlign === 'center' ? W / 2 : MARGIN
      const asc = octx.measureText('M').fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.88
      const text = el.innerText || el.textContent || ''
      const lines = text.split('\n').filter(Boolean)
      const lh = parseFloat(cs.lineHeight) || size * 1.15
      lines.forEach((line, idx) => {
        const str = cs.textTransform === 'uppercase' ? line.toUpperCase() : line
        octx.fillText(str, xPos, MARGIN + asc + idx * lh)
      })
    }

    // 2. Sample pixel data ONCE
    const imgData = octx.getImageData(0, 0, W, H).data
    let gap = size >= 160 ? 4 : size >= 80 ? 3 : 2
    let ptsByLvl = [[], [], [], []]
    let totalPts = 0

    for (;;) {
      ptsByLvl = [[], [], [], []]
      totalPts = 0
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const idx = ((y + (gap >> 1)) * W + x + (gap >> 1)) * 4
          if (imgData[idx + 3] > 110) {
            const lvl = Math.max(0, Math.min(3, Math.floor((235 - imgData[idx + 1]) / 17)))
            ptsByLvl[lvl].push(x, y)
            totalPts++
          }
        }
      }
      if (totalPts <= MAX_PARTICLES) break
      gap += 1
    }

    if (totalPts === 0) {
      this.n = 0
      el.classList.remove('pt-live')
      return
    }

    const n = totalPts
    this.n = n
    this.gap = gap
    this.W = W
    this.H = H
    this.dpr = dpr

    this.hx = new Float32Array(n)
    this.hy = new Float32Array(n)
    this.x = new Float32Array(n)
    this.y = new Float32Array(n)
    this.vx = new Float32Array(n)
    this.vy = new Float32Array(n)
    this.born = new Float32Array(n)

    // Contiguous level ranges for ultra-fast single-pass rendering
    this.lvlRanges = []
    let cursor = 0
    for (let L = 0; L < 4; L++) {
      const arr = ptsByLvl[L]
      const count = arr.length >> 1
      const start = cursor
      const end = cursor + count
      this.lvlRanges[L] = [start, end]
      for (let k = 0; k < arr.length; k += 2) {
        this.hx[cursor] = arr[k]
        this.hy[cursor] = arr[k + 1]
        this.x[cursor] = arr[k]
        this.y[cursor] = arr[k + 1]
        cursor++
      }
    }

    this.radius = Math.max(70, Math.min(150, size * 0.95))
    this.strength = Math.max(5, Math.min(9, size / 14))

    // 3. Mount canvas
    this.canvas.width = (W * dpr) | 0
    this.canvas.height = (H * dpr) | 0
    this.canvas.style.width = W + 'px'
    this.canvas.style.height = H + 'px'
    this.canvas.style.left = -MARGIN + 'px'
    this.canvas.style.top = -MARGIN + 'px'
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    if (!this.canvas.isConnected) el.appendChild(this.canvas)
    el.classList.add('pt-live')

    if (this.revealed) {
      this.draw(performance.now())
    } else {
      this.ctx.clearRect(0, 0, W, H)
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        this.visible = true
        this.startReveal()
      }
    }
  }

  startReveal() {
    this.revealed = true
    const t0 = performance.now()
    const { n, W, hx, hy, born, x, y, vx, vy } = this
    for (let i = 0; i < n; i++) {
      born[i] = t0 + (hx[i] / W) * 600 + Math.random() * 250
      x[i] = hx[i] + (Math.random() - 0.5) * 320
      y[i] = hy[i] + (Math.random() - 0.35) * 220 + 35
      vx[i] = 0
      vy[i] = 0
    }
    this.allBorn = false
    this.awake = true
    this.m.wake()
  }

  nearPointer(rect) {
    const m = this.radius
    return (
      pointer.x > rect.left - m &&
      pointer.x < rect.right + m &&
      pointer.y > rect.top - m &&
      pointer.y < rect.bottom + m
    )
  }

  update(now, dt) {
    if (!this.n || !this.visible) return false

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
        if (now < born[i]) {
          allBorn = false
          continue
        }

        // Particle disintegration from pointer
        if (near) {
          const dx = x[i] - px
          const dy = y[i] - py
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001
            let f = 1 - d / R
            f = f * f * S
            vx[i] += (dx / d) * f - (dy / d) * f * 0.55 + (Math.random() - 0.5) * f * 0.8
            vy[i] += (dy / d) * f + (dx / d) * f * 0.55 - f * 0.2 + (Math.random() - 0.5) * f * 0.8
          }
        }

        // Spring back home
        vx[i] = (vx[i] + (hx[i] - x[i]) * 0.088) * 0.82
        vy[i] = (vy[i] + (hy[i] - y[i]) * 0.088) * 0.82
        x[i] += vx[i]
        y[i] += vy[i]

        motion += Math.abs(vx[i]) + Math.abs(vy[i]) + Math.abs(hx[i] - x[i]) + Math.abs(hy[i] - y[i])
      }
      this.allBorn = allBorn
    }

    if (steps) this.draw(now)

    // Auto-sleep when particles return home and pointer is clear
    if (steps && this.allBorn && !near && motion < n * 0.035) {
      for (let i = 0; i < n; i++) {
        x[i] = hx[i]
        y[i] = hy[i]
        vx[i] = 0
        vy[i] = 0
      }
      this.draw(now)
      return false
    }

    return true
  }

  // Fast single-pass draw grouping particles by color
  draw(now) {
    const { ctx, x, y, born, gap, lvlRanges } = this
    ctx.clearRect(0, 0, this.W, this.H)

    for (let L = 0; L < 4; L++) {
      const [start, end] = lvlRanges[L]
      if (start >= end) continue
      ctx.fillStyle = LEVELS[L]

      for (let i = start; i < end; i++) {
        if (now < born[i]) continue
        ctx.fillRect((x[i] + 0.5) | 0, (y[i] + 0.5) | 0, gap, gap)
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
      if (!existing) {
        this.items.set(el, new ParticleHeading(el, this))
      } else if (!existing.n) {
        existing.build()
      }
    })

    for (const [el, inst] of this.items) {
      if (!el.isConnected) {
        inst.destroy()
        this.items.delete(el)
      }
    }
  }

  rebuild() {
    this.items.forEach((inst) => inst.build())
  }

  wake() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    requestAnimationFrame(this.loop)
  }

  loop(now) {
    const dt = Math.min(now - this.last, 50)
    this.last = now
    let anyActive = false

    this.items.forEach((inst) => {
      if (inst.awake) {
        inst.awake = inst.update(now, dt)
        anyActive = anyActive || inst.awake
      }
    })

    if (anyActive) {
      requestAnimationFrame(this.loop)
    } else {
      this.running = false
    }
  }

  onPointer(e) {
    pointer.x = e.clientX
    pointer.y = e.clientY
    this.checkPointerNear()
  }

  checkPointerNear() {
    if (pointer.x < 0) return
    this.items.forEach((inst) => {
      if (inst.visible && inst.n && !inst.awake) {
        if (inst.nearPointer(inst.el.getBoundingClientRect())) {
          inst.awake = true
        }
      }
    })
    this.wake()
  }

  destroy() {
    this.items.forEach((inst) => inst.destroy())
    this.items.clear()
  }
}

export default function ParticleHeadings() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const manager = new Manager()
    let resizeTimer

    const onPointer = (e) => manager.onPointer(e)
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    const onScroll = () => {
      manager.checkPointerNear()
    }
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => manager.rebuild(), 200)
    }

    // Initial scan and font load refresh
    manager.scan()
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => manager.rebuild())
    }

    window.addEventListener('load', () => manager.rebuild())
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    const onRoute = () => {
      setTimeout(() => manager.scan(), 60)
    }
    window.addEventListener('popstate', onRoute)

    // MutationObserver catches dynamic DOM changes efficiently (e.g. switching to / from registration)
    const observer = new MutationObserver(() => manager.scan())
    const container = document.getElementById('root') || document.body
    observer.observe(container, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      clearTimeout(resizeTimer)
      window.removeEventListener('load', () => manager.rebuild())
      window.removeEventListener('popstate', onRoute)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      manager.destroy()
    }
  }, [])

  return null
}
