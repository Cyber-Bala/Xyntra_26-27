import React from 'react'
import './About.css'

export default function About() {
  const problemStatements = [
    {
      id: 'PS I',
      greekName: 'PROMETHEUS',
      domain: 'AI & Autonomous Intelligence',
      desc: 'Harness the divine spark of artificial intelligence. Engineer autonomous multi-agent networks, neural synthesis, and cognitive decision systems to resolve high-stakes human challenges.',
    },
    {
      id: 'PS II',
      greekName: 'HERMES',
      domain: 'Web3, Decentralized Protocols & Security',
      desc: 'Forge immutable bridges across decentralized realms. Construct tamper-proof smart contracts, zero-knowledge verification frameworks, and next-generation cryptographic architectures.',
    },
    {
      id: 'PS III',
      greekName: 'ATHENA',
      domain: 'Open Innovation & Strategic Technologies',
      desc: 'Channel wisdom into real-world disruption. Architect scalable solutions in clean energy, intelligent healthcare, algorithmic fintech, and automated urban infrastructure.',
    },
  ]

  const timelineEvents = [
    { num: 'I', label: 'Registration Opens', date: 'OCT 01, 2026', desc: 'The Gates of the Arena Open' },
    { num: 'II', label: 'Problem Statements Unveiled', date: 'OCT 15, 2026', desc: 'The Trials are Revealed' },
    { num: 'III', label: 'Registration Closes', date: 'OCT 20, 2026', desc: 'Warriors Assemble & Lock Teams' },
    { num: 'IV', label: 'Hackathon Sprint (24 Hours)', date: 'OCT 24 – 25, 2026', desc: 'The Forge Ignites' },
    { num: 'V', label: 'Grand Demo Day & Judgement', date: 'OCT 25, 2026', desc: 'Crowning the Champions' },
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
    <div className="greek-about-page">
      {/* Decorative Greek Meander Header Banner */}
      <div className="greek-frieze-divider">
        <span className="frieze-line" />
        <span className="frieze-symbol">🏛️</span>
        <span className="frieze-ornament">XYNTRA · HOUSE OF GREEKS</span>
        <span className="frieze-symbol">🏛️</span>
        <span className="frieze-line" />
      </div>

      {/* Main Classical Heading */}
      <div className="greek-heading-wrapper">
        <p className="greek-kicker">THE CHRONICLES OF XYNTRA</p>
        <h1 className="greek-main-title">ABOUT THE HACKATHON</h1>
        <div className="greek-gold-separator">
          <span className="sep-line" />
          <span className="sep-diamond">◆</span>
          <span className="sep-diamond large">✦</span>
          <span className="sep-diamond">◆</span>
          <span className="sep-line" />
        </div>
        <p className="greek-lead-description">
          Welcome to the sacred battleground of innovation. Inspired by the relentless ingenuity of ancient Hellenic builders, 
          Xyntra unites elite coders, architects, and visionaries for a 24-hour crucible of creation. Choose your challenge, 
          ignite the forge, and carve your legacy into the digital pantheon.
        </p>
      </div>

      {/* Main 2-Column Hellenic Grid */}
      <div className="greek-main-grid">
        
        {/* LEFT COLUMN: Problem Statements */}
        <div className="greek-card ps-greek-card">
          <div className="greek-card-topbar">
            <div className="greek-badge-title">
              <span className="greek-sub-tag">SACRED TRIALS</span>
              <h2 className="greek-card-title">Problem Statements</h2>
            </div>
            <span className="greek-pillar-icon">🏺</span>
          </div>

          <div className="ps-greek-list">
            {problemStatements.map((ps) => (
              <div key={ps.id} className="ps-greek-item">
                <div className="ps-item-header">
                  <div className="ps-seal-coin">
                    <span className="ps-coin-text">{ps.id}</span>
                  </div>
                  <div className="ps-title-group">
                    <span className="ps-greek-epithet">{ps.greekName} TRACK</span>
                    <h3 className="ps-domain-heading">{ps.domain}</h3>
                  </div>
                </div>
                <p className="ps-domain-body">{ps.desc}</p>
              </div>
            ))}
          </div>

          <a
            href="#download-pdf"
            className="greek-parchment-btn"
            onClick={(e) => {
              e.preventDefault()
              alert('The Sacred Problem Statements Scroll (PDF) will be unveiled on October 15, 2026!')
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <span>[Download Sacred Trials PDF]</span>
          </a>
        </div>

        {/* RIGHT COLUMN: Timeline */}
        <div className="greek-card timeline-greek-card">
          <div className="greek-card-topbar">
            <div className="greek-badge-title">
              <span className="greek-sub-tag">CHRONOS PROTOCOL</span>
              <h2 className="greek-card-title">Event Timeline</h2>
            </div>
            <span className="greek-pillar-icon">⏳</span>
          </div>

          <div className="timeline-greek-flow">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="timeline-greek-row">
                <div className="timeline-greek-node">
                  <span className="greek-torch-node">
                    <span className="greek-roman-num">{item.num}</span>
                  </span>
                  {idx < timelineEvents.length - 1 && <span className="greek-pillar-line" />}
                </div>
                <div className="timeline-greek-text">
                  <div className="timeline-heading-row">
                    <h3 className="timeline-milestone-title">{item.label}</h3>
                    <span className="timeline-gold-date">{item.date}</span>
                  </div>
                  <p className="timeline-flavor-text">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM FULL-WIDTH: The Olympian Forge / Tech Matrix */}
      <div className="greek-card forge-greek-card">
        <div className="greek-card-topbar">
          <div className="greek-badge-title">
            <span className="greek-sub-tag">HEPHAESTUS MATRIX</span>
            <h2 className="greek-card-title">Track Overview & Technology Stacks Summary</h2>
          </div>
          <span className="greek-pillar-icon">⚡</span>
        </div>
        <p className="forge-desc">
          Builders are endowed with total freedom over their chosen arsenal. Create with modern full-stack architectures, 
          high-concurrency servers, smart contract pipelines, neural networks, or hardware interfaces tailored for rapid execution.
        </p>
        <div className="greek-chips-grid">
          {techStacks.map((tech, i) => (
            <div key={i} className="greek-chip">
              <span className="chip-laurel">❖</span>
              <span className="chip-name">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
