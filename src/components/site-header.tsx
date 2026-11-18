"use client";

import { verifiedCatalog } from "@/data/catalog";
import { heroCopy } from "@/data/hero";
import { especialidades, zones } from "@/data/taxonomy";
import { useMagnetic } from "./magnetic";
import { useAgenda } from "./providers";
import { SearchBox } from "./search-box";
import Link from "next/link";
import { useEffect, useState } from "react";

const zoneLinks = [
  { href: "/zonas/rostro", name: "Rostro" },
  { href: "/zonas/ojos", name: "Ojos" },
  { href: "/zonas/labios", name: "Labios" },
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
  const { openAgenda } = useAgenda();
  const magnet = useMagnetic<HTMLButtonElement>();
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Luvania, inicio">
          <span className="display block text-2xl leading-none">Luvania</span>
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-mute uppercase">Innovación estética</span>
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
          <Link href="/promociones">Promociones</Link>
          <Link href="/sedes">Sedes</Link>
          <Link href="/franquicias">Franquicias</Link>
          <Link href="/pqrs">PQRS</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button ref={magnet} type="button" onClick={() => openAgenda()} className="btn-coral magnetic hidden md:inline-flex">
            {heroCopy.cta}
          </button>
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
                    <Link href={`/tratamientos/${item.slug}`} className="block py-1 hover:text-coral" onClick={() => setMega(false)}>
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
        <nav id="menu-movil" className="grid max-h-[80vh] gap-4 overflow-auto border-t border-line px-4 py-4 lg:hidden" aria-label="Móvil">
          <SearchBox autoFocus onNavigate={() => setMenu(false)} />
          <Link href="/promociones" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Promociones
          </Link>
          <Link href="/sedes" onClick={() => setMenu(false)} className="min-h-11 font-semibold">
            Sedes
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
            <Link href={link.href} className="text-sm font-semibold hover:text-coral" onClick={onPick}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
