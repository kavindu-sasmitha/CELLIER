"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black border-t border-white/10 text-white pt-20 pb-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] text-lg font-serif">✦</span>
            <span className="font-serif text-xl font-bold tracking-[0.2em] uppercase">
              CELLIÉR
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Sri Lanka’s premier digital purveyor of rare grand cru vintages, artisanal single malt whiskies, aged Ceylon halmilla arracks, and craft micro-brews.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-950/20 text-red-400 text-[10px] font-mono tracking-widest uppercase">
              21+ Only • Drink Responsibly
            </span>
          </div>
        </div>

        {/* Sommelier Cellar Location */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37]">
            Cellar &amp; Tasting Room
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No. 42/B, Ward Place, <br />
            Cinnamon Gardens (Colombo 07), <br />
            Western Province, Sri Lanka
          </p>
          <p className="text-xs text-zinc-500 font-mono pt-1">
            Concierge: +94 11 268 9400 <br />
            Sommelier: reserve@cellier.lk
          </p>
        </div>

        {/* Operating Hours */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37]">
            Vault Hours
          </h4>
          <ul className="text-xs text-zinc-400 space-y-2 font-mono">
            <li className="flex justify-between">
              <span>Monday – Thursday:</span>
              <span className="text-zinc-200">10:00 – 22:00</span>
            </li>
            <li className="flex justify-between">
              <span>Friday – Saturday:</span>
              <span className="text-zinc-200">10:00 – 23:30</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday:</span>
              <span className="text-zinc-200">12:00 – 20:00</span>
            </li>
            <li className="flex justify-between text-zinc-600">
              <span>Poya Holidays:</span>
              <span>Closed by Law</span>
            </li>
          </ul>
        </div>

        {/* WhatsApp VIP Concierge */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37]">
            Instant Concierge
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Looking for a vintage year, corporate tasting, or private cellar consignment? Our certified sommeliers are available on WhatsApp.
          </p>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-black border border-[#25d366]/40 text-xs uppercase tracking-widest font-mono font-medium transition-all duration-300"
          >
            <span>WhatsApp Sommelier</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.058-1.571-.328-1.196-.493-2.025-1.527-2.315-1.927-.291-.401-.734-1.077-.734-1.979 0-.903.469-1.349.636-1.533.167-.184.364-.23.486-.23.121 0 .243.001.349.006.111.005.26-.042.406.312.152.368.517 1.261.562 1.354.045.092.076.2.015.323-.061.121-.091.2-.182.307-.091.107-.191.24-.273.322-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.26.697.621 1.285.814 1.467.905.182.091.288.076.394-.046.106-.121.455-.53.576-.712.121-.182.243-.152.409-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.212.045.076.045.439-.099.844z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Legal & Notice Subfooter */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
        <div>
          &copy; {new Date().getFullYear()} Celliér Haute Wine &amp; Spirits Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>License No. EX/CLB/2024-89</span>
          <span>Terms of Tasting</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

