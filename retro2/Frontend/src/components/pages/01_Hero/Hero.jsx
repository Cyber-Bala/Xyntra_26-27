import { useState, useEffect, useMemo } from 'react'
import './Hero.css'
import { Typewriter } from '../../fx/Atmosphere.jsx'

const EVENT_DATE = new Date('2026-10-24T09:00:00+05:30').getTime()

function getTimeLeft() {
  const difference = EVENT_DATE - Date.now()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function RadialDialCard({ index, value, unit, isHighlight }) {
  const spokes = useMemo(() => {
    const lines = []
    const count = 44
    for (let i = 0; i < count; i++) {
      const angleDeg = (i * 360) / count
      const rad = (angleDeg * Math.PI) / 180
      const isMajor = i % 4 === 0
      const r1 = 56
      const r2 = isMajor ? 96 : 88
      const x1 = 100 + Math.cos(rad) * r1
      const y1 = 100 + Math.sin(rad) * r1
      const x2 = 100 + Math.cos(rad) * r2
      const y2 = 100 + Math.sin(rad) * r2
      lines.push({ x1, y1, x2, y2, isMajor })
    }
    return lines
  }, [])

  return (
    <div className="radial-dial-box">
      <svg className="radial-dial-svg" viewBox="0 0 200 200" aria-hidden="true">
        {spokes.map((s, idx) => (
          <line
            key={idx}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.isMajor ? '#f2a93b' : 'rgba(242, 169, 59, 0.35)'}
            strokeWidth={s.isMajor ? 1.4 : 1.0}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="radial-dial-content">
        <span className={`radial-dial-badge ${isHighlight ? 'badge-coral' : ''}`}>{index}</span>
        <span className="radial-digit-num">{value}</span>
        <span className="radial-unit-label">{unit}</span>
      </div>
    </div>
  )
}

function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero-radial-countdown-strip">
      <RadialDialCard index="01" value={String(timeLeft.days).padStart(2, '0')} unit="DAYS" isHighlight={true} />
      <RadialDialCard index="02" value={String(timeLeft.hours).padStart(2, '0')} unit="HOURS" />
      <RadialDialCard index="03" value={String(timeLeft.minutes).padStart(2, '0')} unit="MINS" />
      <RadialDialCard index="04" value={String(timeLeft.seconds).padStart(2, '0')} unit="SECS" />
    </div>
  )
}

export default function Hero({ onNavigate }) {
  return (
    <section className="wireframe-hero-section" id="hero">
      <div className="hero-grid-floor" aria-hidden="true" />
      <div className="wireframe-hero-container">

        {/* ===== TOP / CENTER BRAND REGION ===== */}
        <div className="hero-top-brand-station">
          <p className="hero-kicker-text">
            NATIONAL LEVEL 24-HOUR HACKATHON
          </p>

          <div className="hero-brand-title-wrap">
            <h1 className="hero-outline-title">
              XYNTRA
              <span className="hero-outline-badge">
                <svg className="badge-svg-border" viewBox="0 0 60 48" preserveAspectRatio="none">
                  <polygon
                    points="8,1 52,1 59,8 59,40 52,47 8,47 1,40 1,8"
                    fill="none"
                    stroke="#f2a93b"
                    strokeWidth="1.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="badge-num">26</span>
              </span>
            </h1>
          </div>

          <p className="hero-hook-tagline">
            <Typewriter text="DREAM. BUILD. DISRUPT." />
          </p>
        </div>

        {/* ===== BOTTOM STATION (RADIAL DIAL COUNTDOWN & GOLD BUTTONS) ===== */}
        <div className="hero-bottom-action-station">
          <HeroCountdown />

          {/* ACTION BUTTONS (SOLID GOLD & OUTLINED TECH) */}
          <div className="hero-action-buttons-row">
            <button
              className="hero-solid-gold-btn glow-hover"
              onClick={() => onNavigate(4)}
              aria-label="Register Now"
            >
              <span className="btn-label-text">REGISTER NOW</span>
              <span className="btn-arrow-icon">→</span>
            </button>

            <button
              className="hero-outline-gold-btn glow-hover"
              onClick={() => onNavigate(2, 'problem-statements')}
              aria-label="Explore Tracks"
            >
              <span className="btn-label-text">EXPLORE TRACKS</span>
              <span className="btn-arrow-icon">↗</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
