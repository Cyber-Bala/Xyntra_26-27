import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Rules.css'
import Footer from '../../footer/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Rules({ onNavigate }) {
  const sectionRef = useRef(null)
  const [agreed, setAgreed] = useState(false)

  const rulesData = [
    {
      num: '01',
      code: 'SEC-01 // ROSTER_SPEC',
      title: 'Team Formation & Eligibility',
      badge: 'ELIGIBILITY',
      directive: 'ROSTER INTEGRITY DIRECTIVE',
      points: [
        'Teams must consist of 2 to 4 members with one designated team leader.',
        'All team members must hold valid college/university identification cards.',
        'Cross-college and interdisciplinary team formations are strictly welcomed.',
        'Individual registration changes cannot be made once the lock deadline passes.',
      ],
    },
    {
      num: '02',
      code: 'SEC-02 // ETHICS_CORE',
      title: 'Code of Conduct & Integrity',
      badge: 'FAIR PLAY',
      directive: 'HONOR CODE & ANTI-PLAGIARISM',
      points: [
        'All code and design prototypes must be authored during the 24-hour hackathon period.',
        'Open-source libraries, UI kits, and public APIs must be declared during checkpoints.',
        'Plagiarism or pre-built complete templates will result in immediate disqualification.',
        'Maintain respect and professional ethics across all physical and virtual arenas.',
      ],
    },
    {
      num: '03',
      code: 'SEC-03 // TELEMETRY_EVAL',
      title: 'Submissions & Evaluation Criteria',
      badge: 'JUDGING',
      directive: 'SCORING BENCHMARK MATRIX',
      points: [
        'Submissions require a public GitHub repository, working demo, and 2-min pitch video.',
        'Evaluation Weights: Innovation (30%), Technical Execution (30%), UI/UX (20%), Pitch (20%).',
        'Industry mentors will conduct 2 mandatory checkpoint evaluations during the sprint.',
        'The decision of the grand jury panel is final, absolute, and non-negotiable.',
      ],
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const isDesktop = window.innerWidth >= 768

    const ctx = gsap.context(() => {
      // 1. FAST ENTRANCE REVEAL: Cards glide in cleanly when section reaches 92% of viewport
      gsap.fromTo(
        '.rule-chassis-card',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.rules-cards-grid',
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // 2. CONTINUOUS SCROLL-DRIVEN PARALLAX MOTION
      if (isDesktop) {
        gsap.to('.rule-chassis-card:nth-child(2)', {
          y: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: '.rules-cards-grid',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        })

        gsap.to('.rule-chassis-card:nth-child(1)', {
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: '.rules-cards-grid',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        })

        gsap.to('.rule-chassis-card:nth-child(3)', {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '.rules-cards-grid',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.0,
          },
        })

      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="rules-page-section" id="rules">
      {/* AMBIENT RETRO HARDWARE LIGHTING */}
      <div className="section-merged-substrate" aria-hidden="true">
        <div className="ambient-radial-beacon beacon-red" />
        <div className="ambient-radial-beacon beacon-interlock" />
      </div>

      <div className="rules-main-container">

        {/* RETRO HARDWARE HEADER */}
        <div className="rules-header-block">
          <div className="rules-header-copy">
            <div className="rules-kicker-tag">
              <span className="retro-status-led led-red" />
              <span className="rules-mono-prefix">[SAFETY_DIRECTIVE // ENFORCED]</span>
              <span className="rules-sep">/</span>
              <span>TERMS OF ENGAGEMENT</span>
            </div>
            <h1 className="rules-main-title">RULES &amp; GUIDELINES</h1>
            <p className="rules-lead-desc">
              To ensure absolute fairness, transparency, and spirited competition, every team entering
              the Xyntra Arena must comply with the following operational standards.
            </p>
          </div>
          <div className="rules-gadget-plate" aria-hidden="true">
            <svg viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vita-shell" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#f1e2c8" />
                  <stop offset=".28" stopColor="#c7b08a" />
                  <stop offset=".72" stopColor="#887456" />
                  <stop offset="1" stopColor="#e2d0ae" />
                </linearGradient>
                <linearGradient id="vita-glass" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#182c32" />
                  <stop offset=".48" stopColor="#152b30" />
                  <stop offset="1" stopColor="#07120f" />
                </linearGradient>
                <radialGradient id="vita-stick" cx=".35" cy=".28" r=".8">
                  <stop stopColor="#81735e" />
                  <stop offset=".65" stopColor="#39352f" />
                  <stop offset="1" stopColor="#171717" />
                </radialGradient>
                <filter id="vita-shadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity=".65" />
                </filter>
                <pattern id="vita-screen-lines" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M0 1H4" stroke="#d8e5d8" strokeOpacity=".13" />
                </pattern>
                <linearGradient id="vita-screen-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#eab04a" stopOpacity="0" />
                  <stop offset=".5" stopColor="#f4ebd9" stopOpacity=".14" />
                  <stop offset="1" stopColor="#eab04a" stopOpacity="0" />
                </linearGradient>
                <clipPath id="vita-screen-clip">
                  <rect x="78" y="42" width="184" height="114" rx="5" />
                </clipPath>
              </defs>
              <g filter="url(#vita-shadow)">
                <path d="M24 23h292q13 0 16 14l8 121q1 17-16 19l-54 5-10-12H80l-10 12-54-5Q0 175 1 158L9 37q2-14 15-14Z" fill="url(#vita-shell)" stroke="#f3e7d2" strokeWidth="3" />
                <path d="M24 30h292" stroke="#fff6e6" strokeOpacity=".6" strokeWidth="2" />
                <path d="M18 29q-8 2-9 12L3 154q0 9 8 10m307-135q8 2 9 12l6 113q0 9-8 10" stroke="#584a37" strokeOpacity=".75" strokeWidth="3" />
                <path d="M21 17h45q8 0 10 7H20zm253 0h45l1 7h-56q2-7 10-7Z" fill="#897558" stroke="#ded0b6" strokeWidth="2" />
                <path d="M65 31h210q9 0 9 9v118q0 9-9 9H65q-9 0-9-9V40q0-9 9-9Z" fill="#171817" stroke="#5a4c38" strokeWidth="4" />
                <rect x="78" y="42" width="184" height="114" rx="5" fill="url(#vita-glass)" />
                <g clipPath="url(#vita-screen-clip)">
                <rect x="78" y="42" width="184" height="114" fill="#101a16" />
                <path d="M91 58h158" stroke="#eab04a" strokeWidth="2" />
                <path d="M103 65h134" stroke="#eab04a" strokeOpacity=".75" strokeWidth="1" />
                <text x="170" y="91" fill="#f4ebd9" fontFamily="monospace" fontSize="19" fontWeight="700" letterSpacing="2" textAnchor="middle">XYNTRA</text>
                <path d="M123 99h94" stroke="#4fc9b8" strokeOpacity=".8" strokeWidth="1" />
                <path d="m113 115 5 5-5 5" stroke="#eab04a" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                <text x="170" y="123" fill="#f1dfc0" fontFamily="monospace" fontSize="8" fontWeight="700" letterSpacing=".35" textAnchor="middle">RULES &amp; REGULATIONS</text>
                <path d="M103 136h134" stroke="#eab04a" strokeOpacity=".65" strokeWidth="1" />
                <text className="vita-start-prompt" x="170" y="148" fill="#8fb7a2" fontFamily="monospace" fontSize="6" letterSpacing="1" textAnchor="middle">PRESS START</text>
                <rect x="78" y="42" width="184" height="114" fill="url(#vita-screen-lines)" />
                <path d="M86 48h95q-33 4-58 22t-37 24z" fill="#fff" opacity=".08" />
                <rect className="vita-screen-sheen" x="78" y="42" width="184" height="114" fill="url(#vita-screen-sheen)" />
                <rect x="78" y="42" width="184" height="114" rx="5" stroke="#9db2a0" strokeOpacity=".55" strokeWidth="2" />
                </g>
                <path d="M35 69v34m-17-17h34" stroke="#66583f" strokeWidth="11" strokeLinecap="square" />
                <path d="M35 70v32m-16-16h32" stroke="#26231e" strokeWidth="7" strokeLinecap="square" />
                <circle cx="40" cy="137" r="15" fill="#71654f" />
                <circle cx="40" cy="136" r="12" fill="url(#vita-stick)" stroke="#d1bb94" strokeWidth="2" />
                <circle cx="40" cy="136" r="4" fill="#201e1a" />
                <circle cx="298" cy="62" r="8" fill="#625642" />
                <circle cx="298" cy="62" r="5" fill="#c6924b" />
                <circle cx="280" cy="80" r="8" fill="#625642" />
                <circle cx="280" cy="80" r="5" fill="#bd9954" />
                <circle cx="316" cy="80" r="8" fill="#625642" />
                <circle cx="316" cy="80" r="5" fill="#548976" />
                <circle cx="298" cy="98" r="8" fill="#625642" />
                <circle cx="298" cy="98" r="5" fill="#a37947" />
                <circle cx="298" cy="137" r="15" fill="#71654f" />
                <circle cx="298" cy="136" r="12" fill="url(#vita-stick)" stroke="#d1bb94" strokeWidth="2" />
                <circle cx="298" cy="136" r="4" fill="#201e1a" />
                <g stroke="#443a2b" strokeWidth="2">
                  <path d="M121 174v8m7-8v8m7-8v8m7-8v8m7-8v8" />
                  <path d="M194 174v8m7-8v8m7-8v8m7-8v8m7-8v8" />
                </g>
                <circle cx="170" cy="176" r="3" fill="#eab04a" />
              </g>
              <text x="114" y="194" fill="#443a2b" fontFamily="monospace" fontSize="7" fontWeight="700">XYNTRA // PORTABLE SYSTEM</text>
            </svg>
            <span className="rules-gadget-caption">HANDHELD // GAME RUNNING</span>
          </div>
        </div>

        {/* 3-COLUMN INDUSTRIAL DIRECTIVE CHASSIS GRID */}
        <div className="rules-cards-grid">
          {rulesData.map((rule) => (
            <div key={rule.num} className="rule-chassis-card">
              {/* CRT Scanline */}
              <div className="card-crt-scanline" aria-hidden="true" />

              {/* Card Header Strip */}
              <div className="rule-card-top-strip">
                <div className="rule-status-cluster">
                  <span className="retro-status-led led-amber" />
                  <span className="rule-sector-tag">{rule.code}</span>
                </div>
                <span className="rule-badge-pill">{rule.badge}</span>
              </div>

              {/* Title & Directive */}
              <div className="rule-title-group">
                <span className="rule-directive-sub">{rule.directive}</span>
                <h2 className="rule-card-title">{rule.title}</h2>
              </div>

              {/* Protocol Points List */}
              <ul className="rule-points-list">
                {rule.points.map((pt, i) => (
                  <li key={i} className="rule-point-item">
                    <span className="rule-point-index">[{rule.num}.{i + 1}]</span>
                    <span className="rule-point-text">{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Card Footer Footnote */}
              <div className="rule-card-footer">
                <span className="rule-compliance-tag">COMPLIANCE: MANDATORY</span>
                <span className="rule-active-state">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>

        {/* INDUSTRIAL SAFETY INTERLOCK CONSENT & PROCEED BAR */}
        <div className="rules-interlock-chassis">
          <div className="interlock-status-row">
            <div className="interlock-telemetry">
              <span className={`retro-status-led ${agreed ? 'led-green' : 'led-red'}`} />
              <span className="interlock-state-label">
                INTERLOCK STATUS: {agreed ? 'ARMED // LAUNCH PERMITTED' : 'STANDBY // CONSENT REQUIRED'}
              </span>
            </div>
            <span className="interlock-serial">TERMINAL PROTOCOL #26-B</span>
          </div>

          <div className="interlock-action-row">
            <label className="retro-toggle-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="retro-toggle-input"
              />
              <span className="retro-toggle-switch">
                <span className="switch-pin" />
              </span>
              <span className="retro-consent-text">
                I hereby verify that our squad has fully examined and consented to all Xyntra 2026 hackathon guidelines, code of conduct, and evaluation criteria.
              </span>
            </label>

            <button
              type="button"
              className={`retro-proceed-btn ${agreed ? 'is-armed' : 'is-disabled'}`}
              disabled={!agreed}
              onClick={() => onNavigate(4)}
              aria-label="Proceed to Registration Desk"
            >
              <span className="btn-launch-glow" aria-hidden="true" />
              <span className="btn-label-text">PROCEED TO REGISTRATION DESK</span>
              <span className="btn-arrow-icon" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <Footer onNavigate={onNavigate} />

      </div>
    </section>
  )
}
