import { useEffect, useRef, useState } from 'react'
import cassettesImg from '@/assets/images/cassettes.webp'
import Globe from './Globe.jsx'
import PixelHeading from './PixelHeading.jsx'
import './Timeline.css'

/**
 * High-fidelity coded XYNTRA timeline:
 * - Pure coded background with real halftone threshold filters and SVG turbulence grain
 * - Vector-traced copper magnetic tape running smoothly between the cassettes
 * - Crisp transparent cassettes cutout from cassettes.webp
 * - 3D rotating globe (preserved at authentic bottom-left corner)
 * - Animated audio signal waveform equalizer
 * - Enlarged typography with PixelHeading title "TIMELINE" and milestone markers
 */

const SIGNAL_BARS = [
  { x: 545, base: 130, h: 48, delay: '0.12s' },
  { x: 553, base: 130, h: 42, delay: '0.34s' },
  { x: 561, base: 130, h: 32, delay: '0.05s' },
  { x: 571, base: 130, h: 36, delay: '0.52s' },
  { x: 584, base: 130, h: 38, delay: '0.22s' },
  { x: 609, base: 130, h: 45, delay: '0.41s' },
  { x: 620, base: 130, h: 54, delay: '0.18s' },
  { x: 627, base: 130, h: 42, delay: '0.63s' },
  { x: 636, base: 130, h: 26, delay: '0.29s' },
  { x: 645, base: 130, h: 48, delay: '0.08s' },
  { x: 654, base: 130, h: 38, delay: '0.45s' },
  { x: 663, base: 130, h: 58, delay: '0.15s' },
  { x: 672, base: 130, h: 42, delay: '0.55s' },
  { x: 680, base: 130, h: 40, delay: '0.32s' },
  { x: 688, base: 130, h: 22, delay: '0.48s' },
  { x: 695, base: 130, h: 62, delay: '0.02s' },
  { x: 707, base: 130, h: 36, delay: '0.38s' },
  { x: 717, base: 130, h: 50, delay: '0.21s' },
  { x: 726, base: 130, h: 34, delay: '0.59s' },
  { x: 735, base: 130, h: 28, delay: '0.14s' },
  { x: 744, base: 130, h: 36, delay: '0.42s' },
  { x: 753, base: 130, h: 46, delay: '0.25s' },
  { x: 760, base: 130, h: 44, delay: '0.50s' },
  { x: 767, base: 130, h: 56, delay: '0.11s' },
  { x: 776, base: 130, h: 44, delay: '0.36s' },
  { x: 783, base: 130, h: 42, delay: '0.19s' },
]

