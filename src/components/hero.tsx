"use client";

import { heroCopy } from "@/data/hero";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BookButton } from "./book-button";
import { FlorLuvania } from "./flor-luvania";

const labels = [
  { href: "/zonas/rostro", name: "Rostro", style: { top: "14%", left: "4%" } },
  { href: "/zonas/ojos", name: "Ojos", style: { top: "27%", left: "66%" } },
  { href: "/zonas/piel", name: "Piel", style: { top: "42%", left: "68%" } },
  { href: "/zonas/labios", name: "Labios", style: { top: "36%", left: "3%" } },
];

export function Hero() {
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
      node.style.setProperty("--py", ((progress - 0.5) * 0.8).toFixed(3));
      node.style.setProperty("--px", "0");
    };

    node.addEventListener("pointermove", onPointer);
    node.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      node.removeEventListener("pointermove", onPointer);
      node.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section data-tone="cream" className="relative z-[1]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-10">
        <div className="reveal relative z-[1]">
          <p className="text-xs font-bold tracking-[0.22em] text-mute">{heroCopy.eyebrow}</p>
          <h1 className="display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-7xl">{heroCopy.title}</h1>
          <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold">{heroCopy.chip}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton />
            <Link href="/tratamientos" className="btn-ghost">
              {heroCopy.secondary}
            </Link>
          </div>
        </div>

        <div
          ref={stage}
          className="hero-stage relative mx-auto aspect-[1500/1083] w-full max-w-[36rem]"
          style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
        >
          <div className="layer layer-back hero-wash" />
          <div className="layer layer-flor">
            <FlorLuvania className="flor-hero" />
          </div>
          <div className="layer layer-photo">
            <Image
              src="/brand/hero-mujer-manual.webp"
              alt="Mujer sonriente con la mano en el rostro"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 36rem"
              className="object-contain object-bottom"
            />
            {labels.map((label) => (
              <Link key={label.name} href={label.href} className="hotspot" style={label.style}>
                <i aria-hidden="true" />
                {label.name}
              </Link>
            ))}
          </div>
          <svg className="layer layer-grid" viewBox="0 0 360 260" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.45">
              <rect x="16" y="14" width="328" height="232" rx="18" />
              <path d="M180 14v232M16 88h328M16 172h328" />
              <path d="M16 40h18M16 220h18M326 40h18M326 220h18M40 14v12M320 14v12M40 234v12M320 234v12" />
            </g>
            <g fill="none" stroke="#ee876b" strokeWidth="0.8" opacity="0.7">
              <circle cx="180" cy="118" r="46" />
              <path d="M168 118h24M180 106v24" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
