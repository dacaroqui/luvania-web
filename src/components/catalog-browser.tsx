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

  function clearFacet(facet: Facet) {
    write({
      q,
      necesidad: facet === "necesidad" ? [] : necesidad,
      zona: facet === "zona" ? [] : zona,
      especialidad: facet === "especialidad" ? [] : especialidad,
      orden,
    });
  }

  const facets = useMemo(() => {
    const usedNeeds = new Set(products.flatMap((item) => item.necesidades));
    const usedZones = new Set(products.flatMap((item) => item.zonas));
    const usedEsp = new Set(products.map((item) => item.especialidad));
    const order = (ids: string[]) => (a: { id: string }, b: { id: string }) => {
      const ia = ids.indexOf(a.id);
      const ib = ids.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    };
    return {
      necesidad: needs
        .filter((item) => usedNeeds.has(item.id))
        .map((item) => ({ id: item.id, name: item.name }))
        .sort(order(["manchas", "flacidez", "arrugas", "acne", "ojeras", "volumen"])),
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

  const activeCount = necesidad.length + zona.length + especialidad.length;
  const dirty = activeCount > 0 || q.trim().length > 0 || orden === "az";

  const clearAll = () => {
    setDraft("");
    write({ q: "", necesidad: [], zona: [], especialidad: [], orden: "relevantes" });
  };

  const stack = (
    <FilterStack
      facets={facets}
      necesidad={necesidad}
      zona={zona}
      especialidad={especialidad}
      dirty={dirty}
      onToggle={toggle}
      onClearFacet={clearFacet}
      onClear={clearAll}
    />
  );

  return (
    <div className="catalog-tools">
      <label className="catalog-search">
        <span className="sr-only">Buscar tratamientos</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16.5 20 20.5" />
        </svg>
        <input
          value={draft}
          placeholder="Buscar tratamientos, por ejemplo: Hilos, papada, hidroxiapatita..."
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>

      <div className="catalog-layout">
        <aside className="catalog-aside" aria-label="Filtros">
          <div className="filter-card">{stack}</div>
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <p className="catalog-count" aria-live="polite">
              {results.length} {results.length === 1 ? "tratamiento" : "tratamientos"}
            </p>
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
          <FilterStack
            facets={facets}
            necesidad={necesidad}
            zona={zona}
            especialidad={especialidad}
            dirty={dirty}
            onToggle={toggle}
            onClearFacet={clearFacet}
            onClear={clearAll}
          />
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
  onClearFacet,
  onClear,
}: {
  facets: { necesidad: { id: string; name: string }[]; zona: { id: string; name: string }[]; especialidad: { id: string; name: string }[] };
  necesidad: string[];
  zona: string[];
  especialidad: string[];
  dirty: boolean;
  onToggle: (facet: Facet, id: string) => void;
  onClearFacet: (facet: Facet) => void;
  onClear: () => void;
}) {
  return (
    <>
      <FacetGroup title="Necesidad" icon="spark" options={facets.necesidad} selected={necesidad} onToggle={(id) => onToggle("necesidad", id)} onAll={() => onClearFacet("necesidad")} />
      <FacetGroup title="Zona" icon="pin" options={facets.zona} selected={zona} onToggle={(id) => onToggle("zona", id)} onAll={() => onClearFacet("zona")} />
      <FacetGroup title="Especialidad" icon="layers" options={facets.especialidad} selected={especialidad} onToggle={(id) => onToggle("especialidad", id)} onAll={() => onClearFacet("especialidad")} />
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
  icon,
  options,
  selected,
  onToggle,
  onAll,
}: {
  title: string;
  icon: "spark" | "pin" | "layers";
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  onAll: () => void;
}) {
  const [more, setMore] = useState(false);
  const shown = more ? options : options.slice(0, VISIBLE);
  const allOn = selected.length === 0;
  return (
    <div className="facet">
      <p className="facet-title">
        <span className="facet-icon" aria-hidden="true">
          <FacetIcon name={icon} />
        </span>
        {title}
      </p>
      <div className="facet-pills">
        <button type="button" className={allOn ? "facet-pill is-on" : "facet-pill"} aria-pressed={allOn} onClick={onAll}>
          Todas
        </button>
        {shown.map((option) => {
          const on = selected.includes(option.id);
          return (
            <button key={option.id} type="button" className={on ? "facet-pill is-on" : "facet-pill"} aria-pressed={on} onClick={() => onToggle(option.id)}>
              {option.name}
            </button>
          );
        })}
      </div>
      {options.length > VISIBLE ? (
        <button type="button" className="facet-more" aria-expanded={more} onClick={() => setMore((value) => !value)}>
          {more ? "Ver menos" : "Ver más"}
          <svg viewBox="0 0 12 12" aria-hidden="true" className={more ? "is-open" : ""}>
            <path d="M2.2 4.3 6 8l3.8-3.7" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

function FacetIcon({ name }: { name: "spark" | "pin" | "layers" }) {
  if (name === "spark") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3.5 13.6 9 19 10.5 13.6 12 12 17.5 10.4 12 5 10.5 10.4 9Z" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
        <circle cx="12" cy="11" r="1.7" />
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

function PriceRangeFilter() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="facet">
      <button type="button" className="facet-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        Precio
      </button>
      <div id={panelId} className="facet-panel" hidden={!open}>
        <p className="facet-note">Disponible cuando los precios estén validados.</p>
      </div>
    </div>
  );
}

function CatalogCard({ product }: { product: CommerceProduct }) {
  const summary = publicText(product.descripcion);
  const amount = product.precioPromocional ?? product.precio;
  return (
    <Link href={`/tratamientos/${product.slug}`} className="catalog-card glass">
      <span className="catalog-card-media">
        <TreatmentMedia name={product.nombre} image={product.imagen} />
        <span className="catalog-kicker">{product.especialidadNombre}</span>
      </span>
      <span className="catalog-card-copy">
        <h2 className="display catalog-name">{product.nombre}</h2>
        <span className="catalog-summary">{summary}</span>
        <span className="catalog-foot">
          {amount != null ? <span className="catalog-price">Desde {cop(amount)}</span> : <span />}
          <span className="catalog-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
