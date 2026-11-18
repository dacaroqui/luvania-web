"use client";

import { catalog } from "@/data/catalog";
import { matchCatalog } from "@/lib/search";
import { track } from "@/lib/analytics";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAgenda } from "./providers";

export function SearchBox({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const { openAgenda } = useAgenda();
  const results = query.trim().length < 2 ? [] : matchCatalog(catalog, query).slice(0, 8);

  useEffect(() => {
    if (query.trim().length < 2) return;
    if (matchCatalog(catalog, query).length === 0) track("search_no_results", { query });
  }, [query]);

  return (
    <div>
      <label className="grid gap-1 text-sm font-bold">
        Buscar un tratamiento
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Papada, hidroxiapatita, hair loss…"
          className="field"
        />
      </label>
      {query.trim().length >= 2 ? (
        <ul className="mt-2 grid gap-1">
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
                  {item.status === "NEEDS_REVIEW" ? <span className="text-xs text-mute">En revisión</span> : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
