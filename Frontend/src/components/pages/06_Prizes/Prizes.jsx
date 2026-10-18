import { useEffect, useRef } from 'react'
import './Prizes.css'
import podiumsSvg from './podiums.svg?raw'
import grainTexture from '@/assets/images/footer_grain_texture.png'

const TICKER_R1 = ['Microsoft', 'Google Cloud', 'AWS', 'Intel', 'Dell Technologies', 'GitHub']
const TICKER_R2 = [
  'Neuralforge AI',
  'Blockbridge Protocol',
  'Cyberquest Org',
  'Opencore Systems',
  'Byteforge Matrix',
  'Polygon Guild',
  'Devfolio Network',
  'Hack2Skill Community',
]

const PRIZE_CARDS = [
  {
    rank: 1,
    title: 'Grand Champion',
    amount: '₹2,00,000',
    stripClass: 'pz-strip-first',
    perks: [
      'Gold trophy & citation',
      'Fast-track interview access',
      'Cloud credits & dev perks',
    ],
  },
  {
    rank: 2,
    title: 'Runner Up',
    amount: '₹1,00,000',
    stripClass: 'pz-strip-second',
    perks: [
      'Silver trophy & citation',
      'Partner fast-track review',
      'Cloud credits & dev perks',
    ],
  },
  {
    rank: 3,
    title: 'Second Runner Up',
    amount: '₹50,000',
    stripClass: 'pz-strip-third',
    perks: [
      'Bronze trophy & citation',
      'Mentorship network access',
      'Swag & goodies kit',
    ],
  },
]

