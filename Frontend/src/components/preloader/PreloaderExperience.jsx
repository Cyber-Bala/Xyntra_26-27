import React, { useState, useEffect } from 'react'
import './PreloaderExperience.css'

export default function PreloaderExperience({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('loading') // 'loading' | 'intro'
  const [isWarping, setIsWarping] = useState(false)

  // Smooth realistic counter progression (Stage 1)
  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      const increment = current > 80 ? (Math.random() > 0.4 ? 1 : 2) : (Math.random() > 0.3 ? 2 : 3)
      current += increment

      if (current >= 100) {
        current = 100
        setProgress(100)
        clearInterval(interval)
        
        // Transition to Stage 2: Kinetic Intro Screen
        setTimeout(() => {
          setStage('intro')
        }, 400)
      } else {
        setProgress(current)
      }
    }, 38)

    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    setIsWarping(true)
    setTimeout(() => {
      onComplete()
    }, 650)
  }

  return (
    <div className={`noomo-preloader-screen ${isWarping ? 'warp-exit' : ''}`} aria-label="Loading Experience">
      
      {/* TOP HEADER CONTROLS */}
      <div className="noomo-preloader-top">
        <div className="preloader-brand-label">
          <span className="brand-dot" />
          <span>XYNTRA 2026 // {stage === 'loading' ? 'INITIALIZING' : 'ARENA INTRO'}</span>
        </div>
        <button className="preloader-skip-btn" onClick={handleGetStarted}>
          <span>Skip to Home ↗</span>
        </button>
      </div>

      {/* ================= STAGE 1: NOOMO BOTTOM-LEFT PRELOADER (PHOTO 1) ================= */}
      {stage === 'loading' && (
        <div className="noomo-loading-stage">
          <div className="noomo-center-hint">
            <span className="hint-pulse-text">INITIALIZING ARENA SYSTEM...</span>
          </div>

          <div className="noomo-bottom-loader-block">
            <div className="noomo-percent-row">
              <span className="noomo-percent-val">{progress}%</span>
            </div>

            <div className="noomo-pill-bar-wrapper">
              <div className="pill-node left-node">
                <span className="node-symbol">☵</span>
              </div>
              <div className="pill-capsule-track">
                <div
                  className="pill-capsule-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="pill-node center-node">
                <span className="node-symbol">❖</span>
              </div>
              <div className="pill-brand-node">
                <span className="brand-chars">XY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: KINETIC HEADLINE INTRO (PHOTO 2) ================= */}
      {stage === 'intro' && (
        <div className="noomo-intro-stage">
          
          <div className="kinetic-intro-content">
            <h1 className="kinetic-intro-title">
              <span>STEP INTO</span>{' '}
              <span className="noomo-blue-pill">XYNTRA 2026.</span>{' '}
              <span>THE ARENA WHERE WE TURN EVERY</span>{' '}
              <span>LINE OF CODE</span>{' '}
              <span>INTO</span>{' '}
              <span className="noomo-blue-pill">A STORY</span>{' '}
              <span>THROUGH</span>{' '}
              <span className="bold-word">AI,</span>{' '}
              <span>WEB3, MOTION &amp;</span>{' '}
              <span className="noomo-blue-pill large-pill">INTERACTIVE EXPERIENCES</span>
            </h1>

            <div className="intro-cta-row">
              <button className="noomo-get-started-btn" onClick={handleGetStarted} autoFocus>
                <span>GET STARTED</span>
                <span className="btn-arrow-bubble">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* BOTTOM METADATA BAR */}
      <div className="noomo-preloader-bottom">
        <span>IEEE COMPUTER SOCIETY · NATIONAL LEVEL 24-HOUR HACKATHON</span>
        <span>CHENNAI CAMPUS // 2026</span>
      </div>

    </div>
  )
}
