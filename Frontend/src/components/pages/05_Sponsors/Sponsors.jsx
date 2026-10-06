import React from 'react'
import './Sponsors.css'
import ieeeCsLogo from '../../../assets/logos/ieee_cs_logo.png'
import recLogo from '../../../assets/logos/rec_logo.png'

export default function Sponsors({ onNavigate }) {
  const prizes = [
    {
      rank: '🥇 1st Prize',
      tier: 'CHAMPION',
      amount: '₹50,000',
      perks: ['Grand Trophy & Gold Badges', 'Direct Industry Mentorship & Interviews', 'Exclusive Swag & Cloud Credits'],
      glowClass: 'gold-card',
    },
    {
      rank: '🥈 2nd Prize',
      tier: 'RUNNER UP',
      amount: '₹30,000',
      perks: ['Silver Trophy & Badges', 'Fast-Track Incubation Support', 'Developer Goodies & Cloud Credits'],
      glowClass: 'silver-card',
    },
    {
      rank: '🥉 3rd Prize',
      tier: '2ND RUNNER UP',
      amount: '₹20,000',
      perks: ['Bronze Trophy & Badges', 'Startup Vouchers', 'Developer Swag Kit'],
      glowClass: 'bronze-card',
    },
  ]

  const titleSponsors = [
    { name: 'IEEE Computer Society', role: 'Title Sponsor & Technical Community Partner', logo: ieeeCsLogo },
    { name: 'Rajalakshmi Engineering College', role: 'Host Institution & Campus Partner', logo: recLogo },
  ]

  const goldSponsors = [
    { name: 'CloudScale Global', tier: 'Gold Partner' },
    { name: 'DevMatrix Labs', tier: 'Gold Partner' },
  ]

  const silverPartners = [
    { name: 'NeuralForge AI', tier: 'Community' },
    { name: 'BlockBridge Protocol', tier: 'Web3 Track' },
    { name: 'CyberQuest Org', tier: 'Media' },
  ]

  return (
    <section className="sponsors-page-section" id="sponsors">
      <div className="sponsors-main-container">

        {/* HEADER BLOCK */}
        <div className="sponsors-header-block">
          <div className="sponsors-kicker-tag">
            <span className="kicker-gem">🏆</span>
            <span>REWARDS & SPONSORS</span>
          </div>
          <h1 className="sponsors-main-title">PRIZE POOL & PARTNERS</h1>
          <p className="sponsors-lead-desc">
            We celebrate every builder who dares to push boundaries. Top prototypes receive direct cash grants,
            incubation backing, and recognition across our global partner network.
          </p>
        </div>

        {/* PRIZE POOL SECTION */}
        <div className="prize-pool-wrapper">
          <div className="total-pool-banner">
            <span className="pool-sparkle">✦</span>
            <span className="pool-label">TOTAL REWARDS POOL:</span>
            <span className="pool-number">₹1,00,000+</span>
            <span className="pool-sparkle">✦</span>
          </div>

          <div className="prizes-podium-grid">
            {prizes.map((p, idx) => (
              <div key={idx} className={`prize-podium-card ${p.glowClass}`}>
                <div className="prize-header">
                  <span className="prize-rank-title">{p.rank}</span>
                  <span className="prize-tier-badge">{p.tier}</span>
                </div>

                <div className="prize-cash-box">
                  <span className="prize-amt-val">{p.amount}</span>
                  <span className="prize-amt-sub">Direct Cash Prize</span>
                </div>

                <ul className="prize-perks-list">
                  {p.perks.map((perk, i) => (
                    <li key={i}>
                      <span className="perk-bullet">✓</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SPONSOR TIERS */}
        <div className="sponsor-tiers-container">

          {/* Title Sponsor */}
          <div className="tier-group">
            <span className="tier-category-label">👑 ORGANIZING &amp; TITLE PARTNERS</span>
            <div className="title-sponsor-grid">
              {titleSponsors.map((sp, i) => (
                <div key={i} className="sponsor-box title-sp-box">
                  <img src={sp.logo} alt={sp.name} className="sponsor-title-logo-img" />
                  <span className="sponsor-meta-badge">{sp.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="tier-group">
            <span className="tier-category-label">⚡ GOLD SPONSORS</span>
            <div className="gold-sponsors-grid">
              {goldSponsors.map((sp, i) => (
                <div key={i} className="sponsor-box gold-sp-box">
                  <div className="sponsor-logo-text">{sp.name}</div>
                  <span className="sponsor-meta-badge">{sp.tier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silver & Community */}
          <div className="tier-group">
            <span className="tier-category-label">🌐 COMMUNITY & TRACK PARTNERS</span>
            <div className="silver-sponsors-grid">
              {silverPartners.map((sp, i) => (
                <div key={i} className="sponsor-box silver-sp-box">
                  <div className="sponsor-logo-text">{sp.name}</div>
                  <span className="sponsor-meta-badge">{sp.tier}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3-COLUMN MASTER FOOTER */}
        <footer className="wireframe-master-footer">

          {/* COLUMN 1: ABOUT SOCIETY */}
          <div className="footer-col">
            <h3 className="footer-heading">ABOUT SOCIETY</h3>
            <p className="footer-society-desc">
              IEEE Computer Society Student Branch Chapter is a premier technical community dedicated to advancing
              technology for humanity through innovation, hackathons, and technical symposia.
            </p>
            <div className="footer-contact-info">
              <div>📧 <span>xyntra.hackathon@college.edu</span></div>
              <div>📞 <span>+91 98765 43210</span></div>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="footer-col">
            <h3 className="footer-heading">QUICK LINKS</h3>
            <div className="footer-nav-list">
              <button onClick={() => onNavigate(1)}>Home & Countdown</button>
              <button onClick={() => onNavigate(2)}>About & Problem Statements</button>
              <button onClick={() => onNavigate(3)}>Rules & Guidelines</button>
              <button onClick={() => onNavigate(4)}>Team Registration</button>
              <button onClick={() => onNavigate(5)}>Sponsors & Rewards</button>
            </div>
          </div>

          {/* COLUMN 3: BRANDING & SOCIALS */}
          <div className="footer-col">
            <h3 className="footer-heading">CONNECT & SOCIALS</h3>
            <div className="footer-social-links">
              <a href="#instagram" className="social-pill-btn">Instagram ↗</a>
              <a href="#linkedin" className="social-pill-btn">LinkedIn ↗</a>
              <a href="#x" className="social-pill-btn">X / Twitter ↗</a>
              <a href="#github" className="social-pill-btn">GitHub ↗</a>
            </div>
            <div className="footer-college-stamp">
              <span>XYNTRA NATIONAL HACKATHON 2026</span>
              <span>© ALL RIGHTS RESERVED · CHENNAI</span>
            </div>
          </div>

        </footer>

      </div>
    </section>
  )
}
