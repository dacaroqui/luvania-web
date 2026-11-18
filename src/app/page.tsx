import { BodyMap } from "@/components/body-map";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Valoracion } from "@/components/valoracion";
import { Wave } from "@/components/wave";
import { verifiedCatalog } from "@/data/catalog";
import { discountPercent, offers } from "@/data/offers";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { cop } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    "Tratamientos faciales y corporales en cinco sedes de Bogotá. Agenda tu valoración en Luvania.",
  path: "/",
});

export default function HomePage() {
  const names = verifiedCatalog().map((item) => item.name);
  const loop = [...names, ...names];
  const featured = offers.filter((offer) => !offer.priceBeforeSuspicious).slice(0, 3);
  const sedes = resolveSedes();

  return (
    <main className="wash-shift">
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
      <Wave />

      <div className="marquee border-y border-line py-4" aria-hidden="true">
        <div className="marquee-track text-sm font-semibold tracking-[0.14em] uppercase">
          {loop.map((name, index) => (
            <span key={`${name}-${index}`}>{name}</span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="display text-5xl">Elige por el cuerpo</h2>
        <p className="mt-3 max-w-xl text-mute">La silueta y la lista llevan al mismo lugar.</p>
        <div className="mt-8">
          <BodyMap />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 md:grid-cols-2">
        <Link href="/recorridos/caida-del-cabello" className="tilt-card rounded-[2rem] bg-ink p-8 text-cream">
          <h2 className="display text-4xl">Me preocupa la caída del cabello</h2>
          <p className="mt-3 text-peach">Un recorrido corto que termina en la valoración.</p>
        </Link>
        <Link href="/recorridos/abdomen" className="tilt-card rounded-[2rem] bg-white p-8">
          <h2 className="display text-4xl">Quiero mejorar mi abdomen</h2>
          <p className="mt-3 text-mute">Contorno, no una promesa de kilos.</p>
        </Link>
      </section>

      <Valoracion />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl">Promociones publicadas</h2>
          <Link href="/promociones" className="text-sm font-bold underline decoration-coral underline-offset-4">
            Ver todas
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((offer) => {
            const percent = discountPercent(offer);
            return (
              <li key={offer.slug} className="rounded-3xl bg-white p-5">
                {percent ? <p className="display text-4xl text-coral">-{percent}%</p> : null}
                <h3 className="mt-2 font-bold">{offer.name}</h3>
                <p className="mt-2 text-sm">
                  <span className="line-through">{cop(offer.priceBefore)}</span> {cop(offer.priceNow)}
                </p>
                <p className="mt-2 text-xs text-mute">Sujeto a valoración y vigencia.</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
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
      </section>
    </main>
  );
}
