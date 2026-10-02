import { useEffect, useState } from "react";
import "./App.css";

const EVENT_DATE = new Date("2026-10-24T09:00:00+05:30").getTime();

const CHAPTERS = [
  "PROLOGUE 01",
  "THE CLOCK 02",
  "ABOUT 03",
  "WHY 04",
  "THE ARENA 05",
];

/* ============================================================
   APP
============================================================ */

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [introKey] = useState(0);
  const [chapter, setChapter] = useState(0);

  function getTimeLeft() {
    const difference = EVENT_DATE - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  /* ============================================================
     COUNTDOWN
  ============================================================ */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ============================================================
     CHAPTER LABEL
     Tracks which section is in view, for the navbar chip.
  ============================================================ */

  useEffect(() => {
    const update = () => {
      const list = Array.from(document.querySelectorAll("main > section"));

      const idx =
        list.filter(
          (s) => s.getBoundingClientRect().top <= window.innerHeight * 0.5
        ).length - 1;

      setChapter(Math.max(0, idx));
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* ============================================================
     INTERNAL LINKS — plain smooth scroll, no transition
  ============================================================ */

  function handleLinkClick(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top:
        id === "home"
          ? 0
          : target.getBoundingClientRect().top + window.scrollY,
      left: 0,
      behavior: "smooth",
    });

    history.replaceState(null, "", `#${id}`);
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <div className="hud">
        <span className="hud-scroll">↓</span>
      </div>

      <main onClick={handleLinkClick}>
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

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="hero" id="home" key={introKey}>
          <span className="hero-streak" />

          <div className="hero-content">
            <p className="hero-kicker">
              THE FUTURE IS BUILT FROM WHAT WE UNSEAT
            </p>

            <h1>XYNTRA</h1>

            <p className="hero-sub">
              HACKATHON 2026 <span>·</span> A NEW ERA IN MOTION
            </p>

            <p className="hero-hook">Dream. Build. Disrupt.</p>

            <p className="hero-description">
              Step into the arena where bold ideas meet code, creativity
              meets execution, and builders turn problems into
              possibilities.
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

        {/* ======================================================
            COUNTDOWN
        ====================================================== */}

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

        {/* ======================================================
            ABOUT
        ====================================================== */}

        <section className="about-section" id="about">
          <div className="section-heading">
            <p className="section-kicker">02 / ABOUT</p>
            <h2>About Xyntra</h2>
          </div>

          <div className="about-grid">
            <div className="about-copy">
              <p>
                Xyntra is a high-energy hackathon built for students who
                want to take an idea beyond the whiteboard and into the
                real world.
              </p>

              <p>
                Bring your team, choose your challenge, build your
                solution, and experience the intensity of creating
                something from scratch.
              </p>
            </div>

            <div className="about-points">
              <div>
                <span>01</span>
                Build with purpose.
              </div>
              <div>
                <span>02</span>
                Solve real problems.
              </div>
              <div>
                <span>03</span>
                Present what you create.
              </div>
              <div>
                <span>04</span>
                Learn with your team.
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            WHY PARTICIPATE
        ====================================================== */}

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

        {/* ======================================================
            REGISTER
        ====================================================== */}

        <section className="register-section" id="register">
          <p className="section-kicker">READY?</p>
          <h2>The arena awaits.</h2>
          <p>Gather your team. Pick your challenge. Make your move.</p>

          <a className="primary-btn" href="#home">
            Review Rules &amp; Register <span>→</span>
          </a>
        </section>
      </main>
    </>
  );
}

/* ============================================================
   TIME CARD
============================================================ */

function TimeCard({ value, label }) {
  return (
    <div className="timer-card">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

/* ============================================================
   HOOK CARD
============================================================ */

function Hook({ number, title, text }) {
  return (
    <article className="hook-card">
      <span className="hook-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default App;
