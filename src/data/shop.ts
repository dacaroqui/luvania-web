import { discountPercent, offers } from "./offers";
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
};

export function shopProducts(): ShopProduct[] {
  return offers.map((offer) => {
    const terms = purchaseTerms(offer.treatmentSlug);
    const precioAntes =
      offer.priceBeforeSuspicious || offer.priceBefore <= offer.priceNow ? null : offer.priceBefore;
    return {
      id: offer.treatmentSlug,
      nombre: offer.name,
      slug: offer.treatmentSlug,
      /* provisional: stock. Fotos de Pexels hasta la sesión de marca. */
      imagen: `/tratamientos/${offer.treatmentSlug}.webp`,
      precio: offer.priceNow,
      precioAntes,
      descuento: precioAntes ? discountPercent(offer) : null,
      disponibleOnline: terms.disponibleOnline,
      requiereValoracion: terms.requiereValoracion,
      tipoPrecio: terms.tipoPrecio,
      moneda: "COP",
    };
  });
}

export function canPurchase(product: ShopProduct, demo: boolean) {
  return product.disponibleOnline || demo;
}

export function shopProduct(slug: string) {
  return shopProducts().find((item) => item.slug === slug);
}
