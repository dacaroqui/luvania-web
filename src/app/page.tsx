import { BodyMap } from "@/components/body-map";
import { Encuentra } from "@/components/encuentra";
import { FlorLuvania } from "@/components/flor-luvania";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { OfferCard, isPublishedOffer } from "@/components/offer-card";
import { BookButton } from "@/components/book-button";
import { Valoracion } from "@/components/valoracion";
import { benefitLines } from "@/data/hero";
import { allGuides, readingMinutes } from "@/data/guides";
import { getTreatment } from "@/data";
import { clinicalVisible } from "@/lib/review";
import { offers } from "@/data/offers";
import { site } from "@/data/site";
import { clampMeta, pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    clampMeta("Tratamientos estéticos personalizados en cinco sedes de Bogotá. Agenda tu valoración en Luvania."),
  path: "/",
});

/** Fotos provisionales de stock. Sustituir con sesión propia. public/stock/CREDITOS.md */
const shots = [
  { href: "/especialidades/estetica-facial", name: "Estética facial", image: "/stock/faciales.webp" },
  { href: "/especialidades/estetica-corporal", name: "Estética corporal", image: "/stock/corporales.webp" },
  { href: "/especialidades/obesidad-y-sobrepeso", name: "Contorno y grasa localizada", image: "/stock/depilacion.webp" },
  { href: "/especialidades/medicina-estetica", name: "Medicina estética", image: "/stock/wellness.webp" },
];

export default function HomePage() {
  const featured = offers.filter(isPublishedOffer).slice(0, 3);
  const guides = allGuides().filter((guide) => clinicalVisible(guide.medicalReview)).slice(0, 3);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.legalName,
          url: site.url,
          email: site.email,
          telephone: site.mobileTel,
          brand: site.brandOf,
          areaServed: "Bogotá",
        }}
      />
      <Hero />

      <section data-tone="cream" className="relative z-[1] bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="shot-head">
            <h2 className="display text-4xl sm:text-6xl">Tratamientos diseñados para ti</h2>
            <div>
              <p className="text-mute">
                Soluciones faciales y corporales que se adaptan a tus necesidades, con un enfoque natural y armónico.
              </p>
              <Link href="/tratamientos" className="shot-more">
                Explorar tratamientos
                <Arrow />
              </Link>
            </div>
          </div>
          <ul className="shot-grid">
            {shots.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href} className="shot-card" data-reveal data-reveal-delay={index * 75}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" />
                  <span className="shot-label">
                    {item.name}
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-tone="cream" className="experience-band relative z-[1]">
        <div className="experience-layout mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="experience-arch">
            {/* provisional: stock. Sustituir con sesión propia. public/stock/CREDITOS.md */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stock/experiencia.webp" alt="" />
          </div>
          <div className="experience-copy">
            <h2 className="display text-5xl sm:text-6xl">
              Vive la experiencia
              <br />
              Luvania
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-mute">
              Espacios modernos, profesionales expertos y una atención que te hace sentir en confianza.
            </p>
            <Link href="/sedes" className="btn-line mt-8 w-fit">
              Conoce nuestras sedes
              <Arrow />
            </Link>
          </div>
        </div>
        {/* provisional: ilustración. Sustituir con sesión propia. public/stock/CREDITOS.md */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="petal petal-experience" src="/stock/petalo-a.webp" alt="" />
      </section>

      <Encuentra />

      <section data-tone="cream" className="body-section relative z-[1] overflow-hidden">
        <FlorLuvania className="body-flor body-flor-a" />
        <FlorLuvania className="body-flor body-flor-b" />
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <BodyMap />
        </div>
      </section>

      <section data-tone="peach" className="expect-section relative z-[1]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Lo que sí puedes esperar</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl">Cuidado que empieza por escucharte</h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-mute">{benefitLines[4]}</p>
          </div>
          <ul className="expect-grid">
            {[
              ["Tecnología", "Conoce qué se usa, cómo se aplica y qué implica para ti.", "M3 8h10M4 5l-1 3 1 3m8-6 1 3-1 3"],
              ["Acompañamiento", "Resuelve tus dudas sobre el tratamiento y sus cuidados.", "M3 7a5 5 0 1 1 4 5l-3 1 1-2"],
              ["Plan a tu medida", "Explora opciones según tu piel, tu cuerpo y tus objetivos.", "M8 2v12M2 8h12M4 4l8 8m0-8-8 8"],
              ["Claridad para decidir", "Habla del costo y los tiempos antes de elegir un plan.", "m3 8 3 3 7-7"],
            ].map(([title, copy, path]) => (
              <li key={title} className="expect-card" data-reveal data-pointer>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 pb-12 text-sm">
          <Link href="/lp/caida-del-cabello" className="hair-entry" data-pointer>
            <span><strong>Me preocupa la caída del cabello</strong><span>Explora la valoración capilar y prueba el filtro con tu foto.</span></span>
            <Arrow />
          </Link>
          <Link href="/recorridos/abdomen" className="hero-secondary">
            Quiero mejorar mi abdomen
          </Link>
        </div>
      </section>

      <Valoracion />

      {guides.length ? (
        <section data-tone="cream" className="relative z-[1] bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display text-4xl">Guías</h2>
              <Link href="/blog" className="hero-secondary">
                Ver todas
              </Link>
            </div>
            <ul className="guide-index">
              {guides.map((guide) => {
                const treatment = getTreatment(guide.slug);
                return (
                <li key={guide.slug}>
                  <Link href={`/tratamientos/${guide.slug}/guia`} className="guide-card glass" data-reveal data-pointer>
                    {treatment?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={treatment.image} alt="" />
                    ) : null}
                    <span>
                      <span className="ficha-guide-kicker">{readingMinutes(guide)} min</span>
                      <span className="display">{guide.h1}</span>
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section data-tone="cream" className="relative z-[1] bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-4xl">Promociones publicadas</h2>
            <Link href="/promociones" className="hero-secondary">
              Ver todas
            </Link>
          </div>
          <ul className="shop-grid shop-grid-home mt-6">
            {featured.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </ul>
        </div>
      </section>

      <section data-tone="cream" className="relative z-[1] overflow-hidden bg-[#efecdb]">
        <FlorLuvania className="flor-glow flor-glow-left" />
        <div className="relative z-[1] mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="display text-5xl sm:text-6xl">{benefitLines[3]}</h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-mute">{benefitLines[2]}</p>
          <div className="mt-8">
            <BookButton />
          </div>
        </div>
      </section>
    </main>
  );
}

function Arrow() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
