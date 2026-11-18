import { getTreatment } from "@/data";
import { discountPercent } from "@/data/offers";
import type { Offer } from "@/data/types";
import { cop } from "@/lib/format";
import Link from "next/link";
import { TreatmentMedia } from "./treatment-media";

export function isPublishedOffer(offer: Offer) {
  return getTreatment(offer.treatmentSlug)?.status === "VERIFIED";
}

export function OfferCard({ offer }: { offer: Offer }) {
  const treatment = getTreatment(offer.treatmentSlug);
  const percent = discountPercent(offer);
  return (
    <li className="promo-card">
      <Link href={`/tratamientos/${offer.treatmentSlug}`} className="promo-link">
        <TreatmentMedia name={offer.name} image={treatment?.image} />
        <div className="promo-copy">
          <h2 className="display promo-name">{offer.name}</h2>
          {percent ? <p className="promo-off">{percent}% de descuento</p> : null}
          <p className="promo-price">{cop(offer.priceNow)}</p>
          <p className="promo-fine">Sujeto a valoración y vigencia.</p>
        </div>
      </Link>
    </li>
  );
}
