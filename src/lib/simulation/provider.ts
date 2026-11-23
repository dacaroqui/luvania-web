export type DensityOptions = { x: number; y: number; size: number; intensity: number };

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

export function paintDensity(context: CanvasRenderingContext2D, options: DensityOptions) {
  const { width, height } = context.canvas;
  if (options.intensity === 0) return;

  const centerX = options.x * width;
  const centerY = options.y * height;
  const radius = Math.min(width, height) * options.size;
  const radiusY = radius * 0.68;
  const left = Math.max(0, Math.floor(centerX - radius));
  const top = Math.max(0, Math.floor(centerY - radiusY));
  const right = Math.min(width, Math.ceil(centerX + radius));
  const bottom = Math.min(height, Math.ceil(centerY + radiusY));
  if (right <= left || bottom <= top) return;

  const patch = context.getImageData(left, top, right - left, bottom - top);
  const samples: { r: number; g: number; b: number; light: number }[] = [];
  for (let y = 0; y < patch.height; y += 5) {
    for (let x = 0; x < patch.width; x += 5) {
      const distance = Math.hypot((left + x - centerX) / radius, (top + y - centerY) / radiusY);
      if (distance > 0.96) continue;
      const offset = (y * patch.width + x) * 4;
      const [r, g, b] = patch.data.subarray(offset, offset + 3);
      samples.push({ r, g, b, light: r * 0.21 + g * 0.72 + b * 0.07 });
    }
  }
  samples.sort((a, b) => a.light - b.light);
  const shade = samples[Math.floor(samples.length * 0.18)] ?? { r: 58, g: 42, b: 36 };
  const strength = options.intensity / 100;

  for (let y = 0; y < patch.height; y += 1) {
    for (let x = 0; x < patch.width; x += 1) {
      const dx = (left + x - centerX) / radius;
      const dy = (top + y - centerY) / radiusY;
      const distance = Math.hypot(dx, dy);
      if (distance >= 1) continue;
      const edge = Math.min(1, (1 - distance) / 0.46);
      const opacity = edge * edge * strength * 0.52;
      const offset = (y * patch.width + x) * 4;
      const strand = 0.83 + 0.17 * Math.sin((dx * radius + dy * dy * radius * 0.43) * 1.15);
      patch.data[offset] = patch.data[offset] * (1 - opacity) + shade.r * strand * opacity;
      patch.data[offset + 1] = patch.data[offset + 1] * (1 - opacity) + shade.g * strand * opacity;
      patch.data[offset + 2] = patch.data[offset + 2] * (1 - opacity) + shade.b * strand * opacity;
    }
  }
  context.putImageData(patch, left, top);
}
