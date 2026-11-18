import { discountPercent, offers } from "./offers";

/** Tratamientos de la oferta cuyo estado no es VERIFIED. No se venden en línea. */
const offline = new Set([
  "liporeductor",
  "shock-therapy-bronce",
  "detox-reductor",
  "rinomodelacion",
  "autosanguis",
  "dercelu",
]);

export type ShopProduct = {
  id: string;
  nombre: string;
  slug: string;
  imagen: string;
  precio: number;
  precioAntes: number | null;
  descuento: number | null;
  disponibleOnline: boolean;
  moneda: "COP";
};

export function shopProducts(): ShopProduct[] {
  return offers.map((offer) => {
    const disponibleOnline = !offline.has(offer.treatmentSlug);
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
      disponibleOnline,
      moneda: "COP",
    };
  });
}

export function shopProduct(slug: string) {
  return shopProducts().find((item) => item.slug === slug);
}
