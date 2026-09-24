import { useEffect, useRef } from "react";

import Rules from "./Rules";
import FAQ from "./FAQ";
import Footer from "./Footer";
import Contact from "./Contact";
import LastPageAtmosphere from "./LastPageAtmosphere";
import LastPageTransition from "./LastPageTransition";

import "../styles/last-page.css";

const SECTION_META = [
  {
    id: "rules",
    number: "01",
    title: "RULES",
  },
  {
    id: "faq",
    number: "02",
    title: "FAQ",
  },
  {
    id: "manifesto",
    number: "03",
    title: "ENTER / BUILD / CONQUER",
  },
  {
    id: "contact",
    number: "04",
    title: "CONTACT",
  },
];

export default function LastPage() {
  const transition = useRef(null);
  const busy = useRef(false);
  const touchY = useRef(0);

  useEffect(() => {
  const sections = Array.from(
    document.querySelectorAll(
      "#last-page [data-last-section]"
    )
  );

  if (!sections.length) return;

  let lockUntil =
    performance.now() + 1500;

  let touchY = 0;

  function tryTransition(direction) {
    if (
      performance.now() <
      lockUntil
    ) {
      return false;
    }

    if (busy.current) {
      return false;
    }

    /*
      Exactly like the friend's page:
      the current section is the last section
      whose top has reached the viewport.
    */
    const current =
      sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top <= 5
        )
        .pop();

    if (!current) {
      return false;
    }

    const index =
      sections.indexOf(current);

    const next =
      sections[index + direction];

    if (!next) {
      return false;
    }

    const rect =
      current.getBoundingClientRect();

    /*
      DOWN:
      Let normal scrolling continue until the
      entire section reaches the bottom.
    */
    if (
      direction > 0 &&
      rect.bottom >
        window.innerHeight + 2
    ) {
      return false;
    }

    /*
      UP:
      Let normal scrolling continue until the
      section reaches the top.
    */
    if (
      direction < 0 &&
      rect.top < -2
    ) {
      return false;
    }

    const nextRect =
      next.getBoundingClientRect();

    let top =
      nextRect.top +
      window.scrollY;

    /*
      Going upward, align the bottom of the
      previous section with the viewport.
    */
    if (direction < 0) {
      top = Math.max(
        top,
        nextRect.bottom +
          window.scrollY -
          window.innerHeight
      );
    }

    busy.current = true;

    const meta =
      SECTION_META[index + direction];

    const started =
      transition.current?.play(
        () => {
          window.scrollTo({
            top,
            left: 0,
            behavior: "instant",
          });
        },
        {
          number: meta?.number ?? "",
          title: meta?.title ?? "",
          direction,
        }
      );

    if (!started) {
      window.scrollTo({
        top,
        left: 0,
        behavior: "instant",
      });
    }

    lockUntil =
      performance.now() +
      1500;

    window.setTimeout(() => {
      busy.current = false;
    }, 1500);

    return true;
  }

  function onWheel(e) {
    if (
      Math.abs(e.deltaY) < 8
    ) {
      return;
    }

    const direction =
      e.deltaY > 0 ? 1 : -1;

    if (
      tryTransition(direction)
    ) {
      e.preventDefault();
    }
  }

  function onKeyDown(e) {
    let direction = 0;

    if (
      e.key === "ArrowDown" ||
      e.key === "PageDown"
    ) {
      direction = 1;
    }

    if (
      e.key === "ArrowUp" ||
      e.key === "PageUp"
    ) {
      direction = -1;
    }

    if (!direction) {
      return;
    }

    if (
      tryTransition(direction)
    ) {
      e.preventDefault();
    }
  }

  function onTouchStart(e) {
    touchY =
      e.touches[0].clientY;
  }

  function onTouchMove(e) {
    const dy =
      touchY -
      e.touches[0].clientY;

    if (
      Math.abs(dy) < 40
    ) {
      return;
    }

    const direction =
      dy > 0 ? 1 : -1;

    if (
      tryTransition(direction)
    ) {
      e.preventDefault();

      touchY =
        e.touches[0].clientY;
    }
  }

  window.addEventListener(
    "wheel",
    onWheel,
    { passive: false }
  );

  window.addEventListener(
    "keydown",
    onKeyDown
  );

  window.addEventListener(
    "touchstart",
    onTouchStart,
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    onTouchMove,
    { passive: false }
  );

  return () => {
    window.removeEventListener(
      "wheel",
      onWheel
    );

    window.removeEventListener(
      "keydown",
      onKeyDown
    );

    window.removeEventListener(
      "touchstart",
      onTouchStart
    );

    window.removeEventListener(
      "touchmove",
      onTouchMove
    );
  };
}, []);
  return (
    <div
      className="last-page"
      id="last-page"
    >
      <LastPageTransition
        ref={transition}
      />

      <LastPageAtmosphere />

      <div
        className="last-page-vignette"
        aria-hidden="true"
      />

      <div
        className="last-page-grain"
        aria-hidden="true"
      />

      <div className="last-page-content">
        <Rules />
        <FAQ />
        <Footer />
        <Contact />
      </div>
    </div>
  );
}