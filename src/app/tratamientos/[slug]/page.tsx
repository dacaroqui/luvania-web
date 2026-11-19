import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentView } from "@/components/treatment-view";
import { FichaAddButton, FichaTabs } from "@/components/treatment-ficha";
import { Valoracion } from "@/components/valoracion";
import { getTreatment, isIndexable, relatedTreatments, treatments } from "@/data";
import { discountPercent, offerForTreatment } from "@/data/offers";
import { priceCaption, purchaseTerms } from "@/data/purchase";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { especialidadBySlug, needById, zoneById } from "@/data/taxonomy";
import { cop } from "@/lib/format";
import { needPages, zonePages } from "@/lib/hubs";
import { publicText } from "@/lib/public-copy";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

const needHref = new Set(needPages.map((item) => item.slug));
const zoneHref = new Set(zonePages.map((item) => item.slug));

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

function BenefitIcon({ index }: { index: number }) {
  const paths = [
    "M12 3c2.5 3.2 4 5.6 4 8a4 4 0 0 1-8 0c0-2.4 1.5-4.8 4-8Z",
    "M4 9c1.6 1.2 3 1.2 4.6 0S12 7.8 13.6 9 16.6 10.2 18 9M4 14c1.6 1.2 3 1.2 4.6 0S12 12.8 13.6 14 16.6 15.2 18 14",
    "M12 4v2M12 18v2M4 12h2M18 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2l-1.4 1.4",
    "M12 20c4-3 6-6.2 6-9.2A6 6 0 0 0 6 10.8C6 13.8 8 17 12 20Z",
  ];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[index % paths.length]} />
    </svg>
  );
}

function NameList({ items }: { items: { name: string; href?: string }[] }) {
  if (items.length === 0) return null;
  return (
    <p>
      {items.map((item, index) => {
        const sep = index === 0 ? "" : index === items.length - 1 ? " y " : ", ";
        return (
          <span key={`${item.name}-${index}`}>
            {sep}
            {item.href ? <Link href={item.href}>{item.name}</Link> : item.name}
          </span>
        );
      })}
    </p>
  );
}

