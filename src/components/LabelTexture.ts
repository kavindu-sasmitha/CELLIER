import * as THREE from "three";
import { Product } from "@/data/products";

export function createLabelTexture(product: Product): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base background
  ctx.fillStyle = product.labelColor || "#f4eee1";
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle paper grain / texture lines
  ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
  for (let i = 0; i < 512; i += 4) {
    ctx.fillRect(0, i, 1024, 1.5);
  }

  // Determine contrast text color
  const hex = product.labelColor.replace("#", "");
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDarkLabel = brightness < 128;

  const textColor = isDarkLabel ? "#f5efe6" : "#1a130b";
  const accentColor = product.accentColor;
  const subtleTextColor = isDarkLabel ? "rgba(245, 239, 230, 0.7)" : "rgba(26, 19, 11, 0.65)";

  // Luxury borders
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 952, 440);

  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 936, 424);

  // Corner ornaments
  const corners = [
    [54, 54],
    [970, 54],
    [54, 458],
    [970, 458],
  ];
  ctx.fillStyle = accentColor;
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top header / category
  ctx.textAlign = "center";
  ctx.fillStyle = accentColor;
  ctx.font = "bold 24px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "6px";
  ctx.fillText(
    product.subCategory?.toUpperCase() || product.category.toUpperCase(),
    512,
    115
  );

  // Decorative divider
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(340, 140);
  ctx.lineTo(684, 140);
  ctx.stroke();

  // Diamond center ornament
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(512, 134);
  ctx.lineTo(518, 140);
  ctx.lineTo(512, 146);
  ctx.lineTo(506, 140);
  ctx.closePath();
  ctx.fill();

  // Brand / Product Name
  ctx.fillStyle = textColor;
  ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "1px";

  // Fit long names if needed
  const words = product.name.split(" ");
  if (words.length > 2 && product.name.length > 20) {
    const line1 = words.slice(0, 2).join(" ");
    const line2 = words.slice(2).join(" ");
    ctx.fillText(line1, 512, 220);
    ctx.fillText(line2, 512, 285);
  } else {
    ctx.fillText(product.name, 512, 245);
  }

  // Small crest or stars
  ctx.fillStyle = accentColor;
  ctx.font = "20px serif";
  ctx.fillText("★   ★   ★", 512, 335);

  // Bottom info (ABV, Volume, Origin)
  ctx.fillStyle = subtleTextColor;
  ctx.font = "500 24px 'Inter', sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(`${product.abv} ABV  •  ${product.volume}  •  ESTATE BOTTLED`, 512, 390);

  ctx.font = "italic 18px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = subtleTextColor;
  ctx.fillText("Grand Reserve Handcrafted Edition", 512, 435);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.anisotropy = 8;
  return texture;
}

