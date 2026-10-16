import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Rules.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Rules Dossier Data ─────────────────────────────────────── */
const RULES_DOSSIER = [
  {
    num: '01',
    title: 'Eligibility & ID Verification',
    summary: 'Open to all enrolled students, developers, and researchers worldwide.',
    detail:
      'Participants must possess a valid institutional, college, or organizational ID. Inter-college, inter-departmental, and interdisciplinary teams are strongly encouraged to collaborate.',
  },
  {
    num: '02',
    title: 'Registration & Team Formation',
    summary: 'Teams of 2 to 4 members. Solo entries are permitted upon review.',
    detail:
      'All team members must complete digital verification before the registration freeze date. One designated member will act as the Team Lead for official communication and judging queues.',
  },
  {
    num: '03',
    title: 'Code of Conduct & Fresh Build Protocol',
    summary: 'Respect. Fair play. 100% original code written during the 24 hours.',
    detail:
      'All solution code, architectural diagrams, and user interfaces must be authored during the active 24-hour hackathon window. Open-source libraries, APIs, and frameworks are permitted if declared beforehand. Zero tolerance for plagiarism or pre-built codebases.',
  },
  {
    num: '04',
    title: 'Submission Guidelines & Artifacts',
    summary: 'Deliverables must follow the designated digital format and timeline.',
    detail:
      'Final project submission requires a public GitHub repository link with clean commit history, a live working demonstration or APK/URL, a 3-minute video walkthrough pitch, and architectural slides.',
  },
  {
    num: '05',
    title: 'Evaluation & Judging Matrix',
    summary: 'Technical Execution (30%), Innovation (30%), UX (20%), Pitch (20%).',
    detail:
      'A distinguished panel of industry engineering leaders, faculty, and venture mentors will evaluate projects based on feasibility, creativity, depth of engineering, and clarity of communication.',
  },
  {
    num: '06',
    title: 'General Terms & Checkpoint Compliance',
    summary: 'Attendance is mandatory at both scheduled mentor checkpoints.',
    detail:
      'Teams must check in during the designated mentor review windows (07:00 PM and 11:00 PM). Organizers reserve the right to disqualify any entry violating ethical standards or academic integrity.',
  },
]

export default function Rules({ onNavigate }) {
  const sectionRef = useRef(null)
  const [agreed, setAgreed] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    const sect = sectionRef.current
    if (!sect) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rules-hero-block',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sect,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.rules-protocol-card',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.rules-protocol-grid',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.rules-interlock-console',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.rules-interlock-console',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sect)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="retro-rules-fullscreen-section" id="rules">
      {/* Main Expansive Content Container */}
      <div className="rules-fullwidth-wrapper">
        {/* ── HEADER BLOCK ─────────────────────────────────────────── */}
        <div className="rules-hero-block">
          <div className="rules-headline-column">
            <div className="section-flow-eyebrow">
              <span className="flow-num">05</span>
              <span className="flow-dash">—</span>
              <span className="flow-label">RULES &amp; CODE OF CONDUCT</span>
            </div>

            <h2 className="rules-main-title">
              CODE OF CONDUCT <br />
              <span className="rules-title-amber">&amp; REGULATIONS.</span>
            </h2>

            <p className="rules-lead-paragraph">
              Review the official hackathon blueprint. Integrity, passion, and original engineering
              are non-negotiable. Follow these protocols to ensure a smooth, competitive hackathon.
            </p>
          </div>

          {/* Retro Sticky Note */}
          <div className="rules-sticky-bay">
            <div className="rules-sticky-note" aria-hidden="true">
              <div className="rules-tape-strip" />
              <p className="rules-note-text">READ</p>
              <p className="rules-note-text">CAREFULLY.</p>
              <p className="rules-note-highlight">ZERO PLAGIARISM ✦</p>
              <span className="rules-note-sub">HONOR SYSTEM :)</span>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN EXPANSIVE RULES GRID (CLEAN, NO WIDGETS) ───── */}
        <div className="rules-dossier-console">
          <div className="dossier-console-header">
            <div className="console-header-left">
              <span className="dossier-stamp">CONFIDENTIAL // PROTOCOL</span>
              <span className="dossier-ref">DOC-REF: XYN-2627</span>
            </div>
            <div className="console-header-right">
              <span className="dossier-status-dot" />
              <span className="dossier-rule-count">6 CLAUSES // ALL TEAMS COMPLIANT</span>
            </div>
          </div>

          <div className="rules-protocol-grid">
            {RULES_DOSSIER.map((item, idx) => (
              <div
                key={item.num}
                className={`rules-protocol-card ${activeItem === idx ? 'card-expanded' : ''}`}
                onClick={() => setActiveItem(idx === activeItem ? null : idx)}
                role="button"
                tabIndex={0}
                aria-expanded={activeItem === idx}
                onKeyDown={(e) => e.key === 'Enter' && setActiveItem(idx === activeItem ? null : idx)}
              >
                <div className="protocol-head">
                  <div className="protocol-title-group">
                    <span className="protocol-num">({item.num})</span>
                    <h3 className="protocol-title">{item.title}</h3>
                  </div>
                  <span className="protocol-toggle-glyph">
                    {activeItem === idx ? '▲' : '▼'}
                  </span>
                </div>

                <p className="protocol-summary">{item.summary}</p>

                <div className="protocol-detail-bay">
                  <span className="detail-arrow">›</span>
                  <p className="detail-content">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── INDUSTRIAL MECHANICAL CONSENT INTERLOCK & PROCEED BAR ── */}
        <div className="rules-interlock-console">
          <div className="interlock-telemetry-strip">
            <span className="interlock-serial">// HARDWARE CONSENT GATEWAY</span>
            <span className={`interlock-indicator ${agreed ? 'ind-armed' : 'ind-locked'}`}>
              {agreed ? '● INTERLOCK ENGAGED: READY TO PROCEED' : '○ INTERLOCK DISENGAGED: LOCKED'}
            </span>
          </div>

          <div className="interlock-controls-row">
            <label className="mechanical-toggle-container">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mechanical-toggle-input"
              />
              <span className="mechanical-toggle-track">
                <span className="mechanical-switch-lever" />
              </span>
              <span className="mechanical-consent-label">
                I have read, understood, and agree to abide by all hackathon rules, fair play guidelines, and submission terms.
              </span>
            </label>

            <button
              type="button"
              className={`heavy-proceed-button ${agreed ? 'btn-armed' : 'btn-inert'}`}
              disabled={!agreed}
              onClick={() => onNavigate(4)}
              aria-label="Proceed to Registration Desk"
            >
              <span className="btn-label">PROCEED TO REGISTRATION</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
