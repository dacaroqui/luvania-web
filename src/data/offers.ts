import type { Offer } from "./types";

/**
 * Precios leídos de las pestañas de ofertas el 17 de noviembre de 2026.
 * Todas aplican en las cinco sedes (`sedes` omitido = todas).
 * Cómo cargar una promo de una sola sede: docs/promociones-por-sede.md
 */
export const PRICE_AS_OF = "2026-11-17";

export const offers: Offer[] = [
  {
    slug: "toxina-botulinica-tipo-a",
    name: "Toxina botulínica tipo A",
    treatmentSlug: "toxina-botulinica-tipo-a",
    priceBefore: 1614000,
    priceNow: 907000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "hidroxiapatita-de-calcio",
    name: "Hidroxiapatita de calcio",
    treatmentSlug: "hidroxiapatita-de-calcio",
    priceBefore: 2400000,
    priceNow: 1300000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "plasma-virtual",
    name: "Plasma virtual",
    treatmentSlug: "plasma-virtual",
    priceBefore: 200000,
    priceNow: 149900,
    labelOnOldSite: "-30%",
  },
  {
    slug: "dermapen",
    name: "Dermapen",
    treatmentSlug: "dermapen",
    priceBefore: 350000,
    priceNow: 199000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "liporeductor",
    name: "Liporeductor",
    treatmentSlug: "liporeductor",
    priceBefore: 390000,
    priceNow: 189000,
    labelOnOldSite: "-30%",
    note: "No tenía página propia.",
  },
  {
    slug: "shock-therapy-bronce",
    name: "Shock Therapy Bronce",
    treatmentSlug: "shock-therapy-bronce",
    priceBefore: 650000,
    priceNow: 450000,
    labelOnOldSite: "-30%",
    note: "Paquete sin ficha clínica.",
  },
  {
    slug: "detox-reductor",
    name: "Detox-Reductor",
    treatmentSlug: "detox-reductor",
    priceBefore: 380000,
    priceNow: 260000,
    labelOnOldSite: "-30%",
    note: "Puede solaparse con Detox Therapy.",
  },
  {
    slug: "aumento-labios",
    name: "Perfilamiento de labios",
    treatmentSlug: "aumento-y-o-perfilamiento-de-labios",
    priceBefore: 1990000,
    priceNow: 1150000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "aumento-pomulos",
    name: "Perfilamiento de pómulos",
    treatmentSlug: "aumento-y-o-perfilamiento-de-pomulos",
    priceBefore: 18140000,
    priceNow: 1049000,
    labelOnOldSite: "-30%",
    priceBeforeSuspicious: true,
    note: "El precio tachado (18.140.000) parece un error de digitación. No se muestra como descuento real hasta confirmarlo.",
  },
  {
    slug: "aumento-menton",
    name: "Perfilamiento de mentón",
    treatmentSlug: "aumento-y-o-perfilamiento-de-menton",
    priceBefore: 3000000,
    priceNow: 1600000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "rinomodelacion",
    name: "Rinomodelación",
    treatmentSlug: "rinomodelacion",
    priceBefore: 1990000,
    priceNow: 1150000,
    labelOnOldSite: "-30%",
    note: "La página pública daba 404.",
  },
  {
    slug: "autosanguis",
    name: "Autosanguis",
    treatmentSlug: "autosanguis",
    priceBefore: 200000,
    priceNow: 149000,
    labelOnOldSite: "-30%",
    note: "Sin página de origen.",
  },
  {
    slug: "eliminar-ojeras",
    name: "Ojeras",
    treatmentSlug: "eliminar-ojeras",
    priceBefore: 1990000,
    priceNow: 1150000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "hilos-tensores",
    name: "Hilos tensores",
    treatmentSlug: "hilos-tensores",
    priceBefore: 2200000,
    priceNow: 1500000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "levantamiento-de-gluteos",
    name: "Levantamiento de glúteos",
    treatmentSlug: "levantamiento-de-gluteos",
    priceBefore: 1940000,
    priceNow: 1210000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "dercelu",
    name: "Dercelu",
    treatmentSlug: "dercelu",
    priceBefore: 1900000,
    priceNow: 1069000,
    labelOnOldSite: "-30%",
    note: "Sin página de origen.",
  },
  {
    slug: "rejuvenecimiento-vaginal",
    name: "Rejuvenecimiento íntimo",
    treatmentSlug: "rejuvenecimiento-vaginal",
    priceBefore: 1350000,
    priceNow: 750000,
    labelOnOldSite: "-30%",
  },
  {
    slug: "perdida-de-cabello",
    name: "Pérdida de cabello",
    treatmentSlug: "hair-loss",
    priceBefore: 1000000,
    priceNow: 599000,
    labelOnOldSite: "-30%",
    note: "En el menú antiguo el tratamiento se llama Hair Loss.",
  },
];

export function offerForTreatment(slug: string) {
  return offers.find((offer) => offer.treatmentSlug === slug);
}

export function discountPercent(offer: Offer) {
  if (offer.priceBeforeSuspicious) return null;
  return Math.round((1 - offer.priceNow / offer.priceBefore) * 100);
}

export function offerScope(offer: Offer) {
  return offer.sedes ?? "todas";
}

export function offerMatchesSede(offer: Offer, sede: string | null) {
  if (!sede) return true;
  const scope = offerScope(offer);
  return scope === "todas" || scope.includes(sede);
}

export function offerExclusiveSedes(offer: Offer) {
  const scope = offerScope(offer);
  return scope === "todas" ? [] : scope;
}

export function offerIsExpired(offer: Offer, today = new Date()) {
  if (!offer.vigenteHasta) return false;
  const end = new Date(`${offer.vigenteHasta}T23:59:59-05:00`);
  return today.getTime() > end.getTime();
}

export function resolvedPrice(offer: Offer, sede?: string | null) {
  const override = sede ? offer.preciosPorSede?.find((row) => row.sede === sede) : undefined;
  return {
    priceNow: override?.priceNow ?? offer.priceNow,
    priceBefore: override?.priceBefore ?? offer.priceBefore,
    suspicious: Boolean(offer.priceBeforeSuspicious && !override),
  };
}
