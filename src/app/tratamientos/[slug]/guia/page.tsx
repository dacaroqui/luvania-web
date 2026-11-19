import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { GuideArt } from "@/components/guia-art";
import { JsonLd } from "@/components/json-ld";
import { allGuides, getGuide, readingMinutes } from "@/data/guides";
import { getTreatment } from "@/data";
import { site } from "@/data/site";
import { especialidadBySlug, needById, zoneById } from "@/data/taxonomy";
import { needPages, zonePages } from "@/lib/hubs";
import { relatedGuides } from "@/lib/guide-links";
import { publicText } from "@/lib/public-copy";
import { clinicalVisible } from "@/lib/review";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

const needHref = new Set(needPages.map((item) => item.slug));
const zoneHref = new Set(zonePages.map((item) => item.slug));

export function generateStaticParams() {
  return allGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  const treatment = guide ? getTreatment(slug) : undefined;
  if (!guide || !treatment) return {};
  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/tratamientos/${guide.slug}/guia`,
    image: treatment.image,
    imageAlt: treatment.name,
    index: guide.medicalReview === "aprobado",
  });
}

export default async function GuiaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const treatment = guide ? getTreatment(slug) : undefined;
  if (!guide || !treatment || !clinicalVisible(guide.medicalReview)) notFound();

  const especialidad = especialidadBySlug(treatment.especialidad);
  const minutes = readingMinutes(guide);
  const fichaUrl = `${site.url}/tratamientos/${treatment.slug}`;
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: treatment.name, href: `/tratamientos/${treatment.slug}` },
    { name: "Guía", href: `/tratamientos/${treatment.slug}/guia` },
  ];
  const articles = relatedGuides(treatment, 3);
  const summary = publicText(treatment.summary, treatment.name);
  const zones = treatment.zones.map((id) => ({
    name: zoneById(id)?.name ?? id,
    href: zoneHref.has(id) ? `/zonas/${id}` : undefined,
  }));
  const needs = treatment.needs.map((id) => ({
    name: needById(id)?.name ?? id,
    href: needHref.has(id) ? `/necesidades/${id}` : undefined,
  }));

  return (
    <main className="guia">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.h1,
          description: guide.description,
          url: `${site.url}/tratamientos/${guide.slug}/guia`,
          inLanguage: "es-CO",
          about: { "@type": "MedicalProcedure", name: treatment.name, url: fichaUrl },
          mentions: { "@type": "MedicalProcedure", name: treatment.name, url: fichaUrl },
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          citation: guide.references.map((source) => ({
            "@type": "CreativeWork",
            name: source.title,
            url: source.href,
            publisher: { "@type": "Organization", name: source.publisher },
          })),
        }}
      />
      {guide.faqs.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }}
        />
      ) : null}

      <header className="guia-hero" data-tone="cream">
        <div className="guia-wrap">
          <Breadcrumbs items={crumbs} />
          <p className="guia-kicker">Guía · {minutes} min de lectura</p>
          <h1 className="display">{guide.h1}</h1>
          <p className="guia-lead">{guide.description}</p>
          {guide.medicalReview === "pendiente" ? (
            <p className="ficha-review-note">Contenido en revisión médica</p>
          ) : null}
          <TreatmentBridge treatment={treatment} summary={summary} />
        </div>
      </header>

      <div className="guia-layout guia-wrap">
        <nav className="guia-toc" aria-label="Contenido de la guía">
          <p>En esta guía</p>
          <ol>
            {guide.blocks.map((block) => (
              <li key={block.id}>
                <a href={`#${block.id}`}>{block.title}</a>
              </li>
            ))}
            {guide.faqs.length ? (
              <li>
                <a href="#preguntas">Mitos y preguntas frecuentes</a>
              </li>
            ) : null}
            {guide.references.length ? (
              <li>
                <a href="#referencias">Referencias</a>
              </li>
            ) : null}
          </ol>
        </nav>
        <article className="guia-body">
          {guide.blocks.map((block) => (
            <section key={block.id} id={block.id}>
              <h2 className="display">{block.title}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {block.figure ? <GuideArt kind={block.figure.kind} alt={block.figure.alt} caption={block.figure.caption} /> : null}
            </section>
          ))}
          {guide.faqs.length ? (
            <section id="preguntas">
              <h2 className="display">Mitos y preguntas frecuentes</h2>
              <div className="ficha-faqs">
                {guide.faqs.map((faq) => (
                  <details key={faq.q} className="ficha-faq">
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {guide.references.length ? (
            <section id="referencias" className="guia-refs">
              <h2 className="display">Referencias</h2>
              <p>Consultadas el 19 de noviembre de 2026. Sirven para sostener el mecanismo y el origen. No son una promesa de resultado.</p>
              <ol>
                {guide.references.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} rel="noopener noreferrer">
                      {source.title}
                    </a>
                    <span>{source.publisher}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <aside className="guia-links">
            <h2 className="display">Sigue por aquí</h2>
            <ul>
              <li>
                <Link href={`/tratamientos/${treatment.slug}`}>Ficha de {treatment.name}</Link>
              </li>
              {especialidad ? (
                <li>
                  <Link href={`/especialidades/${treatment.especialidad}`}>{especialidad.name}</Link>
                </li>
              ) : null}
              {needs.map((item) =>
                item.href ? (
                  <li key={item.href}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ) : null,
              )}
              {zones.map((item) =>
                item.href ? (
                  <li key={item.href}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ) : null,
              )}
            </ul>
          </aside>

          {articles.length ? (
            <section className="guia-related">
              <h2 className="display">Artículos relacionados</h2>
              <ul>
                {articles.map(({ guide: item }) => (
                  <li key={item.slug}>
                    <Link href={`/tratamientos/${item.slug}/guia`}>{item.h1}</Link>
                    <span>{readingMinutes(item)} min de lectura</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <TreatmentBridge treatment={treatment} summary={summary} />
        </article>
      </div>
    </main>
  );
}

function TreatmentBridge({
  treatment,
  summary,
}: {
  treatment: { slug: string; name: string; needs?: string[] };
  summary: string;
}) {
  return (
    <aside className="guia-bridge glass">
      <div>
        <p className="ficha-guide-kicker">El tratamiento</p>
        <h2 className="display">{treatment.name}</h2>
        {summary ? <p>{summary}</p> : null}
      </div>
      <div className="guia-bridge-actions">
        <Link href={`/tratamientos/${treatment.slug}`}>Conoce el tratamiento</Link>
        <BookButton tratamiento={treatment.name} tratamientoId={treatment.slug} necesidad={treatment.needs?.[0]}>Agenda tu valoración</BookButton>
      </div>
    </aside>
  );
}
