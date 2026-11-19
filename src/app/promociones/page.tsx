import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { OfferCard } from "@/components/offer-card";
import { offers } from "@/data/offers";
import { shopProduct } from "@/data/shop";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Promociones de tratamientos estéticos | Luvania",
  description:
    "Ofertas de tratamientos en Luvania, con el precio de referencia y el precio actual. Sujetas a valoración y vigencia.",
  path: "/promociones",
});

export default function PromocionesPage() {
  const crumbs = [{ name: "Promociones", href: "/promociones" }];
  const ordered = [...offers].sort((a, b) => {
    const left = shopProduct(a.treatmentSlug)?.disponibleOnline ? 0 : 1;
    const right = shopProduct(b.treatmentSlug)?.disponibleOnline ? 0 : 1;
    return left - right;
  });
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">Promociones</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        Precios de referencia del 17 de noviembre de 2026. Sujetos a valoración y vigencia. La compra en línea se abre cuando cada protocolo quede habilitado.
      </p>
      <ul className="shop-grid mt-8">
        {ordered.map((offer) => (
          <OfferCard key={offer.slug} offer={offer} />
        ))}
      </ul>
      <BookButton className="mt-10 min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Agendar valoración
      </BookButton>
    </main>
  );
}
