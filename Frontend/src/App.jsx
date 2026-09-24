import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import './App.css'

const EVENT_DATE = new Date('2026-10-24T09:00:00+05:30').getTime()
const CHAPTERS = ['PROLOGUE 01', 'THE CLOCK 02', 'ABOUT 03', 'WHY 04', 'THE ARENA 05']

/* ============================================================
   GOLD LIGHT-STREAK TRANSITION (WebGL)
   A smoky dark veil closes over the screen while a diagonal gold
   beam sweeps across. The page jumps at the midpoint.
   ============================================================ */

const DURATION = 2400 // ms for one full transition (make bigger = slower)

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uT;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  vec2 dir = normalize(vec2(0.82, 0.58));
  float d = dot(p, dir);
  float span = 0.5 * aspect + 0.5;
  float pos = mix(-span - 0.3, span + 0.3, uT);

  float smoke = fbm(p * 2.2 + vec2(uTime * 0.15, 0.0));
  float v = smoothstep(0.08, 0.42, uT) * (1.0 - smoothstep(0.58, 0.92, uT));
  float veil = clamp(v * 1.4 * (0.8 + 0.4 * smoke), 0.0, 1.0);

  float dd = d - pos;
  float core = exp(-dd * dd * 90.0);
  float halo = exp(-dd * dd * 8.0);

  vec3 gold = vec3(1.0, 0.74, 0.36);
  vec3 bg   = vec3(0.02, 0.026, 0.036);

  vec3 rgb = bg * veil + gold * (core * 1.1 + halo * 0.28);
  float alpha = clamp(veil + core + halo * 0.28, 0.0, 1.0);

  gl_FragColor = vec4(rgb, alpha);
}
`

function compile(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

const SectionTransition = forwardRef(function SectionTransition(_, ref) {
  const canvasRef = useRef(null)
  const ctx = useRef(null)
  const busy = useRef(false)
  const raf = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    })
    if (!gl) {
      console.warn('WebGL not available, transition disabled')
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const loc = gl.getAttribLocation(program, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    ctx.current = {
      gl,
      uRes: gl.getUniformLocation(program, 'uRes'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uT: gl.getUniformLocation(program, 'uT'),
    }

    return () => {
      cancelAnimationFrame(raf.current)
      ctx.current = null
    }
  }, [])

  useImperativeHandle(ref, () => ({
    play(onCovered) {
      const g = ctx.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!g || reduced) {
        onCovered()
        return true
      }
      if (busy.current) return false
      busy.current = true

      const canvas = canvasRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.display = 'block'
      canvas.style.pointerEvents = 'auto'

      const { gl } = g
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(g.uRes, canvas.width, canvas.height)

      const start = performance.now()
      let fired = false

      const frame = (now) => {
        const t = now - start
        const u = Math.min(t / DURATION, 1)

        if (!fired && u >= 0.5) {
          fired = true
          onCovered()
        }

        gl.uniform1f(g.uTime, t / 1000)
        gl.uniform1f(g.uT, u)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        if (u < 1) {
          raf.current = requestAnimationFrame(frame)
        } else {
          canvas.style.display = 'none'
          canvas.style.pointerEvents = 'none'
          busy.current = false
        }
      }

      raf.current = requestAnimationFrame(frame)
      return true
    },
  }))

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        display: 'none',
        pointerEvents: 'none',
      }}
    />
  )
})


/* ============================================================
   APP
   ============================================================ */

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const transition = useRef(null)
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

  // SCROLL TRANSITION: when you reach the edge of a section and keep
  // scrolling, the WebGL wipe plays and jumps to the next/previous section
  useEffect(() => {
    let lockUntil = 0
    let touchY = 0

    function tryTransition(direction) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

      const list = Array.from(document.querySelectorAll('main > section'))
      const current = list.filter((s) => s.getBoundingClientRect().top <= 5).pop()
      if (!current) return false

      const i = list.indexOf(current)
      const next = list[i + direction]
      if (!next) return false

      const rect = current.getBoundingClientRect()
      if (direction > 0 && rect.bottom > window.innerHeight + 2) return false
      if (direction < 0 && rect.top < -2) return false

      const nr = next.getBoundingClientRect()
      let top = nr.top + window.scrollY
      if (direction < 0) {
        top = Math.max(top, nr.bottom + window.scrollY - window.innerHeight)
      }

      const started = transition.current?.play(() => {
        window.scrollTo({ top, left: 0, behavior: 'instant' })
      })
      if (started) lockUntil = performance.now() + DURATION + 400
      return true
    }

    function onWheel(e) {
      if (performance.now() < lockUntil) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 8) return
      if (tryTransition(e.deltaY > 0 ? 1 : -1)) e.preventDefault()
    }

    function onTouchStart(e) {
      touchY = e.touches[0].clientY
    }

    function onTouchMove(e) {
      if (performance.now() < lockUntil) {
        e.preventDefault()
        return
      }
      const dy = touchY - e.touches[0].clientY
      if (Math.abs(dy) < 40) return
      if (tryTransition(dy > 0 ? 1 : -1)) {
        e.preventDefault()
        touchY = e.touches[0].clientY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
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

  // Any <a href="#section"> inside the page plays the WebGL transition
  function handleLinkClick(e) {
    const link = e.target.closest('a[href^="#"]')
    if (!link) return

    const id = link.getAttribute('href').slice(1)
    const target = document.getElementById(id)
    if (!target) return

    e.preventDefault()

    transition.current?.play(() => {
      window.scrollTo({
        top:
          id === 'home'
            ? 0
            : target.getBoundingClientRect().top + window.scrollY,
        left: 0,
        behavior: 'instant',
      })
      history.replaceState(null, '', `#${id}`)
    })
  }

  return (
    <>
      <SectionTransition ref={transition} />


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