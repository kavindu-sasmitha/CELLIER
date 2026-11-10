"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ScrollShowcase } from "@/components/ScrollShowcase";
import { CollectionGrid } from "@/components/CollectionGrid";
import { Footer } from "@/components/Footer";
import { SHOWCASE_CATEGORIES } from "@/data/products";

export default function Home() {
  const walker = SHOWCASE_CATEGORIES[0].items;
  const beers = SHOWCASE_CATEGORIES[1].items;

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      {/* Fixed Luxury Minimalist Navbar */}
      <Navbar />

      {/* Cinematic Hero Entrance */}
      <Hero />

      {/* 3D Scroll Showcase 1: The House of Johnnie Walker Master Collection */}
      <ScrollShowcase
        sectionId="showcase-walker"
        categoryTitle="The House of Walker • Blended Scotch Vault"
        categoryBadge="Johnnie Walker"
        products={walker}
      />

      {/* 3D Scroll Showcase 2: Chilled Draught & Cold Cans */}
      <ScrollShowcase
        sectionId="showcase-beers"
        categoryTitle="Chilled Draught & Cold Cans • World Beers"
        categoryBadge="Chilled Beers"
        products={beers}
      />

      {/* Full Curated Collection Grid with Filters & Search */}
      <CollectionGrid />

      {/* Luxury Footer & Legal Disclaimers */}
      <Footer />
    </main>
  );
}
