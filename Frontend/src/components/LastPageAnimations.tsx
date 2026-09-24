import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LastPageAnimations() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lastPage = document.querySelector("#last-page");

      if (!lastPage) return;

      const rules = lastPage.querySelector("#rules");
      const faq = lastPage.querySelector("#faq");
      const footer = lastPage.querySelector(".footer");
      const contact = lastPage.querySelector("#contact");

      if (!rules || !faq || !footer || !contact) return;

      /* =====================================================
         GPU-FRIENDLY INITIAL STATES
      ===================================================== */

      gsap.set(".rules__eyebrow", { y: 24 });
      gsap.set(".rules__heading", { y: 42 });
      gsap.set(".rules__intro-copy", { y: 24 });
      gsap.set(".rule-row", { y: 28 });

      gsap.set(".faq__eyebrow", { y: 24 });
      gsap.set(".faq__intro h2", { y: 36 });
      gsap.set(".faq__copy", { y: 24 });
      gsap.set(".faq-item", { y: 24 });

      gsap.set(".footer__main p", { y: 45 });

      gsap.set(".contact__eyebrow", { y: 24 });
      gsap.set(".contact__heading-wrap h2", { y: 36 });
      gsap.set(".contact__body", { y: 24 });

      /* =====================================================
         RULES ENTRANCE
      ===================================================== */

      const rulesIn = gsap.timeline({
        scrollTrigger: {
          trigger: rules,
          start: "top 80%",
          end: "top 38%",
          scrub: 0.8,
        },
      });

      rulesIn
        .to(".rules__eyebrow", {
          y: 0,
          duration: 0.35,
          ease: "none",
        })
        .to(
          ".rules__heading",
          {
            y: 0,
            duration: 0.55,
            ease: "none",
          },
          "-=0.2"
        )
        .to(
          ".rules__intro-copy",
          {
            y: 0,
            duration: 0.35,
            ease: "none",
          },
          "-=0.2"
        )
        .to(
          ".rule-row",
          {
            y: 0,
            stagger: 0.07,
            duration: 0.45,
            ease: "none",
          },
          "-=0.15"
        );

      /* =====================================================
         RULES → FAQ
         CAMERA SHIFT
      ===================================================== */

      const rulesToFaq = gsap.timeline({
        scrollTrigger: {
          trigger: rules,
          start: "bottom 82%",
          end: "bottom 15%",
          scrub: 1.15,
        },
      });

      rulesToFaq
        .to(
          rules,
          {
            yPercent: -7,
            scale: 0.965,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          ".rule-row",
          {
            xPercent: -2,
            ease: "none",
            stagger: 0.025,
            duration: 1,
          },
          0
        )
        .to(
          faq,
          {
            yPercent: 6,
            ease: "none",
            duration: 1,
          },
          0
        );

      /* =====================================================
         FAQ ENTRANCE
      ===================================================== */

      const faqIn = gsap.timeline({
        scrollTrigger: {
          trigger: faq,
          start: "top 82%",
          end: "top 40%",
          scrub: 0.85,
        },
      });

      faqIn
        .to(".faq__eyebrow", {
          y: 0,
          duration: 0.3,
          ease: "none",
        })
        .to(
          ".faq__intro h2",
          {
            y: 0,
            duration: 0.45,
            ease: "none",
          },
          "-=0.12"
        )
        .to(
          ".faq__copy",
          {
            y: 0,
            duration: 0.3,
            ease: "none",
          },
          "-=0.15"
        )
        .to(
          ".faq-item",
          {
            y: 0,
            stagger: 0.06,
            duration: 0.4,
            ease: "none",
          },
          "-=0.1"
        );

      /* =====================================================
         FAQ → MANIFESTO
         HORIZONTAL CAMERA SHIFT
      ===================================================== */

      const faqToFooter = gsap.timeline({
        scrollTrigger: {
          trigger: faq,
          start: "bottom 82%",
          end: "bottom 18%",
          scrub: 1.2,
        },
      });

      faqToFooter
        .to(
          ".faq__intro",
          {
            xPercent: -5,
            yPercent: -4,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          ".faq-item",
          {
            xPercent: 4,
            ease: "none",
            stagger: 0.025,
            duration: 1,
          },
          0
        )
        .to(
          footer,
          {
            yPercent: 8,
            ease: "none",
            duration: 1,
          },
          0
        );

      /* =====================================================
         MANIFESTO ENTRANCE
      ===================================================== */

      const footerIn = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 84%",
          end: "top 40%",
          scrub: 0.9,
        },
      });

      footerIn.to(".footer__main p", {
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "none",
      });

      /* =====================================================
         MANIFESTO → CONTACT
         LARGE CAMERA PUSH
      ===================================================== */

      const footerToContact = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "bottom 84%",
          end: "bottom 18%",
          scrub: 1.2,
        },
      });

      footerToContact
        .to(
          ".footer__main p:nth-child(1)",
          {
            xPercent: -2,
            yPercent: -5,
            scale: 1.035,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          ".footer__main p:nth-child(2)",
          {
            xPercent: 1,
            yPercent: -3,
            scale: 1.045,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          ".footer__main p:nth-child(3)",
          {
            xPercent: 3,
            yPercent: -1,
            scale: 1.055,
            ease: "none",
            duration: 1,
          },
          0
        )
        .to(
          contact,
          {
            yPercent: 7,
            ease: "none",
            duration: 1,
          },
          0
        );

      /* =====================================================
         CONTACT ENTRANCE
      ===================================================== */

      const contactIn = gsap.timeline({
        scrollTrigger: {
          trigger: contact,
          start: "top 82%",
          end: "top 40%",
          scrub: 0.9,
        },
      });

      contactIn
        .to(".contact__eyebrow", {
          y: 0,
          duration: 0.25,
          ease: "none",
        })
        .to(
          ".contact__heading-wrap h2",
          {
            y: 0,
            duration: 0.45,
            ease: "none",
          },
          "-=0.1"
        )
        .to(
          ".contact__body",
          {
            y: 0,
            duration: 0.3,
            ease: "none",
          },
          "-=0.15"
        );

      /* =====================================================
         HORSE — VERY SLOW CONTINUOUS PARALLAX
      ===================================================== */

      gsap.to(".last-page-atmosphere__horse", {
        yPercent: -5,
        xPercent: 1.5,
        scale: 1.035,
        ease: "none",

        scrollTrigger: {
          trigger: lastPage,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });

      /* =====================================================
         MIST — VERY SLOW
      ===================================================== */

      gsap.to(".last-page-atmosphere__mist", {
        xPercent: 4,
        yPercent: -3,
        scale: 1.04,
        ease: "none",

        scrollTrigger: {
          trigger: lastPage,
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        },
      });

      ScrollTrigger.refresh();
    }, "#last-page");

    return () => ctx.revert();
  }, []);

  return null;
}