import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentBrowser } from "@/components/treatment-browser";
import { verifiedCatalog } from "@/data/catalog";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = pageMeta({
  title: "Tratamientos estéticos en Bogotá | Luvania",
  description:
    "Catálogo publicado de Luvania. Filtra por especialidad, zona o necesidad, o busca por nombre y alias.",
  path: "/tratamientos",
});

export default function TratamientosPage() {
  const crumbs = [{ name: "Tratamientos", href: "/tratamientos" }];
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">Tratamientos</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        {verifiedCatalog().length} protocolos publicados. Lo que aún no aprueba dirección médica no aparece en este índice.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p>Cargando el catálogo…</p>}>
          <TreatmentBrowser />
        </Suspense>
      </div>
    </main>
  );
}
