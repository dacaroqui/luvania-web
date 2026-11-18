"use client";

import { useEffect, useRef } from "react";

export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const x = event.clientX - (box.left + box.width / 2);
      const y = event.clientY - (box.top + box.height / 2);
      node.style.transform = `translate3d(${x * 0.18}px, ${y * 0.28}px, 0)`;
    };
    const leave = () => {
      node.style.transform = "";
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}
