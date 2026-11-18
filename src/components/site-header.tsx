"use client";

import { verifiedCatalog } from "@/data/catalog";
import { especialidades, zones } from "@/data/taxonomy";
import { flags } from "@/lib/flags";
import { BookButton } from "./book-button";
import { useCart } from "./cart-store";
import { LogoLockup } from "./logo-lockup";
import { SearchBox } from "./search-box";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const zoneLinks = [
  { href: "/zonas/rostro", name: "Rostro" },
  { href: "/zonas/ojos", name: "Ojos" },
  { href: "/zonas/labios", name: "Labios" },
  { href: "/zonas/piel", name: "Piel" },
  { href: "/zonas/cuerpo", name: "Cuerpo" },
  ...zones
    .filter((zone) => !["rostro", "corporal"].includes(zone.id))
    .map((zone) => ({ href: `/zonas/${zone.id}`, name: zone.name })),
];

const needLinks = [
  ["arrugas", "Arrugas"],
  ["flacidez", "Flacidez"],
  ["acne", "Acné"],
  ["manchas", "Manchas"],
  ["ojeras", "Ojeras"],
  ["grasa-localizada", "Grasa localizada"],
  ["celulitis", "Celulitis"],
  ["caida-cabello", "Caída del cabello"],
  ["sudoracion", "Sudoración excesiva"],
].map(([id, name]) => ({ href: `/necesidades/${id}`, name }));

export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>(0);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const pathname = usePathname();
  const letters = verifiedCatalog().slice().sort((a, b) => a.name.localeCompare(b.name, "es"));

  useEffect(() => {
    setMenu(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverable(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 28;
      setCompact((value) => (value === next ? value : next));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        setMega(false);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setMenu(false);
        setMega(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleClose = () => {
    if (!hoverable) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  return (
    <header ref={header} className={`site-header sticky top-0 z-50 border-b border-line/80 bg-cream backdrop-blur-md ${compact ? "is-compact" : ""}`}>
      <div className="header-row mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="logo-lockup shrink-0" aria-label="Luvania, inicio">
          <LogoLockup />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
          <button
            type="button"
            className={`nav-drop ${mega ? "is-open" : ""}`}
            aria-expanded={mega}
            aria-controls="mega-tratamientos"
            onClick={() => setMega((value) => !value)}
            onMouseEnter={() => { if (hoverable) openMega(); }}
            onMouseLeave={scheduleClose}
          >
            Tratamientos
            <svg className="nav-chevron" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.2 4.3 6 8l3.8-3.7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link href="/sedes" onClick={() => setMega(false)}>Sedes</Link>
          <Link href="/sobre-luvania" onClick={() => setMega(false)}>Sobre Luvania</Link>
          <Link href="/blog" onClick={() => setMega(false)}>Blog</Link>
        </nav>
        <div className="flex items-center gap-2">
          <CartSlot />
          <BookButton className="btn-coral magnetic max-md:!hidden" />
          <button
            type="button"
            className="menu-toggle lg:hidden"
            aria-expanded={menu}
            aria-controls="menu-movil"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenu((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mega ? (
        <div id="mega-tratamientos" className="mega-panel hidden border-t border-line bg-paper lg:block" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-4">
            <Column title="Por necesidad" links={needLinks} onPick={() => setMega(false)} />
            <Column title="Por zona" links={zoneLinks} onPick={() => setMega(false)} />
            <Column
              title="Por especialidad"
              links={especialidades.map((item) => ({ href: `/especialidades/${item.slug}`, name: item.name }))}
              onPick={() => setMega(false)}
            />
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-mute uppercase">A–Z</p>
              <div className="mt-3">
                <SearchBox onNavigate={() => setMega(false)} />
              </div>
              <ul className="mt-3 max-h-48 overflow-auto text-sm">
                {letters.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/tratamientos/${item.slug}`} className="block py-1 hover:text-clay" onClick={() => setMega(false)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold tracking-[0.16em] text-mute uppercase">También</p>
              <Link href="/promociones" className="mt-2 block text-sm" onClick={() => setMega(false)}>
                Promociones
              </Link>
              <Link href="/franquicias" className="mt-1 block text-sm" onClick={() => setMega(false)}>
                Franquicias
              </Link>
              <Link href="/pqrs" className="mt-1 block text-sm" onClick={() => setMega(false)}>
                PQRS
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {menu ? (
        <nav id="menu-movil" className="mobile-nav grid max-h-[70vh] gap-4 overflow-auto border-t border-line bg-cream px-4 py-4 pb-8 lg:hidden" aria-label="Móvil">
          <SearchBox autoFocus onNavigate={() => setMenu(false)} />
          <Link href="/tratamientos" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Tratamientos
          </Link>
          <Link href="/sedes" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Sedes
          </Link>
          <Link href="/sobre-luvania" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Sobre Luvania
          </Link>
          <Link href="/blog" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Blog
          </Link>
          <Link href="/promociones" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Promociones
          </Link>
          <details>
            <summary className="min-h-11 cursor-pointer font-semibold">Por necesidad</summary>
            <Column title="" links={needLinks} onPick={() => setMenu(false)} />
          </details>
          <details>
            <summary className="min-h-11 cursor-pointer font-semibold">Por zona</summary>
            <Column title="" links={zoneLinks} onPick={() => setMenu(false)} />
          </details>
          <details>
            <summary className="min-h-11 cursor-pointer font-semibold">Por especialidad</summary>
            <Column
              title=""
              links={especialidades.map((item) => ({ href: `/especialidades/${item.slug}`, name: item.name }))}
              onPick={() => setMenu(false)}
            />
          </details>
          <Link href="/franquicias" onClick={() => setMenu(false)}>
            Franquicias
          </Link>
          <Link href="/pqrs" onClick={() => setMenu(false)}>
            PQRS
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

function CartSlot() {
  const cart = useCart();
  if (!flags.cart) return null;
  const label = cart.count > 0 ? `Carrito, ${cart.count} ${cart.count === 1 ? "producto" : "productos"}` : "Carrito";
  return (
    <button type="button" className="cart-slot" onClick={() => cart.setOpen(true)} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {cart.count > 0 ? <span className="cart-count">{cart.count}</span> : null}
    </button>
  );
}

function Column({
  title,
  links,
  onPick,
}: {
  title: string;
  links: { href: string; name: string }[];
  onPick: () => void;
}) {
  return (
    <div>
      {title ? <p className="text-xs font-bold tracking-[0.16em] text-mute uppercase">{title}</p> : null}
      <ul className={title ? "mt-3 grid gap-2" : "grid gap-2 pb-2"}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-semibold hover:text-clay" onClick={onPick}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
