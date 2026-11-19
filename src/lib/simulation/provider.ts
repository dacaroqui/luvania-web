export type SimulationRequest = {
  bitmap: ImageBitmap;
};

export type SimulationFrame = {
  before: HTMLCanvasElement;
  after: HTMLCanvasElement;
  mock: true;
  label: "Simulación de ejemplo";
};

export interface SimulationProvider {
  id: string;
  simulate(request: SimulationRequest): Promise<SimulationFrame>;
}

function frame(bitmap: ImageBitmap, paint: (ctx: CanvasRenderingContext2D, width: number, height: number) => void) {
  const max = 960;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  paint(ctx, canvas.width, canvas.height);
  return canvas;
}

/**
 * Velo suave en la zona superior. No es un resultado clínico ni un aumento de densidad real.
 * Se reemplaza por otro SimulationProvider cuando haya un modelo. Ver docs/simulacion.md.
 */
export const mockDensitySimulation: SimulationProvider = {
  id: "mock-densidad-superior",
  async simulate({ bitmap }) {
    const before = frame(bitmap, () => undefined);
    const after = frame(bitmap, (ctx, width, height) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, height * 0.36);
      ctx.clip();
      ctx.fillStyle = "rgba(74, 42, 32, 0.38)";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(42, 24, 18, 0.75)";
      ctx.lineWidth = 1.25;
      for (let index = 0; index < 90; index += 1) {
        const x = width * (0.24 + ((index * 47) % 100) / 100 * 0.52);
        const y = height * (0.05 + ((index * 19) % 100) / 100 * 0.26);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.6, y - 10);
        ctx.stroke();
      }
      ctx.restore();
    });
    bitmap.close();
    return { before, after, mock: true, label: "Simulación de ejemplo" };
  },
};
