import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentCard } from "@/components/treatment-card";
import { forNeed, needPages } from "@/lib/hubs";
import { clampMeta, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return needPages.map((need) => ({ slug: need.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const need = needPages.find((item) => item.slug === slug);
  if (!need) return {};
  const titles: Record<string, string> = {
    acne: "Acné: cómo se valora | Luvania",
    ojeras: "Ojeras y mirada cansada | Luvania",
    celulitis: "Celulitis en piernas y glúteos | Luvania",
    "caida-cabello": "Caída del cabello y pérdida de densidad en Bogotá | Luvania",
    manchas: "Manchas: por dónde empezar | Luvania",
  };
  return pageMeta({
    title: titles[need.slug] ?? `${need.name} en Bogotá | Luvania`,
    description: need.slug === "caida-cabello"
      ? "¿Notas más entradas o menos densidad? Conoce la ficha de caída del cabello y cómo agendar una valoración capilar en Luvania, Bogotá."
      : clampMeta(`${need.name} en Luvania. ${need.text}`),
    path: `/necesidades/${need.slug}`,
  });
}

export default async function NecesidadPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const need = needPages.find((item) => item.slug === slug);
  if (!need) notFound();
  const list = forNeed(need.slug);
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: need.name, href: `/necesidades/${need.slug}` },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">{need.name}</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">{need.slug === "caida-cabello"
        ? "Si notas más entradas o menos densidad, puedes solicitar una valoración capilar en Luvania, Bogotá. Consulta la ficha del tratamiento para saber qué aborda la valoración y qué preguntas puedes llevar a la cita."
        : need.text}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <li key={item.slug}>
            <TreatmentCard slug={item.slug} name={item.name} summary={item.summary} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <BookButton necesidad={need.slug} />
        {need.slug === "caida-cabello" ? <Link className="btn-line ml-3" href="/sedes">Consultar sedes en Bogotá</Link> : null}
      </div>
    </main>
  );
}
