"use client";

import { canPurchase, shopProduct } from "@/data/shop";
import { flags } from "@/lib/flags";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = { slug: string; cantidad: number };
type Pending = { slug: string; qty: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  open: boolean;
  sede: string | null;
  pending: Pending | null;
  setOpen: (open: boolean) => void;
  setSede: (slug: string) => void;
  requestAdd: (slug: string, qty?: number, sedeHint?: string) => void;
  confirmSede: (slug: string) => void;
  cancelPending: () => void;
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

function withLine(lines: CartLine[], slug: string, qty: number) {
  const amount = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
  const found = lines.find((line) => line.slug === slug);
  if (!found) return [...lines, { slug, cantidad: amount }];
  return lines.map((line) =>
    line.slug === slug ? { ...line, cantidad: Math.min(MAX_QTY, line.cantidad + amount) } : line,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [sede, setSedeState] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!flags.cart) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[] | { lines?: CartLine[]; sede?: string | null };
        if (Array.isArray(parsed)) setLines(clean(parsed));
        else if (parsed && Array.isArray(parsed.lines)) {
          setLines(clean(parsed.lines));
          if (typeof parsed.sede === "string") setSedeState(parsed.sede);
        }
      }
    } catch {
      /* el carrito guardado no es válido */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!flags.cart || !ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, sede }));
  }, [lines, sede, ready]);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.cantidad, 0),
      open,
      sede,
      pending,
      setOpen,
      setSede: (slug) => setSedeState(slug),
      requestAdd: (slug, qty = 1, sedeHint) => {
        if (!flags.cart) return;
        const product = sedeHint ? shopProduct(slug, sedeHint) : undefined;
        if (!sedeHint || !product || !canPurchase(product) || (lines.length > 0 && sede !== sedeHint)) {
          setPending({ slug, qty });
          return;
        }
        setSedeState(sedeHint);
        setLines((current) => withLine(current, slug, qty));
        setOpen(true);
      },
      confirmSede: (slug) => {
        const product = pending ? shopProduct(pending.slug, slug) : undefined;
        if (!product || !canPurchase(product)) return;
        setSedeState(slug);
        if (pending) setLines((current) => withLine(current, pending.slug, pending.qty));
        setPending(null);
        setOpen(true);
      },
      cancelPending: () => setPending(null),
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
    [lines, open, sede, pending],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider");
  return value;
}
