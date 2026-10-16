# Paste this into Antigravity (Agent Manager, workspace = your Frontend folder)

You are working in my existing React 19 + Vite project (XYNTRA 26 hackathon site). I have a finished, tested upgrade
in this folder. Apply it exactly, do not redesign or rewrite anything else.

## 1. New files (already in the folder, do not delete)
- src/styles/retro.css                     palette tokens (cream / amber / coral / warm black), CRT overlay, hero grid floor, relay canvas
- src/components/fx/TitleRelay.jsx         ONE particle swarm that travels heading to heading as you scroll:
                                           XYNTRA -> Build What's Next -> Choose Your World -> Mark The Dates -> Rewards -> Code of Conduct.
                                           It disintegrates and re-assembles (scroll-scrubbed, reversible). The cursor scatters it.
- src/components/fx/Atmosphere.jsx         CrtOverlay, Embers (ambient + cursor trail), Typewriter
- src/components/pages/06_Prizes/Prizes.jsx + .css   NEW merged "Prizes & Partners" section with the podium

## 2. Edited files (small hooks only)
- src/main.jsx                  imports ./styles/retro.css after index.css
- src/App.jsx                   mounts <Embers/>, <CrtOverlay/>, <TitleRelay/>; Sponsors section removed; nav label "Prizes & Partners".
                                The tech-eras (Evolution) section is REMOVED completely.
- src/components/footer/Footer.jsx       Sponsors link removed
- src/components/pages/01_Hero/Hero.jsx  adds .hero-grid-floor div and <Typewriter/> tagline
- all *.css                     cool colours (blue/green/teal) remapped to amber; whites to cream

## 3. Deleted
- src/components/pages/05_Sponsors/   (merged into Prizes)
- src/components/pages/01b_Evolution/ (replaced by the title relay)
- src/components/fx/ParticleHeadings.jsx (replaced by TitleRelay.jsx)

## 4. Verify
1. `npm install && npm run dev`, open the site.
2. Hero: the XYNTRA title assembles from particles. Scroll: it disintegrates into dust, the dust assembles into the About title
   "BUILD WHAT'S NEXT.", then into "CHOOSE YOUR WORLD.", then "MARK THE DATES.". Scrolling back up reverses it.
3. Moving the mouse over the swarm scatters it and it springs back.
4. Prizes & Partners: podium builds (2nd, 1st, 3rd), amounts count up, no separate Sponsors page.
5. `npm run build` must pass with no errors. Fix only real errors; do not change the design.

## 5. Rules
- Keep fonts: Playfair Display italic headings, Space Grotesk body. Silkscreen pixel font only for small accents.
- Use only the 4 palette colours from retro.css. No new colours. No new dependencies.
- Respect prefers-reduced-motion (already handled).

## 6. How to tune the title relay (constants at the top of TitleRelay.jsx)
- DISSOLVE_START / DISSOLVE_LEN : when a heading starts to disintegrate and how much scrolling that takes
- ASSEMBLE_START / ASSEMBLE_LEN : when the swarm starts flying into the next heading and how long it takes
- DUST_ALPHA : how visible the swarm is while it hangs between headings
- MAX_N : particle budget (lower it if a laptop is slow)
- Exclude a heading from the relay: add data-fx="off" to it. The relay follows every h1/h2 >= 30px, in page order.
