"use client";

import React, { useEffect } from "react";
import { useCartStore } from "@/store/cart";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, setQty, removeItem, getTotalPrice, getTotalCount } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();

  const formatLKR = (amount: number) => `Rs. ${amount.toLocaleString("en-LK")}`;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    const orderLines = items.map(
      (item) => `• ${item.quantity}x ${item.product.name} (${formatLKR(item.product.priceLKR * item.quantity)})`
    );
    const message = `Hello Celliér, I would like to place an order:\n\n${orderLines.join(
      "\n"
    )}\n\nTotal: ${formatLKR(totalPrice)}\n\nPlease advise on delivery timing in Colombo.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/94771234567?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0b0a] border-l border-white/10 shadow-2xl flex flex-col justify-between text-white">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#d4af37] text-lg font-serif">✦</span>
              <div>
                <h3 className="text-lg font-serif font-bold tracking-wide">Cellar Cart</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {totalCount} {totalCount === 1 ? "bottle" : "bottles"} selected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close cart"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h4 className="font-serif text-lg text-zinc-300">Your Cellar is Empty</h4>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Explore our curated collections of rare wines, aged spirits, and craft beers.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex gap-4 items-center justify-between"
                >
                  {/* Left: Product Image & Title */}
                  <div className="flex items-center gap-3">
                    {item.product.image ? (
                      <div className="w-12 h-14 bg-white/[0.04] rounded-lg p-1 border border-white/10 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-12 w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-serif font-bold shadow-inner shrink-0"
                        style={{
                          backgroundColor: item.product.accentColor,
                          color: "#000",
                        }}
                      >
                        ✦
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">
                        {item.product.brand}
                      </span>
                      <h4 className="text-sm font-serif font-semibold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-300">
                        {formatLKR(item.product.priceLKR)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                      <button
                        onClick={() => setQty(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
                  Subtotal (LKR)
                </span>
                <span className="text-2xl font-bold font-serif text-[#d4af37]">
                  {formatLKR(totalPrice)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Applicable taxes included. Free courier delivery within Colombo on orders above Rs. 20,000.
              </p>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] cursor-pointer"
              >
                <span>Direct WhatsApp Order</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.058-1.571-.328-1.196-.493-2.025-1.527-2.315-1.927-.291-.401-.734-1.077-.734-1.979 0-.903.469-1.349.636-1.533.167-.184.364-.23.486-.23.121 0 .243.001.349.006.111.005.26-.042.406.312.152.368.517 1.261.562 1.354.045.092.076.2.015.323-.061.121-.091.2-.182.307-.091.107-.191.24-.273.322-.091.091-.186.19-.08.372.106.182.472.778 1.013 1.26.697.621 1.285.814 1.467.905.182.091.288.076.394-.046.106-.121.455-.53.576-.712.121-.182.243-.152.409-.091.167.061 1.061.5 1.243.591.182.091.303.136.349.212.045.076.045.439-.099.844z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

