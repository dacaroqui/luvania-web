import { getTreatment } from "./index";
import { offerForTreatment } from "./offers";

export type TipoPrecio = "sesion" | "paquete" | "anticipo" | "desde_sujeto_valoracion" | null;

export type PurchaseTerms = {
  disponibleOnline: boolean;
  requiereValoracion: boolean;
  tipoPrecio: TipoPrecio;
};

/**
 * Las ofertas de tratamientos VERIFIED se venden por el carrito.
 * Un tratamiento que no esté VERIFIED no puede activarse ni con un override.
 * `overrides` sirve para apagar un slug puntual.
 */
const overrides: Record<string, Partial<PurchaseTerms>> = {};

const defaults: PurchaseTerms = {
  disponibleOnline: false,
  requiereValoracion: true,
  tipoPrecio: null,
};

export function purchaseTerms(slug: string): PurchaseTerms {
  const treatment = getTreatment(slug);
  const verifiedOffer = treatment?.status === "VERIFIED" && Boolean(offerForTreatment(slug));
  const terms: PurchaseTerms = {
    ...defaults,
    disponibleOnline: verifiedOffer,
    ...overrides[slug],
  };
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
