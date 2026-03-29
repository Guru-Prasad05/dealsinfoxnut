"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const FoxnutScene = dynamic(() => import("./FoxnutScene"), { ssr: false });

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

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

        const tl = gsap.timeline({ delay: 0.2 });

        // Tag line drops in
        if (tagRef.current) {
          tl.fromTo(
            tagRef.current,
            { opacity: 0, y: -20, letterSpacing: "0.5em" },
            { opacity: 1, y: 0, letterSpacing: "0.2em", duration: 1, ease: "power3.out" }
          );
        }

        // Headline split reveal
        if (headlineRef.current) {
          tl.fromTo(
            headlineRef.current,
            { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)",
              duration: 1.4, ease: "power4.out",
            },
            "-=0.6"
          );
        }

        // Gold divider grows
        if (dividerRef.current) {
          tl.fromTo(
            dividerRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
            "-=0.8"
          );
        }

        // Subtext fades up
        if (subtextRef.current) {
          tl.fromTo(
            subtextRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
          );
        }

        // CTA buttons stagger in
        if (ctaRef.current) {
          const buttons = ctaRef.current.querySelectorAll("a");
          tl.fromTo(
            buttons,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.7, ease: "back.out(1.4)",
              stagger: 0.2,
            },
            "-=0.4"
          );
        }

        // Parallax: hero content floats up on scroll
        if (sectionRef.current) {
          const content = sectionRef.current.querySelector(".hero-content");
          if (content) {
            gsap.to(content, {
              y: -80,
              opacity: 0.3,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }
        }
      } catch {
        // Fallback: CSS handles visibility
      }
    };

    animate();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.32, mixBlendMode: "luminosity" }}
        >
          <source src="/videos/fox-nut-bg.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/images/hero-product.jpeg"
          alt="Premium Foxnuts by DealsInfoxNut"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.32, mixBlendMode: "luminosity" }}
        />
      )}

      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#0F2219]/70" />

      {/* 3D Foxnut Scene — behind text, above overlay */}
      <FoxnutScene className="absolute inset-0 z-[5] opacity-50" />

      {/* Content */}
      <div className="hero-content relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 text-center">
        <p
          ref={tagRef}
          className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-4"
        >
          Premium Quality Foxnuts
        </p>
        <h1
          ref={headlineRef}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight font-bold gold-shine-text mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Experience Nature&apos;s
          <br />
          Finest Foxnuts
        </h1>

        {/* Gold Divider */}
        <div
          ref={dividerRef}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6 origin-center"
        />

        <p
          ref={subtextRef}
          className="font-body text-lg text-cream/70 max-w-xl mx-auto mb-10"
        >
          Handpicked from the pristine waters of Bihar, our makhana is a
          testament to purity, health, and timeless taste.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#products"
            data-magnetic
            className="inline-block text-sm font-body font-semibold uppercase tracking-[0.12em] px-8 py-3.5 bg-gold text-dark-green rounded-[4px] hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Explore Products
          </a>
          <a
            href="#gifting"
            data-magnetic
            className="inline-block text-sm font-body font-semibold uppercase tracking-[0.12em] px-8 py-3.5 border border-gold text-gold rounded-[4px] hover:bg-gold/10 transition-all duration-200 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
          >
            Corporate Gifting
          </a>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/50 animate-bounce-slow">
        <span className="text-xs font-body uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>
    </section>
  );
}
