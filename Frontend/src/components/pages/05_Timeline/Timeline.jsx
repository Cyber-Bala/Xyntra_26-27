import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import cassetteVectorSvg from '@/assets/images/cassette-vector.svg'
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
    <div className="hub-socket" style={style}>
      <svg
        className={`hub ${className}`}
        ref={hubRef}
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
    </div>
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

    let vw = 0, vh = 0, dpr = 1, k = 1, k1 = 1, secHeight = 0, secTop = 0, endTop = 0, lastSy = 0
    let pts = [], info = []
    let entryPt = { x: 0, y: 0 }
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

    let lastW = 0
    let lastH = 0

    function layout() {
      if (!section || !canvas || !start || !end) return
      vw = window.innerWidth
      vh = window.innerHeight
      dpr = 1

      const secRect = section.getBoundingClientRect()
      secTop = secRect.top + (window.pageYOffset || 0)
      secHeight = Math.max(section.offsetHeight, Math.round(secRect.height))

      if (vw === lastW && Math.abs(secHeight - lastH) < 2 && pts.length > 0) {
        dirty = true
        return
      }
      lastW = vw
      lastH = secHeight

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

      // Tape exits cassette 1 below the right spool on the right rim
      const X1 = {
        x: startLocal.left + startLocal.width * 0.95,
        y: startLocal.top + startLocal.height * 0.58,
      }

      const endCenterX = endLocal.left + endLocal.width * 0.5
      const endCenterY = endLocal.top + endLocal.height * 0.5

      // Both cassettes now use width 342 and aspect-ratio 1488 / 1234
      const endW = 342 * k
      const endH = endW * (1234 / 1488)
      const k2 = endW / 342
      const theta = (mobile ? -12 : -14) * Math.PI / 180
      const cosT = Math.cos(theta), sinT = Math.sin(theta)

      // Precise rotated reel centre for Cassette 2 left rim
      const dxL2 = (0.3212 - 0.5) * endW
      const dyL2 = (0.3520 - 0.5) * endH
      const L2 = {
        x: endCenterX + (dxL2 * cosT - dyL2 * sinT),
        y: endCenterY + (dxL2 * sinT + dyL2 * cosT),
      }

      const p2 = endW * 0.088

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
      // 1) Starts directly at exit rim X1 of Cassette 1 (no internal spline slicing through spools)
      P.push({ x: X1.x - 2 * k1, y: X1.y - 4 * k1 })
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

      // 3) Tape sweeps from the left side with a curve coming from behind the cassette, then joins without crossing spools
      const leftBoundX = endCenterX - endW * 0.50 * Math.abs(cosT)
      const leftSweepX = Math.min(cx + last.side * amp, leftBoundX - (mobile ? 18 : 36) * k2)

      P.push({
        x: leftSweepX,
        y: lerp(last.y, L2.y, 0.40),
      })
      P.push({
        x: leftSweepX - (mobile ? 8 : 18) * k2,
        y: lerp(last.y, L2.y, 0.70),
      })

      // Enters behind the cassette's left edge toward left rim (stops without crossing spools)
      const enter = {
        x: L2.x - p2 * 1.5 * cosT - 8 * k2,
        y: L2.y - p2 * 1.5 * sinT - 16 * k2,
      }
      entryPt = enter

      P.push(enter)
      P.push({ x: L2.x - p2 * 0.7 * cosT, y: L2.y - p2 * 0.7 * sinT })

      const raw = []
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]
        const n = Math.max(8, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 6))
        for (let j = 0; j < n; j++) raw.push(cr(p0, p1, p2, p3, j / n))
      }
      raw.push(P[P.length - 1])

      // Resample to uniform 7px step for exact arc-length calculation
      const STEP = 7
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
        const p = pts[qIdx]
        p.nx = -ty / tl
        p.ny = tx / tl
        const s = p.s
        p.sinTerm = 0.7 * Math.sin(s / 360)
        p.sstep40 = sstep((s - 40) / 260)
        p.streak = 0.12 * Math.sin(s * 0.31 + Math.sin(s * 0.05) * 4) + 0.08 * Math.sin(s * 1.7)
        p.base = lift(pal(s / palLen))
      }

      sEnd = pts[pts.length - 1].s
      sExit = 0
      sEnter = nearestS(entryPt, Math.floor(pts.length * 0.5), pts.length - 1)

      for (let qIdx = 0; qIdx < pts.length; qIdx++) {
        const p = pts[qIdx]
        const s = p.s
        p.sstepEnter = sstep((s - (sEnter - 100)) / 180)
        p.thin = 0.5 + 0.5 * sstep(s / 120) - 0.5 * sstep((s - (sEnter - 180)) / 200)
      }

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
      const phi = (p.s - 0.8 * sy) / 160 + p.sinTerm
      let ce = lerp(1, Math.cos(phi), p.sstep40)
      ce = lerp(ce, 1, p.sstepEnter)
      const hw = 15 * k1 * p.thin * (0.5 + 0.5 * Math.pow(Math.abs(ce), 0.6))
      const base = p.base
      const streak = p.streak
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
      const secTopRel = secTop - sy
      const speed = Math.abs(sy - lastSy)
      lastSy = sy
      const stride = speed > 50 ? 5 : speed > 25 ? 3 : speed > 10 ? 2 : 1

      // Skip draw if off screen
      if (secTopRel + secHeight < -120 || secTopRel > vh + 120) {
        return
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, vw, secHeight)

      // Synchronized tape unreeling directly anchored to Cassette 2 physical position
      const mobile = vw < 760
      const scrollableDist = Math.max(1, endTop - vh * (mobile ? 0.42 : 0.38))
      const scrolled = Math.max(0, -secTopRel)
      const progress = reduce ? 1 : clamp(scrolled / scrollableDist, 0, 1)

      const tipS = reduce ? sEnd : (progress * sEnd)
      const tipIdx = clamp(Math.round(tipS / 7), 2, pts.length - 1)

      // ── ACTIVE COPPER TAPE: Drawn from exit connection (0) to tipIdx ──
      let prev = state(0, sy)
      const edgeL = [[prev.lx, prev.ly]]
      const edgeR = [[prev.rx, prev.ry]]
      const hi = []

      for (let i = stride; i <= tipIdx; i += stride) {
        const cur = state(i, sy)
        ctx.beginPath()
        ctx.moveTo(prev.lx, prev.ly)
        ctx.lineTo(cur.lx, cur.ly)
        ctx.lineTo(cur.rx, cur.ry)
        ctx.lineTo(prev.rx, prev.ry)
        ctx.closePath()
        ctx.fillStyle = cur.col
        ctx.fill()
        edgeL.push([cur.lx, cur.ly])
        edgeR.push([cur.rx, cur.ry])
        if (cur.ce > 0.25) hi.push([prev.lx, prev.ly, cur.lx, cur.ly])
        prev = cur
      }

      // Connect exact tip if tipIdx is not a multiple of stride
      if (tipIdx % stride !== 0) {
        const cur = state(tipIdx, sy)
        ctx.beginPath()
        ctx.moveTo(prev.lx, prev.ly)
        ctx.lineTo(cur.lx, cur.ly)
        ctx.lineTo(cur.rx, cur.ry)
        ctx.lineTo(prev.rx, prev.ry)
        ctx.closePath()
        ctx.fillStyle = cur.col
        ctx.fill()
        edgeL.push([cur.lx, cur.ly])
        edgeR.push([cur.rx, cur.ry])
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

      // Bright cut edge at the tip while unreeling; hidden once tape attaches
      if (tipIdx < pts.length - 2) {
        ctx.strokeStyle = 'rgba(255,226,196,.95)'
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(prev.lx, prev.ly)
        ctx.lineTo(prev.rx, prev.ry)
        ctx.stroke()
      }

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
          // Hardware-accelerated neon glow halo (zero slow Gaussian blur pass)
          ctx.fillStyle = 'rgba(185, 242, 60, 0.28)'
          ctx.beginPath()
          ctx.arc(pin.x, pin.y, r * 1.55, 0, 6.2832)
          ctx.fill()

          ctx.fillStyle = PIN
          ctx.beginPath()
          ctx.arc(pin.x, pin.y, r, 0, 6.2832)
          ctx.fill()

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

    }

    function mark() {
      dirty = true
    }

    function frame() {
      if (dirty) {
        dirty = false
        draw()
      }
      animId = requestAnimationFrame(frame)
    }

    layout()
    window.addEventListener('scroll', mark, { passive: true })
    window.addEventListener('resize', layout)
    window.addEventListener('load', layout)
    ScrollTrigger.addEventListener('refresh', layout)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === section) {
          const cr = entry.contentRect
          if (Math.abs(cr.height - lastH) > 4 || Math.abs(cr.width - lastW) > 4) {
            layout()
          }
        }
      }
    }) : null
    if (ro) {
      ro.observe(section)
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
            <div
              className="cassette-vector-mount"
              role="img"
              aria-label="XYNTRA Translucent Denim-Blue Glass Cassette Tape Vector"
            >
              <img
                src={cassetteVectorSvg}
                alt="XYNTRA Translucent Glass Cassette Tape"
                width="342"
                height="284"
                draggable={false}
              />
            </div>
            <CassetteHub
              style={{ left: '32.12%', top: '35.20%' }}
              hubRef={(el) => (hubsRef.current[0] = el)}
            />
            <CassetteHub
              style={{ left: '76.00%', top: '45.80%' }}
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
            <div
              className="cassette-vector-mount"
              role="img"
              aria-label="XYNTRA Translucent Glass Cassette Tape Vector (Rewind)"
            >
              <img
                src={cassetteVectorSvg}
                alt="XYNTRA Translucent Glass Cassette Tape"
                width="342"
                height="284"
                draggable={false}
              />
            </div>
            <CassetteHub
              style={{ left: '32.12%', top: '35.20%' }}
              hubRef={(el) => (hubsRef.current[2] = el)}
            />
            <CassetteHub
              style={{ left: '76.00%', top: '45.80%' }}
              hubRef={(el) => (hubsRef.current[3] = el)}
            />
          </div>
        </footer>
      </div>
    </section>
  )
}
