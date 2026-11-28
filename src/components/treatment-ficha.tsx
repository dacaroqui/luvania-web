"use client";

import { canPurchase, shopProduct, type ShopProduct } from "@/data/shop";
import { priceCaption } from "@/data/purchase";
import { cop } from "@/lib/format";
import { useEffect, useState } from "react";
import { useCart } from "./cart-store";

export function FichaTabs({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id ?? "");
  const signature = items.map((item) => item.id).join("|");

  useEffect(() => {
    const nodes = signature
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setCurrent(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [signature]);

  if (items.length === 0) return null;

  return (
    <nav className="ficha-tabs" aria-label="En esta página">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} aria-current={current === item.id ? "true" : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function FichaAddButton({ slug, nombre }: { slug: string; nombre: string }) {
  const cart = useCart();
  const product = shopProduct(slug, cart.sede);
  if (!product || !canPurchase(product)) return null;
  const inCart = cart.lines.find((line) => line.slug === slug)?.cantidad ?? 0;

  function add() {
    cart.requestAdd(slug, 1);
  }

  return (
    <button type="button" className={inCart ? "ficha-cart is-added" : "ficha-cart"} onClick={add}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {inCart ? `Agregado · ${inCart}` : "Agregar al carrito"}
      <span className="sr-only">{nombre}</span>
    </button>
  );
}

export function FichaSedeOffers({ rows, slug, nombre }: {
  rows: { slug: string; name: string; product: ShopProduct | null }[];
  slug: string;
  nombre: string;
}) {
  const cart = useCart();
  const selected = rows.find((row) => row.slug === cart.sede);
  const caption = selected?.product && !selected.product.vencida ? priceCaption(selected.product.tipoPrecio) : null;

  return (
    <div id="precios-por-sede" className="ficha-sede-offers">
      <fieldset>
        <legend>Precios y promociones por sede</legend>
        <div className="ficha-sede-options">
          {rows.map((row) => (
            <label key={row.slug} className="ficha-sede-row">
              <input type="radio" name="ficha-sede" checked={cart.sede === row.slug} onChange={() => cart.setSede(row.slug)} />
              <strong>{row.name}</strong>
              {row.product && !row.product.vencida
                ? <strong>{cop(row.product.precio)}</strong>
                : <small>Sin promoción publicada</small>}
            </label>
          ))}
        </div>
      </fieldset>
      {caption ? <p className="ficha-caption">{caption}</p> : null}
      <p className="ficha-validity">Si tu sede no muestra un precio, consúltalo al agendar.</p>
      {selected ? <FichaAddButton slug={slug} nombre={nombre} /> : null}
    </div>
  );
}
