"use client";

import { catalog } from "@/data/catalog";
import { matchCatalog, zoneLabel } from "@/lib/search";
import { track } from "@/lib/analytics";
import type { CatalogItem } from "@/data/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAgenda } from "./providers";

const published = catalog.filter((item) => item.status === "VERIFIED");

export function SearchBox({
  autoFocus = false,
  compact = false,
  onNavigate,
}: {
  autoFocus?: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const { openAgenda } = useAgenda();
  const results = query.trim().length < 2 ? [] : matchCatalog(published, query).slice(0, 8);

  useEffect(() => {
    if (query.trim().length < 2) return;
    if (matchCatalog(published, query).length === 0) track("search_no_results", { query });
  }, [query]);

  return (
    <div className="relative">
      <label className="grid gap-1 text-sm font-bold">
        <span className={compact ? "sr-only" : undefined}>Buscar un tratamiento</span>
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Papada, hidroxiapatita, hair loss…"
          className="field"
        />
      </label>
      {query.trim().length >= 2 ? <SearchResults items={results} onNavigate={onNavigate} onAgenda={() => openAgenda()} /> : null}
    </div>
  );
}

export function SearchResults({
  items,
  onNavigate,
  onAgenda,
}: {
  items: CatalogItem[];
  onNavigate?: () => void;
  onAgenda: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="search-panel">
        <p className="px-3 py-3 text-sm text-mute">Ningún protocolo publicado coincide.</p>
        <button type="button" className="btn-coral min-h-11 w-full" onClick={onAgenda}>
          Agendar valoración
        </button>
      </div>
    );
  }

  return (
    <ul className="search-panel">
      {items.map((item) => (
        <li key={item.slug}>
          <Link href={`/tratamientos/${item.slug}`} className="search-hit" onClick={onNavigate}>
            <strong>{item.name}</strong>
            <span className="search-zone">{zoneLabel(item.zones)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
