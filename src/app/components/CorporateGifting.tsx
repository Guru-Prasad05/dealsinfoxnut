"use client";

import { useEffect, useRef } from "react";
import { Gift, Star, Crown } from "lucide-react";

const corporateCombos = [
  {
    id: "elegance",
    name: "Elegance Pack",
    tagline: "Thoughtful gifting, naturally premium",
    minQty: 50,
    contents: [
      "Classic Roasted Foxnut (100g)",
      "Premium Gift Box",
      "Custom Message Card",
    ],
    badge: "Best for Diwali",
    icon: Gift,
  },
  {
    id: "prestige",
    name: "Prestige Box",
    tagline: "For clients who deserve the finest",
    minQty: 100,
    contents: [
      "3 Flavour Assortment (250g)",
      "Luxury Rigid Box",
      "Brand Co-printing",
      "Satin Ribbon",
    ],
    badge: "Most Popular",
    icon: Star,
    featured: true,
  },
  {
    id: "royal",
    name: "Royal Hamper",
    tagline: "Bespoke corporate gifting at scale",
    minQty: 500,
    contents: [
      "5 Flavour Gift Hamper (500g)",
      "Custom Logo Branding",
      "Personalized Cards",
      "Dedicated Account Manager",
    ],
    badge: "Bulk Enterprise",
    icon: Crown,
  },
];

export default function CorporateGifting() {
  const sectionRef = useRef<HTMLElement>(null);

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

        // Heading + subtext reveal
        const heading = sectionRef.current.querySelector("h2");
        if (heading) {
          gsap.fromTo(heading,
            { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)",
              duration: 1.2, ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 85%" },
            }
          );
        }

        // Cards: scrub-based reveal — cards animate in as user scrolls through
        const cards = sectionRef.current.querySelectorAll(".gifting-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 100, scale: 0.85, rotateY: i === 0 ? -8 : i === 2 ? 8 : 0 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateY: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 60%",
                scrub: 1,
              },
            }
          );
        });

        // Gold pattern parallax
        const pattern = sectionRef.current.querySelector(".gold-pattern");
        if (pattern) {
          gsap.to(pattern, {
            backgroundPosition: "50% 100%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          });
        }

        // Quantity numbers count up
        const qtyEls = sectionRef.current.querySelectorAll(".qty-number");
        qtyEls.forEach((el) => {
          const target = parseInt((el as HTMLElement).dataset.qty || "0");
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => {
              gsap.fromTo(el,
                { textContent: 0 },
                {
                  textContent: target,
                  duration: 1.5,
                  ease: "power1.out",
                  snap: { textContent: 1 },
                }
              );
            },
            once: true,
          });
        });
      } catch {
        // Fallback
      }
    };

    animate();
  }, []);

  return (
    <section
      id="gifting"
      ref={sectionRef}
      className="relative bg-primary-green py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Gold Pattern Overlay */}
      <div
        className="gold-pattern absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: "50% 0%",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            Corporate Gifting
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-white mb-4">
            Make Every Occasion
            <br />
            Extraordinary
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
          <p className="font-body text-base text-cream/60 max-w-lg mx-auto">
            Premium foxnut gift boxes for Diwali, corporate events, weddings,
            and wellness hampers — customized to your brand.
          </p>
        </div>

        {/* Combo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {corporateCombos.map((combo) => (
            <div
              key={combo.id}
              className={`gifting-card relative rounded-xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                combo.featured
                  ? "bg-white/[0.08] border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.08)]"
                  : "bg-white/[0.04] border-gold/20 hover:border-gold/40"
              }`}
            >
              {/* Badge */}
              <div
                className={`absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider ${
                  combo.featured
                    ? "bg-gold text-dark-green"
                    : "bg-white/10 text-gold border border-gold/30"
                }`}
              >
                {combo.badge}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6 mt-2">
                <combo.icon size={28} className="text-gold" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                {combo.name}
              </h3>
              <p className="font-body text-sm italic text-cream/50 mb-5">
                {combo.tagline}
              </p>

              {/* Contents */}
              <ul className="space-y-2 mb-6">
                {combo.contents.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-body text-cream/70"
                  >
                    <span className="text-gold mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Min Quantity */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="qty-number font-heading text-3xl font-bold text-gold" data-qty={combo.minQty}>
                  {combo.minQty}
                </span>
                <span className="font-heading text-3xl font-bold text-gold">+</span>
                <span className="text-xs font-body text-cream/50 uppercase tracking-wider ml-1">
                  pieces min
                </span>
              </div>

              {/* CTA */}
              <a
                href={`#enquiry?type=${combo.id}`}
                className={`block text-center text-sm font-body font-semibold uppercase tracking-[0.12em] px-6 py-3 rounded-[4px] transition-all duration-200 ${
                  combo.featured
                    ? "bg-gold text-dark-green hover:brightness-110"
                    : "border border-gold text-gold hover:bg-gold/10"
                }`}
              >
                Request Quote
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <a
            href="#enquiry"
            className="inline-flex items-center gap-2 text-sm font-body font-semibold uppercase tracking-[0.12em] text-gold hover:text-light-gold transition-colors duration-200"
          >
            Request Custom Quote
            <span aria-hidden="true">&rarr;</span>
          </a>
          <p className="font-body text-xs text-cream/40 mt-3">
            Pan-India delivery &middot; Custom branding &middot; Bulk order
            specialists
          </p>
        </div>
      </div>
    </section>
  );
}
