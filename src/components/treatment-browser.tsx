"use client";

import { especialidades, needs, zones } from "@/data/taxonomy";
import { DiscountBadge } from "./discount-badge";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export type BrowserItem = {
  slug: string;
  name: string;
  summary: string;
  especialidad: string;
  zones: string[];
  needs: string[];
  placeholder: boolean;
  discount: number | null;
};

export function TreatmentBrowser({ items }: { items: BrowserItem[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [especialidad, setEspecialidad] = useState(params.get("especialidad") ?? "");
  const [zona, setZona] = useState(params.get("zona") ?? "");
  const [necesidad, setNecesidad] = useState(params.get("necesidad") ?? "");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("es");
    return items.filter((item) => {
      if (especialidad && item.especialidad !== especialidad) return false;
      if (zona && !item.zones.includes(zona)) return false;
      if (necesidad && !item.needs.includes(necesidad)) return false;
      if (!q) return true;
      const blob = `${item.name} ${item.summary}`.toLocaleLowerCase("es");
      return blob.includes(q);
    });
  }, [items, query, especialidad, zona, necesidad]);

  return (
    <div>
      <label className="block">
        <span className="text-sm font-bold">Buscar</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hilos, papada, manchas, plasma…"
          className="mt-2 min-h-12 w-full rounded-full border border-line bg-white px-5"
        />
      </label>

      <Filter
        label="Especialidad"
        value={especialidad}
        onChange={setEspecialidad}
        options={especialidades.map((item) => ({ id: item.slug, name: item.name }))}
      />
      <Filter label="Zona" value={zona} onChange={setZona} options={zones.map((item) => ({ id: item.id, name: item.name }))} />
      <Filter
        label="Necesidad"
        value={necesidad}
        onChange={setNecesidad}
        options={needs.map((item) => ({ id: item.id, name: item.name }))}
      />

      <p className="mt-6 text-sm text-mute" aria-live="polite">
        {visible.length} {visible.length === 1 ? "tratamiento" : "tratamientos"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-white p-6 text-mute">
          Ningún tratamiento coincide. Quita un filtro o prueba con otra palabra.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/tratamientos/${item.slug}`}
                className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-salmon"
              >
                {item.discount ? (
                  <span className="absolute top-4 right-4 scale-75">
                    <DiscountBadge percent={item.discount} />
                  </span>
                ) : null}
                <p className="text-xs font-bold tracking-[0.14em] text-coral uppercase">
                  {especialidades.find((esp) => esp.slug === item.especialidad)?.name}
                </p>
                <h2 className="display mt-2 pr-12 text-3xl leading-none">{item.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-mute">{item.summary}</p>
                {item.placeholder ? (
                  <p className="mt-3 text-xs font-semibold text-mute">Contenido por confirmar</p>
                ) : null}
                <span className="mt-4 text-sm font-bold group-hover:text-coral">Ver ficha</span>
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
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-bold">{label}</legend>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip active={value === ""} onClick={() => onChange("")}>
          Todas
        </Chip>
        {options.map((option) => (
          <Chip key={option.id} active={value === option.id} onClick={() => onChange(option.id)}>
            {option.name}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${
        active ? "bg-ink text-cream" : "bg-white text-ink"
      }`}
    >
      {children}
    </button>
  );
}
