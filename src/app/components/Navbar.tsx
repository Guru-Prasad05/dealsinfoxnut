"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Our Story", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Health Benefits", href: "#benefits" },
  { label: "Corporate Gifting", href: "#gifting" },
  { label: "Enquire", href: "#enquiry" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[#0F2219]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <a
          href="#home"
          className="font-heading text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: "#D4AF37" }}
        >
          DealsInfo<span className="text-cream">x</span>Nut
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-body font-semibold uppercase tracking-[0.12em] text-cream/80 hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#enquiry"
          className="hidden lg:inline-block text-sm font-body font-semibold uppercase tracking-[0.12em] px-6 py-2.5 bg-gold text-dark-green rounded-[4px] hover:brightness-110 transition-all duration-200"
        >
          Get Quote
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-gold p-2"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-[#0F2219]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-6 text-gold p-2"
          aria-label="Close menu"
        >
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-xl font-heading font-semibold text-cream hover:text-gold transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#enquiry"
          onClick={() => setMobileOpen(false)}
          className="mt-4 text-sm font-body font-semibold uppercase tracking-[0.12em] px-8 py-3 bg-gold text-dark-green rounded-[4px] hover:brightness-110 transition-all duration-200"
        >
          Get Quote
        </a>
      </div>
    </nav>
  );
}
