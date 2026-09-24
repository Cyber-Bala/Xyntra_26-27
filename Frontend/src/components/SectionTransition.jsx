import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./SectionTransition.css";

/* ============================================================
   SHUTTER WIPE + CHAPTER CARD

   1. Seven vertical shutters rise over the page in a wave,
      each with a gold leading edge.
   2. While the screen is fully covered, a chapter card shows
      (outlined number + name revealed letter by letter) and
      the page swaps underneath.
   3. The shutters lift away in the same wave and the new
      section settles in with a slow push.

   Going down the page the wave runs left to right; going back
   up it runs right to left and the shutters travel downward.

   Usage:
     transition.current.play(onCovered, { no: "03", name: "ABOUT", dir: 1 })
============================================================ */

const PANELS = 7;
const STEP = 55; // ms between neighbouring shutters
const PANEL_MS = 420; // travel time of one shutter
const WIPE = (PANELS - 1) * STEP + PANEL_MS; // 750ms, full wipe in or out
const HOLD = 600; // chapter card stays on screen

export const TRANSITION_TOTAL = WIPE + HOLD + WIPE; // 2100ms

/*
  Small "camera push" for the section that was scrolled to.
  Call it inside the onCovered callback.
*/
export function arrive(el, dir = 1) {
  if (!el) return;

  el.style.setProperty("--arrive-from", dir < 0 ? 0.95 : 1.05);
  el.style.setProperty("--arrive-delay", `${HOLD}ms`);
  el.style.setProperty("--arrive-time", `${WIPE}ms`);

  el.classList.remove("is-arriving");
  void el.offsetWidth; // restart the animation if it was mid-way
  el.classList.add("is-arriving");

  setTimeout(() => el.classList.remove("is-arriving"), HOLD + WIPE + 150);
}

const SectionTransition = forwardRef(function SectionTransition(_, ref) {
  // null = idle (nothing is mounted)
  const [view, setView] = useState(null);

  const busy = useRef(false);
  const timers = useRef([]);

  useImperativeHandle(
    ref,
    () => ({
      play(onCovered, meta = {}) {
        if (busy.current) return false;

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduced) {
          onCovered();
          return true;
        }

        const later = (fn, ms) =>
          timers.current.push(setTimeout(fn, ms));

        busy.current = true;
        setView({ phase: "enter", meta });

        later(() => {
          setView({ phase: "covered", meta });

          // Fully covered: safe to move to the next section.
          onCovered();

          later(() => {
            setView({ phase: "exit", meta });

            later(() => {
              setView(null);
              busy.current = false;
            }, WIPE);
          }, HOLD);
        }, WIPE);

        return true;
      },
    }),
    []
  );

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  if (!view) return null;

  const { phase, meta } = view;
  const reverse = meta.dir < 0;
  const name = meta.name ?? "";

  return (
    <div
      className={`ct ct--${phase}${reverse ? " ct--rev" : ""}`}
      style={{
        "--ct-cols": PANELS,
        "--ct-panel": `${PANEL_MS}ms`,
      }}
      aria-hidden="true"
    >
      <div className="ct__panels">
        {Array.from({ length: PANELS }, (_, i) => {
          const order = reverse ? PANELS - 1 - i : i;

          return (
            <span
              key={i}
              className="ct__panel"
              style={{ "--delay": `${order * STEP}ms` }}
            />
          );
        })}
      </div>

      <div className="ct__glow" />

      <div className="ct__title">
        {meta.no ? <span className="ct__no">{meta.no}</span> : null}

        <div className="ct__stack">
          <span className="ct__name">
            {Array.from(name).map((ch, k) => (
              <span className="ct__mask" key={k}>
                <span className="ct__char" style={{ "--k": k }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              </span>
            ))}
          </span>

          <span className="ct__rule" />
        </div>
      </div>
    </div>
  );
});

export default SectionTransition;