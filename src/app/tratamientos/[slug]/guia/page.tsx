import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { allGuides, getGuide, readingMinutes } from "@/data/guides";
import { getTreatment, relatedTreatments } from "@/data";
import { site } from "@/data/site";
import { especialidadBySlug, needById, zoneById } from "@/data/taxonomy";
import { needPages, zonePages } from "@/lib/hubs";
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
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: especialidad?.name ?? "Especialidad", href: `/especialidades/${treatment.especialidad}` },
    { name: treatment.name, href: `/tratamientos/${treatment.slug}` },
    { name: "Guía", href: `/tratamientos/${treatment.slug}/guia` },
  ];
  const related = relatedTreatments(treatment).filter((item) => item.status === "VERIFIED").slice(0, 3);
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
          "@type": "MedicalWebPage",
          headline: guide.h1,
          description: guide.description,
          url: `${site.url}/tratamientos/${guide.slug}/guia`,
          inLanguage: "es-CO",
          about: { "@type": "MedicalProcedure", name: treatment.name },
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
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
          <p className="guia-back">
            <Link href={`/tratamientos/${treatment.slug}`}>Volver a la ficha de {treatment.name}</Link>
          </p>
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
          </ol>
        </nav>
        <article className="guia-body">
          {guide.blocks.map((block) => (
            <section key={block.id} id={block.id}>
              <h2 className="display">{block.title}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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

          {related.length ? (
            <section className="guia-related">
              <h2 className="display">También te puede interesar</h2>
              <ul>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/tratamientos/${item.slug}`}>{item.name}</Link>
                    {getGuide(item.slug) && clinicalVisible(getGuide(item.slug)!.medicalReview) ? (
                      <Link href={`/tratamientos/${item.slug}/guia`}>Guía</Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="guia-cta">
            <BookButton tratamiento={treatment.name}>Agenda tu valoración</BookButton>
          </div>
        </article>
      </div>
    </main>
  );
}
