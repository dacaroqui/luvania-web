import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentView } from "@/components/treatment-view";
import { Valoracion } from "@/components/valoracion";
import { getTreatment, isIndexable, relatedTreatments, treatments } from "@/data";
import { PRICE_AS_OF, discountPercent, offerForTreatment } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
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
  return {
    ...pageMeta({
      title: `${treatment.name} en Bogotá | Luvania`,
      description: treatment.status === "VERIFIED" ? treatment.summary : treatment.neutralSummary || treatment.name,
      path: `/tratamientos/${treatment.slug}`,
    }),
    robots: isIndexable(treatment) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

function shown(value: string) {
  if (!value || value.includes("TODO")) return "Se define en tu valoración.";
  return value;
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
        <h1 className="display mt-6 text-5xl">{treatment.name}</h1>
        <p className="mt-4 text-lg leading-8">{treatment.neutralSummary}</p>
        <p className="mt-4 text-sm text-mute">Esta ficha no está en el índice mientras dirección médica no la apruebe.</p>
        <div className="mt-8">
          <BookButton tratamiento={treatment.name} />
        </div>
      </main>
    );
  }

  const offer = offerForTreatment(treatment.slug);
  const percent = offer && !offer.priceBeforeSuspicious ? discountPercent(offer) : null;
  const related = relatedTreatments(treatment).filter((item) => item.status === "VERIFIED");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
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
      <TreatmentView name={treatment.name} />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-clay uppercase">{especialidad?.name}</p>
      <h1 className="display mt-2 text-5xl leading-none sm:text-6xl">{treatment.name}</h1>
      <p className="mt-6 text-lg leading-8">{treatment.summary}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Info title="Zona" value={treatment.zones.map((id) => zoneById(id)?.name ?? id).join(", ")} />
        <Info title="Para quién" value={treatment.paraQuien} />
        <Info title="Sesiones" value={shown(treatment.sesiones)} />
        <Info title="Duración" value={shown(treatment.duracion)} />
        <Info title="Recuperación" value="Se define en tu valoración." />
        <Info title="Necesidad" value={treatment.needs.map((id) => needById(id)?.name ?? id).join(", ")} />
      </div>
      {offer && percent ? (
        <p className="mt-4 text-sm">
          Precios publicados el {PRICE_AS_OF}: <span className="line-through">{cop(offer.priceBefore)}</span>{" "}
          <strong>{cop(offer.priceNow)}</strong>. Sujeto a valoración y vigencia.
        </p>
      ) : null}
      <div className="mt-6">
        <BookButton tratamiento={treatment.name} />
      </div>

      <details className="mt-10 rounded-3xl bg-white p-5" open>
        <summary className="cursor-pointer text-xl font-bold">Qué es</summary>
        <p className="mt-3 leading-7">{treatment.queEs}</p>
      </details>
      <details className="mt-3 rounded-3xl bg-white p-5">
        <summary className="cursor-pointer text-xl font-bold">Beneficios</summary>
        <ul className="mt-3 grid gap-2">
          {treatment.beneficios.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      <details className="mt-3 rounded-3xl bg-white p-5">
        <summary className="cursor-pointer text-xl font-bold">Riesgos y contraindicaciones</summary>
        <p className="mt-3 leading-7">
          Embarazo, infección activa en la zona y la expectativa de un resultado de cirugía se conversan antes.
          El equipo dice si este protocolo cabe. No es una promesa de resultado.
        </p>
      </details>
      <details className="mt-3 rounded-3xl bg-white p-5" open>
        <summary className="cursor-pointer text-xl font-bold">Preguntas frecuentes</summary>
        <div className="mt-3 grid gap-4">
          {treatment.faqs.map((faq) => (
            <div key={faq.q}>
              <h2 className="font-bold">{faq.q}</h2>
              <p className="mt-1 leading-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </details>

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
                <Link href={`/tratamientos/${item.slug}`} className="tilt-card block rounded-2xl bg-ink p-4 text-cream">
                  <span className="display text-2xl">{item.name}</span>
                </Link>
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

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4">
      <dt className="text-xs font-bold tracking-[0.14em] text-mute uppercase">{title}</dt>
      <dd className="mt-2 text-sm leading-6">{value}</dd>
    </div>
  );
}
