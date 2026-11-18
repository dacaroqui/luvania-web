import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { DiscountBadge } from "@/components/discount-badge";
import { JsonLd } from "@/components/json-ld";
import { getTreatment, relatedTreatments, treatments } from "@/data";
import { PRICE_AS_OF, discountPercent, offerForTreatment } from "@/data/offers";
import { site } from "@/data/site";
import { especialidadBySlug, needById, zoneById } from "@/data/taxonomy";
import { cop } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return treatments.map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return pageMeta({
    title: `${treatment.name} en Bogotá | Luvania`,
    description: treatment.summary,
    path: `/tratamientos/${treatment.slug}`,
  });
}

export default async function TratamientoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();
  const especialidad = especialidadBySlug(treatment.especialidad);
  const offer = offerForTreatment(treatment.slug);
  const percent = offer ? discountPercent(offer) : null;
  const related = relatedTreatments(treatment);
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: especialidad?.name ?? "Especialidad", href: `/especialidades/${treatment.especialidad}` },
    { name: treatment.name, href: `/tratamientos/${treatment.slug}` },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: treatment.name,
          description: treatment.summary,
          url: `${site.url}/tratamientos/${treatment.slug}`,
          provider: { "@type": "MedicalClinic", name: site.legalName, url: site.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: treatment.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-coral uppercase">{especialidad?.name}</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <h1 className="display text-5xl leading-none sm:text-6xl">{treatment.name}</h1>
        {percent ? <DiscountBadge percent={percent} /> : null}
      </div>
      <p className="mt-6 text-lg leading-8">{treatment.summary}</p>

      {treatment.placeholder ? (
        <p className="mt-4 rounded-2xl border border-dashed border-salmon bg-peach/40 p-4 text-sm">
          Contenido por confirmar. {treatment.placeholderNote}
        </p>
      ) : null}

      {offer ? (
        <p className="mt-4 text-sm">
          Oferta rastreada el {PRICE_AS_OF}: <span className="line-through">{cop(offer.priceBefore)}</span>{" "}
          <strong>{cop(offer.priceNow)}</strong>. {offer.note} El rótulo viejo decía {offer.labelOnOldSite}.
        </p>
      ) : null}

      <BookButton
        tratamiento={treatment.name}
        className="mt-6 min-h-12 rounded-full bg-coral px-5 text-sm font-bold"
      >
        Agenda tu valoración sin costo
      </BookButton>

      <section className="mt-12">
        <h2 className="display text-3xl">Qué es</h2>
        <p className="mt-3 leading-7">{treatment.queEs}</p>
      </section>
      <section className="mt-10">
        <h2 className="display text-3xl">Beneficios</h2>
        <ul className="mt-3 grid gap-2">
          {treatment.beneficios.map((item) => (
            <li key={item} className="rounded-2xl bg-white px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="display text-3xl">Para quién</h2>
        <p className="mt-3 leading-7">{treatment.paraQuien}</p>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl bg-white p-5">
          <h2 className="display text-2xl">Sesiones</h2>
          <p className="mt-2 text-sm leading-6">{treatment.sesiones}</p>
        </article>
        <article className="rounded-3xl bg-white p-5">
          <h2 className="display text-2xl">Duración</h2>
          <p className="mt-2 text-sm leading-6">{treatment.duracion}</p>
        </article>
      </section>
      <p className="mt-4 text-sm text-mute">
        Zonas: {treatment.zones.map((id) => zoneById(id)?.name ?? id).join(", ")}. Necesidades:{" "}
        {treatment.needs.map((id) => needById(id)?.name ?? id).join(", ")}.
      </p>
      <section className="mt-10">
        <h2 className="display text-3xl">Preguntas frecuentes</h2>
        <div className="mt-3 grid gap-3">
          {treatment.faqs.map((faq) => (
            <details key={faq.q} className="rounded-2xl bg-white p-4">
              <summary className="cursor-pointer font-bold">{faq.q}</summary>
              <p className="mt-2 leading-7">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="display text-3xl">También se mira junto a</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/tratamientos/${item.slug}`} className="block rounded-2xl bg-ink p-4 text-cream">
                <span className="display text-2xl">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <BookButton
        tratamiento={treatment.name}
        className="mt-10 min-h-12 rounded-full bg-coral px-5 text-sm font-bold"
      >
        Agenda tu valoración sin costo
      </BookButton>
    </main>
  );
}
