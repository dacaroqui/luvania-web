"use client";

import { canPurchase, shopProduct } from "@/data/shop";
import { cop } from "@/lib/format";
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
            <p className="text-sm leading-6 text-mute">Confirma la sede y revisa el precio antes de agregar la promoción.</p>
            {cart.lines.length > 0 ? <p className="text-sm text-mute">Si cambias de sede, el carrito actualizará los precios y la disponibilidad.</p> : null}
            <ul className="grid gap-2">
              {sedes.map((sede) => {
                const product = shopProduct(pending.slug, sede.slug);
                const available = Boolean(product && canPurchase(product));
                return (
                  <li key={sede.slug}>
                    <button type="button" className="sede-option flex w-full flex-wrap justify-between gap-2" disabled={!available} onClick={() => cart.confirmSede(sede.slug)}>
                      <span>{sede.name}{cart.sede === sede.slug ? " · sede actual" : ""}</span>
                      <span>{product && available ? cop(product.precio) : "No disponible"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
