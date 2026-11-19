import { CatalogBrowser } from "@/components/catalog-browser";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { FlorLuvania } from "@/components/flor-luvania";
import { JsonLd } from "@/components/json-ld";
import { commerceCatalog } from "@/data/commerce";
import { clampMeta, pageMeta } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = pageMeta({
  title: "Tratamientos estéticos en Bogotá | Luvania",
  description: clampMeta("Catálogo publicado de Luvania. Filtra por necesidad, zona o especialidad, o busca por nombre."),
  path: "/tratamientos",
});

export default function TratamientosPage() {
  const products = commerceCatalog();
  const crumbs = [{ name: "Tratamientos", href: "/tratamientos" }];

  return (
    <main className="catalog-page">
      <FlorLuvania className="catalog-flor catalog-flor-a" />
      <FlorLuvania className="catalog-flor catalog-flor-b" />
      <div className="catalog-wrap mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <JsonLd data={breadcrumbLd(crumbs)} />
        <Breadcrumbs items={crumbs} />
        <header className="catalog-heading">
          <h1 className="display catalog-title">Tratamientos</h1>
          <p className="catalog-lead">{products.length} protocolos publicados.</p>
        </header>
        <Suspense fallback={<p className="catalog-count">Cargando el catálogo…</p>}>
          <CatalogBrowser products={products} />
        </Suspense>
      </div>
    </main>
  );
}
