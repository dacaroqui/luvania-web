import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { BookButton } from "@/components/book-button";
import { TreatmentCard } from "@/components/treatment-card";
import { forZone, zonePages } from "@/lib/hubs";
import { clampMeta, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return zonePages.map((zone) => ({ slug: zone.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const zone = zonePages.find((item) => item.slug === slug);
  if (!zone) return {};
  return pageMeta({
    title: zone.slug === "intima" ? "Zona íntima en Bogotá | Luvania" : `Zona ${zone.name} en Bogotá | Luvania`,
    description: clampMeta(`Tratamientos de ${zone.name} en Luvania. ${zone.text}`),
    path: `/zonas/${zone.slug}`,
  });
}

export default async function ZonaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const zone = zonePages.find((item) => item.slug === slug);
  if (!zone) notFound();
  const list = forZone(zone.slug);
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: zone.name, href: `/zonas/${zone.slug}` },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">{zone.name}</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">{zone.text}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <li key={item.slug}>
            <TreatmentCard slug={item.slug} name={item.name} summary={item.summary} />
          </li>
        ))}
      </ul>
      {list.length === 0 ? <p className="mt-6 text-mute">Aún no hay un protocolo publicado para esta zona.</p> : null}
      <div className="mt-10">
        <BookButton />
      </div>
    </main>
  );
}
