import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { DiscountBadge } from "@/components/discount-badge";
import { JsonLd } from "@/components/json-ld";
import { PRICE_AS_OF, discountPercent, offers } from "@/data/offers";
import { cop } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Promociones de tratamientos estéticos | Luvania",
  description:
    "Ofertas de Luvania con precio anterior, precio actual y el descuento real. Vigencia por confirmar con la red.",
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
        Precios publicados en luvania.com el {PRICE_AS_OF}. El porcentaje es la diferencia entre esas dos cifras.
        Sujeto a valoración y vigencia.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {offers.map((offer) => {
          const percent = discountPercent(offer);
          return (
            <li key={offer.slug} className="flex gap-4 rounded-3xl bg-white p-5">
              {percent ? <DiscountBadge percent={percent} /> : <span className="text-sm font-bold">Revisar precio</span>}
              <div>
                <h2 className="display text-3xl">
                  <Link href={`/tratamientos/${offer.treatmentSlug}`}>{offer.name}</Link>
                </h2>
                <p className="mt-2 text-sm">
                  <span className="line-through">{cop(offer.priceBefore)}</span>{" "}
                  <strong>{cop(offer.priceNow)}</strong>
                </p>
                <p className="mt-2 text-sm text-mute">
                  Rótulo anterior: {offer.labelOnOldSite}.
                  {offer.priceBeforeSuspicious
                    ? " El precio tachado parece un error de digitación y no se convierte en un -94%."
                    : null}{" "}
                  {offer.note}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <BookButton className="mt-10 min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Agendar valoración
      </BookButton>
    </main>
  );
}
