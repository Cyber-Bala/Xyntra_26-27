/**
 * RetroTechDeskIllustration
 * Authentic vector illustration of retro tech gadgets inspired by the 1980s computing workstation:
 * - Vintage CRT terminal with terminal green scanlines and blinking cursor
 * - Stack of hackathon manuals ("HACK", "LEARN", "BUILD", "REPEAT")
 * - 3.5" Floppy disk with label
 * - Audio cassette tape with tape reels
 * - Angled sticky note ("A New Generation Builds Again...")
 * - Mechanical keyboard with coiled cord
 */
export default function RetroTechDeskIllustration({ className = '' }) {
  return (
    <div className={`retro-tech-desk-scene ${className}`} aria-hidden="true">
      <svg
        className="retro-tech-desk-svg"
        viewBox="0 0 760 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* CRT Screen Glow */}
          <radialGradient id="screen-glow" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#3b2c14" />
            <stop offset="70%" stopColor="#1d160b" />
            <stop offset="100%" stopColor="#080705" />
          </radialGradient>

          {/* Beige Chassis Gradient */}
          <linearGradient id="chassis-beige" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dfcdb2" />
            <stop offset="50%" stopColor="#c3b095" />
            <stop offset="100%" stopColor="#8e7d65" />
          </linearGradient>

          {/* CRT Scanline Pattern */}
          <pattern id="desk-crt-lines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="#000" opacity="0.32" />
          </pattern>
        </defs>

        {/* ================= 1. STACK OF HACKATHON MANUALS ================= */}
        <g className="manuals-stack-group" transform="translate(140, 230)">
          {/* Book 1 (Bottom): REPEAT */}
          <g transform="translate(0, 75)">
            <rect x="0" y="0" width="130" height="26" rx="2" fill="#201b17" stroke="#e8475f" strokeWidth="1.8" />
            <rect x="4" y="3" width="14" height="20" fill="#e8475f" />
            <text x="32" y="17" fill="#f1dfc0" fontFamily="'Silkscreen', monospace" fontSize="10" fontWeight="700">REPEAT</text>
          </g>

          {/* Book 2: BUILD */}
          <g transform="translate(4, 50)">
            <rect x="0" y="0" width="126" height="26" rx="2" fill="#1f1c16" stroke="#eab04a" strokeWidth="1.8" />
            <rect x="4" y="3" width="14" height="20" fill="#eab04a" />
            <text x="32" y="17" fill="#f1dfc0" fontFamily="'Silkscreen', monospace" fontSize="10" fontWeight="700">BUILD</text>
          </g>

          {/* Book 3: LEARN */}
          <g transform="translate(2, 25)">
            <rect x="0" y="0" width="128" height="26" rx="2" fill="#1f1c16" stroke="#eab04a" strokeWidth="1.8" />
            <rect x="4" y="3" width="14" height="20" fill="#eab04a" />
            <text x="32" y="17" fill="#f1dfc0" fontFamily="'Silkscreen', monospace" fontSize="10" fontWeight="700">LEARN</text>
          </g>

          {/* Book 4 (Top): HACK */}
          <g transform="translate(8, 0)">
            <rect x="0" y="0" width="120" height="26" rx="2" fill="#1f1c16" stroke="#eab04a" strokeWidth="1.8" />
            <rect x="4" y="3" width="14" height="20" fill="#eab04a" />
            <text x="32" y="17" fill="#f1dfc0" fontFamily="'Silkscreen', monospace" fontSize="10" fontWeight="700">HACK</text>
          </g>
        </g>

        {/* ================= 3. VINTAGE CRT COMPUTER TERMINAL ================= */}
        <g className="crt-terminal-group" transform="translate(270, 75)">
          {/* Shadow */}
          <ellipse cx="160" cy="300" rx="170" ry="24" fill="#000" opacity="0.65" />

          {/* Monitor Outer Chassis */}
          <rect x="15" y="0" width="280" height="240" rx="14" fill="url(#chassis-beige)" stroke="#453828" strokeWidth="3" />
          {/* Bevel highlights */}
          <path d="M18 10 H290 V230 H285 V15 H18 Z" fill="#fff" opacity="0.15" />

          {/* Ventilation grilles on top/side */}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`vent-${i}`}
              x1={245 + i * 6}
              y1="12"
              x2={245 + i * 6}
              y2="28"
              stroke="#584835"
              strokeWidth="2"
            />
          ))}

          {/* Inner Screen Bezel */}
          <rect x="35" y="24" width="238" height="190" rx="10" fill="#1b1713" stroke="#685741" strokeWidth="2.5" />

          {/* Glass CRT Screen */}
          <rect x="44" y="32" width="220" height="174" rx="8" fill="url(#screen-glow)" stroke="#87672e" strokeWidth="2" />
          {/* Scanline overlay */}
          <rect x="44" y="32" width="220" height="174" rx="8" fill="url(#desk-crt-lines)" pointerEvents="none" />

          {/* Glass glare arc reflection */}
          <path
            d="M50 40 Q154 36 258 40 Q250 85 240 105 Q150 95 62 105 Z"
            fill="#fff"
            opacity="0.06"
          />

          {/* Green Phosphor Terminal Content */}
          <g className="terminal-text-content" fontFamily="'Silkscreen', monospace" fontSize="10" fill="#eab04a">
            <text x="56" y="58">&gt; REWARDS: UNLOCKED</text>
            <text x="56" y="78">&gt; TOTAL: ₹1,00,000</text>
            <text x="56" y="98">&gt; BUILDERS ASSEMBLE</text>
            <text x="56" y="118">&gt; DREAM · BUILD · DISRUPT</text>
            <text x="56" y="148" fill="#ffd87a">C:\XYNTRA&gt;</text>
            {/* Blinking Prompt Block */}
            <rect x="144" y="137" width="9" height="12" fill="#ffd87a" className="terminal-cursor-block" />
          </g>

          {/* Monitor Power Knob & Badge */}
          <rect x="250" y="222" width="24" height="8" rx="2" fill="#1b1612" stroke="#6a5843" strokeWidth="1" />
          <circle cx="50" cy="226" r="3" fill="#eab04a" className="monitor-led" />
          <text x="60" y="229" fill="#786650" fontFamily="'Silkscreen', monospace" fontSize="6">XYNTRA-80</text>

          {/* Monitor Stand */}
          <path d="M110 240 L195 240 L215 272 L90 272 Z" fill="#938167" stroke="#4a3c2b" strokeWidth="2" />
          <rect x="75" y="270" width="155" height="12" rx="3" fill="#b9a68a" stroke="#4a3c2b" strokeWidth="2" />

          {/* Detached Mechanical Keyboard */}
          <g transform="translate(25, 282)">
            <path d="M0 16 L25 0 L235 0 L258 16 L250 48 L8 48 Z" fill="#cfbe9e" stroke="#4b3e2d" strokeWidth="2" />
            <path d="M6 16 L23 3 L233 3 L248 16 Z" fill="#e5d8be" />
            {/* Keyboard Keys Rows */}
            {Array.from({ length: 3 }, (_, row) => (
              <g key={`krow-${row}`}>
                {Array.from({ length: 14 }, (_, col) => (
                  <rect
                    key={`k-${row}-${col}`}
                    x={20 + col * 15 + row * 3}
                    y={12 + row * 10}
                    width="11"
                    height="8"
                    rx="1"
                    fill="#433728"
                    stroke="#8c785e"
                    strokeWidth="0.8"
                  />
                ))}
              </g>
            ))}
            {/* Spacebar */}
            <rect x="75" y="42" width="105" height="4" rx="1" fill="#2d2419" />
          </g>
        </g>

        {/* ================= 4. FLOPPY DISKS ================= */}
        <g className="floppy-disks-group" transform="translate(565, 235)">
          {/* Leaning Back 5.25" Floppy Sleeve */}
          <rect x="-10" y="0" width="70" height="92" rx="3" transform="rotate(-8)" fill="#1c1917" stroke="#c7b299" strokeWidth="2" />
          <circle cx="22" cy="46" r="14" fill="#0d0b0a" stroke="#4a3f36" strokeWidth="1.5" />

          {/* Front 3.5" Floppy Disk */}
          <g transform="translate(25, 10)">
            <rect x="0" y="0" width="76" height="82" rx="4" fill="#17100a" stroke="#f2a93b" strokeWidth="2" />
            {/* Metal Shutter Slider */}
            <rect x="18" y="0" width="40" height="34" rx="2" fill="#f4e7c3" stroke="#f2a93b" strokeWidth="1" />
            <rect x="42" y="8" width="8" height="18" rx="1" fill="#17100a" />
            {/* White/Cream Paper Label */}
            <rect x="8" y="40" width="60" height="36" rx="2" fill="#f4e7c3" />
            <line x1="12" y1="46" x2="64" y2="46" stroke="#e8475f" strokeWidth="1.5" />
            <text x="14" y="58" fill="#0c0906" fontFamily="'Silkscreen', monospace" fontSize="7" fontWeight="700">XYNTRA.EXE</text>
            <text x="14" y="69" fill="#7d6c52" fontFamily="'Space Grotesk', monospace" fontSize="6">BOOT · V26</text>
          </g>
        </g>

        {/* ================= 5. VINTAGE AUDIO CASSETTE TAPE ================= */}
        <g className="cassette-tape-group" transform="translate(630, 310)">
          {/* Cassette Shell */}
          <rect x="0" y="0" width="105" height="66" rx="6" fill="#17100a" stroke="#e8475f" strokeWidth="2.2" />
          {/* Tape Label Area */}
          <rect x="8" y="8" width="89" height="42" rx="3" fill="#f4e7c3" />
          {/* Decorative colored stripe on label */}
          <rect x="8" y="10" width="89" height="7" fill="#e8475f" />
          <rect x="8" y="17" width="89" height="3" fill="#f2a93b" />
          <text x="24" y="27" fill="#181316" fontFamily="'Silkscreen', monospace" fontSize="7" fontWeight="700">XYNTRA 26</text>

          {/* Central Tape Window & Spools */}
          <rect x="22" y="31" width="61" height="17" rx="2" fill="#181416" stroke="#9e8e7a" strokeWidth="1" />
          {/* Left Spool */}
          <circle cx="36" cy="39" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
          <circle cx="36" cy="39" r="2.5" fill="#181416" />
          {/* Right Spool */}
          <circle cx="69" cy="39" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
          <circle cx="69" cy="39" r="2.5" fill="#181416" />
          {/* Brown magnetic tape */}
          <path d="M42 39 H63" stroke="#794f31" strokeWidth="4" />
        </g>

        {/* ================= 6. YELLOW STICKY NOTE ================= */}
        <g className="sticky-note-group" transform="translate(710, 220) rotate(7)">
          {/* Note Paper */}
          <rect x="0" y="0" width="48" height="58" rx="1" fill="#f6e18f" stroke="#caa742" strokeWidth="1" />
          {/* Tape on top */}
          <rect x="14" y="-5" width="20" height="10" fill="#fff" opacity="0.5" />
          {/* Handwritten text lines */}
          <text x="6" y="16" fill="#4d3e18" fontFamily="'Playfair Display', cursive, serif" fontSize="7" fontStyle="italic">A New</text>
          <text x="6" y="27" fill="#4d3e18" fontFamily="'Playfair Display', cursive, serif" fontSize="7" fontStyle="italic">Generation</text>
          <text x="6" y="38" fill="#4d3e18" fontFamily="'Playfair Display', cursive, serif" fontSize="7" fontStyle="italic">Builds</text>
          <text x="6" y="49" fill="#4d3e18" fontFamily="'Playfair Display', cursive, serif" fontSize="7" fontStyle="italic">Again...</text>
        </g>
      </svg>
    </div>
  )
}
