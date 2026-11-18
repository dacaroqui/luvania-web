import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentCard } from "@/components/treatment-card";
import { TreatmentMedia } from "@/components/treatment-media";
import { TreatmentView } from "@/components/treatment-view";
import { Valoracion } from "@/components/valoracion";
import { getTreatment, isIndexable, relatedTreatments, treatments } from "@/data";
import { discountPercent, offerForTreatment } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { especialidadBySlug, needById, zoneById } from "@/data/taxonomy";
import { cop } from "@/lib/format";
import { publicText } from "@/lib/public-copy";
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
  return {
    ...pageMeta({
      title: `${treatment.name} en Bogotá | Luvania`,
      description: publicText(
        treatment.status === "VERIFIED" ? treatment.summary : treatment.neutralSummary,
        treatment.name,
      ),
      path: `/tratamientos/${treatment.slug}`,
    }),
    robots: isIndexable(treatment) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

function clean(value: string | undefined) {
  return publicText(value);
}

export default async function TratamientoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();
  const especialidad = especialidadBySlug(treatment.especialidad);
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: especialidad?.name ?? "Especialidad", href: `/especialidades/${treatment.especialidad}` },
    { name: treatment.name, href: `/tratamientos/${treatment.slug}` },
  ];
  const sedes = resolveSedes();

  if (treatment.status !== "VERIFIED") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <JsonLd data={breadcrumbLd(crumbs)} />
        <TreatmentView name={treatment.name} />
        <Breadcrumbs items={crumbs} />
        <div className="ficha-media">
          <TreatmentMedia name={treatment.name} image={treatment.image} />
        </div>
        <h1 className="display mt-6 text-5xl">{treatment.name}</h1>
        <p className="mt-4 text-lg leading-8">{publicText(treatment.neutralSummary, treatment.name)}</p>
        <div className="mt-8">
          <BookButton tratamiento={treatment.name} />
        </div>
      </main>
    );
  }

  const offer = offerForTreatment(treatment.slug);
  const percent = offer && !offer.priceBeforeSuspicious ? discountPercent(offer) : null;
  const related = relatedTreatments(treatment).filter((item) => item.status === "VERIFIED");
  const sesiones = clean(treatment.sesiones);
  const duracion = clean(treatment.duracion);
  const paraQuien = clean(treatment.paraQuien);
  const queEs = clean(treatment.queEs);
  const beneficios = treatment.beneficios.map((item) => clean(item)).filter(Boolean);
  const faqs = treatment.faqs.map((faq) => ({ q: clean(faq.q), a: clean(faq.a) })).filter((faq) => faq.q && faq.a);
  const facts = [
    ["Zona", treatment.zones.map((id) => zoneById(id)?.name ?? id).join(", ")],
    ["Necesidad", treatment.needs.map((id) => needById(id)?.name ?? id).join(", ")],
    paraQuien ? ["Para quién", paraQuien] : null,
    sesiones ? ["Sesiones", sesiones] : null,
    duracion ? ["Duración", duracion] : null,
  ].filter((item): item is [string, string] => Boolean(item));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: treatment.name,
          description: publicText(treatment.summary, treatment.name),
          url: `${site.url}/tratamientos/${treatment.slug}`,
          provider: { "@type": "MedicalClinic", name: site.legalName, url: site.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs
            .map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
        }}
      />
      <TreatmentView name={treatment.name} />
      <Breadcrumbs items={crumbs} />
      <div className="ficha-media">
        <TreatmentMedia name={treatment.name} image={treatment.image} />
      </div>
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-clay uppercase">{especialidad?.name}</p>
      <h1 className="display mt-2 text-5xl leading-none sm:text-6xl">{treatment.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">{publicText(treatment.summary, treatment.name)}</p>
      <dl className="ficha-facts">
        {facts.map(([title, value]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {!sesiones || !duracion ? (
        <p className="ficha-note">
          Las sesiones y el tiempo se acuerdan en tu valoración, con lo que el equipo vea ese día.
        </p>
      ) : null}
      {offer ? (
        <p className="mt-6 text-sm">
          {percent ? <span className="mr-2 text-xs font-bold tracking-[0.12em] text-clay uppercase">{percent}% de descuento</span> : null}
          <strong className="display text-3xl">{cop(offer.priceNow)}</strong>
          <span className="mt-1 block text-mute">Sujeto a valoración y vigencia.</span>
        </p>
      ) : null}
      <div className="mt-6">
        <BookButton tratamiento={treatment.name} />
      </div>

      {queEs ? (
        <section className="mt-12">
          <h2 className="display text-4xl">Qué es</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8">{queEs}</p>
        </section>
      ) : null}
      {beneficios.length ? (
        <section className="mt-10">
          <h2 className="display text-4xl">Beneficios</h2>
          <ul className="mt-4 grid max-w-2xl gap-2">
            {beneficios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="mt-10 max-w-2xl">
        <h2 className="display text-4xl">Riesgos y contraindicaciones</h2>
        <p className="mt-4 leading-8">
          Embarazo, infección activa en la zona y la expectativa de un resultado de cirugía se conversan antes.
          El equipo dice si este protocolo cabe. No es una promesa de resultado.
        </p>
      </section>
      {faqs.length ? (
        <section className="mt-10">
          <h2 className="display text-4xl">Preguntas frecuentes</h2>
          <div className="mt-4 grid max-w-2xl gap-5">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold">{faq.q}</h3>
                <p className="mt-1 leading-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="display text-3xl">Sedes</h2>
        <p className="mt-2 text-sm text-mute">
          La valoración se agenda en cualquiera de las cinco. El equipo confirma si el protocolo se realiza en esa sede.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {sedes.map((sede) => (
            <li key={sede.slug}>
              <Link href={`/sedes/${sede.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 font-semibold">
                {sede.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="display text-3xl">También se mira junto a</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <TreatmentCard slug={item.slug} name={item.name} summary={item.summary} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Valoracion />
      <BookButton tratamiento={treatment.name} />
    </main>
  );
}

