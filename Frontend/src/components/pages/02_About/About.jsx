import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './About.css'



function ClockHands() {
  const [clockTime, setClockTime] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setClockTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const seconds = clockTime.getSeconds()
  const minutes = clockTime.getMinutes()
  const hours = clockTime.getHours()

  const secondAngle = seconds * 6
  const minuteAngle = minutes * 6 + seconds * 0.1
  const hourAngle = (hours % 12) * 30 + minutes * 0.5

  return (
    <>
      <div
        className="v6-clock-hand v6-clock-hour"
        style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
        aria-hidden="true"
      />
      <div
        className="v6-clock-hand v6-clock-minute"
        style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
        aria-hidden="true"
      />
      <div
        className="v6-clock-hand v6-clock-second"
        style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
        aria-hidden="true"
      />
    </>
  )
}

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

  const problemStatements = [

    {

      number: '01',

      track: 'PROMETHEUS',

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

      track: 'HERMES',

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

      track: 'ATHENA',

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

      track: 'HEPHAESTUS',

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

      track: 'APOLLO',

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

      track: 'ARTEMIS',

      title: 'FUTURE · HUMAN · TECHNOLOGY',

      description:

        'Create bold technology experiences across accessibility, education, sustainability, and human-centered innovation.',

      details:

        'Build technology around people. Explore accessibility, education, sustainability and experiences that make emerging technology useful and meaningful.',

      tags: ['EDTECH', 'SUSTAINABILITY', 'UX'],

      focus: 'HUMAN / FUTURE / UX',

    },

  ]



  const timeline = [

    {

      number: '01',

      date: 'OCT 01',

      title: 'REGISTRATION OPENS',

      description: 'The gates of the arena open.',

    },

    {

      number: '02',

      date: 'OCT 15',

      title: 'PROBLEM STATEMENTS',

      description: 'Tracks and problem sets unveiled.',

    },

    {

      number: '03',

      date: 'OCT 20',

      title: 'REGISTRATION CLOSES',

      description: 'Squads assemble and lock in.',

    },

    {

      number: '04',

      date: 'OCT 24–25',

      title: '24H HACKATHON',

      description: 'Non-stop prototype development.',

    },

    {

      number: '05',

      date: 'OCT 25',

      title: 'GRAND DEMO DAY',

      description: 'Pitches, judgement & awards.',

    },

  ]



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



        {/* =====================================================

            TOP BAR

            ===================================================== */}



        <header className="v6-topbar">



          <div className="v6-brand">

            <span className="v6-brand-dot" />

            <strong>XYNTRA</strong>

            <span>26—27</span>

          </div>



          <div className="v6-top-center">

            NATIONAL HACKATHON

          </div>



          <div className="v6-top-right">

            <span>ABOUT</span>

            <span>01 / 05</span>

          </div>



        </header>





        {/* =====================================================

            HERO

            ===================================================== */}



        <section className="v6-hero">



          <div className="v6-hero-left">



            <div className="v6-hero-label">

              <span>01</span>

              <span>MISSION / 2026</span>

            </div>



            <h1 className="v6-hero-title">

              <span>BUILD</span>

              <span className="v6-outline">WHAT'S</span>

              <span>NEXT.</span>

            </h1>



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





        {/* =====================================================

            ORBIT + MISSION

            ===================================================== */}



        <section className="v6-stat-strip">



          <div className="v6-bottom-orbit">



            <div className="v6-orb-wrapper">



              <div className="v6-orb">

                
<div className="v6-clock-numbers" aria-hidden="true">
  {Array.from({ length: 12 }, (_, i) => {
    const number = i === 0 ? 12 : i;
    return (
      <span
        key={number}
        className={`v6-clock-num v6-clock-num-${number}`}
      >
        {number}
      </span>
    );
  })}
</div>

