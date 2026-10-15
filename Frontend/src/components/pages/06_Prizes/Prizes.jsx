import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Prizes.css'
import bgPrizes from '../../../assets/bg/bg-prizes.webp'
import SectionBg from '../../fx/SectionBg.jsx'
import ieeeCsLogo from '../../../assets/logos/ieee_cs_logo.png'
import recLogo from '../../../assets/logos/rec_logo.png'

gsap.registerPlugin(ScrollTrigger)

/* Visual order on the podium is 2nd · 1st · 3rd */
const PODIUM = [
  { rank: 2, tone: 'cream', title: 'Runner up', amount: 100000, perks: ['Silver trophy & citation', 'Partner fast-track review', 'Cloud credits & dev perks'] },
  { rank: 1, tone: 'amber', title: 'Grand champion', amount: 200000, perks: ['Gold trophy & citation', 'Fast-track interview access', 'Cloud credits & dev perks'] },
  { rank: 3, tone: 'coral', title: 'Second runner up', amount: 50000, perks: ['Bronze trophy & citation', 'Mentorship network access', 'Swag & goodies kit'] },
]

const BOUNTIES = [
  { name: 'Best all-women team', amount: '₹10,000', perk: 'Cash + special trophy' },
  { name: 'Best freshers squad', amount: '₹10,000', perk: 'Cash + rising-star certificate' },
  { name: 'Best AI / autonomous hack', amount: '₹15,000', perk: 'Sponsor bounty + API credits' },
  { name: 'Most innovative Web3 hack', amount: '₹15,000', perk: 'Grant pool + protocol goodies' },
]

const TITLE_PARTNERS = [
  { name: 'IEEE Computer Society', role: 'Technical sponsor', logo: ieeeCsLogo, chip: 'dark' },
  { name: 'Rajalakshmi Engineering College', role: 'Host institution', logo: recLogo, chip: 'light' },
]

const SPONSORS = ['Microsoft', 'Google Cloud', 'AWS', 'Intel', 'DELL Technologies', 'GitHub']
const ECOSYSTEM = ['CloudScale Global', 'DevMatrix Labs', 'NeuralForge AI', 'BlockBridge Protocol', 'CyberQuest Org', 'OpenCore Systems', 'ByteForge Matrix', 'Polygon Guild', 'Devfolio Network', 'Hack2Skill Community']

/* 16 x 16 pixel trophy:  X = body, h = highlight, d = shade */
const TROPHY = [
  '..XXXXXXXXXXXX..',
  'XXXhhXXXXXXXXXXX',
  'X.XhXXXhhXXXXd.X',
  'X.XhXXhhhhXXXd.X',
  'X.XhXXXhhXXXXd.X',
  'XX.hXXXXXXXXdd.X',
  '..XXXXXXXXXXdd..',
  '...XXXXXXXXdd...',
  '.....XXXXdd.....',
  '......XXdd......',
  '......XXdd......',
  '.....XXXXdd.....',
  '....XXXXXXdd....',
  '...XXXXXXXXdd...',
  '...dddddddddd...',
  '................',
]

