"use client";

import { useEffect } from "react";
import { useScrollAnimations } from "../lib/useScrollAnimations";

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  // Always reset scroll to top on reload/mount so users start at the hero section.
  // Must be in an effect; doing this during render will prevent scrolling entirely.
  useEffect(() => {
    // Disable native scroll restoration (it can run after hydration and
    // override our scrollTo(0,0) on reload).
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If the URL has a hash (e.g. #products, #enquiry), strip it so we don't
    // auto-jump to an anchor on reload.
    if (window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", pathname + search);
    }

    const goTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Hit it multiple times because some browsers restore scroll late.
    const raf = window.requestAnimationFrame(goTop);
    const t1 = window.setTimeout(goTop, 0);
    const t2 = window.setTimeout(goTop, 80);
    const t3 = window.setTimeout(goTop, 250);

    // Also run once after full load.
    window.addEventListener("load", goTop, { once: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("load", goTop);
    };
  }, []);

  useScrollAnimations();
  return <>{children}</>;
}
