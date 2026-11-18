"use client";

import { useEffect, useRef } from "react";

const PALETTE = ["#ee876b", "#e07a62", "#f0a486", "#e2a84a", "#c9843a", "#f4c98a"];

type Particle = {
  x: number;
  y: number;
  speed: number;
  amp: number;
  phase: number;
  freq: number;
  size: number;
  spin: number;
  spinSpeed: number;
  alpha: number;
  tri: boolean;
};

type Group = { color: string; items: Particle[] };

function makeParticle(wide: boolean): Particle {
  const nearFigure = Math.random() < 0.72;
  return {
    x: nearFigure ? 0.34 + Math.random() * 0.7 : Math.random(),
    y: 0.02 + Math.random() * 0.96,
    speed: wide ? 0.055 + Math.random() * 0.16 : 0.07 + Math.random() * 0.18,
    amp: (nearFigure ? 0.04 : 0.02) + Math.random() * 0.07,
    phase: Math.random() * Math.PI * 2,
    freq: 0.85 + Math.random() * 1.6,
    size: 2.4 + Math.random() * (nearFigure ? 7.2 : 4.2),
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 2.2,
    alpha: 0.78 + Math.random() * 0.22,
    tri: Math.random() > 0.28,
  };
}

function seed(count: number): Group[] {
  const groups: Group[] = PALETTE.map((color) => ({ color, items: [] }));
  for (let index = 0; index < count; index += 1) {
    const bucket = groups[index % groups.length];
    bucket.items.push(makeParticle(count > 500));
  }
  return groups;
}

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 760px)");
    let groups = seed(mobile.matches ? 520 : 1500);
    let viewW = 0;
    let viewH = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const box = parent.getBoundingClientRect();
      viewW = box.width;
      viewH = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.25 : 1.5);
      canvas.width = Math.max(1, Math.floor(viewW * dpr));
      canvas.height = Math.max(1, Math.floor(viewH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, viewW, viewH);
      const t = now / 1000;
      const sway = Math.sin(t * 0.85) * viewW * 0.07;

      for (const group of groups) {
        ctx.fillStyle = group.color;
        for (const particle of group.items) {
          const travel = (particle.x + t * particle.speed) % 1;
          const wave = Math.sin(t * particle.freq + particle.phase);
          const x = travel * viewW + wave * particle.amp * viewW * 0.55 + sway;
          const y = particle.y * viewH + wave * particle.amp * viewH * 0.35;
          const size = particle.size;
          ctx.globalAlpha = particle.alpha;
          ctx.beginPath();
          if (particle.tri) {
            const angle = particle.spin + t * particle.spinSpeed;
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const place = (px: number, py: number, move: boolean) => {
              const rx = x + px * c - py * s;
              const ry = y + px * s + py * c;
              if (move) ctx.moveTo(rx, ry);
              else ctx.lineTo(rx, ry);
            };
            place(0, -size, true);
            place(size * 0.88, size * 0.72, false);
            place(-size * 0.88, size * 0.72, false);
            ctx.closePath();
          } else {
            ctx.arc(x, y, size * 0.55, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!visible || reduce.matches) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        draw(0);
        return;
      }
      if (visible) raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      const nextCount = mobile.matches ? 520 : 1500;
      const current = groups.reduce((sum, group) => sum + group.items.length, 0);
      if (current !== nextCount) groups = seed(nextCount);
      resize();
      if (reduce.matches) draw(0);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) start();
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );

    resize();
    observer.observe(parent);
    reduce.addEventListener("change", start);
    mobile.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      reduce.removeEventListener("change", start);
      mobile.removeEventListener("change", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />;
}
