export type ProductCategory = "Wine" | "Whisky" | "Vodka" | "Rum" | "Arrack" | "Gin" | "Beer";
export type BottleShape = "wine" | "spirit" | "beerBottle" | "can";

export interface Product {
  id: number;
  name: string;
  brand: string;
  brandSlug?: string;
  category: ProductCategory;
  subCategory?: string;
  abv: string;
  volume: string;
  priceLKR: number;
  notes: string;
  accentColor: string;
  bgFrom: string;
  bgTo: string;
  labelColor: string;
  glassColor: string;
  shape: BottleShape;
  image?: string | null;
  showcaseImage?: string;
  watermark?: string;
  lineageBadge?: string;
}

import rawProducts from "./products.json";

export const PRODUCTS: Product[] = rawProducts as Product[];

export const JOHNNIE_WALKER_SHOWCASE: Product[] = [
  {
    id: 10083,
    name: "Johnnie Walker Red Label",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "Pioneer Blended Scotch",
    abv: "43%",
    volume: "750 ml",
    priceLKR: 11450,
    notes: "The pioneer blend that introduced Johnnie Walker to the world. A bold, vibrant combination of spicy Speyside malts and smoky West Coast character, bursting with fresh apple crisp, cinnamon spice, and sweet vanilla.",
    accentColor: "#ef4444",
    bgFrom: "#1f0606",
    bgTo: "#450a0a",
    labelColor: "#dc2626",
    glassColor: "#92400e",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-red-label.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-red-label.png",
    watermark: "RED LABEL",
    lineageBadge: "PIONEER BLEND • SINCE 1820"
  },
  {
    id: 10085,
    name: "Johnnie Walker Black Label",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "12 Year Old Blended Scotch",
    abv: "40%",
    volume: "750 ml",
    priceLKR: 17950,
    notes: "Recognized worldwide as the benchmark of deluxe scotch blends, aged for a minimum of 12 years across the four corners of Scotland. Unmistakably smooth, deep character laden with rich dark fruits, sweet creamy vanilla, and signature peat smoke.",
    accentColor: "#d4af37",
    bgFrom: "#0c0c0c",
    bgTo: "#281f08",
    labelColor: "#18181b",
    glassColor: "#92400e",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-black-label.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-black-label.png",
    watermark: "BLACK LABEL",
    lineageBadge: "AGED 12 YEARS • THE BENCHMARK"
  },
  {
    id: 10089,
    name: "Johnnie Walker Double Black",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "Intense Blended Scotch",
    abv: "40%",
    volume: "750 ml",
    priceLKR: 27150,
    notes: "An intensely smoky interpretation of Black Label, amplified by deeply charred oak maturation and peaty West Coast malts. Delivers smoldering campfire peat, rich stewed raisins, dark roasted spices, and roasted coffee nuances.",
    accentColor: "#ca8a04",
    bgFrom: "#080808",
    bgTo: "#261704",
    labelColor: "#18181b",
    glassColor: "#78350f",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-double-black.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-double-black.png",
    watermark: "DOUBLE BLACK",
    lineageBadge: "HEAVILY CHARRED CASKS • SMOKY"
  },
  {
    id: 10087,
    name: "Johnnie Walker Gold Label Reserve",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "Celebration Blended Scotch",
    abv: "40%",
    volume: "750 ml",
    priceLKR: 36800,
    notes: "A celebratory masterpiece centered on Clynelish single malt with natural Highland gold water. Silky smooth, opulent honeyed sweetness, creamy vanilla, glazed orchard fruit, and gentle lingering embers of sweet wood smoke.",
    accentColor: "#facc15",
    bgFrom: "#171203",
    bgTo: "#423207",
    labelColor: "#facc15",
    glassColor: "#b45309",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-gold-label-reserve.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-gold-label-reserve.png",
    watermark: "GOLD LABEL",
    lineageBadge: "THE CELEBRATION BLEND"
  },
  {
    id: 29794,
    name: "Johnnie Walker Aged 18 Year Old",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "18 Year Old Master Blend",
    abv: "40%",
    volume: "750 ml",
    priceLKR: 74650,
    notes: "Crafted by the Master Blender from up to 18 distinct whiskies, each matured for at least 18 long years. Intensely complex aromas of sweet compote, warm spice, creamy toffee, candied peel, and a velvety lingering finish.",
    accentColor: "#f59e0b",
    bgFrom: "#170e05",
    bgTo: "#3d1f08",
    labelColor: "#e0a96d",
    glassColor: "#92400e",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-aged-18-years.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-aged-18-years.png",
    watermark: "AGED 18 YEARS",
    lineageBadge: "18 PRECIOUS YEARS • MASTER RESERVE"
  },
  {
    id: 16379,
    name: "Johnnie Walker Blue Label",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "Prestige Rare Cask Blend",
    abv: "40%",
    volume: "750 ml",
    priceLKR: 140300,
    notes: "An unrivaled icon crafted from Scotland's rarest casks, where only 1 in 10,000 possesses the peerless character. Waves of rich honey, roasted hazelnuts, dark bittersweet chocolate, sandalwood, and a signature lingering floral smoke.",
    accentColor: "#3b82f6",
    bgFrom: "#050e24",
    bgTo: "#0e2963",
    labelColor: "#1e3a8a",
    glassColor: "#1e40af",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-blue-label.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-blue-label.png",
    watermark: "BLUE LABEL",
    lineageBadge: "THE PINNACLE • 1 IN 10,000 CASKS"
  },
  {
    id: 71803,
    name: "Johnnie Walker Blonde",
    brand: "Johnnie Walker",
    brandSlug: "johnnie-walker",
    category: "Whisky",
    subCategory: "Vibrant Blended Scotch",
    abv: "40%",
    volume: "700 ml",
    priceLKR: 14800,
    notes: "Crafted specifically for refreshing highballs and sunset mixing. Matured in fresh American oak casks for bright, sun-kissed sweetness, bursting with lush toffee caramel, crisp summer berries, and light citrus vanilla sparkle.",
    accentColor: "#fbbf24",
    bgFrom: "#1c1202",
    bgTo: "#452c04",
    labelColor: "#fbbf24",
    glassColor: "#d97706",
    shape: "spirit",
    image: "/products/johnnie-walker/showcase/johnnie-walker-blonde.png",
    showcaseImage: "/products/johnnie-walker/showcase/johnnie-walker-blonde.png",
    watermark: "JOHNNIE BLONDE",
    lineageBadge: "SUN-KISSED & VIBRANT BLEND"
  }
];

