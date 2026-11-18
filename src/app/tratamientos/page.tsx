import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { CatalogList } from "@/components/catalog-list";
import { JsonLd } from "@/components/json-ld";
import { verifiedCatalog } from "@/data/catalog";
import { especialidades, needs, zones } from "@/data/taxonomy";
import { matchCatalog } from "@/lib/search";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Tratamientos estéticos en Bogotá | Luvania",
  description: "Catálogo publicado de Luvania. Filtra por especialidad, zona o necesidad, o busca por nombre.",
  path: "/tratamientos",
});

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function href(current: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(current);
  if (value) next.set(key, value);
  else next.delete(key);
  const query = next.toString();
  return query ? `/tratamientos?${query}` : "/tratamientos";
}

export default async function TratamientosPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const q = one(params.q);
  const especialidad = one(params.especialidad);
  const zona = one(params.zona);
  const necesidad = one(params.necesidad);
  const az = one(params.orden) === "az";
  const current = new URLSearchParams();
  if (q) current.set("q", q);
  if (especialidad) current.set("especialidad", especialidad);
  if (zona) current.set("zona", zona);
  if (necesidad) current.set("necesidad", necesidad);
  if (az) current.set("orden", "az");

  let items = matchCatalog(verifiedCatalog(), q).filter((item) => {
    if (especialidad && item.especialidad !== especialidad) return false;
    if (zona && !item.zones.includes(zona)) return false;
    if (necesidad && !item.needs.includes(necesidad)) return false;
    return true;
  });
  if (az) items = items.slice().sort((a, b) => a.name.localeCompare(b.name, "es"));

  const chips = [
    q ? { key: "q", label: `“${q}”` } : null,
    necesidad ? { key: "necesidad", label: needs.find((item) => item.id === necesidad)?.name ?? necesidad } : null,
    zona ? { key: "zona", label: zones.find((item) => item.id === zona)?.name ?? zona } : null,
    especialidad
      ? { key: "especialidad", label: especialidades.find((item) => item.slug === especialidad)?.name ?? especialidad }
      : null,
    az ? { key: "orden", label: "A–Z" } : null,
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  const crumbs = [{ name: "Tratamientos", href: "/tratamientos" }];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-4xl sm:text-6xl">Tratamientos</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">{verifiedCatalog().length} protocolos publicados.</p>
      <div className="mt-8">
        <form action="/tratamientos" className="scroll-mt-28" id="nombre">
          {especialidad ? <input type="hidden" name="especialidad" value={especialidad} /> : null}
          {zona ? <input type="hidden" name="zona" value={zona} /> : null}
          {necesidad ? <input type="hidden" name="necesidad" value={necesidad} /> : null}
          {az ? <input type="hidden" name="orden" value="az" /> : null}
          <label className="block text-sm font-bold">
            Buscar
            <input name="q" defaultValue={q} placeholder="Hilos, papada, hidroxiapatita, hair loss…" className="field mt-2" />
          </label>
        </form>
        <FilterRow id="necesidad" label="Necesidad" current={current} value={necesidad} options={needs.map((item) => ({ id: item.id, name: item.name }))} />
        <FilterRow id="zona" label="Zona" current={current} value={zona} options={zones.map((item) => ({ id: item.id, name: item.name }))} />
        <FilterRow
          id="especialidad"
          label="Especialidad"
          current={current}
          value={especialidad}
          options={especialidades.map((item) => ({ id: item.slug, name: item.name }))}
        />
        <div id="az" className="mt-5 scroll-mt-28">
          <p className="text-sm font-bold">Nombre</p>
          <Link
            href={href(current, "orden", az ? "" : "az")}
            aria-current={az ? "true" : undefined}
            className={`mt-2 inline-flex min-h-10 items-center rounded-full px-3 text-sm font-semibold ${az ? "bg-ink text-cream" : "bg-white text-ink"}`}
          >
            A–Z
          </Link>
        </div>
        {chips.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <Link key={chip.key} href={href(current, chip.key, "")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-3 text-sm font-semibold text-cream">
                {chip.label}
                <span aria-hidden="true">×</span>
                <span className="sr-only">Quitar {chip.label}</span>
              </Link>
            ))}
            <Link href="/tratamientos" className="min-h-10 px-2 text-sm font-bold underline decoration-coral underline-offset-4">
              Limpiar filtros
            </Link>
          </div>
        ) : null}
        <p className="mt-6 text-sm text-mute">
          {items.length} {items.length === 1 ? "tratamiento" : "tratamientos"}
        </p>
        {items.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-6">
            <p>Ningún tratamiento publicado coincide.</p>
            <BookButton className="btn-coral mt-4" />
          </div>
        ) : (
          <CatalogList items={items} />
        )}
      </div>
    </main>
  );
}

function FilterRow({
  id,
  label,
  current,
  value,
  options,
}: {
  id: string;
  label: string;
  current: URLSearchParams;
  value: string;
  options: { id: string; name: string }[];
}) {
  return (
    <div id={id} className="mt-5 scroll-mt-28">
      <p className="text-sm font-bold">{label}</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Link href={href(current, id, "")} aria-current={value === "" ? "true" : undefined} className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-sm font-semibold ${value === "" ? "bg-ink text-cream" : "bg-white text-ink"}`}>
          Todas
        </Link>
        {options.map((option) => (
          <Link
            key={option.id}
            href={href(current, id, option.id)}
            aria-current={value === option.id ? "true" : undefined}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-sm font-semibold ${value === option.id ? "bg-ink text-cream" : "bg-white text-ink"}`}
          >
            {option.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
