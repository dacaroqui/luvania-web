import { BodyMap } from "@/components/body-map";
import { Encuentra } from "@/components/encuentra";
import { FlorLuvania } from "@/components/flor-luvania";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { OfferCard, isPublishedOffer } from "@/components/offer-card";
import { BookButton } from "@/components/book-button";
import { Valoracion } from "@/components/valoracion";
import { benefitLines } from "@/data/hero";
import { offers } from "@/data/offers";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    "Tratamientos estéticos personalizados en cinco sedes de Bogotá. Agenda tu valoración en Luvania.",
  path: "/",
});

/** Fotos provisionales de stock. Sustituir con sesión propia. public/stock/CREDITOS.md */
const shots = [
  { href: "/especialidades/estetica-facial", name: "Faciales", image: "/stock/faciales.webp" },
  { href: "/especialidades/estetica-corporal", name: "Corporales", image: "/stock/corporales.webp" },
  { href: "/tratamientos/depilacion-laser", name: "Depilación láser", image: "/stock/depilacion.webp" },
  { href: "/especialidades/medicina-estetica", name: "Wellness", image: "/stock/wellness.webp" },
];

export default function HomePage() {
  const featured = offers.filter(isPublishedOffer).slice(0, 3);

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
            {shots.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="shot-card">
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

      <section data-tone="cream" className="body-section relative z-[1]">
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="display text-5xl">Elige por el cuerpo</h2>
          <p className="mt-3 max-w-xl text-mute">Toca una zona y mira los tratamientos publicados.</p>
          <div className="mt-8">
            <BodyMap />
          </div>
        </div>
      </section>

      <section data-tone="cream" className="relative z-[1] bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Lo que sí puedes esperar</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl">{benefitLines[0]}</h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-mute">{benefitLines[4]}</p>
          </div>
          <ul className="grid gap-3">
            {[
              ["Tecnología", "Protocolos de cabina y aparatología, explicados en la valoración."],
              ["Acompañamiento", "El equipo mira la zona antes de proponer un plan."],
              ["Personalización", benefitLines[1]],
              ["Valoración", "Tú decides. No hay compromiso de tratamiento."],
            ].map(([title, copy]) => (
              <li key={title} className="rounded-3xl bg-[#f7f4ea] px-5 py-4">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-mute">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 pb-12 text-sm">
          <Link href="/recorridos/caida-del-cabello" className="hero-secondary">
            Me preocupa la caída del cabello
          </Link>
          <Link href="/recorridos/abdomen" className="hero-secondary">
            Quiero mejorar mi abdomen
          </Link>
        </div>
      </section>

      <Valoracion />

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
