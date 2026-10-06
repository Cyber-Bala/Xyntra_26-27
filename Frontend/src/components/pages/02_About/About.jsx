import React from 'react'
import './About.css'

export default function About({ onNavigate }) {
  const problemStatements = [
    {
      id: 'PS 01',
      trackName: 'PROMETHEUS',
      domain: 'AI & Autonomous Intelligence',
      desc: 'Harness the power of artificial intelligence. Engineer autonomous multi-agent networks, neural synthesis, and cognitive decision systems to resolve high-stakes real-world challenges.',
      tags: ['LLMs', 'Multi-Agent', 'Computer Vision'],
    },
    {
      id: 'PS 02',
      trackName: 'HERMES',
      domain: 'Web3, Protocols & Decentralized Security',
      desc: 'Forge immutable bridges across decentralized ecosystems. Construct tamper-proof smart contracts, zero-knowledge verification frameworks, and next-generation cryptographic architectures.',
      tags: ['Zero-Knowledge', 'Smart Contracts', 'DeFi'],
    },
    {
      id: 'PS 03',
      trackName: 'ATHENA',
      domain: 'Open Innovation & Strategic Technologies',
      desc: 'Channel wisdom into real-world disruption. Architect scalable solutions in clean energy, intelligent healthcare, algorithmic fintech, and automated urban infrastructure.',
      tags: ['Fintech', 'CleanTech', 'HealthTech'],
    },
  ]

  const timelineEvents = [
    { num: '01', label: 'Registration Opens', date: 'OCT 01, 2026', desc: 'The Gates of the Arena Open' },
    { num: '02', label: 'Problem Statements Unveiled', date: 'OCT 15, 2026', desc: 'The Tracks & Problem Sets are Released' },
    { num: '03', label: 'Registration Closes', date: 'OCT 20, 2026', desc: 'Squads Assemble & Lock Registrations' },
    { num: '04', label: 'Hackathon Sprint (24 Hours)', date: 'OCT 24 – 25, 2026', desc: '24-Hour Non-Stop Prototype Development' },
    { num: '05', label: 'Grand Demo Day & Judgement', date: 'OCT 25, 2026', desc: 'Pitch Presentations & Award Ceremony' },
  ]

  const techStacks = [
    'React / Next.js',
    'Node.js / Express',
    'Python / FastAPI',
    'PyTorch & ML Engines',
    'Solidity & Web3 EVM',
    'PostgreSQL & Redis',
    'Cloud / Docker Architectures',
    'Tailwind & Micro-frontends',
  ]

  return (
    <section className="about-page-section" id="about">
      <div className="about-main-container">

        {/* TOP ORNAMENTAL BANNER */}
        <div className="about-ornament-header">
          <span className="ornament-line" />
          <span className="ornament-tag">XYNTRA · NATIONAL HACKATHON</span>
          <span className="ornament-line" />
        </div>

        {/* SECTION HEADING */}
        <div className="about-title-block">
          <p className="about-kicker">MISSION & CHALLENGE TRACKS</p>
          <h1 className="about-main-heading">ABOUT THE HACKATHON</h1>
          <p className="about-lead-text">
            Welcome to the proving ground of modern engineering. Xyntra brings together elite programmers,
            product designers, and AI architects for a 24-hour crucible of creation. Choose your track,
            collaborate with your team, and build prototypes that redefine industry benchmarks.
          </p>
        </div>

        {/* MAIN 2-COLUMN GRID (Problems + Timeline) */}
        <div className="about-two-col-grid">

          {/* LEFT: Problem Statements */}
          <div className="about-glass-card ps-card">
            <div className="card-header-bar">
              <div className="card-badge-box">
                <span className="card-sub-tag">COMPETITION DOMAINS</span>
                <h2 className="card-title">Problem Statements</h2>
              </div>
              <span className="card-header-icon">🚀</span>
            </div>

            <div className="ps-cards-list">
              {problemStatements.map((ps) => (
                <div key={ps.id} className="ps-item-card">
                  <div className="ps-item-top">
                    <span className="ps-id-badge">{ps.id}</span>
                    <span className="ps-track-title">{ps.trackName} TRACK</span>
                  </div>
                  <h3 className="ps-domain-title">{ps.domain}</h3>
                  <p className="ps-description">{ps.desc}</p>
                  <div className="ps-tags-row">
                    {ps.tags.map((t, idx) => (
                      <span key={idx} className="ps-mini-tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="about-pdf-download-btn"
              onClick={() => alert('Official Problem Statements document (PDF) will be unveiled on October 15, 2026!')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span>Download Problem Statements (PDF)</span>
            </button>
          </div>

          {/* RIGHT: Timeline */}
          <div className="about-glass-card timeline-card">
            <div className="card-header-bar">
              <div className="card-badge-box">
                <span className="card-sub-tag">SCHEDULE & MILESTONES</span>
                <h2 className="card-title">Event Timeline</h2>
              </div>
              <span className="card-header-icon">⏳</span>
            </div>

            <div className="timeline-flow-list">
              {timelineEvents.map((item, idx) => (
                <div key={idx} className="timeline-row-item">
                  <div className="timeline-node-col">
                    <span className="timeline-dot-circle">{item.num}</span>
                    {idx < timelineEvents.length - 1 && <span className="timeline-connect-line" />}
                  </div>
                  <div className="timeline-body">
                    <div className="timeline-milestone-header">
                      <h3 className="timeline-event-name">{item.label}</h3>
                      <span className="timeline-date-badge">{item.date}</span>
                    </div>
                    <p className="timeline-sub-flavor">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="deadline-highlight-pill">
              <span className="deadline-icon">⏰</span>
              <span>Registration Closes: <strong>October 20, 2026 (11:59 PM IST)</strong></span>
            </div>
          </div>

        </div>

        {/* BOTTOM FULL-WIDTH: Tech Matrix */}
        <div className="about-glass-card forge-card">
          <div className="card-header-bar">
            <div className="card-badge-box">
              <span className="card-sub-tag">TECHNOLOGY ECOSYSTEM</span>
              <h2 className="card-title">Track Overview & Recommended Stacks</h2>
            </div>
            <span className="card-header-icon">⚡</span>
          </div>
          <p className="forge-description-text">
            Teams have complete architectural freedom. Build with modern full-stack frameworks,
            microservices, smart contract pipelines, neural networks, or hardware interfaces tailored for rapid execution.
          </p>
          <div className="tech-chips-flex">
            {techStacks.map((tech, i) => (
              <div key={i} className="tech-chip-item">
                <span className="chip-spark">✦</span>
                <span className="chip-text">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROCEED ACTION */}
        <div className="about-bottom-cta-row">
          <button className="about-proceed-btn" onClick={() => onNavigate(3)}>
            <span>Check Arena Rules & Guidelines</span>
            <span className="proceed-arrow">→</span>
          </button>
        </div>

      </div>
    </section>
  )
}
