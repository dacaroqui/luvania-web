"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Inclinación leve del retrato: el mouse mueve el plano y el scroll lo acompaña. */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const px = (event.clientX - (box.left + box.width / 2)) / box.width;
      const py = (event.clientY - (box.top + box.height / 2)) / box.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--px", Math.max(-0.55, Math.min(0.55, px)).toFixed(3));
        el.style.setProperty("--py", Math.max(-0.55, Math.min(0.55, py)).toFixed(3));
      });
    };
    const onScroll = () => {
      const box = el.getBoundingClientRect();
      const sy = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--sy", Math.max(-0.4, Math.min(0.4, sy)).toFixed(3));
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="hero-figure" style={{ "--px": 0, "--py": 0, "--sy": 0 } as CSSProperties}>
      <div className="hero-tilt">{children}</div>
    </div>
  );
}
