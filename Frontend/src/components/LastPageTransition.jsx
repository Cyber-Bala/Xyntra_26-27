import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import "./LastPageTransition.css";

export const LAST_PAGE_TRANSITION_TOTAL = 1500;

const LastPageTransition = forwardRef(function LastPageTransition(
  _,
  ref
) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");

  const busy = useRef(false);
  const timers = useRef([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useImperativeHandle(ref, () => ({
    play(onCovered, options = {}) {
      if (busy.current) return false;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        onCovered?.();
        return true;
      }

      busy.current = true;
      clearTimers();

      setTitle(options.title ?? "");
      setNumber(options.number ?? "");
      setActive(true);

      const coverTimer = setTimeout(() => {
        onCovered?.();
      }, 520);

      const finishTimer = setTimeout(() => {
        setActive(false);
        busy.current = false;
        clearTimers();
      }, LAST_PAGE_TRANSITION_TOTAL);

      timers.current.push(
        coverTimer,
        finishTimer
      );

      return true;
    },
  }));

  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (!active) return null;

  return (
    <div
      className="last-page-transition"
      aria-hidden="true"
    >
      <div className="last-page-transition__wash" />

      <div className="last-page-transition__line last-page-transition__line--top" />

      <div className="last-page-transition__content">
        <span className="last-page-transition__number">
          {number}
        </span>

        <span className="last-page-transition__title">
          {title}
        </span>

        <span className="last-page-transition__caption">
          XYNTRA / HACKATHON 2026
        </span>
      </div>

      <div className="last-page-transition__line last-page-transition__line--bottom" />
    </div>
  );
});

export default LastPageTransition;