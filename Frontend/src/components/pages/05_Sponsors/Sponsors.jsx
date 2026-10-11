import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Sponsors.css'
import RetroTechDeskIllustration from '../../background/RetroTechDeskIllustration.jsx'
import ieeeCsLogo from '../../../assets/logos/ieee_cs_logo.png'
import recLogo from '../../../assets/logos/rec_logo.png'

gsap.registerPlugin(ScrollTrigger)

export default function Sponsors() {
  const sectionRef = useRef(null)
  const [bountyCounter, setBountyCounter] = useState(0)

  // Staggered podium ordering: 2nd place (left), 1st place (center champion), 3rd place (right)
  const podiumPrizes = [
    {
      place: 2,
      code: '02. RUNNER UP',
      badgeClass: 'theme-cyan',
      rank: '2nd Place',
      amount: '₹30,000',
      tagline: 'DIRECT CASH BOUNTY',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="9" r="6" />
          <path d="M8.2 14.5L6 22l6-3 6 3-2.2-7.5" />
          <path d="M10 9l2 2 4-4" />
        </svg>
      ),
      perks: [
        'Silver Trophy & Badges',
        'Fast-Track Incubation Support',
        'Developer Goodies & Cloud Credits',
      ],
    },
    {
      place: 1,
      code: '01. APEX CHAMPION',
      badgeClass: 'theme-gold',
      rank: '1st Place',
      amount: '₹50,000',
      tagline: 'DIRECT CASH BOUNTY',
      isChampion: true,
      iconSvg: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M18 9h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3" />
          <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
          <path d="M9 16v3m6-3v3m-8 3h10" />
        </svg>
      ),
      perks: [
        'Grand Trophy & Gold Badges',
        'Direct Industry Mentorship & Interviews',
        'Exclusive Swag & Cloud Credits',
      ],
    },
    {
      place: 3,
      code: '03. 2ND RUNNER UP',
      badgeClass: 'theme-coral',
      rank: '3rd Place',
      amount: '₹20,000',
      tagline: 'DIRECT CASH BOUNTY',
      iconSvg: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      perks: [
        'Bronze Trophy & Badges',
        'Startup Accelerator Vouchers',
        'Developer Swag Kit & Goodies',
      ],
    },
  ]

  const titleSponsors = [
    {
      name: 'IEEE Computer Society',
      role: 'Title Sponsor & Technical Community Partner',
      dept: 'Madras Chapter',
      logo: ieeeCsLogo,
      badge: 'TECHNICAL PATRON',
    },
    {
      name: 'Rajalakshmi Engineering College',
      role: 'Host Institution & Campus Partner',
      dept: 'Dept. of CSE & IT',
      logo: recLogo,
      badge: 'HOST ACADEMY',
    },
  ]

  const ecosystemPartners = [
    { name: 'CloudScale Global', tier: 'Gold Cloud Partner', icon: '☁' },
    { name: 'DevMatrix Labs', tier: 'Gold Systems Partner', icon: '⚡' },
    { name: 'NeuralForge AI', tier: 'AI Track Partner', icon: '🧠' },
    { name: 'BlockBridge Protocol', tier: 'Web3 Infrastructure', icon: '⛓' },
    { name: 'CyberQuest Org', tier: 'Official Media Partner', icon: '📡' },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const isDesktop = window.innerWidth >= 768

    const ctx = gsap.context(() => {
      // 1. DIGITAL ODOMETER: Rolls up from 0 to 1,00,000+
      const countObj = { val: 0 }
      ScrollTrigger.create({
        trigger: '.retro-window-banner',
        start: 'top 92%',
        onEnter: () => {
          gsap.to(countObj, {
            val: 100000,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => {
              setBountyCounter(Math.floor(countObj.val))
            },
          })
        },
        once: true,
      })

      // 2. ENTRANCE REVEAL FOR TOP HERO BLOCK
      gsap.fromTo(
        '.retro-gadget-hero-left',
        { autoAlpha: 0, x: -24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.retro-tech-desk-scene',
        { autoAlpha: 0, x: 24, scale: 0.98 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // 3. ENTRANCE FOR WINDOW CARDS
      gsap.fromTo(
        '.retro-window-card',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.retro-podium-windows-grid',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // 4. PARALLAX FLOAT ON DESKTOP
      if (isDesktop) {
        gsap.to('.retro-tech-desk-scene', {
          y: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })

        gsap.to('.card-champion-elevated', {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: '.retro-podium-windows-grid',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="retro-gadget-page-section" id="sponsors">
      <div className="retro-gadget-framed-canvas">

        {/* ================= 1. RETRO TOP HERO REGION (MATCHING REFERENCE) ================= */}
        <div className="retro-gadget-hero-layout">
          {/* LEFT: Chunky Pixel Headline & Kicker */}
          <div className="retro-gadget-hero-left">
            <div className="retro-code-kicker">
              <span>// NATIONAL LEVEL HACKATHON _</span>
            </div>

            <h1 className="retro-pixel-headline">
              PRIZE POOL &amp;<br />PARTNERS.
            </h1>

            <div className="retro-tagline-trio">
              <span className="trio-word">THINK</span>
              <span className="trio-sep">&gt;</span>
              <span className="trio-word">BUILD</span>
              <span className="trio-sep">&gt;</span>
              <span className="trio-word">DISRUPT</span>
            </div>

            <p className="retro-lead-editorial">
              Top prototypes receive direct cash grants, incubation backing, and high-impact industry mentorship
              across our global technical partner network.
            </p>
          </div>

          {/* RIGHT: Authentic Retro Tech Gadgets Illustration */}
          <div className="retro-gadget-hero-right">
            <RetroTechDeskIllustration />
          </div>
        </div>

        {/* ================= 2. TOTAL REWARDS RETRO WINDOW BANNER ================= */}
        <div className="retro-window-banner">
          <div className="retro-window-header-bar theme-gold">
            <div className="win-bar-left">
              <span className="win-dot" />
              <span className="win-title-tag">01. TOTAL REWARDS POOL</span>
            </div>
            <div className="win-bar-meta">ALL REALMS COMBINED · DIRECT CASH GRANTS</div>
            <div className="retro-window-controls" aria-hidden="true">
              <span className="win-btn win-min">_</span>
              <span className="win-btn win-max">□</span>
              <span className="win-btn win-close">✕</span>
            </div>
          </div>

          <div className="retro-window-banner-body">
            <div className="banner-body-left">
              <div className="telemetry-pill">
                <span className="telemetry-live-dot" />
                <span className="telemetry-pill-text">TELEMETRY: ACTIVE</span>
              </div>
              <span className="banner-sub-caption">OFFICIAL CASH REWARDS POOL FOR WINNING PROTOTYPES</span>
            </div>

            <div className="banner-body-center">
              <div className="retro-crt-odometer-box">
                <span className="odometer-currency">INR</span>
                <span className="odometer-number">
                  ₹{bountyCounter.toLocaleString('en-IN')}{bountyCounter >= 100000 ? '+' : ''}
                </span>
              </div>
            </div>

            <div className="banner-body-right">
              <span className="channel-badge">CH-24 // SEC_REWARDS</span>
            </div>
          </div>
        </div>

        {/* ================= 3. PODIUM CARDS (WINDOWS WITH WINDOW HEADER BARS) ================= */}
        <div className="retro-podium-section-wrap">
          <div className="retro-section-tag-strip">
            <span className="tag-bracket">[</span>
            <span className="tag-text">02. CHOOSE YOUR REWARD TIER</span>
            <span className="tag-bracket">]</span>
            <span className="tag-subtext">THREE PODIUM TIERS · UNRESTRICTED BOUNTIES</span>
          </div>

          <div className="retro-podium-windows-grid">
            {podiumPrizes.map((p) => (
              <div
                key={p.place}
                className={`retro-window-card ${p.badgeClass} ${p.isChampion ? 'card-champion-elevated' : ''}`}
              >
                {/* Window Header Bar with [ _ | □ | ✕ ] */}
                <div className={`retro-window-header-bar ${p.badgeClass}`}>
                  <div className="win-bar-left">
                    <span className="win-dot" />
                    <span className="win-title-tag">{p.code}</span>
                  </div>
                  <div className="retro-window-controls" aria-hidden="true">
                    <span className="win-btn win-min">_</span>
                    <span className="win-btn win-max">□</span>
                    <span className="win-btn win-close">✕</span>
                  </div>
                </div>

                {/* Window Card Body */}
                <div className="retro-window-card-body">
                  <div className="card-top-identity">
                    <div className="card-icon-frame">
                      {p.iconSvg}
                    </div>
                    <div className="card-identity-text">
                      <h2 className="card-rank-title">{p.rank}</h2>
                      <span className="card-tagline-sub">{p.tagline}</span>
                    </div>
                  </div>

                  <div className="card-amount-gauge">
                    <span className="card-amount-digits">{p.amount}</span>
                  </div>

                  <ul className="card-perks-bullets-list">
                    {p.perks.map((perk, i) => (
                      <li key={i} className="card-perk-line">
                        <span className="perk-arrow-symbol">&gt;</span>
                        <span className="perk-text-content">{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="card-action-bar">
                    <span className="card-action-code">TIER_SPEC #0{p.place}</span>
                    <button type="button" className="card-action-btn" aria-label={`View ${p.rank} Details`}>
                      <span>&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. SPONSORS WINDOW (EXPANSION NETWORK) ================= */}
        <div className="retro-window-banner sponsors-rack-window">
          <div className="retro-window-header-bar theme-purple">
            <div className="win-bar-left">
              <span className="win-dot" />
              <span className="win-title-tag">03. EXPANSION NETWORK &amp; PATRONS</span>
            </div>
            <div className="win-bar-meta">HOST ACADEMY · COMMUNITY · INDUSTRY PARTNERS</div>
            <div className="retro-window-controls" aria-hidden="true">
              <span className="win-btn win-min">_</span>
              <span className="win-btn win-max">□</span>
              <span className="win-btn win-close">✕</span>
            </div>
          </div>

          <div className="sponsors-rack-body">
            {/* Dual Title Sponsors Hardware Plates */}
            <div className="title-sponsors-plates-row">
              {titleSponsors.map((sponsor) => (
                <div key={sponsor.name} className="title-expansion-module">
                  <div className="expansion-header">
                    <span className="expansion-badge">{sponsor.badge}</span>
                    <span className="expansion-dept">{sponsor.dept}</span>
                  </div>

                  <div className="expansion-logo-slot">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="expansion-logo-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="expansion-info">
                    <h3 className="expansion-name">{sponsor.name}</h3>
                    <p className="expansion-role">{sponsor.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continuous Ticker Tape Marquee */}
            <div className="retro-marquee-strip">
              <div className="marquee-label-tab">
                <span>ECOSYSTEM</span>
              </div>
              <div className="marquee-scroll-rail" aria-label="Ecosystem Partners">
                <div className="marquee-track-loop">
                  {[0, 1].map((copyIndex) => (
                    <div key={copyIndex} className="marquee-track-group" aria-hidden={copyIndex === 1}>
                      {ecosystemPartners.map((item, idx) => (
                        <div key={`${copyIndex}-${idx}`} className="marquee-partner-chip">
                          <span className="chip-icon">{item.icon}</span>
                          <span className="chip-name">{item.name}</span>
                          <span className="chip-sep">/</span>
                          <span className="chip-tier">{item.tier}</span>
                          <span className="chip-dot">✦</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
