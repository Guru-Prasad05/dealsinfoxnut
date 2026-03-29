"use client";

import dynamic from "next/dynamic";

const FloatingDivider = dynamic(() => import("./FloatingDivider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-24 flex items-center justify-center">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  ),
});

export default function FloatingDividerWrapper() {
  return <FloatingDivider />;
}
