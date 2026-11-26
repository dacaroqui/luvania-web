import { allGuides, readingMinutes } from "@/data/guides";
import { getTreatment } from "@/data";
import { verifiedCatalog } from "@/data/catalog";
import { publicText } from "@/lib/public-copy";
import { clinicalVisible } from "@/lib/review";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

const guides = allGuides().filter((guide) => clinicalVisible(guide.medicalReview));
const pending = guides.some((guide) => guide.medicalReview === "pendiente");
const prioritySlugs = [
  "hair-loss", "perfilamiento-maxilar-hombres", "toxina-botulinica-tipo-a", "eliminar-ojeras",
  "acne", "aumento-y-o-perfilamiento-de-labios", "celulitis", "levantamiento-de-gluteos",
];
const catalog = verifiedCatalog();
const topics = prioritySlugs.flatMap((slug) => catalog.filter((item) => item.slug === slug));

export const metadata = pageMeta({
  title: "Guías de tratamientos | Luvania",
  description: "Consulta tratamientos y guías de Luvania en Bogotá sobre caída del cabello, perfilamiento mandibular, toxina botulínica, ojeras y más.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-bold tracking-[0.22em] text-clay uppercase">Guías</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Guías y tratamientos de Luvania</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        Explora qué aborda cada tratamiento y qué puedes preguntar en tu valoración en Bogotá.
      </p>
      <section aria-labelledby="temas-de-valoracion" className="mt-8">
        <h2 id="temas-de-valoracion" className="display text-3xl">Temas de valoración</h2>
        <ul className="guide-index">
          {topics.map((item) => (
            <li key={item.slug}>
              <Link href={`/tratamientos/${item.slug}`} className="guide-card glass">
                <span>
                  <span className="display">{item.name}</span>
                  <span>{publicText(item.summary, item.name)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {guides.length ? (
        <section aria-labelledby="articulos" className="mt-10">
          <h2 id="articulos" className="display text-3xl">Artículos</h2>
          {pending ? <p className="ficha-review-note mt-4">Contenido en revisión médica</p> : null}
          <ul className="guide-index">
            {guides.map((guide) => {
              const treatment = getTreatment(guide.slug);
              return (
                <li key={guide.slug}>
                  <Link href={`/tratamientos/${guide.slug}/guia`} className="guide-card glass">
                    {treatment?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={treatment.image} alt="" />
                    ) : null}
                    <span>
                      <span className="ficha-guide-kicker">{readingMinutes(guide)} min</span>
                      <span className="display">{guide.h1}</span>
                      <span>{guide.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
