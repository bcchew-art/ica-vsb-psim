import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

let _chevron: CanvasTexture | null = null;

export function getChevronStripeTexture(): CanvasTexture {
  if (_chevron) return _chevron;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // Base black
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, size, size);
  // Diagonal yellow stripes
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 14;
  ctx.lineCap = "square";
  for (let i = -size; i <= size * 2; i += 28) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  _chevron = texture;
  return texture;
}
