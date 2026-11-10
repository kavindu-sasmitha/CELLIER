"use client";

import React, { ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";
import { AgeGate } from "./AgeGate";
import { CartDrawer } from "./CartDrawer";

export const ClientProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />
      <AgeGate />
      <CartDrawer />
      {children}
    </>
  );
};

