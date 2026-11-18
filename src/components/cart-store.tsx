"use client";

import { flags } from "@/lib/flags";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = { slug: string; cantidad: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);
const STORAGE_KEY = "luvania-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    if (!flags.cart) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) setLines(parsed.filter((line) => line && typeof line.slug === "string" && line.cantidad > 0));
    } catch {
      /* el carrito guardado no es válido */
    }
  }, []);

  useEffect(() => {
    if (!flags.cart) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.cantidad, 0),
      add: (slug) => {
        if (!flags.cart) return;
        setLines((current) => {
          const found = current.find((line) => line.slug === slug);
          if (!found) return [...current, { slug, cantidad: 1 }];
          return current.map((line) => (line.slug === slug ? { ...line, cantidad: line.cantidad + 1 } : line));
        });
      },
      remove: (slug) => {
        if (!flags.cart) return;
        setLines((current) => current.filter((line) => line.slug !== slug));
      },
      clear: () => {
        if (!flags.cart) return;
        setLines([]);
      },
    }),
    [lines],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider");
  return value;
}
