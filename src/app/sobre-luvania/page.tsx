import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import { especialidades } from "@/data/taxonomy";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Sobre Luvania | Clínica estética en Bogotá",
  description: "Luvania Innovación Estética es una marca de CIFES, con cinco sedes en Bogotá.",
  path: "/sobre-luvania",
});

export default function SobreLuvaniaPage() {
  const sedes = resolveSedes();

  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">La marca</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Sobre Luvania</h1>
        <p className="mt-6 text-lg leading-8">
          {site.legalName} es una red de clínicas estéticas en Bogotá. Es una marca de {site.brandOf}.
        </p>
        <p className="mt-4 leading-7 text-mute">
          El primer paso es una valoración en la sede que elijas. Ahí se mira la zona y se acuerda si hay un plan.
        </p>

        <h2 className="display mt-14 text-4xl">Cinco sedes</h2>
        <ul className="mt-5 grid gap-3">
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
        <ul className="mt-5 grid gap-4">
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