function PixelTrophy() {
  const rects = useMemo(() => {
    const out = []
    TROPHY.forEach((row, y) => {
      let x = 0
      while (x < row.length) {
        const c = row[x]
        if (c === '.') { x++; continue }
        let w = 1
        while (row[x + w] === c) w++
        out.push({ x, y, w, c })
        x += w
      }
    })
    return out
  }, [])
  return (
    <svg className="pz-trophy-svg" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} className={`tp-${r.c}`} />
      ))}
    </svg>
  )
}

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export default function Prizes() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const amounts = gsap.utils.toArray('.pz-amount')
      if (reduced) {
        amounts.forEach((el) => { el.textContent = fmt(Number(el.dataset.amount)) })
        return
      }

      const runCounter = () => {
        amounts.forEach((el, i) => {
          const o = { v: 0 }
          gsap.to(o, {
            v: Number(el.dataset.amount),
            duration: 1.4,
            delay: i * 0.1,
            ease: 'power3.out',
            overwrite: 'auto',
            onUpdate: () => { el.textContent = fmt(o.v) },
          })
        })
      }
      const resetCounter = () => {
        amounts.forEach((el) => {
          gsap.killTweensOf(el)
          el.textContent = '₹0'
        })
      }

      resetCounter()

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.pz-stage',
          start: 'top 75%',
          toggleActions: 'play reverse play reverse',
          invalidateOnRefresh: true,
          onEnter: () => runCounter(),
          onEnterBack: () => runCounter(),
          onLeave: () => resetCounter(),
          onLeaveBack: () => resetCounter(),
        },
        defaults: { ease: 'power3.out' },
      })
      tl.fromTo('.pz-floor', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
        .fromTo('.pz-step', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: { each: 0.22, from: 'edges' }, ease: 'steps(14)' }, 0.1)
        .fromTo('.pz-trophy', { y: -140, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: { each: 0.18, from: 'edges' }, ease: 'bounce.out' }, '>-0.25')
        .fromTo('.pz-spot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, '<0.2')
        .fromTo('.pz-spark', { autoAlpha: 1, x: 0, y: 0, scale: 1 }, {
          x: () => gsap.utils.random(-130, 130), y: () => gsap.utils.random(-170, -30), autoAlpha: 0, scale: 0.2,
          duration: 1.1, stagger: 0.03, ease: 'power2.out',
        }, '<0.3')
        .fromTo('.pz-perks li', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05 }, '<0.4')

      gsap.fromTo('.pz-bounty', { autoAlpha: 0, x: -24 }, {
        autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'steps(5)',
        scrollTrigger: {
          trigger: '.pz-board',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo('.pz-partner', { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pz-partners',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
          invalidateOnRefresh: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="pz-section" id="prizes" data-accent="coral">
      <SectionBg
        src={bgPrizes}
        opacity={1}
        position="center bottom"
        gradient="linear-gradient(to bottom, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.2) 50%, rgba(10,8,6,0.4) 100%)"
      />
      <div className="pz-wrap">
        <header className="pz-head">
          <h2 className="pz-title">Rewards worth the <br />all-nighter.</h2>
          <p className="pz-lead">₹3,50,000+ in prizes, and the teams and platforms backing every build.</p>
        </header>

        <div className="pz-stage">
          <div className="pz-spot" aria-hidden="true" />
          <div className="pz-podium">
            {PODIUM.map((p) => (
              <div key={p.rank} className={`pz-col pz-rank-${p.rank} tone-${p.tone}`}>
                <div className="pz-trophy">
                  <PixelTrophy />
                  {p.rank === 1 && (
                    <div className="pz-sparks" aria-hidden="true">
                      {Array.from({ length: 14 }, (_, i) => <i key={i} className="pz-spark" />)}
                    </div>
                  )}
                </div>
                <div className="pz-step">
                  <span className="pz-num" aria-hidden="true">{p.rank}</span>
                  <div className="pz-info">
                    <span className="pz-label">{p.title}</span>
                    <strong className="pz-amount" data-amount={p.amount}>{fmt(p.amount)}</strong>
                    <ul className="pz-perks">{p.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pz-floor" aria-hidden="true" />
        </div>

        <div className="pz-lower">
          <div className="pz-board">
            <p className="pz-sub">Special tracks</p>
            <ul>
              {BOUNTIES.map((b) => (
                <li key={b.name} className="pz-bounty">
                  <span className="pz-b-name">{b.name}</span>
                  <i className="pz-dots" aria-hidden="true" />
                  <span className="pz-b-amt">{b.amount}</span>
                  <small>{b.perk}</small>
                </li>
              ))}
            </ul>
          </div>

          <div className="pz-partners">
            <p className="pz-sub">Backed by</p>
            <div className="pz-partner-grid">
              {TITLE_PARTNERS.map((t) => (
                <div key={t.name} className="pz-partner">
                  <div className={`pz-logo ${t.chip}`}><img src={t.logo} alt={`${t.name} logo`} loading="lazy" /></div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pz-marquees" aria-label="Sponsors and community partners">
          <div className="pz-marquee"><div className="pz-marquee-track">
            {[...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS].map((s, i) => <span key={i}>{s}</span>)}
          </div></div>
          <div className="pz-marquee small"><div className="pz-marquee-track reverse">
            {[...ECOSYSTEM, ...ECOSYSTEM].map((s, i) => <span key={i}>{s}</span>)}
          </div></div>
        </div>
      </div>
    </section>
  )
}
