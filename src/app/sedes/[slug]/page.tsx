import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getSede, sedes } from "@/data/sedes";
import { site } from "@/data/site";
import { agendaLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return sedes.map((sede) => ({ slug: sede.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const sede = getSede(slug);
  if (!sede) return {};
  return pageMeta({
    title: `Luvania ${sede.name}: clínica estética en ${sede.neighborhood}`,
    description: `Luvania ${sede.name}, ${sede.address}, Bogotá. Horario, WhatsApp y valoración.`,
    path: `/sedes/${sede.slug}`,
  });
}

export default async function SedePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sede = getSede(slug);
  if (!sede) notFound();
  const crumbs = [
    { name: "Sedes", href: "/sedes" },
    { name: sede.name, href: `/sedes/${sede.slug}` },
  ];
  const sameAs = sede.mapsUrl ? [sede.mapsUrl] : undefined;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: `Luvania ${sede.name}`,
          url: `${site.url}/sedes/${sede.slug}`,
          parentOrganization: { "@type": "Organization", name: site.legalName, url: site.url },
          address: {
            "@type": "PostalAddress",
            streetAddress: sede.address,
            addressLocality: "Bogotá",
            addressCountry: "CO",
          },
          telephone: sede.phoneTel,
          geo: sede.geo
            ? { "@type": "GeoCoordinates", latitude: sede.geo.lat, longitude: sede.geo.lng }
            : undefined,
          sameAs,
        }}
      />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-coral uppercase">{sede.neighborhood}, Bogotá</p>
      <h1 className="display mt-2 text-5xl sm:text-6xl">Luvania {sede.name}</h1>
      <p className="mt-4 text-lg">{sede.address}</p>
      {sede.addressNote ? <p className="mt-2 text-sm text-mute">{sede.addressNote}</p> : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5">
          <dt className="text-xs font-bold tracking-[0.14em] uppercase">Teléfono</dt>
          <dd className="mt-2">
            {sede.phoneTel ? <a href={`tel:${sede.phoneTel}`}>{sede.phoneDisplay}</a> : sede.phoneDisplay}
          </dd>
        </div>
        <div className="rounded-3xl bg-white p-5">
          <dt className="text-xs font-bold tracking-[0.14em] uppercase">WhatsApp</dt>
          <dd className="mt-2">
            <a href={agendaLink({ sede: sede.name, whatsapp: sede.whatsapp, tratamiento: "una valoración", url: `https://luvania.com/sedes/${sede.slug}` })}>
              Escribir a {sede.name}
            </a>
          </dd>
          {sede.whatsappNote ? <dd className="mt-2 text-sm text-mute">{sede.whatsappNote}</dd> : null}
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="display text-3xl">Horario</h2>
        {sede.hoursNote ? <p className="mt-2 text-sm text-mute">{sede.hoursNote}</p> : null}
        <ul className="mt-4 grid gap-2">
          {sede.hours.map((row) => (
            <li key={row.days} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-white px-4 py-3">
              <span>{row.days}</span>
              <span className="font-semibold">{row.hours}</span>
            </li>
          ))}
        </ul>
      </section>

      {sede.mapsUrl ? (
        <p className="mt-6">
          <a className="font-bold underline decoration-coral underline-offset-4" href={sede.mapsUrl}>
            Cómo llegar en Google Maps
          </a>
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="display text-3xl">Qué falta confirmar</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          {sede.todo.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>Equipo médico de esta sede: TODO, no hay nombres publicados.</li>
          <li>Número de habilitación: TODO.</li>
        </ul>
      </section>

      <p className="mt-8 text-sm text-mute">
        Los tratamientos se hacen según disponibilidad de la sede. El catálogo completo está en{" "}
        <Link href="/tratamientos" className="font-bold underline">
          Tratamientos
        </Link>
        .
      </p>
      <BookButton className="mt-6 min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Agendar valoración
      </BookButton>
    </main>
  );
}
