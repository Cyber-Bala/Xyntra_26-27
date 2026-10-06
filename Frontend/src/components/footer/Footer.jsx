import './Footer.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className="wireframe-master-footer">
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

      <div className="footer-col">
        <h3 className="footer-heading">QUICK LINKS</h3>
        <div className="footer-nav-list">
          <button onClick={() => onNavigate(1)}>Home &amp; Countdown</button>
          <button onClick={() => onNavigate(2)}>About &amp; Problem Statements</button>
          <button onClick={() => onNavigate(3)}>Rules &amp; Guidelines</button>
          <button onClick={() => onNavigate(4)}>Team Registration</button>
          <button onClick={() => onNavigate(5)}>Sponsors &amp; Rewards</button>
        </div>
      </div>

      <div className="footer-col">
        <h3 className="footer-heading">CONNECT &amp; SOCIALS</h3>
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
  )
}
