import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import cassetteStartImg from '@/assets/images/cassette-start.webp'
import cassetteEndImg from '@/assets/images/cassette-end.webp'
import PixelHeading from './PixelHeading.jsx'
import AudioVisualizer from './AudioVisualizer.jsx'
import './Timeline.css'

/**
 * XYNTRA Scroll Tape Timeline:
 * - Copper magnetic tape unreels from the first cassette as you scroll.
 * - Tape is connected from the top of the section and drops directly aligned into the first spool rim.
 * - Reduced compact scroll length for fluid, fast, responsive interaction.
 * - Unified deep midnight blue atmospheric background covering 100% of the section.
 * - Absolute full-coverage canvas (#tape) guaranteeing tape remains continuously visible with zero cutoff.
 * - Spool hubs rotate with exact physical gear synchronization based on tape length pulled.
 * - Neon lime pins illuminate on the tape, connecting beams shoot to cards, and cards slide & fade in.
 * - Seamlessly wraps into the second cassette at the end.
 */

const TIMELINE_STEPS = [
  {
    no: '01',
    title: 'IDEA',
    desc: 'Start with a spark. Pick the problem you want to solve and shape the concept.',
  },
  {
    no: '02',
    title: 'BUILD',
    desc: 'Turn the concept into something that works. Bring your team and your tools.',
  },
  {
    no: '03',
    title: 'SUBMIT',
    desc: 'Package what you made and hand it in before the clock stops.',
  },
  {
    no: '04',
    title: 'SHOWCASE',
    desc: 'Demo it to the judges and the crowd. Show what a brighter tomorrow looks like.',
  },
]

// 8-tooth cassette reel hub SVG matching the physical cutouts
function CassetteHub({ style, hubRef, className = '' }) {
  return (
    <svg
      className={`hub ${className}`}
      ref={hubRef}
      style={style}
      viewBox="-17 -17 34 34"
      aria-hidden="true"
    >
      <circle r="17" fill="#06151f" />
      <circle r="7.5" fill="#081a28" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(0)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(45)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(90)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(135)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(180)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(225)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(270)" />
      <rect x="-2.2" y="-14.5" width="4.4" height="6.5" rx="1" fill="#e8eef0" transform="rotate(315)" />
    </svg>
  )
}

