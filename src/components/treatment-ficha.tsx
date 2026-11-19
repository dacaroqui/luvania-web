"use client";

import { canPurchase, shopProduct } from "@/data/shop";
import { useEffect, useState } from "react";
import { useCart } from "./cart-store";
import { useDemoCart } from "./demo-cart";

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
  const demo = useDemoCart();
  const cart = useCart();
  const product = shopProduct(slug);
  const [added, setAdded] = useState(false);
  if (!product || !canPurchase(product, demo)) return null;

  function add() {
    cart.add(slug, 1);
    cart.setOpen(true);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button type="button" className="ficha-cart" onClick={add}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {added ? "Agregado" : "Agregar al carrito"}
      <span className="sr-only">{nombre}</span>
    </button>
  );
}
