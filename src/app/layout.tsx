import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "DealsInfoxNut — Premium Foxnut | Makhana | Corporate Gifting",
  description:
    "Experience Nature's Finest. Premium quality foxnuts (makhana) sourced from the best farms. Corporate gifting, bulk orders, and retail available.",
  keywords:
    "foxnut, makhana, premium makhana, corporate gifting makhana, buy foxnut India",
  openGraph: {
    title: "DealsInfoxNut",
    description: "Premium Foxnuts — Healthy. Royal. Natural.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
