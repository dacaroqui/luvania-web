"use client";

import { verifiedCatalog } from "@/data/catalog";
import { especialidades, zones } from "@/data/taxonomy";
import { BookButton } from "./book-button";
import { LogoLockup } from "./logo-lockup";
import { SearchBox } from "./search-box";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [compact, setCompact] = useState(false);
  const letters = verifiedCatalog().slice().sort((a, b) => a.name.localeCompare(b.name, "es"));

  useEffect(() => {
    const open = () => {
      if (window.location.hash === "#menu") setMenu(true);
      if (window.location.hash === "#mega") setMega(true);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 28;
      setCompact((value) => (value === next ? value : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header sticky top-0 z-40 border-b border-line/80 bg-cream backdrop-blur-md ${compact ? "is-compact" : ""}`}>
      <div className="header-row mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="logo-lockup shrink-0" aria-label="Luvania, inicio">
          <LogoLockup />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
          <button
            type="button"
            className="min-h-11"
            aria-expanded={mega}
            aria-controls="mega-tratamientos"
            onClick={() => setMega((value) => !value)}
          >
            Tratamientos
          </button>
          <Link href="/sedes">Sedes</Link>
          <details className="nav-more">
            <summary>
              Más
              <svg className="nav-chevron" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.2 4.3 6 8l3.8-3.7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="nav-more-panel">
              <Link href="/promociones">Promociones</Link>
              <Link href="/franquicias">Franquicias</Link>
              <Link href="/pqrs">PQRS</Link>
            </div>
          </details>
        </nav>
        <div className="flex items-center gap-2">
          <BookButton className="btn-coral magnetic max-md:!hidden" />
          <button
            type="button"
            className="min-h-11 rounded-full border border-ink/15 px-3 text-sm font-bold lg:hidden"
            aria-expanded={menu}
            aria-controls="menu-movil"
            onClick={() => setMenu((value) => !value)}
          >
            {menu ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {mega ? (
        <div id="mega-tratamientos" className="hidden border-t border-line bg-paper lg:block">
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
            </div>
          </div>
        </div>
      ) : null}

      {menu ? (
        <nav id="menu-movil" className="grid max-h-[70vh] gap-4 overflow-auto border-t border-line px-4 py-4 pb-28 lg:hidden" aria-label="Móvil">
          <SearchBox autoFocus onNavigate={() => setMenu(false)} />
          <Link href="/tratamientos" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Tratamientos
          </Link>
          <Link href="/sedes" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Sedes
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
