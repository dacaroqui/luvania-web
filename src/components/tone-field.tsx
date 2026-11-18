"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const tones = ["cream", "peach", "white", "dark", "ink"] as const;
type Tone = (typeof tones)[number];

function isTone(value: string | undefined): value is Tone {
  return tones.some((tone) => tone === value);
}

/** El fondo del documento sigue la sección que ocupa el centro de la ventana. */
export function ToneField() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
    if (nodes.length === 0) {
      delete root.dataset.tone;
      return;
    }

    const seen = new Map<HTMLElement, number>();
    const apply = () => {
      let best: HTMLElement | null = null;
      let score = 0;
      for (const node of nodes) {
        const value = seen.get(node) ?? 0;
        if (value > score) {
          score = value;
          best = node;
        }
      }
      const next = best?.dataset.tone;
      if (isTone(next)) root.dataset.tone = next;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement) seen.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        apply();
      },
      { rootMargin: "-18% 0px -32% 0px", threshold: [0, 0.2, 0.45, 0.7, 1] },
    );
    for (const node of nodes) observer.observe(node);
    const first = nodes[0]?.dataset.tone;
    if (isTone(first)) root.dataset.tone = first;
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
