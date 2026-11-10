# Celliér — Premium Wine & Spirits Store (Next.js)

An interactive, scroll-driven 3D product showcase website for a luxury wine and spirits store built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **React Three Fiber (Three.js)**, **Lenis**, and **Zustand**.

Integrated with live catalog data and original product photography from **[Ceylon Spirits](https://ceylonspirits.lk)** organized brand-by-brand.

---

## 🚀 Quick Start (Running Locally)

### 1. Development Mode
Run the development server locally:
```bash
cd winestore-fe
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Test
```bash
npm run build
npm run start
```

### 3. Linting & Type Checking
```bash
npm run lint
```

---

## 🏷️ Brand-by-Brand Catalog & Images (`public/products/`)

Over **484+ authentic product images** across **207 brands** have been downloaded directly from Ceylon Spirits and organized in brand-specific folders under `public/products/`:

```text
public/products/
├── absolut/                  # Absolut Vodka variants
├── bacardi/                  # Bacardi Rum selection
├── baileys/                  # Baileys Irish Cream
├── ballantines/              # Ballantine's Scotch Whisky
├── beefeater/                # Beefeater London Dry Gin
├── belvedere/                # Belvedere Vodka
├── carlsberg/                # Carlsberg Beer
├── chivas/                   # Chivas Regal 12, 18, Extra
├── colombo-gin/              # Colombo No. 7 Gin
├── dcsl/                     # DCSL Arrack & Spirits
├── glenfiddich/              # Glenfiddich Single Malts (12, 15, 18)
├── jack-daniels/             # Jack Daniel's Old No. 7, Honey
├── johnnie-walker/           # Red, Black, Double Black, Gold, Blue Label
├── lion/                     # Lion Lager, Lion Stout, Lion Strong
├── mcguigan-wines/           # McGuigan Australian Wines
├── rockland/                 # Rockland Old Arrack & Dry Gin
├── smirnoff/                 # Smirnoff Red, Flavors
└── ... (207 unique brand folders)
```

---

## 🍷 Features

1. **Brand-by-Brand Filtering & Search**:
   - Filter by Spirit Category: *Wine, Whisky, Vodka, Rum, Arrack, Gin, Beer*.
   - Filter by Brand Dropdown: *Over 207 brands sorted with item counts*.
   - Real-time search by name, brand, or tasting note.
2. **Authentic Ceylon Spirits Imagery**:
   - High-resolution product images in the Collection Grid and Slide-in Cart.
   - Smooth 3D perspective hover-tilt effect on product cards.
3. **Scroll-Driven 3D Story**:
   - Full 360° bottle rotation and dynamic lighting powered by Three.js & React Three Fiber.
   - Ambient background gradients smoothly transition according to each liquor's palette.
4. **Local Cart & WhatsApp Checkout**:
   - Full cart management with LKR pricing formatted as `Rs. 18,500`.
   - Pre-filled WhatsApp message generation for direct ordering in Sri Lanka.
5. **18+ Age Gate**:
   - Compliant age verification modal with `sessionStorage` state caching.