export default async function TratamientoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const verified = treatment.status === "VERIFIED";
  const especialidad = especialidadBySlug(treatment.especialidad);
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: especialidad?.name ?? "Especialidad", href: `/especialidades/${treatment.especialidad}` },
    { name: treatment.name, href: `/tratamientos/${treatment.slug}` },
  ];
  const summary = publicText(verified ? treatment.summary : treatment.neutralSummary, treatment.name);
  const queEs = verified ? clean(treatment.queEs) : "";
  const beneficios = verified ? treatment.beneficios.map((item) => clean(item)).filter(Boolean) : [];
  const paraQuien = verified ? clean(treatment.paraQuien) : "";
  const riesgos = verified ? clean(treatment.riesgos) : "";
  const procedimiento = verified ? clean(treatment.procedimiento) : "";
  const video = verified ? clean(treatment.video) : "";
  const sesiones = verified ? clean(treatment.sesiones) : "";
  const duracion = verified ? clean(treatment.duracion) : "";
  const faqs = verified
    ? treatment.faqs.map((faq) => ({ q: clean(faq.q), a: clean(faq.a) })).filter((faq) => faq.q && faq.a)
    : [];
  const showHow = Boolean(procedimiento || video);
  const offer = offerForTreatment(treatment.slug);
  const percent = offer && !offer.priceBeforeSuspicious ? discountPercent(offer) : null;
  const terms = purchaseTerms(treatment.slug);
  const caption = priceCaption(terms.tipoPrecio);
  const zones = treatment.zones.map((id) => ({
    name: zoneById(id)?.name ?? id,
    href: zoneHref.has(id) ? `/zonas/${id}` : undefined,
  }));
  const needs = treatment.needs.map((id) => ({
    name: needById(id)?.name ?? id,
    href: needHref.has(id) ? `/necesidades/${id}` : undefined,
  }));
  const sedes = resolveSedes().map((sede) => ({ name: sede.name, href: `/sedes/${sede.slug}` }));
  const related = verified ? relatedTreatments(treatment).filter((item) => item.status === "VERIFIED").slice(0, 3) : [];
  const heroBenefits = beneficios.slice(0, 4);

  const sections = [
    showHow ? { id: "como-funciona", label: "Cómo funciona" } : null,
    queEs ? { id: "que-es", label: "Qué es" } : null,
    beneficios.length ? { id: "beneficios", label: "Beneficios" } : null,
    paraQuien ? { id: "para-quien", label: "¿Para quién es?" } : null,
    riesgos ? { id: "riesgos", label: "Riesgos" } : null,
    faqs.length ? { id: "preguntas", label: "Preguntas frecuentes" } : null,
  ].filter((item): item is { id: string; label: string } => Boolean(item));

  const procedureLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: treatment.name,
    description: summary,
    url: `${site.url}/tratamientos/${treatment.slug}`,
    provider: { "@type": "MedicalClinic", name: site.legalName, url: site.url },
  };
  if (procedimiento) procedureLd.howPerformed = procedimiento;

  return (
    <main className="ficha">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={procedureLd} />
      {faqs.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }}
        />
      ) : null}
      <TreatmentView name={treatment.name} />

      <section className="ficha-hero" data-tone="cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ficha-hero-petal" src="/stock/petalo-b.webp" alt="" />
        <div className="ficha-hero-grid">
          <div className="ficha-hero-copy">
            <Breadcrumbs items={crumbs} />
            {especialidad ? <p className="ficha-kicker">{especialidad.name}</p> : null}
            <h1 className="display">{treatment.name}</h1>
            {summary ? <p className="ficha-summary">{summary}</p> : null}
            <div className="ficha-hero-actions">
              <BookButton tratamiento={treatment.name}>Agenda tu valoración</BookButton>
              {showHow ? (
                <a className="ficha-how" href="#como-funciona">
                  <span className="ficha-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M10 8.5v7l6-3.5-6-3.5Z" />
                    </svg>
                  </span>
                  Ver cómo funciona
                </a>
              ) : null}
            </div>
            {heroBenefits.length ? (
              <ul className="ficha-hero-benefits">
                {heroBenefits.map((item, index) => (
                  <li key={item}>
                    <BenefitIcon index={index} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="ficha-hero-visual">
            <div className="ficha-portrait">
              {treatment.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={treatment.image} alt={treatment.name} width={960} height={640} />
              ) : (
                <div className="ficha-portrait-empty" aria-hidden="true" />
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ficha-portrait-petal" src="/stock/petalo-a.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="ficha-stage">
        <FichaTabs items={sections} />
        <aside className="ficha-aside">
          <div className="ficha-price">
            {offer && percent ? <p className="ficha-discount">{percent}% de descuento</p> : null}
            {offer ? (
              <>
                <p className="ficha-amount">{cop(offer.priceNow)}</p>
                {caption ? <p className="ficha-caption">{caption}</p> : null}
                <p className="ficha-validity">Sujeto a valoración y vigencia.</p>
              </>
            ) : null}
            <BookButton className="btn-coral ficha-book" tratamiento={treatment.name}>
              Agenda tu valoración
            </BookButton>
            {offer ? <FichaAddButton slug={treatment.slug} nombre={treatment.name} /> : null}
            <ul className="ficha-meta">
              {zones.length ? (
                <li>
                  <BenefitIcon index={3} />
                  <div>
                    <h2>Zonas de aplicación</h2>
                    <NameList items={zones} />
                  </div>
                </li>
              ) : null}
              {needs.length ? (
                <li>
                  <BenefitIcon index={2} />
                  <div>
                    <h2>Necesidades que acompaña</h2>
                    <NameList items={needs} />
                  </div>
                </li>
              ) : null}
              <li>
                <BenefitIcon index={1} />
                <div>
                  <h2>Sedes disponibles</h2>
                  <NameList items={sedes} />
                </div>
              </li>
              {sesiones ? (
                <li>
                  <div>
                    <h2>Sesiones</h2>
                    <p>{sesiones}</p>
                  </div>
                </li>
              ) : null}
              {duracion ? (
                <li>
                  <div>
                    <h2>Duración</h2>
                    <p>{duracion}</p>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        </aside>

        <div className="ficha-main">
          {showHow ? (
            <section id="como-funciona" className="ficha-block">
              <h2 className="display">Cómo funciona</h2>
              {procedimiento ? <p>{procedimiento}</p> : null}
              {video ? <VideoBlock src={video} name={treatment.name} /> : null}
            </section>
          ) : null}

          {queEs ? (
            <section id="que-es" className="ficha-block ficha-que">
              <div>
                <h2 className="display">Qué es</h2>
                <p>{queEs}</p>
              </div>
              {treatment.image ? (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={treatment.image} alt="" width={960} height={640} />
                </figure>
              ) : null}
            </section>
          ) : null}

          {beneficios.length ? (
            <section id="beneficios" className="ficha-block ficha-beneficios">
              <h2 className="display">Beneficios</h2>
              <ul>
                {beneficios.map((item, index) => (
                  <li key={item}>
                    <BenefitIcon index={index} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {paraQuien || riesgos ? (
            <div className="ficha-pair">
              {paraQuien ? (
                <section id="para-quien" className="ficha-card">
                  <h2 className="display">¿Para quién es?</h2>
                  <p>{paraQuien}</p>
                </section>
              ) : null}
              {riesgos ? (
                <section id="riesgos" className="ficha-card ficha-card-soft">
                  <h2 className="display">Riesgos y contraindicaciones</h2>
                  <p>{riesgos}</p>
                </section>
              ) : null}
            </div>
          ) : null}

          {faqs.length ? (
            <section id="preguntas" className="ficha-block">
              <h2 className="display">Preguntas frecuentes</h2>
              <div className="ficha-faqs">
                {faqs.map((faq) => (
                  <details key={faq.q} className="ficha-faq">
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="ficha-related">
          <div className="ficha-related-head">
            <h2 className="display">También te puede interesar</h2>
            <Link href="/tratamientos">
              Ver todos los tratamientos <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ul>
            {related.map((item) => {
              const spec = especialidadBySlug(item.especialidad)?.name;
              return (
                <li key={item.slug}>
                  <Link href={`/tratamientos/${item.slug}`} className="ficha-related-card">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" />
                    ) : (
                      <span className="ficha-related-empty" />
                    )}
                    {spec ? <span className="ficha-related-kicker">{spec}</span> : null}
                    <span className="display ficha-related-name">{item.name}</span>
                    <span className="ficha-related-go" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <Valoracion layout="steps" />

      <div className="ficha-mobile-bar">
        {offer ? <p className="ficha-mobile-price">{cop(offer.priceNow)}</p> : null}
        <BookButton className="btn-coral" tratamiento={treatment.name}>
          Agenda tu valoración
        </BookButton>
      </div>
    </main>
  );
}

function VideoBlock({ src, name }: { src: string; name: string }) {
  const own = src.startsWith("/");
  if (own) {
    return (
      <video className="ficha-video" controls preload="metadata">
        <source src={src} />
      </video>
    );
  }
  return (
    <p>
      <a href={src} rel="noopener noreferrer" target="_blank">
      Ver el video de {name}
    </a>
    </p>
  );
}
