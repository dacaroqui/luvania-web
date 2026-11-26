import { BookButton } from "@/components/book-button";
import { OfferCard } from "@/components/offer-card";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { offersAtSede } from "@/data/shop";
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
  const promotions = offersAtSede(sede.slug);
  const photo = sedePhoto(sede.slug);
  const mapQuery = encodeURIComponent(`${sede.address}, Bogotá, Colombia`);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
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
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-lg">{sede.address}</p>
        <BookButton sede={sede.slug} />
        {sede.mapsUrl ? <a className="btn-line" href={sede.mapsUrl}>Cómo llegar</a> : null}
      </div>

      <div className="sede-local-grid mt-7">
        <section className="min-w-0 rounded-3xl border border-white/80 bg-[#fffaf3] p-4 sm:p-6" aria-labelledby="promociones-sede">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="promociones-sede" className="display text-3xl">Promociones en {sede.name}</h2>
            <Link href={"/promociones?sede=" + sede.slug} className="font-bold text-clay underline underline-offset-4">Ver todas</Link>
          </div>
          {promotions.length ? (
            <ul className="shop-grid mt-4">
              {promotions.slice(0, 3).map((offer) => <OfferCard key={offer.slug} offer={offer} sede={sede.slug} />)}
            </ul>
          ) : <p className="mt-3 text-mute">Esta sede no tiene promociones vigentes publicadas.</p>}
        </section>
        <aside className="grid gap-3 rounded-3xl border border-white/80 bg-[#fffaf3] p-4 sm:p-6">
          <h2 className="display text-3xl">Antes de tu visita</h2>
          <div>
            <h3 className="font-bold">Horarios</h3>
            {hours.length ? (
              <ul className="mt-2 grid gap-2 text-sm">
                {hours.map((row) => <li key={row.days} className="flex flex-wrap justify-between gap-x-3"><span>{row.days}</span><strong>{row.hours}</strong></li>)}
              </ul>
            ) : <p className="mt-2 text-sm text-mute">El equipo te confirma el horario al agendar.</p>}
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold">
            <a className="text-clay underline" href={agendaLink({ sede: sede.name, whatsapp: sede.whatsapp, tratamiento: "una valoración", url: site.url + "/sedes/" + sede.slug })}>WhatsApp de {sede.name}</a>
            {phone ? <a className="text-clay underline" href={"tel:" + sede.phoneTel}>{phone}</a> : null}
            <a className="text-clay underline" href={"mailto:" + site.email}>Correo</a>
          </div>
          <details className="rounded-xl border border-[#eadccd] p-3">
            <summary className="cursor-pointer font-bold">Ver mapa de la sede</summary>
            <iframe title={"Mapa de Luvania " + sede.name} src={"https://maps.google.com/maps?q=" + mapQuery + "&z=16&output=embed"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-3 h-52 w-full rounded-xl border-0 bg-white" />
          </details>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={sedeAlt(sede.slug)} loading="lazy" className="aspect-video w-full rounded-xl object-cover" />
          ) : null}
        </aside>
      </div>
      <p className="mt-8 text-sm text-mute">
        Los tratamientos se hacen según disponibilidad de la sede. El catálogo completo está en{" "}
        <Link href="/tratamientos" className="font-bold underline">
          Tratamientos
        </Link>
        .
      </p>
    </main>
  );
}
