import { Breadcrumbs } from "@/components/breadcrumbs";
import { OfferCard, isPublishedOffer } from "@/components/offer-card";
import { getGuide } from "@/data/guides";
import type { Landing } from "@/data/landings/types";
import { extraNeedsFor } from "@/data/landings";
import { offerIsExpired, offers } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
import { especialidadBySlug } from "@/data/taxonomy";
import type { Treatment } from "@/data/types";
import { publicText } from "@/lib/public-copy";
import { clinicalVisible } from "@/lib/review";
import Link from "next/link";
import { DoctorPlaceholder } from "./photo-placeholders";
import { ResultadosReales } from "./resultados";
import { SimulationPanel } from "./simulation-panel";
import { ValuationWizard } from "./valuation-wizard";

function patientCopy(value: string | undefined) {
  return publicText(value)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part && !/enlace |hair-loss|hair loss|nombre visible|menú viejo|menú antiguo/i.test(part))
    .join(" ");
}

function Mark({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function LandingView({
  landing,
  treatment,
  preview,
}: {
  landing: Landing;
  treatment?: Treatment;
  preview: boolean;
}) {
  const queEs = patientCopy(treatment?.queEs);
  const paraQuien = patientCopy(treatment?.paraQuien);
  const duracion = patientCopy(treatment?.duracion);
  const summary = patientCopy(treatment?.summary);
  const intro = landing.heroIntro || queEs || summary;
  const beneficios = (treatment?.beneficios ?? []).map((item) => patientCopy(item)).filter(Boolean);
  const faqs = (treatment?.faqs ?? [])
    .map((faq) => ({ q: patientCopy(faq.q), a: patientCopy(faq.a) }))
    .filter((faq) => faq.q && faq.a);
  const guide = treatment ? getGuide(treatment.slug) : undefined;
  const showGuide = Boolean(guide && clinicalVisible(guide.medicalReview));
  const riesgos = showGuide
    ? patientCopy(
        guide!.blocks
          .filter((block) => block.id === "efectos")
          .flatMap((block) => [block.card, ...block.paragraphs])
          .filter(Boolean)
          .join(" "),
      )
    : "";
  const related = new Set(treatment ? [treatment.slug, ...treatment.related] : []);
  const promos = offers.filter((offer) => {
    if (!isPublishedOffer(offer) || offerIsExpired(offer)) return false;
    if (landing.promoFilter === "all") return true;
    return related.has(offer.treatmentSlug);
  });
  const especialidad = treatment ? especialidadBySlug(treatment.especialidad) : undefined;
  const sedes = resolveSedes();
  const crumbs = treatment
    ? [
        { name: "Tratamientos", href: "/tratamientos" },
        { name: landing.simulation ? "Caída del cabello" : landing.heroTitle, href: `/lp/${landing.slug}` },
      ]
    : [
        { name: "Promociones", href: "/promociones" },
        { name: landing.heroTitle, href: `/lp/${landing.slug}` },
      ];
  const cards = [
    queEs
      ? { href: "#que-es", title: "¿En qué consiste?", text: "Qué es y cómo funciona.", path: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v4l3 2" }
      : null,
    beneficios.length
      ? { href: "#beneficios", title: "Beneficios", text: "Resultados y ventajas.", path: "M12 4.5 14 9h4.5L15.2 12l1.3 4.5L12 14.2 7.5 16.5 8.8 12 5.5 9H10L12 4.5Z" }
      : null,
    riesgos
      ? { href: "#riesgos", title: "Riesgos y contraindicaciones", text: "Cuidados y recomendaciones.", path: "M12 4 5 7v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V7l-7-3Z" }
      : null,
    faqs.length
      ? { href: "#preguntas", title: "Preguntas frecuentes", text: "Resuelve tus dudas principales.", path: "M12 5a7 7 0 0 0-6.2 10.2L5 19l3.8-.8A7 7 0 1 0 12 5Z" }
      : null,
  ].filter((item): item is { href: string; title: string; text: string; path: string } => Boolean(item));
  const portrait = treatment?.image;

  return (
    <main className="ficha lp-ficha">
      <section className="ficha-hero" data-tone="cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ficha-hero-petal" src="/stock/petalo-b.webp" alt="" />
        <div className="ficha-hero-grid">
          <div className="ficha-hero-copy">
            <Breadcrumbs items={crumbs} />
            <p className="ficha-kicker">{landing.heroKicker || especialidad?.name || "Valoración"}</p>
            <h1 className="display">{landing.heroTitle}</h1>
            {intro ? <p className="ficha-summary">{intro}</p> : null}
            <div className="ficha-hero-actions">
              <a className="btn-coral" href="#valoracion">
                {landing.simulation ? "Agendar mi valoración capilar" : "Iniciar valoración"}
              </a>
            </div>
          </div>
          <div className="ficha-hero-visual">
            <div className="ficha-portrait">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portrait} alt={treatment?.name ?? ""} width={960} height={640} />
              ) : (
                <>
                  {/* provisional: stock */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/stock/experiencia.webp" alt="" width={960} height={640} />
                  <span className="lp-badge lp-portrait-badge">Foto provisional</span>
                </>
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ficha-portrait-petal" src="/stock/petalo-a.webp" alt="" />
            {preview && landing.showDoctor ? <DoctorPlaceholder /> : null}
          </div>
        </div>
      </section>

      {preview && landing.showResults ? (
        <ResultadosReales withMirror={landing.simulation} />
      ) : landing.simulation ? (
        <div className="lp-split hair-mirror-standalone"><SimulationPanel /></div>
      ) : null}

      {treatment && cards.length ? (
        <section className="lp-split" aria-labelledby="conoce">
          <div className="lp-split-copy">
            <h2 id="conoce" className="display">
              Conoce el tratamiento
            </h2>
            <p>Todo lo que está publicado antes de tu valoración.</p>
          </div>
          <ul className="lp-know">
            {cards.map((card) => (
              <li key={card.href}>
                <a className="lp-know-card glass-card" data-reveal data-pointer href={card.href}>
                  <Mark path={card.path} />
                  <span>
                    <strong>{card.title}</strong>
                    {card.text}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {treatment && (queEs || beneficios.length || paraQuien || riesgos || faqs.length) ? (
        <div className="lp-detail">
          {queEs ? (
            <section id="que-es" className="ficha-block ficha-que">
              <div>
                <h2 className="display">Qué es</h2>
                <p>{queEs}</p>
              </div>
            </section>
          ) : null}
          {beneficios.length ? (
            <section id="beneficios" className="ficha-block ficha-card">
              <h2 className="display">Beneficios</h2>
              <ul className="lp-benefits">
                {beneficios.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {paraQuien ? (
            <section className="ficha-block ficha-card-soft">
              <h2 className="display">Para quién</h2>
              <p>{paraQuien}</p>
              {duracion ? <p>{duracion}</p> : null}
            </section>
          ) : null}
          {riesgos ? (
            <section id="riesgos" className="ficha-block ficha-card">
              {guide?.medicalReview === "pendiente" ? <p className="ficha-review-note">Contenido en revisión médica</p> : null}
              <h2 className="display">Riesgos y contraindicaciones</h2>
              <p>{riesgos}</p>
              <Link href={`/tratamientos/${treatment.slug}/guia`}>Leer la guía de {treatment.name}</Link>
            </section>
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
          <p className="lp-ficha-link">
            <Link href={`/tratamientos/${treatment.slug}`}>Ver la ficha de {treatment.name}</Link>
          </p>
        </div>
      ) : null}

      {promos.length ? (
        <section className="lp-split is-promos" aria-labelledby="promos">
          <div className="lp-split-copy">
            <h2 id="promos" className="display">
              Promociones vigentes
            </h2>
            <p>Precios publicados de la red. La vigencia se confirma en la valoración.</p>
          </div>
          <ul className="lp-promos">
            {promos.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="lp-next" data-reveal data-pointer>
        <div>
          <Mark path="M7 4v2M17 4v2M5 8h14v11H5V8Zm0 4h14" />
          <h2 className="display">{landing.simulation ? "Empieza por entender qué pasa con tu cabello" : "¿Lista para dar el siguiente paso?"}</h2>
          <p>Agenda tu valoración personalizada en la sede de tu preferencia.</p>
        </div>
        <a className="btn-coral" href="#valoracion">
          Agenda tu valoración
        </a>
      </section>

      <ValuationWizard
        preview={preview}
        needId={landing.needId}
        path={`/lp/${landing.slug}`}
        questions={landing.questions}
        extras={extraNeedsFor(landing.needId)}
        sedes={sedes.map((sede) => ({ slug: sede.slug, name: sede.name }))}
        origin={treatment ? { id: treatment.slug, name: treatment.name } : null}
      />

      <div className="ficha-mobile-bar">
        <a className="btn-coral" href="#valoracion">
          Iniciar valoración
        </a>
      </div>
    </main>
  );
}
