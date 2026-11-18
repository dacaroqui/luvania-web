import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { treatments } from "@/data";
import { especialidadBySlug, especialidades } from "@/data/taxonomy";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return especialidades.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = especialidadBySlug(slug);
  if (!item) return {};
  return pageMeta({
    title: `${item.name} en Bogotá | Luvania`,
    description: item.description,
    path: `/especialidades/${item.slug}`,
  });
}

export default async function EspecialidadPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = especialidadBySlug(slug);
  if (!item) notFound();
  const list = treatments.filter((treatment) => treatment.especialidad === item.slug && treatment.status === "VERIFIED");
  const crumbs = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: item.name, href: `/especialidades/${item.slug}` },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">{item.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">{item.description}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((treatment) => (
          <li key={treatment.slug}>
            <Link href={`/tratamientos/${treatment.slug}`} className="block h-full rounded-3xl bg-white p-5">
              <h2 className="display text-3xl">{treatment.name}</h2>
              <p className="mt-2 text-sm leading-6 text-mute">{treatment.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
