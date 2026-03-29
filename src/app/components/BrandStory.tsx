"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Leaf, Dumbbell, WheatOff, Flame, ShieldCheck, CheckCircle2, Truck, Star, Package, Users } from "lucide-react";

const highlights = [
  { icon: Star,        text: "Sourced directly from the finest farms in Bihar" },
  { icon: CheckCircle2,text: "Roasted fresh to lock in crunch, taste & nutrition" },
  { icon: Package,     text: "Premium fresh-lock packaging for lasting crispness" },
  { icon: Users,       text: "Trusted by corporate brands across India for gifting" },
  { icon: Truck,       text: "Pan-India delivery — fast, reliable, bulk-ready" },
];

const badges = [
  { icon: Leaf, label: "100% Natural" },
  { icon: Dumbbell, label: "High Protein" },
  { icon: WheatOff, label: "Gluten Free" },
  { icon: Flame, label: "Low Calories" },
  { icon: ShieldCheck, label: "No Preservatives" },
];

export default function BrandStory() {
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

        // Image parallax + reveal
        const img = sectionRef.current.querySelector(".story-image");
        if (img) {
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0 0 0)", scale: 1.2 },
            {
              clipPath: "inset(0% 0 0 0)",
              scale: 1,
              duration: 1.4,
              ease: "power4.inOut",
              scrollTrigger: { trigger: img, start: "top 85%" },
            }
          );
          // Parallax drift on the inner image
          const inner = img.querySelector("img");
          if (inner) {
            gsap.to(inner, {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }
        }

        // Text elements stagger reveal
        const textEls = sectionRef.current.querySelectorAll(".animate-in");
        gsap.fromTo(
          textEls,
          { opacity: 0, y: 50, clipPath: "inset(0 0 30% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current.querySelector(".story-text"),
              start: "top 80%",
            },
          }
        );

        // Divider grow
        const divider = sectionRef.current.querySelector(".gold-line");
        if (divider) {
          gsap.fromTo(
            divider,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: "power2.inOut",
              scrollTrigger: { trigger: divider, start: "top 85%" },
            }
          );
        }

        // Badges pop in
        const badgeEls = sectionRef.current.querySelectorAll(".badge-item");
        gsap.fromTo(
          badgeEls,
          { opacity: 0, scale: 0.7, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: badgeEls[0],
              start: "top 90%",
            },
          }
        );
      } catch {
        // Fallback: elements visible via CSS
      }
    };

    animate();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-primary-green py-24 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image with parallax */}
        <div className="story-image relative aspect-[4/5] max-h-[560px] rounded-xl overflow-hidden">
          <Image
            src="/images/hero-product.jpeg"
            alt="DealsInfoxNut premium foxnuts"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2219]/60 to-transparent" />
        </div>

        {/* Text Content */}
        <div className="story-text">
          <p className="animate-in text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            About the Brand
          </p>
          <h2 className="animate-in font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-white mb-4">
            Why DealsInfoxNut?
          </h2>

          {/* Gold Divider */}
          <div className="gold-line w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6 origin-left" />

          <p className="animate-in font-body text-base md:text-lg text-cream/70 leading-relaxed mb-4">
            At DealsInfoxNut, we bring you premium quality foxnuts (makhana)
            sourced from the best farms.
          </p>
          <p className="animate-in font-body text-base md:text-lg text-cream/70 leading-relaxed mb-6">
            Our snacks are carefully processed to maintain natural taste,
            nutrition, and freshness.
          </p>

          {/* Key Highlights */}
          <ul className="animate-in space-y-3 mb-8">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-start gap-3">
                <h.icon size={18} className="text-gold mt-0.5 shrink-0" />
                <span className="font-body text-sm text-cream/75 leading-relaxed">{h.text}</span>
              </li>
            ))}
          </ul>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="badge-item flex items-center gap-2 px-4 py-2 rounded-full border border-gold/25 bg-white/[0.04] backdrop-blur-sm hover:border-gold/50 hover:bg-white/[0.08] transition-all duration-300"
              >
                <badge.icon size={16} className="text-gold" />
                <span className="text-xs font-body font-semibold uppercase tracking-wider text-cream/80">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
