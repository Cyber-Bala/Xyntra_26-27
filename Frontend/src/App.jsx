import { useEffect, useRef, useState } from 'react'
import './App.css'

const EVENT_DATE = new Date('2026-10-24T09:00:00+05:30').getTime()
const CHAPTERS = ['PROLOGUE 01', 'THE CLOCK 02', 'ABOUT 03', 'WHY 04', 'THE ARENA 05']

/* ============================================================
   FIRE PARTICLES
   Embers drift upward on their own, and shift position as you
   scroll, so the fire feels like it's part of the page depth.
   ============================================================ */

function Embers() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const g = c.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let scrollY = window.scrollY

    const resize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const spawn = () => ({
      x: w * (0.3 + Math.random() * 0.45),
      baseY: h * (0.5 + Math.random() * 0.6),
      vx: 0.25 + Math.random() * 1.0,
      vy: -(0.5 + Math.random() * 1.6),
      parallax: 0.08 + Math.random() * 0.22, // how much it reacts to scroll
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
        // scroll shifts particles at their own depth, like floating ash
        const y = p.baseY + scrollY * p.parallax
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
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={ref} className="embers" aria-hidden="true" />
}


/* ============================================================
   APP
   ============================================================ */

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [introKey] = useState(0)
  const [chapter, setChapter] = useState(0)

  function getTimeLeft() {
    const difference = EVENT_DATE - Date.now()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // which chapter label to show, based on the section on screen
  useEffect(() => {
    const update = () => {
      const list = Array.from(document.querySelectorAll('main > section'))
      const idx = list.filter(
        (s) => s.getBoundingClientRect().top <= window.innerHeight * 0.5
      ).length - 1
      setChapter(Math.max(0, idx))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Any <a href="#section"> inside the page scrolls smoothly to it
  function handleLinkClick(e) {
    const link = e.target.closest('a[href^="#"]')
    if (!link) return

    const id = link.getAttribute('href').slice(1)
    const target = document.getElementById(id)
    if (!target) return

    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <>

      <div className="hud">
        <span className="hud-scroll">↓</span>
      </div>

      <main onClick={handleLinkClick}>

        <Embers />


        {/* NAVBAR */}
        <nav className="navbar">
          <div className="brand">
            <i className="dot" />
            <span>XYNTRA</span>
          </div>

          <div className="nav-right">
            <span className="nav-tag">
              HACKATHON 2026 <b /> {CHAPTERS[chapter]}
            </span>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#why">Why Participate</a>
              <a href="#register">Register</a>
            </div>
          </div>
        </nav>


        {/* HERO */}
        <section className="hero" id="home" key={introKey}>

          <span className="hero-streak" />

          <div className="hero-content">

            <p className="hero-kicker">THE FUTURE IS BUILT FROM WHAT WE UNSEAT</p>

            <h1>XYNTRA</h1>

            <p className="hero-sub">
              HACKATHON 2026 <span>·</span> A NEW ERA IN MOTION
            </p>

            <p className="hero-hook">Dream. Build. Disrupt.</p>

            <p className="hero-description">
              Step into the arena where bold ideas meet code,
              creativity meets execution, and builders turn
              problems into possibilities.
            </p>

            <div className="event-meta">
              <span>24 HOURS</span>
              <span>•</span>
              <span>HACKATHON</span>
              <span>•</span>
              <span>CHENNAI</span>
            </div>

            <a className="primary-btn" href="#register">
              Enter the Arena <span>→</span>
            </a>

          </div>
        </section>


        {/* COUNTDOWN */}
        <section className="countdown-section">

          <p className="section-kicker">THE CLOCK IS TICKING</p>

          <h2>Hacking Begins In</h2>

          <div className="countdown-grid">
            <TimeCard value={timeLeft.days} label="Days" />
            <TimeCard value={timeLeft.hours} label="Hours" />
            <TimeCard value={timeLeft.minutes} label="Mins" />
            <TimeCard value={timeLeft.seconds} label="Secs" />
          </div>

        </section>


        {/* ABOUT */}
        <section className="about-section" id="about">

          <div className="section-heading">
            <p className="section-kicker">02 / ABOUT</p>
            <h2>About Xyntra</h2>
          </div>

          <div className="about-grid">

            <div className="about-copy">
              <p>
                Xyntra is a high-energy hackathon built
                for students who want to take an idea
                beyond the whiteboard and into the real world.
              </p>

              <p>
                Bring your team, choose your challenge,
                build your solution, and experience the
                intensity of creating something from scratch.
              </p>
            </div>

            <div className="about-points">
              <div><span>01</span>Build with purpose.</div>
              <div><span>02</span>Solve real problems.</div>
              <div><span>03</span>Present what you create.</div>
              <div><span>04</span>Learn with your team.</div>
            </div>

          </div>

        </section>


        {/* WHY PARTICIPATE */}
        <section className="why-section" id="why">

          <div className="section-heading">
            <p className="section-kicker">03 / WHY PARTICIPATE</p>
            <h2>Don't just watch. Build.</h2>
          </div>

          <div className="hook-grid">

            <Hook
              number="01"
              title="Turn ideas into reality"
              text="Stop waiting for the perfect idea. Start building the version that can become one."
            />

            <Hook
              number="02"
              title="Build beyond the classroom"
              text="Take your technical skills into a fast-moving challenge where execution matters."
            />

            <Hook
              number="03"
              title="Create with your people"
              text="Find teammates, divide the problem, and make something none of you could build alone."
            />

            <Hook
              number="04"
              title="Leave with something real"
              text="A working prototype, a story to tell, and an experience worth putting on your journey."
            />

          </div>

        </section>


        {/* REGISTER CTA */}
        <section className="register-section" id="register">

          <p className="section-kicker">READY?</p>

          <h2>The arena awaits.</h2>

          <p>
            Gather your team. Pick your challenge.
            Make your move.
          </p>

          <a className="primary-btn" href="#home">
            Review Rules & Register →
          </a>

        </section>


        {/* FOOTER */}
        <footer>
          <span>XYNTRA</span>
          <span>IEEE COMPUTER SOCIETY</span>
          <span>© 2026</span>
        </footer>

      </main>
    </>
  )
}


function TimeCard({ value, label }) {
  return (
    <div className="timer-card">
      <strong>{String(value).padStart(2, '0')}</strong>
      <span>{label}</span>
    </div>
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