import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { forNeed, needPages } from "@/lib/hubs";
import { pageMeta } from "@/lib/seo";
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
  return pageMeta({
    title: `${need.name} en Bogotá | Luvania`,
    description: need.text,
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
      <p className="mt-4 max-w-xl text-lg text-mute">{need.text}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <li key={item.slug}>
            <Link href={`/tratamientos/${item.slug}`} className="tilt-card block h-full rounded-3xl bg-white p-5">
              <h2 className="display text-3xl">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-mute">{item.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <BookButton />
      </div>
    </main>
  );
}
