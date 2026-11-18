import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { TreatmentBrowser, type BrowserItem } from "@/components/treatment-browser";
import { treatments } from "@/data";
import { discountPercent, offerForTreatment } from "@/data/offers";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = pageMeta({
  title: "Tratamientos estéticos en Bogotá | Luvania",
  description:
    "Catálogo de tratamientos faciales, corporales y capilares de Luvania. Filtra por especialidad, zona del cuerpo o necesidad.",
  path: "/tratamientos",
});

const items: BrowserItem[] = treatments.map((treatment) => {
  const offer = offerForTreatment(treatment.slug);
  return {
    slug: treatment.slug,
    name: treatment.name,
    summary: treatment.summary,
    especialidad: treatment.especialidad,
    zones: treatment.zones,
    needs: treatment.needs,
    placeholder: treatment.placeholder,
    discount: offer ? discountPercent(offer) : null,
  };
});

export default function TratamientosPage() {
  const crumbs = [{ name: "Tratamientos", href: "/tratamientos" }];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">Tratamientos</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        {treatments.length} fichas. Las del inventario público están todas, menos la página vacía llamada «x».
        Lo que hubo que inferir lleva la marca de contenido por confirmar.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p>Cargando filtros…</p>}>
          <TreatmentBrowser items={items} />
        </Suspense>
      </div>
    </main>
  );
}
