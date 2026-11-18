"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Dos capas por pétalo: el wrapper solo recibe el parallax (translate3d)
 * y la imagen lleva la flotación en CSS. Así los transforms no se pisan.
 * El retrato no flota; solo tiene un parallax muy leve.
 */
export function HeroScene({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shellNode = shell.current;
    const portraitNode = portrait.current;
    const rightNode = right.current;
    const leftNode = left.current;
    if (!shellNode || !portraitNode || !rightNode || !leftNode) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const narrow = window.matchMedia("(max-width: 1023px)");

    let frame = 0;
    let scrollY = window.scrollY;
    let heroTop = 0;
    let pointerX = 0;
    let pointerY = 0;
    const current = { rx: 0, ry: 0, lx: 0, ly: 0, px: 0, py: 0 };
    const target = { rx: 0, ry: 0, lx: 0, ly: 0, px: 0, py: 0 };

    const measure = () => {
      heroTop = shellNode.getBoundingClientRect().top + window.scrollY;
    };

    const write = (node: HTMLDivElement, x: number, y: number) => {
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const clear = () => {
      portraitNode.style.transform = "";
      rightNode.style.transform = "";
      leftNode.style.transform = "";
      current.rx = current.ry = current.lx = current.ly = current.px = current.py = 0;
    };

    const step = () => {
      frame = 0;
      const scrollOn = fine.matches && !narrow.matches && !reduce.matches;
      const mouseOn = fine.matches && !reduce.matches;
      if (!scrollOn && !mouseOn) {
        clear();
        return;
      }

      const scrolled = scrollOn ? Math.max(0, scrollY - heroTop) : 0;
      const mx = mouseOn ? pointerX : 0;
      const my = mouseOn ? pointerY : 0;

      target.rx = mx * 24;
      target.ry = -scrolled * 0.25 + my * 20;
      target.lx = mx * -18;
      target.ly = -scrolled * 0.15 + my * 14;
      target.px = mx * 8;
      target.py = -scrolled * 0.05 + my * 6;

      const lerp = 0.12;
      let pending = false;
      (Object.keys(current) as (keyof typeof current)[]).forEach((key) => {
        const next = current[key] + (target[key] - current[key]) * lerp;
        if (Math.abs(target[key] - next) > 0.05) pending = true;
        current[key] = next;
      });

      write(rightNode, current.rx, current.ry);
      write(leftNode, current.lx, current.ly);
      write(portraitNode, current.px, current.py);
      if (pending) frame = window.requestAnimationFrame(step);
    };

    const kick = () => {
      if (!frame) frame = window.requestAnimationFrame(step);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      kick();
    };

    const onMove = (event: PointerEvent) => {
      const box = shellNode.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;
      pointerX = (event.clientX - box.left) / box.width - 0.5;
      pointerY = (event.clientY - box.top) / box.height - 0.5;
      kick();
    };

    const onLeave = () => {
      pointerX = 0;
      pointerY = 0;
      kick();
    };

    const onResize = () => {
      scrollY = window.scrollY;
      measure();
      kick();
    };

    const bind = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", onScroll);
      shellNode.removeEventListener("pointermove", onMove);
      shellNode.removeEventListener("pointerleave", onLeave);
      if (reduce.matches) {
        clear();
        return;
      }
      measure();
      scrollY = window.scrollY;
      if (fine.matches && !narrow.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
      }
      if (fine.matches) {
        shellNode.addEventListener("pointermove", onMove);
        shellNode.addEventListener("pointerleave", onLeave);
      } else {
        pointerX = 0;
        pointerY = 0;
      }
      kick();
    };

    measure();
    bind();
    reduce.addEventListener("change", bind);
    fine.addEventListener("change", bind);
    narrow.addEventListener("change", bind);
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      shellNode.removeEventListener("pointermove", onMove);
      shellNode.removeEventListener("pointerleave", onLeave);
      reduce.removeEventListener("change", bind);
      fine.removeEventListener("change", bind);
      narrow.removeEventListener("change", bind);
      clear();
    };
  }, []);

  return (
    <section className="hero-shell" ref={shell}>
      <div className="hero-stage">
        <div className="hero-portrait-parallax" ref={portrait}>
          {/* provisional: ilustración. Sustituir con sesión propia. Sin filtro de color. public/stock/CREDITOS.md */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-bleed" src="/stock/hero.webp" alt="" />
        </div>
        <div className="petal-slot petal-slot-right" ref={right}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="petal petal-drift-right" src="/stock/petalo-b.webp" alt="" />
        </div>
      </div>
      <div className="petal-slot petal-slot-left" ref={left}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="petal petal-drift-left" src="/stock/petalo-b.webp" alt="" />
      </div>
      {children}
    </section>
  );
}
