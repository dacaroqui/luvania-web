"use client";

import { flags } from "@/lib/flags";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = { slug: string; cantidad: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);
const STORAGE_KEY = "luvania-cart";
const MAX_QTY = 12;

function clean(lines: CartLine[]) {
  return lines
    .filter((line) => line && typeof line.slug === "string" && line.cantidad > 0)
    .map((line) => ({ slug: line.slug, cantidad: Math.min(MAX_QTY, Math.floor(line.cantidad)) }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!flags.cart) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(clean(parsed));
      }
    } catch {
      /* el carrito guardado no es válido */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!flags.cart || !ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.cantidad, 0),
      open,
      setOpen,
      add: (slug, qty = 1) => {
        if (!flags.cart) return;
        const amount = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
        setLines((current) => {
          const found = current.find((line) => line.slug === slug);
          if (!found) return [...current, { slug, cantidad: amount }];
          return current.map((line) =>
            line.slug === slug ? { ...line, cantidad: Math.min(MAX_QTY, line.cantidad + amount) } : line,
          );
        });
      },
      setQty: (slug, qty) => {
        if (!flags.cart) return;
        const amount = Math.floor(qty);
        setLines((current) => {
          if (amount < 1) return current.filter((line) => line.slug !== slug);
          return current.map((line) => (line.slug === slug ? { ...line, cantidad: Math.min(MAX_QTY, amount) } : line));
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
    [lines, open],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider");
  return value;
}
