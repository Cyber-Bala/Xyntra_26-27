import { useEffect, useRef, useState } from 'react'
import PixelHeading from '../pages/02_About/PixelHeading.jsx'
import './Footer.css'

export default function Footer({ onNavigate }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const navLinks = [
    { label: 'HOME', pageId: 1, sectionId: 'hero' },
    { label: 'ABOUT', pageId: 2, sectionId: 'about' },
    { label: 'PRIZES', pageId: 6, sectionId: 'prizes' },
    { label: 'RULES', pageId: 3, sectionId: 'rules' },
    { label: 'REGISTER', pageId: 4, path: '/register' },
    { label: 'CONTACT', pageId: null, sectionId: 'contact' },
  ]

  const handleNavClick = (item) => {
    if (item.sectionId === 'contact') {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (item.path) {
      onNavigate?.(item.pageId, item.path)
    } else {
      onNavigate?.(item.pageId, item.sectionId)
    }
  }

  // ── FLOWING PCB CIRCUIT TRACES ENGINE ─────────────────────────
  // Traces enter from top edge and converge symmetrically into the center registration box
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let animId = null
    let isVisible = true

    // Flame Orange-dominant electrical pulse palette matching reference:
    const PULSE_PALETTE = [
      { core: '#ffffff', glow: '#f06030', name: 'flame-orange' },
      { core: '#ffffff', glow: '#ff7a3d', name: 'bright-orange' },
      { core: '#ffffff', glow: '#f59e0b', name: 'amber-sunset' },
      { core: '#ffffff', glow: '#ffd180', name: 'gold' },
      { core: '#ffffff', glow: '#38bdf8', name: 'cyan-spark' },
      { core: '#ffffff', glow: '#d2f25f', name: 'lime-spark' },
    ]

    let width = 0
    let height = 0
    let tracks = []
    let pulses = []
    let vias = []
    let silks = []
    let sparks = []
    let landingRipples = []

    function buildCircuitPaths(w, h) {
      const cx = w * 0.5

      // Accurately measure the center registration card's position
      let boxTop = h * 0.36
      let boxLeft = cx - 210
      let boxRight = cx + 210

      if (cardRef.current && container) {
        const cRect = cardRef.current.getBoundingClientRect()
        const pRect = container.getBoundingClientRect()
        boxTop = Math.max(40, cRect.top - pRect.top)
        boxLeft = cRect.left - pRect.left
        boxRight = cRect.right - pRect.left
      }

      const generated = []
      const viaPoints = []
      const silkscreenLabels = []

      // 1. Center Dual-Rail Power Trunk (straight into top center of box)
      const trunkOffset = 10
      const trunkLPts = [{ x: cx - trunkOffset, y: 0 }, { x: cx - trunkOffset, y: boxTop }]
      const trunkRPts = [{ x: cx + trunkOffset, y: 0 }, { x: cx + trunkOffset, y: boxTop }]

      generated.push({ points: trunkLPts, width: 3.5, isTrunk: true })
      generated.push({ points: trunkRPts, width: 3.5, isTrunk: true })

      viaPoints.push({ x: cx - trunkOffset, y: boxTop, isLanding: true })
      viaPoints.push({ x: cx + trunkOffset, y: boxTop, isLanding: true })

      silkscreenLabels.push({ text: 'PWR_+5V', x: cx + 18, y: boxTop * 0.42, align: 'left' })
      silkscreenLabels.push({ text: 'GND_ISO', x: cx - 18, y: boxTop * 0.42, align: 'right' })

      // 2. Wide Multichannel PCB Bus Traces converging into center box
      const numSide = 8
      const maxTopSpread = Math.min(w * 0.45, 750)
      const leftTopStart = cx - maxTopSpread
      const leftTopEnd = cx - 44

      const leftPinStart = boxLeft + 20
      const leftPinEnd = cx - 24

      const labels = ['BUS_0', 'CLK_16M', 'SIG_TX', 'SIG_RX', 'IO_DATA', 'INT_0', 'ADDR_0', 'VREF']

      for (let i = 0; i < numSide; i++) {
        const t = i / (numSide - 1)
        const topX = leftTopStart + t * (leftTopEnd - leftTopStart)
        const pinX = leftPinStart + t * (leftPinEnd - leftPinStart)

        const y1 = 18 + t * 50
        const y2 = Math.min(boxTop - 16, (boxTop - 60) + t * 40)

        // Monotonic staggered vertical runs -> diagonal chamfer -> vertical landing
        const leftPts = [
          { x: topX, y: 0 },
          { x: topX, y: y1 },
          { x: pinX, y: y2 },
          { x: pinX, y: boxTop },
        ]

        // Right side is an exact symmetrical mirror
        const rightPinX = cx + (cx - pinX)
        const rightPts = leftPts.map((p) => ({ x: cx + (cx - p.x), y: p.y }))

        generated.push({ points: leftPts, width: 2.6, isTrunk: false })
        generated.push({ points: rightPts, width: 2.6, isTrunk: false })

        viaPoints.push(leftPts[1], leftPts[2])
        viaPoints.push({ x: pinX, y: boxTop, isLanding: true })

        viaPoints.push(rightPts[1], rightPts[2])
        viaPoints.push({ x: rightPinX, y: boxTop, isLanding: true })

        if (i % 2 === 0) {
          silkscreenLabels.push({
            text: labels[i % labels.length],
            x: topX - 6,
            y: Math.max(14, y1 * 0.5),
            align: 'right',
            rotate: -Math.PI / 2,
          })
          silkscreenLabels.push({
            text: labels[i % labels.length],
            x: cx + (cx - topX) + 6,
            y: Math.max(14, y1 * 0.5),
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

      pulses = []
      const numPulses = tracks.length * 2
      for (let i = 0; i < numPulses; i++) {
        const tIdx = i % tracks.length
        const colorObj = PULSE_PALETTE[Math.floor(Math.random() * PULSE_PALETTE.length)]
        pulses.push({
          trackIdx: tIdx,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          length: 24 + Math.random() * 28,
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

      // 1. PCB Substrate Shadow (3D Raised Relief)
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)'
      ctx.lineWidth = 4.2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'miter'
      for (let i = 0; i < tracks.length; i++) {
        const pts = tracks[i].points
        ctx.beginPath()
        for (let j = 0; j < pts.length; j++) {
          const px = pts[j].x
          const py = pts[j].y + 1.8
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.restore()

      // 2. Metallic Copper Base Traces (#d45d2b)
      ctx.save()
      ctx.strokeStyle = '#d45d2b'
      ctx.lineWidth = 2.8
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

      // 3. Specular Gold Trace Core
      ctx.save()
      ctx.strokeStyle = 'rgba(255, 214, 128, 0.55)'
      ctx.lineWidth = 1.0
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

      // 4. Solder Vias & Landing Pins
      for (let i = 0; i < vias.length; i++) {
        const v = vias[i]

        ctx.fillStyle = v.isLanding ? '#f06030' : '#b85b24'
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.isLanding ? 4.8 : 4.0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffd180'
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.isLanding ? 3.4 : 2.8, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#020710'
        ctx.beginPath()
        ctx.arc(v.x, v.y, 1.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(v.x - 1.0, v.y - 1.0, 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      // 5. Silkscreen Technical Labels
      ctx.save()
      ctx.font = '700 8.5px "Space Grotesk", monospace'
      ctx.fillStyle = 'rgba(240, 96, 48, 0.55)'
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

      // 6. Flowing Electrical Pulses (converge into center registration box)
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i]
        const trk = tracks[p.trackIdx]
        if (!trk || trk.totalDist === 0) continue

        p.progress += p.speed
        if (p.progress >= 1.0) {
          const endPt = trk.points[trk.points.length - 1]
          landingRipples.push({
            x: endPt.x,
            y: endPt.y,
            radius: 1,
            maxRadius: 18 + Math.random() * 10,
            alpha: 1.0,
            color: p.color,
          })

          p.progress = 0
          p.speed = 0.003 + Math.random() * 0.004
          const newColor = PULSE_PALETTE[Math.floor(Math.random() * PULSE_PALETTE.length)]
          p.color = newColor.glow
          p.core = newColor.core
        }

        const headDist = p.progress * trk.totalDist
        const tailDist = Math.max(0, headDist - p.length)
        const head = getPoint(trk, headDist)
        const tail = getPoint(trk, tailDist)

        ctx.save()
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2.6
        ctx.lineCap = 'round'
        ctx.shadowColor = p.color
        ctx.shadowBlur = 12

        ctx.beginPath()
        ctx.moveTo(tail.x, tail.y)
        ctx.lineTo(head.x, head.y)
        ctx.stroke()

        ctx.fillStyle = p.core
        ctx.shadowColor = p.core
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (Math.random() < 0.02) {
          sparks.push({
            x: head.x + (Math.random() - 0.5) * 6,
            y: head.y + (Math.random() - 0.5) * 6,
            alpha: 1.0,
            color: p.color,
            life: 6,
          })
        }
      }

      // 7. Landing Ripple Impacts
      for (let i = landingRipples.length - 1; i >= 0; i--) {
        const r = landingRipples[i]
        r.radius += 0.9
        r.alpha -= 0.045

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          landingRipples.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.strokeStyle = r.color
        ctx.globalAlpha = r.alpha
        ctx.lineWidth = 1.5
        ctx.shadowColor = r.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI, true)
        ctx.stroke()
        ctx.restore()
      }

      // 8. Micro-Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i]
        sp.life--
        sp.alpha -= 0.14
        if (sp.life <= 0 || sp.alpha <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = sp.alpha
        ctx.fillStyle = sp.color
        ctx.shadowColor = sp.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
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
      if (cardRef.current) ro.observe(cardRef.current)
    }

    requestAnimationFrame(() => {
      resize()
      setTimeout(resize, 80)
      setTimeout(resize, 300)
    })
    draw()

    return () => {
      observer.disconnect()
      if (ro) ro.disconnect()
      window.removeEventListener('resize', handleResize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <footer
      ref={containerRef}
      className={`retro-cyber-footer ${prefersReducedMotion ? 'ft-reduced-motion' : ''}`}
      id="contact"
    >
      {/* ── Background Film Grain Texture ── */}
      <div className="ft-grain-texture-layer" aria-hidden="true" />
      <div className="ft-smooth-cyan-glow" aria-hidden="true" />
      <div className="ft-smooth-orange-glow" aria-hidden="true" />

      {/* ── FLOWING REAL PCB CIRCUIT CANVAS (Assembles Into Center Box) ── */}
      <canvas ref={canvasRef} className="footer-circuit-canvas" aria-hidden="true" />

      {/* ── MAIN 3-ZONE CONTENT OVERLAY ── */}
      <div className="footer-overlay-grid">

        {/* ── LEFT ZONE: BRAND STATEMENT & EVENT DETAILS ─────────── */}
        <div className="footer-zone-left">
          <div className="footer-label-tag">// 05</div>

          {/* Heading rendered with PixelHeading dither reveal animation */}
          <PixelHeading
            as="h2"
            size="xl"
            level={2}
            className="footer-massive-heading"
          >
            {"JOIN\nTHE BUILD."}
          </PixelHeading>

          <div className="footer-event-meta">
            <span className="footer-event-title">XYNTRA 26-27</span>
            <div className="footer-event-date-row">
              <span className="footer-event-date">JAN 26-27, 2026</span>
              <span className="footer-meta-pipe">|</span>
              <span className="footer-event-venue">ARENA</span>
            </div>
          </div>
        </div>

        {/* ── CENTER ZONE: CYBER TERMINAL & CTA (Where Traces Assemble) ─ */}
        <div className="footer-zone-center">
          <div ref={cardRef} className="cyber-terminal-card">
            {/* Terminal Corner HUD Notches */}
            <span className="hud-corner hud-corner-tl" />
            <span className="hud-corner hud-corner-tr" />
            <span className="hud-corner hud-corner-bl" />
            <span className="hud-corner hud-corner-br" />

            {/* Glowing Bus Landing Header at top where circuit traces plug in */}
            <div className="terminal-bus-landing-header" aria-hidden="true" />

            <div className="terminal-inner-content">
              <p className="terminal-command-line">
                <span className="terminal-prompt-path">C:\&gt;</span> be_part_of_something_bigger.exe
              </p>

              <p className="terminal-blinking-prompt">
                x <span className="terminal-cursor">_</span>
              </p>

              {/* Main Registration Button */}
              <button
                type="button"
                className="terminal-cta-button"
                onClick={() => onNavigate?.(4, '/register')}
                aria-label="Register Now for Xyntra Hackathon"
              >
                <span>REGISTER NOW</span>
                <span className="btn-arrow" aria-hidden="true">&rarr;</span>
              </button>

              {/* Tagline Trio */}
              <div className="terminal-tagline-trio">
                <span>THINK</span>
                <span className="plus-sep">•</span>
                <span>BUILD</span>
                <span className="plus-sep">•</span>
                <span>DISRUPT</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ZONE: NAV & BRAND IDENTITY ─────────────────────── */}
        <div className="footer-zone-right">
          {/* Navigation Links Column */}
          <nav className="footer-nav-stack" aria-label="Footer Navigation">
            {navLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                className="footer-nav-link-item"
                onClick={() => handleNavClick(item)}
              >
                <span className="nav-dash">-</span>
                <span className="nav-title">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Vertical Separator Line */}
          <div className="footer-vertical-rule" aria-hidden="true" />

          {/* Brand & Socials Column */}
          <div className="footer-brand-identity-stack">
            {/* Social Icons Row */}
            <div className="footer-social-row">
              {/* Discord */}
              <a
                href="https://discord.gg/xyntra"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="Discord"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/xyntra"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/xyntra"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66s-.74-1.66-1.66-1.66c-.92 0-1.66.74-1.66 1.66s.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>
            </div>

            {/* Brand Logo & Name */}
            <div className="footer-brand-title-row">
              <span className="footer-brand-spark" aria-hidden="true">&#10022;</span>
              <span className="footer-brand-name">XYNTRA</span>
            </div>

            {/* Slogan */}
            <p className="footer-slogan-block">
              IDEAS FOR<br />
              A BRIGHTER<br />
              TOMORROW
            </p>

            {/* Accent Rule in Flame Orange */}
            <div className="footer-slogan-rule" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── BOTTOM META BAR (TIGHTENED BOTTOM SPACING) ────────────── */}
      <div className="footer-bottom-meta-bar">
        <span className="footer-copyright-text">
          &copy; 2026 XYNTRA. ALL RIGHTS RESERVED.
        </span>

        <span className="footer-dreamers-text">
          BUILT BY DREAMERS. <span className="dreamers-dash">—</span>
        </span>
      </div>
    </footer>
  )
}