<div className="v6-clock-tick v6-clock-tick-12" />
<div className="v6-clock-tick v6-clock-tick-3" />
<div className="v6-clock-tick v6-clock-tick-6" />
<div className="v6-clock-tick v6-clock-tick-9" />


                <div className="v6-orb-ring v6-ring-one" />

                <div className="v6-orb-ring v6-ring-two" />

                <div className="v6-orb-ring v6-ring-three" />



                <div className="v6-orb-dot v6-dot-one" />

                <div className="v6-orb-dot v6-dot-two" />

                <ClockHands />
                <div className="v6-clock-pin" aria-hidden="true" />

                <div className="v6-orb-core">



                  <strong className="v6-orb-number">

                    24

                  </strong>



                  <span className="v6-orb-normal">

                    HOURS

                  </span>



                  <span className="v6-orb-hover">

                    ENTER

                    <br />

                    THE ARENA

                  </span>



                </div>



              </div>



              <div className="v6-orb-caption">

                <span>24H / NON-STOP</span>

                <small>MOVE CURSOR TO EXPLORE</small>

              </div>



            </div>



          </div>





          <div className="v6-stat-message">



            <span>THE MISSION</span>



            <p>

              BUILD SOMETHING

              <br />

              WORTH REMEMBERING.

            </p>



          </div>



        </section>





        {/* =====================================================

            DOMAINS

            ===================================================== */}



        <section className="v6-problems" id="problem-statements">



          <div className="v6-section-head">



            <div className="v6-section-number">

              02

            </div>



            <div>



              <span className="v6-eyebrow">

                CHALLENGE TRACKS

              </span>



              <h2>

                CHOOSE

                <br />

                <em>YOUR WORLD.</em>

              </h2>



            </div>



            <p>

              Six problem spaces designed to push

              technical creativity beyond the obvious.

            </p>



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



                  <span className="domain-number">

                    {item.number}

                  </span>



                  <span className="domain-status">

                    ACTIVE

                  </span>



                </div>





                <div className="domain-card-content">



                  <span className="domain-track">

                    {item.track}

                  </span>



                  <h3>

                    {item.title}

                  </h3>



                  <p>

                    {item.description}

                  </p>



                </div>





                <div className="domain-card-bottom">



                  <div className="domain-tags">



                    {item.tags.map((tag) => (

                      <span key={tag}>

                        {tag}

                      </span>

                    ))}



                  </div>



                  <div className="domain-arrow">

                    ↗

                  </div>



                </div>





                <div className="domain-corner domain-corner-one" />

                <div className="domain-corner domain-corner-two" />



              </article>



            ))}



          </div>





          {/* =================================================

              DOMAIN MODAL

              ================================================= */}



            {selectedDomain && createPortal(
              <div
                className="domain-modal"
                role="dialog"
                aria-modal="true"
                aria-label={selectedDomain.title}
              >



                <div

                  className="domain-modal-backdrop"

                  onClick={() => setSelectedDomain(null)}

                />





                <div

                  className="domain-modal-card"

                >



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



                    <div className="modal-number">

                      {selectedDomain.number}

                    </div>



                    <div className="modal-core">



                      <span>XYNTRA</span>



                      <strong>

                        {selectedDomain.number}

                      </strong>



                      <small>

                        DOMAIN

                      </small>



                    </div>



                    <div className="modal-visual-label">

                      <span>ACTIVE DOMAIN</span>

                      <span>2026—27</span>

                    </div>



                  </div>





                  <div className="domain-modal-info">



                    <span className="domain-modal-track">

                      {selectedDomain.track}

                    </span>





                    <h2>

                      {selectedDomain.title}

                    </h2>





                    <div className="modal-divider" />





                    <div className="modal-description">



                      <span>

                        DOMAIN INTELLIGENCE

                      </span>



                      <p>

                        {selectedDomain.details}

                      </p>



                    </div>





                    <div className="modal-focus">



                      <span>

                        PRIMARY FOCUS

                      </span>



                      <strong>

                        {selectedDomain.focus}

                      </strong>



                    </div>





                    <div className="modal-tech">



                      <span>

                        TECHNOLOGY AREAS

                      </span>



                      <div>



                        {selectedDomain.tags.map((tag) => (

                          <span key={tag}>

                            {tag}

                          </span>

                        ))}



                      </div>



                    </div>





                    <div className="modal-footer">



                      <span>

                        XYNTRA / DOMAIN {selectedDomain.number}

                      </span>



                      <span>

                        BUILD BEYOND.

                      </span>



                    </div>



                  </div>



                </div>

              </div>,
              document.body,
            )}



        </section>





        {/* =====================================================

            TIMELINE

            ===================================================== */}



        <section className="v6-timeline">



          <div className="v6-section-head">



            <div className="v6-section-number">

              03

            </div>



            <div>



              <span className="v6-eyebrow">

                THE JOURNEY

              </span>



              <h2>

                MARK

                <br />

                <em>THE DATES.</em>

              </h2>



            </div>



            <div className="v6-deadline">



              <span>

                REGISTRATION CLOSES

              </span>



              <strong>

                20 OCT 2026

              </strong>



              <small>

                11:59 PM IST

              </small>



            </div>



          </div>





          <div className="v6-timeline-wrapper">



            <div className="v6-timeline-axis" />



            <div className="v6-timeline-items">



              {timeline.map((item, index) => (



                <div

                  className={`v6-timeline-item ${

                    index === 3

                      ? 'v6-timeline-highlight'

                      : ''

                  }`}

                  key={item.number}

                >



                  <div className="v6-timeline-number">

                    {item.number}

                  </div>



                  <div className="v6-timeline-node">

                    <span />

                  </div>



                  <span className="v6-timeline-date">

                    {item.date}

                  </span>



                  <h3>

                    {item.title}

                  </h3>



                  <p>

                    {item.description}

                  </p>



                </div>



              ))}



            </div>



          </div>



        </section>

      </div>



    </section>

  )

}
