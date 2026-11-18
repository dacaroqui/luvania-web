"use client";

import { useEffect, useRef } from "react";

const PALETTE = ["#ee876b", "#e07a62", "#f0a486", "#e2a84a", "#c9843a", "#f4c98a", "#fff8f2"];

type Spec = {
  u: number;
  v: number;
  amp: number;
  phase: number;
  freq: number;
  size: number;
  spin: number;
  spinSpeed: number;
  alpha: number;
  tri: boolean;
  color: string;
  nx: number;
  ny: number;
  speed: number;
  rim: boolean;
};

type Mask = {
  w: number;
  h: number;
  data: Uint8ClampedArray;
  ox: number;
  oy: number;
  iw: number;
  ih: number;
  sw: number;
  sh: number;
};

function alphaAt(mask: Mask, x: number, y: number) {
  const ix = Math.round(x);
  const iy = Math.round(y);
  if (ix < 0 || iy < 0 || ix >= mask.w || iy >= mask.h) return 0;
  return mask.data[(iy * mask.w + ix) * 4 + 3];
}

function measure(stage: HTMLElement, img: HTMLImageElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = img;
  while (node && node !== stage) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: img.offsetWidth, h: img.offsetHeight, sw: stage.clientWidth, sh: stage.clientHeight };
}

function build(img: HTMLImageElement, box: ReturnType<typeof measure>, mobile: boolean): { specs: Spec[]; mask: Mask } | null {
  const sampleW = mobile ? 150 : 210;
  const sampleH = Math.max(1, Math.round((sampleW * img.naturalHeight) / img.naturalWidth));
  const off = document.createElement("canvas");
  off.width = sampleW;
  off.height = sampleH;
  const offCtx = off.getContext("2d", { willReadFrequently: true });
  if (!offCtx || box.w < 8 || box.h < 8) return null;
  offCtx.drawImage(img, 0, 0, sampleW, sampleH);
  const data = offCtx.getImageData(0, 0, sampleW, sampleH).data;
  const mask: Mask = { w: sampleW, h: sampleH, data, ox: box.x, oy: box.y, iw: box.w, ih: box.h, sw: box.sw, sh: box.sh };

  const edges: { x: number; y: number; nx: number; ny: number }[] = [];
  const step = mobile ? 2 : 1;
  for (let y = 1; y < sampleH - 1; y += step) {
    for (let x = 1; x < sampleW - 1; x += step) {
      if (alphaAt(mask, x, y) < 150) continue;
      let tx = 0;
      let ty = 0;
      let open = 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
      ]) {
        if (alphaAt(mask, x + dx, y + dy) < 36) {
          tx += dx;
          ty += dy;
          open += 1;
        }
      }
      if (open < 1) continue;
      const len = Math.hypot(tx, ty) || 1;
      edges.push({ x, y, nx: tx / len, ny: ty / len });
    }
  }
  if (edges.length < 12) return null;

  const specs: Spec[] = [];
  const want = mobile ? 280 : 640;
  const stride = Math.max(1, Math.floor(edges.length / want));
  const scale = box.w / sampleW;

  for (let index = 0; index < edges.length; index += stride) {
    const edge = edges[index];
    const reach = ((mobile ? 8 : 12) + Math.random() * (mobile ? 26 : 40)) / scale;
    const ix = edge.x + edge.nx * reach;
    const iy = edge.y + edge.ny * reach;
    if (alphaAt(mask, ix, iy) > 70) continue;
    const px = box.x + (ix / sampleW) * box.w;
    const py = box.y + (iy / sampleH) * box.h;
    if (px < -24 || py < -24 || px > box.sw + 24 || py > box.sh + 36) continue;
    specs.push({
      u: px / box.sw,
      v: py / box.sh,
      amp: (mobile ? 14 : 20) + Math.random() * (mobile ? 26 : 38),
      phase: Math.random() * Math.PI * 2,
      freq: 0.85 + Math.random() * 0.7,
      size: (mobile ? 5.5 : 7) + Math.random() * (mobile ? 8 : 11),
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 1.8,
      alpha: 0.78 + Math.random() * 0.22,
      tri: Math.random() > 0.18,
      color: PALETTE[index % PALETTE.length],
      nx: edge.nx,
      ny: edge.ny,
      speed: 0,
      rim: true,
    });
  }

  const drifts = mobile ? 84 : 180;
  for (let index = 0; index < drifts; index += 1) {
    specs.push({
      u: box.x / box.sw + Math.random() * (box.w / box.sw),
      v: box.y / box.sh + Math.random() * (box.h / box.sh),
      amp: 8 + Math.random() * 16,
      phase: Math.random() * Math.PI * 2,
      freq: 0.55 + Math.random() * 0.4,
      size: (mobile ? 8 : 11) + Math.random() * 10,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 2.2,
      alpha: 0.62 + Math.random() * 0.3,
      tri: true,
      color: PALETTE[index % PALETTE.length],
      nx: 0,
      ny: -1,
      speed: (Math.random() < 0.5 ? -1 : 1) * (0.045 + Math.random() * 0.09),
      rim: false,
    });
  }

  return { specs, mask };
}

