import { useState, useEffect, useRef } from 'react'
import './CrtTerminalScreen.css'

const TERMINAL_SEQUENCES = [
  {
    prefix: 'XYNTRA//OS v2.6.27',
    lines: [
      '> IDEAS',
      '> PEOPLE',
      '> PROTOTYPES',
      '> A BRIGHTER TOMORROW',
    ],
  },
  {
    prefix: 'SIGNAL_CH.01 // 44.1kHz',
    lines: [
      '> FREQUENCY ROUTE LOCKED',
      '> 24-HOUR NATIONAL FINALE',
      '> 06 TRACKS BROADCASTING',
      '> STATUS: ARENA ARMED',
    ],
  },
  {
    prefix: 'CYBERNETIC_DIAGNOSTICS',
    lines: [
      '> AUTONOMOUS AI ONLINE',
      '> ZERO-KNOWLEDGE ACTIVE',
      '> PHYSICAL LOGIC SYNCED',
      '> BUILD WHAT\'S NEXT_',
    ],
  },
]

export default function CrtTerminalScreen() {
  const [seqIndex, setSeqIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  const timerRef = useRef(null)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const currentSeq = TERMINAL_SEQUENCES[seqIndex]
    const currentLine = currentSeq.lines[lineIndex] || ''

    if (isHolding) {
      // Hold completed screen for 3.8s before moving to next sequence
      timerRef.current = setTimeout(() => {
        setIsHolding(false)
        setLineIndex(0)
        setCharIndex(0)
        setSeqIndex((prev) => (prev + 1) % TERMINAL_SEQUENCES.length)
      }, 3800)
      return () => clearTimeout(timerRef.current)
    }

    if (charIndex < currentLine.length) {
      // Natural typewriter cadence with subtle mechanical jitter
      const typingSpeed = 38 + Math.floor(Math.random() * 24)
      timerRef.current = setTimeout(() => {
        setCharIndex((prev) => prev + 1)
      }, typingSpeed)
      return () => clearTimeout(timerRef.current)
    }

    // Finished current line
    if (lineIndex < currentSeq.lines.length - 1) {
      // Short breath before starting next line
      timerRef.current = setTimeout(() => {
        setLineIndex((prev) => prev + 1)
        setCharIndex(0)
      }, 240)
      return () => clearTimeout(timerRef.current)
    }

    // All lines in sequence finished
    timerRef.current = setTimeout(() => {
      setIsHolding(true)
    }, 200)
    return () => clearTimeout(timerRef.current)
  }, [seqIndex, lineIndex, charIndex, isHolding, prefersReducedMotion])

  const currentSeq = TERMINAL_SEQUENCES[seqIndex]

  if (prefersReducedMotion) {
    return (
      <div className="xyntra-terminal-screen" aria-label="Terminal Screen">
        <div className="crt-terminal-header">
          <span className="crt-terminal-prefix">{currentSeq.prefix}</span>
          <span className="crt-terminal-status">● LIVE</span>
        </div>
        <div className="crt-terminal-lines">
          {currentSeq.lines.map((line, i) => (
            <p key={i} className="xyntra-terminal-line">
              {line}
            </p>
          ))}
        </div>
        <div className="xyntra-terminal-scanlines" aria-hidden="true" />
        <div className="xyntra-terminal-bloom" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="xyntra-terminal-screen" aria-label="Terminal Screen">
      <div className="crt-terminal-header">
        <span className="crt-terminal-prefix">{currentSeq.prefix}</span>
        <span className="crt-terminal-status">
          <span className="crt-status-dot" /> LIVE
        </span>
      </div>

      <div className="crt-terminal-lines">
        {currentSeq.lines.slice(0, lineIndex + 1).map((fullLine, i) => {
          const isCurrent = i === lineIndex
          const text = isCurrent ? fullLine.slice(0, charIndex) : fullLine
          return (
            <p key={i} className="xyntra-terminal-line">
              <span>{text}</span>
              {isCurrent && <span className="xyntra-terminal-cursor">_</span>}
            </p>
          )
        })}
      </div>

      {/* CRT Physical phosphor and scanline textures */}
      <div className="xyntra-terminal-scanlines" aria-hidden="true" />
      <div className="xyntra-terminal-bloom" aria-hidden="true" />
    </div>
  )
}
