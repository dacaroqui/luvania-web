import { BookButton } from "@/components/book-button";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { Wave } from "@/components/wave";
import { treatments } from "@/data";
import { offers, discountPercent } from "@/data/offers";
import { sedes } from "@/data/sedes";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { especialidades, zones } from "@/data/taxonomy";
import { cop } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Clínica estética en Bogotá | Luvania",
  description:
    "Tratamientos faciales y corporales en cinco sedes de Bogotá. Valoración sin costo, protocolos con registro fotográfico y financiación sin intereses.",
  path: "/",
});

export default function HomePage() {
  const featured = offers.slice(0, 4);
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
      <Wave />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="display text-4xl sm:text-5xl">Entra por donde te quede más fácil</h2>
          <p className="mt-3 max-w-2xl text-mute">
            El menú anterior obligaba a adivinar la especialidad. Aquí el mismo catálogo se abre por zona, por
            necesidad o por nombre.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {zones.slice(0, 5).map((zone) => (
            <li key={zone.id}>
              <Link
                href={`/tratamientos?zona=${zone.id}`}
                className="block rounded-3xl bg-white p-5 transition hover:-translate-y-1"
              >
                <span className="display text-3xl">{zone.name}</span>
                <span className="mt-2 block text-sm text-mute">{zone.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="display text-4xl">Especialidades</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {especialidades.map((item) => {
            const count = treatments.filter((treatment) => treatment.especialidad === item.slug).length;
            return (
              <li key={item.slug}>
                <Link href={`/especialidades/${item.slug}`} className="block h-full rounded-3xl bg-ink p-6 text-cream">
                  <p className="text-xs tracking-[0.16em] text-salmon uppercase">{count} tratamientos</p>
                  <h3 className="display mt-3 text-3xl">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-peach">{item.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl">Ofertas con el descuento real</h2>
          <Link href="/promociones" className="text-sm font-bold underline decoration-coral underline-offset-4">
            Ver las 18
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-4">
          {featured.map((offer) => {
            const percent = discountPercent(offer);
            return (
              <li key={offer.slug} className="rounded-3xl bg-white p-5">
                {percent ? <p className="display text-4xl text-coral">-{percent}%</p> : <p className="text-sm font-bold">Precio por confirmar</p>}
                <h3 className="mt-2 font-bold">{offer.name}</h3>
                <p className="mt-2 text-sm text-mute">
                  <span className="line-through">{cop(offer.priceBefore)}</span> {cop(offer.priceNow)}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-mute">Precios del 17 de noviembre de 2026. La vigencia está por confirmar.</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
        {[
          ["Financiación sin intereses", "Así lo comunica la red. Plazos, aliado y letra menuda: TODO, se confirman en la valoración."],
          ["Protocolo y fotos", "Cada plan se protocoliza y se acompaña de registro fotográfico para ver el cambio, no para discutirlo de memoria."],
          ["Habilitación", "TODO: publicar el número de habilitación de cada sede. En el sitio anterior solo había un sello genérico."],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-3xl bg-peach/50 p-6">
            <h2 className="display text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-6">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="display text-4xl">Cinco sedes. Cedritos ya no está.</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-5">
          {sedes.map((sede) => (
            <li key={sede.slug}>
              <Link href={`/sedes/${sede.slug}`} className="block h-full rounded-3xl bg-white p-4">
                <h3 className="display text-2xl">{sede.name}</h3>
                <p className="mt-2 text-sm text-mute">{sede.address}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-[2rem] bg-white p-6 sm:p-10">
          <p className="text-xs font-bold tracking-[0.16em] text-coral uppercase">Placeholder</p>
          <h2 className="display mt-2 text-4xl">Equipo médico</h2>
          <p className="mt-3 max-w-2xl text-mute">
            Los nombres, las tarjetas profesionales y las fotos se publican cuando la clínica los entregue. No
            inventamos un staff.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="display text-4xl">Lo que decían en el sitio anterior</h2>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          Testimonios heredados, sin sede ni tratamiento verificados. No son reseñas nuevas ni tienen estrellas.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name} className="rounded-3xl border border-dashed border-salmon bg-paper p-5">
              <p className="text-lg leading-7">“{item.quote}”</p>
              <p className="mt-4 text-sm font-bold">{item.name}</p>
              <p className="text-xs text-mute">{item.treatment}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="display text-5xl">La primera cita no se cobra.</h2>
        <p className="mx-auto mt-3 max-w-lg text-mute">
          Cuéntanos tu nombre, tu teléfono y la sede. El tratamiento puede esperar a la valoración.
        </p>
        <BookButton className="mt-6 min-h-12 rounded-full bg-coral px-6 text-sm font-bold">
          Agenda tu valoración sin costo
        </BookButton>
      </section>
    </main>
  );
}
