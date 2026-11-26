"use client";

import { canPurchase, shopProduct, shopProducts } from "@/data/shop";
import type { AgendaSede } from "@/data/types";
import { cop, waLink } from "@/lib/format";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { CloseButton } from "./close-button";
import { useCart } from "./cart-store";
import { TreatmentMedia } from "./treatment-media";

export function CartDrawer({ sedes }: { sedes: AgendaSede[] }) {
  const cart = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (cart.open && !node.open) node.showModal();
    if (!cart.open && node.open) node.close();
  }, [cart.open]);

  const items = cart.lines.flatMap((line) => {
    const product = shopProduct(line.slug, cart.sede);
    return product && canPurchase(product) ? [{ line, product }] : [];
  });
  const unavailable = cart.lines.filter((line) => !items.some((item) => item.line.slug === line.slug));
  const suggestions = cart.sede ? shopProducts(cart.sede).filter((product) => canPurchase(product) && !cart.lines.some((line) => line.slug === product.slug)).slice(0, 2) : [];
  const subtotal = items.reduce((sum, item) => sum + item.product.precio * item.line.cantidad, 0);
  const chosen = sedes.find((item) => item.slug === cart.sede) ?? null;

  function checkout() {
    if (!chosen || items.length === 0 || unavailable.length > 0) return;
    const lines = items.map(
      (item) => `• ${item.product.nombre} x${item.line.cantidad} — ${cop(item.product.precio * item.line.cantidad)}`,
    );
    const text = [
      `Hola, quiero pedir estos tratamientos en Luvania, sede ${chosen.name}.`,
      "",
      ...lines,
      "",
      `Subtotal: ${cop(subtotal)}`,
      "El pago en línea estará disponible pronto. ¿Me confirman disponibilidad?",
    ].join("\n");
    window.open(waLink(chosen.whatsapp, text), "_blank", "noopener,noreferrer");
  }

  return (
    <dialog
      ref={dialog}
      className="cart-drawer glass"
      aria-labelledby={titleId}
      onClose={() => cart.setOpen(false)}
      onClick={(event) => {
        if (event.target === dialog.current) cart.setOpen(false);
      }}
    >
      <header className="cart-bar">
        <h2 id={titleId}>Carrito</h2>
        <CloseButton onClick={() => cart.setOpen(false)} />
      </header>
      <div className="cart-content thin-scroll">
      {cart.lines.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link href="/promociones" onClick={() => cart.setOpen(false)}>
            Ver promociones
          </Link>
        </div>
      ) : (
        <ul className="cart-list">
          {unavailable.map((line) => (
            <li key={line.slug}>
              <p>{shopProduct(line.slug)?.nombre ?? line.slug} · No disponible en esta sede</p>
              <button type="button" className="cart-remove" onClick={() => cart.remove(line.slug)}>Eliminar</button>
            </li>
          ))}
          {items.map(({ line, product }) => (
            <li key={line.slug}>
              <TreatmentMedia name={product.nombre} image={product.imagen} />
              <div>
                <p className="cart-name">{product.nombre}</p>
                <p className="cart-line-price">{cop(product.precio)}</p>
                <div className="qty">
                  <button type="button" onClick={() => cart.setQty(line.slug, line.cantidad - 1)} aria-label={`Disminuir ${product.nombre}`}>
                    −
                  </button>
                  <span>{line.cantidad}</span>
                  <button type="button" onClick={() => cart.setQty(line.slug, line.cantidad + 1)} aria-label={`Aumentar ${product.nombre}`}>
                    +
                  </button>
                </div>
              </div>
              <button type="button" className="cart-remove" onClick={() => cart.remove(line.slug)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      {chosen && suggestions.length > 0 ? (
        <section className="cart-suggestions" aria-label={"Más promociones en " + chosen.name}>
          <h3>Más promociones en {chosen.name}</h3>
          {suggestions.map((product) => (
            <button type="button" className="sede-option flex w-full flex-wrap justify-between gap-2" key={product.slug} onClick={() => cart.requestAdd(product.slug, 1, chosen.slug)}>
              <span>{product.nombre} · {cop(product.precio)}</span><span>Agregar</span>
            </button>
          ))}
        </section>
      ) : null}
      </div>
      <footer className="cart-foot">
        <p className="cart-subtotal">
          <span>Subtotal</span>
          <strong>{cop(subtotal)}</strong>
        </p>
        <p className="cart-note">El pago en línea estará disponible pronto</p>
        {sedes.length > 0 ? (
          <label className="cart-sede">
            Sede
            <select value={chosen?.slug ?? ""} onChange={(event) => cart.setSede(event.target.value)}>
              <option value="" disabled>
                Elige una sede
              </option>
              {sedes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" className="shop-add" onClick={checkout} disabled={items.length === 0 || !chosen || unavailable.length > 0}>
          Finalizar por WhatsApp
        </button>
      </footer>
    </dialog>
  );
}
