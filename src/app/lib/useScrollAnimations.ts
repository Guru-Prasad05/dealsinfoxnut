"use client";

import { useEffect, useRef } from "react";

export function useScrollAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    initialized.current = true;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // --- Section heading reveals ---
      document.querySelectorAll("section").forEach((section) => {
        const headings = section.querySelectorAll("h2");
        const subheadings = section.querySelectorAll("p:first-child");

        headings.forEach((heading) => {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });

      // --- Parallax backgrounds ---
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || "0.15");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // --- Reveal on scroll (fade-up) ---
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // --- Stagger children reveal ---
      document.querySelectorAll("[data-stagger]").forEach((container) => {
        const children = container.children;
        const delay = parseFloat((container as HTMLElement).dataset.stagger || "0.12");

        gsap.fromTo(
          children,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // --- Horizontal line/divider grow animation ---
      document.querySelectorAll("[data-line-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // --- Magnetic hover for CTA buttons ---
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        const btn = el as HTMLElement;
        btn.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        });
      });

      // --- Scrub-based scroll progress for navbar ---
      const navbar = document.querySelector("nav");
      if (navbar) {
        gsap.to(navbar, {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "100px top",
            scrub: true,
            onUpdate: (self) => {
              if (self.progress > 0.5) {
                navbar.classList.add("nav-scrolled");
              } else {
                navbar.classList.remove("nav-scrolled");
              }
            },
          },
        });
      }

      ScrollTrigger.refresh();
    };

    init();

    return () => {
      // cleanup handled by page unload
    };
  }, []);
}
