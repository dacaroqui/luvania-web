"use client";

import { canPurchase, shopProduct } from "@/data/shop";
import { especialidades } from "@/data/taxonomy";
import { needPages, zonePages } from "@/lib/hubs";
import { flags } from "@/lib/flags";
import { BookButton } from "./book-button";
import { useCart } from "./cart-store";
import { useDemoCart } from "./demo-cart";
import { LogoLockup } from "./logo-lockup";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const needs = needPages.map((item) => ({ href: `/necesidades/${item.slug}`, name: item.name }));
const zones = zonePages.map((item) => ({ href: `/zonas/${item.slug}`, name: item.name }));
const specialties = especialidades.map((item) => ({ href: `/especialidades/${item.slug}`, name: item.name }));

export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>(0);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const pathname = usePathname();
  const onTreatments = pathname.startsWith("/tratamientos");

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
  const openSearch = () => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop) {
      setMenu(false);
      setMega(true);
      window.setTimeout(() => document.getElementById("mega-search")?.focus(), 40);
    } else {
      setMega(false);
      setMenu(true);
      window.setTimeout(() => document.getElementById("mobile-search")?.focus(), 40);
    }
  };

  return (
    <header ref={header} className={`site-header sticky top-0 z-50 border-b border-line/70 bg-cream/95 backdrop-blur-md ${compact ? "is-compact" : ""}`}>
      <div className="header-row mx-auto flex max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="logo-lockup shrink-0" aria-label="Luvania, inicio">
          <LogoLockup />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex" aria-label="Principal">
          <button
            type="button"
            className={`nav-drop ${mega ? "is-open" : ""} ${onTreatments && !mega ? "is-current" : ""}`}
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
        <div className="flex items-center gap-1">
          <button type="button" className="icon-btn" aria-label="Buscar un tratamiento" onClick={openSearch}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.25" />
              <path d="M16 16.5 20.2 20.7" />
            </svg>
          </button>
          <CartSlot />
          <BookButton className="btn-coral magnetic max-lg:!hidden">Agenda tu valoración</BookButton>
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
        <div
          id="mega-tratamientos"
          className="mega-panel"
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
        >
          <div className="mega-grid">
            <div className="mega-intro">
              <h2 className="display">Encuentra tu tratamiento ideal</h2>
              <p>Explora nuestro portafolio de tratamientos faciales, corporales y especializados.</p>
              <Link href="/tratamientos" className="mega-all" onClick={() => setMega(false)}>
                Ver todos los tratamientos <span aria-hidden="true">↗</span>
              </Link>
              {/* provisional: ilustración. public/stock/CREDITOS.md */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mega-petal" src="/stock/petalo-b.webp" alt="" />
            </div>
            <MegaColumn title="Por necesidad" icon="face" links={needs} onPick={() => setMega(false)} />
            <MegaColumn title="Por zona" icon="body" links={zones} onPick={() => setMega(false)} />
            <MegaColumn title="Por especialidad" icon="layers" links={specialties} onPick={() => setMega(false)} />
            <div className="mega-side">
              <MegaSearch onNavigate={() => setMega(false)} inputId="mega-search" />
              <p className="mega-also">También puedes explorar</p>
              <ExploreLinks onPick={() => setMega(false)} />
            </div>
          </div>
        </div>
      ) : null}

      {menu ? (
        <nav id="menu-movil" className="mobile-nav" aria-label="Móvil">
          <MegaSearch onNavigate={() => setMenu(false)} inputId="mobile-search" />
          <Link href="/tratamientos" onClick={() => setMenu(false)} className="mobile-link">
            Ver todos los tratamientos
          </Link>
          <details>
            <summary>Por necesidad</summary>
            <LinkList links={needs} onPick={() => setMenu(false)} />
          </details>
          <details>
            <summary>Por zona</summary>
            <LinkList links={zones} onPick={() => setMenu(false)} />
          </details>
          <details>
            <summary>Por especialidad</summary>
            <LinkList links={specialties} onPick={() => setMenu(false)} />
          </details>
          <Link href="/sedes" onClick={() => setMenu(false)} className="mobile-link">Sedes</Link>
          <Link href="/sobre-luvania" onClick={() => setMenu(false)} className="mobile-link">Sobre Luvania</Link>
          <Link href="/blog" onClick={() => setMenu(false)} className="mobile-link">Blog</Link>
          <Link href="/promociones" onClick={() => setMenu(false)} className="mobile-link">Promociones</Link>
          <Link href="/franquicias" onClick={() => setMenu(false)} className="mobile-link">Franquicias</Link>
          <Link href="/pqrs" onClick={() => setMenu(false)} className="mobile-link">PQRS</Link>
        </nav>
      ) : null}
    </header>
  );
}