export default function Prizes() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cs = [1, 2, 3].map((i) => document.getElementById(`p${i}cas`))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const REST = 26
    const LOWERED = REST + 560

    const setCassettePos = (c, y) => {
      if (!c) return
      c.setAttribute(
        'transform',
        `translate(-31 ${y.toFixed(1)}) translate(292 560) scale(.88) translate(-292 -560)`
      )
    }

    if (reduce) {
      cs.forEach((c) => setCassettePos(c, REST))
      return
    }

    // Initially start with cassettes lowered inside slots
    cs.forEach((c) => setCassettePos(c, LOWERED))

    let isRaised = false
    let isRaising = false
    let raiseTimer = null
    let animId = null

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animateRaise = () => {
      isRaising = true
      const startTime = performance.now()
      const duration = 1050
      // Stagger: runner up (#2), grand champion (#1), second runner up (#3)
      const staggers = [120, 0, 240]

      const step = (now) => {
        const elapsed = now - startTime
        let allDone = true

        cs.forEach((c, idx) => {
          if (!c) return
          const stagger = staggers[idx] || 0
          if (elapsed < stagger) {
            allDone = false
            setCassettePos(c, LOWERED)
            return
          }
          const progress = Math.min(1, Math.max(0, (elapsed - stagger) / duration))
          if (progress < 1) allDone = false
          const e = easeOutCubic(progress)
          const curY = LOWERED - e * (LOWERED - REST)
          setCassettePos(c, curY)
        })

        if (!allDone) {
          animId = requestAnimationFrame(step)
        } else {
          isRaising = false
          isRaised = true
        }
      }

      animId = requestAnimationFrame(step)
    }

    const checkPosition = () => {
      if (!cs[0] || !cs[1] || !cs[2]) {
        cs = [1, 2, 3].map((i) => document.getElementById(`p${i}cas`))
      }

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight

      // User has "fully reached the section":
      // Top of prize section is scrolled nicely into view (rect.top <= vh * 0.22)
      // and section is still active on screen (rect.bottom >= vh * 0.35)
      const fullyReached = rect.top <= vh * 0.22 && rect.bottom >= vh * 0.35

      if (fullyReached && !isRaised && !isRaising && !raiseTimer) {
        // Clear delay between section reveal and cassette raise (500ms delay)
        raiseTimer = setTimeout(() => {
          raiseTimer = null
          animateRaise()
        }, 500)
      } else if (!fullyReached && (rect.top > vh * 0.85 || rect.bottom < 0)) {
        // Reset if user scrolls completely away above or below
        if (raiseTimer) {
          clearTimeout(raiseTimer)
          raiseTimer = null
        }
        if (animId) cancelAnimationFrame(animId)
        isRaised = false
        isRaising = false
        cs.forEach((c) => setCassettePos(c, LOWERED))
      }
    }

    window.addEventListener('scroll', checkPosition, { passive: true })
    window.addEventListener('resize', checkPosition)

    if (window.lenisInstance) {
      window.lenisInstance.on('scroll', checkPosition)
    }

    checkPosition()

    return () => {
      if (raiseTimer) clearTimeout(raiseTimer)
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('scroll', checkPosition)
      window.removeEventListener('resize', checkPosition)
      if (window.lenisInstance) {
        window.lenisInstance.off('scroll', checkPosition)
      }
    }
  }, [])

  return (
    <section className="pz-section" id="prizes" ref={sectionRef}>
      {/* ── Decorative Code-Drawn Background Layer with Seamless Timeline Grain (z-index: 0) ── */}
      <div className="pz-bg-layer" aria-hidden="true">
        <div className="pz-bg-blue-base" />
        <div className="pz-shape-orange-top" />
        <div className="pz-shape-orange-bottom" />
        <div className="pz-grain-film" style={{ backgroundImage: `url(${grainTexture})` }} />
        <div className="pz-grain-mottle" />
        <div className="pz-grain-speckles" />
        <div className="pz-bg-grain" />
        <div className="pz-grain-timeline-seam" />
      </div>

      {/* ── Foreground Content Layer (z-index: 1) ── */}
      <div className="pz-content-layer">
        {/* 1. ONE LEFT COLUMN: Headline block + Total Prize Pool block */}
        <div className="pz-left-col">
          <div className="pz-headline-block">
            <span className="pz-headline-tag">+ 03 / PRIZES</span>
            <h1 className="prizes-headline">
              REAL IDEAS.
              <br />
              REAL RECOGNITION.
            </h1>
            <span className="pz-headline-sub">THREE TRACKS. A BRIGHTER TOMORROW.</span>
          </div>

          <div className="pz-pool-block">
            <span className="pz-pool-tag">TOTAL PRIZE POOL</span>
            <div className="pz-pool-num">₹3,50,000+</div>
            <p className="pz-pool-sub">
              in prizes, and the teams and platforms backing every build.
            </p>
          </div>
        </div>

        {/* 2. PODIUM + CARDS WRAPPER (right side) */}
        <div className="pz-stage-wrap">
          {/* Animated Vector Podiums Stage with rising cassettes */}
          <div
            className="pz-podium-svg-wrap"
            dangerouslySetInnerHTML={{ __html: podiumsSvg }}
            aria-label="Three podiums: First, Second and Third, each with a cassette rising from a slot in the stone"
            role="img"
          />

          <div className="pz-cards-row">
            {PRIZE_CARDS.map((p) => (
              <div key={p.rank} className={`pz-card pz-card-rank-${p.rank}`}>
                <div className={`pz-card-strip ${p.stripClass}`} aria-hidden="true" />
                <div className="pz-card-header">
                  <h2 className="pz-card-title">{p.title}</h2>
                </div>
                <div className="pz-card-amount">{p.amount}</div>
                <div className="pz-card-divider" />
                <ul className="pz-card-perks">
                  {p.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5. TICKER (bottom, full width, moving) */}
        <div className="pz-ticker-wrap" aria-label="Sponsors and partners">
          <div className="pz-marquee">
            <div className="pz-marquee-track">
              {[...TICKER_R1, ...TICKER_R1, ...TICKER_R1, ...TICKER_R1].map((item, idx) => (
                <span key={idx} className="pz-ticker-r1-item">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pz-marquee small">
            <div className="pz-marquee-track reverse">
              {[...TICKER_R2, ...TICKER_R2].map((item, idx) => (
                <span key={idx} className="pz-ticker-r2-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