export default function Timeline() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const startCassetteRef = useRef(null)
  const endCassetteRef = useRef(null)
  const stepsRef = useRef([])
  const hubsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const start = startCassetteRef.current
    const end = endCassetteRef.current
    const steps = stepsRef.current.filter(Boolean)
    const hubs = hubsRef.current.filter(Boolean)
    const section = sectionRef.current
    if (!start || !end || !steps.length || !section) return

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduce = mql.matches
    const onReducedMotionChange = (e) => {
      reduce = e.matches
      dirty = true
    }
    mql.addEventListener('change', onReducedMotionChange)

    // Palettes & Constants
    const PAL = [
      [74, 42, 28], [96, 56, 36], [132, 80, 52], [170, 108, 72],
      [205, 142, 100], [160, 100, 66], [112, 66, 42], [88, 50, 32],
      [126, 76, 48], [186, 124, 86], [222, 170, 128], [150, 92, 60],
      [100, 58, 38],
    ]
    const PIN = '#b9f23c'
    const P2 = PAL.concat(PAL.slice().reverse())

    function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
    function lerp(a, b, t) { return a + (b - a) * t }
    function sstep(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t) }

    function pal(t) {
      const n = P2.length
      const f = ((t % 1) + 1) % 1 * n
      const i = Math.floor(f)
      const u = f - i
      const a = P2[i % n]
      const b = P2[(i + 1) % n]
      return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]
    }

    function lift(c) {
      return [clamp(c[0], 0, 255), clamp(c[1], 0, 255), clamp(c[2], 0, 255)]
    }

    // Catmull-Rom interpolation
    function cr(p0, p1, p2, p3, t) {
      const t2 = t * t, t3 = t2 * t
      return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      }
    }

    let vw = 0, vh = 0, dpr = 1, k = 1, k1 = 1, secHeight = 0, endTop = 0
    let pts = [], info = []
    let exitPt = { x: 0, y: 0 }, entryPt = { x: 0, y: 0 }
    let sExit = 0, sEnter = 0, sEnd = 0
    const palLen = 420
    let dirty = true
    let animId = null

    function nearestS(pt, a, b) {
      let best = 1e18, bs = 0
      for (let i = a; i <= b; i++) {
        if (!pts[i]) continue
        const dd = Math.hypot(pts[i].x - pt.x, pts[i].y - pt.y)
        if (dd < best) { best = dd; bs = pts[i].s }
      }
      return bs
    }

    function layout() {
      vw = window.innerWidth
      vh = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      const secRect = section.getBoundingClientRect()
      secHeight = Math.max(section.offsetHeight, Math.round(secRect.height))

      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(secHeight * dpr)
      canvas.style.width = vw + 'px'
      canvas.style.height = secHeight + 'px'

      const mobile = vw < 760
      k = clamp(vw / 1308, 0.42, 1.15)
      section.style.setProperty('--k', k)

      const r1 = start.getBoundingClientRect()
      const r2 = end.getBoundingClientRect()
      k1 = r1.width / 342
      const k2 = r2.width / 368

      // Local positions relative to section top-left (zero scroll/parent dependency)
      const startLocal = {
        left: r1.left - secRect.left,
        top: r1.top - secRect.top,
        width: r1.width,
        height: r1.height,
      }
      const endLocal = {
        left: r2.left - secRect.left,
        top: r2.top - secRect.top,
        width: r2.width,
        height: r2.height,
      }
      endTop = endLocal.top

      // Precise reel centres based on actual hub SVG percentages
      const L1 = {
        x: startLocal.left + startLocal.width * 0.3010,
        y: startLocal.top + startLocal.height * 0.3220,
      }
      const R1 = {
        x: startLocal.left + startLocal.width * 0.6460,
        y: startLocal.top + startLocal.height * 0.3760,
      }
      const p1 = startLocal.width * 0.0965

      // Tape exits cassette 1 below the right spool on the right rim
      const X1 = {
        x: startLocal.left + startLocal.width * 0.95,
        y: startLocal.top + startLocal.height * 0.58,
      }

      // Cassette 2 (end): left hub = 24.60%, 55.90%; right hub = 55.80%, 43.70%
      const L2 = {
        x: endLocal.left + endLocal.width * 0.2460,
        y: endLocal.top + endLocal.height * 0.5590,
      }
      const R2 = {
        x: endLocal.left + endLocal.width * 0.5580,
        y: endLocal.top + endLocal.height * 0.4370,
      }
      const p2 = endLocal.width * 0.090
      const q = 0.7071
      exitPt = X1

      const cx = mobile ? vw * 0.13 : vw * 0.5
      const amp = mobile ? vw * 0.045 : vw * 0.075

      info = steps.map((el, i) => {
        const card = el.querySelector('.card')
        const r = el.getBoundingClientRect()
        // Alternate: Step 1 (0): left (-1), Step 2 (1): right (1), Step 3 (2): left (-1), Step 4 (3): right (1)
        const side = mobile ? 1 : (i % 2 === 0 ? -1 : 1)
        const localStepTop = r.top - secRect.top
        const cardWidth = card ? card.offsetWidth : Math.min(vw * 0.34, 360)
        // Resting position in section coordinates (immune to CSS slide animation translate3d)
        const restingLeft = mobile ? 0.27 * vw : (side < 0 ? 0.04 * vw : (vw - 0.04 * vw - cardWidth))
        const targetEdge = side < 0 ? (restingLeft + cardWidth) : restingLeft

        return {
          el: card,
          side: side,
          y: localStepTop + r.height * 0.5,
          edge: targetEdge,
          shown: -1,
          pin: 0,
        }
      })

      const P = []
      // 1) Starts above section top (-60px), connects straight down into cassette 1 left spool
      P.push({ x: L1.x - p1, y: -60 })
      P.push({ x: L1.x - p1, y: 0 })
      P.push({ x: L1.x - p1, y: L1.y - p1 * 1.5 })
      P.push({ x: L1.x - p1, y: L1.y })
      P.push({ x: L1.x - q * p1, y: L1.y + q * p1 })
      P.push({ x: L1.x, y: L1.y + p1 })
      P.push({ x: (L1.x + R1.x) / 2, y: (L1.y + R1.y) / 2 + p1 + 1 })
      P.push({ x: R1.x, y: R1.y + p1 + 2 })
      P.push({ x: (R1.x + X1.x) / 2, y: (R1.y + X1.y) / 2 + p1 * 0.5 + 1 })
      P.push({ x: X1.x, y: X1.y })

      // 2) Out into the page, through all checkpoint stations
      const d = { x: 1, y: 0.14 }
      const dl = Math.hypot(d.x, d.y) || 1
      d.x /= dl; d.y /= dl
      P.push({ x: X1.x + d.x * 65 * k1, y: X1.y + d.y * 65 * k1 + 8 * k1 })
      if (info.length > 0) {
        P.push({
          x: lerp(P[P.length - 1].x, cx + info[0].side * amp, 0.55),
          y: lerp(P[P.length - 1].y, info[0].y, 0.5),
        })
      }
      info.forEach((s, i) => {
        P.push({ x: cx + s.side * amp, y: s.y })
        if (i < info.length - 1) {
          P.push({ x: cx, y: (s.y + info[i + 1].y) / 2 })
        }
      })
      const last = info[info.length - 1] || { x: cx, y: L2.y - 140, side: 1 }

      // 3) Drops onto cassette 2, wraps left spool, runs along bottom and ends on right spool
      const enter = { x: L2.x - p2, y: L2.y - (mobile ? 40 * k2 : 70 * k2) }
      entryPt = enter
      P.push({
        x: lerp(cx + last.side * amp, enter.x, mobile ? 0.5 : 0.55),
        y: lerp(last.y, enter.y, 0.5),
      })
      P.push(enter)
      P.push({ x: L2.x - p2, y: L2.y - 20 * k2 })
      P.push({ x: L2.x - p2, y: L2.y })
      P.push({ x: L2.x - q * p2, y: L2.y + q * p2 })
      P.push({ x: L2.x, y: L2.y + p2 })
      P.push({ x: (L2.x + R2.x) / 2, y: (L2.y + R2.y) / 2 + p2 + 1 })
      P.push({ x: R2.x, y: R2.y + p2 })
      P.push({ x: R2.x + q * p2, y: R2.y + q * p2 })
      P.push({ x: R2.x + p2, y: R2.y })

      const raw = []
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]
        const n = Math.max(8, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 6))
        for (let j = 0; j < n; j++) raw.push(cr(p0, p1, p2, p3, j / n))
      }
      raw.push(P[P.length - 1])

      // Resample to uniform 5px step for exact arc-length calculation
      const STEP = 5
      let acc = 0
      pts = [{ x: raw[0].x, y: raw[0].y, s: 0 }]
      let carry = 0
      for (let m = 1; m < raw.length; m++) {
        const ax = raw[m - 1].x, ay = raw[m - 1].y, bx = raw[m].x, by = raw[m].y
        const seg = Math.hypot(bx - ax, by - ay)
        let pos = STEP - carry
        while (pos <= seg) {
          acc += STEP
          pts.push({ x: lerp(ax, bx, pos / seg), y: lerp(ay, by, pos / seg), s: acc })
          pos += STEP
        }
        carry = seg - (pos - STEP)
      }

      for (let qIdx = 0; qIdx < pts.length; qIdx++) {
        const a = pts[Math.max(0, qIdx - 1)], b = pts[Math.min(pts.length - 1, qIdx + 1)]
        const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1
        pts[qIdx].nx = -ty / tl
        pts[qIdx].ny = tx / tl
      }

      sEnd = pts[pts.length - 1].s
      sExit = nearestS(exitPt, 0, Math.floor(pts.length * 0.3))
      sEnter = nearestS(entryPt, Math.floor(pts.length * 0.5), pts.length - 1)

      info.forEach((s) => {
        let best = 1e18, bestIdx = 0
        for (let i = 0; i < pts.length; i++) {
          const dd = Math.hypot(pts[i].x - (cx + s.side * amp), pts[i].y - s.y)
          if (dd < best) { best = dd; bestIdx = i }
        }
        s.pin = bestIdx
        s.shown = -1
      })
      dirty = true
    }

    function state(i, sy) {
      const p = pts[i]
      const s = p.s
      const phi = (s - 0.8 * sy) / 160 + 0.7 * Math.sin(s / 360)
      let ce = lerp(1, Math.cos(phi), sstep((s - sExit - 40) / 260))
      ce = lerp(ce, 1, sstep((s - (sEnter - 100)) / 180))
      const thin = 0.5 + 0.5 * sstep((s - sExit) / 120) - 0.5 * sstep((s - (sEnter - 180)) / 200)
      const hw = 15 * k1 * thin * (0.5 + 0.5 * Math.pow(Math.abs(ce), 0.6))
      const base = lift(pal((s + sExit) / palLen))
      const streak = 0.12 * Math.sin(s * 0.31 + Math.sin(s * 0.05) * 4) + 0.08 * Math.sin(s * 1.7)
      let c
      const ae = Math.abs(ce)
      if (ce >= 0) {
        const m = 0.7 + 0.36 * ce + streak
        c = [base[0] * m, base[1] * m, base[2] * m]
      } else {
        const mm = 0.6 + 0.3 * ae + streak * 0.5
        c = [lerp(base[0], 58, 0.6) * mm, lerp(base[1], 40, 0.6) * mm, lerp(base[2], 34, 0.6) * mm]
      }
      if (ae < 0.14) {
        const e = (1 - ae / 0.14) * 0.8
        c = [lerp(c[0], 226, e), lerp(c[1], 190, e), lerp(c[2], 160, e)]
      }
      return {
        lx: p.x - p.nx * hw,
        ly: p.y - p.ny * hw,
        rx: p.x + p.nx * hw,
        ry: p.y + p.ny * hw,
        col: 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')',
        ce: ce,
      }
    }

    function draw() {
      dirty = false
      if (!pts.length) return

      const sy = window.pageYOffset || 0
      const secRect = section.getBoundingClientRect()

      // Skip draw if off screen
      if (secRect.bottom < -120 || secRect.top > vh + 120) {
        return
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, vw, secHeight)

      // Complete 100% tape unreeling as Cassette 2 enters viewport focus
      const mobile = vw < 760
      const scrollableDist = mobile
        ? Math.max(1, endTop - vh * 0.42)
        : Math.max(1, secHeight - vh * 0.85)
      const scrolled = Math.max(0, -secRect.top)
      const progress = reduce ? 1 : clamp(scrolled / scrollableDist, 0, 1)

      const tipS = reduce ? sEnd : (sExit + progress * (sEnd - sExit))
      const tipIdx = clamp(Math.round(tipS / 5), 2, pts.length - 1)

      // ── 1. GUIDE TRACK: Subtle translucent groove along full tape curve (always visible ahead) ──
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let g = 1; g < pts.length; g++) {
        ctx.lineTo(pts[g].x, pts[g].y)
      }
      ctx.strokeStyle = 'rgba(232, 226, 196, 0.12)'
      ctx.lineWidth = 14 * k1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let g = 1; g < pts.length; g++) {
        ctx.lineTo(pts[g].x, pts[g].y)
      }
      ctx.strokeStyle = 'rgba(185, 242, 60, 0.22)'
      ctx.lineWidth = 1.2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // ── 2. ACTIVE COPPER TAPE: Drawn from top connection (0) to tipIdx ──
      let prev = state(0, sy)
      const edgeL = [[prev.lx, prev.ly]]
      const edgeR = [[prev.rx, prev.ry]]
      const hi = []

      for (let i = 1; i <= tipIdx; i++) {
        const cur = state(i, sy)
        ctx.beginPath()
        ctx.moveTo(prev.lx, prev.ly)
        ctx.lineTo(cur.lx, cur.ly)
        ctx.lineTo(cur.rx, cur.ry)
        ctx.lineTo(prev.rx, prev.ry)
        ctx.closePath()
        ctx.fillStyle = cur.col
        ctx.strokeStyle = cur.col
        ctx.lineWidth = 0.9
        ctx.fill()
        ctx.stroke()
        edgeL.push([cur.lx, cur.ly])
        edgeR.push([cur.rx, cur.ry])
        if (cur.ce > 0.25) hi.push([prev.lx, prev.ly, cur.lx, cur.ly])
        prev = cur
      }

      ctx.lineJoin = 'round'
      ctx.strokeStyle = 'rgba(26,11,8,.55)'
      ctx.lineWidth = 1
      ;[edgeL, edgeR].forEach((e) => {
        ctx.beginPath()
        e.forEach((p, n) => { n ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]) })
        ctx.stroke()
      })

      ctx.strokeStyle = 'rgba(255,228,204,.38)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      hi.forEach((h) => { ctx.moveTo(h[0], h[1]); ctx.lineTo(h[2], h[3]) })
      ctx.stroke()

      // Bright cut edge at the tip
      ctx.strokeStyle = 'rgba(255,226,196,.95)'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(prev.lx, prev.ly)
      ctx.lineTo(prev.rx, prev.ry)
      ctx.stroke()

      // ── 3. PINS, CONNECTING STEMS & CARD PULL ANIMATIONS ──
      info.forEach((s) => {
        const diff = tipIdx - s.pin
        const a = reduce ? 1 : sstep((diff + 16) / 38)
        const pin = pts[s.pin]
        if (a > 0 && pin && s.pin <= tipIdx + 1) {
          const ex = lerp(pin.x, s.edge, a)
          ctx.strokeStyle = PIN
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(pin.x, pin.y)
          ctx.lineTo(ex, pin.y)
          ctx.stroke()

          const r = 10 * k1 + 2
          ctx.save()
          ctx.shadowColor = 'rgba(185,242,60,.8)'
          ctx.shadowBlur = 14
          ctx.fillStyle = PIN
          ctx.beginPath()
          ctx.arc(pin.x, pin.y, r, 0, 6.2832)
          ctx.fill()
          ctx.restore()
          ctx.fillStyle = '#0a2b3d'
          ctx.beginPath()
          ctx.arc(pin.x, pin.y, r * 0.38, 0, 6.2832)
          ctx.fill()
        }

        const key = (a * 200) | 0
        if (key !== s.shown && s.el) {
          s.shown = key
          const dx = -s.side * (1 - a) * 90
          s.el.style.opacity = a
          s.el.style.transform = `translate3d(${dx.toFixed(1)}px, -50%, 0) scale(${(0.96 + 0.04 * a).toFixed(3)})`
        }
      })

      // Hubs rotation sync with tape arc-length
      const ang = -(tipS - sExit) / (2 * Math.PI * 27 * k1) * 360
      hubs.forEach((h) => {
        if (h) h.style.transform = `rotate(${ang.toFixed(1)}deg)`
      })

      if (end) {
        end.classList.toggle('live', tipIdx >= pts.length - 8)
      }
    }

    function mark() { dirty = true }
    function frame() {
      if (dirty) draw()
      animId = requestAnimationFrame(frame)
    }

    layout()
    window.addEventListener('scroll', mark, { passive: true })
    window.addEventListener('resize', layout)
    window.addEventListener('load', layout)
    ScrollTrigger.addEventListener('refresh', layout)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      layout()
    }) : null
    if (ro) {
      ro.observe(section)
      ro.observe(end)
    }

    if (window.lenisInstance) {
      window.lenisInstance.on('scroll', mark)
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout)
    }
    animId = requestAnimationFrame(frame)

    return () => {
      mql.removeEventListener('change', onReducedMotionChange)
      if (ro) ro.disconnect()
      window.removeEventListener('scroll', mark)
      window.removeEventListener('resize', layout)
      window.removeEventListener('load', layout)
      ScrollTrigger.removeEventListener('refresh', layout)
      if (window.lenisInstance) {
        window.lenisInstance.off('scroll', mark)
      }
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="timeline-cassette-section" ref={sectionRef} id="timeline">
      {/* ── Dynamic Copper Tape Canvas (Strictly Above Background) ── */}
      <canvas ref={canvasRef} id="tape" aria-hidden="true" />

      {/* ── Interactive Compact Scroll Flow (Hero, 4 Steps, Outro) ── */}
      <div className="tl-scroll-flow">
        {/* Cassette Start & Hero Header */}
        <header className="hero tl-hero">
          <div className="cassette start" ref={startCassetteRef}>
            <img src={cassetteStartImg} alt="XYNTRA Cassette Tape" width="342" height="275" draggable={false} />
            <CassetteHub
              style={{ left: '30.10%', top: '32.20%' }}
              hubRef={(el) => (hubsRef.current[0] = el)}
            />
            <CassetteHub
              style={{ left: '64.60%', top: '37.60%' }}
              hubRef={(el) => (hubsRef.current[1] = el)}
            />
          </div>

          <div className="hero-copy">
            <p className="eyebrow">// 03 · TIMELINE</p>
            <PixelHeading as="h2" size="lg" className="tl-pixel-title">
              FOLLOW THE TAPE
            </PixelHeading>
            <p>Ideas, people, tools. Scroll and the copper tape pulls you through every stage.</p>
            <p className="hint">SCROLL TO PULL ↓</p>
          </div>
        </header>

        {/* 4 Interactive Steps */}
        <main className="tl-steps-list">
          {TIMELINE_STEPS.map((step, idx) => (
            <section
              key={step.no}
              className={`step tl-step step-${idx + 1}`}
              ref={(el) => (stepsRef.current[idx] = el)}
            >
              <article className="card tl-card">
                <span className="no">{step.no}</span>
                <h2>{step.title}</h2>
                <p>{step.desc}</p>
              </article>

              {/* Step 1: Active Audio Monitor placed in the opposite empty space (matching user's screenshot) */}
              {idx === 0 && <AudioVisualizer />}
            </section>
          ))}
        </main>

        {/* Cassette End & Outro Footer */}
        <footer className="outro tl-outro">
          <div className="end-copy">
            <p className="eyebrow">REWIND COMPLETE</p>
            <PixelHeading as="h2" size="md" className="tl-pixel-outro-title">
              THE BRIGHTER TOMORROW
            </PixelHeading>
            <p>Showcase, celebrate, and push the boundaries of autonomous engineering.</p>
          </div>

          <div className="cassette end" ref={endCassetteRef}>
            <img src={cassetteEndImg} alt="XYNTRA Cassette Tape" width="368" height="246" draggable={false} />
            <CassetteHub
              style={{ left: '24.60%', top: '55.90%' }}
              hubRef={(el) => (hubsRef.current[2] = el)}
            />
            <CassetteHub
              style={{ left: '55.80%', top: '43.70%' }}
              hubRef={(el) => (hubsRef.current[3] = el)}
            />
          </div>
        </footer>
      </div>
    </section>
  )
}
