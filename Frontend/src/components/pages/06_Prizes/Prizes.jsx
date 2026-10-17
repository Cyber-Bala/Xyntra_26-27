import './Prizes.css'
import prizesPodium from '../../../assets/prizes/prizes-podium.png'

const TICKER_R1 = ['Microsoft', 'Google Cloud', 'AWS', 'Intel', 'Dell Technologies', 'GitHub']
const TICKER_R2 = [
  'Neuralforge AI',
  'Blockbridge Protocol',
  'Cyberquest Org',
  'Opencore Systems',
  'Byteforge Matrix',
  'Polygon Guild',
  'Devfolio Network',
  'Hack2Skill Community',
]

const PRIZE_CARDS = [
  {
    rank: 1,
    title: 'Grand Champion',
    amount: '₹2,00,000',
    stripClass: 'pz-strip-first',
    perks: [
      'Gold trophy & citation',
      'Fast-track interview access',
      'Cloud credits & dev perks',
    ],
  },
  {
    rank: 2,
    title: 'Runner Up',
    amount: '₹1,00,000',
    stripClass: 'pz-strip-second',
    perks: [
      'Silver trophy & citation',
      'Partner fast-track review',
      'Cloud credits & dev perks',
    ],
  },
  {
    rank: 3,
    title: 'Second Runner Up',
    amount: '₹50,000',
    stripClass: 'pz-strip-third',
    perks: [
      'Bronze trophy & citation',
      'Mentorship network access',
      'Swag & goodies kit',
    ],
  },
]

export default function Prizes() {
  return (
    <section className="pz-section" id="prizes">
      {/* ── Decorative Code-Drawn Background Layer (z-index: 0) ── */}
      <div className="pz-bg-layer" aria-hidden="true">
        <div className="pz-bg-blue-base" />
        <div className="pz-shape-orange-top" />
        <div className="pz-shape-orange-bottom" />
        <div className="pz-bg-grain" />
      </div>

      {/* ── Foreground Content Layer (z-index: 1) ── */}
      <div className="pz-content-layer">
        {/* 1. ONE LEFT COLUMN: Headline block + Total Prize Pool block */}
        <div className="pz-left-col">
          <div className="pz-headline-block">
            <span className="pz-headline-tag">+ 03 / PRIZES</span>
            <h1 className="prizes-headline">
              REAL IDEAS.
              <br />
              REAL RECOGNITION.
            </h1>
            <span className="pz-headline-sub">THREE TRACKS. A BRIGHTER TOMORROW.</span>
          </div>

          <div className="pz-pool-block">
            <span className="pz-pool-tag">TOTAL PRIZE POOL</span>
            <div className="pz-pool-num">₹3,50,000+</div>
            <p className="pz-pool-sub">
              in prizes, and the teams and platforms backing every build.
            </p>
          </div>
        </div>

        {/* 2. PODIUM + CARDS WRAPPER (right side) */}
        <div className="pz-stage-wrap">
          <img
            src={prizesPodium}
            alt="Prizes podiums with First, Second, and Third cartridges"
            className="pz-podium-img"
          />

          <div className="pz-cards-row">
            {PRIZE_CARDS.map((p) => (
              <div key={p.rank} className={`pz-card pz-card-rank-${p.rank}`}>
                <div className={`pz-card-strip ${p.stripClass}`} aria-hidden="true" />
                <div className="pz-card-header">
                  <h2 className="pz-card-title">{p.title}</h2>
                </div>
                <div className="pz-card-amount">{p.amount}</div>
                <div className="pz-card-divider" />
                <ul className="pz-card-perks">
                  {p.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5. TICKER (bottom, full width, moving) */}
        <div className="pz-ticker-wrap" aria-label="Sponsors and partners">
          <div className="pz-marquee">
            <div className="pz-marquee-track">
              {[...TICKER_R1, ...TICKER_R1, ...TICKER_R1, ...TICKER_R1].map((item, idx) => (
                <span key={idx} className="pz-ticker-r1-item">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pz-marquee small">
            <div className="pz-marquee-track reverse">
              {[...TICKER_R2, ...TICKER_R2].map((item, idx) => (
                <span key={idx} className="pz-ticker-r2-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