export default function Timeline() {
  const containerRef = useRef(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)

    const handler = (e) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const animClass = prefersReducedMotion ? 'tl-no-motion' : 'tl-animated'

  return (
    <section className={`timeline-cassette-section ${animClass}`} ref={containerRef} id="timeline">
      {/* ── SVG Filter Definitions for Halftone Dots & Organic Grain ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves={3} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={9} />
          </filter>
          <filter id="ht-orange" x="0" y="0" width="100%" height="100%">
            <feColorMatrix values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0" result="l" />
            <feComponentTransfer in="l" result="t">
              <feFuncA type="linear" slope={14} intercept={-7.6} />
            </feComponentTransfer>
            <feFlood floodColor="#fc6831" />
            <feComposite in2="t" operator="in" />
          </filter>
          <filter id="ht-cream" x="0" y="0" width="100%" height="100%">
            <feColorMatrix values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0" result="l" />
            <feComponentTransfer in="l" result="t">
              <feFuncA type="linear" slope={14} intercept={-7.4} />
            </feComponentTransfer>
            <feFlood floodColor="#e8e2c4" />
            <feComposite in2="t" operator="in" />
          </filter>
          <filter id="n-fine" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves={4} seed={3} />
            <feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1" />
            <feComponentTransfer>
              <feFuncR type="linear" slope={2.2} intercept={-0.6} />
              <feFuncG type="linear" slope={2.2} intercept={-0.6} />
              <feFuncB type="linear" slope={2.2} intercept={-0.6} />
            </feComponentTransfer>
          </filter>
          <filter id="n-mottle" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".008 .014" numOctaves={4} seed={11} />
            <feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1" />
            <feComponentTransfer>
              <feFuncR type="linear" slope={2.6} intercept={-0.8} />
              <feFuncG type="linear" slope={2.6} intercept={-0.8} />
              <feFuncB type="linear" slope={2.6} intercept={-0.8} />
            </feComponentTransfer>
          </filter>
          <filter id="n-speck-w" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves={2} seed={21} />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 26 0 0 0 -18.6" />
          </filter>
          <filter id="n-speck-d" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves={2} seed={35} />
            <feColorMatrix values="0 0 0 0 .01 0 0 0 0 .1 0 0 0 0 .25 -26 0 0 0 8.2" />
          </filter>
          <filter id="n-merge-c" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves={2} seed={44} />
            <feColorMatrix values="0 0 0 0 .91 0 0 0 0 .89 0 0 0 0 .77 30 0 0 0 -17.5" />
          </filter>
          <filter id="n-merge-o" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves={2} seed={52} />
            <feColorMatrix values="0 0 0 0 .99 0 0 0 0 .41 0 0 0 0 .19 30 0 0 0 -17.5" />
          </filter>
        </defs>
      </svg>

      {/* ── Main Canvas Stage (Exact 1308 / 634 Aspect Ratio) ── */}
      <div className="tl-stage">
        {/* 1. Halftone Geometric Shapes */}
        <div className="tl-shapes" aria-hidden="true">
          <div className="tl-navy" />
          <div className="tl-cream-top tl-dots" />
          <div className="tl-orange tl-dots" />
          <div className="tl-cream-bottom tl-dots" />
        </div>

        {/* 2. Grain Layers */}
        <svg className="tl-grain tl-grain-mottle" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#n-mottle)" />
        </svg>
        <svg className="tl-grain tl-grain-fine" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#n-fine)" />
        </svg>
        <svg className="tl-grain tl-grain-speck-w" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#n-speck-w)" />
        </svg>
        <svg className="tl-grain tl-grain-speck-d" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#n-speck-d)" />
        </svg>
        <svg className="tl-grain tl-grain-merge" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#n-merge-o)" />
          <rect width="100%" height="100%" filter="url(#n-merge-c)" />
        </svg>

        {/* Main TIMELINE Title (Pixel Heading) placed up in the White Area */}
        <div className="tl-overlay-title-wrapper">
          <div className="tl-eyebrow-tag">
            <span>03</span>
            <span>TIMELINE / 2026</span>
          </div>
          <PixelHeading as="h2" className="tl-pixel-heading">
            TIMELINE
          </PixelHeading>
        </div>

        {/* 3D Rotating Globe (Anchored directly at the Corner Left of the section) */}
        <Globe />

        {/* ── Inner Responsive Composition Canvas (Exact 1308 / 634 Proportions, Perfectly Scaled to Screen) ── */}
        <div className="tl-canvas-inner">
          {/* 3. Pure Vector Copper Magnetic Tape */}
          <svg
          className="tl-tape-svg"
          viewBox="0 0 1308 634"
          preserveAspectRatio="none"
          role="img"
          aria-label="Copper magnetic tape running between the two cassettes"
        >
          <defs>
            <linearGradient id="tg0" gradientUnits="userSpaceOnUse" x1="339" y1="0" x2="1096" y2="0">
              <stop offset="0.000" stopColor="#180b0b" />
              <stop offset="0.005" stopColor="#1b0c0b" />
              <stop offset="0.011" stopColor="#22100d" />
              <stop offset="0.016" stopColor="#2b120f" />
              <stop offset="0.021" stopColor="#31140f" />
              <stop offset="0.026" stopColor="#351610" />
              <stop offset="0.032" stopColor="#3c1912" />
              <stop offset="0.037" stopColor="#441e15" />
              <stop offset="0.042" stopColor="#492014" />
              <stop offset="0.048" stopColor="#4d2114" />
              <stop offset="0.053" stopColor="#522414" />
              <stop offset="0.058" stopColor="#5f2c1c" />
              <stop offset="0.063" stopColor="#6c3621" />
              <stop offset="0.069" stopColor="#8b5033" />
              <stop offset="0.074" stopColor="#b67850" />
              <stop offset="0.079" stopColor="#dfa06e" />
              <stop offset="0.085" stopColor="#eeb07b" />
              <stop offset="0.090" stopColor="#da9c6b" />
              <stop offset="0.095" stopColor="#b47950" />
              <stop offset="0.100" stopColor="#8e5435" />
              <stop offset="0.106" stopColor="#743f28" />
              <stop offset="0.111" stopColor="#683622" />
              <stop offset="0.116" stopColor="#5c301f" />
              <stop offset="0.122" stopColor="#4d291a" />
              <stop offset="0.127" stopColor="#3e2416" />
              <stop offset="0.132" stopColor="#342212" />
              <stop offset="0.137" stopColor="#2f2411" />
              <stop offset="0.143" stopColor="#323314" />
              <stop offset="0.148" stopColor="#667144" />
              <stop offset="0.153" stopColor="#697445" />
              <stop offset="0.159" stopColor="#656842" />
              <stop offset="0.164" stopColor="#2e2712" />
              <stop offset="0.169" stopColor="#241c11" />
              <stop offset="0.174" stopColor="#1c1210" />
              <stop offset="0.180" stopColor="#1d0f10" />
              <stop offset="0.185" stopColor="#2b1513" />
              <stop offset="0.190" stopColor="#3a1c1a" />
              <stop offset="0.196" stopColor="#6c4b45" />
              <stop offset="0.201" stopColor="#73544e" />
              <stop offset="0.206" stopColor="#7d5c52" />
              <stop offset="0.211" stopColor="#59352d" />
              <stop offset="0.217" stopColor="#482420" />
              <stop offset="0.222" stopColor="#2e1415" />
              <stop offset="0.227" stopColor="#19090d" />
              <stop offset="0.232" stopColor="#140a0e" />
              <stop offset="0.238" stopColor="#170e11" />
              <stop offset="0.243" stopColor="#1f1418" />
              <stop offset="0.248" stopColor="#26181b" />
              <stop offset="0.254" stopColor="#29191d" />
              <stop offset="0.259" stopColor="#2a191c" />
              <stop offset="0.264" stopColor="#2e1b1c" />
              <stop offset="0.269" stopColor="#372020" />
              <stop offset="0.275" stopColor="#442726" />
              <stop offset="0.280" stopColor="#522f2c" />
              <stop offset="0.285" stopColor="#5e3632" />
              <stop offset="0.291" stopColor="#70453f" />
              <stop offset="0.296" stopColor="#916156" />
              <stop offset="0.301" stopColor="#af7b6c" />
              <stop offset="0.306" stopColor="#bb8573" />
              <stop offset="0.312" stopColor="#a67464" />
              <stop offset="0.317" stopColor="#885c4e" />
              <stop offset="0.322" stopColor="#6d473b" />
              <stop offset="0.328" stopColor="#633e32" />
              <stop offset="0.333" stopColor="#5d3a2d" />
              <stop offset="0.338" stopColor="#583926" />
              <stop offset="0.343" stopColor="#553b22" />
              <stop offset="0.349" stopColor="#533f20" />
              <stop offset="0.354" stopColor="#514422" />
              <stop offset="0.359" stopColor="#504b24" />
              <stop offset="0.365" stopColor="#4f4e22" />
              <stop offset="0.370" stopColor="#504e20" />
              <stop offset="0.375" stopColor="#4b451b" />
              <stop offset="0.380" stopColor="#443a19" />
              <stop offset="0.386" stopColor="#3b2e16" />
              <stop offset="0.391" stopColor="#362615" />
              <stop offset="0.396" stopColor="#332214" />
              <stop offset="0.402" stopColor="#322114" />
              <stop offset="0.407" stopColor="#322113" />
              <stop offset="0.412" stopColor="#332212" />
              <stop offset="0.417" stopColor="#362213" />
              <stop offset="0.423" stopColor="#382215" />
              <stop offset="0.428" stopColor="#402618" />
              <stop offset="0.433" stopColor="#482a1a" />
              <stop offset="0.439" stopColor="#4e2d1a" />
              <stop offset="0.444" stopColor="#583522" />
              <stop offset="0.449" stopColor="#67402d" />
              <stop offset="0.454" stopColor="#794d3c" />
              <stop offset="0.460" stopColor="#835444" />
              <stop offset="0.465" stopColor="#9f7063" />
              <stop offset="0.470" stopColor="#c09789" />
              <stop offset="0.476" stopColor="#cca99a" />
              <stop offset="0.481" stopColor="#ac887a" />
              <stop offset="0.486" stopColor="#7e574b" />
              <stop offset="0.491" stopColor="#653b31" />
              <stop offset="0.497" stopColor="#5e362c" />
              <stop offset="0.502" stopColor="#542f28" />
              <stop offset="0.507" stopColor="#3e211f" />
              <stop offset="0.513" stopColor="#271615" />
              <stop offset="0.518" stopColor="#190e0f" />
              <stop offset="0.523" stopColor="#1b0e10" />
              <stop offset="0.528" stopColor="#2b1616" />
              <stop offset="0.534" stopColor="#452522" />
              <stop offset="0.539" stopColor="#5d322a" />
              <stop offset="0.544" stopColor="#67382e" />
              <stop offset="0.550" stopColor="#6a3930" />
              <stop offset="0.555" stopColor="#7d4b40" />
              <stop offset="0.560" stopColor="#8a5749" />
              <stop offset="0.565" stopColor="#b58672" />
              <stop offset="0.571" stopColor="#ca9e89" />
              <stop offset="0.576" stopColor="#d3a490" />
              <stop offset="0.581" stopColor="#b67f6c" />
              <stop offset="0.587" stopColor="#925a46" />
              <stop offset="0.592" stopColor="#814e3a" />
              <stop offset="0.597" stopColor="#683e29" />
              <stop offset="0.602" stopColor="#593620" />
              <stop offset="0.608" stopColor="#4d3419" />
              <stop offset="0.613" stopColor="#4f3e1d" />
              <stop offset="0.618" stopColor="#504620" />
              <stop offset="0.624" stopColor="#504a22" />
              <stop offset="0.629" stopColor="#514c22" />
              <stop offset="0.634" stopColor="#524a20" />
              <stop offset="0.639" stopColor="#4d431c" />
              <stop offset="0.645" stopColor="#463819" />
              <stop offset="0.650" stopColor="#3a2b18" />
              <stop offset="0.655" stopColor="#2d1f14" />
              <stop offset="0.661" stopColor="#241711" />
              <stop offset="0.666" stopColor="#20140e" />
              <stop offset="0.671" stopColor="#21120d" />
              <stop offset="0.676" stopColor="#261411" />
              <stop offset="0.682" stopColor="#2c1814" />
              <stop offset="0.687" stopColor="#341d19" />
              <stop offset="0.692" stopColor="#38201b" />
              <stop offset="0.697" stopColor="#3c221d" />
              <stop offset="0.703" stopColor="#3d221d" />
              <stop offset="0.708" stopColor="#3d221c" />
              <stop offset="0.713" stopColor="#39201b" />
              <stop offset="0.719" stopColor="#351f1a" />
              <stop offset="0.724" stopColor="#2f1c18" />
              <stop offset="0.729" stopColor="#2b1c17" />
              <stop offset="0.734" stopColor="#2a1b16" />
              <stop offset="0.740" stopColor="#2b1b15" />
              <stop offset="0.745" stopColor="#2c1c14" />
              <stop offset="0.750" stopColor="#2c1c13" />
              <stop offset="0.756" stopColor="#2d1c12" />
              <stop offset="0.761" stopColor="#2e1c11" />
              <stop offset="0.766" stopColor="#2f1c12" />
              <stop offset="0.771" stopColor="#2f1c13" />
              <stop offset="0.777" stopColor="#301c14" />
              <stop offset="0.782" stopColor="#321d14" />
              <stop offset="0.787" stopColor="#341d14" />
              <stop offset="0.793" stopColor="#361e14" />
              <stop offset="0.798" stopColor="#392116" />
              <stop offset="0.803" stopColor="#3c2518" />
              <stop offset="0.808" stopColor="#432819" />
              <stop offset="0.814" stopColor="#4d2c1b" />
              <stop offset="0.819" stopColor="#5a3120" />
              <stop offset="0.824" stopColor="#653a27" />
              <stop offset="0.830" stopColor="#764931" />
              <stop offset="0.835" stopColor="#9f6e50" />
              <stop offset="0.840" stopColor="#c68f70" />
              <stop offset="0.845" stopColor="#d9a484" />
              <stop offset="0.851" stopColor="#c08a6f" />
              <stop offset="0.856" stopColor="#98664f" />
              <stop offset="0.861" stopColor="#774433" />
              <stop offset="0.867" stopColor="#653828" />
              <stop offset="0.872" stopColor="#5e3426" />
              <stop offset="0.877" stopColor="#5a3224" />
              <stop offset="0.882" stopColor="#572f22" />
              <stop offset="0.888" stopColor="#563022" />
              <stop offset="0.893" stopColor="#51301f" />
              <stop offset="0.898" stopColor="#4b311d" />
              <stop offset="0.904" stopColor="#47321a" />
              <stop offset="0.909" stopColor="#49371b" />
              <stop offset="0.914" stopColor="#66432d" />
              <stop offset="0.925" stopColor="#6a4630" />
              <stop offset="0.930" stopColor="#684131" />
              <stop offset="0.935" stopColor="#462f1f" />
              <stop offset="0.941" stopColor="#341e1a" />
              <stop offset="0.946" stopColor="#231215" />
              <stop offset="0.951" stopColor="#1a0c11" />
              <stop offset="0.956" stopColor="#1e0e11" />
              <stop offset="0.962" stopColor="#2c1715" />
              <stop offset="0.967" stopColor="#3c211b" />
              <stop offset="0.972" stopColor="#543530" />
              <stop offset="0.978" stopColor="#5a3e3f" />
              <stop offset="0.983" stopColor="#59424f" />
              <stop offset="0.988" stopColor="#544252" />
              <stop offset="0.993" stopColor="#604a5a" />
              <stop offset="0.999" stopColor="#725760" />
            </linearGradient>

            <path
              id="tp0"
              fillRule="evenodd"
              d="M338.0 238.0 C342.8 242.3 361.2 239.0 368.0 240.0 C374.8 241.0 367.8 242.0 379.0 244.0 C390.2 246.0 419.7 248.0 435.0 252.0 C450.3 256.0 463.7 264.0 471.0 268.0 C478.3 272.0 475.5 271.3 479.0 276.0 C482.5 280.7 488.7 289.0 492.0 296.0 C495.3 303.0 496.3 313.0 499.0 318.0 C501.7 323.0 504.7 324.3 508.0 326.0 C511.3 327.7 515.8 327.0 519.0 328.0 C522.2 329.0 522.7 331.0 527.0 332.0 C531.3 333.0 538.0 334.0 545.0 334.0 C552.0 334.0 557.3 334.5 569.0 332.0 C580.7 329.5 600.5 323.7 615.0 319.0 C629.5 314.3 643.2 306.7 656.0 304.0 C668.8 301.3 683.8 302.5 692.0 303.0 C700.2 303.5 698.7 304.0 705.0 307.0 C711.3 310.0 724.2 316.5 730.0 321.0 C735.8 325.5 737.3 329.7 740.0 334.0 C742.7 338.3 742.3 341.8 746.0 347.0 C749.7 352.2 756.2 360.2 762.0 365.0 C767.8 369.8 776.2 373.7 781.0 376.0 C785.8 378.3 783.2 378.2 791.0 379.0 C798.8 379.8 814.7 381.7 828.0 381.0 C841.3 380.3 855.3 378.0 871.0 375.0 C886.7 372.0 907.5 365.5 922.0 363.0 C936.5 360.5 946.2 360.3 958.0 360.0 C969.8 359.7 980.3 359.7 993.0 361.0 C1005.7 362.3 1025.2 365.7 1034.0 368.0 C1042.8 370.3 1041.7 373.2 1046.0 375.0 C1050.3 376.8 1056.7 377.3 1060.0 379.0 C1063.3 380.7 1063.7 381.3 1066.0 385.0 C1068.3 388.7 1072.7 396.5 1074.0 401.0 C1075.3 405.5 1075.0 408.7 1074.0 412.0 C1073.0 415.3 1074.0 418.3 1068.0 421.0 C1062.0 423.7 1043.0 423.2 1038.0 428.0 C1033.0 432.8 1037.7 446.0 1038.0 450.0 C1038.3 454.0 1038.3 451.8 1040.0 452.0 C1041.7 452.2 1038.7 453.5 1048.0 451.0 C1057.3 448.5 1088.2 442.7 1096.0 437.0 C1103.8 431.3 1094.7 421.3 1095.0 417.0 C1095.3 412.7 1097.5 416.7 1098.0 411.0 C1098.5 405.3 1098.3 388.3 1098.0 383.0 C1097.7 377.7 1098.8 380.0 1096.0 379.0 C1093.2 378.0 1088.2 381.5 1081.0 377.0 C1073.8 372.5 1059.2 356.8 1053.0 352.0 C1046.8 347.2 1047.0 350.0 1044.0 348.0 C1041.0 346.0 1039.0 341.3 1035.0 340.0 C1031.0 338.7 1027.0 340.8 1020.0 340.0 C1013.0 339.2 1001.8 335.8 993.0 335.0 C984.2 334.2 978.7 334.0 967.0 335.0 C955.3 336.0 939.5 337.8 923.0 341.0 C906.5 344.2 878.3 351.8 868.0 354.0 C857.7 356.2 863.8 353.3 861.0 354.0 C858.2 354.7 861.8 357.8 851.0 358.0 C840.2 358.2 808.8 356.8 796.0 355.0 C783.2 353.2 779.7 350.0 774.0 347.0 C768.3 344.0 767.2 342.8 762.0 337.0 C756.8 331.2 750.3 320.2 743.0 312.0 C735.7 303.8 725.8 293.3 718.0 288.0 C710.2 282.7 701.3 281.5 696.0 280.0 C690.7 278.5 691.7 279.0 686.0 279.0 C680.3 279.0 669.8 278.8 662.0 280.0 C654.2 281.2 645.3 284.8 639.0 286.0 C632.7 287.2 627.7 286.2 624.0 287.0 C620.3 287.8 619.5 290.3 617.0 291.0 C614.5 291.7 621.7 287.8 609.0 291.0 C596.3 294.2 556.0 306.8 541.0 310.0 C526.0 313.2 524.0 310.5 519.0 310.0 C514.0 309.5 514.3 309.5 511.0 307.0 C507.7 304.5 501.8 298.7 499.0 295.0 C496.2 291.3 495.0 289.0 494.0 285.0 C493.0 281.0 494.0 275.0 493.0 271.0 C492.0 267.0 494.3 268.3 488.0 261.0 C481.7 253.7 463.2 232.7 455.0 227.0 C446.8 221.3 445.7 228.2 439.0 227.0 C432.3 225.8 426.8 221.5 415.0 220.0 C403.2 218.5 380.7 219.0 368.0 218.0 C355.3 217.0 344.0 210.7 339.0 214.0 C334.0 217.3 333.2 233.7 338.0 238.0Z"
            />
            <path
              id="tpt"
              d="M900.0 347.0 C903.3 342.8 913.3 343.3 920.0 342.0 C926.7 340.7 932.5 340.0 940.0 339.0 C947.5 338.0 956.7 336.7 965.0 336.0 C973.3 335.3 982.5 335.2 990.0 335.0 C997.5 334.8 1003.3 334.3 1010.0 335.0 C1016.7 335.7 1023.7 337.2 1030.0 339.0 C1036.3 340.8 1042.7 342.8 1048.0 346.0 C1053.3 349.2 1057.8 353.5 1062.0 358.0 C1066.2 362.5 1070.2 367.7 1073.0 373.0 C1075.8 378.3 1077.7 384.2 1079.0 390.0 C1080.3 395.8 1080.8 402.3 1081.0 408.0 C1081.2 413.7 1080.7 419.3 1080.0 424.0 C1079.3 428.7 1079.3 433.7 1077.0 436.0 C1074.7 438.3 1067.0 440.3 1066.0 438.0 C1065.0 435.7 1069.8 427.5 1071.0 422.0 C1072.2 416.5 1073.5 410.5 1073.0 405.0 C1072.5 399.5 1070.8 393.8 1068.0 389.0 C1065.2 384.2 1060.7 379.5 1056.0 376.0 C1051.3 372.5 1046.3 370.2 1040.0 368.0 C1033.7 365.8 1026.3 364.2 1018.0 363.0 C1009.7 361.8 998.8 361.5 990.0 361.0 C981.2 360.5 973.3 360.0 965.0 360.0 C956.7 360.0 947.5 360.3 940.0 361.0 C932.5 361.7 926.7 363.0 920.0 364.0 C913.3 365.0 903.3 369.8 900.0 367.0 C896.7 364.2 896.7 351.2 900.0 347.0Z"
            />
            <path
              id="tpl"
              d="M946.0 476.0 C943.2 477.0 940.7 481.3 938.0 484.0 C935.3 486.7 932.7 489.0 930.0 492.0 C927.3 495.0 924.3 498.3 922.0 502.0 C919.7 505.7 917.5 510.0 916.0 514.0 C914.5 518.0 913.5 521.7 913.0 526.0 C912.5 530.3 912.7 535.3 913.0 540.0 C913.3 544.7 913.5 549.7 915.0 554.0 C916.5 558.3 919.2 562.7 922.0 566.0 C924.8 569.3 928.2 571.8 932.0 574.0 C935.8 576.2 940.3 577.8 945.0 579.0 C949.7 580.2 954.5 580.7 960.0 581.0 C965.5 581.3 975.0 585.8 978.0 581.0 C981.0 576.2 981.0 557.0 978.0 552.0 C975.0 547.0 965.5 551.2 960.0 551.0 C954.5 550.8 949.7 551.2 945.0 551.0 C940.3 550.8 935.2 550.8 932.0 550.0 C928.8 549.2 927.3 548.0 926.0 546.0 C924.7 544.0 924.0 541.0 924.0 538.0 C924.0 535.0 924.8 531.7 926.0 528.0 C927.2 524.3 929.0 519.7 931.0 516.0 C933.0 512.3 935.7 509.2 938.0 506.0 C940.3 502.8 942.7 500.0 945.0 497.0 C947.3 494.0 950.3 491.2 952.0 488.0 C953.7 484.8 956.0 480.0 955.0 478.0 C954.0 476.0 948.8 475.0 946.0 476.0Z"
            />

            <linearGradient id="tfg" gradientUnits="userSpaceOnUse" x1="900" y1="0" x2="932" y2="0">
              <stop offset="0" stopColor="#000" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>

            <mask id="tfade" maskUnits="userSpaceOnUse" x="0" y="0" width="1308" height="634">
              <rect width="1308" height="634" fill="url(#tfg)" />
              <rect x="932" width="376" height="634" fill="#fff" />
            </mask>

            <mask id="tfade2" maskUnits="userSpaceOnUse" x="0" y="0" width="1308" height="634">
              <rect width="1308" height="634" fill="#fff" />
            </mask>

            <clipPath id="tcut">
              <rect x="0" y="0" width="958" height="634" />
            </clipPath>

            <linearGradient id="tgl" gradientUnits="userSpaceOnUse" x1="913" y1="0" x2="980" y2="0">
              <stop offset="0" stopColor="#2b201c" />
              <stop offset=".3" stopColor="#3a2a24" />
              <stop offset=".6" stopColor="#4c352b" />
              <stop offset="1" stopColor="#6a4a3a" />
            </linearGradient>

            <linearGradient id="tgs" gradientUnits="userSpaceOnUse" x1="928" y1="0" x2="980" y2="0">
              <stop offset="0" stopColor="#b98260" stopOpacity="0" />
              <stop offset=".45" stopColor="#b98260" stopOpacity=".55" />
              <stop offset="1" stopColor="#8a5a40" stopOpacity=".2" />
            </linearGradient>

            <linearGradient id="tgd" gradientUnits="userSpaceOnUse" x1="1030" y1="0" x2="1082" y2="0">
              <stop offset="0" stopColor="#1a0d0b" stopOpacity="0" />
              <stop offset=".7" stopColor="#1a0d0b" stopOpacity=".6" />
              <stop offset="1" stopColor="#1a0d0b" stopOpacity=".8" />
            </linearGradient>

            <clipPath id="tclip">
              <g clipPath="url(#tcut)">
                <use href="#tp0" />
              </g>
              <use href="#tpt" />
              <use href="#tpl" />
            </clipPath>

            <filter id="tstreak" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".012 .55" numOctaves={3} seed={9} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 .85 0 0 0 0 .7 0 0 0 1.6 -.55" />
            </filter>

            <filter id="tdark" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".02 .4" numOctaves={3} seed={14} />
              <feColorMatrix values="0 0 0 0 .1 0 0 0 0 .05 0 0 0 0 .03 0 0 0 1.8 -.8" />
            </filter>

            <filter id="tshadow" x="-10%" y="-30%" width="120%" height="170%">
              <feGaussianBlur stdDeviation={7} />
            </filter>
          </defs>

          {/* Tape Shadows */}
          <g mask="url(#tfade2)">
            <use href="#tp0" transform="translate(0 20)" fill="#021b44" opacity=".5" filter="url(#tshadow)" />
          </g>
          <g mask="url(#tfade)">
            <use href="#tpt" transform="translate(0 20)" fill="#021b44" opacity=".5" filter="url(#tshadow)" />
          </g>
          <use href="#tpl" transform="translate(4 10)" fill="#7a2a08" opacity=".3" filter="url(#tshadow)" />

          {/* Tape Main Gradient Fills */}
          <g clipPath="url(#tcut)">
            <use href="#tp0" fill="url(#tg0)" />
          </g>
          <g mask="url(#tfade)">
            <use href="#tpt" fill="url(#tg0)" />
            <use href="#tpt" fill="url(#tgd)" />
          </g>
          <use href="#tpl" fill="url(#tgl)" />
          <use href="#tpl" fill="url(#tgs)" clipPath="url(#tclip)" />

          {/* Streak & Scratch Textures */}
          <g clipPath="url(#tclip)">
            <rect width="1308" height="634" filter="url(#tstreak)" style={{ mixBlendMode: 'soft-light' }} opacity=".28" />
            <rect width="1308" height="634" filter="url(#tdark)" opacity=".28" />
          </g>

          {/* Thin Dark Outlines */}
          <g clipPath="url(#tcut)">
            <use href="#tp0" fill="none" stroke="#1a0b08" strokeWidth={1.1} opacity=".55" />
          </g>
          <g mask="url(#tfade)">
            <use href="#tpt" fill="none" stroke="#1a0b08" strokeWidth={1.1} opacity=".55" />
          </g>
          <use href="#tpl" fill="none" stroke="#1a0b08" strokeWidth={1.1} opacity=".5" />

          {/* Metallic Top Edge Highlight */}
          <path
            d="M381 219 L385 219 L389 219 L393 219 L397 220 L401 220 L405 221 L409 221 L413 221 L417 221 L421 222 L425 223 L429 224 L433 225 L437 227 L441 228 L445 228 L449 228 L453 228 L457 228 L461 234 L465 238 L469 242 L473 246 L477 250 L481 253 L485 257 L489 261 L493 269 L497 287 L501 295 L505 300 L509 304 L513 308 L517 310 L521 311 L525 311 L529 311 L533 311 L537 311 L541 310 L545 309 L549 308 L553 307 L557 306 L561 305 L565 304 L569 303 L573 302 L577 301 L581 300 L585 299 L589 298 L593 297 L597 296 L601 294 L605 293 L609 292 L613 292 L617 291 L621 290 L625 288 L629 288 L633 287 L637 287 L641 286 L645 285 L649 284 L653 283 L657 282 L661 281 L665 281 L669 281 L673 281 L677 280 L681 280 L685 280 L689 281 L693 281 L697 281 L701 283 L705 284 L709 285 L713 286 L717 288 L721 290 L725 293 L729 296 L733 301 L737 306 L741 310 L745 313 L749 318 L753 322 L757 329 L761 335 L765 338 L769 342 L773 345 L777 348 L781 350 L785 351 L789 353 L793 354 L797 355 L801 356 L805 356 L809 356 L813 356 L817 356 L821 356 L825 357 L829 357 L833 358 L837 359 L841 359 L845 359 L849 359 L853 358 L857 356 L861 355 L865 355 L869 354 L873 353 L877 352 L881 351 L885 350 L889 350 L893 349 L897 348 L901 347 L905 346 L909 345 L913 345 L917 344 L921 343 L925 342 L929 341 L933 340 L937 340 L941 340 L945 338 C980 334 1010 335 1030 339 C1048 346 1062 358 1073 373"
            fill="none"
            stroke="#ffe4cc"
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity=".38"
          />
        </svg>

        {/* 4. Crisp Cutout Cassettes */}
        <img
          className="tl-cassettes-img"
          alt="Two XYNTRA cassette tapes joined by a copper tape ribbon"
          src={cassettesImg}
          draggable={false}
        />

        {/* 5. Audio Signal Waveform Equalizer */}
        <svg className="tl-signal-svg" viewBox="0 0 1308 634" preserveAspectRatio="none" aria-hidden="true">
          <g className="tl-signal-waveform-group">
            {SIGNAL_BARS.map((bar, i) => (
              <line
                key={i}
                x1={bar.x}
                y1={bar.base}
                x2={bar.x}
                y2={bar.base - bar.h}
                className="tl-signal-bar"
                style={{
                  animationDelay: bar.delay,
                  transformOrigin: `${bar.x}px ${bar.base}px`,
                }}
              />
            ))}
          </g>
        </svg>

        {/* 6. Subtle Star Glints */}
        <div className="tl-star tl-star-1" aria-hidden="true" />
        <div className="tl-star tl-star-2" aria-hidden="true" />
        <div className="tl-star tl-star-3" aria-hidden="true" />

        {/* 7. Checkpoint Markers (Vertical Stalks, Anchors & Neon Radar Target Rings) */}
        <svg
          className="tl-checkpoints-svg"
          viewBox="0 0 1308 634"
          preserveAspectRatio="none"
          role="img"
          aria-label="Timeline checkpoints along the copper magnetic tape"
        >
          {/* CHECKPOINT 1: IDEA */}
          <g className="tl-cp-marker tl-cp-1">
            {/* Luminous Anchor Pill on the Copper Tape */}
            <ellipse cx="455" cy="242" rx="14" ry="6" fill="#d2f25f" opacity="0.35" />
            <ellipse cx="455" cy="242" rx="8" ry="3.5" fill="#d2f25f" />

            {/* Glowing Vertical Stalk */}
            <line x1="455" y1="242" x2="455" y2="196" stroke="#d2f25f" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="455" y1="242" x2="455" y2="196" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

            {/* Hollow Doughnut Head (Matching reference timeline-cassette.jpg) */}
            <circle cx="455" cy="196" r="12" fill="#08214d" stroke="#d2f25f" strokeWidth="4.5" />
            <circle cx="455" cy="196" r="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
            <circle cx="455" cy="196" r="5.5" fill="#031024" />

            {/* Concentric Neon Radar Pulses */}
            <circle cx="455" cy="196" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.5">
              <animate attributeName="r" values="12;24;32" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="455" cy="196" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.2">
              <animate attributeName="r" values="12;24;32" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* CHECKPOINT 2: BUILD */}
          <g className="tl-cp-marker tl-cp-2">
            {/* Luminous Anchor Pill on the Copper Tape */}
            <ellipse cx="614" cy="290" rx="14" ry="6" fill="#d2f25f" opacity="0.35" />
            <ellipse cx="614" cy="290" rx="8" ry="3.5" fill="#d2f25f" />

            {/* Glowing Vertical Stalk */}
            <line x1="614" y1="290" x2="614" y2="236" stroke="#d2f25f" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="614" y1="290" x2="614" y2="236" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

            {/* Hollow Doughnut Head */}
            <circle cx="614" cy="236" r="12" fill="#08214d" stroke="#d2f25f" strokeWidth="4.5" />
            <circle cx="614" cy="236" r="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
            <circle cx="614" cy="236" r="5.5" fill="#031024" />

            {/* Concentric Neon Radar Pulses */}
            <circle cx="614" cy="236" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.5">
              <animate attributeName="r" values="12;24;32" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="614" cy="236" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.2">
              <animate attributeName="r" values="12;24;32" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* CHECKPOINT 3: SUBMIT */}
          <g className="tl-cp-marker tl-cp-3">
            {/* Luminous Anchor Pill on the Copper Tape */}
            <ellipse cx="814" cy="358" rx="14" ry="6" fill="#d2f25f" opacity="0.35" />
            <ellipse cx="814" cy="358" rx="8" ry="3.5" fill="#d2f25f" />

            {/* Glowing Vertical Stalk */}
            <line x1="814" y1="358" x2="814" y2="282" stroke="#d2f25f" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="814" y1="358" x2="814" y2="282" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

            {/* Hollow Doughnut Head */}
            <circle cx="814" cy="282" r="12" fill="#08214d" stroke="#d2f25f" strokeWidth="4.5" />
            <circle cx="814" cy="282" r="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
            <circle cx="814" cy="282" r="5.5" fill="#031024" />

            {/* Concentric Neon Radar Pulses */}
            <circle cx="814" cy="282" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.5">
              <animate attributeName="r" values="12;24;32" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="814" cy="282" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.2">
              <animate attributeName="r" values="12;24;32" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* CHECKPOINT 4: SHOWCASE */}
          <g className="tl-cp-marker tl-cp-4">
            {/* Luminous Anchor Pill on the Copper Tape */}
            <ellipse cx="1030" cy="344" rx="14" ry="6" fill="#d2f25f" opacity="0.35" />
            <ellipse cx="1030" cy="344" rx="8" ry="3.5" fill="#d2f25f" />

            {/* Glowing Vertical Stalk */}
            <line x1="1030" y1="344" x2="1030" y2="298" stroke="#d2f25f" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="1030" y1="344" x2="1030" y2="298" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

            {/* Hollow Doughnut Head */}
            <circle cx="1030" cy="298" r="12" fill="#08214d" stroke="#d2f25f" strokeWidth="4.5" />
            <circle cx="1030" cy="298" r="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
            <circle cx="1030" cy="298" r="5.5" fill="#031024" />

            {/* Concentric Neon Radar Pulses */}
            <circle cx="1030" cy="298" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.5">
              <animate attributeName="r" values="12;24;32" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="1030" cy="298" r="12" fill="none" stroke="#d2f25f" strokeWidth="1.2">
              <animate attributeName="r" values="12;24;32" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.35;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        {/* 8. Interactive Milestones positioned along the copper tape */}
        <div className="tl-milestones-container">
          <div className="tl-milestone-label tl-milestone-idea" style={{ left: '34.8%', top: '26.5%' }}>
            <span className="tl-label-text">IDEA</span>
          </div>

          <div className="tl-milestone-label tl-milestone-build" style={{ left: '46.9%', top: '32.8%' }}>
            <span className="tl-label-text">BUILD</span>
          </div>

          <div className="tl-milestone-label tl-milestone-submit" style={{ left: '62.2%', top: '40.0%' }}>
            <span className="tl-label-text">SUBMIT</span>
          </div>

          <div className="tl-milestone-label tl-milestone-showcase" style={{ left: '78.7%', top: '42.6%' }}>
            <span className="tl-label-text">SHOWCASE</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
