import { BookButton } from "@/components/book-button";
import { OfferCard } from "@/components/offer-card";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { offerMatchesSede, offers } from "@/data/offers";
import { getSede, sedes } from "@/data/sedes";
import { sedeAlt, sedePhoto } from "@/data/sede-photos";
import { site } from "@/data/site";
import { isInternal } from "@/lib/public-copy";
import { agendaLink } from "@/lib/whatsapp";
import { clampMeta, pageMeta } from "@/lib/seo";
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
    description: clampMeta(`Luvania ${sede.name}, ${sede.address}, Bogotá. Horario, WhatsApp y valoración.`),
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
  const hours = sede.hours.filter((row) => !isInternal(row.hours));
  const phone = sede.phoneDisplay && !isInternal(sede.phoneDisplay) ? sede.phoneDisplay : "";
  const mapQuery = encodeURIComponent(`${sede.address}, Bogotá, Colombia`);

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
          telephone: phone ? sede.phoneTel : undefined,
          geo: sede.geo
            ? { "@type": "GeoCoordinates", latitude: sede.geo.lat, longitude: sede.geo.lng }
            : undefined,
          sameAs: sede.mapsUrl ? [sede.mapsUrl] : undefined,
        }}
      />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-clay uppercase">{sede.neighborhood}, Bogotá</p>
      <h1 className="display mt-2 text-4xl sm:text-6xl">Luvania {sede.name}</h1>
      {sedePhoto(sede.slug) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sedePhoto(sede.slug)}
          alt={sedeAlt(sede.slug)}
          className="mt-6 aspect-[16/9] w-full rounded-3xl object-cover"
        />
      ) : null}
      <p className="mt-4 text-lg">{sede.address}</p>

      <iframe
        title={`Mapa de Luvania ${sede.name}`}
        src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mt-6 h-72 w-full rounded-3xl border-0 bg-white"
      />

      <section className="mt-8">
        <h2 className="display text-3xl">Horario</h2>
        {hours.length > 0 ? (
          <ul className="mt-4 grid gap-2">
            {hours.map((row) => (
              <li key={row.days} className="flex flex-wrap justify-between gap-2 sede-tile px-4 py-3">
                <span>{row.days}</span>
                <span className="font-semibold">{row.hours}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-mute">El equipo te confirma el horario al agendar.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="display text-3xl">Canales</h2>
        <ul className="mt-4 grid gap-2">
          {phone ? (
            <li className="sede-tile px-4 py-3">
              <a className="font-semibold" href={`tel:${sede.phoneTel}`}>
                Teléfono {phone}
              </a>
            </li>
          ) : null}
          <li className="sede-tile px-4 py-3">
            <a
              className="font-semibold"
              href={agendaLink({
                sede: sede.name,
                whatsapp: sede.whatsapp,
                tratamiento: "una valoración",
                url: `${site.url}/sedes/${sede.slug}`,
              })}
            >
              WhatsApp de {sede.name}
            </a>
          </li>
          <li className="sede-tile px-4 py-3">
            <a className="font-semibold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          {sede.mapsUrl ? (
            <li className="sede-tile px-4 py-3">
              <a className="font-semibold" href={sede.mapsUrl}>
                Abrir en Google Maps
              </a>
            </li>
          ) : null}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="display text-4xl">Promociones en esta sede</h2>
        <ul className="shop-grid mt-6">
          {offers
            .filter((offer) => offerMatchesSede(offer, sede.slug))
            .map((offer) => (
              <OfferCard key={offer.slug} offer={offer} sede={sede.slug} />
            ))}
        </ul>
      </section>
      <p className="mt-8 text-sm text-mute">
        Los tratamientos se hacen según disponibilidad de la sede. El catálogo completo está en{" "}
        <Link href="/tratamientos" className="font-bold underline">
          Tratamientos
        </Link>
        .
      </p>
      <BookButton sede={sede.slug} className="mt-6 min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Agendar valoración
      </BookButton>
    </main>
  );
}
