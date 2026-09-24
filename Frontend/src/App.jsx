import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";
import LastPage from "./components/LastPage";

import SectionTransition, {
  TRANSITION_TOTAL,
  arrive,
} from "./components/SectionTransition";

const EVENT_DATE = new Date("2026-10-24T09:00:00+05:30").getTime();

const CHAPTERS = [
  "PROLOGUE 01",
  "THE CLOCK 02",
  "ABOUT 03",
  "WHY 04",
  "THE ARENA 05",
];

function chapterMeta(index) {
  const label = CHAPTERS[index] ?? "";

  const m = label.match(
    /^(.*\S)\s+(\d+)$/
  );

  return m
    ? {
        name: m[1],
        no: m[2],
      }
    : {
        name: label,
        no: "",
      };
}


/* ============================================================
   APP
============================================================ */

function App() {
  const [timeLeft, setTimeLeft] =
    useState(getTimeLeft());

  const transition = useRef(null);

  const [introKey] = useState(0);

  const [chapter, setChapter] =
    useState(0);

  /*
    LastPage is NOT rendered until NEXT is pressed.
  */
  const [showLastPage, setShowLastPage] =
    useState(false);

  function getTimeLeft() {
    const difference =
      EVENT_DATE - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      ),

      minutes: Math.floor(
        (difference /
          (1000 * 60)) %
          60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  }

  /* ============================================================
     COUNTDOWN
  ============================================================ */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* ============================================================
     NEXT PAGE
     This function MUST be inside App(),
     NOT inside another useEffect.
  ============================================================ */

 function openLastPage() {
  if (showLastPage) return;

  const reveal = () => {
    setShowLastPage(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el =
          document.getElementById(
            "last-page"
          );

        if (el) {
          window.scrollTo({
            top:
              el.getBoundingClientRect().top +
              window.scrollY,
            left: 0,
            behavior: "instant",
          });
        }
      });
    });
  };

  const t = transition.current;

  if (t) {
    t.play(reveal, {
      no: "06",
      name: "FINALE",
      dir: 1,
    });
  } else {
    reveal();
  }
}
  /* ============================================================
     FRIEND'S SECTION SCROLL TRANSITION
  ============================================================ */

  useEffect(() => {
    let lockUntil = 0;
    let touchY = 0;

    function tryTransition(direction) {
      if (
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {
        return false;
      }

      /*
        IMPORTANT:
        Only friend's main sections participate
        in this transition system.
      */
      const list = Array.from(
        document.querySelectorAll(
          "main > section"
        )
      );

      const current =
        list
          .filter(
            (s) =>
              s.getBoundingClientRect().top <=
              5
          )
          .pop();

      if (!current) return false;

      const i = list.indexOf(current);

      const next =
        list[i + direction];

      if (!next) return false;

      const rect =
        current.getBoundingClientRect();

      if (
        direction > 0 &&
        rect.bottom >
          window.innerHeight + 2
      ) {
        return false;
      }

      if (
        direction < 0 &&
        rect.top < -2
      ) {
        return false;
      }

      const nr =
        next.getBoundingClientRect();

      let top =
        nr.top +
        window.scrollY;

      if (direction < 0) {
        top = Math.max(
          top,
          nr.bottom +
            window.scrollY -
            window.innerHeight
        );
      }

      const started =
  transition.current?.play(
    () => {
      window.scrollTo({
        top,
        left: 0,
        behavior: "instant",
      });

      arrive(
        next,
        direction
      );
    },
    {
      ...chapterMeta(
        i + direction
      ),
      dir: direction,
    }
  );

if (started) {
  lockUntil =
    performance.now() +
    TRANSITION_TOTAL +
    300;
}

      return true;
    }

    function onWheel(e) {
      if (
        performance.now() <
        lockUntil
      ) {
        e.preventDefault();
        return;
      }

      if (
        Math.abs(e.deltaY) < 8
      ) {
        return;
      }

      if (
        tryTransition(
          e.deltaY > 0
            ? 1
            : -1
        )
      ) {
        e.preventDefault();
      }
    }

    function onTouchStart(e) {
      touchY =
        e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (
        performance.now() <
        lockUntil
      ) {
        e.preventDefault();
        return;
      }

      const dy =
        touchY -
        e.touches[0].clientY;

      if (Math.abs(dy) < 40) {
        return;
      }

      if (
        tryTransition(
          dy > 0
            ? 1
            : -1
        )
      ) {
        e.preventDefault();

        touchY =
          e.touches[0].clientY;
      }
    }

    window.addEventListener(
      "wheel",
      onWheel,
      { passive: false }
    );

    window.addEventListener(
      "touchstart",
      onTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      onTouchMove,
      { passive: false }
    );

    return () => {
      window.removeEventListener(
        "wheel",
        onWheel
      );

      window.removeEventListener(
        "touchstart",
        onTouchStart
      );

      window.removeEventListener(
        "touchmove",
        onTouchMove
      );
    };
  }, []);

  /* ============================================================
     CHAPTER LABEL
  ============================================================ */

  useEffect(() => {
    const update = () => {
      const list = Array.from(
        document.querySelectorAll(
          "main > section"
        )
      );

      const idx =
        list.filter(
          (s) =>
            s.getBoundingClientRect().top <=
            window.innerHeight * 0.5
        ).length - 1;

      setChapter(
        Math.max(0, idx)
      );
    };

    update();

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        update
      );
  }, []);

  /* ============================================================
     INTERNAL LINKS
  ============================================================ */
