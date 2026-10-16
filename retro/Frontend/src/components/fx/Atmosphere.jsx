import { useEffect, useRef, useState } from 'react'

const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Fixed CRT scanlines + vignette */
export function CrtOverlay() {
  return <div className="crt-overlay" aria-hidden="true" />
}

/* Drifting amber/cream embers + a pixel trail that follows the cursor */
export function Embers() {
  const ref = useRef(null)
  useEffect(() => {
    if (REDUCED()) return undefined
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf = 0, last = performance.now(), lastSpawn = { x: -99, y: -99 }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const COLORS = ['#f2a93b', '#f4e7c3', '#f2a93b', '#e8475f']
    const parts = []
    const rand = (a, b) => a + Math.random() * (b - a)
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ambient = () => ({ x: rand(0, w), y: rand(0, h), vx: rand(-.12, .12), vy: rand(-.5, -.14),
      s: Math.random() < .25 ? 3 : 2, c: COLORS[(Math.random() * COLORS.length) | 0], ph: rand(0, 6.28), life: Infinity, trail: false })
    resize()
    const count = w < 700 ? 26 : 60
    for (let i = 0; i < count; i++) parts.push(ambient())

    const onMove = (e) => {
      const dx = e.clientX - lastSpawn.x, dy = e.clientY - lastSpawn.y
      if (dx * dx + dy * dy < 400) return
      lastSpawn = { x: e.clientX, y: e.clientY }
      if (parts.length > count + 90) return
      parts.push({ x: e.clientX + rand(-4, 4), y: e.clientY + rand(-4, 4), vx: rand(-.3, .3), vy: rand(-1.1, -.3),
        s: 3, c: Math.random() < .7 ? '#f2a93b' : '#f4e7c3', ph: 0, life: 1, trail: true })
    }
    const tick = (now) => {
      const dt = Math.min((now - last) / 16.67, 3); last = now
      ctx.clearRect(0, 0, w, h)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += (p.vx + Math.sin(now / 1400 + p.ph) * .15) * dt
        p.y += p.vy * dt
        let a
        if (p.trail) { p.life -= .018 * dt; a = Math.max(p.life, 0); if (p.life <= 0) { parts.splice(i, 1); continue } }
        else { a = .25 + .45 * (Math.sin(now / 700 + p.ph) * .5 + .5); if (p.y < -8) { p.y = h + 8; p.x = rand(0, w) } }
        ctx.globalAlpha = a
        ctx.fillStyle = p.c
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove) }
  }, [])
  return <canvas ref={ref} className="embers-canvas" aria-hidden="true" />
}

/* Types text once, then leaves a blinking block cursor */
export function Typewriter({ text, delay = 900, speed = 70 }) {
  const [n, setN] = useState(() => (REDUCED() ? text.length : 0))
  useEffect(() => {
    if (REDUCED()) return undefined
    let i = 0, timer
    const start = setTimeout(function step() {
      i += 1; setN(i)
      if (i < text.length) timer = setTimeout(step, speed + Math.random() * 40)
    }, delay)
    return () => { clearTimeout(start); clearTimeout(timer) }
  }, [text, delay, speed])
  return <span aria-label={text}>{text.slice(0, n)}<span className="tw-cursor" aria-hidden="true" /></span>
}
