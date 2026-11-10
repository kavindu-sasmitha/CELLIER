"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Product } from "@/data/products";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { ProductText } from "./ProductText";

// Dynamic import with SSR disabled to prevent Three.js SSR hydration mismatches
const ProductScene = dynamic(() => import("./ProductScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-[#d4af37]/20 border-t-[#d4af37] animate-spin mb-4" />
      <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37]/70 font-mono">
        Loading Scotch Vault 3D...
      </span>
    </div>
  ),
});

interface ScrollShowcaseProps {
  categoryTitle: string;
  categoryBadge?: string;
  products: Product[];
  sectionId?: string;
}

export const ScrollShowcase: React.FC<ScrollShowcaseProps> = ({
  categoryTitle,
  categoryBadge,
  products,
  sectionId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, isInView } = useScrollProgress(containerRef);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Compute active product index and normalized progress within that specific product
  const numProducts = products.length;
  const { activeIndex, localProgress, currentProduct } = useMemo(() => {
    if (numProducts === 0) {
      return { activeIndex: 0, localProgress: 0, currentProduct: null };
    }
    const scaled = progress * numProducts;
    const idx = Math.min(Math.floor(scaled), numProducts - 1);
    const local = Math.min(Math.max(scaled - idx, 0), 1);
    return {
      activeIndex: idx,
      localProgress: local,
      currentProduct: products[idx],
    };
  }, [progress, numProducts, products]);

  if (!currentProduct) return null;

  // Height adapts to product count: ~80vh per bottle for smooth reading and viewing
  const containerHeightVh = Math.max(350, numProducts * 80);

  return (
    <section
      ref={containerRef}
      id={sectionId}
      className="relative w-full bg-black"
      style={{ height: `${containerHeightVh}vh` }}
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Dynamic Smooth Background Radial Gradient */}
        <div
          className="absolute inset-0 transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentProduct.bgTo} 0%, ${currentProduct.bgFrom} 65%, #050505 100%)`,
          }}
        />

        {/* Ambient Glow Aura */}
        <div
          className="absolute w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-30"
          style={{
            backgroundColor: currentProduct.accentColor,
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />

        {/* Dynamic Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            key={currentProduct.id}
            className="text-[13vw] font-serif font-black uppercase tracking-widest whitespace-nowrap leading-none transition-all duration-700 animate-fadeIn"
            style={{
              color: "rgba(255, 255, 255, 0.03)",
              textShadow: `0 0 80px ${currentProduct.accentColor}15`,
            }}
          >
            {currentProduct.watermark || categoryBadge || currentProduct.category}
          </span>
        </div>

        {/* Section Header Pin */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg">
            <span
              className="w-2 h-2 rounded-full transition-colors duration-500 animate-pulse"
              style={{ backgroundColor: currentProduct.accentColor }}
            />
            <span className="text-[11px] uppercase tracking-[0.22em] text-zinc-300 font-mono">
              {categoryTitle} • {activeIndex + 1} of {numProducts}
            </span>
          </div>
        </div>

        {/* 3D Canvas Stage */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {isInView && (
            <ProductScene
              product={currentProduct}
              scrollProgress={localProgress}
              reducedMotion={reducedMotion}
            />
          )}
        </div>

        {/* Animated Product Story Text Overlay */}
        <ProductText
          product={currentProduct}
          localProgress={localProgress}
          reducedMotion={reducedMotion}
        />

        {/* Vertical Step Indicator on Side */}
        <div className="hidden lg:flex flex-col gap-2.5 absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`w-1 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "h-8 shadow-[0_0_12px_currentColor]"
                  : "h-2 bg-white/20"
              }`}
              style={{
                backgroundColor: i === activeIndex ? p.accentColor : undefined,
                color: p.accentColor,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