export const BEER_SHOWCASE: Product[] = [
  {
    id: 9001,
    name: "Heineken Original Lager",
    brand: "Heineken",
    brandSlug: "heineken",
    category: "Beer",
    subCategory: "Premium European Lager",
    abv: "5.0%",
    volume: "330 ml",
    priceLKR: 950,
    notes: "World-renowned Dutch golden lager brewed with 100% pure malt, pristine water, selected hops, and Heineken's exclusive A-Yeast. Delivers a perfectly balanced crisp taste with subtle fruity green hop notes.",
    accentColor: "#22c55e",
    bgFrom: "#021a0a",
    bgTo: "#053d16",
    labelColor: "#16a34a",
    glassColor: "#15803d",
    shape: "beerBottle",
    image: "/products/beers/showcase/heineken-original-lager.png",
    showcaseImage: "/products/beers/showcase/heineken-original-lager.png",
    watermark: "HEINEKEN",
    lineageBadge: "PURE MALT LAGER • AMSTERDAM 1873"
  },
  {
    id: 9002,
    name: "Lion Lager",
    brand: "Lion Brewery Ceylon",
    brandSlug: "lion",
    category: "Beer",
    subCategory: "Sri Lankan Golden Lager",
    abv: "4.8%",
    volume: "500 ml Can",
    priceLKR: 650,
    notes: "Sri Lanka's iconic golden lager brewed in the central highlands since 1881. Traditional brewing methods, roasted malt, and fine Styrian hops create a rich golden amber body with a frothy head, mild maltiness, and a clean refreshing finish.",
    accentColor: "#eab308",
    bgFrom: "#1f1402",
    bgTo: "#3d2704",
    labelColor: "#ca8a04",
    glassColor: "#b45309",
    shape: "can",
    image: "/products/beers/showcase/lion-lager-can.png",
    showcaseImage: "/products/beers/showcase/lion-lager-can.png",
    watermark: "LION LAGER",
    lineageBadge: "CEYLON HERITAGE • SINCE 1881"
  },
  {
    id: 9003,
    name: "Carlsberg Danish Pilsner",
    brand: "Carlsberg",
    brandSlug: "carlsberg",
    category: "Beer",
    subCategory: "All-Malt Danish Pilsner",
    abv: "5.0%",
    volume: "500 ml Can",
    priceLKR: 750,
    notes: "Probably the best beer in the world. Crafted in Copenhagen since 1847 using Danish barley malt and aromatic hops. Features a crisp, refreshing profile with pleasant hoppy bitterness, subtle citrus aroma, and a light smooth malt body.",
    accentColor: "#16a34a",
    bgFrom: "#021c0e",
    bgTo: "#063d1d",
    labelColor: "#15803d",
    glassColor: "#166534",
    shape: "can",
    image: "/products/beers/showcase/carlsberg-danish-pilsner.png",
    showcaseImage: "/products/beers/showcase/carlsberg-danish-pilsner.png",
    watermark: "CARLSBERG",
    lineageBadge: "DANISH PILSNER • COPENHAGEN 1847"
  },
  {
    id: 9004,
    name: "Corona Extra",
    brand: "Corona",
    brandSlug: "corona",
    category: "Beer",
    subCategory: "Cerveza Clara Especial",
    abv: "4.5%",
    volume: "355 ml",
    priceLKR: 1150,
    notes: "The world's quintessential beachside golden cerveza from Mexico. Light, sun-drenched golden color with a smooth, exceptionally clean palate, subtle corn sweetness, and refreshing dryness best crowned with a fresh wedge of lime.",
    accentColor: "#38bdf8",
    bgFrom: "#081d2e",
    bgTo: "#0f3a5c",
    labelColor: "#0284c7",
    glassColor: "#eab308",
    shape: "beerBottle",
    image: "/products/beers/showcase/corona-extra.png",
    showcaseImage: "/products/beers/showcase/corona-extra.png",
    watermark: "CORONA EXTRA",
    lineageBadge: "LA CERVEZA MAS FINA • MEXICO"
  }
];

export const SHOWCASE_CATEGORIES: { categoryName: string; categoryKey: ProductCategory; items: Product[] }[] = [
  {
    categoryName: "The House of Johnnie Walker • Blended Scotch Vault",
    categoryKey: "Whisky",
    items: JOHNNIE_WALKER_SHOWCASE
  },
  {
    categoryName: "Chilled Draught & Cold Cans • World Beers",
    categoryKey: "Beer",
    items: BEER_SHOWCASE
  }
];

export const HERO_PARADE_PRODUCTS: Product[] = [
  ...JOHNNIE_WALKER_SHOWCASE,
  ...BEER_SHOWCASE
];
