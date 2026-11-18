"use client";

import type { CommerceProduct } from "@/data/commerce";
import { asCatalogItem } from "@/data/commerce";
import { especialidades, needs, zones } from "@/data/taxonomy";
import { flags } from "@/lib/flags";
import { cop } from "@/lib/format";
import { publicText } from "@/lib/public-copy";
import { matchCatalog } from "@/lib/search";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BookButton } from "./book-button";
import { TreatmentMedia } from "./treatment-media";

const VISIBLE = 6;

type Facet = "necesidad" | "zona" | "especialidad";

function listParam(value: string | null) {
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

export function CatalogBrowser({ products }: { products: CommerceProduct[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const q = params.get("q") ?? "";
  const necesidad = listParam(params.get("necesidad"));
  const zona = listParam(params.get("zona"));
  const especialidad = listParam(params.get("especialidad"));
  const orden = params.get("orden") === "az" ? "az" : "relevantes";
  const [draft, setDraft] = useState(q);

  useEffect(() => setDraft(q), [q]);

  const necesidadKey = necesidad.join(",");
  const zonaKey = zona.join(",");
  const especialidadKey = especialidad.join(",");

  useEffect(() => {
    if (draft === q) return;
    const timer = window.setTimeout(() => {
      const query = new URLSearchParams();
      if (draft.trim()) query.set("q", draft.trim());
      if (necesidadKey) query.set("necesidad", necesidadKey);
      if (zonaKey) query.set("zona", zonaKey);
      if (especialidadKey) query.set("especialidad", especialidadKey);
      if (orden === "az") query.set("orden", "az");
      const text = query.toString();
      router.replace(text ? `/tratamientos?${text}` : "/tratamientos", { scroll: false });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [draft, q, necesidadKey, zonaKey, especialidadKey, orden, router]);

  function write(next: { q: string; necesidad: string[]; zona: string[]; especialidad: string[]; orden: string }) {
    const query = new URLSearchParams();
    if (next.q.trim()) query.set("q", next.q.trim());
    if (next.necesidad.length) query.set("necesidad", next.necesidad.join(","));
    if (next.zona.length) query.set("zona", next.zona.join(","));
    if (next.especialidad.length) query.set("especialidad", next.especialidad.join(","));
    if (next.orden === "az") query.set("orden", "az");
    const text = query.toString();
    router.replace(text ? `/tratamientos?${text}` : "/tratamientos", { scroll: false });
  }

  function toggle(facet: Facet, id: string) {
    const current = facet === "necesidad" ? necesidad : facet === "zona" ? zona : especialidad;
    const value = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    write({
      q,
      necesidad: facet === "necesidad" ? value : necesidad,
      zona: facet === "zona" ? value : zona,
      especialidad: facet === "especialidad" ? value : especialidad,
      orden,
    });
  }

  const facets = useMemo(() => {
    const usedNeeds = new Set(products.flatMap((item) => item.necesidades));
    const usedZones = new Set(products.flatMap((item) => item.zonas));
    const usedEsp = new Set(products.map((item) => item.especialidad));
    return {
      necesidad: needs.filter((item) => usedNeeds.has(item.id)).map((item) => ({ id: item.id, name: item.name })),
      zona: zones.filter((item) => usedZones.has(item.id)).map((item) => ({ id: item.id, name: item.name })),
      especialidad: especialidades.filter((item) => usedEsp.has(item.slug)).map((item) => ({ id: item.slug, name: item.name })),
    };
  }, [products]);

  const results = useMemo(() => {
    const allowed = new Set(matchCatalog(products.map(asCatalogItem), q).map((item) => item.slug));
    let items = products.filter((item) => allowed.has(item.slug));
    if (necesidad.length) items = items.filter((item) => item.necesidades.some((id) => necesidad.includes(id)));
    if (zona.length) items = items.filter((item) => item.zonas.some((id) => zona.includes(id)));
    if (especialidad.length) items = items.filter((item) => especialidad.includes(item.especialidad));
    if (orden === "az") items = items.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return items;
  }, [products, q, necesidad, zona, especialidad, orden]);

  const chips = [
    ...necesidad.map((id) => ({ facet: "necesidad" as const, id, label: facets.necesidad.find((item) => item.id === id)?.name ?? id })),
    ...zona.map((id) => ({ facet: "zona" as const, id, label: facets.zona.find((item) => item.id === id)?.name ?? id })),
    ...especialidad.map((id) => ({ facet: "especialidad" as const, id, label: facets.especialidad.find((item) => item.id === id)?.name ?? id })),
  ];
  const activeCount = chips.length;
  const dirty = activeCount > 0 || q.trim().length > 0 || orden === "az";

  const clearAll = () => {
    setDraft("");
    write({ q: "", necesidad: [], zona: [], especialidad: [], orden: "relevantes" });
  };

  return (
    <div className="catalog-tools">
      <div className="catalog-toolbar">
        <p className="catalog-count" aria-live="polite">
          {results.length} {results.length === 1 ? "tratamiento" : "tratamientos"}
        </p>
        <label className="catalog-search">
          <span className="sr-only">Buscar tratamiento</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16.5 20 20.5" />
          </svg>
          <input
            value={draft}
            placeholder="Buscar tratamiento"
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
        <label className="catalog-sort">
          <span>Ordenar por</span>
          <select
            value={orden}
            onChange={(event) => write({ q, necesidad, zona, especialidad, orden: event.target.value })}
          >
            <option value="relevantes">Más relevantes</option>
            <option value="az">A–Z</option>
          </select>
        </label>
        <button type="button" className="catalog-filter-btn" onClick={() => dialog.current?.showModal()}>
          Filtros{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-aside" aria-label="Filtros">
          <FilterStack facets={facets} necesidad={necesidad} zona={zona} especialidad={especialidad} dirty={dirty} onToggle={toggle} onClear={clearAll} />
        </aside>
        <div className="catalog-results">
          {chips.length ? (
            <div className="catalog-chips" aria-label="Filtros activos">
              {chips.map((chip) => (
                <button key={`${chip.facet}-${chip.id}`} type="button" className="catalog-chip" onClick={() => toggle(chip.facet, chip.id)}>
                  {chip.label}
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Quitar {chip.label}</span>
                </button>
              ))}
              <button type="button" className="catalog-clear-inline" onClick={clearAll}>
                Limpiar filtros
              </button>
            </div>
          ) : null}
          {results.length === 0 ? (
            <div className="catalog-empty">
              <p>Ningún tratamiento publicado coincide con esta búsqueda.</p>
              <button type="button" className="catalog-clear" onClick={clearAll}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ul className="catalog-grid">
              {results.map((item) => (
                <li key={item.slug}>
                  <CatalogCard product={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <dialog ref={dialog} className="catalog-sheet" aria-label="Filtros">
        <div className="catalog-sheet-bar">
          <p>Filtros</p>
          <button type="button" onClick={() => dialog.current?.close()}>
            Cerrar
          </button>
        </div>
        <div className="catalog-sheet-body">
          <FilterStack facets={facets} necesidad={necesidad} zona={zona} especialidad={especialidad} dirty={dirty} onToggle={toggle} onClear={clearAll} />
        </div>
      </dialog>
    </div>
  );
}

function FilterStack({
  facets,
  necesidad,
  zona,
  especialidad,
  dirty,
  onToggle,
  onClear,
}: {
  facets: { necesidad: { id: string; name: string }[]; zona: { id: string; name: string }[]; especialidad: { id: string; name: string }[] };
  necesidad: string[];
  zona: string[];
  especialidad: string[];
  dirty: boolean;
  onToggle: (facet: Facet, id: string) => void;
  onClear: () => void;
}) {
  return (
    <>
      <FacetGroup title="Necesidad" options={facets.necesidad} selected={necesidad} onToggle={(id) => onToggle("necesidad", id)} defaultOpen />
      <FacetGroup title="Zona" options={facets.zona} selected={zona} onToggle={(id) => onToggle("zona", id)} />
      <FacetGroup title="Especialidad" options={facets.especialidad} selected={especialidad} onToggle={(id) => onToggle("especialidad", id)} />
      {flags.priceFilter ? <PriceRangeFilter /> : null}
      {dirty ? (
        <button type="button" className="catalog-clear" onClick={onClear}>
          Limpiar filtros
        </button>
      ) : null}
    </>
  );
}

function FacetGroup({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = false,
}: {
  title: string;
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [more, setMore] = useState(false);
  const panelId = useId();
  const shown = more ? options : options.slice(0, VISIBLE);
  return (
    <div className="facet">
      <button type="button" className="facet-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        {title}
        <svg viewBox="0 0 12 12" aria-hidden="true" className={open ? "is-open" : ""}>
          <path d="M2.2 4.3 6 8l3.8-3.7" />
        </svg>
      </button>
      <div id={panelId} className="facet-panel" hidden={!open}>
        {shown.map((option) => (
          <label key={option.id} className="facet-option">
            <input type="checkbox" checked={selected.includes(option.id)} onChange={() => onToggle(option.id)} />
            <span>{option.name}</span>
          </label>
        ))}
        {options.length > VISIBLE ? (
          <button type="button" className="facet-more" onClick={() => setMore((value) => !value)}>
            {more ? "Ver menos" : "Ver más"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PriceRangeFilter() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="facet">
      <button type="button" className="facet-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        Precio
        <svg viewBox="0 0 12 12" aria-hidden="true" className={open ? "is-open" : ""}>
          <path d="M2.2 4.3 6 8l3.8-3.7" />
        </svg>
      </button>
      <div id={panelId} className="facet-panel" hidden={!open}>
        <label className="facet-option">
          <span>Rango en COP</span>
          <input type="range" min={0} max={1} value={0} disabled aria-disabled="true" />
        </label>
        <p className="facet-note">Disponible cuando los precios estén validados.</p>
      </div>
    </div>
  );
}

function CatalogCard({ product }: { product: CommerceProduct }) {
  const summary = publicText(product.descripcion);
  const amount = product.precioPromocional ?? product.precio;
  return (
    <article className="catalog-card">
      <Link href={`/tratamientos/${product.slug}`} className="catalog-card-media">
        <TreatmentMedia name={product.nombre} image={product.imagen} />
      </Link>
      <div className="catalog-card-copy">
        <p className="catalog-kicker">{product.especialidadNombre}</p>
        <h2 className="display catalog-name">
          <Link href={`/tratamientos/${product.slug}`}>{product.nombre}</Link>
        </h2>
        <p className="catalog-summary">{summary}</p>
        <p className="catalog-price">{amount != null ? `Desde ${cop(amount)}` : ""}</p>
        <div className="catalog-actions">
          <Link href={`/tratamientos/${product.slug}`} className="catalog-primary">
            Ver tratamiento
          </Link>
          {product.requiereValoracion ? <BookButton className="catalog-agenda">Agendar valoración</BookButton> : null}
        </div>
      </div>
    </article>
  );
}
