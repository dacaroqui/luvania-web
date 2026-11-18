import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { franchiseLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Franquicias Luvania en Colombia",
  description:
    "Información para franquiciarte con Luvania, marca de CIFES. La conversación sigue por WhatsApp con el equipo de expansión.",
  path: "/franquicias",
});

export default function FranquiciasPage() {
  const crumbs = [{ name: "Franquicias", href: "/franquicias" }];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-clay uppercase">Marca de {site.brandOf}</p>
      <h1 className="display mt-2 text-5xl sm:text-6xl">Franquicias</h1>
      <p className="mt-4 text-lg leading-8">
        Si quieres llevar la marca a otra ciudad, el equipo de expansión te cuenta el camino por WhatsApp.
      </p>
      <article className="mt-8 rounded-3xl bg-white p-5">
        <h2 className="display text-3xl">Qué es la red</h2>
        <p className="mt-2 leading-7">
          Luvania es la marca estética de CIFES en Bogotá, con cinco sedes y protocolos faciales, corporales y
          capilares.
        </p>
      </article>
      <a
        href={franchiseLink()}
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-coral px-5 text-sm font-bold"
      >
        Escribir al WhatsApp de franquicias
      </a>
    </main>
  );
}
