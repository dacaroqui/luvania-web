"use client";

import { offerForTreatment, offerMatchesSede } from "@/data/offers";
import type { AgendaSede } from "@/data/types";
import { useEffect, useId, useRef } from "react";
import { CloseButton } from "./close-button";
import { useCart } from "./cart-store";

export function SedeGate({ sedes }: { sedes: AgendaSede[] }) {
  const cart = useCart();
  const { pending, cancelPending } = cart;
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(cancelPending);
  close.current = cancelPending;

  useEffect(() => {
    if (!pending) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = panel.current;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
        (item) => !item.hasAttribute("disabled"),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    node?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [pending]);

  if (!pending) return null;
  const offer = offerForTreatment(pending.slug);
  const availableSedes = offer ? sedes.filter((sede) => offerMatchesSede(offer, sede.slug)) : sedes;

  return (
    <div
      className="sede-gate"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) cancelPending();
      }}
    >
      <div ref={panel} className="sheet glass sede-gate-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="agenda-frame">
          <header className="agenda-head">
            <h2 id={titleId} className="display">
              ¿En qué sede te queda mejor?
            </h2>
            <CloseButton onClick={cancelPending} />
          </header>
          <div className="agenda-body thin-scroll">
            <p className="text-sm leading-6 text-mute">La sede queda guardada en el carrito. La puedes cambiar antes de finalizar.</p>
            <ul className="grid gap-2">
              {availableSedes.map((sede) => (
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
    </div>
  );
}
