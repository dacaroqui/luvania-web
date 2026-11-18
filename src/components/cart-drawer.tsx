"use client";

import { shopProduct } from "@/data/shop";
import type { AgendaSede } from "@/data/types";
import { cop, waLink } from "@/lib/format";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "./cart-store";

export function CartDrawer({ sedes }: { sedes: AgendaSede[] }) {
  const cart = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [sede, setSede] = useState(sedes[0]?.slug ?? "");

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (cart.open && !node.open) node.showModal();
    if (!cart.open && node.open) node.close();
  }, [cart.open]);

  const items = cart.lines.flatMap((line) => {
    const product = shopProduct(line.slug);
    return product?.disponibleOnline ? [{ line, product }] : [];
  });
  const subtotal = items.reduce((sum, item) => sum + item.product.precio * item.line.cantidad, 0);
  const chosen = sedes.find((item) => item.slug === sede) ?? sedes[0];

  function checkout() {
    if (!chosen || items.length === 0) return;
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
      className="cart-drawer"
      aria-labelledby={titleId}
      onClose={() => cart.setOpen(false)}
      onClick={(event) => {
        if (event.target === dialog.current) cart.setOpen(false);
      }}
    >
      <header className="cart-bar">
        <h2 id={titleId}>Carrito</h2>
        <button type="button" className="cart-close" onClick={() => cart.setOpen(false)}>
          Cerrar
        </button>
      </header>
      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link href="/promociones" onClick={() => cart.setOpen(false)}>
            Ver promociones
          </Link>
        </div>
      ) : (
        <ul className="cart-list">
          {items.map(({ line, product }) => (
            <li key={line.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imagen} alt="" />
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
      <footer className="cart-foot">
        <p className="cart-subtotal">
          <span>Subtotal</span>
          <strong>{cop(subtotal)}</strong>
        </p>
        <p className="cart-note">El pago en línea estará disponible pronto</p>
        {sedes.length > 0 ? (
          <label className="cart-sede">
            Sede
            <select value={chosen?.slug ?? ""} onChange={(event) => setSede(event.target.value)}>
              {sedes.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" className="shop-add" onClick={checkout} disabled={items.length === 0 || !chosen}>
          Finalizar por WhatsApp
        </button>
      </footer>
    </dialog>
  );
}
