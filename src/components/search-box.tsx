"use client";

import { catalog } from "@/data/catalog";
import { matchCatalog } from "@/lib/search";
import { track } from "@/lib/analytics";
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
      {query.trim().length >= 2 ? (
        <ul className={`grid gap-1 ${compact ? "absolute z-30 mt-2 w-full rounded-2xl border border-line bg-cream p-2 shadow-lg" : "mt-2"}`}>
          {results.length === 0 ? (
            <li>
              <button type="button" className="btn-coral min-h-11 w-full" onClick={() => openAgenda()}>
                No sé qué necesito: agendar valoración
              </button>
            </li>
          ) : (
            results.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/tratamientos/${item.slug}`}
                  className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-3 text-sm"
                  onClick={onNavigate}
                >
                  <span className="font-semibold">{item.name}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
