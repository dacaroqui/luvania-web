import { allGuides, readingMinutes } from "@/data/guides";
import { getTreatment } from "@/data";
import { clinicalVisible } from "@/lib/review";
import { clampMeta, pageMeta } from "@/lib/seo";
import Link from "next/link";

const guides = allGuides().filter((guide) => clinicalVisible(guide.medicalReview));
const pending = guides.some((guide) => guide.medicalReview === "pendiente");

export const metadata = pageMeta({
  title: "Guías de tratamientos | Luvania",
  description: clampMeta("Artículos de los tratamientos de Luvania en Bogotá. La valoración sigue siendo presencial."),
  path: "/blog",
  index: !pending && guides.length > 0,
});

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-bold tracking-[0.22em] text-clay uppercase">Guías</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Para leer con calma</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        Artículos largos a partir de las fichas anteriores, reescritos sin promesas de resultado.
      </p>
      {pending ? <p className="ficha-review-note mt-4">Contenido en revisión médica</p> : null}
      {guides.length === 0 ? (
        <p className="mt-8">Todavía no hay guías publicadas.</p>
      ) : (
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
      )}
    </main>
  );
}
