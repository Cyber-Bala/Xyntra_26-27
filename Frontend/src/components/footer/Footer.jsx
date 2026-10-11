import './Footer.css'

export default function Footer({ onNavigate }) {
  const quickLinks = [
    { id: 1, label: 'Home & Countdown', code: '01' },
    { id: 2, label: 'About & Tracks', code: '02' },
    { id: 5, label: 'Prizes & Partners', code: '03' },
    { id: 3, label: 'Rules & Protocol', code: '04' },
    { id: 4, label: 'Team Registration', code: '05' },
  ]

  const socials = [
    { name: 'Instagram', href: '#instagram', icon: '↗' },
    { name: 'LinkedIn', href: '#linkedin', icon: '↗' },
    { name: 'X / Twitter', href: '#x', icon: '↗' },
    { name: 'GitHub', href: '#github', icon: '↗' },
  ]

  return (
    <footer className="retro-master-footer">
      {/* Top Telemetry Strip */}
      <div className="footer-telemetry-strip">
        <div className="footer-status-tag">
          <span className="retro-status-led led-green" />
          <span className="footer-status-text">TERMINAL BROADCAST: ACTIVE</span>
        </div>
        <span className="footer-channel-id">CH-XYNTRA.26 // REC_CAMPUS_NET</span>
      </div>

      <div className="footer-grid-body">
        {/* COL 1: ABOUT SOCIETY */}
        <div className="footer-col">
          <div className="footer-heading-wrap">
            <span className="footer-kicker-tag">[SYS_PATRON]</span>
            <h3 className="footer-heading">ABOUT SOCIETY</h3>
          </div>
          <p className="footer-society-desc">
            IEEE Computer Society Student Branch Chapter is a premier technical collective dedicated to advancing
            technological disruption through national hackathons, open research, and developer incubations.
          </p>
          <div className="footer-contact-cluster">
            <div className="footer-contact-row">
              <span className="contact-type-label">SIGNAL:</span>
              <a href="mailto:xyntra.hackathon@college.edu" className="contact-val-link">
                xyntra.hackathon@college.edu
              </a>
            </div>
            <div className="footer-contact-row">
              <span className="contact-type-label">TEL_LINE:</span>
              <span className="contact-val-text">+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* COL 2: QUICK LINKS */}
        <div className="footer-col">
          <div className="footer-heading-wrap">
            <span className="footer-kicker-tag">[DIR_NAV]</span>
            <h3 className="footer-heading">QUICK LINKS</h3>
          </div>
          <div className="footer-nav-list">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className="footer-nav-btn"
                onClick={() => onNavigate(link.id)}
              >
                <span className="nav-btn-code">[{link.code}]</span>
                <span className="nav-btn-label">{link.label}</span>
                <span className="nav-btn-arrow">»</span>
              </button>
            ))}
          </div>
        </div>

        {/* COL 3: CONNECT & SOCIALS */}
        <div className="footer-col">
          <div className="footer-heading-wrap">
            <span className="footer-kicker-tag">[COMM_PORTS]</span>
            <h3 className="footer-heading">CONNECT &amp; SOCIALS</h3>
          </div>
          <div className="footer-social-links">
            {socials.map((s) => (
              <a key={s.name} href={s.href} className="social-pill-btn">
                <span>{s.name}</span>
                <span className="social-arrow">{s.icon}</span>
              </a>
            ))}
          </div>

          {/* Official Certified Seal Stamp */}
          <div className="footer-certified-badge">
            <div className="badge-stamp-header">
              <span className="stamp-dot" />
              <span>OFFICIAL TELEMETRY SEAL</span>
            </div>
            <div className="badge-stamp-title">XYNTRA 2026 HACKATHON</div>
            <div className="badge-stamp-sub">IEEE CS CHAPTER · REC CHENNAI</div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright Strip */}
      <div className="footer-bottom-strip">
        <span>© 2026-2027 XYNTRA PLATFORM · ALL PROTOCOLS RESERVED</span>
        <span className="footer-sub-stamp">SECURE TERMINAL NODE // VERIFIED</span>
      </div>
    </footer>
  )
}
