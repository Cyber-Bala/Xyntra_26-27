import React, { useState } from 'react'
import './Navbar.css'
import recLogo from '../../assets/logos/rec_logo.png'
import ieeeCsLogo from '../../assets/logos/ieee_cs_logo.png'

export default function Navbar({ activePage, onNavigate, pages }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (pageId) => {
    onNavigate(pageId)
    setMobileMenuOpen(false)
  }

  const currentPageObj = pages.find((p) => p.id === activePage) || pages[0]

  return (
    <header className="global-navbar">
      <div className="nav-container">
        
        {/* LEFT: AUTHENTIC DUAL INSTITUTION LOGOS */}
        <div className="nav-brand-group">
          <button className="brand-logo-btn" onClick={() => handleNavClick(1)} aria-label="Go to Home">
            <img 
              src={recLogo} 
              alt="Rajalakshmi Engineering College" 
              className="nav-org-logo rec-brand-logo" 
            />
            <div className="brand-divider" />
            <img 
              src={ieeeCsLogo} 
              alt="IEEE Computer Society - REC Student Chapter" 
              className="nav-org-logo ieee-brand-logo" 
            />
          </button>
        </div>

        {/* RIGHT: DESKTOP NAVIGATION LINKS */}
        <nav className="nav-links-desktop">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`nav-link-btn ${activePage === page.id ? 'active' : ''}`}
              onClick={() => handleNavClick(page.id)}
            >
              <span className="nav-page-label">{page.label}</span>
              {activePage === page.id && <span className="active-glow-bar" />}
            </button>
          ))}

          <button
            className="nav-register-cta"
            onClick={() => handleNavClick(4)}
            aria-label="Register Team for Hackathon"
          >
            <span>REGISTER NOW</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </nav>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Navigation Directory</span>
            <span className="mobile-drawer-tag">{currentPageObj.label}</span>
          </div>
          <div className="mobile-links-list">
            {pages.map((page) => (
              <button
                key={page.id}
                className={`mobile-nav-item ${activePage === page.id ? 'active' : ''}`}
                onClick={() => handleNavClick(page.id)}
              >
                <span className="item-label">{page.label}</span>
                <span className="item-arrow">→</span>
              </button>
            ))}
          </div>
          <button
            className="mobile-register-btn"
            onClick={() => handleNavClick(4)}
          >
            REGISTER FOR XYNTRA 2026 →
          </button>
        </div>
      )}
    </header>
  )
}
