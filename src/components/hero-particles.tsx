"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; a: number; s: number; p: number };

/** Polvo muy suave alrededor del retrato. La flor lleva el movimiento. */
export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dots: Dot[] = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.2 + Math.random() * 2.2,
      a: 0.12 + Math.random() * 0.22,
      s: 0.012 + Math.random() * 0.02,
      p: Math.random() * Math.PI * 2,
    }));
    let raf = 0;
    let visible = true;
    let viewW = 0;
    let viewH = 0;

    const resize = () => {
      viewW = stage.clientWidth;
      viewH = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(viewW * dpr));
      canvas.height = Math.max(1, Math.floor(viewH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, viewW, viewH);
      const t = reduce.matches ? 0 : now / 1000;
      for (const dot of dots) {
        const x = ((dot.x + t * dot.s) % 1) * viewW;
        const y = (dot.y + Math.sin(t * 0.35 + dot.p) * 0.012) * viewH;
        ctx.globalAlpha = dot.a;
        ctx.fillStyle = "#EE876B";
        ctx.beginPath();
        ctx.arc(x, y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
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
