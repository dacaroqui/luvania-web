"use client";

import type { AgendaSede } from "@/data/types";
import { useEffect, useId, useRef } from "react";
import { useCart } from "./cart-store";

export function SedeGate({ sedes }: { sedes: AgendaSede[] }) {
  const cart = useCart();
  const { pending, cancelPending } = cart;
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelPending();
    };
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [pending, cancelPending]);

  if (!pending) return null;

  return (
    <div
      className="sede-gate"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) cancelPending();
      }}
    >
      <div ref={panel} className="sheet glass sede-gate-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="grid max-h-[85vh] gap-4 overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="display text-4xl leading-none">
              ¿En qué sede te queda mejor?
            </h2>
            <button type="button" className="min-h-11 min-w-11 text-sm font-bold" onClick={cancelPending}>
              Cerrar
            </button>
          </div>
          <p className="text-sm leading-6 text-mute">La sede queda guardada en el carrito. La puedes cambiar antes de finalizar.</p>
          <ul className="grid gap-2">
            {sedes.map((sede) => (
              <li key={sede.slug}>
                <button type="button" className="sede-option" onClick={() => cart.confirmSede(sede.slug)}>
                  {sede.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