function handleLinkClick(e) {
  const link =
    e.target.closest(
      'a[href^="#"]'
    );

  if (!link) return;

  const id =
    link
      .getAttribute("href")
      .slice(1);

  const target =
    document.getElementById(id);

  if (!target) return;

  e.preventDefault();

  const sections =
    Array.from(
      document.querySelectorAll(
        "main > section"
      )
    );

  const idx =
    sections.indexOf(target);

  const dir =
    idx >= chapter
      ? 1
      : -1;

  transition.current?.play(
    () => {
      window.scrollTo({
        top:
          id === "home"
            ? 0
            : target.getBoundingClientRect()
                .top +
              window.scrollY,

        left: 0,

        behavior: "instant",
      });

      history.replaceState(
        null,
        "",
        `#${id}`
      );

      arrive(
        target,
        dir
      );
    },
    {
      ...chapterMeta(
        Math.max(idx, 0)
      ),
      dir,
    }
  );
}
  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <SectionTransition
        ref={transition}
      />

      <div className="hud">
        <span className="hud-scroll">
          Γåô
        </span>
      </div>

      {/* ========================================================
          FRIEND'S WEBSITE
      ======================================================== */}

      <main
        onClick={handleLinkClick}
      >
        {/* NAVBAR */}

        <nav className="navbar">
          <div className="brand">
            <i className="dot" />

            <span>
              XYNTRA
            </span>
          </div>

          <div className="nav-right">
            <span className="nav-tag">
              HACKATHON 2026 <b />{" "}
              {CHAPTERS[chapter]}
            </span>

            <div className="nav-links">
              <a href="#about">
                About
              </a>

              <a href="#why">
                Why Participate
              </a>

              <a href="#register">
                Register
              </a>
            </div>
          </div>
        </nav>

        {/* ======================================================
            HERO
        ====================================================== */}

        <section
          className="hero"
          id="home"
          key={introKey}
        >
          <span className="hero-streak" />

          <div className="hero-content">
            <p className="hero-kicker">
              THE FUTURE IS BUILT FROM WHAT WE UNSEAT
            </p>

            <h1>
              XYNTRA
            </h1>

            <p className="hero-sub">
              HACKATHON 2026{" "}
              <span>┬╖</span>{" "}
              A NEW ERA IN MOTION
            </p>

            <p className="hero-hook">
              Dream. Build. Disrupt.
            </p>

            <p className="hero-description">
              Step into the arena where bold ideas
              meet code, creativity meets execution,
              and builders turn problems into possibilities.
            </p>

            <div className="event-meta">
              <span>24 HOURS</span>
              <span>ΓÇó</span>
              <span>HACKATHON</span>
              <span>ΓÇó</span>
              <span>CHENNAI</span>
            </div>

            <a
              className="primary-btn"
              href="#register"
            >
              Enter the Arena{" "}
              <span>ΓåÆ</span>
            </a>
          </div>
        </section>

        {/* ======================================================
            COUNTDOWN
        ====================================================== */}

        <section className="countdown-section">
          <p className="section-kicker">
            THE CLOCK IS TICKING
          </p>

          <h2>
            Hacking Begins In
          </h2>

          <div className="countdown-grid">
            <TimeCard
              value={timeLeft.days}
              label="Days"
            />

            <TimeCard
              value={timeLeft.hours}
              label="Hours"
            />

            <TimeCard
              value={timeLeft.minutes}
              label="Mins"
            />

            <TimeCard
              value={timeLeft.seconds}
              label="Secs"
            />
          </div>
        </section>

        {/* ======================================================
            ABOUT
        ====================================================== */}

        <section
          className="about-section"
          id="about"
        >
          <div className="section-heading">
            <p className="section-kicker">
              02 / ABOUT
            </p>

            <h2>
              About Xyntra
            </h2>
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

        <section
          className="why-section"
          id="why"
        >
          <div className="section-heading">
            <p className="section-kicker">
              03 / WHY PARTICIPATE
            </p>

            <h2>
              Don't just watch. Build.
            </h2>
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

        <section
          className="register-section"
          id="register"
        >
          <p className="section-kicker">
            READY?
          </p>

          <h2>
            The arena awaits.
          </h2>

          <p>
            Gather your team. Pick your challenge.
            Make your move.
          </p>

          <a
            className="primary-btn"
            href="#home"
          >
            Review Rules & Register ΓåÆ
          </a>

          {/* ==================================================
              NEXT BUTTON
              Bottom-right of friend's final section
          ================================================== */}

          <button
            type="button"
            className="next-page-btn"
            onClick={openLastPage}
          >
            Next <span>→</span>
          </button>
        </section>
      </main>

      {/* ========================================================
          YOUR PAGE
          Not rendered until NEXT is pressed.
      ======================================================== */}

      {showLastPage && (
        <LastPage />
      )}
    </>
  );
}

/* ============================================================
   TIME CARD
============================================================ */

function TimeCard({ value, label }) {
  return (
    <div className="timer-card">
      <strong>
        {String(value).padStart(2, "0")}
      </strong>

      <span>
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   HOOK CARD
============================================================ */

function Hook({
  number,
  title,
  text,
}) {
  return (
    <article className="hook-card">
      <span className="hook-number">
        {number}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </article>
  );
}

export default App;