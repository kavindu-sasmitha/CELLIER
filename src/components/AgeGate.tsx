"use client";

import React, { useState, useEffect } from "react";

export const AgeGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    try {
      const verified = sessionStorage.getItem("winestore_age_verified");
      if (!verified) {
        setIsOpen(true);
      }
    } catch {
      // If sessionStorage fails (e.g. private mode restrictions), fallback to showing modal once
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    try {
      sessionStorage.setItem("winestore_age_verified", "true");
    } catch {
      // Ignore sessionStorage errors
    }
    setIsOpen(false);
  };

  const handleDeny = () => {
    setIsDenied(true);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 transition-all duration-500"
    >
      <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#0f0e0d] border border-[#d4af37]/30 shadow-[0_0_60px_rgba(212,175,55,0.15)] text-center text-white">
        {/* Luxury Crest Badge */}
        <div className="mx-auto w-16 h-16 mb-6 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#1a1610] text-[#d4af37] shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {!isDenied ? (
          <>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#d4af37] font-mono">
              Legal Age Verification
            </span>
            <h2 id="age-gate-title" className="text-2xl sm:text-3xl font-bold font-serif mt-2 mb-3">
              Are you 21 years or older?
            </h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
              This digital cellar curates alcoholic beverages. In accordance with legal regulations in Sri Lanka and internationally, you must be of legal drinking age to explore our vintage collections.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#d4af37] hover:bg-[#e4c25c] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                Yes, I am 21+
              </button>
              <button
                onClick={handleDeny}
                className="w-full sm:w-auto px-8 py-3.5 rounded border border-white/20 hover:border-white/40 text-zinc-400 hover:text-white font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/5 active:scale-95 cursor-pointer"
              >
                No, Under 21
              </button>
            </div>

            <p className="mt-8 text-[11px] text-zinc-500 tracking-wider">
              Enjoy Responsibly • Alcohol strictly prohibited to minors
            </p>
          </>
        ) : (
          <div className="py-6">
            <h3 className="text-xl font-serif text-[#d4af37] mb-2">Access Restricted</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              You must be of legal drinking age (21+) to enter this website. Thank you for your understanding.
            </p>
            <a
              href="https://www.google.com"
              className="inline-block px-6 py-2.5 rounded border border-white/20 text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:border-white"
            >
              Exit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

