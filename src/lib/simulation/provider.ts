import type { HairMask, HairPose } from "./hair-tracker";

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

export type DensityStyle = "masculino" | "femenino";
export type DensityMask = HairMask & { weights: Float32Array; offsetX: Int8Array; offsetY: Int8Array };

const hair = 1;
const skin = 3;

export function prepareDensityMask(mask: HairMask, style: DensityStyle): DensityMask {
  const { width, height, pixels } = mask;
  const weights = new Float32Array(pixels.length);
  const offsetX = new Int8Array(pixels.length);
  const offsetY = new Int8Array(pixels.length);
  const reach = style === "masculino" ? Math.max(3, Math.round(width * 0.028)) : Math.max(2, Math.round(width * 0.015));

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      if (pixels[index] !== skin) continue;
      for (let distance = 1; distance <= reach; distance += 1) {
        const left = x >= distance && pixels[index - distance] === hair;
        const right = x + distance < width && pixels[index + distance] === hair;
        const above = y >= distance && pixels[index - distance * width] === hair;
        if (style === "femenino") {
          // Fill a narrow part only when there are real strands on both sides.
          const otherLeft = x >= reach && pixels[index - reach] === hair;
          const otherRight = x + reach < width && pixels[index + reach] === hair;
          if (!(left && otherRight) && !(right && otherLeft)) continue;
        } else if (!above && !left && !right) {
          continue;
        }
        offsetX[index] = above && style === "masculino" ? 0 : left ? -distance : distance;
        offsetY[index] = above && style === "masculino" ? -distance : 0;
        weights[index] = 1 - (distance - 1) / reach;
        break;
      }
    }
  }

  return { ...mask, weights, offsetX, offsetY };
}

export function paintDensity(
  context: CanvasRenderingContext2D,
  pose: HairPose,
  mask: DensityMask,
  maskPose: HairPose,
  style: DensityStyle,
) {
  const { width, height } = context.canvas;
  const x = pose.x * width;
  const y = pose.y * height;
  const span = pose.width * width;
  const depth = pose.height * height;
  const left = Math.max(0, Math.floor(x - span * 0.64));
  const right = Math.min(width, Math.ceil(x + span * 0.64));
  const top = Math.max(0, Math.floor(y - depth * 1.3));
  const bottom = Math.min(height, Math.ceil(y + depth * 0.66));
  if (right <= left || bottom <= top) return;

  const data = context.getImageData(0, 0, width, height);
  const patch = context.getImageData(left, top, right - left, bottom - top);
  const cos = Math.cos(pose.angle);
  const sin = Math.sin(pose.angle);
  const mx = mask.width / width;
  const my = mask.height / height;
  const shiftX = (pose.x - maskPose.x) * width;
  const shiftY = (pose.y - maskPose.y) * height;
  for (let py = top; py < bottom; py += 1) {
    for (let px = left; px < right; px += 1) {
      const across = (px - x) * cos + (py - y) * sin;
      const down = (py - y) * cos - (px - x) * sin;
      const edge = Math.min(1, (span * 0.57 - Math.abs(across)) / (span * 0.14), (depth * 0.48 - down) / (depth * 0.28));
      if (edge <= 0) continue;
      const maskX = Math.floor((px - shiftX) * mx);
      const maskY = Math.floor((py - shiftY) * my);
      if (maskX < 0 || maskY < 0 || maskX >= mask.width || maskY >= mask.height) continue;
      const index = maskY * mask.width + maskX;
      const weight = mask.weights[index];
      const actualHair = mask.pixels[index] === hair;
      if (!weight && !actualHair) continue;
      const output = ((py - top) * patch.width + px - left) * 4;
      if (actualHair) {
        const tint = 1 - edge * (style === "femenino" ? 0.15 : 0.2);
        for (let c = 0; c < 3; c += 1) patch.data[output + c] *= tint;
        continue;
      }
      const refX = Math.min(width - 1, Math.max(0, Math.round(px + mask.offsetX[index] / mx)));
      const refY = Math.min(height - 1, Math.max(0, Math.round(py + mask.offsetY[index] / my)));
      const reference = (refY * width + refX) * 4;
      const strand = style === "masculino"
        ? 0.73 + 0.22 * Math.sin(across * 2.1 + down * 1.17) ** 2
        : 0.88 + 0.12 * Math.cos(across * 0.8 + down * 0.08) ** 2;
      const alpha = edge * weight * strand * (style === "masculino" ? 0.88 : 0.73);
      for (let c = 0; c < 3; c += 1) {
        patch.data[output + c] = patch.data[output + c] * (1 - alpha) + data.data[reference + c] * alpha;
      }
    }
  }

  context.putImageData(patch, left, top);
}
