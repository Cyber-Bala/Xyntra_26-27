import { useState, useEffect } from 'react'
import './Hero.css'

const EVENT_DATE = new Date('2026-10-24T09:00:00+05:30').getTime()

export default function Hero({ onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="wireframe-hero-section" id="hero">
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
            DREAM. BUILD. DISRUPT.
          </p>
        </div>

        {/* ===== BOTTOM STATION (COUNTDOWN & BUTTONS) ===== */}
        <div className="hero-bottom-action-station">
          {/* CLEAN WHITE TEXT: REGISTRATION CLOSES IN */}
          <p className="hero-countdown-label">
            REGISTRATION CLOSES IN
          </p>

          {/* BIG TECH CHAMFERED COUNTDOWN TIMER */}
          <div className="hero-countdown-strip">
            <TechCountdownCard
              value={String(timeLeft.days).padStart(2, '0')}
              unit="DAYS"
            />

            <span className="tech-colon-separator">:</span>

            <TechCountdownCard
              value={String(timeLeft.hours).padStart(2, '0')}
              unit="HOURS"
            />

            <span className="tech-colon-separator">:</span>

            <TechCountdownCard
              value={String(timeLeft.minutes).padStart(2, '0')}
              unit="MINS"
            />

            <span className="tech-colon-separator">:</span>

            <TechCountdownCard
              value={String(timeLeft.seconds).padStart(2, '0')}
              unit="SECS"
            />
          </div>

          {/* TECH OUTLINE ACTION BUTTONS */}
          <div className="hero-action-buttons-row">
            <button
              className="tech-chamfer-btn glow-hover"
              onClick={() => onNavigate(3)}
              aria-label="Review Rules & Register"
            >
              <svg className="tech-btn-svg" viewBox="0 0 320 54" preserveAspectRatio="none">
                <polygon
                  points="14,1 306,1 319,14 319,40 306,53 14,53 1,40 1,14"
                  fill="rgba(8, 8, 12, 0.6)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="btn-content-inner">
                <span className="btn-label-text">REVIEW RULES &amp; REGISTER</span>
                <span className="btn-arrow-icon">→</span>
              </span>
            </button>

            <button
              className="tech-chamfer-btn glow-hover"
              onClick={() => onNavigate(2, 'problem-statements')}
              aria-label="Explore Problem Statements"
            >
              <svg className="tech-btn-svg" viewBox="0 0 320 54" preserveAspectRatio="none">
                <polygon
                  points="14,1 306,1 319,14 319,40 306,53 14,53 1,40 1,14"
                  fill="rgba(8, 8, 12, 0.6)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="btn-content-inner">
                <span className="btn-label-text">EXPLORE PROBLEM STATEMENTS</span>
                <span className="btn-arrow-icon">→</span>
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

function TechCountdownCard({ value, unit }) {
  return (
    <div className="tech-countdown-box">
      <svg className="tech-card-svg" viewBox="0 0 150 130" preserveAspectRatio="none">
        <polygon
          points="18,1 132,1 149,18 149,112 132,129 18,129 1,112 1,18"
          fill="rgba(8, 8, 12, 0.5)"
          stroke="#ffffff"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="tech-card-content">
        <span className="tech-digit-num">{value}</span>
        <span className="tech-unit-label">{unit}</span>
      </div>
    </div>
  )
}
