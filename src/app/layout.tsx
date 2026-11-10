import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CELLIÉR — Haute Wine, Aged Spirits & Micro-Breweries",
  description:
    "An interactive scroll-driven digital cellar showcasing rare vintage wines, single malt whiskies, island coconut arracks, and craft beers.",
  keywords: [
    "Wine store",
    "Spirits",
    "Whisky",
    "Ceylon Arrack",
    "Craft Beer",
    "Fine Wine",
    "Colombo Wine Delivery",
  ],
  authors: [{ name: "Celliér Cellars" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-[#f5f5f5] antialiased selection:bg-[#d4af37] selection:text-black">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

