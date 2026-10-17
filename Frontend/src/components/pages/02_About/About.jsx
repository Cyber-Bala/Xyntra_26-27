import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './About.css'
import Timeline from '../05_Timeline/Timeline.jsx'
import Reveal from '../../animations/Reveal.jsx'

// Adjust these two paths to wherever you saved the files
import PixelHeading from './PixelHeading.jsx'
import ScrambledText from './ScrambledText'

const problemStatements = [
  {
    number: '01',
    title: 'AI & AUTONOMOUS INTELLIGENCE',
    description:
      'Engineer autonomous multi-agent networks, neural synthesis, and cognitive decision systems to solve high-stakes real-world challenges.',
    details:
      'Build intelligent systems capable of reasoning, adapting and acting autonomously. Explore agentic AI, neural systems, computer vision and next-generation decision engines.',
    tags: ['LLMs', 'MULTI-AGENT', 'COMPUTER VISION'],
    focus: 'AI / ML / AGENTS',
  },
  {
    number: '02',
    title: 'WEB3 · PROTOCOLS · SECURITY',
    description:
      'Construct tamper-proof smart contracts, zero-knowledge verification frameworks, and next-generation cryptographic architectures.',
    details:
      'Design secure decentralized systems using smart contracts, cryptographic verification, zero-knowledge technologies and trustless protocols.',
    tags: ['ZERO-KNOWLEDGE', 'SMART CONTRACTS', 'DEFI'],
    focus: 'WEB3 / SECURITY / CRYPTO',
  },
  {
    number: '03',
    title: 'OPEN INNOVATION · STRATEGIC TECH',
    description:
      'Architect scalable solutions across clean energy, intelligent healthcare, algorithmic fintech, and automated infrastructure.',
    details:
      'Solve real-world problems using technology across finance, healthcare, sustainability and infrastructure.',
    tags: ['FINTECH', 'CLEANTECH', 'HEALTHTECH'],
    focus: 'INNOVATION / IMPACT',
  },
  {
    number: '04',
    title: 'ROBOTICS · AUTOMATION',
    description:
      'Design intelligent machines, autonomous systems, and next-generation automation that transform the physical world.',
    details:
      'Create systems that connect software with the physical world through robotics, sensors, IoT platforms and intelligent automation.',
    tags: ['ROBOTICS', 'IOT', 'AUTOMATION'],
    focus: 'ROBOTICS / IOT / HARDWARE',
  },
  {
    number: '05',
    title: 'DATA · INTELLIGENCE · ANALYTICS',
    description:
      'Turn complex data into powerful decisions through predictive systems, intelligent analytics, and real-time insights.',
    details:
      'Transform raw information into actionable intelligence using machine learning, predictive analytics, visualization and real-time data systems.',
    tags: ['DATA SCIENCE', 'ML', 'ANALYTICS'],
    focus: 'DATA / ML / ANALYTICS',
  },
  {
    number: '06',
    title: 'FUTURE · HUMAN · TECHNOLOGY',
    description:
      'Create bold technology experiences across accessibility, education, sustainability, and human-centered innovation.',
    details:
      'Build technology around people. Explore accessibility, education, sustainability and experiences that make emerging technology useful and meaningful.',
    tags: ['EDTECH', 'SUSTAINABILITY', 'UX'],
    focus: 'HUMAN / FUTURE / UX',
  },
]

