"use client";

import { heroCopy } from "@/data/hero";
import { useAgenda } from "./providers";
import Link from "next/link";
import { useEffect, useRef } from "react";

const labels = [
  { href: "/zonas/rostro", name: "Rostro", style: { top: "18%", left: "58%" } },
  { href: "/zonas/ojos", name: "Ojos", style: { top: "30%", left: "18%" } },
  { href: "/zonas/labios", name: "Labios", style: { top: "46%", left: "62%" } },
  { href: "/zonas/cuerpo", name: "Cuerpo", style: { top: "72%", left: "22%" } },
];

export function Hero() {
  const { openAgenda } = useAgenda();
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const fine = window.matchMedia("(pointer: fine)");

    const onPointer = (event: PointerEvent) => {
      if (!fine.matches) return;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      node.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      node.style.setProperty("--px", "0");
      node.style.setProperty("--py", "0");
    };
    const onScroll = () => {
      if (fine.matches) return;
      const box = node.getBoundingClientRect();
      const progress = 1 - Math.min(1, Math.max(0, box.top / window.innerHeight));
      node.style.setProperty("--py", (progress - 0.5).toFixed(3));
      node.style.setProperty("--px", "0");
    };

    node.addEventListener("pointermove", onPointer);
    node.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      node.removeEventListener("pointermove", onPointer);
      node.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
      <div className="reveal">
        <p className="text-xs font-bold tracking-[0.22em] text-mute">{heroCopy.eyebrow}</p>
        <h1 className="display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-7xl">{heroCopy.title}</h1>
        <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold">{heroCopy.chip}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-coral magnetic" onClick={() => openAgenda()}>
            {heroCopy.cta}
          </button>
          <Link href="/tratamientos" className="btn-ghost">
            {heroCopy.secondary}
          </Link>
        </div>
      </div>

      <div ref={stage} className="hero-stage relative mx-auto aspect-[4/5] w-full max-w-md" style={{ "--px": 0, "--py": 0 } as React.CSSProperties}>
        <div className="layer layer-a hero-wash" />
        <svg className="layer layer-b h-full w-full" viewBox="0 0 360 460" role="img" aria-label="Ilustración de líneas: rostro, ojo, labios, hombro y cintura">
          <g fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round">
            <path d="M188 78c38 8 62 40 66 78 4 42-8 86-28 112-18 24-46 36-62 58" />
            <path d="M150 96c-22 18-28 48-18 74 8 20 28 32 36 50" />
            <path d="M196 148c14 2 22 14 18 26-4 12-18 16-28 10" />
            <circle cx="206" cy="162" r="3.5" fill="#1a1a1a" stroke="none" />
            <path d="M188 214c12 8 28 8 40-2" />
            <path d="M118 250c30 18 78 22 120 8 28-10 48-6 70 12" />
            <path d="M96 300c40 36 96 48 150 28" />
            <path d="M132 318c8 46 6 92-8 124" />
            <path d="M214 330c6 40 18 78 42 104" />
            <path d="M70 360c28-16 46-8 58 18 8 18 4 36-10 48" />
          </g>
          <g fill="none" stroke="#ee876b" strokeWidth="1.2">
            <path d="M40 420c70-30 150-30 280 0" />
          </g>
        </svg>
        {labels.map((label) => (
          <Link key={label.name} href={label.href} className="hotspot" style={label.style}>
            <i aria-hidden="true" />
            {label.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
