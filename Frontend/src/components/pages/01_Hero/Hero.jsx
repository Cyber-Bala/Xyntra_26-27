import React, { useState, useEffect } from 'react'
import './Hero.css'
import recLogo from '../../../assets/logos/rec_logo.png'
import ieeeCsLogo from '../../../assets/logos/ieee_cs_logo.png'

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
    <section className="hackathon-home-section" id="hero">
      <div className="hackathon-home-container">

        {/* TOP KICKER BADGE */}
        <div className="home-kicker-pill">
          <span className="kicker-spark">✦</span>
          <span>THE FUTURE IS BUILT FROM WHAT WE UNSEAT</span>
        </div>

        {/* MAIN HACKATHON BRANDING */}
        <div className="home-main-title-block">
          <h1 className="home-title-text">
            XYNTRA
            <span className="home-year-badge">2026</span>
          </h1>

          <p className="home-subtitle-text">
            NATIONAL LEVEL 24-HOUR HACKATHON <span>·</span> A NEW ERA IN MOTION
          </p>

          <p className="home-hook-quote">
            "Dream. Build. Disrupt. Step into the arena where bold ideas meet code,
            creativity meets execution, and builders turn problems into possibilities."
          </p>
        </div>

        {/* METADATA PILLS */}
        <div className="home-meta-strip">
          <span className="meta-pill">⏱ 24 HOURS SPRINT</span>
          <span className="meta-dot">•</span>
          <span className="meta-pill">📍 CHENNAI CAMPUS</span>
          <span className="meta-dot">•</span>
          <span className="meta-pill">📅 OCT 24 – 25, 2026</span>
          <span className="meta-dot">•</span>
          <span className="meta-pill">🏆 ₹1,00,000+ REWARDS</span>
        </div>

        {/* LIVE COUNTDOWN STATION */}
        <div className="home-countdown-station">
          <div className="countdown-header-bar">
            <span className="countdown-pulse-dot" />
            <span className="countdown-title">Hacking Begins In</span>
          </div>

          <div className="countdown-grid-box">
            <TimeCard value={timeLeft.days} unit="Days" />
            <span className="time-colon">:</span>
            <TimeCard value={timeLeft.hours} unit="Hours" />
            <span className="time-colon">:</span>
            <TimeCard value={timeLeft.minutes} unit="Mins" />
            <span className="time-colon">:</span>
            <TimeCard value={timeLeft.seconds} unit="Secs" />
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="home-actions-group">
          <button className="home-primary-btn" onClick={() => onNavigate(3)}>
            <span>Review Rules &amp; Register</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button className="home-secondary-btn" onClick={() => onNavigate(2)}>
            <span>Explore Problem Statements ↓</span>
          </button>
        </div>

        {/* INDUSTRIAL & INSTITUTIONAL PARTNER STRIP */}
        <div className="home-sponsors-strip">
          <span className="sponsors-caption">ORGANIZED &amp; POWERED BY</span>
          <div className="sponsors-badges-row">
            <div className="sponsor-box-item logo-box-item">
              <img src={recLogo} alt="Rajalakshmi Engineering College" className="partner-logo-img" />
            </div>
            <div className="sponsor-box-item logo-box-item">
              <img src={ieeeCsLogo} alt="IEEE Computer Society" className="partner-logo-img" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function TimeCard({ value, unit }) {
  return (
    <div className="time-card-item">
      <span className="time-num">{String(value).padStart(2, '0')}</span>
      <span className="time-unit">{unit}</span>
    </div>
  )
}
