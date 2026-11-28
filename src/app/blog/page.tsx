import { allGuides, readingMinutes } from "@/data/guides";
import { getTreatment } from "@/data";
import { blogArticles } from "@/data/blog-articles";
import { TreatmentMedia } from "@/components/treatment-media";
import { verifiedCatalog } from "@/data/catalog";
import { publicText } from "@/lib/public-copy";
import { clinicalVisible } from "@/lib/review";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

const guides = allGuides().filter((guide) => clinicalVisible(guide.medicalReview));
const pending = guides.some((guide) => guide.medicalReview === "pendiente");
const prioritySlugs = [
  "hair-loss", "perfilamiento-maxilar-hombres", "toxina-botulinica-tipo-a", "eliminar-ojeras",
  "acne", "aumento-y-o-perfilamiento-de-labios", "celulitis", "levantamiento-de-gluteos",
  "dewlap-lipopapada-sin-cirugia", "hilos-tensores",
];
const catalog = verifiedCatalog();
const topics = prioritySlugs.flatMap((slug) => guides.some((guide) => guide.slug === slug)
  ? []
  : catalog.filter((item) => item.slug === slug));
const cardSizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";

export const metadata = pageMeta({
  title: "Guías de tratamientos | Luvania",
  description: "Guías de Luvania en Bogotá para preparar tu valoración estética, comparar precios por sede y conocer tratamientos faciales, corporales y capilares.",
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
      <section aria-labelledby="guias-practicas" className="mt-8">
        <h2 id="guias-practicas" className="display text-3xl">Guías prácticas</h2>
        <ul className="guide-index">
          {blogArticles.map((article) => (
            <li key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="guide-card glass">
                <Image src={article.image.src} alt="" width={article.image.width} height={article.image.height} sizes={cardSizes} />
                <span>
                  <span className="display">{article.title}</span>
                  <span>{article.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="temas-de-valoracion" className="mt-8">
        <h2 id="temas-de-valoracion" className="display text-3xl">Temas de valoración</h2>
        <ul className="guide-index">
          {topics.map((item) => (
            <li key={item.slug}>
              <Link href={`/tratamientos/${item.slug}`} className="guide-card glass">
                <TreatmentMedia name={item.name} image={getTreatment(item.slug)?.image} decorative />
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
                    {guide.cover ? (
                      <Image src={guide.cover.src} alt="" width={guide.cover.width} height={guide.cover.height}
                        sizes={cardSizes} />
                    ) : <TreatmentMedia name={guide.h1} image={treatment?.image} decorative /> }
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
