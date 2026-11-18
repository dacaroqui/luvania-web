"use client";

import type { ShopProduct } from "@/data/shop";
import { cop } from "@/lib/format";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-store";

export function ShopCard({ product, sesiones }: { product: ShopProduct; sesiones?: string | null }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    if (!product.disponibleOnline) return;
    cart.add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <li className="shop-card">
      <Link href={`/tratamientos/${product.slug}`} className="shop-media" aria-label={`Ver ${product.nombre}`}>
        {/* provisional: stock */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imagen} alt="" />
        {product.descuento ? <span className="shop-badge">-{product.descuento}%</span> : null}
      </Link>
      <div className="shop-copy">
        <h2 className="display shop-name">
          <Link href={`/tratamientos/${product.slug}`}>{product.nombre}</Link>
        </h2>
        {sesiones ? <p className="shop-sessions">{sesiones}</p> : null}
        <p className="shop-prices">
          <span className="shop-now">{cop(product.precio)}</span>
          {product.precioAntes ? <span className="shop-before">{cop(product.precioAntes)}</span> : null}
        </p>
        {product.disponibleOnline ? (
          <>
            <div className="qty" aria-label={`Cantidad de ${product.nombre}`}>
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Disminuir cantidad">
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(12, value + 1))} aria-label="Aumentar cantidad">
                +
              </button>
            </div>
            <button type="button" className={added ? "shop-add is-added" : "shop-add"} onClick={add}>
              {added ? "Agregado" : "Agregar al carrito"}
            </button>
            <p className="sr-only" aria-live="polite">
              {added ? `${product.nombre} agregado al carrito` : ""}
            </p>
          </>
        ) : (
          <p className="shop-offline">No disponible en línea</p>
        )}
        <Link href={`/tratamientos/${product.slug}`} className="shop-secondary">
          Ver tratamiento
        </Link>
      </div>
    </li>
  );
}