export default function About() {
  const [selectedDomain, setSelectedDomain] = useState(null)

  useEffect(() => {
    if (!selectedDomain) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedDomain(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedDomain])

  return (
    <section className="about-v6" id="about">
      {/* BACKGROUND */}
      <div className="v6-grid-bg" />

      <div className="v6-particle-field">
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

      <div className="v6-glow v6-glow-one" />
      <div className="v6-glow v6-glow-two" />

      <div className="about-v6-container">
        {/* HERO */}
        <Reveal className="about-hero-reveal">
          <section className="v6-hero">
            <div className="v6-hero-left">
              <div className="v6-hero-label">
                <span>01</span>
                <span>MISSION / 2026</span>
              </div>

              <PixelHeading level={1} size="xl" accentLine={2}>
                {"BUILD\nWHAT'S\nNEXT."}
              </PixelHeading>

              <div className="v6-hero-keywords">
                <span>THINK</span>
                <i>✦</i>
                <span>BUILD</span>
                <i>✦</i>
                <span>DISRUPT</span>
              </div>
            </div>

            <div className="v6-hero-right">
              <div className="v6-hero-stats">
                <div className="v6-hero-stat">
                  <span>01</span>
                  <strong>24</strong>
                  <small>HOURS</small>
                </div>

                <div className="v6-hero-stat">
                  <span>02</span>
                  <strong>06</strong>
                  <small>DOMAINS</small>
                </div>

                <div className="v6-hero-stat">
                  <span>03</span>
                  <strong>01</strong>
                  <small>ARENA</small>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* DOMAINS */}
        <Reveal className="about-domains-reveal">
          <section className="v6-problems" id="problem-statements">
          <div className="v6-section-head">
            <div className="v6-section-number">02</div>

            <div>
              <span className="v6-eyebrow">BUILD WHAT'S NEXT / CHALLENGE TRACKS</span>

              <PixelHeading level={2} size="lg" accentLine={1}>
                {'CHOOSE\nYOUR DOMAINS.'}
              </PixelHeading>
            </div>

            <p>Build what’s next. Explore six domains and turn bold ideas into working prototypes.</p>
          </div>

          <div className="domains-float-field">
            {problemStatements.map((item, index) => (
              <article
                key={item.number}
                className={`domain-card domain-card-${index + 1}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedDomain(item)
                  }
                }}
                onClick={() => setSelectedDomain(item)}
              >
                <div className="domain-card-shine" />

                <div className="domain-card-top">
                  <span className="domain-number">{item.number}</span>
                  <span className="domain-status">ACTIVE</span>
                </div>

                <div className="domain-card-content">

                  <h3>{item.title}</h3>

                  <ScrambledText
                    className="xy-scr xy-scr--desc"
                    radius={80}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"
                    clickBurst
                  >
                    {item.description}
                  </ScrambledText>
                </div>

                <div className="domain-card-bottom">
                  <div className="domain-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>
                        <ScrambledText
                          className="xy-scr xy-scr--inline"
                          radius={50}
                          duration={0.7}
                          speed={0.5}
                          scrambleChars=".:"
                        >
                          {tag}
                        </ScrambledText>
                      </span>
                    ))}
                  </div>

                  <div className="domain-arrow">↗</div>
                </div>

                <div className="domain-corner domain-corner-one" />
                <div className="domain-corner domain-corner-two" />
              </article>
            ))}
          </div>

          {/* DOMAIN MODAL */}
          {selectedDomain &&
            createPortal(
              <div
                className="domain-modal"
                role="dialog"
                aria-modal="true"
                aria-label={selectedDomain.title}
              >
                <div className="domain-modal-backdrop" onClick={() => setSelectedDomain(null)} />

                <div className="domain-modal-card">
                  <button
                    className="domain-modal-close"
                    type="button"
                    onClick={() => setSelectedDomain(null)}
                    aria-label="Close"
                  >
                    <span />
                    <span />
                  </button>

                  <div className="domain-modal-visual">
                    <div className="modal-grid" />
                    <div className="modal-orbit modal-orbit-one" />
                    <div className="modal-orbit modal-orbit-two" />

                    <div className="modal-number">{selectedDomain.number}</div>

                    <div className="modal-core">
                      <span>XYNTRA</span>
                      <strong>{selectedDomain.number}</strong>
                      <small>DOMAIN</small>
                    </div>

                    <div className="modal-visual-label">
                      <span>ACTIVE DOMAIN</span>
                      <span>2026—27</span>
                    </div>
                  </div>

                  <div className="domain-modal-info">

                    <h2>{selectedDomain.title}</h2>

                    <div className="modal-divider" />

                    <div className="modal-description">
                      <span>DOMAIN INTELLIGENCE</span>

                      <ScrambledText
                        className="xy-scr"
                        radius={90}
                        duration={1.2}
                        speed={0.5}
                        scrambleChars=".:"
                        clickBurst
                        intro
                      >
                        {selectedDomain.details}
                      </ScrambledText>
                    </div>

                    <div className="modal-focus">
                      <span>PRIMARY FOCUS</span>
                      <strong>{selectedDomain.focus}</strong>
                    </div>

                    <div className="modal-tech">
                      <span>TECHNOLOGY AREAS</span>

                      <div>
                        {selectedDomain.tags.map((tag) => (
                          <span key={tag}>
                            <ScrambledText
                              className="xy-scr xy-scr--inline"
                              radius={50}
                              duration={0.7}
                              speed={0.5}
                              scrambleChars=".:"
                              intro
                            >
                              {tag}
                            </ScrambledText>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <span>XYNTRA / DOMAIN {selectedDomain.number}</span>
                      <span>BUILD BEYOND.</span>
                    </div>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </section>
        </Reveal>
      </div>

      {/* TIMELINE — FULL SCREEN */}
      <Reveal className="about-timeline-reveal">
        <Timeline />
      </Reveal>
    </section>
  )
}