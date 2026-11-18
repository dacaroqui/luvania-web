import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { testimonials } from "@/data/testimonials";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Experiencias de pacientes | Luvania",
  description: "Comentarios publicados en el sitio anterior de Luvania, marcados como pendientes de verificación.",
  path: "/experiencias",
});

export default function ExperienciasPage() {
  const crumbs = [{ name: "Experiencias", href: "/experiencias" }];
  return (
    <main data-tone="dark" className="band-dark relative z-[1]">
      <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl">Experiencias</h1>
      <p className="mt-4 leading-7 text-peach">
        El sitio anterior repetía tres frases en casi todas las páginas y tenía un listado en /experiencias sin
        sede ni tratamiento fiables. Las dejamos visibles, con la etiqueta de placeholder, y sin estrellas ni
        agregado de reseñas en el código de la página.
      </p>
      <ul className="mt-8 grid gap-4">
        {testimonials.map((item) => (
          <li key={item.name} className="rounded-3xl border border-dashed border-salmon bg-cream p-6 text-ink">
            <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">Placeholder</p>
            <p className="mt-3 text-xl leading-8">“{item.quote}”</p>
            <p className="mt-4 font-bold">{item.name}</p>
            <p className="text-sm text-mute">{item.treatment}</p>
            <p className="text-sm text-mute">{item.sede}</p>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
