"use client";

import { offersAtSede } from "@/data/shop";
import { sedes } from "@/data/sedes";
import { useState } from "react";
import { OfferCard } from "./offer-card";

export function PromosBrowser({ initialSede }: { initialSede?: string }) {
  const [sede, setSede] = useState<string | null>(sedes.find((item) => item.slug === initialSede)?.slug ?? null);
  const visible = offersAtSede(sede);

  return (
    <div>
      <div className="promo-sedes" role="group" aria-label="Filtrar por sede">
        <button type="button" className={sede ? "facet-pill" : "facet-pill is-on"} aria-pressed={!sede} onClick={() => setSede(null)}>
          Todas
        </button>
        {sedes.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={sede === item.slug ? "facet-pill is-on" : "facet-pill"}
            aria-pressed={sede === item.slug}
            onClick={() => setSede(item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-6 text-mute">No hay promociones vigentes para esta sede.</p> : null}
      <ul className="shop-grid mt-6">
        {visible.map((offer) => (
          <OfferCard key={offer.slug} offer={offer} sede={sede} />
        ))}
      </ul>
    </div>
  );
}
