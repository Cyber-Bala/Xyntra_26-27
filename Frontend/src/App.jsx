import { useEffect, useRef, useState } from 'react'
import './App.css'
import Home from './components/Home.jsx'
import About from './components/About.jsx'

const PAGES = [
  { id: 1, tag: 'PROLOGUE 01', label: 'Home' },
  { id: 2, tag: 'ABOUT 02', label: 'About' },
  { id: 3, tag: 'WHY 03', label: 'Why Participate' },
  { id: 4, tag: 'THE ARENA 04', label: 'Arena & Rules' },
  { id: 5, tag: 'REGISTER 05', label: 'Register' },
]

/* ============================================================
   FIRE PARTICLES (Background Embers)
   ============================================================ */

function Embers() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const g = c.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0

    const resize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => ({
      x: w * (0.3 + Math.random() * 0.45),
      baseY: h * (0.5 + Math.random() * 0.6),
      vx: 0.25 + Math.random() * 1.0,
      vy: -(0.5 + Math.random() * 1.6),
      parallax: 0.08 + Math.random() * 0.22,
      life: 0,
      max: 140 + Math.random() * 200,
      size: 0.6 + Math.random() * 1.8,
    })

    const parts = Array.from({ length: 90 }, () => {
      const p = spawn()
      p.life = Math.random() * p.max
      return p
    })

    const loop = () => {
      g.clearRect(0, 0, w, h)
      g.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        p.life += 1
        p.x += p.vx + Math.sin(p.life * 0.05) * 0.3
        p.baseY += p.vy
        const y = p.baseY
        if (p.life > p.max || y < -20) Object.assign(p, spawn(), { baseY: h + 20 })
        const a = Math.sin((Math.PI * p.life) / p.max)
        g.fillStyle = `rgba(255, ${120 + ((Math.random() * 80) | 0)}, 40, ${a * 0.9})`
        g.fillRect(p.x, y, p.size, p.size * (1 + Math.abs(p.vy) * 0.8))
      }
      raf = requestAnimationFrame(loop)
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="embers" aria-hidden="true" />
}

/* ============================================================
   MAIN APP CONTROLLER
   ============================================================ */

function App() {
  const [activePage, setActivePage] = useState(1) // Default to Page 1 (Home)

  // Keyboard navigation: Left/Right arrow keys flip through pages
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activePage < 5) {
        setActivePage((prev) => prev + 1)
      } else if (e.key === 'ArrowLeft' && activePage > 1) {
        setActivePage((prev) => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePage])

  const currentPageObj = PAGES.find((p) => p.id === activePage) || PAGES[0]

  return (
    <>
      {/* BOTTOM HUD CONTROLS */}
      <div className="hud">
        <div className="hud-pagination">
          <button
            className="hud-nav-btn"
            disabled={activePage === 1}
            onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
          >
            ← PREV
          </button>
          <span className="hud-page-indicator">PAGE 0{activePage} / 05</span>
          <button
            className="hud-nav-btn"
            disabled={activePage === 5}
            onClick={() => setActivePage((prev) => Math.min(5, prev + 1))}
          >
            NEXT →
          </button>
        </div>
      </div>

      <main>
        {/* Floating embers particle layer */}
        <Embers />

        {/* TOP NAVBAR */}
        <nav className="navbar">
          <button className="brand" onClick={() => setActivePage(1)}>
            <i className="dot" />
            <span>XYNTRA</span>
          </button>

          <div className="nav-right">
            <span className="nav-tag">
              HACKATHON 2026 <b /> {currentPageObj.tag}
            </span>
            <div className="nav-links">
              {PAGES.map((page) => (
                <button
                  key={page.id}
                  className={activePage === page.id ? 'active' : ''}
                  onClick={() => setActivePage(page.id)}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ================= PAGE ROUTING / VIEWS ================= */}
        <div className="page-view-wrapper">
          {activePage === 1 && <Home onExplore={() => setActivePage(2)} />}
          {activePage === 2 && <About onNavigate={(pageId) => setActivePage(pageId)} />}

          {/* PAGE 3: WHY PARTICIPATE */}
          {activePage === 3 && (
            <section className="why-section" id="why">
              <div className="section-heading">
                <p className="section-kicker">PAGE 03 / WHY PARTICIPATE</p>
                <h2>Don't just watch. Build.</h2>
              </div>
              <div className="hook-grid">
                <Hook number="01" title="Turn ideas into reality" text="Stop waiting for the perfect idea. Start building the version that can become one." />
                <Hook number="02" title="Build beyond the classroom" text="Take your technical skills into a fast-moving challenge where execution matters." />
                <Hook number="03" title="Create with your people" text="Find teammates, divide the problem, and make something none of you could build alone." />
                <Hook number="04" title="Leave with something real" text="A working prototype, a story to tell, and an experience worth putting on your journey." />
              </div>
            </section>
          )}

          {/* PAGE 4: ARENA & RULES */}
          {activePage === 4 && (
            <section className="why-section" id="rules">
              <div className="section-heading">
                <p className="section-kicker">PAGE 04 / ARENA & GUIDELINES</p>
                <h2>Rules & Evaluation Criteria</h2>
              </div>
              <div className="hook-grid">
                <Hook number="01" title="Team Composition" text="Teams can consist of 2 to 4 members. Inter-college teams and multidisciplinary skill sets are highly encouraged." />
                <Hook number="02" title="Original Code Only" text="All prototype development must begin during the 24-hour sprint. Open-source libraries and public APIs are permitted." />
                <Hook number="03" title="Judging Framework" text="Projects will be evaluated on Innovation (30%), Technical Execution (30%), UX/Design (20%), and Presentation (20%)." />
                <Hook number="04" title="Mentorship & Reviews" text="Industry mentors will conduct periodic checkpoint reviews to help refine prototypes and architecture." />
              </div>
            </section>
          )}

          {/* PAGE 5: REGISTER CTA */}
          {activePage === 5 && (
            <section className="register-section" id="register">
              <p className="section-kicker">PAGE 05 / FINAL CALL</p>
              <h2>The arena awaits.</h2>
              <p>Gather your team. Pick your challenge. Make your move.</p>
              <button
                className="primary-btn"
                onClick={() => alert('Official registration portal opening soon!')}
              >
                Register Team Now →
              </button>
            </section>
          )}
        </div>

        {/* GLOBAL FOOTER */}
        <footer>
          <span>XYNTRA</span>
          <span>IEEE COMPUTER SOCIETY</span>
          <span>© 2026</span>
        </footer>
      </main>
    </>
  )
}

function Hook({ number, title, text }) {
  return (
    <article className="hook-card">
      <span className="hook-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

export default App