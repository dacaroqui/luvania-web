import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { testimonials } from "@/data/testimonials";
import { isInternal } from "@/lib/public-copy";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Experiencias de pacientes | Luvania",
  description: "Comentarios de pacientes sobre su visita a Luvania.",
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
      <p className="mt-4 leading-7 text-peach">Comentarios de pacientes sobre su visita.</p>
      <ul className="mt-8 grid gap-4">
        {testimonials.map((item) => (
          <li key={item.name} className="rounded-3xl bg-cream p-6 text-ink">
            <p className="text-xl leading-8">“{item.quote}”</p>
            <p className="mt-4 font-bold">{item.name}</p>
            {item.treatment && !isInternal(item.treatment) ? <p className="text-sm text-mute">{item.treatment}</p> : null}
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
