import { useState, useEffect, useCallback } from 'react'
import './Hero.css'
import laptopImg from '../assets/hero/laptop.png'

// Configurable target date constant: 24h 06m 01s live countdown
// Matches the "24 06 01" from the design screenshot and ticks live second by second
const COUNTDOWN_STORAGE_KEY = 'xyntra_hero_countdown_deadline'

function getInitialTargetDate() {
  try {
    const saved = localStorage.getItem(COUNTDOWN_STORAGE_KEY)
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed
      }
    }
  } catch (e) {
    // ignore storage errors
  }
  // Target: 24 hours, 6 minutes, 1 second from initial load
  const deadline = Date.now() + (24 * 3600 + 6 * 60 + 1) * 1000
  try {
    localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(deadline))
  } catch (e) {
    // ignore storage errors
  }
  return deadline
}

const TARGET_DATE = getInitialTargetDate()

function getTimeLeft(targetTime) {
  const difference = targetTime - Date.now()
  if (difference <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' }
  }

  // Format: 24 06 01
  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor((difference / (1000 * 60)) % 60)
  const seconds = Math.floor((difference / 1000) % 60)

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

export default function Hero({ onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(TARGET_DATE))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-measure for precision layout calibration
  useEffect(() => {
    const measure = () => {
      const title = document.querySelector('.xyntra-pixel-title');
      const laptop = document.querySelector('.xyntra-laptop-img');
      const hackathon = document.querySelector('.xyntra-hackathon-bar');
      const rightBlock = document.querySelector('.xyntra-bottom-right-corner');
      if (title && laptop) {
        const tRect = title.getBoundingClientRect();
        const lRect = laptop.getBoundingClientRect();
        const hRect = hackathon ? hackathon.getBoundingClientRect() : null;
        const rRect = rightBlock ? rightBlock.getBoundingClientRect() : null;
        const vw = window.innerWidth / 100;
        const data = {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          title: { widthPx: Math.round(tRect.width * 10) / 10, widthVw: Math.round((tRect.width / vw) * 10) / 10 },
          laptop: { widthPx: Math.round(lRect.width * 10) / 10, widthVw: Math.round((lRect.width / vw) * 10) / 10 },
          hackathon: { widthPx: hRect ? Math.round(hRect.width * 10) / 10 : 0, widthVw: hRect ? Math.round((hRect.width / vw) * 10) / 10 : 0 },
          overlap: Boolean(rRect && lRect.right > rRect.left),
        };
        window.__HERO_DATA__ = data;
      }
    };
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [])

  const handleNavClick = useCallback(
    (pageId, sectionId) => {
      if (typeof onNavigate === 'function') {
        onNavigate(pageId, sectionId)
      } else {
        const target = document.getElementById(sectionId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    [onNavigate]
  )

  return (
    <section className="xyntra-hero-fullscreen" id="hero" aria-label="Xyntra Hero Section">
      {/* Halftone dot pattern overlay in top-right */}
      <div className="xyntra-halftone-overlay" aria-hidden="true" />

      {/* Subtle paper/film grain texture */}
      <div className="xyntra-noise-texture" aria-hidden="true" />

      {/* Ambient gradient lighting */}
      <div className="xyntra-ambient-glow" aria-hidden="true" />

      {/* =========================================================================
          7. TOP NAVBAR
          Cream tab at top-left, tagline at top-right inside the hero
          ========================================================================= */}
      <nav className="xyntra-nav-tab" aria-label="Xyntra Primary Navigation">
        <button
          type="button"
          className="xyntra-nav-logo"
          onClick={() => handleNavClick(1, 'hero')}
          aria-label="XYNTRA Home"
        >
          <span className="xyntra-nav-arrow" aria-hidden="true">→</span>
          <span className="xyntra-nav-brand">XYNTRA</span>
        </button>

        <div className="xyntra-nav-links">
          <button
            type="button"
            className="xyntra-nav-link"
            onClick={() => handleNavClick(1, 'hero')}
          >
            HOME
          </button>
          <button
            type="button"
            className="xyntra-nav-link"
            onClick={() => handleNavClick(2, 'about')}
          >
            ABOUT
          </button>
          <button
            type="button"
            className="xyntra-nav-link"
            onClick={() => handleNavClick(5, 'sponsors')}
          >
            PRIZES &amp; PARTNERS
          </button>
          <button
            type="button"
            className="xyntra-nav-link"
            onClick={() => handleNavClick(3, 'rules')}
          >
            RULES
          </button>
          <button
            type="button"
            className="xyntra-nav-link"
            onClick={() => handleNavClick(4, 'register')}
          >
            REGISTER
          </button>
        </div>
      </nav>

      {/* Far Right Top Tagline */}
      <div className="xyntra-top-tagline" aria-label="Motto">
        <span className="xyntra-tagline-text">IDEAS TRAVEL FURTHER TOGETHER.</span>
        <span className="xyntra-tagline-slashes" aria-hidden="true">///</span>
      </div>

      {/* =========================================================================
          4. CIRCLES COMING OUT OF THE LAPTOP (Centered on laptop, spreading outward)
          ========================================================================= */}
      <div className="xyntra-signal-rings-wrapper" aria-hidden="true">
        <svg
          className="xyntra-signal-rings-svg"
          viewBox="0 0 1600 1600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric rings spreading past edges, fading opacity */}
          <circle cx="800" cy="800" r="75" stroke="rgba(215, 245, 255, 0.85)" strokeWidth="3" />
          <circle cx="800" cy="800" r="145" stroke="rgba(215, 245, 255, 0.75)" strokeWidth="2.5" strokeDasharray="8 6" />
          <circle cx="800" cy="800" r="235" stroke="rgba(215, 245, 255, 0.8)" strokeWidth="3.2" />
          <circle cx="800" cy="800" r="340" stroke="rgba(215, 245, 255, 0.6)" strokeWidth="2.5" />
          <circle cx="800" cy="800" r="460" stroke="rgba(215, 245, 255, 0.7)" strokeWidth="3" strokeDasharray="16 10" />
          <circle cx="800" cy="800" r="600" stroke="rgba(215, 245, 255, 0.5)" strokeWidth="2.5" />
          <circle cx="800" cy="800" r="760" stroke="rgba(215, 245, 255, 0.35)" strokeWidth="2" />
          <circle cx="800" cy="800" r="940" stroke="rgba(215, 245, 255, 0.22)" strokeWidth="1.8" />

          {/* Radial radar lines */}
          <line x1="100" y1="800" x2="1500" y2="800" stroke="rgba(215, 245, 255, 0.28)" strokeWidth="1.5" strokeDasharray="5 7" />
          <line x1="800" y1="100" x2="800" y2="1500" stroke="rgba(215, 245, 255, 0.28)" strokeWidth="1.5" strokeDasharray="5 7" />
          <line x1="300" y1="300" x2="1300" y2="1300" stroke="rgba(215, 245, 255, 0.2)" strokeWidth="1.5" strokeDasharray="4 7" />
        </svg>
      </div>

      {/* =========================================================================
          3. LAPTOP BIG AND CENTERED (46vw wide, vertically centered, NO ribbon)
          ========================================================================= */}
      <div className="xyntra-laptop-anchor">
        <div className="xyntra-laptop-inner">
          <img
            src={laptopImg}
            alt="XYNTRA Cybernetic 80s Field Terminal Computer with CRT Screen"
            className="xyntra-laptop-img"
            loading="eager"
          />
          {/* Subtle CRT Screen Glow */}
          <div className="xyntra-crt-screen-glow" aria-hidden="true" />
        </div>
        {/* Surface Ground Shadow */}
        <div className="xyntra-laptop-ground-shadow" aria-hidden="true" />
      </div>

      {/* =========================================================================
          2. XYNTRA TITLE MUCH BIGGER (starts at left: 3vw, spans ~48vw)
          Above the laptop in z-index
          ========================================================================= */}
      <div className="xyntra-hero-title-group">
        {/* XYNTRA Pixel Title */}
        <div className="xyntra-pixel-title-wrapper">
          <h1 className="xyntra-pixel-title">
            XYNTRA
            <span className="xyntra-tm-badge" aria-label="Trademark">TM</span>
          </h1>
        </div>

        {/* HACKATHON Subtitle (exactly as wide as XYNTRA) */}
        <div className="xyntra-hackathon-bar" aria-label="Hackathon">
          <span>H</span>
          <span>A</span>
          <span>C</span>
          <span>K</span>
          <span>A</span>
          <span>T</span>
          <span>H</span>
          <span>O</span>
          <span>N</span>
        </div>

        {/* THE FREQUENCY ROUTE (~35vw wide) */}
        <p className="xyntra-frequency-route">
          THE FREQUENCY ROUTE
        </p>
      </div>

      {/* =========================================================================
          5. BOTTOM-LEFT CORNER (left: 3vw, bottom: 4vh)
          ========================================================================= */}
      <div className="xyntra-bottom-left-corner">
        <div className="xyntra-manifesto-list">
          <span>BUILD</span>
          <span>CONNECT</span>
          <span>DISRUPT</span>
          <span>WHAT&apos;S NEXT.</span>
        </div>

        {/* Audio Waveform */}
        <div className="xyntra-waveform-box" aria-hidden="true">
          <svg
            className="xyntra-waveform-svg"
            viewBox="0 0 160 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal baseline dotted frequency line */}
            <line x1="0" y1="26" x2="160" y2="26" stroke="#8DE8FF" strokeOpacity="0.35" strokeDasharray="2 3" />
            {/* Vertical spectrum bars */}
            <line x1="8" y1="23" x2="8" y2="29" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="16" y1="19" x2="16" y2="33" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="24" y1="15" x2="24" y2="37" stroke="#A8ECF9" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="32" y1="10" x2="32" y2="42" stroke="#CAF0F8" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="40" y1="5" x2="40" y2="47" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="48" y1="11" x2="48" y2="41" stroke="#CAF0F8" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="56" y1="3" x2="56" y2="49" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="64" y1="2" x2="64" y2="50" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="72" y1="6" x2="72" y2="46" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="80" y1="2" x2="80" y2="50" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="88" y1="9" x2="88" y2="43" stroke="#CAF0F8" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="96" y1="4" x2="96" y2="48" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="104" y1="12" x2="104" y2="40" stroke="#CAF0F8" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="112" y1="16" x2="112" y2="36" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="120" y1="19" x2="120" y2="33" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="128" y1="21" x2="128" y2="31" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="136" y1="23" x2="136" y2="29" stroke="#8DE8FF" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Small 5-bar Equalizer Icon */}
        <div className="xyntra-eq-icon" aria-hidden="true">
          <span className="xyntra-eq-bar bar-1" />
          <span className="xyntra-eq-bar bar-2" />
          <span className="xyntra-eq-bar bar-3" />
          <span className="xyntra-eq-bar bar-4" />
          <span className="xyntra-eq-bar bar-5" />
        </div>
      </div>

      {/* =========================================================================
          6. BOTTOM-RIGHT CORNER (right: 3vw, bottom: 4vh, width: ~18vw)
          ========================================================================= */}
      <aside className="xyntra-bottom-right-corner">
        {/* Condensed Headline */}
        <h2 className="xyntra-right-headline">
          SAME<br />
          SIGNAL.<br />
          HIGHER<br />
          POSSIBILITIES.
        </h2>

        {/* Lime CTA Button */}
        <button
          type="button"
          className="xyntra-lime-register-btn"
          onClick={() => handleNavClick(4, 'register')}
          aria-label="Register Now for Xyntra Hackathon"
        >
          <span>REGISTER NOW</span>
          <span className="xyntra-lime-btn-arrow" aria-hidden="true">→</span>
        </button>

        {/* Dark Navy Countdown Box */}
        <div className="xyntra-navy-countdown-box" aria-label="Countdown to registration deadline">
          <div className="xyntra-countdown-unit">
            <span className="xyntra-countdown-num">{timeLeft.hours}</span>
            <span className="xyntra-countdown-lbl">HOURS</span>
          </div>
          <div className="xyntra-countdown-unit">
            <span className="xyntra-countdown-num">{timeLeft.minutes}</span>
            <span className="xyntra-countdown-lbl">MINUTES</span>
          </div>
          <div className="xyntra-countdown-unit">
            <span className="xyntra-countdown-num">{timeLeft.seconds}</span>
            <span className="xyntra-countdown-lbl">SECONDS</span>
          </div>
        </div>
      </aside>
    </section>
  )
}