function paint(ctx: CanvasRenderingContext2D, spec: Spec, x: number, y: number, spin: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.globalAlpha = spec.alpha;
  ctx.fillStyle = spec.color;
  if (spec.tri) {
    const s = spec.size;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.62);
    ctx.lineTo(s * 0.58, s * 0.48);
    ctx.lineTo(-s * 0.58, s * 0.48);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, spec.size * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const bleed = 64;
    let specs: Spec[] = [];
    let mask: Mask | null = null;
    let viewW = 0;
    let viewH = 0;
    let raf = 0;
    let visible = true;

    const outside = (x: number, y: number) => {
      if (!mask) return true;
      const ix = ((x - mask.ox) / mask.iw) * mask.w;
      const iy = ((y - mask.oy) / mask.ih) * mask.h;
      return alphaAt(mask, ix, iy) < 88;
    };

    const resize = () => {
      const img = stage.querySelector<HTMLImageElement>(".hero-portrait");
      viewW = stage.clientWidth + bleed * 2;
      viewH = stage.clientHeight + bleed * 2;
      canvas.style.left = `-${bleed}px`;
      canvas.style.top = `-${bleed}px`;
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
      const dpr = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.2 : 1.45);
      canvas.width = Math.max(1, Math.floor(viewW * dpr));
      canvas.height = Math.max(1, Math.floor(viewH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!img || !img.complete || !img.naturalWidth) {
        img?.addEventListener("load", resize, { once: true });
        return;
      }
      const laid = measure(stage, img);
      const built = build(
        img,
        { ...laid, x: laid.x + bleed, y: laid.y + bleed, sw: viewW, sh: viewH },
        mobileQuery.matches,
      );
      if (!built) return;
      specs = built.specs;
      mask = built.mask;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, viewW, viewH);
      if (!mask) return;
      const t = reduce.matches ? 0.65 : now / 1000;
      const sway = Math.sin(t * 1.15) * (mobileQuery.matches ? 22 : 46);
      for (const spec of specs) {
        let x = spec.u * viewW;
        let y = spec.v * viewH;
        if (spec.rim) {
          x += Math.sin(t * spec.freq + spec.phase) * spec.amp + sway;
          y += Math.cos(t * spec.freq * 0.72 + spec.phase) * 8;
        } else {
          const travel = ((spec.u + t * spec.speed) % 1 + 1) % 1;
          x = mask.ox + travel * mask.iw;
          y += Math.sin(t * spec.freq + spec.phase) * spec.amp;
        }
        if (!outside(x, y)) {
          x += spec.nx * spec.size * 1.8;
          y += spec.ny * spec.size * 1.8;
          if (!outside(x, y)) continue;
        }
        paint(ctx, spec, x, y, spec.spin + t * spec.spinSpeed);
      }
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(stage);
    resize();
    if (reduce.matches) draw(0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />;
}
