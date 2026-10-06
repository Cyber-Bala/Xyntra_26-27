import { useState } from 'react'
import './Rules.css'
import Footer from '../../footer/Footer.jsx'
import Reveal from '../../animations/Reveal.jsx'

export default function Rules({ onNavigate }) {
  const [agreed, setAgreed] = useState(false)

  const rulesData = [
    {
      num: '01',
      title: 'Team Formation & Eligibility',
      badge: 'ELIGIBILITY',
      points: [
        'Teams must consist of 2 to 4 members with one designated team leader.',
        'All team members must hold valid college/university identification cards.',
        'Cross-college and interdisciplinary team formations are strictly welcomed.',
        'Individual registration changes cannot be made once the lock deadline passes.',
      ],
    },
    {
      num: '02',
      title: 'Code of Conduct & Integrity',
      badge: 'FAIR PLAY',
      points: [
        'All code and design prototypes must be authored during the 24-hour hackathon period.',
        'Open-source libraries, UI kits, and public APIs must be declared during checkpoints.',
        'Plagiarism or pre-built complete templates will result in immediate disqualification.',
        'Maintain respect and professional ethics across all physical and virtual arenas.',
      ],
    },
    {
      num: '03',
      title: 'Submissions & Evaluation Criteria',
      badge: 'JUDGING',
      points: [
        'Submissions require a public GitHub repository, working demo, and 2-min pitch video.',
        'Evaluation Weights: Innovation (30%), Technical Execution (30%), UI/UX (20%), Pitch (20%).',
        'Industry mentors will conduct 2 mandatory checkpoint evaluations during the sprint.',
        'The decision of the grand jury panel is final and non-negotiable.',
      ],
    },
  ]

  return (
    <section className="rules-page-section" id="rules">
      <div className="rules-main-container">

        {/* HEADER BLOCK */}
        <div className="rules-header-block">
          <div className="rules-kicker-tag">
            <span className="kicker-dot" />
            <span>TERMS OF ENGAGEMENT</span>
          </div>
          <h1 className="rules-main-title">RULES & GUIDELINES</h1>
          <p className="rules-lead-desc">
            To ensure absolute fairness, transparency, and spirited competition, every warrior entering
            the Xyntra Arena must adhere to the following code of conduct and submission criteria.
          </p>
        </div>

        {/* 3-COLUMN RULES GRID */}
        <Reveal className="rules-cards-grid" stagger>
          {rulesData.map((rule) => (
            <div key={rule.num} className="rule-glass-card">
              <div className="rule-card-top">
                <span className="rule-num-tag">{rule.num}</span>
                <span className="rule-badge-pill">{rule.badge}</span>
              </div>

              <h2 className="rule-card-title">{rule.title}</h2>

              <ul className="rule-points-list">
                {rule.points.map((pt, i) => (
                  <li key={i} className="rule-point-item">
                    <span className="point-bullet">✦</span>
                    <span className="point-text">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        {/* CONSENT & PROCEED BAR */}
        <div className="rules-cta-bar">
          <label className="consent-checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="consent-input"
            />
            <span className="custom-checkmark" />
            <span className="consent-text">
              I have read, understood, and solemnly agree to all Xyntra 2026 hackathon guidelines and evaluation terms.
            </span>
          </label>

          <button
            className={`rules-proceed-btn glow-hover ${agreed ? 'active' : 'disabled'}`}
            disabled={!agreed}
            onClick={() => onNavigate(4)}
          >
            <span>Proceed to Registration Desk</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <Footer onNavigate={onNavigate} />

      </div>
    </section>
  )
}
