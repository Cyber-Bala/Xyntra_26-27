import { useState, useEffect } from 'react'
import './Hero.css'

// Target: Registration Deadline — October 20, 2026 at 23:59:59 IST
const EVENT_DATE = new Date('2026-10-20T23:59:59+05:30').getTime()

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

export default function Hero({ onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="about-v6 hero-v6-section" id="hero">
      {/* Background Grid matching About */}
      <div className="v6-grid-bg" aria-hidden="true" />

      {/* Floating Particles (80 particles) continuous with About */}
      <div className="v6-particle-field" aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="v6-particle"
            style={{
              '--x': `${(i * 37.13) % 100}%`,
              '--delay': `${-((i * 1.7) % 15)}s`,
              '--duration': `${10 + ((i * 1.4) % 12)}s`,
              '--size': `${2 + ((i * 2.7) % 4)}px`,
              '--drift': `${((i * 17) % 100) - 50}px`,
            }}
          />
        ))}
      </div>

      {/* Ambient Glows matching About */}
      <div className="v6-glow v6-glow-one" aria-hidden="true" />
      <div className="v6-glow v6-glow-two" aria-hidden="true" />

      <div className="about-v6-container hero-container-v6">

        {/* =====================================================
            CENTERED CINEMATIC HERO STACK (OPTION A)
            ===================================================== */}
        <div className="hero-cinematic-stack">

          {/* 1. Large 2-Line Centered Title: XYNTRA 2026. */}
          <h1 className="hero-cinematic-title">
            <span>XYNTRA</span>
            <span>2026</span>
          </h1>

          {/* 2. 4 Countdown Clock Dials in ONE Single Row */}
          <div className="hero-dials-strip">
            {/* Dial 01: DAYS (With Glowing Crimson Arc) */}
            <div className="v6-hero-stat dial-crimson">
              <span>01</span>
              <strong>{String(timeLeft.days).padStart(2, '0')}</strong>
              <small>DAYS</small>
            </div>

            {/* Dial 02: HOURS */}
            <div className="v6-hero-stat">
              <span>02</span>
              <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
              <small>HOURS</small>
            </div>

            {/* Dial 03: MINS */}
            <div className="v6-hero-stat">
              <span>03</span>
              <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
              <small>MINS</small>
            </div>

            {/* Dial 04: SECS */}
            <div className="v6-hero-stat">
              <span>04</span>
              <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
              <small>SECS</small>
            </div>
          </div>

          {/* 3. Centered Action Buttons */}
          <div className="hero-buttons-row">
            <button
              className="hero-btn-primary"
              onClick={() => onNavigate(3)}
              aria-label="Register Now"
            >
              <span>REGISTER NOW</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => onNavigate(2, 'problem-statements')}
              aria-label="Explore Tracks"
            >
              <span>EXPLORE TRACKS</span>
              <span className="btn-arrow">↗</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
