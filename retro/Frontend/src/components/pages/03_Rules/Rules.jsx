import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Rules.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Bolted Operator Console Modules Data (Image 1) ─────────── */
const CONSOLE_MODULES = [
  {
    num: '01',
    title: 'TEAM SIZE',
    pill: '1 - 4 MEMBERS',
    iconType: 'team',
    summary: 'Open to enrolled students, developers & researchers worldwide.',
    detail:
      'Teams of 1 to 4 members. Solo entries permitted upon review. Institutional verification required before freeze date.',
    subclauses: [
      '1 - 4 Members per squad',
      'Inter-college & interdisciplinary collaboration encouraged',
      'One designated Team Lead for mentorship queues & judging',
    ],
  },
  {
    num: '02',
    title: 'ORIGINAL IDEAS',
    pill: 'BUILD SOMETHING NEW',
    iconType: 'bulb',
    summary: 'Fresh build protocol. 100% authored during the active 24h sprint.',
    detail:
      'All solution code, architectural diagrams, and user interfaces must be developed during the active hackathon window.',
    subclauses: [
      'Zero tolerance for pre-built codebases or plagiarism',
      'Open-source libraries & APIs permitted if declared in repo',
      'Git commit timestamps must reflect the 24-hour sprint',
    ],
  },
  {
    num: '03',
    title: 'REAL IMPACT',
    pill: 'SOLVE A REAL PROBLEM',
    iconType: 'code',
    summary: 'Technical execution, innovation, practical feasibility & clean UX.',
    detail:
      'A distinguished panel of industry engineering leaders evaluates real-world impact (30%), technical depth (30%), UX (20%), and pitch (20%).',
    subclauses: [
      'Live functional demonstration or APK/URL required',
      'Public GitHub repository link with clean commit history',
      '3-minute pitch video walkthrough & architectural slides',
    ],
  },
  {
    num: '04',
    title: 'PLAY FAIR',
    pill: 'NO PLAGIARISM BE ORIGINAL',
    iconType: 'fair',
    summary: 'Honor system. Strict adherence to code of conduct & checkpoints.',
    detail:
      'Mandatory check-ins at designated mentor checkpoints (07:00 PM and 11:00 PM). Ethical conduct and academic integrity enforced.',
    subclauses: [
      'Strict code of conduct compliance throughout the arena',
      'Attendance mandatory at both mentor checkpoints',
      'Equal opportunity, respectful collaboration & fair play',
    ],
  },
]

function ModuleIcon({ type }) {
  switch (type) {
    case 'team':
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      )
    case 'bulb':
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M12 6a6 6 0 0 0-6 6c0 2.22 1.2 4.15 3 5.19V18h6v-.81c1.8-1.04 3-2.97 3-5.19a6 6 0 0 0-6-6z" />
        </svg>
      )
    case 'code':
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="10" y1="20" x2="14" y2="4" strokeWidth="1.6" />
        </svg>
      )
    case 'fair':
    default:
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
  }
}

