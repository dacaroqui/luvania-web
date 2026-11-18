"use client";

import { heroCopy } from "@/data/hero";
import { FlorLuvania } from "./flor-luvania";
import { useMagnetic } from "./magnetic";
import { useAgenda } from "./providers";

export function BookButton({
  tratamiento,
  sede,
  children,
  className = "btn-coral",
}: {
  tratamiento?: string;
  sede?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { openAgenda } = useAgenda();
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button ref={ref} type="button" className={`inline-flex items-center justify-center gap-2 ${className}`} onClick={() => openAgenda(tratamiento, sede)}>
      <FlorLuvania className="flor-cta" tone="light" />
      {children ?? heroCopy.cta}
    </button>
  );
}
