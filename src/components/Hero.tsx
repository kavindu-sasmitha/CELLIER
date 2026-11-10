"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HeroParade3D = dynamic(
  () => import("./HeroParade3D").then((mod) => mod.HeroParade3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] sm:h-[680px] md:h-[740px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-mono">
            Initializing 3D Stage...
          </span>
        </div>
      </div>
    ),
  }
);

export const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subtle Parallax and opacity fade on scroll
  const opacity = Math.max(1 - scrollY / 700, 0);
  const translateY = scrollY * 0.25;

  return (
    <section className="relative w-full min-h-screen pt-24 pb-12 flex flex-col items-center justify-between text-center overflow-hidden bg-radial from-[#15100a] via-[#090706] to-black">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035] pointer-events-none" />

      {/* Hero Header Typography */}
      <div
        className="relative z-10 max-w-4xl px-6 flex flex-col items-center will-change-transform mt-4 sm:mt-6"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* Curated Cellar Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#d4af37] font-mono font-bold">
            EST. 1894 • INTERACTIVE 3D RESERVE
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white uppercase leading-[1.05]">
          THE ART OF <br className="hidden sm:block" />
          <span className="italic font-light text-[#d4af37] font-serif">Living Spirits & Brews</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-300 font-light max-w-xl leading-relaxed tracking-wide">
          A continuous 3D sensory voyage through Johnnie Walker blended scotch whiskies and ice-cold world craft beers.
        </p>
      </div>

      {/* 3D Real-time Floating Bottles & Beers Parade */}
      <div className="relative z-10 w-full max-w-7xl px-2 sm:px-6 my-2">
        <HeroParade3D />
      </div>

      {/* Scroll to Explore Indicator */}
      <div
        className="relative z-10 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300 mt-2 mb-4"
        style={{ opacity }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-mono animate-pulse">
          Scroll to enter single-bottle deep dive
        </span>
        <div className="w-4 h-7 rounded-full border border-[#d4af37]/50 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
        </div>
      </div>
    </section>
  );
};


