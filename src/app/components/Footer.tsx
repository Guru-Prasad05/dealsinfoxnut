import { Heart } from "lucide-react";

const footerLinks = {
  company: [
    { label: "Our Story", href: "#about" },
    { label: "Health Benefits", href: "#benefits" },
    { label: "Recipes", href: "#recipes" },
    { label: "Testimonials", href: "#reviews" },
  ],
  products: [
    { label: "Classic Roasted", href: "#products" },
    { label: "Jeera Foxnuts", href: "#products" },
    { label: "Pudina Foxnuts", href: "#products" },
    { label: "Peri Peri Foxnuts", href: "#products" },
    { label: "Caramel Foxnuts", href: "#products" },
  ],
  support: [
    { label: "Contact Us", href: "#enquiry" },
    { label: "Corporate Gifting", href: "#gifting" },
    { label: "Bulk Orders", href: "#enquiry" },
    { label: "Shipping Info", href: "#enquiry" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A1A10] py-16 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <a
              href="#home"
              className="font-heading text-2xl font-bold text-gold mb-4 inline-block"
            >
              DealsInfo<span className="text-cream">x</span>Nut
            </a>
            <p className="font-body text-sm text-cream/50 leading-relaxed mb-6">
              Premium quality foxnuts sourced from the pristine wetlands of
              Bihar. Healthy. Royal. Natural.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/foxnut_xpress?utm_source=qr&igsh=MXBhZGM3a2xucGZncw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:border-gold/50 hover:text-gold transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:border-gold/50 hover:text-gold transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:border-gold/50 hover:text-gold transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-cream/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-cream/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-cream/50 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-cream/30">
            &copy; {new Date().getFullYear()} DealsInfoxNut. All rights
            reserved.
          </p>
          <p className="font-body text-xs text-cream/30 flex items-center gap-1">
            Made with <Heart size={12} className="text-gold" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
