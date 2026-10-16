import { useEffect, useRef, useState } from 'react'
import timelineImage from '@/assets/images/timeline-cassette.jpg'
import reelL1Img from '@/assets/images/reel_l1.png'
import reelL2Img from '@/assets/images/reel_l2.png'
import reelR2Img from '@/assets/images/reel_r2.png'
import reelR1TapePatch from '@/assets/images/reel_r1_tape_patch.png'
import Globe from './Globe.jsx'
import './Timeline.css'

/**
 * Animated timeline component — Updated with clean TIMELINE header.
 *
 * The original artwork is rendered as a permanent base reference.
 * - Left cassette tape reels rotate around their exact centers
 * - Right cassette tape reels rotate in synchronization
 * - Exact copper magnetic tape flows continuously and infinitely over the tape recorder
 * - Bottom-left globe rotates in 3D according to its tilted axis at its full original size
 * - Top-center audio signal waveform equalizer actively in motion
 * - Subtle twinkle on existing star glints
 */

// Exact equalizer signal bars matching the top-center audio waveform in the artwork
const SIGNAL_BARS = [
  { x: 425, base: 117, h: 48, delay: '0.12s' },
  { x: 431, base: 117, h: 42, delay: '0.34s' },
  { x: 437, base: 117, h: 32, delay: '0.05s' },
  { x: 445, base: 117, h: 36, delay: '0.52s' },
  { x: 455, base: 117, h: 38, delay: '0.22s' },
  { x: 475, base: 117, h: 45, delay: '0.41s' },
  { x: 483, base: 117, h: 54, delay: '0.18s' },
  { x: 489, base: 117, h: 42, delay: '0.63s' },
  { x: 496, base: 117, h: 26, delay: '0.29s' },
  { x: 503, base: 117, h: 48, delay: '0.08s' },
  { x: 510, base: 117, h: 38, delay: '0.45s' },
  { x: 517, base: 117, h: 58, delay: '0.15s' },
  { x: 524, base: 117, h: 42, delay: '0.55s' },
  { x: 530, base: 117, h: 40, delay: '0.32s' },
  { x: 536, base: 117, h: 22, delay: '0.48s' },
  { x: 542, base: 117, h: 62, delay: '0.02s' },
  { x: 551, base: 117, h: 36, delay: '0.38s' },
  { x: 559, base: 117, h: 50, delay: '0.21s' },
  { x: 566, base: 117, h: 34, delay: '0.59s' },
  { x: 573, base: 117, h: 28, delay: '0.14s' },
  { x: 580, base: 117, h: 36, delay: '0.42s' },
  { x: 587, base: 117, h: 46, delay: '0.25s' },
  { x: 593, base: 117, h: 44, delay: '0.50s' },
  { x: 598, base: 117, h: 56, delay: '0.11s' },
  { x: 605, base: 117, h: 44, delay: '0.36s' },
  { x: 611, base: 117, h: 42, delay: '0.19s' },
]

export default function Timeline() {
  const containerRef = useRef(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)

    const handler = (e) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const animClass = prefersReducedMotion ? 'tl-no-motion' : 'tl-animated'

  return (
    <section className={`timeline-cassette-section ${animClass}`} ref={containerRef}>
      <div className="tl-image-wrapper">
        {/* ── BASE IMAGE ── */}
        <img
          src={timelineImage}
          alt="Xyntra hackathon timeline — two cassette tapes connected by copper magnetic tape passing through IDEA, BUILD, SUBMIT, and SHOWCASE milestones"
          className="tl-base-image"
          draggable={false}
        />

        {/* ── ANIMATION OVERLAYS CONTAINER ─────────────────── */}
        <div className="tl-overlay" aria-hidden="true">

          {/* ═══════════════════════════════════════════════════
              1. LEFT CASSETTE REELS (Rotating Rolls)
              ═══════════════════════════════════════════════════ */}
          <div className="tl-reel tl-left-reel-l">
            <img src={reelL1Img} alt="" className="tl-reel-img tl-spin-ccw" />
          </div>
          <div className="tl-reel tl-left-reel-r">
            <img src={reelL2Img} alt="" className="tl-reel-img tl-spin-ccw" />
          </div>

          {/* ═══════════════════════════════════════════════════
              4. RIGHT CASSETTE REELS (Rotating Rolls)
              ═══════════════════════════════════════════════════ */}
          <div className="tl-reel tl-right-reel-l">
            <img src={reelR2Img} alt="" className="tl-reel-img tl-spin-ccw" />
            <img src={reelR1TapePatch} alt="" className="tl-tape-patch-r1" />
          </div>
          <div className="tl-reel tl-right-reel-r">
            <img src={reelR2Img} alt="" className="tl-reel-img tl-spin-ccw" />
          </div>

          {/* ═══════════════════════════════════════════════════
              5. TOP-CENTER AUDIO SIGNAL WAVEFORM (IN MOTION)
              ═══════════════════════════════════════════════════ */}
          <svg
            className="tl-vector-svg"
            viewBox="0 0 1024 576"
            preserveAspectRatio="none"
          >
            <g className="tl-signal-waveform-group">
              {SIGNAL_BARS.map((bar, i) => (
                <line
                  key={i}
                  x1={bar.x}
                  y1={bar.base}
                  x2={bar.x}
                  y2={bar.base - bar.h}
                  className="tl-signal-bar"
                  style={{
                    animationDelay: bar.delay,
                    transformOrigin: `${bar.x}px ${bar.base}px`,
                  }}
                />
              ))}
            </g>
          </svg>

          {/* ═══════════════════════════════════════════════════
              6. BOTTOM-LEFT GLOBE (Full authentic size, rotating in 3D)
              ═══════════════════════════════════════════════════ */}
          <Globe />

          {/* ═══════════════════════════════════════════════════
              7. DECORATIVE ELEMENTS (twinkling star glints)
              ═══════════════════════════════════════════════════ */}
          <div className="tl-star tl-star-1" />
          <div className="tl-star tl-star-2" />
          <div className="tl-star tl-star-3" />
        </div>
      </div>
    </section>
  )
}
