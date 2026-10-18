import { memo } from 'react'
import './AudioVisualizer.css'

// 26 equalizer frequency signal bars matching authentic tape-deck audio monitors
const SIGNAL_BARS = [
  { x: 12, h: 28, delay: '0.12s' },
  { x: 20, h: 22, delay: '0.34s' },
  { x: 28, h: 18, delay: '0.05s' },
  { x: 36, h: 26, delay: '0.52s' },
  { x: 44, h: 32, delay: '0.22s' },
  { x: 52, h: 24, delay: '0.41s' },
  { x: 60, h: 42, delay: '0.18s' },
  { x: 68, h: 35, delay: '0.63s' },
  { x: 76, h: 19, delay: '0.29s' },
  { x: 84, h: 48, delay: '0.08s' },
  { x: 92, h: 38, delay: '0.45s' },
  { x: 100, h: 56, delay: '0.15s' },
  { x: 108, h: 44, delay: '0.55s' },
  { x: 116, h: 36, delay: '0.32s' },
  { x: 124, h: 20, delay: '0.48s' },
  { x: 132, h: 52, delay: '0.02s' },
  { x: 140, h: 34, delay: '0.38s' },
  { x: 148, h: 46, delay: '0.21s' },
  { x: 156, h: 28, delay: '0.59s' },
  { x: 164, h: 24, delay: '0.14s' },
  { x: 172, h: 38, delay: '0.42s' },
  { x: 180, h: 44, delay: '0.25s' },
  { x: 188, h: 32, delay: '0.50s' },
  { x: 196, h: 48, delay: '0.11s' },
  { x: 204, h: 36, delay: '0.36s' },
  { x: 212, h: 24, delay: '0.19s' },
]

function AudioVisualizer() {
  return (
    <div className="tl-audio-visualizer" aria-hidden="true">
      {/* Telemetry Status Bar */}
      <div className="tl-audio-header">
        <span className="tl-audio-indicator">
          <span className="tl-audio-dot" />
          <span className="tl-audio-label">AUDIO MONITOR</span>
        </span>
        <span className="tl-audio-freq">44.1 kHz // CH-A·B</span>
      </div>

      <div className="tl-audio-display">
        {/* Radar & Celestial Blueprint Rings */}
        <svg
          className="tl-audio-radar-svg"
          viewBox="0 0 140 140"
          fill="none"
        >
          <circle cx="70" cy="70" r="62" stroke="rgba(109, 240, 255, 0.28)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="70" cy="70" r="44" stroke="rgba(109, 240, 255, 0.38)" strokeWidth="1" />
          <circle cx="70" cy="70" r="26" stroke="rgba(109, 240, 255, 0.48)" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="70" cy="70" r="8" fill="rgba(185, 242, 60, 0.5)" />
          {/* Crosshairs & Angle Lines */}
          <line x1="8" y1="70" x2="132" y2="70" stroke="rgba(109, 240, 255, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="70" y1="8" x2="70" y2="132" stroke="rgba(109, 240, 255, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="28" y1="28" x2="112" y2="112" stroke="rgba(109, 240, 255, 0.18)" strokeWidth="0.75" />
          <line x1="28" y1="112" x2="112" y2="28" stroke="rgba(109, 240, 255, 0.18)" strokeWidth="0.75" />
          {/* Rotating sweep line */}
          <line x1="70" y1="70" x2="70" y2="12" stroke="#b9f23c" strokeWidth="1.5" className="tl-radar-sweep" />
        </svg>

        {/* Equalizer Waveform Bars & dB Calibration Grid */}
        <div className="tl-audio-wave-container">
          <svg
            className="tl-audio-wave-svg"
            viewBox="0 0 224 80"
            preserveAspectRatio="none"
          >
            {/* Horizontal Grid & dB Ticks */}
            <line x1="0" y1="20" x2="224" y2="20" stroke="rgba(109, 240, 255, 0.14)" strokeWidth="0.75" strokeDasharray="2 4" />
            <line x1="0" y1="40" x2="224" y2="40" stroke="rgba(185, 242, 60, 0.35)" strokeWidth="1" />
            <line x1="0" y1="60" x2="224" y2="60" stroke="rgba(109, 240, 255, 0.14)" strokeWidth="0.75" strokeDasharray="2 4" />

            {/* Signal Equalizer Bars */}
            <g className="tl-signal-bars-group">
              {SIGNAL_BARS.map((bar, i) => (
                <line
                  key={i}
                  x1={bar.x}
                  y1={40 - bar.h * 0.5}
                  x2={bar.x}
                  y2={40 + bar.h * 0.5}
                  className="tl-audio-signal-bar"
                  style={{
                    animationDelay: bar.delay,
                    transformOrigin: `${bar.x}px 40px`,
                  }}
                />
              ))}
            </g>
          </svg>
          <div className="tl-audio-ticks">
            <span>-12dB</span>
            <span>0dB</span>
            <span>+6dB</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AudioVisualizer)
