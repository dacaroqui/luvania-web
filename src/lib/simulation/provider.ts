import type { HairPose } from "./hair-tracker";

export function photoCanvas(source: CanvasImageSource, width: number, height: number) {
  if (!width || !height) throw new Error("La foto no tiene dimensiones.");
  const scale = Math.min(1, 960 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la foto.");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function readPhoto(file: File) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (bitmap) {
      try {
        return photoCanvas(bitmap, bitmap.width, bitmap.height);
      } finally {
        bitmap.close();
      }
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return photoCanvas(image, image.naturalWidth, image.naturalHeight);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function random(index: number) {
  const value = Math.sin(index * 127.1 + 31.7) * 43758.5453;
  return value - Math.floor(value);
}

function hairTone(context: CanvasRenderingContext2D, x: number, y: number, radius: number, angle: number) {
  const points = [-0.76, -0.58, -0.37, 0.37, 0.58, 0.76];
  const samples = points.map((point) => {
    const offset = point * radius;
    const nx = Math.floor(Math.min(context.canvas.width - 1, Math.max(0, x + offset * Math.cos(angle))));
    const ny = Math.floor(Math.min(context.canvas.height - 1, Math.max(0, y + offset * Math.sin(angle) - radius * 0.1)));
    const [r, g, b] = context.getImageData(nx, ny, 1, 1).data;
    return { r, g, b, light: r * 0.22 + g * 0.7 + b * 0.08 };
  }).sort((a, b) => a.light - b.light);
  const sample = samples[1];
  const factor = sample.light > 95 ? 0.46 : 0.74;
  return [Math.max(13, Math.round(sample.r * factor)), Math.max(10, Math.round(sample.g * factor)), Math.max(9, Math.round(sample.b * factor))].join(" ");
}

export function paintDensity(context: CanvasRenderingContext2D, pose: HairPose, tone: string) {
  const { width, height } = context.canvas;
  const x = pose.x * width;
  const y = pose.y * height;
  const rx = pose.width * width / 2;
  const depth = pose.height * height;
  if (rx < 8 || depth < 6) return;

  context.save();
  context.translate(x, y);
  context.rotate(pose.angle);
  context.scale(rx, depth);
  // Soft, shallow sides keep the texture on the upper scalp and off the eyes.
  context.beginPath();
  context.moveTo(-0.97, -0.07);
  context.bezierCurveTo(-0.90, -0.83, -0.50, -0.94, 0, -0.94);
  context.bezierCurveTo(0.50, -0.94, 0.90, -0.83, 0.97, -0.07);
  context.bezierCurveTo(0.68, 0.03, 0.53, -0.09, 0.35, 0.02);
  context.quadraticCurveTo(0, 0.20, -0.35, 0.02);
  context.bezierCurveTo(-0.53, -0.09, -0.68, 0.03, -0.97, -0.07);
  context.clip();

  const shade = context.createRadialGradient(0, -0.42, 0.1, 0, -0.42, 0.96);
  shade.addColorStop(0, `rgb(${tone} / 0.72)`);
  shade.addColorStop(0.65, `rgb(${tone} / 0.51)`);
  shade.addColorStop(1, `rgb(${tone} / 0)`);
  context.fillStyle = shade;
  context.fillRect(-1, -1, 2, 1.3);
  for (let style = 0; style < 3; style += 1) {
    context.beginPath();
    for (let index = style; index < 540; index += 3) {
      const px = random(index * 5) * 1.94 - 0.97;
      const py = random(index * 5 + 1) * 1.04 - 0.94;
      const length = 0.026 + random(index * 5 + 2) * 0.09;
      const sweep = -px * 0.06 + (random(index * 5 + 3) - 0.5) * 0.095;
      context.moveTo(px, py);
      context.quadraticCurveTo(px + sweep * 0.35, py - length * 0.58, px + sweep, py - length);
    }
    context.lineCap = "round";
    context.lineWidth = (style === 2 ? 0.78 : 0.58) / rx;
    context.strokeStyle = style === 2 ? "rgb(234 203 170 / 0.17)" : `rgb(${tone} / ${style === 0 ? 0.58 : 0.35})`;
    context.stroke();
  }
  context.restore();
}

export function sampleHairTone(context: CanvasRenderingContext2D, pose: HairPose) {
  const { width, height } = context.canvas;
  return hairTone(context, pose.x * width, pose.y * height, pose.width * width / 2, pose.angle);
}
