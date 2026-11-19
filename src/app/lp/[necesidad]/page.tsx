import { DoctorPlaceholder, PhotoPlaceholders } from "@/components/lp/photo-placeholders";
import { SimulationPanel } from "@/components/lp/simulation-panel";
import { ValuationWizard } from "@/components/lp/valuation-wizard";
import { OfferCard, isPublishedOffer } from "@/components/offer-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTreatment } from "@/data";
import { extraNeedsFor, getLanding, allLandings } from "@/data/landings";
import { getGuide } from "@/data/guides";
import { offerIsExpired, offers } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
import { publicText } from "@/lib/public-copy";
import { placeholdersVisible } from "@/lib/placeholders";
import { clinicalVisible } from "@/lib/review";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { necesidad: string };

function patientCopy(value: string | undefined) {
  return publicText(value)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part && !/enlace |hair-loss|hair loss|nombre visible|menú viejo|menú antiguo/i.test(part))
    .join(" ");
}

export function generateStaticParams() {
  return allLandings().map((landing) => ({ necesidad: landing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { necesidad } = await params;
  const landing = getLanding(necesidad);
  if (!landing) return {};
  return pageMeta({
    title: landing.title,
    description: landing.description,
    path: `/lp/${landing.slug}`,
    index: false,
  });
}

export default async function LandingPage({ params }: { params: Promise<Params> }) {
  const { necesidad } = await params;
  const landing = getLanding(necesidad);
  const treatment = landing ? getTreatment(landing.treatmentSlug) : undefined;
  if (!landing || !treatment) notFound();

  const preview = placeholdersVisible();
  const queEs = patientCopy(treatment.queEs);
  const paraQuien = patientCopy(treatment.paraQuien);
  const duracion = patientCopy(treatment.duracion);
  const beneficios = treatment.beneficios.map((item) => patientCopy(item)).filter(Boolean);
  const faqs = treatment.faqs
    .map((faq) => ({ q: patientCopy(faq.q), a: patientCopy(faq.a) }))
    .filter((faq) => faq.q && faq.a);
  const guide = getGuide(treatment.slug);
  const showGuide = Boolean(guide && clinicalVisible(guide.medicalReview));
  const guideText = showGuide
    ? guide!.blocks
        .flatMap((block) => [block.card, ...block.paragraphs])
        .map((paragraph) => patientCopy(paragraph))
        .filter(Boolean)
        .slice(0, 2)
    : [];
  const related = new Set([treatment.slug, ...treatment.related]);
  const promos = offers.filter((offer) => related.has(offer.treatmentSlug) && isPublishedOffer(offer) && !offerIsExpired(offer));
  const crumbs = [{ name: treatment.name, href: `/lp/${landing.slug}` }];

  return (
    <main className="lp">
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <Breadcrumbs items={crumbs} />
          <p className="lp-kicker">Valoración</p>
          <h1 className="display">{treatment.name}</h1>
          {queEs ? <p>{queEs}</p> : null}
          <a className="btn-coral" href="#valoracion">
            Iniciar valoración
          </a>
        </div>
        {preview ? <DoctorPlaceholder /> : null}
      </section>

      {preview ? <PhotoPlaceholders /> : null}
      <SimulationPanel enabled={preview} />

      <section className="lp-block lp-copy">
        <h2 className="display">Qué está publicado</h2>
        {beneficios.length ? (
          <ul>
            {beneficios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {paraQuien ? <p>{paraQuien}</p> : null}
        {duracion ? <p>{duracion}</p> : null}
        {guideText.length ? (
          <div className="lp-guide">
            {guide?.medicalReview === "pendiente" ? <p className="ficha-review-note">Contenido en revisión médica</p> : null}
            {guideText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href={`/tratamientos/${treatment.slug}/guia`}>Leer la guía de {treatment.name}</Link>
          </div>
        ) : null}
        {faqs.length ? (
          <div className="ficha-faqs">
            {faqs.map((faq) => (
              <details key={faq.q} className="ficha-faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        ) : null}
        <Link href={`/tratamientos/${treatment.slug}`}>Ver la ficha de {treatment.name}</Link>
      </section>

      {promos.length ? (
        <section className="lp-block">
          <h2 className="display">Promociones vigentes</h2>
          <ul className="lp-promos">
            {promos.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </ul>
        </section>
      ) : null}

      <ValuationWizard
        preview={preview}
        needId={landing.needId}
        path={`/lp/${landing.slug}`}
        questions={landing.questions}
        extras={extraNeedsFor(landing.needId)}
        sedes={resolveSedes().map((sede) => ({ slug: sede.slug, name: sede.name }))}
      />
    </main>
  );
}
