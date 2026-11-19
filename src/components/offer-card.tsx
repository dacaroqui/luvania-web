import { getTreatment } from "@/data";
import { shopProduct } from "@/data/shop";
import type { Offer } from "@/data/types";
import { publicText } from "@/lib/public-copy";
import { ShopCard } from "./shop-card";

export function isPublishedOffer(offer: Offer) {
  return getTreatment(offer.treatmentSlug)?.status === "VERIFIED";
}

function sessionLabel(value: string | undefined) {
  const text = publicText(value);
  const match = text.match(/\b(\d+)\s+sesiones\b/i);
  if (!match) return null;
  return Number(match[1]) === 1 ? "1 sesión" : `${match[1]} sesiones`;
}

export function OfferCard({ offer, sede }: { offer: Offer; sede?: string | null }) {
  const product = shopProduct(offer.treatmentSlug, sede);
  if (!product) return null;
  const sesiones = sessionLabel(getTreatment(offer.treatmentSlug)?.sesiones);
  return <ShopCard product={product} sesiones={sesiones} sedeHint={sede} />;
}
