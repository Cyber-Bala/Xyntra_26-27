import './Sponsors.css'
import Reveal from '../../animations/Reveal.jsx'
import ieeeCsLogo from '../../../assets/logos/ieee_cs_logo.png'
import recLogo from '../../../assets/logos/rec_logo.png'

export default function Sponsors() {
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

  const sponsorLineup = [
    ...titleSponsors.map((sponsor) => ({ ...sponsor, tier: sponsor.role })),
    ...goldSponsors,
    ...silverPartners,
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

          <Reveal className="prizes-podium-grid" stagger>
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
          </Reveal>
        </div>

        {/* SINGLE CONTINUOUS SPONSOR MARQUEE */}
        <div className="sponsor-tiers-container">
          <div className="sponsor-marquee-heading">
            <span className="tier-category-label">OUR PARTNERS</span>
            <span className="sponsor-marquee-caption">BUILDING THE NEXT FRONTIER TOGETHER</span>
          </div>
          <div className="sponsor-marquee" aria-label="Xyntra sponsors and partners">
            <div className="sponsor-marquee-track">
              {[0, 1].map((copy) => (
                <div className="sponsor-marquee-group" key={copy} aria-hidden={copy === 1}>
                  {sponsorLineup.map((sponsor) => (
                    <div className="sponsor-marquee-item" key={`${copy}-${sponsor.name}`}>
                      {sponsor.logo ? (
                        <img src={sponsor.logo} alt="" className="sponsor-title-logo-img" />
                      ) : (
                        <span className="sponsor-logo-text">{sponsor.name}</span>
                      )}
                      <span className="sponsor-meta-badge">{sponsor.tier}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
