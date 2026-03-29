"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Clock, ChefHat } from "lucide-react";

const recipes = [
  {
    id: "trail-mix",
    title: "Foxnut Trail Mix",
    time: "5 min",
    difficulty: "Easy",
    description:
      "Toss roasted foxnuts with almonds, dried cranberries, dark chocolate chips, and a pinch of sea salt for an energising trail mix.",
    image: "/images/hero-product.jpeg",
  },
  {
    id: "energy-bowl",
    title: "Foxnut Energy Bowl",
    time: "10 min",
    difficulty: "Easy",
    description:
      "Layer Greek yoghurt with honey-roasted foxnuts, sliced banana, chia seeds, and a drizzle of almond butter for a power-packed breakfast bowl.",
    image: "/images/hero-product.jpeg",
  },
  {
    id: "dessert",
    title: "Foxnut Kheer Dessert",
    time: "25 min",
    difficulty: "Medium",
    description:
      "Simmer foxnuts in cardamom-spiced milk with saffron strands, crushed pistachios, and jaggery for a royal Indian dessert.",
    image: "/images/hero-product.jpeg",
  },
];

export default function Recipes() {
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

        gsap.fromTo(
          sectionRef.current.querySelectorAll(".recipe-card"),
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      } catch {
        // Fallback
      }
    };

    animate();
  }, []);

  return (
    <section
      id="recipes"
      ref={sectionRef}
      className="bg-cream py-24 px-6 md:px-12"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            Recipes
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-dark-green mb-4">
            Delicious Ways to Enjoy
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card flex-shrink-0 w-[300px] md:w-auto snap-start bg-white rounded-xl border border-gold/10 overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-dark-green">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 300px, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-green/60 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1 text-xs font-body text-dark-green/50">
                    <Clock size={14} />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-body text-dark-green/50">
                    <ChefHat size={14} />
                    {recipe.difficulty}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-dark-green mb-2">
                  {recipe.title}
                </h3>
                <p className="font-body text-sm text-dark-green/60 leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
