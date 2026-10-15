import { useEffect, useRef } from 'react'
import './Footer.css'
import bgFooter from '../../assets/bg/bg-footer.webp'
import SectionBg from '../fx/SectionBg.jsx'

export default function Footer({ onNavigate }) {
  const taglineRef = useRef(null)

  const quickLinks = [
    { id: 1, label: 'Home', section: 'hero' },
    { id: 2, label: 'About', section: 'about' },
    { id: 6, label: 'Prizes & Partners', section: 'prizes' },
    { id: 3, label: 'Rules', section: 'rules' },
    { id: 4, label: 'Registration', path: '/register' },
  ]

  const resourceLinks = [
    { label: 'Official Rulebook [PDF]', href: '#rules' },
    { label: 'Challenge Tracks', href: '#problem-statements' },
    { label: 'Campus Map & Travel', href: '#contact' },
    { label: 'IEEE Student Chapter', href: 'https://www.computer.org/', external: true },
  ]

  const socials = [
    { name: 'X / Twitter', href: '#x', symbol: '𝕏' },
    { name: 'LinkedIn', href: '#linkedin', symbol: 'in' },
    { name: 'GitHub', href: '#github', symbol: '⌥' },
    { name: 'Instagram', href: '#instagram', symbol: '◈' },
    { name: 'Discord', href: '#discord', symbol: '✦' },
  ]

  useEffect(() => {
    const el = taglineRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetText = 'Ideas • Code • Impact'
    let timer = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (timer) clearTimeout(timer)
          let i = 0
          el.textContent = ''
          const step = () => {
            el.textContent = targetText.slice(0, ++i)
            if (i < targetText.length) {
              timer = setTimeout(step, 45)
            }
          }
          timer = setTimeout(step, 150)
        } else {
          if (timer) clearTimeout(timer)
          el.textContent = ''
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <footer className="fullscreen-retro-footer" id="contact" data-accent="violet">
      <SectionBg
        src={bgFooter}
        opacity={1}
        position="center top"
        gradient="linear-gradient(to bottom, transparent 0%, rgba(10,8,6,0.35) 60%, rgba(10,8,6,0.95) 100%)"
      />
      {/* Main Expansive Content Container */}
      <div className="footer-fullwidth-content">
        <div className="footer-main-grid">
          {/* Brand Block */}
          <div className="footer-brand-column">
            <div className="footer-logo-line">
              <span className="footer-brand-title">
                XYNTRA <span className="brand-accent">26-27</span>
              </span>
            </div>
            <p className="footer-brand-subtitle">24-HOUR NATIONAL LEVEL HACKATHON</p>
            <div className="footer-brand-tag-badge">
              <span className="badge-dot" />
              <span className="badge-text">IEEE CS &bull; REC CAMPUS</span>
            </div>
            <p className="footer-mission-lead">
              Empowering bold thinkers to turn ideas into high-impact software, hardware, and AI innovations.
            </p>
          </div>

          {/* Quick Links Navigation */}
          <div className="footer-nav-column">
            <span className="footer-column-heading">NAVIGATION</span>
            <nav className="footer-links-stack" aria-label="Footer navigation">
              {quickLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="footer-nav-btn"
                  onClick={() => onNavigate(item.id, item.section)}
                >
                  <span className="link-chevron" aria-hidden="true">&gt;</span>
                  <span className="link-text">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Resources & Docs */}
          <div className="footer-resources-column">
            <span className="footer-column-heading">DOCUMENTATION</span>
            <div className="footer-links-stack">
              {resourceLinks.map((res, rIdx) => (
                <a
                  key={rIdx}
                  href={res.href}
                  className="footer-anchor-link"
                  target={res.external ? '_blank' : undefined}
                  rel={res.external ? 'noopener noreferrer' : undefined}
                >
                  <span className="link-chevron" aria-hidden="true">&gt;</span>
                  <span className="link-text">{res.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="footer-contact-column">
            <span className="footer-column-heading">COMMUNICATION</span>
            <div className="footer-contact-stack">
              <div className="contact-row">
                <span className="contact-prefix">EMAIL:</span>
                <a href="mailto:xyntra.hackathon@college.edu" className="contact-link">
                  xyntra.hackathon@college.edu
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-prefix">PHONE:</span>
                <span className="contact-text">+91 98765 43210</span>
              </div>
              <div className="contact-row">
                <span className="contact-prefix">VENUE:</span>
                <span className="contact-text">Rajalakshmi Engineering College, Chennai</span>
              </div>
            </div>

            <div className="footer-social-cluster">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="retro-keycap-btn"
                  aria-label={s.name}
                >
                  <span className="keycap-symbol">{s.symbol}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FULL-WIDTH TERMINAL STRIP ─────────────────────── */}
      <div className="footer-bottom-terminal-strip">
        <div className="terminal-strip-inner">
          <span className="terminal-strip-copy">
            &copy; 2026&ndash;2027 XYNTRA. All Rights Reserved. IEEE Computer Society REC.
          </span>

          <span ref={taglineRef} className="terminal-strip-tagline">
            Ideas • Code • Impact
          </span>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={() => {
              if (window.lenisInstance) window.lenisInstance.scrollTo(0)
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Scroll back to top"
          >
            <span>TOP</span>
            <span aria-hidden="true">&uarr;</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
