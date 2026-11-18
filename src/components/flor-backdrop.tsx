"use client";

import { useEffect, useRef } from "react";
import { FlorLuvania } from "./flor-luvania";

export function FlorBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const fine = window.matchMedia("(pointer: fine)");
    let frame = 0;

    const paint = (scrollY: number, px: number, py: number) => {
      node.style.setProperty("--sx", scrollY.toFixed(1));
      node.style.setProperty("--mx", px.toFixed(3));
      node.style.setProperty("--my", py.toFixed(3));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const px = Number(node.style.getPropertyValue("--mx")) || 0;
        const py = Number(node.style.getPropertyValue("--my")) || 0;
        paint(window.scrollY, px, py);
      });
    };

    const onPointer = (event: PointerEvent) => {
      if (!fine.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        paint(
          window.scrollY,
          event.clientX / window.innerWidth - 0.5,
          event.clientY / window.innerHeight - 0.5,
        );
      });
    };

    paint(window.scrollY, 0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={root} className="flor-backdrop" aria-hidden="true">
      <div className="flor-bg flor-bg-a">
        <FlorLuvania />
      </div>
      <div className="flor-bg flor-bg-b">
        <FlorLuvania />
      </div>
    </div>
  );
}
