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
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    "Tratamientos estéticos personalizados en cinco sedes de Bogotá. Agenda tu valoración en Luvania.",
  path: "/",
});

const categories = [
  {
    href: "/especialidades/estetica-facial",
    name: "Faciales",
    text: "Luminosidad, textura y rasgos, sin dejar de ser tú.",
    image: "/brand/hero-lcp.webp",
  },
  {
    href: "/especialidades/estetica-corporal",
    name: "Corporales",
    text: "Firmeza y contorno, con valoración previa.",
  },
  {
    href: "/especialidades/nutricion-capilar",
    name: "Capilar",
    text: "Cuando la caída preocupa, el diagnóstico va primero.",
  },
  {
    href: "/especialidades/rejuvenecimiento-facial",
    name: "Rejuvenecimiento",
    text: "Descanso en el rostro, sin promesa de quirófano.",
  },
];

export default function HomePage() {
  const featured = offers.filter(isPublishedOffer).slice(0, 3);
  const sedes = resolveSedes();

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
      <Encuentra />

      <section data-tone="cream" className="relative z-[1] bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display text-5xl sm:text-6xl">Tratamientos diseñados para ti</h2>
              <p className="mt-3 max-w-xl text-mute">
                Cuatro caminos del catálogo publicado. El resto se encuentra por nombre, zona o necesidad.
              </p>
            </div>
            <Link href="/tratamientos" className="hero-secondary">
              Ver todo el catálogo
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="catalog-tile tilt-card">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" />
                  ) : (
                    <div className="treatment-frame">
                      <FlorLuvania />
                      <span>{item.name}</span>
                    </div>
                  )}
                  <span className="catalog-tile-name">
                    {item.name}
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-mute">
            También está{" "}
            <Link href="/especialidades/medicina-estetica" className="font-bold text-clay underline decoration-coral underline-offset-4">
              medicina estética
            </Link>
            .
          </p>
        </div>
      </section>

      <section data-tone="cream" className="body-section relative z-[1]">
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="display text-5xl">Elige por el cuerpo</h2>
          <p className="mt-3 max-w-xl text-mute">Toca una zona y mira los tratamientos publicados.</p>
          <div className="mt-8">
            <BodyMap />
          </div>
        </div>
      </section>

      <section data-tone="peach" className="relative z-[1] bg-[#f1ceb3]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="experience-panel">
            <div className="treatment-media">
              <div className="treatment-frame">
                <FlorLuvania />
                <span>Cinco sedes en Bogotá</span>
              </div>
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10">
              <h2 className="display text-5xl sm:text-6xl">Vive la experiencia Luvania</h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-mute">
                Una valoración tranquila, con el equipo de la sede que elijas.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {sedes.map((sede) => (
                  <li key={sede.slug}>
                    <Link href={`/sedes/${sede.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-cream px-4 text-sm font-bold">
                      {sede.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/sedes" className="hero-secondary mt-6 w-fit">
                Conoce nuestras sedes
              </Link>
            </div>
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
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
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
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