export default function Rules({ onNavigate }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const exitPortRef = useRef(null)

  const [agreed, setAgreed] = useState(false)
  const [activeModule, setActiveModule] = useState(null)

  // ── Flowing PCB Circuit Traces Engine (Exiting Bottom of Console Dock) ───────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = sectionRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let animId = null
    let isVisible = true

    // Pulse palette: Electric Cyan #86CAF3 dominant with #FF7C6B Coral & Gold accents
    const PULSE_PALETTE = [
      { core: '#FFFEDF', glow: '#86CAF3', name: 'sky-cyan' },
      { core: '#ffffff', glow: '#38bdf8', name: 'electric-blue' },
      { core: '#FFFEDF', glow: '#FF7C6B', name: 'coral-flame' },
      { core: '#ffffff', glow: '#ffd180', name: 'gold-spark' },
    ]

    let width = 0
    let height = 0
    let tracks = []
    let pulses = []
    let vias = []
    let silks = []
    let exitRipples = []

    function buildCircuitPaths(w, h) {
      const cx = w * 0.5
      let boxBottom = h * 0.72
      let dockCx = cx

      if (exitPortRef.current && container) {
        const dRect = exitPortRef.current.getBoundingClientRect()
        const pRect = container.getBoundingClientRect()
        boxBottom = dRect.bottom - pRect.top
        dockCx = dRect.left + dRect.width * 0.5 - pRect.left
      }

      const generated = []
      const viaPoints = []
      const silkscreenLabels = []

      // 1. Center Dual-Rail Power Trunk (Exits vertically down from center of dock)
      const trunkOffset = 6
      const trunkLPts = [{ x: dockCx - trunkOffset, y: boxBottom }, { x: dockCx - trunkOffset, y: h }]
      const trunkRPts = [{ x: dockCx + trunkOffset, y: boxBottom }, { x: dockCx + trunkOffset, y: h }]

      generated.push({ points: trunkLPts, width: 3.2, isTrunk: true })
      generated.push({ points: trunkRPts, width: 3.2, isTrunk: true })

      viaPoints.push({ x: dockCx - trunkOffset, y: boxBottom, isLanding: true })
      viaPoints.push({ x: dockCx + trunkOffset, y: boxBottom, isLanding: true })

      silkscreenLabels.push({ text: 'PWR_+5V', x: dockCx + 14, y: boxBottom + 30, align: 'left' })
      silkscreenLabels.push({ text: 'GND_ISO', x: dockCx - 14, y: boxBottom + 30, align: 'right' })

      // 2. Multichannel Fan-Out PCB Traces (Matches user's diagram media_1792180312874_5d2ce590.png)
      // "starts with less area but many lines then expand refer the drawn image i uploded"
      const numSide = 8
      // Tight cluster width at exit: ~240px wide in the center (from dockCx - 120 to dockCx + 120)
      const clusterHalf = Math.min(120, w * 0.12)
      const leftPinStart = dockCx - clusterHalf
      const leftPinEnd = dockCx - 18

      // Expanded footprint at bottom: covers up to cx ± 680px (~1360px wide, matching footer top)
      const maxBottomSpread = Math.min(w * 0.43, 680)
      const leftBotStart = dockCx - maxBottomSpread
      const leftBotEnd = dockCx - 36

      const labels = ['BUS_0', 'CLK_16M', 'SIG_TX', 'SIG_RX', 'IO_DATA', 'INT_0', 'ADDR_0', 'VREF']

      for (let i = 0; i < numSide; i++) {
        const t = i / (numSide - 1)
        const pinX = leftPinStart + t * (leftPinEnd - leftPinStart)
        const botX = leftBotStart + t * (leftBotEnd - leftBotStart)

        // Minimally reduced trace length:
        // Monotonic staggered vertical runs leaving boxBottom
        const y1 = boxBottom + 12 + t * 20

        // Diagonal chamfer run to botX:
        // Outer lines reach botX further down, inner lines reach botX sooner
        const y2 = Math.min(h - 40, y1 + 25 + (1 - t) * 55)

        // Path: [pinX, boxBottom] -> [pinX, y1] -> [botX, y2] -> [botX, h]
        const leftPts = [
          { x: pinX, y: boxBottom },
          { x: pinX, y: y1 },
          { x: botX, y: y2 },
          { x: botX, y: h },
        ]

        const rightPinX = dockCx + (dockCx - pinX)
        const rightBotX = dockCx + (dockCx - botX)
        const rightPts = leftPts.map((p) => ({ x: dockCx + (dockCx - p.x), y: p.y }))

        generated.push({ points: leftPts, width: 2.6, isTrunk: false })
        generated.push({ points: rightPts, width: 2.6, isTrunk: false })

        // Solder vias at exit landing pins and elbows
        viaPoints.push({ x: pinX, y: boxBottom, isLanding: true }, leftPts[1], leftPts[2])
        viaPoints.push({ x: rightPinX, y: boxBottom, isLanding: true }, rightPts[1], rightPts[2])

        // Silkscreen technical markings along the expanded vertical drop
        if (i % 2 === 0) {
          silkscreenLabels.push({
            text: labels[i % labels.length],
            x: botX - 6,
            y: (y2 + h) * 0.5,
            align: 'right',
            rotate: -Math.PI / 2,
          })
          silkscreenLabels.push({
            text: labels[i % labels.length],
            x: rightBotX + 6,
            y: (y2 + h) * 0.5,
            align: 'left',
            rotate: Math.PI / 2,
          })
        }
      }

      return { paths: generated, vias: viaPoints, silks: silkscreenLabels }
    }

    function compile(points) {
      let totalDist = 0
      const segments = []
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]
        const d = Math.hypot(p2.x - p1.x, p2.y - p1.y)
        segments.push({ p1, p2, dist: d, startDist: totalDist })
        totalDist += d
      }
      return { points, segments, totalDist }
    }

    function resize() {
      if (!container || !canvas) return
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const result = buildCircuitPaths(width, height)
      vias = result.vias
      silks = result.silks

      tracks = []
      result.paths.forEach((p) => {
        tracks.push({ ...compile(p.points), width: p.width, isTrunk: p.isTrunk })
      })

      // Generate active electrical pulses along traces
      pulses = []
      const numPulses = tracks.length * 2
      for (let i = 0; i < numPulses; i++) {
        const tIdx = i % tracks.length
        const colorObj = PULSE_PALETTE[Math.floor(Math.random() * PULSE_PALETTE.length)]
        pulses.push({
          trackIdx: tIdx,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          length: 24 + Math.random() * 26,
          color: colorObj.glow,
          core: colorObj.core,
        })
      }
    }

    function getPoint(track, dist) {
      if (dist <= 0) return track.points[0]
      if (dist >= track.totalDist) return track.points[track.points.length - 1]
      for (let i = 0; i < track.segments.length; i++) {
        const seg = track.segments[i]
        if (dist <= seg.startDist + seg.dist) {
          const t = (dist - seg.startDist) / seg.dist
          return {
            x: seg.p1.x + (seg.p2.x - seg.p1.x) * t,
            y: seg.p1.y + (seg.p2.y - seg.p1.y) * t,
          }
        }
      }
      return track.points[track.points.length - 1]
    }

    function draw() {
      if (!isVisible) {
        animId = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // ── 1. 3D PCB SUBSTRATE DROP SHADOW ─────────────────────────
      ctx.save()
      ctx.strokeStyle = 'rgba(14, 34, 41, 0.45)'
      ctx.lineWidth = 4.0
      ctx.lineCap = 'round'
      ctx.lineJoin = 'miter'
      for (let i = 0; i < tracks.length; i++) {
        const pts = tracks[i].points
        ctx.beginPath()
        for (let j = 0; j < pts.length; j++) {
          const px = pts[j].x
          const py = pts[j].y + 2.0
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.restore()

      // ── 2. METALLIC CYAN/COPPER TRACES (#86CAF3) ────────────────
      ctx.save()
      ctx.strokeStyle = '#86CAF3'
      ctx.lineWidth = 2.6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'miter'
      for (let i = 0; i < tracks.length; i++) {
        const pts = tracks[i].points
        ctx.beginPath()
        for (let j = 0; j < pts.length; j++) {
          if (j === 0) ctx.moveTo(pts[j].x, pts[j].y)
          else ctx.lineTo(pts[j].x, pts[j].y)
        }
        ctx.stroke()
      }
      ctx.restore()

      // ── 3. SPECULAR CORE HIGHLIGHT (#FFFEDF) ─────────────────────
      ctx.save()
      ctx.strokeStyle = 'rgba(255, 254, 223, 0.75)'
      ctx.lineWidth = 0.9
      for (let i = 0; i < tracks.length; i++) {
        const pts = tracks[i].points
        ctx.beginPath()
        for (let j = 0; j < pts.length; j++) {
          if (j === 0) ctx.moveTo(pts[j].x, pts[j].y)
          else ctx.lineTo(pts[j].x, pts[j].y)
        }
        ctx.stroke()
      }
      ctx.restore()

      // ── 4. SOLDER VIAS & TERMINAL LANDING PINS ───────────────────
      for (let i = 0; i < vias.length; i++) {
        const v = vias[i]

        // Outer ring
        ctx.fillStyle = v.isLanding ? '#FF7C6B' : '#0f357C'
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.isLanding ? 4.6 : 3.8, 0, Math.PI * 2)
        ctx.fill()

        // Cyan / Gold pad
        ctx.fillStyle = v.isLanding ? '#ffd180' : '#86CAF3'
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.isLanding ? 3.2 : 2.6, 0, Math.PI * 2)
        ctx.fill()

        // Center drill hole
        ctx.fillStyle = '#0a265c'
        ctx.beginPath()
        ctx.arc(v.x, v.y, 1.2, 0, Math.PI * 2)
        ctx.fill()

        // Specular glint
        ctx.fillStyle = '#FFFEDF'
        ctx.beginPath()
        ctx.arc(v.x - 0.8, v.y - 0.8, 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── 5. PCB SILKSCREEN TECHNICAL MARKINGS ─────────────────────
      ctx.save()
      ctx.font = '600 8px "Space Grotesk", monospace'
      ctx.fillStyle = 'rgba(15, 53, 124, 0.6)'
      for (let i = 0; i < silks.length; i++) {
        const s = silks[i]
        ctx.save()
        ctx.translate(s.x, s.y)
        if (s.rotate) ctx.rotate(s.rotate)
        ctx.textAlign = s.align || 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(s.text, 0, 0)
        ctx.restore()
      }
      ctx.restore()

      // ── 6. FLOWING ELECTRICAL PULSES (DOWNWARDS STREAM) ──────────
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i]
        const trk = tracks[p.trackIdx]
        if (!trk || trk.totalDist === 0) continue

        p.progress += p.speed
        if (p.progress >= 1.0) {
          p.progress = 0
          p.speed = 0.003 + Math.random() * 0.004
          const newColor = PULSE_PALETTE[Math.floor(Math.random() * PULSE_PALETTE.length)]
          p.color = newColor.glow
          p.core = newColor.core

          // Trigger ripple at pin exit
          const startPt = trk.points[0]
          exitRipples.push({
            x: startPt.x,
            y: startPt.y,
            radius: 1,
            maxRadius: 14 + Math.random() * 8,
            alpha: 1.0,
            color: p.color,
          })
        }

        const headDist = p.progress * trk.totalDist
        const tailDist = Math.max(0, headDist - p.length)
        const head = getPoint(trk, headDist)
        const tail = getPoint(trk, tailDist)

        ctx.save()
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2.4
        ctx.lineCap = 'round'
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10

        ctx.beginPath()
        ctx.moveTo(tail.x, tail.y)
        ctx.lineTo(head.x, head.y)
        ctx.stroke()

        // White-hot electron spark core
        ctx.fillStyle = p.core
        ctx.beginPath()
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // ── 7. PIN EXIT RIPPLES ──────────────────────────────────────
      for (let i = exitRipples.length - 1; i >= 0; i--) {
        const rp = exitRipples[i]
        rp.radius += 0.6
        rp.alpha -= 0.04
        if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
          exitRipples.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.strokeStyle = rp.color
        ctx.lineWidth = 1.2
        ctx.globalAlpha = rp.alpha
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize())
      ro.observe(container)
      if (exitPortRef.current) ro.observe(exitPortRef.current)
    }

    requestAnimationFrame(() => {
      resize()
      setTimeout(resize, 80)
      setTimeout(resize, 250)
    })
    draw()

    return () => {
      observer.disconnect()
      if (ro) ro.disconnect()
      window.removeEventListener('resize', handleResize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  // ── GSAP Reveal Animations ──────────────────────────────────────
  useEffect(() => {
    const sect = sectionRef.current
    if (!sect) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rules-header-right-deck',
        { autoAlpha: 0, y: -20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sect,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.operator-console-chassis',
        { autoAlpha: 0, y: 30, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.operator-console-chassis',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sect)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="retro-rules-fieldguide-section" id="rules">
      {/* ── FLOWING REAL PCB CIRCUIT CANVAS (CONNECTS TO FOOTER) ──── */}
      <canvas ref={canvasRef} className="rules-circuit-canvas" aria-hidden="true" />

      <div className="rules-fieldguide-container">
        {/* ── HEADER ROW: METADATA ON LEFT, 'CLEAR RULES...' ON RIGHT ─ */}
        <header className="rules-header-row">
          {/* Left Metadata / Field Guide Stamp */}
          <div className="rules-header-left-meta">
            <div className="fieldguide-eyebrow">
              <span className="eyebrow-accent-badge">03. RULES</span>
              <span className="eyebrow-dash">—</span>
              <span className="eyebrow-caption">OPERATOR&apos;S FIELD GUIDE</span>
            </div>
            <div className="fieldguide-stamp-stack">
              <span className="stamp-code">CODE. BUILD. REPEAT. // 2026</span>
              <span className="stamp-teams">///// ALL BUILDERS WELCOME</span>
            </div>
          </div>

          {/* Right Headline: 'CLEAR RULES. BOLDER IDEAS.' (User Requested on the Right) */}
          <div className="rules-header-right-deck">
            <h2 className="rules-pixel-headline">
              CLEAR RULES. <br />
              <span className="headline-bolder">BOLDER IDEAS.</span>
            </h2>
            <div className="rules-lead-block">
              <p className="rules-tagline-lead">SIMPLE RULES. A BIGGER PLAYGROUND.</p>
              <p className="rules-tagline-sub">A FAIR PLAYGROUND FOR A BRIGHTER TOMORROW.</p>
            </div>
          </div>
        </header>

        {/* ── CENTER OPERATOR CONSOLE & REGISTRATION BOX ───────────── */}
        <div className="rules-center-console-wrapper">
          <div className="operator-console-chassis">
            {/* Chassis Corner Industrial Screws */}
            <span className="chassis-screw screw-top-left" aria-hidden="true" />
            <span className="chassis-screw screw-top-right" aria-hidden="true" />
            <span className="chassis-screw screw-bottom-left" aria-hidden="true" />
            <span className="chassis-screw screw-bottom-right" aria-hidden="true" />

            {/* Glowing Conduit Bar in Sky Cyan (#86CAF3) */}
            <div className="console-top-conduit" aria-hidden="true">
              <span className="conduit-core" />
              <span className="conduit-glow" />
            </div>

            {/* Subhead Strip */}
            <div className="console-subhead-strip">
              <div className="console-label-left">
                <span className="console-dot-cyan" />
                <span className="console-title-text">XYNTRA PROTOCOL INTERFACE // HARDWARE CONSOLE</span>
              </div>
              <div className="console-label-right">
                <span className="console-hint-text">CLICK MODULE TO EXPAND CLAUSE</span>
              </div>
            </div>

            {/* ── 4 BOLTED METAL MODULE BLOCKS (IMAGE 1) ─────────────── */}
            <div className="console-modules-rack">
              {CONSOLE_MODULES.map((mod, idx) => {
                const isExpanded = activeModule === idx
                return (
                  <article
                    key={mod.num}
                    className={`console-bolted-module ${isExpanded ? 'module-active' : ''}`}
                    onClick={() => setActiveModule(isExpanded ? null : idx)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveModule(isExpanded ? null : idx)
                      }
                    }}
                  >
                    {/* Corner Hex Screws on each plate */}
                    <span className="module-screw screw-tl" aria-hidden="true" />
                    <span className="module-screw screw-tr" aria-hidden="true" />
                    <span className="module-screw screw-bl" aria-hidden="true" />
                    <span className="module-screw screw-br" aria-hidden="true" />

                    {/* Stamped Number Badge at Top [ 01 ] */}
                    <div className="module-number-badge">
                      <span className="badge-num">{mod.num}</span>
                    </div>

                    {/* Centered SVG Icon in Sky Cyan (#86CAF3) */}
                    <div className="module-icon-well">
                      <ModuleIcon type={mod.iconType} />
                    </div>

                    {/* Bold Title in Ivory Cream (#FFFEDF) */}
                    <h3 className="module-main-title">{mod.title}</h3>

                    {/* Subtitle Pill / Rule Tag in #86CAF3 */}
                    <div className="module-pill-tag">
                      <span>{mod.pill}</span>
                    </div>

                    {/* Short Summary */}
                    <p className="module-summary-text">{mod.summary}</p>

                    {/* Expandable Protocol Drawer */}
                    {isExpanded && (
                      <div className="module-drawer-content">
                        <p className="drawer-detail-lead">{mod.detail}</p>
                        <ul className="drawer-subclauses-list">
                          {mod.subclauses.map((clause, cIdx) => (
                            <li key={cIdx}>
                              <span className="clause-bullet">▸</span>
                              <span>{clause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Click Prompt Hint */}
                    <div className="module-click-cue">
                      <span>{isExpanded ? '▲ CLOSE' : '▼ CLAUSE'}</span>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Console Mid Telemetry Strip / Divider */}
            <div className="console-telemetry-divider">
              <div className="telemetry-left-stack">
                <span className="telemetry-brand">XYNTRA</span>
                <span className="telemetry-model">OPERATOR CONSOLE // MODEL 26-27</span>
              </div>
              <div className="telemetry-right-indicators">
                <span className="telemetry-quote">GOOD BUILDERS FOLLOW THROUGH.</span>
                <div className="telemetry-pilot-group">
                  <span className={`pilot-lamp ${agreed ? 'pilot-armed' : 'pilot-standby'}`} />
                  <span className="pilot-label">{agreed ? 'CIRCUIT ENERGIZED' : 'STANDBY'}</span>
                </div>
              </div>
            </div>

            {/* ── COMBINED REGISTRATION BOX (INTEGRATED AT BOTTOM) ───── */}
            <div className="console-integrated-registration-box">
              {/* Corner HUD Bracket Notches */}
              <span className="hud-corner hud-corner-tl" />
              <span className="hud-corner hud-corner-tr" />
              <span className="hud-corner hud-corner-bl" />
              <span className="hud-corner hud-corner-br" />

              {/* Top Interface Bar */}
              <div className="terminal-bus-landing-header" aria-hidden="true" />

              <div className="registration-inner-terminal">
                <p className="terminal-command-line">
                  <span className="terminal-prompt-path">C:\&gt;</span> be_part_of_something_bigger.exe
                </p>

                <p className="terminal-blinking-prompt">
                  x <span className="terminal-cursor">_</span>
                </p>

                {/* Mechanical Consent Toggle Lever */}
                <label className="mechanical-toggle-lever">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="toggle-checkbox-native"
                  />
                  <span className="toggle-track-groove">
                    <span className="toggle-handle-knob" />
                  </span>
                  <span className="toggle-statement">
                    I have read, understood, and agree to abide by all hackathon rules, fresh build protocols, and fair play terms.
                  </span>
                </label>

                {/* Primary CTA Registration Button */}
                <button
                  type="button"
                  className={`terminal-cta-button ${agreed ? 'cta-armed' : 'cta-locked'}`}
                  disabled={!agreed}
                  onClick={() => onNavigate?.(4, '/register')}
                >
                  <span>REGISTER NOW</span>
                  <span className="btn-arrow" aria-hidden="true">&rarr;</span>
                </button>

                {/* Tagline Trio */}
                <div className="terminal-tagline-trio">
                  <span>THINK</span>
                  <span className="plus-sep">+</span>
                  <span>BUILD</span>
                  <span className="plus-sep">+</span>
                  <span>DISRUPT</span>
                </div>
              </div>
            </div>

            {/* ── HIGH-DENSITY BUS EXIT DOCK (WHERE TRACES EMERGE) ───── */}
            <div ref={exitPortRef} className="console-circuit-exit-dock">
              <div className="bus-dock-label-pill">
                <span className="dock-dot" />
                <span>HIGH-DENSITY I/O BUS // 20-CHANNEL EXPANSION PORT</span>
              </div>
              <div className="bus-dock-pins-rail" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
