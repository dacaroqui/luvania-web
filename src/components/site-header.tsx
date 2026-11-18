"use client";

import { useBooking } from "./providers";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/tratamientos", label: "Tratamientos" },
  { href: "/promociones", label: "Promociones" },
  { href: "/sedes", label: "Sedes" },
  { href: "/franquicias", label: "Franquicias" },
  { href: "/pqrs", label: "PQRS" },
];

export function SiteHeader() {
  const { openBooking } = useBooking();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group" aria-label="Luvania, inicio">
          <span className="display block text-2xl leading-none">Luvania</span>
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-mute uppercase">
            Innovación estética
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-coral">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openBooking()}
            className="hidden min-h-11 rounded-full bg-coral px-4 text-sm font-bold text-ink md:inline-flex md:items-center"
          >
            Agenda tu valoración sin costo
          </button>
          <button
            type="button"
            className="min-h-11 rounded-full border border-ink/15 px-3 text-sm font-bold md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="menu-movil" className="grid gap-1 border-t border-line px-4 py-3 md:hidden" aria-label="Móvil">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-xl px-2 py-2 font-semibold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
