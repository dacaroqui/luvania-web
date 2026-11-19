"use client";

import { heroCopy } from "@/data/hero";
import { useCart } from "./cart-store";
import { useAgenda } from "./providers";

export function BookButton({
  tratamiento,
  tratamientoId,
  necesidad,
  sede,
  promo,
  children,
  className = "btn-coral",
}: {
  tratamiento?: string;
  tratamientoId?: string;
  necesidad?: string;
  sede?: string;
  promo?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { openAgenda } = useAgenda();
  const cart = useCart();
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      onClick={() => openAgenda({ tratamiento, tratamientoId, necesidad, sede: sede ?? cart.sede ?? undefined, promo })}
    >
      {children ?? heroCopy.cta}
      <svg className="btn-arrow h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
