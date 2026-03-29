"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const products = [
  {
    id: "classic",
    name: "Classic Roasted",
    description:
      "The timeless crunch of pure, lightly salted foxnuts — roasted to golden perfection.",
    image: "/images/hero-product.jpeg",
  },
  {
    id: "jeera",
    name: "Jeera Foxnuts",
    description:
      "Earthy cumin warmth meets the light crunch of premium makhana — a classic Indian flavour elevated.",
    image: "/images/jeera.jpeg",
  },
  {
    id: "pudina",
    name: "Pudina Foxnuts",
    description:
      "Cool, refreshing mint with a gentle tang — a unique twist on your favourite healthy snack.",
    image: "/images/pudina.jpeg",
  },
  {
    id: "periperi",
    name: "Peri Peri Foxnuts",
    description:
      "Bold, smoky peri peri heat on every pearl — for those who like their snack with a kick.",
    image: "/images/periperi.jpeg",
  },
  {
    id: "caramel",
    name: "Caramel Foxnuts",
    description:
      "Luscious golden caramel coating on every pearl — an indulgent twist on nature's superfood.",
    image: "/images/caramel.jpeg",
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const animate = async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        // Heading reveal
        const heading = sectionRef.current.querySelector("h2");
        if (heading) {
          gsap.fromTo(heading,
            { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)",
              duration: 1.2, ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 85%" },
            }
          );
        }

        // Cards: stagger reveal with scale + rotation
        const cards = sectionRef.current.querySelectorAll(".product-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, scale: 0.9, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current.querySelector(".products-grid"),
              start: "top 80%",
            },
          }
        );

        // Product images: subtle parallax within cards
        cards.forEach((card) => {
          const img = card.querySelector("img");
          if (img) {
            gsap.to(img, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            });
          }
        });
      } catch {
        // Fallback
      }
    };

    animate();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="bg-cream py-24 px-6 md:px-12"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            Our Collection
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-dark-green mb-4">
            Premium Foxnut Flavours
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
          <p className="font-body text-base text-dark-green/60 max-w-lg mx-auto">
            Discover our curated range of roasted foxnuts — each flavour crafted
            for the discerning palate.
          </p>
        </div>

        {/* Product Horizontal Scroll with Arrow Buttons */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gold/40 flex items-center justify-center shadow-md transition-all duration-200 hover:bg-gold hover:border-gold hover:text-dark-green ${
              canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            style={{ color: "#D4AF37" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gold/40 flex items-center justify-center shadow-md transition-all duration-200 hover:bg-gold hover:border-gold hover:text-dark-green ${
              canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            style={{ color: "#D4AF37" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

        <div ref={scrollRef} className="products-grid flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group bg-white rounded-xl border border-gold/15 overflow-hidden transition-all duration-300 hover:border-gold/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] flex-shrink-0 w-72"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative aspect-square overflow-hidden bg-dark-green">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="288px"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-dark-green mb-2">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-dark-green/60 leading-relaxed mb-4">
                  {product.description}
                </p>
                <a
                  href="#enquiry"
                  className="inline-block text-xs font-body font-semibold uppercase tracking-[0.12em] px-6 py-2.5 border border-gold text-gold rounded-[4px] hover:bg-gold hover:text-dark-green transition-all duration-200"
                >
                  Get Quote
                </a>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
