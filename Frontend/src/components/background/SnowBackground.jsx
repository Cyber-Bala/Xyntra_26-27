import React from 'react'
import PixelSnow from './PixelSnow.jsx'
import './SnowBackground.css'

export default function SnowBackground({ isWarping = false }) {
  return (
    <div className="snow-bg-wrapper" aria-hidden="true">
      <PixelSnow
        color="#ffffff"
        flakeSize={0.012}
        minFlakeSize={1.3}
        pixelResolution={200}
        speed={isWarping ? 4.0 : 1.25}
        depthFade={8}
        farPlane={20}
        brightness={1}
        gamma={0.4545}
        density={0.32}
        variant="snowflake"
        direction={125}
      />
      <div className="snow-vignette-overlay" />
      <div className="snow-ambient-glow" />
    </div>
  )
}
