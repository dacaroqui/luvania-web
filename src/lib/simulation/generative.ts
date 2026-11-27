import type { HairPose } from "./hair-tracker";
import type { DensityStyle } from "./provider";

const size = 1024;

function frame() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  return { canvas, ctx };
}

function blob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error("captura")), "image/png");
  });
}

export function captureHairEdit(source: HTMLCanvasElement, pose: HairPose, style: DensityStyle) {
  const original = frame();
  const selection = frame();
  const mask = frame();
  const edge = Math.min(source.width, source.height);
  const x = Math.max(0, Math.min(source.width - edge, pose.x * source.width - edge / 2));
  const y = Math.max(0, Math.min(source.height - edge, pose.y * source.height - edge * 0.32));
  const scale = size / edge;
  const headX = (pose.x * source.width - x) * scale;
  const headY = (pose.y * source.height - y) * scale;
  const width = Math.max(65, pose.width * source.width * scale * 0.58);
  const depth = Math.max(50, pose.height * source.height * scale);
  const upper = style === "femenino" ? 1.38 : 1.12;

  original.ctx.drawImage(source, x, y, edge, edge, 0, 0, size, size);
  selection.ctx.translate(headX, headY);
  selection.ctx.rotate(pose.angle);
  selection.ctx.scale(width, depth);
  const gradient = selection.ctx.createRadialGradient(0, -0.5, 0.22, 0, -0.5, 0.88);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.78, "white");
  gradient.addColorStop(1, "transparent");
  selection.ctx.fillStyle = gradient;
  selection.ctx.beginPath();
  selection.ctx.ellipse(0, -0.48, 1, upper * 0.64, 0, 0, Math.PI * 2);
  selection.ctx.fill();
  selection.ctx.resetTransform();

  mask.ctx.fillRect(0, 0, size, size);
  mask.ctx.globalCompositeOperation = "destination-out";
  mask.ctx.drawImage(selection.canvas, 0, 0);

  return {
    original: original.canvas,
    async generate(signal: AbortSignal) {
      const [photo, cut] = await Promise.all([blob(original.canvas), blob(mask.canvas)]);
      const form = new FormData();
      form.append("image", photo, "captura.png");
      form.append("mask", cut, "zona-capilar.png");
      form.append("style", style);
      form.append("consent", "true");
      const response = await fetch("/api/simulacion/capilar", { method: "POST", body: form, signal });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || "No pudimos generar la simulación.");
      }
      const edited = await createImageBitmap(await response.blob());
      try {
        const final = frame();
        final.ctx.drawImage(edited, 0, 0, size, size);
        final.ctx.globalCompositeOperation = "destination-in";
        final.ctx.drawImage(selection.canvas, 0, 0);
        final.ctx.globalCompositeOperation = "destination-over";
        final.ctx.drawImage(original.canvas, 0, 0);
        return final.canvas;
      } finally {
        edited.close();
      }
    },
  };
}
