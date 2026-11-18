"use client";

import { catalog } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { matchCatalog } from "@/lib/search";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchResults } from "./search-box";
import { useAgenda } from "./providers";

const gates = [
  { href: "/tratamientos#necesidad", name: "Por necesidad", icon: "need" },
  { href: "/tratamientos#zona", name: "Por zona", icon: "zone" },
  { href: "/tratamientos#especialidad", name: "Por especialidad", icon: "spec" },
  { href: "/tratamientos?orden=az#nombre", name: "Por nombre A–Z", icon: "az" },
] as const;

export function Encuentra() {
  return (
    <section data-tone="white" className="band-white relative z-[1]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display text-4xl sm:text-5xl">Encuentra tu tratamiento</h2>
          <Finder />
        </div>
        <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4">
          {gates.map((gate, index) => (
            <li key={gate.href} className={index < gates.length - 1 ? "lg:border-r lg:border-line" : undefined}>
              <Link
                href={gate.href}
                className="gate group flex min-h-16 items-center gap-3 border-b border-line px-1 py-3 sm:px-4 lg:border-b-0"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <GateIcon kind={gate.icon} />
                <span className="flex-1 text-sm font-bold">{gate.name}</span>
                <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Finder() {
  const [query, setQuery] = useState("");
  const { openAgenda } = useAgenda();
  const results = query.trim().length < 2 ? [] : matchCatalog(catalog, query).filter((item) => item.status === "VERIFIED").slice(0, 6);

  useEffect(() => {
    if (query.trim().length < 2) return;
    if (matchCatalog(catalog, query).filter((item) => item.status === "VERIFIED").length === 0) {
      track("search_no_results", { query });
    }
  }, [query]);

  return (
    <div className="relative w-full lg:max-w-md" role="search">
      <label className="grid gap-1 text-sm font-bold">
        <span className="sr-only">¿Qué te gustaría explorar?</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="¿Qué te gustaría explorar?"
          className="field"
          role="searchbox"
        />
      </label>
      {query.trim().length >= 2 ? <SearchResults items={results} onAgenda={() => openAgenda()} /> : null}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="gate-arrow h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GateIcon({ kind }: { kind: (typeof gates)[number]["icon"] }) {
  if (kind === "need") {
    return (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" fill="none" stroke="#ee876b" strokeWidth="1.6" />
      </svg>
    );
  }
  if (kind === "zone") {
    return (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5.5" r="2" fill="none" stroke="#ee876b" strokeWidth="1.6" />
        <path d="M12 9.5v5M9.5 20.5l2.5-6 2.5 6M8 13.5h8" fill="none" stroke="#ee876b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "spec") {
    return (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M8 7h8M7 12h10M8 17h8" fill="none" stroke="#ee876b" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "az") {
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center text-[0.7rem] font-bold tracking-tight text-coral" aria-hidden="true">
        Az
      </span>
    );
  }
  const unreachable: never = kind;
  return unreachable;
}
