import { offerExclusiveSedes, offerIsExpired, offers, resolvedPrice } from "./offers";
import { purchaseTerms, type TipoPrecio } from "./purchase";

export type ShopProduct = {
  id: string;
  nombre: string;
  slug: string;
  imagen: string;
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

export function shopProducts(sede?: string | null): ShopProduct[] {
  return offers.map((offer) => {
    const terms = purchaseTerms(offer.treatmentSlug);
    const money = resolvedPrice(offer, sede);
    const vencida = offerIsExpired(offer);
    const precioAntes = money.suspicious || money.priceBefore <= money.priceNow ? null : money.priceBefore;
    return {
      id: offer.treatmentSlug,
      nombre: offer.name,
      slug: offer.treatmentSlug,
      /* provisional: stock. Fotos de Pexels hasta la sesión de marca. */
      imagen: `/tratamientos/${offer.treatmentSlug}.webp`,
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
  });
}

export function canPurchase(product: ShopProduct) {
  return product.disponibleOnline && !product.vencida;
}

export function shopProduct(slug: string, sede?: string | null) {
  return shopProducts(sede).find((item) => item.slug === slug);
}
