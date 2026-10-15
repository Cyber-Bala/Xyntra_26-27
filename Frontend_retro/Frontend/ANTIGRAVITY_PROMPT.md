# Paste this into Antigravity (Agent Manager, workspace = your Frontend folder)

You are working in my existing React 19 + Vite project (XYNTRA 26 hackathon site). I have a finished, tested upgrade
in this folder. Apply it exactly, do not redesign or rewrite anything else.

## 1. New files (already in the folder, do not delete)
- src/styles/retro.css                      palette tokens (cream / amber / coral / warm black), CRT overlay, hero grid floor
- src/components/fx/ParticleHeadings.jsx    cursor-disintegration + assemble-from-dust on every h1/h2 >= 30px
- src/components/fx/Atmosphere.jsx          CrtOverlay, Embers (ambient + cursor trail), Typewriter
- src/components/pages/01b_Evolution/Evolution.jsx + .css   pinned scroll story: CRT -> beige PC -> laptop -> AI core particle morph
- src/components/pages/06_Prizes/Prizes.jsx + .css           NEW merged "Prizes & Partners" section with the podium

## 2. Edited files (small hooks only)
- src/main.jsx                  imports ./styles/retro.css after index.css
- src/App.jsx                   mounts <Embers/>, <CrtOverlay/>, <ParticleHeadings/>, <Evolution/> (NOT wrapped in <Reveal>, pinning breaks inside transforms); Sponsors removed; nav label "Prizes & Partners"
- src/components/footer/Footer.jsx   Sponsors link removed
- src/components/pages/01_Hero/Hero.jsx  adds .hero-grid-floor div and <Typewriter/> tagline
- all *.css                     cool colours (blue/green/teal) remapped to amber; whites to cream

## 3. Deleted
- src/components/pages/05_Sponsors/  (merged into Prizes)

## 4. Verify
1. `npm install && npm run dev`, open the site.
2. Hero: title assembles from particles; moving the mouse over it shatters letters and they spring back.
3. Scroll: the Evolution section pins and morphs 1982 -> 1995 -> 2010 -> 2026; hovering the canvas scatters particles.
4. Prizes & Partners: podium builds (2nd, 1st, 3rd), amounts count up, no separate Sponsors page.
5. `npm run build` must pass with no errors. Fix only real errors; do not change the design.

## 5. Rules
- Keep fonts: Playfair Display italic headings, Space Grotesk body. Silkscreen pixel font only for small accents.
- Use only the 4 palette colours from retro.css. No new colours.
- Respect prefers-reduced-motion (already handled). Do not add dependencies.
- To exclude any heading from the particle effect add data-fx="off".
