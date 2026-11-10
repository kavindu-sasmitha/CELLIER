"use client";

import React, { useState, useMemo, useRef } from "react";
import { PRODUCTS, Product, ProductCategory } from "@/data/products";
import { useCartStore } from "@/store/cart";

// 3D Card with interactive hover tilt & real downloaded bottle imagery
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const formatLKR = (amount: number) => `Rs. ${amount.toLocaleString("en-LK")}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      className="group relative rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/85 border border-white/10 hover:border-[#d4af37]/60 p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_20px_45px_rgba(212,175,55,0.14)]"
    >
      {/* Ambient Glow Accent */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity"
        style={{ backgroundColor: product.accentColor }}
      />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-white/10 bg-black/50"
            style={{ color: product.accentColor }}
          >
            {product.category}
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {product.volume} • {product.abv}
          </span>
        </div>

        {/* Real Product Photography from Ceylon Spirits */}
        <div className="relative w-full h-52 my-1 flex items-center justify-center overflow-hidden">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="max-h-48 max-w-full w-auto object-contain mx-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-108 transition-transform duration-300 pointer-events-none"
              loading="lazy"
            />
          ) : (
            // Procedural Graphic Fallback
            <div
              className="w-16 h-32 rounded-t-lg rounded-b-md border border-white/20 shadow-2xl relative flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${product.glassColor} 0%, #080808 100%)`,
                boxShadow: `0 10px 25px -5px ${product.accentColor}33`,
              }}
            >
              <div
                className="absolute -top-5 w-4 h-5 rounded-t-sm border border-white/20"
                style={{ backgroundColor: product.accentColor }}
              />
              <div
                className="w-12 h-12 rounded p-1 flex flex-col items-center justify-center text-center shadow-inner"
                style={{ backgroundColor: product.labelColor }}
              >
                <span className="text-[6px] font-serif font-black tracking-tighter text-black uppercase line-clamp-1">
                  {product.name}
                </span>
                <span className="text-[5px] font-mono text-zinc-700 mt-0.5">{product.abv}</span>
              </div>
            </div>
          )}
        </div>

        {/* Brand & Product Details */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#d4af37]">
              {product.brand}
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400 line-clamp-1">
              {product.subCategory}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-serif text-white group-hover:text-[#d4af37] transition-colors mt-1 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed font-light">
            {product.notes}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-mono">
            Ceylon Price
          </span>
          <span className="text-base sm:text-lg font-bold font-serif text-[#d4af37]">
            {formatLKR(product.priceLKR)}
          </span>
        </div>

        <button
          onClick={() => addItem(product, 1)}
          aria-label={`Add ${product.name} to cart`}
          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] text-white hover:text-black text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>Add</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const CollectionGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState<number>(24);

  const categories: (ProductCategory | "All")[] = [
    "All",
    "Wine",
    "Whisky",
    "Vodka",
    "Rum",
    "Arrack",
    "Gin",
    "Beer",
  ];

  // Extract unique brands sorted alphabetically with counts
  const brandList = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      const b = p.brand || "Other";
      counts[b] = (counts[b] || 0) + 1;
    });

    const sortedBrands = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Most products first
      .map(([name, count]) => ({ name, count }));

    return sortedBrands;
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All Brands" || product.brand === selectedBrand;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.subCategory &&
          product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Reset pagination when filters change
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  return (
    <section id="collection-grid" className="relative py-24 px-6 sm:px-10 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-mono">
              The Grand Cellar • {PRODUCTS.length} Curated Spirits
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Curated Spirits &amp; Vintage Collection
          </h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Directly sourced and categorized brand-by-brand from Sri Lanka&apos;s finest reserves. Discover imported single malts, classic champagnes, local coconut arracks, and craft beers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayCount(24);
            }}
            placeholder="Search by brand, name or tasting note..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
          <svg
            className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Bar: Category Tabs + Brand Selector */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 mb-8 border-b border-white/10">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayCount(24);
              }}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Brand Dropdown Filter */}
        <div className="flex items-center gap-3">
          <label htmlFor="brand-select" className="text-xs uppercase font-mono tracking-widest text-zinc-400 whitespace-nowrap">
            Brand:
          </label>
          <select
            id="brand-select"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setDisplayCount(24);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#111] border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono cursor-pointer"
          >
            <option value="All Brands">All Brands ({PRODUCTS.length})</option>
            {brandList.map(({ name, count }) => (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Count Indicator */}
      <div className="flex items-center justify-between mb-6 text-xs font-mono text-zinc-400">
        <span>
          Showing {visibleProducts.length} of {filteredProducts.length} liquors
          {selectedBrand !== "All Brands" && ` in ${selectedBrand}`}
        </span>
        {(selectedCategory !== "All" || selectedBrand !== "All Brands" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedBrand("All Brands");
              setSearchQuery("");
              setDisplayCount(24);
            }}
            className="text-[#d4af37] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Products */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < filteredProducts.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setDisplayCount((prev) => prev + 24)}
                className="px-8 py-3.5 rounded-full border border-[#d4af37] text-xs uppercase tracking-[0.2em] font-mono text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                Load More Liquors ({filteredProducts.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02]">
          <p className="text-zinc-400 text-sm">No liquors match your selected brand or search criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedBrand("All Brands");
              setSearchQuery("");
              setDisplayCount(24);
            }}
            className="mt-4 px-6 py-2 rounded-full border border-[#d4af37] text-xs uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
