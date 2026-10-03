import React, { useState, useEffect } from 'react'
import './Home.css'

const EVENT_DATE = new Date('2026-10-24T09:00:00+05:30').getTime()

export default function Home({ onExplore }) {
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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" id="home">
        <span className="hero-streak" />
        <div className="hero-content">
          <p className="hero-kicker">THE FUTURE IS BUILT FROM WHAT WE UNSEAT</p>
          <h1>XYNTRA</h1>
          <p className="hero-sub">
            HACKATHON 2026 <span>·</span> A NEW ERA IN MOTION
          </p>
          <p className="hero-hook">Dream. Build. Disrupt.</p>
          <p className="hero-description">
            Step into the arena where bold ideas meet code, creativity meets execution,
            and builders turn problems into possibilities.
          </p>
          <div className="event-meta">
            <span>24 HOURS</span>
            <span>•</span>
            <span>HACKATHON</span>
            <span>•</span>
            <span>CHENNAI</span>
          </div>
          <button className="primary-btn" onClick={onExplore}>
            Explore About Page <span>→</span>
          </button>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="countdown-section">
        <p className="section-kicker">THE CLOCK IS TICKING</p>
        <h2>Hacking Begins In</h2>
        <div className="countdown-grid">
          <TimeCard value={timeLeft.days} label="Days" />
          <TimeCard value={timeLeft.hours} label="Hours" />
          <TimeCard value={timeLeft.minutes} label="Mins" />
          <TimeCard value={timeLeft.seconds} label="Secs" />
        </div>
      </section>
    </div>
  )
}

function TimeCard({ value, label }) {
  return (
    <div className="timer-card">
      <strong>{String(value).padStart(2, '0')}</strong>
      <span>{label}</span>
    </div>
  )
}
