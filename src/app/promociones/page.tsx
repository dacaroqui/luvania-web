import { BookButton } from "@/components/book-button";
import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { DiscountBadge } from "@/components/discount-badge";
import { JsonLd } from "@/components/json-ld";
import { discountPercent, offers } from "@/data/offers";
import { cop } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Promociones de tratamientos estéticos | Luvania",
  description:
    "Ofertas de tratamientos en Luvania, con el precio de referencia y el precio actual. Sujetas a valoración y vigencia.",
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
        Precios de referencia. Sujetos a valoración y vigencia.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {offers.map((offer) => {
          const percent = offer.priceBeforeSuspicious ? null : discountPercent(offer);
          return (
            <li key={offer.slug} className="flex gap-4 rounded-3xl bg-white p-5">
              {percent ? <DiscountBadge percent={percent} /> : null}
              <div>
                <h2 className="display text-3xl">
                  <Link href={`/tratamientos/${offer.treatmentSlug}`}>{offer.name}</Link>
                </h2>
                <p className="mt-2 text-sm">
                  {percent ? <span className="line-through">{cop(offer.priceBefore)}</span> : null}{" "}
                  <strong>{cop(offer.priceNow)}</strong>
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
