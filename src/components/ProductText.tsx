"use client";

import React from "react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/cart";

interface ProductTextProps {
  product: Product;
  localProgress: number; // 0..1 for current active product
  reducedMotion?: boolean;
}

export const ProductText: React.FC<ProductTextProps> = ({
  product,
  localProgress,
  reducedMotion = false,
}) => {
  const addItem = useCartStore((state) => state.addItem);

  // Smoothstep threshold calculations
  // Fade in during first 15%, stable 15-85%, fade out last 15%
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  let opacity = 1;
  let translateY = 0;

  if (!reducedMotion) {
    const fadeIn = clamp(localProgress / 0.15, 0, 1);
    const fadeOut = clamp((1 - localProgress) / 0.15, 0, 1);
    opacity = Math.min(fadeIn, fadeOut);
    translateY = (1 - fadeIn) * 24 - (1 - fadeOut) * 24;
  }

  const formatLKR = (amount: number) => `Rs. ${amount.toLocaleString("en-LK")}`;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-14 lg:p-20 max-w-7xl mx-auto w-full transition-opacity duration-300"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Top Bar / Category & Region Tag */}
      <div className="flex items-center justify-between pt-16 md:pt-10">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-lg transition-colors duration-500"
            style={{ backgroundColor: product.accentColor }}
          />
          <span
            className="text-xs uppercase tracking-[0.25em] font-medium font-sans transition-colors duration-500"
            style={{ color: product.accentColor }}
          >
            {product.lineageBadge || product.subCategory || product.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs tracking-[0.2em] uppercase text-zinc-400 font-light">
            {product.volume} • {product.abv} ABV
          </span>
        </div>
      </div>

      {/* Main Center/Bottom Story Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pb-8 md:pb-12">
        {/* Left Column: Title & Tasting Notes */}
        <div className="flex flex-col gap-3 max-w-lg">
          <span className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-mono">
            {product.brand ? `${product.brand.toUpperCase()} • ` : ""}LOT NO. {product.id}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.08]">
            {product.name}
          </h2>
          <p
            className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mt-2 border-l-2 pl-4 transition-colors duration-500"
            style={{ borderColor: `${product.accentColor}80` }}
          >
            {product.notes}
          </p>
        </div>

        {/* Right Column: Price & Add to Cart */}
        <div className="flex flex-col md:items-end gap-4">
          <div className="flex flex-col md:items-end">
            <span className="text-xs uppercase tracking-widest text-zinc-400">Bottled Price</span>
            <div
              className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif transition-colors duration-500"
              style={{ color: product.accentColor }}
            >
              {formatLKR(product.priceLKR)}
            </div>
            <span className="text-[11px] text-zinc-500 tracking-wider mt-0.5">
              Taxes included • Island-wide express delivery
            </span>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto mt-2">
            <button
              onClick={() => addItem(product, 1)}
              aria-label={`Add ${product.name} to cart`}
              className="group relative inline-flex items-center justify-center px-7 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-black transition-all duration-300 rounded cursor-pointer active:scale-95 shadow-lg"
              style={{
                backgroundColor: product.accentColor,
                boxShadow: `0 0 25px ${product.accentColor}55`,
              }}
            >
              <span>Add to Cellar</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
