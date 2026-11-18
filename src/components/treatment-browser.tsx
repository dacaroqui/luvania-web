"use client";

import { catalog } from "@/data/catalog";
import { especialidades, needs, zones } from "@/data/taxonomy";
import { track } from "@/lib/analytics";
import { matchCatalog } from "@/lib/search";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAgenda } from "./providers";

export function TreatmentBrowser() {
  const params = useSearchParams();
  const { openAgenda } = useAgenda();
  const [query, setQuery] = useState("");
  const [especialidad, setEspecialidad] = useState(params.get("especialidad") ?? "");
  const [zona, setZona] = useState(params.get("zona") ?? "");
  const [necesidad, setNecesidad] = useState(params.get("necesidad") ?? "");

  const visible = useMemo(() => {
    const base = matchCatalog(catalog, query).filter((item) => item.status === "VERIFIED");
    return base.filter((item) => {
      if (especialidad && item.especialidad !== especialidad) return false;
      if (zona && !item.zones.includes(zona)) return false;
      if (necesidad && !item.needs.includes(necesidad)) return false;
      return true;
    });
  }, [query, especialidad, zona, necesidad]);

  return (
    <div>
      <label className="block text-sm font-bold">
        Buscar
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (value.trim().length >= 2 && matchCatalog(catalog, value).filter((item) => item.status === "VERIFIED").length === 0) {
              track("search_no_results", { query: value });
            }
          }}
          placeholder="Hilos, papada, hidroxiapatita, hair loss…"
          className="field mt-2"
        />
      </label>
      <Filter label="Especialidad" value={especialidad} onChange={setEspecialidad} kind="especialidad" options={especialidades.map((item) => ({ id: item.slug, name: item.name }))} />
      <Filter label="Zona" value={zona} onChange={setZona} kind="zona" options={zones.map((item) => ({ id: item.id, name: item.name }))} />
      <Filter label="Necesidad" value={necesidad} onChange={setNecesidad} kind="necesidad" options={needs.map((item) => ({ id: item.id, name: item.name }))} />
      <p className="mt-6 text-sm text-mute" aria-live="polite">
        {visible.length} {visible.length === 1 ? "tratamiento" : "tratamientos"}
      </p>
      {visible.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-6">
          <p>Ningún tratamiento publicado coincide.</p>
          <button type="button" className="btn-coral mt-4" onClick={() => openAgenda()}>
            No sé qué necesito: agendar valoración
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>
              <Link href={`/tratamientos/${item.slug}`} className="tilt-card flex h-full flex-col rounded-3xl bg-white p-5">
                <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">
                  {especialidades.find((esp) => esp.slug === item.especialidad)?.name}
                </p>
                <h2 className="display mt-2 text-3xl leading-none">{item.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-mute">{item.summary}</p>
                <span className="mt-4 text-sm font-bold">Ver ficha</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  kind,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind: string;
  options: { id: string; name: string }[];
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-bold">{label}</legend>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip
          active={value === ""}
          onClick={() => {
            onChange("");
            track("filter_use", { filtro: kind, valor: "todas" });
          }}
        >
          Todas
        </Chip>
        {options.map((option) => (
          <Chip
            key={option.id}
            active={value === option.id}
            onClick={() => {
              onChange(option.id);
              track("filter_use", { filtro: kind, valor: option.id });
            }}
          >
            {option.name}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${active ? "bg-ink text-cream" : "bg-white text-ink"}`}
    >
      {children}
    </button>
  );
}
