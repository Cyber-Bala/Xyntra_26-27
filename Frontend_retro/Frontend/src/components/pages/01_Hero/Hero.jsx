import { useState, useEffect } from 'react'
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

function SunburstDial({ step, value, unit, isCrimson }) {
  return (
    <div className={`hero-dial-card ${isCrimson ? 'dial-crimson' : ''}`}>
      <svg className="dial-sunburst-svg" viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => {
          const deg = i * 10
          const rad = (deg * Math.PI) / 180
          const isCardinal = deg % 90 === 0
          const isMajor = deg % 30 === 0
          const r1 = 44
          const r2 = 98
          const x1 = +(100 + r1 * Math.sin(rad)).toFixed(2)
          const y1 = +(100 - r1 * Math.cos(rad)).toFixed(2)
          const x2 = +(100 + r2 * Math.sin(rad)).toFixed(2)
          const y2 = +(100 - r2 * Math.cos(rad)).toFixed(2)

          return (
            <g key={deg}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e5bf7c"
                strokeWidth={isCardinal ? '1.5' : isMajor ? '1.2' : '0.9'}
                strokeOpacity={isCardinal ? '0.95' : isMajor ? '0.8' : '0.55'}
              />
              {isCardinal && (
                <line
                  x1={+(100 + 70 * Math.sin(rad) - 3.5 * Math.cos(rad)).toFixed(2)}
                  y1={+(100 - 70 * Math.cos(rad) - 3.5 * Math.sin(rad)).toFixed(2)}
                  x2={+(100 + 70 * Math.sin(rad) + 3.5 * Math.cos(rad)).toFixed(2)}
                  y2={+(100 - 70 * Math.cos(rad) + 3.5 * Math.sin(rad)).toFixed(2)}
                  stroke="#e5bf7c"
                  strokeWidth="1.4"
                  strokeOpacity="0.9"
                />
              )}
            </g>
          )
        })}
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke="rgba(229,191,124,0.3)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
      </svg>

      <div className="dial-content-disk">
        <span className="dial-step-tag">{step}</span>
        <strong className="dial-value-num">{value}</strong>
        <small className="dial-unit-lbl">{unit}</small>
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
    <>
      <p className="hero-countdown-label">REGISTRATION CLOSES IN</p>
      <div className="hero-dials-strip" role="timer" aria-label="Registration countdown">
        <SunburstDial
          step="01"
          value={String(timeLeft.days).padStart(2, '0')}
          unit="DAYS"
          isCrimson
        />
        <SunburstDial
          step="02"
          value={String(timeLeft.hours).padStart(2, '0')}
          unit="HOURS"
        />
        <SunburstDial
          step="03"
          value={String(timeLeft.minutes).padStart(2, '0')}
          unit="MINS"
        />
        <SunburstDial
          step="04"
          value={String(timeLeft.seconds).padStart(2, '0')}
          unit="SECS"
        />
      </div>
    </>
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
                    stroke="#ffffff"
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

        {/* ===== BOTTOM STATION (COUNTDOWN & BUTTONS) ===== */}
        <div className="hero-bottom-action-station">
          <HeroCountdown />

          {/* ACTION BUTTONS (MATCHING EXACT CINEMATIC STYLE) */}
          <div className="hero-buttons-row">
            <button
              className="hero-btn-primary"
              onClick={() => onNavigate(3)}
              aria-label="Register Now"
            >
              <span>REGISTER NOW</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => onNavigate(2, 'problem-statements')}
              aria-label="Explore Tracks"
            >
              <span>EXPLORE TRACKS</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

