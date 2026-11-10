"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Johnnie Walker", href: "#showcase-walker" },
    { label: "Chilled Beers", href: "#showcase-beers" },
    { label: "Cellar Collection", href: "#collection-grid" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? "bg-black/85 backdrop-blur-md py-4 border-b border-white/10 shadow-2xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] text-xs font-serif font-bold group-hover:scale-105 group-hover:border-[#d4af37] transition-all">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.18em] text-white uppercase group-hover:text-[#d4af37] transition-colors">
              CELLIÉR
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-mono -mt-1">
              Haute Spirits
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-[#d4af37] font-medium transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Cart Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            aria-label="Open Shopping Cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 hover:border-[#d4af37]/60 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 active:scale-95 cursor-pointer text-white"
          >
            <svg
              className="w-4 h-4 text-[#d4af37]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-xs uppercase tracking-widest font-mono text-zinc-200 hidden sm:inline">
              Cellar
            </span>
            <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black text-[10px] font-bold font-mono flex items-center justify-center">
              {totalCount}
            </span>
          </button>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 flex flex-col gap-4 mt-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-zinc-200 hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

