export function drawStridingMan(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1,
  color: string = "#d4af37"
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Top hat
  ctx.beginPath();
  ctx.ellipse(3, -48, 11, 2.5, 0.15, 0, Math.PI * 2); // Brim
  ctx.fill();
  ctx.fillRect(-2, -62, 10, 14); // Crown
  ctx.fillRect(-3, -50, 12, 3); // Hat band

  // Head & collar
  ctx.beginPath();
  ctx.arc(3, -42, 5, 0, Math.PI * 2);
  ctx.fill();

  // Red/Gold Tailcoat torso & chest
  ctx.beginPath();
  ctx.moveTo(1, -37);
  ctx.lineTo(8, -34);
  ctx.lineTo(12, -22);
  ctx.lineTo(4, -12);
  ctx.lineTo(-4, -12);
  ctx.lineTo(-6, -26);
  ctx.closePath();
  ctx.fill();

  // Sweeping coat tails trailing behind
  ctx.beginPath();
  ctx.moveTo(-4, -12);
  ctx.quadraticCurveTo(-18, -4, -24, 8);
  ctx.quadraticCurveTo(-14, 4, -2, -6);
  ctx.closePath();
  ctx.fill();

  // Leading arm & walking cane
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(7, -32);
  ctx.lineTo(16, -24);
  ctx.stroke();

  // Walking cane / stick
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(16, -25);
  ctx.lineTo(26, 28); // Cane tip on ground
  ctx.stroke();
  // Cane curved handle
  ctx.beginPath();
  ctx.arc(15, -27, 3, 0, Math.PI, true);
  ctx.stroke();

  // Trailing arm
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-4, -30);
  ctx.lineTo(-12, -20);
  ctx.stroke();

  // Striding legs
  // Front right leg (stepping boldly forward)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(3, -12);
  ctx.lineTo(10, 6);
  ctx.lineTo(16, 26);
  ctx.stroke();
  // Front boot
  ctx.beginPath();
  ctx.moveTo(16, 25);
  ctx.lineTo(22, 27);
  ctx.lineTo(18, 29);
  ctx.lineTo(14, 28);
  ctx.closePath();
  ctx.fill();

  // Rear left leg (thrust back)
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-2, -12);
  ctx.lineTo(-9, 4);
  ctx.lineTo(-17, 24);
  ctx.stroke();
  // Rear boot
  ctx.beginPath();
  ctx.moveTo(-17, 23);
  ctx.lineTo(-21, 26);
  ctx.lineTo(-17, 27);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
