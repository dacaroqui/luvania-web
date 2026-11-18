"use client";

import { heroCopy } from "@/data/hero";
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
      {children ?? heroCopy.cta}
      <svg className="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
