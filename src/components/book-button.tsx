"use client";

import { heroCopy } from "@/data/hero";
import { useMagnetic } from "./magnetic";
import { useAgenda } from "./providers";

export function BookButton({
  tratamiento,
  children,
  className = "btn-coral",
}: {
  tratamiento?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { openAgenda } = useAgenda();
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button ref={ref} type="button" className={className} onClick={() => openAgenda(tratamiento)}>
      {children ?? heroCopy.cta}
    </button>
  );
}
