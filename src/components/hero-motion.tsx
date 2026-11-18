"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export function HeroMotion({ children }: { children: React.ReactNode }) {
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
    <div ref={stage} className="hero-stage relative mx-auto aspect-[1500/1083] w-full max-w-[36rem]" style={{ "--px": 0, "--py": 0 } as CSSProperties}>
      {children}
    </div>
  );
}
