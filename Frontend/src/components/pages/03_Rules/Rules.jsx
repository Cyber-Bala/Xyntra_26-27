import PixelHeading from '../02_About/PixelHeading.jsx'
import './Rules.css'

/* ─── Exact 5 Rules Data from Reference Image ────────────────────── */
const RULES_DATA = [
  {
    num: '01',
    title: 'FORM A TEAM',
    summary: '1–4 builders. All backgrounds welcome.',
    iconType: 'team',
  },
  {
    num: '02',
    title: 'BUILD SOMETHING',
    summary: 'Turn your ideas into a working prototype.',
    iconType: 'bulb',
  },
  {
    num: '03',
    title: 'SUBMIT ON TIME',
    summary: 'Share your project before the deadline.',
    iconType: 'submit',
  },
  {
    num: '04',
    title: 'BE ORIGINAL',
    summary: 'Your own work, real impact.',
    iconType: 'original',
  },
  {
    num: '05',
    title: 'KEEP IT POSITIVE',
    summary: 'A respectful, inclusive, and creative space for all.',
    iconType: 'heart',
  },
]

function RuleIcon({ type }) {
  switch (type) {
    case 'team':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      )
    case 'bulb':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M12 6a6 6 0 0 0-6 6c0 2.22 1.2 4.15 3 5.19V18h6v-.81c1.8-1.04 3-2.97 3-5.19a6 6 0 0 0-6-6z" />
        </svg>
      )
    case 'submit':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case 'original':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          <path d="M19 11a4 4 0 0 1 3 4v1" />
          <path d="M5 11a4 4 0 0 0-3 4v1" />
        </svg>
      )
    case 'heart':
    default:
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
  }
}

export default function Rules() {
  return (
    <section className="retro-rules-fieldguide-section" id="rules">
      {/* ── EXPANDED FULL-WIDTH OPERATOR'S FIELD GUIDE PANEL ─────── */}
      <div className="operator-fieldguide-panel">
        {/* Corner Screws on the Panel */}
        <span className="fieldguide-screw screw-top-left" aria-hidden="true" />
        <span className="fieldguide-screw screw-top-right" aria-hidden="true" />
        <span className="fieldguide-screw screw-bottom-left" aria-hidden="true" />
        <span className="fieldguide-screw screw-bottom-right" aria-hidden="true" />

        {/* ── 1. PANEL HEADER BAR ───────────────────────────────── */}
        <header className="fieldguide-panel-header">
          {/* Left Title Deck: 04 / RULES + OPERATOR'S FIELD GUIDE */}
          <div className="fieldguide-header-left">
            <span className="fieldguide-tag-badge">04 / RULES</span>
            <PixelHeading
              as="h2"
              size="xl"
              level={2}
              className="fieldguide-massive-title"
            >
              {"OPERATOR'S\nFIELD GUIDE"}
            </PixelHeading>
          </div>

          {/* Right Subtitle Deck: SAME SIGNAL. BETTER BUILDERS. */}
          <div className="fieldguide-header-right">
            <span className="fieldguide-sub-lead">SAME SIGNAL.</span>
            <span className="fieldguide-sub-tail">BETTER BUILDERS.</span>
          </div>

          {/* Diagonal hatch background overlay matching image */}
          <div className="fieldguide-header-hatch" aria-hidden="true" />
        </header>

        {/* ── 2. 5 RULES COLUMNS IN FULL-WIDTH STRIP ────────────── */}
        <div className="fieldguide-rules-grid">
          {RULES_DATA.map((rule) => (
            <article key={rule.num} className="fieldguide-rule-card">
              {/* Top Row: Stamped Number [01] & Themed Icon */}
              <div className="rule-card-top-row">
                <span className="rule-card-num">{rule.num}</span>
                <div className="rule-card-icon-wrap">
                  <RuleIcon type={rule.iconType} />
                </div>
              </div>

              {/* Large Bold Rule Title */}
              <h3 className="rule-card-title">{rule.title}</h3>

              {/* Clean Readable Description */}
              <p className="rule-card-summary">{rule.summary}</p>
            </article>
          ))}
        </div>

        {/* ── 3. BOTTOM TAGLINE STRIP: ////// GOOD IDEAS TRAVEL FAR. ─ */}
        <div className="fieldguide-bottom-strip">
          <span className="strip-slashes">//////</span>
          <span className="strip-motto">GOOD IDEAS TRAVEL FAR.</span>
        </div>
      </div>
    </section>
  )
}
