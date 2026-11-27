import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { clampMeta, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const journeys = {
  abdomen: {
    title: "Quiero mejorar mi abdomen",
    steps: [
      ["Empieza por la zona", "/zonas/abdomen", "Varios protocolos de contorno, no un plan de peso."],
      ["Una ficha concreta", "/tratamientos/hidrolipoclasia", "Hidrolipoclasia es de las publicadas para grasa localizada."],
      ["Agenda la valoración", "#agendar", "El equipo dice cuál protocolo cabe y en qué sede."],
    ],
  },
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return ["caida-del-cabello", ...Object.keys(journeys)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const journey = journeys[slug as keyof typeof journeys];
  if (!journey) return {};
  return pageMeta({
    title: `${journey.title} | Luvania`,
    description: clampMeta(`${journey.title}. Un recorrido entre fichas publicadas de Luvania en Bogotá.`),
    path: `/recorridos/${slug}`,
  });
}

export default async function RecorridoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (slug === "caida-del-cabello") redirect("/lp/caida-del-cabello");
  const journey = journeys[slug as keyof typeof journeys];
  if (!journey) notFound();
  const crumbs = [{ name: journey.title, href: `/recorridos/${slug}` }];
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl">{journey.title}</h1>
      <ol className="mt-8 grid gap-4">
        {journey.steps.map(([title, href, copy], index) => (
          <li key={title} className="rounded-3xl bg-white p-5">
            <p className="text-sm font-bold text-clay">Paso {index + 1}</p>
            <h2 className="mt-1 text-2xl font-bold">
              {href.startsWith("#") ? title : <Link href={href}>{title}</Link>}
            </h2>
            <p className="mt-2 text-mute">{copy}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <BookButton />
      </div>
    </main>
  );
}
