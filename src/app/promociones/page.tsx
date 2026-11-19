import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PromosBrowser } from "@/components/promos-browser";
import { clampMeta, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Promociones de tratamientos estéticos | Luvania",
  description:
    clampMeta("Ofertas de tratamientos en Luvania, con el precio de referencia y el precio actual. Sujetas a valoración y vigencia."),
  path: "/promociones",
});

export default function PromocionesPage() {
  const crumbs = [{ name: "Promociones", href: "/promociones" }];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">Promociones</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        Precios de referencia del 17 de noviembre de 2026. Elige la sede, agrega al carrito y cierra el pedido por WhatsApp.
      </p>
      <div className="mt-8">
        <PromosBrowser />
      </div>
      <BookButton className="mt-10 min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Agendar valoración
      </BookButton>
    </main>
  );
}
