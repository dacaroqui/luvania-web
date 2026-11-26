"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const animations = new Set<Animation>();
    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      let delay = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        if (reduced.matches || entry.target.matches(":focus-within, :target") || typeof entry.target.animate !== "function") continue;
        const animation = entry.target.animate(
          [{ opacity: 0.2, translate: "0 24px" }, { opacity: 1, translate: "0 0" }],
          { duration: 480, delay: Number((entry.target as HTMLElement).dataset.revealDelay ?? delay), fill: "backwards", easing: "cubic-bezier(.2,.64,.25,1)" },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
        delay = Math.min(delay + 40, 120);
      }
    }, { threshold: 0.12 }) : null;
    if (!reduced.matches) nodes.forEach((element) => observer?.observe(element));

    let frame = 0;
    let active: HTMLElement | undefined;
    let mouseX = 0;
    let mouseY = 0;
    const move = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-pointer]") : null;
      if (!target) return;
      active = target;
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        const box = active.getBoundingClientRect();
        if (!box.width || !box.height) return;
        active.style.setProperty("--light-x", `${(mouseX - box.left) / box.width * 100}%`);
        active.style.setProperty("--light-y", `${(mouseY - box.top) / box.height * 100}%`);
      });
    };
    const stop = () => {
      if (!reduced.matches) return;
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    document.addEventListener("pointermove", move, { passive: true });
    reduced.addEventListener("change", stop);
    return () => {
      observer?.disconnect();
      document.removeEventListener("pointermove", move);
      reduced.removeEventListener("change", stop);
      window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
