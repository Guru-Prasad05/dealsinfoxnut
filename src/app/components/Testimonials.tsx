"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "CEO, Wellness Corp",
    text: "DealsInfoxNut transformed our Diwali gifting. The Prestige Box packaging was stunning, and our clients loved the quality. A truly premium product that reflects our brand values.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    role: "Procurement Head, TechStart India",
    text: "We ordered 200 custom-branded foxnut hampers for our annual event. The team was incredibly responsive, delivery was on time, and the product quality exceeded expectations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Gupta",
    role: "Health & Fitness Influencer",
    text: "Finally, a makhana brand that understands premium. The honey roasted variant is my absolute favourite — perfect crunch, natural sweetness, and beautifully packaged.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section
      id="reviews"
      className="bg-dark-green py-24 px-6 md:px-12"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
        </div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className="text-gold fill-gold"
                        />
                      ))}
                    </div>

                    <blockquote className="font-body text-lg md:text-xl text-cream/80 leading-relaxed italic mb-8 max-w-2xl mx-auto">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    <div>
                      <p className="font-heading text-lg font-bold text-gold">
                        {t.name}
                      </p>
                      <p className="font-body text-sm text-cream/50">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === active ? "bg-gold w-6" : "bg-gold/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
