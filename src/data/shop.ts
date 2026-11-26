import { offerExclusiveSedes, offerIsExpired, offerMatchesSede, offers, resolvedPrice } from "./offers";
import type { Offer } from "./types";
import { treatmentCardImage } from "./treatment-card-images";
import { purchaseTerms, type TipoPrecio } from "./purchase";

export type ShopProduct = {
  id: string;
  nombre: string;
  slug: string;
  imagen?: string;
  precio: number;
  precioAntes: number | null;
  descuento: number | null;
  disponibleOnline: boolean;
  requiereValoracion: boolean;
  tipoPrecio: TipoPrecio;
  moneda: "COP";
  vencida: boolean;
  soloEn: string[];
};

export function shopProductForOffer(offer: Offer, sede?: string | null): ShopProduct {
  const terms = purchaseTerms(offer.treatmentSlug);
  const money = resolvedPrice(offer, sede);
  const vencida = offerIsExpired(offer);
  const precioAntes = money.suspicious || money.priceBefore <= money.priceNow ? null : money.priceBefore;
  return {
    id: offer.treatmentSlug,
    nombre: offer.name,
    slug: offer.treatmentSlug,
    imagen: treatmentCardImage(offer.treatmentSlug),
    precio: money.priceNow,
    precioAntes,
    descuento: precioAntes ? Math.round((1 - money.priceNow / money.priceBefore) * 100) : null,
    disponibleOnline: terms.disponibleOnline && !vencida,
    requiereValoracion: terms.requiereValoracion,
    tipoPrecio: terms.tipoPrecio,
    moneda: "COP",
    vencida,
    soloEn: offerExclusiveSedes(offer),
  };
}

export function offersAtSede(sede: string | null) {
  const active = offers.filter((offer) => !offerIsExpired(offer) && offerMatchesSede(offer, sede));
  if (!sede) return active;
  const sorted = active.sort((a, b) => Number(offerExclusiveSedes(b).length > 0) - Number(offerExclusiveSedes(a).length > 0));
  return sorted.filter((offer, index) => sorted.findIndex((item) => item.treatmentSlug === offer.treatmentSlug) === index);
}

export function shopProducts(sede?: string | null): ShopProduct[] {
  return offersAtSede(sede ?? null).map((offer) => shopProductForOffer(offer, sede));
}

export function canPurchase(product: ShopProduct) {
  return product.disponibleOnline && !product.vencida;
}

export function shopProduct(slug: string, sede?: string | null) {
  return shopProducts(sede).find((item) => item.slug === slug);
}
