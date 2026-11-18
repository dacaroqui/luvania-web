import { BodyMap } from "@/components/body-map";
import { Encuentra } from "@/components/encuentra";
import { FlorLuvania } from "@/components/flor-luvania";
import { FlorRule } from "@/components/flor-rule";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { OfferCard, isPublishedOffer } from "@/components/offer-card";
import { Valoracion } from "@/components/valoracion";
import { offers } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    "Tratamientos faciales y corporales en cinco sedes de Bogotá. Agenda tu valoración en Luvania.",
  path: "/",
});

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
      <FlorRule />

      <section data-tone="cream" className="body-section relative z-[1]">
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="display text-5xl">Elige por el cuerpo</h2>
          <p className="mt-3 max-w-xl text-mute">Toca una zona del cuerpo y mira los tratamientos.</p>
          <div className="mt-8">
            <BodyMap />
          </div>
        </div>
      </section>

      <Valoracion />

      <section data-tone="cream" className="band-cream relative z-[1]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2">
          <Link href="/recorridos/caida-del-cabello" className="tilt-card rounded-[2rem] bg-ink p-8 text-cream">
            <h2 className="display text-4xl">Me preocupa la caída del cabello</h2>
            <p className="mt-3 text-peach">Un recorrido corto que termina en la valoración.</p>
          </Link>
          <Link href="/recorridos/abdomen" className="tilt-card rounded-[2rem] bg-white p-8">
            <h2 className="display text-4xl">Quiero mejorar mi abdomen</h2>
            <p className="mt-3 text-mute">Contorno, no una promesa de kilos.</p>
          </Link>
        </div>
      </section>

      <section data-tone="ink" className="band-ink relative z-[1] overflow-hidden">
        <FlorLuvania className="flor-glow flor-glow-left" />
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-4xl">Promociones publicadas</h2>
            <Link href="/promociones" className="text-sm font-bold text-salmon underline decoration-coral underline-offset-4">
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

      <section data-tone="peach" className="band-peach relative z-[1]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="display text-4xl">Cinco sedes en Bogotá</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sedes.map((sede) => (
              <li key={sede.slug}>
                <Link href={`/sedes/${sede.slug}`} className="tilt-card block h-full rounded-3xl bg-white p-4">
                  <h3 className="display text-2xl">{sede.name}</h3>
                  <p className="mt-2 text-sm text-mute">{sede.address}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
