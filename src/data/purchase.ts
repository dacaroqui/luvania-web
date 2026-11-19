import { getTreatment } from "./index";

export type TipoPrecio = "sesion" | "paquete" | "anticipo" | "desde_sujeto_valoracion" | null;

export type PurchaseTerms = {
  disponibleOnline: boolean;
  requiereValoracion: boolean;
  tipoPrecio: TipoPrecio;
};

/**
 * Nada se vende en línea hasta que el cliente lo defina aquí, por slug.
 * Un tratamiento que no esté VERIFIED no puede activarse ni con un override.
 */
const overrides: Record<string, Partial<PurchaseTerms>> = {};

const defaults: PurchaseTerms = {
  disponibleOnline: false,
  requiereValoracion: true,
  tipoPrecio: null,
};

export function purchaseTerms(slug: string): PurchaseTerms {
  const terms: PurchaseTerms = { ...defaults, ...overrides[slug] };
  const treatment = getTreatment(slug);
  if (!treatment || treatment.status !== "VERIFIED") terms.disponibleOnline = false;
  return terms;
}

export function priceCaption(tipo: TipoPrecio) {
  if (tipo === "sesion") return "Precio por sesión";
  if (tipo === "paquete") return "Precio del paquete";
  if (tipo === "anticipo") return "Anticipo";
  if (tipo === "desde_sujeto_valoracion") return "Desde, sujeto a valoración";
  return null;
}
