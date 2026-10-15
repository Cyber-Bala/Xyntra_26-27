import { useEffect, useRef } from "react";

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");

          if (!options.repeat) {
            observer.unobserve(element);
          }
        } else if (options.repeat) {
          element.classList.remove("is-visible");
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? "0px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.repeat, options.threshold, options.rootMargin]);

  return ref;
}