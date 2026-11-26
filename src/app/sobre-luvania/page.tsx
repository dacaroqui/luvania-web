import { BookButton } from "@/components/book-button";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { especialidades } from "@/data/taxonomy";
import { clampMeta, pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Sobre Luvania | Clínica estética en Bogotá",
  description: clampMeta("Conoce Luvania Innovación Estética: siete años de experiencia, valoración personalizada y cinco sedes en Bogotá."),
  path: "/sobre-luvania",
});

export default function SobreLuvaniaPage() {
  const sedes = resolveSedes();

  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Sobre Luvania</p>
            <h1 className="display mt-3 text-5xl sm:text-6xl">Un equipo que te acompaña a decidir</h1>
            <p className="mt-5 max-w-xl text-lg leading-8">
              Somos {site.legalName}, una marca de {site.brandOf}. Llevamos siete años brindando atención estética en Bogotá, con un equipo de profesionales que empieza por escucharte.
            </p>
            <p className="mt-3 max-w-xl leading-7 text-mute">
              En tu valoración hablamos de lo que quieres mejorar, revisamos las opciones para tu caso y te explicamos qué esperar, incluidos los cuidados y los tiempos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <BookButton />
              <Link href="#nuestras-sedes" className="btn-line">Encuentra tu sede</Link>
            </div>
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guias/consulta-hilos-tensores.webp" alt="Consulta orientativa con una profesional y su paciente" className="aspect-[4/3] w-full rounded-3xl object-cover" />
            <figcaption className="mt-2 text-xs text-mute">Imagen ilustrativa de una valoración estética.</figcaption>
          </figure>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["7 años de experiencia", "En atención estética facial y corporal."],
            [`${sedes.length} sedes en Bogotá`, "Elige el punto de atención que te quede más cerca."],
            ["Valoración personalizada", "Resuelve dudas y conoce los pasos antes de elegir un tratamiento."],
          ].map(([title, text]) => (
            <div key={title} className="sede-tile rounded-2xl px-5 py-5">
              <h2 className="display text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-mute">{text}</p>
            </div>
          ))}
        </div>

        <h2 id="nuestras-sedes" className="display mt-14 scroll-mt-28 text-4xl">Nuestras sedes</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sedes.map((sede) => (
            <li key={sede.slug}>
              <Link href={`/sedes/${sede.slug}`} className="block rounded-2xl bg-[#f7f4ea] px-5 py-4">
                <span className="font-bold">{sede.name}</span>
                <span className="mt-1 block text-sm text-mute">{sede.address}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="display mt-14 text-4xl">Especialidades</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {especialidades.map((item) => (
            <li key={item.slug}>
              <Link href={`/especialidades/${item.slug}`} className="font-bold">
                {item.name}
              </Link>
              <p className="mt-1 text-sm leading-6 text-mute">{item.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12">
          <Link href="/sedes" className="btn-line w-fit">
            Conoce nuestras sedes
          </Link>
        </p>
      </article>
    </main>
  );
}