function MegaSearch({ onNavigate, inputId }: { onNavigate: () => void; inputId: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  return (
    <form
      className="mega-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const text = query.trim();
        onNavigate();
        router.push(text ? `/tratamientos?q=${encodeURIComponent(text)}` : "/tratamientos");
      }}
    >
      <label>
        <span className="sr-only">Buscar un tratamiento</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.25" />
          <path d="M16 16.5 20.2 20.7" />
        </svg>
        <input
          id={inputId}
          value={query}
          placeholder="Buscar un tratamiento..."
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
    </form>
  );
}

function MegaColumn({
  title,
  icon,
  links,
  onPick,
}: {
  title: string;
  icon: "face" | "body" | "layers";
  links: { href: string; name: string }[];
  onPick: () => void;
}) {
  return (
    <div className="mega-col">
      <h3>
        <span className="mega-icon" aria-hidden="true">
          <MegaIcon name={icon} />
        </span>
        {title}
      </h3>
      <LinkList links={links} onPick={onPick} />
    </div>
  );
}

function LinkList({ links, onPick }: { links: { href: string; name: string }[]; onPick: () => void }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} onClick={onPick}>
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ExploreLinks({ onPick }: { onPick: () => void }) {
  const cards = [
    { href: "/promociones", name: "Promociones", image: "/stock/faciales.webp", alt: "" },
    { href: "/franquicias", name: "Franquicias", image: "/stock/experiencia.webp", alt: "" },
    { href: "/pqrs", name: "PQRS", image: "/tratamientos/microdermoabrasion.webp", alt: "" },
  ];
  return (
    <ul className="mega-explore">
      {cards.map((card) => (
        <li key={card.href}>
          <Link href={card.href} onClick={onPick}>
            <span>{card.name}</span>
            <span className="mega-chevron" aria-hidden="true">›</span>
            {/* provisional: stock */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.image} alt={card.alt} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaIcon({ name }: { name: "face" | "body" | "layers" }) {
  if (name === "face") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19.2c1.2-3 3.4-4.4 6.5-4.4s5.3 1.4 6.5 4.4" />
      </svg>
    );
  }
  if (name === "body") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 8.2v6.2M8.2 11.2h7.6M9 20.2l3-5.8 3 5.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 8.5 12 5l7 3.5L12 12Z" />
      <path d="M5 12.2 12 15.7l7-3.5" />
      <path d="M5 15.8 12 19.3l7-3.5" />
    </svg>
  );
}

function CartSlot() {
  const cart = useCart();
  const demo = useDemoCart();
  if (!flags.cart) return null;
  const count = cart.lines.reduce((sum, line) => {
    const product = shopProduct(line.slug);
    if (!product || !canPurchase(product, demo)) return sum;
    return sum + line.cantidad;
  }, 0);
  const label = count > 0 ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito";
  return (
    <button type="button" className="cart-slot" onClick={() => cart.setOpen(true)} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {count > 0 ? <span className="cart-count">{count}</span> : null}
    </button>
  );
}
