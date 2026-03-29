"use client";

import { useEffect, useRef } from "react";
import {
  Heart,
  Zap,
  Brain,
  Bone,
  Shield,
  Scale,
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Heart Healthy",
    description: "Low in sodium and cholesterol — supports cardiovascular health naturally.",
    stat: 0,
    suffix: "mg cholesterol",
  },
  {
    icon: Zap,
    title: "High in Protein",
    description: "Packed with plant-based protein to fuel your day with sustained energy.",
    stat: 9,
    suffix: "g per 100g",
  },
  {
    icon: Brain,
    title: "Brain Function",
    description: "Rich in thiamine — supports cognitive function and nervous system health.",
    stat: 25,
    suffix: "% DV Thiamine",
  },
  {
    icon: Bone,
    title: "Strong Bones",
    description: "Natural source of calcium and phosphorus for bone density support.",
    stat: 60,
    suffix: "mg Calcium",
  },
  {
    icon: Shield,
    title: "Antioxidant Rich",
    description: "Loaded with kaempferol — a powerful antioxidant for cellular protection.",
    stat: 100,
    suffix: "% Natural",
  },
  {
    icon: Scale,
    title: "Weight Friendly",
    description: "Low calorie, high fibre — a guilt-free snack for mindful eating.",
    stat: 347,
    suffix: "cal per 100g",
  },
];

export default function HealthBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

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

        gsap.fromTo(
          sectionRef.current.querySelectorAll(".benefit-card"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );

        // Counter animation
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          onEnter: () => {
            if (hasAnimated.current) return;
            hasAnimated.current = true;

            sectionRef.current?.querySelectorAll(".stat-number").forEach((el) => {
              const target = Number((el as HTMLElement).dataset.target);
              gsap.fromTo(
                el,
                { textContent: 0 },
                {
                  textContent: target,
                  duration: 2,
                  ease: "power1.out",
                  snap: { textContent: 1 },
                }
              );
            });
          },
        });
      } catch {
        // Fallback
      }
    };

    animate();
  }, []);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="bg-off-white py-24 px-6 md:px-12"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            Why Foxnuts
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-dark-green mb-4">
            Nature&apos;s Superfood
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="benefit-card bg-white rounded-xl p-8 border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-primary-green/10 flex items-center justify-center mb-5">
                <benefit.icon size={24} className="text-gold" />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="stat-number font-heading text-3xl font-bold text-gold"
                  data-target={benefit.stat}
                >
                  {benefit.stat}
                </span>
                <span className="text-xs font-body text-dark-green/50">
                  {benefit.suffix}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-dark-green mb-2">
                {benefit.title}
              </h3>
              <p className="font-body text-sm text-dark-green/60 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
